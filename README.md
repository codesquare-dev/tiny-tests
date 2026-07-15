# TinyTests

Tiny tests you can finish in 30 seconds.

**Live**: https://codesquare-dev.github.io/tiny-tests/

## What's here

### How Rich Am I?

A global income percentile calculator. Enter your yearly income, country, and household
size — see where you stand among 8 billion people, both globally and within your own
country.

- Percentile thresholds come from the [World Bank Poverty and Inequality Platform](https://pip.worldbank.org/) (CC0), pooled across 162 countries.
- Incomes are converted to 2021 international dollars using PPP factors, and equivalised by the square root of household size.
- Every calculation runs in the browser — nothing is uploaded.
- Results are shareable: each percentile (1–99) has its own pre-rendered page and social card image.

More tests may get added here over time — see `NextTests` on the home page.

## Tech stack

Next.js (App Router, static export), TypeScript, Tailwind CSS, Vitest. No server runtime —
the whole site is pre-rendered static HTML/JSON, deployed to GitHub Pages.

## Development

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm test         # vitest
pnpm build        # static export to out/
```

## Data pipeline

`data/global.json` and `data/countries.json` are generated from World Bank sources:

```bash
pnpm tsx scripts/build-data.ts   # regenerates data/*.json
pnpm og                          # regenerates public/og/p{1..99}.png (satori)
```

## Deploy

```bash
pnpm deploy       # build + push out/ to the gh-pages branch
```

GitHub Pages serves from the `gh-pages` branch. `next.config.ts` sets `basePath: "/tiny-tests"`
to match the project-site URL; see `src/lib/site.ts` for the canonical site URL used in
absolute links (OG images, share URLs, sitemap).
