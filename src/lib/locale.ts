import { ISO2_TO_ISO3 } from "./iso2-to-iso3";

const FALLBACK_COUNTRY = "USA";

/**
 * Extracts the BCP47 region subtag (ISO 3166-1 alpha-2) from a locale tag,
 * if present. Handles both "-" and "_" separators and skips script subtags
 * (e.g. "Hans" in "zh-Hans-CN", always 4 letters, never matches).
 */
function extractRegion(locale: string): string | undefined {
  const subtags = locale.split(/[-_]/);
  const region = subtags.slice(1).find((subtag) => /^[A-Za-z]{2}$/.test(subtag));
  return region?.toUpperCase();
}

/**
 * Detects the user's country from browser locale tags, restricted to
 * countries present in countries.json (validCodes). Tries each locale in
 * order and returns the first ISO3 code present in validCodes; falls back
 * to "USA" when no locale yields a supported country.
 */
export function detectCountry(
  locales: readonly string[],
  validCodes: ReadonlySet<string>,
): string {
  for (const locale of locales) {
    const region = extractRegion(locale);
    if (!region) continue;
    const iso3 = ISO2_TO_ISO3[region];
    if (iso3 && validCodes.has(iso3)) return iso3;
  }
  return FALLBACK_COUNTRY;
}
