export const TESTS = [
  {
    href: "/income-percentile/",
    title: "How Rich Am I?",
    blurb: "Your place among 8 billion people",
    dateline: "World Bank PIP · 2021 PPP · 162 countries",
  },
];

/**
 * With a single entry in TESTS, ResultCard's excludeHref always matches it —
 * there is never another test left to point to.
 */
export function NextTests({ excludeHref }: { excludeHref?: string }) {
  void excludeHref;
  return null;
}
