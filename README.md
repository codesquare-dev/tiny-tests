# Out of 100

Tiny tests you can finish in 30 seconds.

**Live**: https://tiny-tests.pages.dev/

## What's here

### How Rich Am I?

A global income percentile calculator. Enter your yearly income, country, and household
size — see where you stand among 8 billion people, both globally and within your own
country.

- Percentile thresholds come from the [World Bank Poverty and Inequality Platform](https://pip.worldbank.org/) (CC0), pooled across 162 countries.
- Incomes are converted to 2021 international dollars using PPP factors, and divided equally among household members (per-capita), matching the World Bank per-capita income distribution.
- Every calculation runs in the browser — nothing is uploaded.
- Results are shareable: each percentile (1–99) has its own pre-rendered page and social card image.

More tests may get added here over time — see `NextTests` on the home page.

## Tech stack

Next.js (App Router, static export), TypeScript, Tailwind CSS, Vitest. No server runtime —
the whole site is pre-rendered static HTML/JSON, deployed to Cloudflare Pages.

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
pnpm deploy       # build + wrangler pages deploy out/
```

Cloudflare Pages serves the static `out/` directory (`wrangler pages deploy`). Credentials
live in `.env.deploy` (git-ignored): `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
See `src/lib/site.ts` for the canonical site URL used in absolute links (OG images,
share URLs, sitemap).
