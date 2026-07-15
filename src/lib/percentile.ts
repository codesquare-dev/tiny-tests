export function toIntlDollars(amount: number, pppFactor: number): number {
  return amount / pppFactor;
}

export function equivalise(income: number, householdSize: number): number {
  return income / Math.sqrt(householdSize);
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
