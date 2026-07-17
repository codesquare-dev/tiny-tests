import type { Metadata } from "next";
import Link from "next/link";
import { IncomeForm } from "@/components/IncomeForm";
import { AdSlot } from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "How Rich Am I? Global Income Percentile Calculator",
  description:
    "Enter your yearly income and see where you stand among 8 billion people. Free, instant, based on World Bank data.",
};

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <p className="label">Global income · World Bank PIP</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.1] tracking-tight sm:text-5xl">
        How rich are you, really?
      </h1>
      <p className="mt-4 max-w-prose text-lg leading-relaxed text-ink-muted">
        Enter your income to see your place in the global income distribution.
      </p>

      <IncomeForm />
      <AdSlot slot="result" />

      <section className="mt-12 border-t border-rule pt-6">
        <h2 className="label">How this calculator works</h2>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-ink-muted">
          Percentile thresholds come from the World Bank Poverty and Inequality
          Platform. Incomes are converted to 2021 international dollars using PPP
          factors, and household incomes are divided equally among household
          members (per-capita), matching the World Bank per-capita income
          distribution. All calculations run in your browser — nothing is
          uploaded.
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
