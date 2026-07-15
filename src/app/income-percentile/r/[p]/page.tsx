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
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">
        This person earns more than {p}% of the world
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        That is about {billions} billion people. Where do you stand?
      </p>
      <Link href="/income-percentile/" className="font-medium underline">
        Calculate yours →
      </Link>
    </main>
  );
}
