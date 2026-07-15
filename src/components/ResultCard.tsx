import { peopleBelow } from "@/lib/percentile";
import { SITE_URL } from "@/lib/site";
import type { Verdict } from "./IncomeForm";
import { NextTests } from "./NextTests";

export function ResultCard({ verdict }: { verdict: Verdict }) {
  const shareUrl = `${SITE_URL}/income-percentile/r/${verdict.globalPercentile}/`;
  const billions = (peopleBelow(verdict.globalPercentile) / 1e9).toFixed(1);
  return (
    <section aria-label="result" className="mt-8 flex flex-col gap-3 rounded-xl border border-black/10 p-6 dark:border-white/15">
      <p className="text-3xl font-bold">
        You earn more than {verdict.globalPercentile}% of the world 🌍
      </p>
      <p className="text-lg">
        Top {100 - verdict.countryPercentile}% in {verdict.countryName}
      </p>
      <p className="text-zinc-600 dark:text-zinc-400">
        That is about {billions} billion people earning less than you.
      </p>
      <div className="flex gap-3 pt-2">
        <a
          className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/[.04] dark:border-white/15 dark:hover:bg-white/[.08]"
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`I earn more than ${verdict.globalPercentile}% of the world 🌍 Where do you stand?`)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Share on X
        </a>
        <button
          type="button"
          className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/[.04] dark:border-white/15 dark:hover:bg-white/[.08]"
          onClick={() => navigator.clipboard.writeText(shareUrl)}
        >
          Copy link
        </button>
      </div>
      <NextTests excludeHref="/income-percentile/" />
    </section>
  );
}
