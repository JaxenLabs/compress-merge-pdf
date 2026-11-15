/**
 * SITE DETAILS: name, address and search wording used in the <head>, the
 * share card, the sitemap and the structured data. Change them here and
 * every page updates.
 *
 * MOVING TO A CUSTOM DOMAIN (e.g. compressmergepdf.com): set `origin` to
 * "https://compressmergepdf.com", set `basePath` to "", and add a
 * `public/CNAME` file containing `compressmergepdf.com`. Nothing else needs
 * to change.
 */
export const site = {
  name: "Compress PDF",
  /**
   * Shown as "Compress PDF by JaxScan" with the JaxScan icon as the logo, so
   * visitors recognise the app on Google Play. JaxScan is also the publisher
   * everywhere (footer, <head>, structured data); no company name or email is shown.
   */
  brandName: "Compress PDF by JaxScan",
  /** Where the site is served from (no trailing slash): its Cloudflare Pages address. */
  origin: "https://compressmergepdf.pages.dev",
  /** The folder the site lives in on that origin ("" = the root). */
  basePath: "",
  /** Used in the JaxScan links so installs from this site can be counted. */
  utmSource: "web_compress_pdf",
  /** Shown as author and publisher. `url` is the JaxScan Play Store page; `logoPath` is inside this site. */
  publisher: { name: "JaxScan", url: "https://play.google.com/store/apps/details?id=com.jaxenlabs.scanai", logoPath: "/jaxscan-icon.png" },

  /** <title>: the searched words first, kept under ~60 characters so Google shows it whole. */
  title: "Compress PDF & Merge PDF Free – Reduce PDF Size Privately",
  /** Meta description: under ~160 characters, says what it does and why it's better. */
  description:
    "Compress PDF to under 200 KB and merge PDF files without uploading. Reduce PDF file size for portals and email, free and 100% private in your browser.",
  /** Short line for the share card, app manifest and footer. */
  tagline: "Compress and merge PDF files privately in your browser.",
  keywords: [
    "compress pdf",
    "reduce pdf file size",
    "pdf compressor",
    "compress pdf under 200kb",
    "compress pdf to 100kb",
    "compress pdf to 500kb",
    "reduce pdf size for upload",
    "shrink pdf",
    "make pdf smaller",
    "compress pdf free",
    "compress pdf online free",
    "private pdf compressor",
    "compress pdf without uploading",
    "merge pdf",
    "merge pdf files",
    "combine pdf",
    "join pdf",
    "merge pdf without uploading",
    "merge pdf free",
    "pdf merger",
    "compress bank statement pdf",
    "pdf compressor offline",
  ],
} as const;

/** Full address of the site's home page, with trailing slash. */
export const SITE_URL = `${site.origin}${site.basePath}/`;

/** Turns a path inside this site ("/og.png") into a full URL. */
export const abs = (path: string) => `${site.origin}${site.basePath}${path}`;
