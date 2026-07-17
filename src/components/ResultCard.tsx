import Link from "next/link";
import { peopleBelow } from "@/lib/percentile";
import { SITE_URL } from "@/lib/site";
import type { Verdict } from "./IncomeForm";
import { NextTests } from "./NextTests";

export function ResultCard({ verdict }: { verdict: Verdict }) {
  const shareUrl = `${SITE_URL}/income-percentile/r/${verdict.globalPercentile}/`;
  const billions = (peopleBelow(verdict.globalPercentile) / 1e9).toFixed(1);
  return (
    <section
      aria-label="result"
      className="mt-8 flex flex-col gap-3 rounded-sm border border-rule bg-paper-raised p-6"
    >
      <p className="font-display text-3xl leading-tight tracking-tight tabular-nums">
        You earn more than{" "}
        <span className="text-accent">{verdict.globalPercentile}%</span> of the
        world
      </p>
      <p className="text-lg tabular-nums">
        Top {100 - verdict.countryPercentile}% in {verdict.countryName}
      </p>
      <p className="text-ink-muted tabular-nums">
        That is about {billions} billion people earning less than you.
      </p>
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
