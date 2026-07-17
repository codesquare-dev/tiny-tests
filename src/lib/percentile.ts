export function toIntlDollars(amount: number, pppFactor: number): number {
  return amount / pppFactor;
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

export function peopleBelow(percentile: number, worldPopulation = 8_100_000_000): number {
  return Math.round(worldPopulation * (percentile / 100));
}
