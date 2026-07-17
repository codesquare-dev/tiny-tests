import type { Metadata } from "next";
import { IncomeForm } from "@/components/IncomeForm";
import { AdSlot } from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "How Rich Am I? Global Income Percentile Calculator",
  description:
    "Enter your yearly income and see where you stand among 8 billion people. Free, instant, based on World Bank data.",
};

export default function Page() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">How rich are you, really?</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Enter your income to see your place in the global income distribution.
        </p>
      </div>
      <IncomeForm />
      <AdSlot slot="result" />
      <section className="flex flex-col gap-2 border-t border-black/10 pt-8 text-sm text-zinc-600 dark:border-white/15 dark:text-zinc-400">
        <h2 className="text-base font-semibold text-foreground">How this calculator works</h2>
        <p>
          Percentile thresholds come from the World Bank Poverty and Inequality Platform.
          Incomes are converted to 2021 international dollars using PPP factors, and household
          incomes are divided equally among household members (per-capita), matching the World
          Bank per-capita income distribution. All calculations run in your browser — nothing is
          uploaded.
        </p>
        <AdSlot slot="methodology" />
      </section>
    </main>
  );
}
