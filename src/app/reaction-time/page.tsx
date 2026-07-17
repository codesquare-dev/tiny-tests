import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { ReactionGame } from "@/components/ReactionGame";

export const metadata: Metadata = {
  title: "Reaction Time Test — How Fast Are You?",
  description:
    "Click the moment the panel turns. Five trials, your average in milliseconds, and where it places you. Free, instant, runs in your browser.",
};

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <p className="label">Reaction time · Human Benchmark median</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.1] tracking-tight sm:text-5xl">
        How fast are you, really?
      </h1>
      <p className="mt-4 max-w-prose text-lg leading-relaxed text-ink-muted">
        Five trials. Click the moment the panel turns red — we&apos;ll average
        them and place you against the published distribution.
      </p>

      <ReactionGame />
      <AdSlot slot="result" />

      <section className="mt-12 border-t border-rule pt-6">
        <h2 className="label">How this test works</h2>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-ink-muted">
          Each trial waits a random 1.5 to 4 seconds before the panel turns, so
          the moment can&apos;t be anticipated. Your time is measured with the
          browser&apos;s high-resolution clock, from the frame the panel changes
          to the moment your click lands. Clicks before the change, or under 80
          milliseconds after it — faster than human reaction physically allows —
          are counted as false starts and don&apos;t score. The percentile is a
          log-normal approximation anchored to Human Benchmark&apos;s published
          273 ms median, not a measurement against our own dataset. Everything
          runs in your browser.
        </p>
        <p className="mt-3">
          <Link
            href="/methodology/"
            className="text-sm text-ink underline decoration-rule-strong underline-offset-2 hover:decoration-accent"
          >
            Methodology &amp; sources
          </Link>
        </p>
        <AdSlot slot="methodology" />
      </section>
    </main>
  );
}
