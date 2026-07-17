/**
 * Reaction-time percentile — a log-normal approximation.
 *
 * We have no dataset of our own. Instead we approximate the population
 * distribution of simple visual reaction times with a log-normal curve, which
 * is the shape reaction times are conventionally modelled with: bounded below
 * by nerve conduction and motor delay, with a long tail of slow trials.
 *
 * Anchor: Human Benchmark publishes a median of 273 ms across its (very large,
 * self-selected) sample of reaction-time tests.
 * Source: https://humanbenchmark.com/tests/reactiontime/statistics
 *
 * The median fixes the curve's centre: mu = ln(273).
 *
 * Human Benchmark publishes no standard deviation, so sigma is fitted to two
 * landmarks that the same page's histogram makes legible — roughly 200 ms sits
 * near the top decile, and roughly 350 ms near the bottom quartile. A single
 * sigma cannot hit both exactly (the real distribution is more skewed than a
 * pure log-normal), so 0.30 is the compromise that lands within a few points of
 * each: 200 ms → ~85th percentile, 350 ms → ~20th.
 *
 * This makes the percentile an informed estimate, not a measurement. See
 * /methodology.
 */
export const MEDIAN_MS = 273;
const MU = Math.log(MEDIAN_MS);
const SIGMA = 0.3;

const MIN_PERCENTILE = 1;
const MAX_PERCENTILE = 99;

/**
 * Standard normal CDF via the Abramowitz & Stegun 7.1.26 erf approximation
 * (max absolute error 1.5e-7) — enough for a figure we round to whole percent.
 */
function normalCdf(z: number): number {
  const sign = 0 <= z ? 1 : -1;
  const x = Math.abs(z) / Math.SQRT2;

  const t = 1 / (1 + 0.3275911 * x);
  const poly =
    t *
    (0.254829592 +
      t *
        (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  const erf = 1 - poly * Math.exp(-x * x);

  return 0.5 * (1 + sign * erf);
}

/**
 * "Faster than X% of people" for an average reaction time in milliseconds —
 * the share of the approximated distribution that is slower than `avgMs`.
 * Clamped to 1..99: the tails are approximation, not evidence that literally
 * nobody is faster or slower.
 */
export function percentileFromMs(avgMs: number): number {
  if (0 >= avgMs) return MAX_PERCENTILE;

  const z = (Math.log(avgMs) - MU) / SIGMA;
  const shareSlower = 1 - normalCdf(z);
  const percentile = Math.round(shareSlower * 100);

  return Math.min(MAX_PERCENTILE, Math.max(MIN_PERCENTILE, percentile));
}

/** "273 ms" — whole milliseconds; sub-millisecond precision is noise here. */
export function formatMs(ms: number): string {
  return `${Math.round(ms)} ms`;
}
