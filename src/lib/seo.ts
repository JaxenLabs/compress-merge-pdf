import type { Metadata } from "next";
import type { LandingPage } from "@/content/landing";
import { app, faq, howToTitle, steps } from "@/content/page";
import { SITE_URL, abs, site } from "@/content/site";

/** Link to a landing page inside this site, e.g. "/compress-pdf-to-100kb/". */
export const landingPath = (p: LandingPage) => `${site.basePath}/${p.slug}/`;

/** Full address of a landing page (its canonical URL). */
export const landingUrl = (p: LandingPage) => `${SITE_URL}${p.slug}/`;

/**
 * The share image (src/app/opengraph-image.png). A page that sets its own
 * openGraph or twitter tags replaces the inherited ones, image included, so
 * landing pages name it here.
 */
const SHARE_IMAGE = { url: `${site.basePath}/opengraph-image.png`, width: 1200, height: 630, type: "image/png", alt: `${site.brandName}: compress and merge PDFs, 100% private in your browser` };

/** <head> tags for a landing page: its own title, description, canonical URL and share cards. */
export function landingMetadata(p: LandingPage): Metadata {
  const url = landingUrl(p);
  return {
    title: { absolute: p.title },
    description: p.description,
    keywords: p.keywords,
    alternates: { canonical: url },
    openGraph: { type: "website", siteName: site.brandName, locale: "en_US", url, title: p.title, description: p.description, images: [SHARE_IMAGE] },
    twitter: { card: "summary_large_image", title: p.title, description: p.description, images: [SHARE_IMAGE] },
  };
}

/** The publisher (JaxScan) and the site, shared by every page's structured data. */
const siteNodes = () => [
  { "@type": "WebSite", "@id": `${SITE_URL}#website`, name: site.name, url: SITE_URL, publisher: { "@id": `${SITE_URL}#publisher` } },
  { "@type": "Organization", "@id": `${SITE_URL}#publisher`, name: site.publisher.name, url: site.publisher.url, logo: abs(site.publisher.logoPath) },
];

/** schema.org data for a landing page: the tool, its FAQ, how-to steps, breadcrumbs (Home › Page) and the publisher. */
export function landingJsonLd(p: LandingPage) {
  const url = landingUrl(p);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${url}#app`,
        name: `${p.h1} – ${site.brandName}`,
        url,
        description: p.description,
        applicationCategory: "UtilitiesApplication",
        applicationSubCategory: p.mode === "merge" ? "PDF Merger" : app.subCategory,
        operatingSystem: "Any (runs in the web browser)",
        browserRequirements: "Requires JavaScript and a modern web browser",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        featureList: app.features,
        image: abs("/opengraph-image.png"),
        inLanguage: "en",
        publisher: { "@id": `${SITE_URL}#publisher` },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: p.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
      {
        "@type": "HowTo",
        "@id": `${url}#how-to`,
        name: p.howToTitle,
        totalTime: "PT1M",
        tool: { "@type": "HowToTool", name: "A web browser" },
        step: p.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.title, text: s.text, url: `${url}#how-to` })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: p.h1, item: url },
        ],
      },
      ...siteNodes(),
    ],
  };
}

/**
 * schema.org structured data for the page: what the tool is (WebApplication),
 * its FAQ (FAQPage, which can show the questions right in Google results), the
 * how-to steps and the publisher. One "@graph" links them together.
 */
export function pageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${SITE_URL}#app`,
        name: app.fullName,
        alternateName: app.alternateNames,
        url: SITE_URL,
        description: site.description,
        applicationCategory: "UtilitiesApplication",
        applicationSubCategory: app.subCategory,
        operatingSystem: "Any (runs in the web browser)",
        browserRequirements: "Requires JavaScript and a modern web browser",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        featureList: app.features,
        screenshot: abs("/opengraph-image.png"),
        image: abs("/opengraph-image.png"),
        inLanguage: "en",
        publisher: { "@id": `${SITE_URL}#publisher` },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}#faq`,
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "HowTo",
        "@id": `${SITE_URL}#how-to`,
        name: howToTitle,
        totalTime: "PT1M",
        tool: { "@type": "HowToTool", name: "A web browser" },
        step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.title, text: s.text, url: `${SITE_URL}#how-to` })),
      },
      ...siteNodes(),
    ],
  };
}
