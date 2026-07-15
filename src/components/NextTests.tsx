import Link from "next/link";

export const TESTS = [
  { href: "/income-percentile/", title: "How Rich Am I?", blurb: "Your place among 8 billion people" },
];

export function NextTests({ excludeHref }: { excludeHref?: string }) {
  const items = TESTS.filter((t) => t.href !== excludeHref);
  return (
    <section aria-label="more tests" className="flex flex-col gap-3 border-t border-black/10 pt-8 dark:border-white/15">
      <h2 className="text-base font-semibold">Try another test</h2>
      {items.map((t) => (
        <Link key={t.href} href={t.href} className="rounded-lg border border-black/10 p-4 hover:bg-black/[.04] dark:border-white/15 dark:hover:bg-white/[.08]">
          <strong>{t.title}</strong> — {t.blurb}
        </Link>
      ))}
      {items.length === 0 && <p className="text-zinc-600 dark:text-zinc-400">More tests coming soon.</p>}
    </section>
  );
}
