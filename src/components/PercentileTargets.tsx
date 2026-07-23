import { formatMultiple, fromIntlDollars, incomeForPercentile } from "@/lib/percentile";

type Target = { percentile: number; label: string };

const TARGETS: Target[] = [
  { percentile: 90, label: "Top 10%" },
  { percentile: 95, label: "Top 5%" },
  { percentile: 99, label: "Top 1%" },
];

type Props = {
  globalPercentile: number;
  globalThresholds: number[];
  pppFactor: number;
  currency: string;
  householdSize: number;
  rawIncome: number;
};

/** Required household income (local currency) to clear a global percentile target. */
function requiredHouseholdIncome(
  targetPercentile: number,
  globalThresholds: number[],
  pppFactor: number,
  householdSize: number,
): number {
  const targetIntlPerCapita = incomeForPercentile(targetPercentile, globalThresholds);
  return fromIntlDollars(targetIntlPerCapita, pppFactor) * householdSize;
}

export function PercentileTargets({
  globalPercentile,
  globalThresholds,
  pppFactor,
  currency,
  householdSize,
  rawIncome,
}: Props) {
  return (
    <div className="mt-6">
      <p className="label">How much more to reach the top —</p>
      <dl className="mt-3 flex flex-col gap-2.5">
        {TARGETS.map(({ percentile, label }) => {
          const alreadyThere = globalPercentile >= percentile;
          const needed = alreadyThere
            ? null
            : requiredHouseholdIncome(percentile, globalThresholds, pppFactor, householdSize);
          return (
            <div key={percentile} className="flex items-center justify-between gap-3 text-sm">
              <dt>{label} worldwide</dt>
              <dd className="tabular-nums">
                {alreadyThere ? (
                  <span className="text-accent">✓ Already there</span>
                ) : (
                  <>
                    {Math.round(needed!).toLocaleString("en-US")} {currency}{" "}
                    <span className="text-ink-muted">
                      ({formatMultiple(needed! / rawIncome)})
                    </span>
                  </>
                )}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
