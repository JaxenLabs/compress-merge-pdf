import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";

// Built once at build time (required for the static export).
export const dynamic = "force-static";

/** /sitemap.xml: the page list for search engines (this site is a single page). */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
}
