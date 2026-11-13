import type { MetadataRoute } from "next";
import { app } from "@/content/page";
import { site } from "@/content/site";

// Built once at build time (required for the static export).
export const dynamic = "force-static";

/** /manifest.webmanifest: name, colours and icon used when the page is added to a phone's home screen. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: app.fullName,
    short_name: site.name,
    description: site.tagline,
    start_url: `${site.basePath}/`,
    scope: `${site.basePath}/`,
    display: "standalone",
    background_color: "#05080d",
    theme_color: "#05080d",
    icons: [
      { src: `${site.basePath}/jaxscan-icon.png`, sizes: "512x512", type: "image/png", purpose: "any" },
      { src: `${site.basePath}/jaxscan-icon.png`, sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
