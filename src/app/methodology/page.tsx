import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Methodology & Sources — TinyTests",
  description:
    "Where each test's data comes from, how it's calculated, and what it can't tell you.",
};

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <p className="label">About the data</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.1] tracking-tight sm:text-5xl">
        Methodology &amp; sources
      </h1>
      <p className="mt-4 max-w-prose text-lg leading-relaxed text-ink-muted">
        How each test works, where its data comes from, and where it falls
        short.
      </p>

      <section className="mt-12 border-t border-ink pt-6">
        <h2 className="font-display text-2xl tracking-tight">Sources</h2>
        <ul className="mt-4 max-w-prose divide-y divide-rule border-y border-rule">
          <li className="py-4 text-sm leading-relaxed text-ink-muted">
            <span className="font-medium text-ink">
              World Bank Poverty and Inequality Platform (PIP)
            </span>{" "}
            — percentile thresholds for each country, from the{" "}
            <code className="rounded-sm bg-paper px-1 py-0.5 text-[0.8125rem]">
              world_100bin_revised
            </code>{" "}
            table, 2021 PPP round. Public domain (CC0).
          </li>
          <li className="py-4 text-sm leading-relaxed text-ink-muted">
            <span className="font-medium text-ink">World Bank PA.NUS.PPP</span> —
            purchasing power parity conversion factors used to translate local
            currency into international dollars. CC-BY 4.0.
          </li>
          <li className="py-4 text-sm leading-relaxed text-ink-muted">
            <span className="font-medium text-ink">world-countries</span>{" "}
            (mledoze/countries) — used only to look up each country&apos;s
            currency code. ODbL-1.0.
          </li>
          <li className="py-4 text-sm leading-relaxed text-ink-muted">
            <span className="font-medium text-ink">Human Benchmark</span> — the
            published median reaction time (273 ms) that the reaction-time
            curve is anchored to. Reported statistic only; we hold none of the
            underlying data.
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl tracking-tight">Definitions</h2>
        <p className="mt-3 max-w-prose leading-relaxed text-ink-muted">
          The percentile curves are built from per-capita income or consumption —
          household welfare divided evenly by the number of people in the
          household, with no adjustment for household size or composition. Values
          are expressed in 2021 international dollars (PPP), meaning a dollar
          buys roughly the same basket of goods no matter which country it&apos;s
          spent in. The World Bank publishes this as a daily figure, which we
          convert to an annual one by multiplying by 365. The dataset covers 162
          countries.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl tracking-tight">
          How the calculation works
        </h2>
        <p className="mt-3 max-w-prose leading-relaxed text-ink-muted">
          Everything runs in your browser. Your income is never uploaded or sent
          to a server. If you enter a household income, we divide it by the
          number of people in your household (per-capita) before comparing it to
          the percentile curves — the same per-capita basis the World Bank data
          uses. This is a simple even split, not an equivalence scale like the
          ones used in some official household-income statistics, which give
          extra weight to adults and less to additional household members. That
          means our numbers for people in larger households will read lower than
          figures from sources that use equivalized income.
        </p>
      </section>

      <section className="mt-10 border-t border-rule pt-6">
        <h2 className="font-display text-2xl tracking-tight">Limitations</h2>
        <p className="mt-3 max-w-prose leading-relaxed text-ink-muted">
          This calculator is a rough placement, not a precise measurement. A few
          things it can and can&apos;t account for:
        </p>
        <ul className="mt-4 max-w-prose list-disc space-y-3 pl-5 leading-relaxed text-ink-muted marker:text-accent">
          <li>
            Some countries&apos; figures are based on consumption surveys rather
            than income surveys, because that&apos;s what their national
            statistics offices collect. Income and consumption aren&apos;t
            directly comparable, but the World Bank uses them together as the
            best available measure of household welfare.
          </li>
          <li>
            What counts as &quot;income&quot; — pre-tax or post-tax, for instance
            — varies by country&apos;s source survey. There&apos;s no single
            consistent definition applied everywhere.
          </li>
          <li>
            Household surveys are known to undercount very high incomes: wealthy
            respondents are harder to reach and less likely to report accurately.
            The top percentiles here likely understate how much the richest
            people actually earn.
          </li>
          <li>
            Surveys aren&apos;t run in every country every year, so the
            underlying data was collected at different points in time across
            countries, not all in the same year.
          </li>
        </ul>
      </section>

      <section className="mt-10 border-t border-rule pt-6">
        <h2 className="font-display text-2xl tracking-tight">Reaction time</h2>
        <p className="mt-3 max-w-prose leading-relaxed text-ink-muted">
          The reaction-time percentile is an approximation, not a measurement
          against a dataset of our own. Your five valid trials are averaged and
          placed on a log-normal curve — the shape reaction times are
          conventionally modelled with — centred on the 273 ms median that{" "}
          <a
            href="https://humanbenchmark.com/tests/reactiontime/statistics"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink underline decoration-rule-strong underline-offset-2 hover:decoration-accent"
          >
            Human Benchmark publishes
          </a>{" "}
          from its own sample. That sample is large but self-selected: it is
          people who chose to take a reaction test, not a random draw of
          humanity.
        </p>
        <p className="mt-3 max-w-prose leading-relaxed text-ink-muted">
          Human Benchmark publishes no standard deviation, so the curve&apos;s
          spread (sigma = 0.30) is fitted so that roughly 200 ms lands near the
          top decile and roughly 350 ms near the bottom quartile — landmarks read
          off the same published histogram. Real reaction times are more skewed
          than a pure log-normal, so treat the number as a placement rather than
          a precise rank. Your equipment counts too: a wireless mouse and a
          slow display can add tens of milliseconds that have nothing to do with
          you.
        </p>
      </section>

      <Link
        href="/income-percentile/"
        className="mt-10 inline-block rounded-sm border border-rule-strong px-4 py-2 text-sm font-medium hover:border-ink"
      >
        Back to the calculator
      </Link>
    </main>
  );
}
