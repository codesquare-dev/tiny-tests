"use client";
import { useCountUp } from "./CountUp";

function Bar({ label, percentile }: { label: string; percentile: number }) {
  const shown = useCountUp(percentile);
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 truncate text-sm sm:w-36" title={label}>
        {label}
      </span>
      {/* Meter track: a lighter step of the fill's own ramp. */}
      <span className="h-2.5 flex-1 rounded-sm bg-accent/12">
        <span
          className="block h-full rounded-r-[4px] bg-accent"
          style={{ width: `${Math.max(shown, 0.5)}%` }}
        />
      </span>
      <span className="w-12 shrink-0 text-right text-sm tabular-nums">
        {Math.round(shown)}%
      </span>
    </div>
  );
}

export function ComparisonBars({
  countryName,
  globalPercentile,
  countryPercentile,
}: {
  countryName: string;
  globalPercentile: number;
  countryPercentile: number;
}) {
  return (
    <div className="mt-6">
      <p className="label">You earn more than</p>
      <div
        className="mt-3 flex flex-col gap-2.5"
        role="img"
        aria-label={`You earn more than ${globalPercentile}% of the world and ${countryPercentile}% of people in ${countryName}.`}
      >
        <Bar label="Global" percentile={globalPercentile} />
        <Bar label={countryName} percentile={countryPercentile} />
      </div>
    </div>
  );
}
