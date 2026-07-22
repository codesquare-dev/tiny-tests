import Link from "next/link";
import { TESTS } from "@/components/NextTests";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <p className="label">The index</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.1] tracking-tight sm:text-5xl">
        Where do you actually stand?
      </h1>
      <p className="mt-4 max-w-prose text-lg leading-relaxed text-ink-muted">
        Enter your income and see exactly where it lands, out of 8 billion
        people. It takes about thirty seconds, runs entirely in your browser,
        and traces back to a public dataset you can go and check.
      </p>

      <ul className="mt-12 border-t border-ink">
        {TESTS.map((t) => (
          <li key={t.href} className="border-b border-rule">
            <Link
              href={t.href}
              className="flex items-baseline justify-between gap-6 px-1 py-6 hover:bg-paper-raised"
            >
              <span className="block">
                <span className="block font-display text-2xl tracking-tight text-ink">
                  {t.title}
                </span>
                <span className="mt-1 block text-ink-muted">{t.blurb}</span>
                <span className="label mt-3 block">{t.dateline}</span>
              </span>
              <span aria-hidden className="text-lg text-accent">
                →
              </span>
            </Link>
          </li>
        ))}
        <li className="border-b border-rule py-6 px-1">
          <p className="font-display text-2xl tracking-tight text-ink-muted">
            Still being built
          </p>
          <p className="mt-1 text-ink-muted">
            More countries, more precision, more ways to compare — the plan is
            to go deeper on this one number, not add another.
          </p>
        </li>
      </ul>
    </main>
  );
}
