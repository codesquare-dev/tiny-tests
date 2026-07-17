import type { Metadata } from "next";
import Link from "next/link";
import { peopleBelow } from "@/lib/percentile";
import { SITE_URL } from "@/lib/site";

type Params = Promise<{ p: string }>;

export function generateStaticParams() {
  return Array.from({ length: 99 }, (_, i) => ({ p: String(i + 1) }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { p: pParam } = await params;
  const p = Number(pParam);
  const title = `I earn more than ${p}% of the world 🌍`;
  return {
    title,
    description: "Find out where your income stands among 8 billion people.",
    openGraph: { title, images: [`${SITE_URL}/og/p${p}.png`] },
    twitter: { card: "summary_large_image" },
  };
}

export default async function SharePage({ params }: { params: Params }) {
  const { p: pParam } = await params;
  const p = Number(pParam);
  const billions = (peopleBelow(p) / 1e9).toFixed(1);
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <p className="label">Global income · World Bank PIP</p>
      <h1 className="mt-3 max-w-prose font-display text-4xl leading-[1.1] tracking-tight tabular-nums sm:text-5xl">
        This person earns more than{" "}
        <span className="text-accent">{p}%</span> of the world
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-muted tabular-nums">
        That is about {billions} billion people. Where do you stand?
      </p>
      <Link
        href="/income-percentile/"
        className="mt-8 inline-block rounded-sm bg-accent px-5 py-3 font-medium text-paper hover:bg-accent-deep"
      >
        Calculate yours
      </Link>
    </main>
  );
}
