import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — TinyTests",
  description:
    "What TinyTests is, how the numbers are sourced, and who's behind it.",
};

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <p className="label">About</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.1] tracking-tight sm:text-5xl">
        About TinyTests
      </h1>
      <p className="mt-4 max-w-prose text-lg leading-relaxed text-ink-muted">
        Small tests you can finish in 30 seconds, with numbers traced back to
        public datasets rather than made up.
      </p>

      <section className="mt-12 max-w-prose space-y-6 border-t border-ink pt-6 leading-relaxed text-ink-muted">
        <p>
          TinyTests is a collection of short browser tests — where you stand
          on global income, how fast your reaction time is — that place a
          single number against a real distribution of other people. Nothing
          you enter is uploaded anywhere; every calculation runs on your own
          device.
        </p>
        <p>
          The editorial stance is that a number without a source is just a
          guess. Every figure on this site links to a{" "}
          <Link
            href="/methodology/"
            className="text-ink underline decoration-rule-strong underline-offset-2 hover:decoration-accent"
          >
            methodology page
          </Link>{" "}
          that names the dataset it came from, and anywhere the math is an
          approximation rather than a direct measurement, it&apos;s labeled as
          one.
        </p>
        <p>
          It&apos;s an independent, solo project — not run by a company, and not
          affiliated with the organizations whose data it uses.
        </p>
        <p>
          Questions, corrections, or bug reports can go through the{" "}
          <a
            href="https://github.com/codesquare-dev/tiny-tests"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink underline decoration-rule-strong underline-offset-2 hover:decoration-accent"
          >
            GitHub repository
          </a>
          .
        </p>
      </section>

      <Link
        href="/"
        className="mt-10 inline-block rounded-sm border border-rule-strong px-4 py-2 text-sm font-medium hover:border-ink"
      >
        Back to TinyTests
      </Link>
    </main>
  );
}
