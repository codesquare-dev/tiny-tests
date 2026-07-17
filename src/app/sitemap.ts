import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL;
  return [
    { url: `${base}/` },
    { url: `${base}/income-percentile/` },
    { url: `${base}/methodology/` },
  ];
}
