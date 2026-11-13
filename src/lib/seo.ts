import { app, faq, howToTitle, steps } from "@/content/page";
import { SITE_URL, abs, site } from "@/content/site";

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
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}#website`,
        name: site.name,
        url: SITE_URL,
        publisher: { "@id": `${SITE_URL}#publisher` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}#publisher`,
        name: site.publisher.name,
        url: site.publisher.url,
        logo: abs(site.publisher.logoPath),
      },
    ],
  };
}
