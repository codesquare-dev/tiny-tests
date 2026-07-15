import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import path from "node:path";
import worldCountries from "world-countries";

// ---------------------------------------------------------------------------
// Sources (see .superpowers/sdd/task-2-report.md for full source/license notes):
// - World Bank PIP (Poverty and Inequality Platform) percentiles, 2021 PPP round.
//   CC0 (public domain). Per-country, per-year, 100 percentile bins of daily
//   per-capita welfare (income or consumption) in 2021 international dollars.
// - World Bank country metadata (name) + PA.NUS.PPP indicator (PPP conversion
//   factor, LCU per international $). World Bank Open Data license (CC-BY 4.0).
// - world-countries npm package (ODbL-1.0) used ONLY to look up each country's
//   primary ISO 4217 currency code — a single-field, insubstantial extraction.
// ---------------------------------------------------------------------------

const CACHE_DIR = path.join(import.meta.dirname, ".cache");

const PIP_PERCENTILES_URL =
  "https://datacatalogfiles.worldbank.org/ddh-published/0063646/DR0090357/world_100bin_revised.csv";
const WB_COUNTRIES_URL =
  "https://api.worldbank.org/v2/country?format=json&per_page=400";
const WB_PPP_FACTOR_URL =
  "https://api.worldbank.org/v2/country/all/indicator/PA.NUS.PPP?format=json&per_page=400&mrv=1";

const OUTPUT_YEAR = 2021; // matches the fixed "2021 international dollars" unit basis

type Row = { iso3: string; name: string; currency: string; pppFactor: number; percentiles: number[] };

async function fetchWithCache(url: string, cacheFile: string): Promise<string> {
  const cachePath = path.join(CACHE_DIR, cacheFile);
  if (existsSync(cachePath)) {
    return readFileSync(cachePath, "utf-8");
  }
  mkdirSync(CACHE_DIR, { recursive: true });
  console.log(`fetching ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch failed for ${url}: ${res.status}`);
  const text = await res.text();
  writeFileSync(cachePath, text);
  return text;
}

type PipBin = { countryCode: string; year: number; welfareType: string; percentile: number; quantile: number; pop: number };

function parsePipCsv(csvText: string): PipBin[] {
  const lines = csvText.split(/\r?\n/); // source file uses CRLF line endings
  const header = lines[0].split(",");
  const idx = (col: string) => header.indexOf(col);
  const iCountry = idx("country_code");
  const iYear = idx("year");
  const iLevel = idx("reporting_level");
  const iWelfare = idx("welfare_type");
  const iPercentile = idx("percentile");
  const iQuantile = idx("quantile");
  const iPop = idx("pop");

  const bins: PipBin[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const cols = line.split(",");
    if (cols[iLevel] !== "national") continue;
    const percentile = Number(cols[iPercentile]);
    if (percentile < 1 || percentile > 99) continue; // drop the open-ended top bin (100) and any 0-bin
    bins.push({
      countryCode: cols[iCountry],
      year: Number(cols[iYear]),
      welfareType: cols[iWelfare],
      percentile,
      quantile: Number(cols[iQuantile]),
      pop: Number(cols[iPop]),
    });
  }
  return bins;
}

// For each country, pick the most recent year; prefer welfare_type "income" over
// "consumption" when both exist for that year (income is closer to the "annual
// income" framing in the output schema; consumption is used as a fallback for
// countries where PIP only has consumption surveys).
function selectLatestPerCountry(bins: PipBin[]): Map<string, PipBin[]> {
  const byCountry = new Map<string, PipBin[]>();
  for (const bin of bins) {
    const list = byCountry.get(bin.countryCode) ?? [];
    list.push(bin);
    byCountry.set(bin.countryCode, list);
  }

  const selected = new Map<string, PipBin[]>();
  for (const [countryCode, list] of byCountry) {
    const maxYear = Math.max(...list.map((b) => b.year));
    const atMaxYear = list.filter((b) => b.year === maxYear);
    const welfareType = atMaxYear.some((b) => b.welfareType === "income") ? "income" : "consumption";
    const chosen = atMaxYear
      .filter((b) => b.welfareType === welfareType)
      .sort((a, b) => a.percentile - b.percentile);
    if (chosen.length === 99) selected.set(countryCode, chosen);
  }
  return selected;
}

const DAYS_PER_YEAR = 365;

function toAnnualPercentiles(bins: PipBin[]): number[] {
  return bins.map((b) => Math.round(b.quantile * DAYS_PER_YEAR * 100) / 100);
}

// Global distribution: pool every country's 99 percentile bins, each bin
// weighted by (country population / 100) since it represents 1% of that
// country's population. Sort by welfare value and read off the population-
// weighted percentile cutoffs. This mirrors the standard "pooled" approach to
// estimating a global income distribution from national percentile data.
function computeGlobalPercentiles(selected: Map<string, PipBin[]>): number[] {
  const points: { value: number; weight: number }[] = [];
  for (const bins of selected.values()) {
    for (const b of bins) {
      points.push({ value: b.quantile * DAYS_PER_YEAR, weight: b.pop / 100 });
    }
  }
  points.sort((a, b) => a.value - b.value);

  const totalWeight = points.reduce((sum, p) => sum + p.weight, 0);
  const targets = Array.from({ length: 99 }, (_, i) => ((i + 1) / 100) * totalWeight);

  const result: number[] = [];
  let cumulative = 0;
  let ti = 0;
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const next = points[i + 1];
    const prevCumulative = cumulative;
    cumulative += p.weight;
    while (ti < targets.length && targets[ti] <= cumulative) {
      // linear interpolation between this point's value and the next point's
      // value, positioned by where the target cumulative weight falls within
      // this point's weight span.
      const t = p.weight === 0 ? 0 : (targets[ti] - prevCumulative) / p.weight;
      const value = next ? p.value + t * (next.value - p.value) : p.value;
      result.push(value);
      ti++;
    }
  }
  while (result.length < 99) result.push(points[points.length - 1].value);
  return result.map((v) => Math.round(v * 100) / 100);
}

async function parseSource(): Promise<{ year: number; global: number[]; countries: Row[] }> {
  const [pipCsv, wbCountriesJson, wbPppJson] = await Promise.all([
    fetchWithCache(PIP_PERCENTILES_URL, "pip-percentiles-2021ppp.csv"),
    fetchWithCache(WB_COUNTRIES_URL, "wb-countries.json"),
    fetchWithCache(WB_PPP_FACTOR_URL, "wb-ppp-factors.json"),
  ]);

  const bins = parsePipCsv(pipCsv);
  const selected = selectLatestPerCountry(bins);
  const global = computeGlobalPercentiles(selected);

  const wbCountries: [unknown, { id: string; name: string; region: { value: string } }[]] = JSON.parse(wbCountriesJson);
  const nameByIso3 = new Map<string, string>();
  for (const c of wbCountries[1]) {
    if (c.region.value === "Aggregates") continue; // drop region/income-group aggregates
    nameByIso3.set(c.id, c.name);
  }

  const wbPpp: [unknown, { countryiso3code: string; value: number | null }[]] = JSON.parse(wbPppJson);
  const pppByIso3 = new Map<string, number>();
  for (const row of wbPpp[1]) {
    if (row.value != null && row.value > 0) pppByIso3.set(row.countryiso3code, row.value);
  }

  const currencyByIso3 = new Map<string, string>();
  for (const c of worldCountries) {
    const codes = Object.keys(c.currencies ?? {});
    if (codes.length > 0) currencyByIso3.set(c.cca3, codes[0]);
  }

  const countries: Row[] = [];
  for (const [iso3, bins99] of selected) {
    const name = nameByIso3.get(iso3);
    const pppFactor = pppByIso3.get(iso3);
    const currency = currencyByIso3.get(iso3);
    if (!name || !pppFactor || pppFactor <= 0 || !currency) continue; // incomplete -> omit country
    countries.push({ iso3, name, currency, pppFactor, percentiles: toAnnualPercentiles(bins99) });
  }
  countries.sort((a, b) => a.iso3.localeCompare(b.iso3));

  return { year: OUTPUT_YEAR, global, countries };
}

async function main() {
  const { year, global, countries } = await parseSource();
  if (global.length !== 99) throw new Error(`global percentiles length ${global.length} !== 99`);
  for (const c of countries) {
    if (c.percentiles.length !== 99) throw new Error(`${c.iso3} percentiles length !== 99`);
    if (c.pppFactor <= 0) throw new Error(`${c.iso3} invalid pppFactor`);
  }
  mkdirSync("data", { recursive: true });
  writeFileSync("data/global.json", JSON.stringify({ year, percentiles: global }));
  writeFileSync(
    "data/countries.json",
    JSON.stringify(countries.map(({ iso3, ...rest }) => ({ code: iso3, ...rest }))),
  );
  console.log(`wrote data for ${countries.length} countries, year ${year}`);
  console.log(`global p50=${global[49]}, global p99=${global[98]}`);
  const usa = countries.find((c) => c.iso3 === "USA");
  if (usa) console.log(`USA p50=${usa.percentiles[49]}, USA p99=${usa.percentiles[98]}`);
}

main();
