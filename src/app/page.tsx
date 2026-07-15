import Link from "next/link";
import { TESTS } from "@/components/NextTests";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">TinyTests</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Tiny tests you can finish in 30 seconds.</p>
      </div>
      <div className="flex flex-col gap-3">
        {TESTS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="rounded-lg border border-black/10 p-4 hover:bg-black/[.04] dark:border-white/15 dark:hover:bg-white/[.08]"
          >
            <strong>{t.title}</strong> — {t.blurb}
          </Link>
        ))}
      </div>
    </main>
  );
}
