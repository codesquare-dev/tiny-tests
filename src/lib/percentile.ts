export function toIntlDollars(amount: number, pppFactor: number): number {
  return amount / pppFactor;
}

/** Inverse of {@link toIntlDollars} — converts international dollars back to local currency. */
export function fromIntlDollars(intlAmount: number, pppFactor: number): number {
  return intlAmount * pppFactor;
}

/**
 * Converts household income to per-capita income, matching the World Bank
 * PIP per-capita income distribution used for the percentile thresholds.
 */
export function perCapita(income: number, householdSize: number): number {
  return income / householdSize;
}

export function lookupPercentile(intlIncome: number, thresholds: number[]): number {
  let percentile = 1;
  thresholds.forEach((threshold, i) => {
    if (intlIncome >= threshold) percentile = Math.min(i + 1, 99);
  });
  return percentile;
}

/**
 * Inverse of {@link lookupPercentile} — the income threshold for a target percentile.
 * Out-of-range targets clamp to 1..99, so round-tripping a clamped input through
 * lookupPercentile does not return the original (out-of-range) value.
 */
export function incomeForPercentile(targetPercentile: number, thresholds: number[]): number {
  const clamped = Math.min(99, Math.max(1, targetPercentile));
  return thresholds[clamped - 1];
}

const THRESHOLD_COUNT = 99;

/** The p50 threshold — the median of a 99-length percentile threshold array. */
export function median(thresholds: number[]): number {
  if (thresholds.length !== THRESHOLD_COUNT) {
    throw new Error(`expected ${THRESHOLD_COUNT} thresholds, got ${thresholds.length}`);
  }
  return thresholds[49];
}

/** "2.1×" — one decimal, for "N× the median income in X" copy. */
export function formatMultiple(value: number): string {
  if (value < 0.05) return "<0.1×";
  return `${value.toFixed(1)}×`;
}

/**
 * A percentile window centered on `centerPercentile`, clamped into 1..99.
 * Near an edge the whole window shifts inward instead of shrinking, so the
 * width stays constant (2 * halfWidth) regardless of where the center falls.
 * Used to "zoom" the distribution chart to the range near a user's position.
 */
export function zoomWindow(
  centerPercentile: number,
  halfWidth = 17,
): { from: number; to: number } {
  const center = Math.min(99, Math.max(1, centerPercentile));
  let from = center - halfWidth;
  let to = center + halfWidth;
  if (from < 1) {
    to += 1 - from;
    from = 1;
  }
  if (to > 99) {
    from -= to - 99;
    to = 99;
  }
  return { from: Math.max(1, from), to: Math.min(99, to) };
}

export type Rarity = { side: "above" | "below"; outOf100: number };

/**
 * Picks the honest side of the "n in 100 people" framing.
 *
 * Reporting the larger side saturates at the extremes: at p99, "8.0 billion
 * people earn less than you" is indistinguishable from the whole world (8.1bn)
 * and reads as though nobody out-earns the user. Reporting the *smaller* side
 * never saturates — at p99 it becomes "1 in 100 people earn more than you",
 * which is both accurate and legible.
 */
export function rarityOutOf100(percentile: number): Rarity {
  const above = 100 - percentile;
  return above <= percentile
    ? { side: "above", outOf100: above }
    : { side: "below", outOf100: percentile };
}
