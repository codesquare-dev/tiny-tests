"use client";
import Link from "next/link";
import countries from "../../data/countries.json";
import global from "../../data/global.json";
import { formatMultiple, median, rarityOutOf100 } from "@/lib/percentile";
import { SITE_URL } from "@/lib/site";
import type { CountryData, GlobalData } from "@/lib/types";
import { ComparisonBars } from "./ComparisonBars";
import { CountUp } from "./CountUp";
import { DistributionChart } from "./DistributionChart";
import type { Verdict } from "./IncomeForm";
import { NextTests } from "./NextTests";
import { PercentileTargets } from "./PercentileTargets";

const countryList = countries as CountryData[];
const globalData = global as GlobalData;

const TOP_OF_SCALE = 99;

function PeopleLine({ percentile }: { percentile: number }) {
  const { side, outOf100 } = rarityOutOf100(percentile);
  const verb = side === "above" ? "earn more than you" : "earn less than you";
  return (
    <p className="text-ink-muted tabular-nums">
      About {outOf100} in 100 people worldwide {verb}
      {percentile === TOP_OF_SCALE
        ? " — the top 1% is where this scale stops."
        : "."}
    </p>
  );
}

export function ResultCard({ verdict }: { verdict: Verdict }) {
  const shareUrl = `${SITE_URL}/income-percentile/r/${verdict.globalPercentile}/`;
  const country = countryList.find((c) => c.code === verdict.countryCode)!;

  const vsCountryMedian = verdict.intlIncome / median(country.percentiles);
  const vsWorldMedian = verdict.intlIncome / median(globalData.percentiles);

  return (
    <section
      aria-label="result"
      className="mt-8 flex flex-col gap-3 rounded-sm border border-rule bg-paper-raised p-6"
    >
      <p className="font-display text-3xl leading-tight tracking-tight">
        You earn more than{" "}
        <span className="text-accent tabular-nums">
          <CountUp value={verdict.globalPercentile} />%
        </span>{" "}
        of the world
      </p>
      <p className="text-lg tabular-nums">
        Top {100 - verdict.countryPercentile}% in {verdict.countryName}
      </p>
      <PeopleLine percentile={verdict.globalPercentile} />

      <DistributionChart
        globalThresholds={globalData.percentiles}
        countryThresholds={country.percentiles}
        countryName={verdict.countryName}
        intlIncome={verdict.intlIncome}
        globalPercentile={verdict.globalPercentile}
        countryPercentile={verdict.countryPercentile}
      />

      <ComparisonBars
        countryName={verdict.countryName}
        globalPercentile={verdict.globalPercentile}
        countryPercentile={verdict.countryPercentile}
      />

      <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-rule bg-rule">
        <div className="bg-paper-raised px-4 py-3">
          <dt className="label">vs {verdict.countryName} median</dt>
          <dd className="mt-1 font-display text-2xl tabular-nums">
            {formatMultiple(vsCountryMedian)}
          </dd>
        </div>
        <div className="bg-paper-raised px-4 py-3">
          <dt className="label">vs world median</dt>
          <dd className="mt-1 font-display text-2xl tabular-nums">
            {formatMultiple(vsWorldMedian)}
          </dd>
        </div>
      </dl>

      <PercentileTargets
        globalPercentile={verdict.globalPercentile}
        globalThresholds={globalData.percentiles}
        pppFactor={country.pppFactor}
        currency={country.currency}
        householdSize={verdict.householdSize}
        rawIncome={verdict.rawIncome}
      />

      <div className="flex gap-3 pt-2">
        <a
          className="rounded-sm border border-rule-strong px-4 py-2 text-sm font-medium hover:border-ink"
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`I earn more than ${verdict.globalPercentile}% of the world 🌍 Where do you stand?`)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Share on X
        </a>
        <button
          type="button"
          className="rounded-sm border border-rule-strong px-4 py-2 text-sm font-medium hover:border-ink"
          onClick={() => navigator.clipboard.writeText(shareUrl)}
        >
          Copy link
        </button>
      </div>
      <p className="label mt-1">
        Source: World Bank PIP (2021 PPP) —{" "}
        <Link href="/methodology/" className="underline hover:text-accent">
          Methodology
        </Link>
      </p>
      <NextTests excludeHref="/income-percentile/" />
    </section>
  );
}
