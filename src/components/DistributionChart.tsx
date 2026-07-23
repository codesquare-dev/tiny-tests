"use client";
import { useEffect, useRef, useState } from "react";
import countries from "../../data/countries.json";
import { zoomWindowCovering } from "@/lib/percentile";
import type { CountryData } from "@/lib/types";

const countryList = countries as CountryData[];

type Props = {
  globalThresholds: number[];
  countryThresholds: number[];
  countryName: string;
  countryCode: string;
  intlIncome: number;
  globalPercentile: number;
  countryPercentile: number;
};

/**
 * Measures the rendered width so the SVG can be drawn 1:1 in CSS pixels.
 * A fixed viewBox scaled to fit would shrink 11px axis labels to ~6px at 390px.
 */
function useMeasuredWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return [ref, width] as const;
}

function moneyTick(value: number): string {
  return value >= 1000 ? `$${value / 1000}K` : `$${value}`;
}

/** Powers of ten inside the domain — minimal ticks, FT register. */
function logTicks(min: number, max: number): number[] {
  const ticks: number[] = [];
  for (let exp = 1; exp <= 7; exp++) {
    const tick = 10 ** exp;
    if (tick >= min && tick <= max) ticks.push(tick);
  }
  return ticks;
}

export function DistributionChart({
  globalThresholds,
  countryThresholds,
  countryName,
  countryCode,
  intlIncome,
  globalPercentile,
  countryPercentile,
}: Props) {
  const [ref, width] = useMeasuredWidth();
  const [compareCode, setCompareCode] = useState("");
  const [zoomed, setZoomed] = useState(false);

  const compareOptions = countryList.filter((c) => c.code !== countryCode);
  const compareCountry = compareCode
    ? countryList.find((c) => c.code === compareCode)
    : undefined;

  const compact = width < 420;
  const height = compact ? 200 : 240;
  const margin = {
    top: 18,
    right: 12,
    bottom: 30,
    left: compact ? 26 : 30,
  };

  const plotWidth = Math.max(width - margin.left - margin.right, 1);
  const plotHeight = height - margin.top - margin.bottom;

  // Zoom crops the percentile (y) window; the income (x) domain is derived
  // from the endpoints of that same window so both axes tighten together.
  // Covers both markers (global and country percentile) so neither one
  // clips out of view when they're far apart.
  const range = zoomed
    ? zoomWindowCovering(globalPercentile, countryPercentile)
    : { from: 0, to: 100 };
  const yFrom = range.from;
  const yTo = range.to;
  const idxLo = zoomed ? range.from - 1 : 0;
  const idxHi = zoomed ? range.to - 1 : 98;

  const lo =
    Math.min(
      globalThresholds[idxLo],
      countryThresholds[idxLo],
      compareCountry?.percentiles[idxLo] ?? Infinity,
      intlIncome,
    ) * 0.85;
  const hi =
    Math.max(
      globalThresholds[idxHi],
      countryThresholds[idxHi],
      compareCountry?.percentiles[idxHi] ?? -Infinity,
      intlIncome,
    ) * 1.15;

  const logLo = Math.log10(lo);
  const logHi = Math.log10(hi);
  const x = (income: number) =>
    margin.left + ((Math.log10(income) - logLo) / (logHi - logLo)) * plotWidth;
  const y = (percentile: number) =>
    margin.top + (1 - (percentile - yFrom) / (yTo - yFrom)) * plotHeight;

  const curve = (thresholds: number[]) =>
    thresholds
      .map((income, i) => `${i === 0 ? "M" : "L"}${x(income)},${y(i + 1)}`)
      .join(" ");

  const userX = x(intlIncome);
  const baselineY = y(yFrom);
  const labelAtEnd = userX > margin.left + plotWidth - 44;

  const gridlinePercentiles = zoomed
    ? [yFrom, Math.round((yFrom + yTo) / 2), yTo]
    : [0, 50, 100];

  return (
    <figure className="mt-6">
      <figcaption className="label">
        Share of people earning less, by yearly income per person (int$, log
        scale)
      </figcaption>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <label className="flex items-center gap-2 text-ink-muted">
          Compare with
          <select
            className="field w-auto py-1.5"
            value={compareCode}
            onChange={(e) => setCompareCode(e.target.value)}
          >
            <option value="">another country…</option>
            {compareOptions.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={() => setZoomed((z) => !z)}
          className="rounded-sm border border-rule-strong px-3 py-1.5 text-xs font-medium hover:border-ink"
          aria-pressed={zoomed}
        >
          {zoomed ? "Show full range" : "Zoom to your range"}
        </button>
      </div>

      <div ref={ref} className="mt-3">
        {width > 0 && (
          <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label={`Income distribution curves. You earn ${Math.round(intlIncome).toLocaleString("en-US")} international dollars per person per year, above ${globalPercentile}% of the world and ${countryPercentile}% of people in ${countryName}.`}
          >
            {/* Percentile gridlines — hairline, solid, recessive. */}
            {gridlinePercentiles.map((p) => (
              <g key={p}>
                <line
                  x1={margin.left}
                  x2={margin.left + plotWidth}
                  y1={y(p)}
                  y2={y(p)}
                  stroke="var(--color-rule)"
                  strokeWidth={1}
                />
                <text
                  x={margin.left - 6}
                  y={y(p)}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize={10}
                  fill="var(--color-ink-muted)"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {p}
                </text>
              </g>
            ))}

            {/* Income ticks. */}
            {logTicks(lo, hi).map((tick) => (
              <text
                key={tick}
                x={x(tick)}
                y={baselineY + 14}
                textAnchor="middle"
                dominantBaseline="hanging"
                fontSize={10}
                fill="var(--color-ink-muted)"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {moneyTick(tick)}
              </text>
            ))}

            <line
              x1={margin.left}
              x2={margin.left + plotWidth}
              y1={baselineY}
              y2={baselineY}
              stroke="var(--color-rule-strong)"
              strokeWidth={1}
            />

            {/* Context first, story on top. */}
            {compareCountry && (
              <path
                d={curve(compareCountry.percentiles)}
                fill="none"
                stroke="var(--color-compare)"
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            )}
            <path
              d={curve(countryThresholds)}
              fill="none"
              stroke="var(--color-ink-muted)"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path
              d={curve(globalThresholds)}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* The user's income: one accent rule threading both dots.
                It must reach the *higher* percentile — whichever curve that is —
                or the far dot reads as detached from the line. */}
            <line
              x1={userX}
              x2={userX}
              y1={baselineY}
              y2={Math.min(y(globalPercentile), y(countryPercentile)) - 4}
              stroke="var(--color-accent)"
              strokeWidth={1.5}
            />
            <circle
              cx={userX}
              cy={y(countryPercentile)}
              r={4}
              fill="var(--color-ink-muted)"
              stroke="var(--color-paper-raised)"
              strokeWidth={2}
            />
            <circle
              cx={userX}
              cy={y(globalPercentile)}
              r={4.5}
              fill="var(--color-accent)"
              stroke="var(--color-paper-raised)"
              strokeWidth={2}
            />
            <text
              x={labelAtEnd ? userX - 8 : userX + 8}
              y={y(globalPercentile) - 8}
              textAnchor={labelAtEnd ? "end" : "start"}
              fontSize={11}
              fontWeight={600}
              fill="var(--color-accent)"
            >
              You
            </text>
          </svg>
        )}
        {width === 0 && <div style={{ height }} />}
      </div>

      {/* A legend is always present; a third entry appears once a compare country is picked. */}
      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-muted">
        <span className="flex items-center gap-2">
          <span aria-hidden className="inline-block h-0.5 w-4 bg-ink" />
          World
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden className="inline-block h-0.5 w-4 bg-ink-muted" />
          {countryName}
        </span>
        {compareCountry && (
          <span className="flex items-center gap-2">
            <span aria-hidden className="inline-block h-0.5 w-4 bg-compare" />
            {compareCountry.name}
          </span>
        )}
      </div>
    </figure>
  );
}
