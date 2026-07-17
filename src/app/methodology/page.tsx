import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Methodology & Sources — How Rich Am I?",
  description:
    "Where the income percentile data comes from, how it's calculated, and what it can't tell you.",
};

export default function Page() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Methodology &amp; sources</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          How the income percentile calculator works, where its data comes from, and where it
          falls short.
        </p>
      </div>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Sources</h2>
        <ul className="flex flex-col gap-2 text-zinc-600 dark:text-zinc-400">
          <li>
            <strong className="text-foreground">World Bank Poverty and Inequality Platform (PIP)</strong>
            {" "}— percentile thresholds for each country, from the{" "}
            <code className="text-sm">world_100bin_revised</code> table, 2021 PPP round.
            Public domain (CC0).
          </li>
          <li>
            <strong className="text-foreground">World Bank PA.NUS.PPP</strong> — purchasing power
            parity conversion factors used to translate local currency into international
            dollars. CC-BY 4.0.
          </li>
          <li>
            <strong className="text-foreground">world-countries</strong> (mledoze/countries) — used
            only to look up each country&apos;s currency code. ODbL-1.0.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Definitions</h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          The percentile curves are built from per-capita income or consumption — household
          welfare divided evenly by the number of people in the household, with no adjustment
          for household size or composition. Values are expressed in 2021 international dollars
          (PPP), meaning a dollar buys roughly the same basket of goods no matter which country
          it&apos;s spent in. The World Bank publishes this as a daily figure, which we convert to
          an annual one by multiplying by 365. The dataset covers 162 countries.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">How the calculation works</h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          Everything runs in your browser. Your income is never uploaded or sent to a server. If
          you enter a household income, we divide it by the number of people in your household
          (per-capita) before comparing it to the percentile curves — the same per-capita basis
          the World Bank data uses. This is a simple even split, not an equivalence scale like the
          ones used in some official household-income statistics, which give extra weight to
          adults and less to additional household members. That means our numbers for people in
          larger households will read lower than figures from sources that use equivalized income.
        </p>
      </section>

      <section className="flex flex-col gap-2 border-t border-black/10 pt-8 dark:border-white/15">
        <h2 className="text-xl font-semibold">Limitations</h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          This calculator is a rough placement, not a precise measurement. A few things it can
          and can&apos;t account for:
        </p>
        <ul className="flex list-disc flex-col gap-2 pl-5 text-zinc-600 dark:text-zinc-400">
          <li>
            Some countries&apos; figures are based on consumption surveys rather than income
            surveys, because that&apos;s what their national statistics offices collect. Income
            and consumption aren&apos;t directly comparable, but the World Bank uses them
            together as the best available measure of household welfare.
          </li>
          <li>
            What counts as &quot;income&quot; — pre-tax or post-tax, for instance — varies by
            country&apos;s source survey. There&apos;s no single consistent definition applied
            everywhere.
          </li>
          <li>
            Household surveys are known to undercount very high incomes: wealthy respondents are
            harder to reach and less likely to report accurately. The top percentiles here likely
            understate how much the richest people actually earn.
          </li>
          <li>
            Surveys aren&apos;t run in every country every year, so the underlying data was
            collected at different points in time across countries, not all in the same year.
          </li>
        </ul>
      </section>

      <Link
        href="/income-percentile/"
        className="self-start rounded-full border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/[.04] dark:border-white/15 dark:hover:bg-white/[.08]"
      >
        Back to the calculator
      </Link>
    </main>
  );
}
