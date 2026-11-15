import type { MetadataRoute } from "next";
import { LANDING_PAGES } from "@/content/landing";
import { SITE_URL } from "@/content/site";
import { landingUrl } from "@/lib/seo";

// Built once at build time (required for the static export).
export const dynamic = "force-static";

/** When each page last changed in a way that matters to search engines. Update it when you change a page. */
const UPDATED = new Date("2026-11-15");

/** /sitemap.xml: the home page and every landing page (src/content/landing.ts). */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, lastModified: UPDATED, changeFrequency: "weekly", priority: 1 },
    ...LANDING_PAGES.map((p) => ({ url: landingUrl(p), lastModified: UPDATED, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
