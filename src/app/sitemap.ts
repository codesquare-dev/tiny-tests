import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://tiny-tests.pages.dev";
  return [
    { url: `${base}/` },
    { url: `${base}/income-percentile/` },
  ];
}
