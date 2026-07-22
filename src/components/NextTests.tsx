import Link from "next/link";

export const TESTS = [
  {
    href: "/income-percentile/",
    title: "How Rich Am I?",
    blurb: "Your place among 8 billion people",
    dateline: "World Bank PIP · 2021 PPP · 162 countries",
  },
];

export function NextTests({ excludeHref }: { excludeHref?: string }) {
  const items = TESTS.filter((t) => t.href !== excludeHref);
  return (
    <section aria-label="more tests" className="border-t border-rule pt-6">
      <h2 className="label">Try another test</h2>
      {items.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className="mt-3 flex items-baseline justify-between gap-4 rounded-sm border border-rule bg-paper-raised px-4 py-3 hover:border-rule-strong"
        >
          <span>
            <span className="font-display text-lg text-ink">{t.title}</span>
            <span className="text-sm text-ink-muted"> — {t.blurb}</span>
          </span>
          <span aria-hidden className="text-accent">
            →
          </span>
        </Link>
      ))}
      {items.length === 0 && (
        <p className="mt-3 text-sm text-ink-muted">More tests coming soon.</p>
      )}
    </section>
  );
}
