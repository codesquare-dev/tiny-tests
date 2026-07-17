import type { Metadata } from "next";
import { Newsreader, IBM_Plex_Sans } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "TinyTests",
  description: "Tiny tests you can finish in 30 seconds.",
};

function Masthead() {
  return (
    <header>
      <div className="mx-auto flex w-full max-w-3xl items-baseline justify-between gap-4 px-6 pb-3 pt-6">
        <div className="flex items-baseline gap-3">
          <Link
            href="/"
            className="font-display text-2xl font-semibold tracking-tight text-ink"
          >
            TinyTests
          </Link>
          <span className="hidden text-sm text-ink-muted sm:flex sm:items-baseline sm:gap-3">
            <span aria-hidden className="inline-block h-3 w-px bg-accent" />
            Small tests, real numbers.
          </span>
        </div>
        <nav>
          <Link href="/methodology/" className="label hover:text-accent">
            Methodology
          </Link>
        </nav>
      </div>
      {/* Nameplate double rule: thick over thin, the way a masthead sits on paper. */}
      <div className="border-b-[3px] border-ink" />
      <div className="h-[3px]" />
      <div className="border-b border-rule-strong" />
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-rule">
      <div className="mx-auto w-full max-w-3xl px-6 py-10">
        <p className="label">Sources</p>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-ink-muted">
          Percentile thresholds: World Bank Poverty and Inequality Platform,
          2021 PPP round (CC0). Purchasing power parity factors: World Bank
          PA.NUS.PPP (CC BY 4.0). Currency codes: world-countries / mledoze
          (ODbL 1.0). Full notes and limitations in the{" "}
          <Link href="/methodology/" className="text-ink underline decoration-rule-strong underline-offset-2 hover:decoration-accent">
            methodology
          </Link>
          .
        </p>
        <p className="mt-4 text-sm text-ink-muted">
          Figures are estimates from household surveys, not financial advice.
          Everything is calculated in your browser.
        </p>
        <p className="mt-4 text-sm text-ink-muted">
          <Link href="/about/" className="text-ink underline decoration-rule-strong underline-offset-2 hover:decoration-accent">
            About
          </Link>
          {" · "}
          <Link href="/privacy/" className="text-ink underline decoration-rule-strong underline-offset-2 hover:decoration-accent">
            Privacy
          </Link>
        </p>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${plexSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <Masthead />
        {children}
        <Footer />
        {adsenseClient && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <Script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "1315654a2ead4ef19ed952e964bb1d69"}'
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
