import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy — TinyTests",
  description:
    "What TinyTests collects, what it doesn't, and how the site is hosted and served.",
};

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <p className="label">Legal</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.1] tracking-tight sm:text-5xl">
        Privacy
      </h1>
      <p className="mt-4 max-w-prose text-lg leading-relaxed text-ink-muted">
        A short version of this policy: your calculator inputs never leave
        your browser. Here&apos;s the rest of it.
      </p>

      <section className="mt-12 border-t border-ink pt-6">
        <h2 className="font-display text-2xl tracking-tight">
          What we don&apos;t collect
        </h2>
        <p className="mt-3 max-w-prose leading-relaxed text-ink-muted">
          Every calculation on TinyTests runs in your browser. When you enter
          an income or run the reaction-time test, that number is never
          uploaded or sent to a server — we have no way to see it. There are
          no accounts, no sign-ups, and no forms that submit your data
          anywhere.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl tracking-tight">Hosting</h2>
        <p className="mt-3 max-w-prose leading-relaxed text-ink-muted">
          The site is served by Cloudflare Pages. Like any host, Cloudflare
          may process standard request logs — things like IP address and
          user agent — as part of delivering the pages to you. We don&apos;t
          separately collect or store this.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl tracking-tight">Analytics</h2>
        <p className="mt-3 max-w-prose leading-relaxed text-ink-muted">
          We use Cloudflare Web Analytics to see how many people visit the
          site. It&apos;s cookieless, doesn&apos;t fingerprint you, and doesn&apos;t track
          you across other sites — it just counts page views in aggregate.
        </p>
      </section>

      <section className="mt-10 border-t border-rule pt-6">
        <h2 className="font-display text-2xl tracking-tight">Advertising</h2>
        <p className="mt-3 max-w-prose leading-relaxed text-ink-muted">
          TinyTests doesn&apos;t run ads today. If we introduce advertising, it
          would be through Google AdSense, which uses cookies — including
          from third-party vendors — to serve and measure ads. You&apos;d be able
          to read more and adjust your settings at Google&apos;s{" "}
          <a
            href="https://policies.google.com/technologies/ads"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink underline decoration-rule-strong underline-offset-2 hover:decoration-accent"
          >
            ads policy page
          </a>{" "}
          and{" "}
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink underline decoration-rule-strong underline-offset-2 hover:decoration-accent"
          >
            Ad Settings
          </a>
          . We&apos;ll update this page if that changes.
        </p>
      </section>

      <section className="mt-10 border-t border-rule pt-6">
        <h2 className="font-display text-2xl tracking-tight">Contact</h2>
        <p className="mt-3 max-w-prose leading-relaxed text-ink-muted">
          Questions about this policy or the site can go through the{" "}
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
        <p className="mt-6 text-sm text-ink-muted">
          Last updated July 17, 2026.
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
