import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Faq } from "@/components/Faq";
import { JaxScanShowcase } from "@/components/JaxScanPromo";
import { JsonLd } from "@/components/JsonLd";
import { LinkGrid, SectionTitle, Steps, ToolHero } from "@/components/Sections";
import { LANDING_PAGES, landingBySlug, relatedTitle } from "@/content/landing";
import { hero } from "@/content/page";
import { site } from "@/content/site";
import { landingJsonLd, landingMetadata, landingPath } from "@/lib/seo";

/**
 * One static page per popular search: /compress-pdf/, /merge-pdf/,
 * /compress-pdf-to-100kb/ ... (the list is in src/content/landing.ts).
 * Each opens the tool set up for its job; unknown addresses are a 404.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return LANDING_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = landingBySlug((await params).slug);
  return p ? landingMetadata(p) : {};
}

export default async function LandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = landingBySlug((await params).slug);
  if (!p) notFound();
  const related = [
    { href: `${site.basePath}/`, text: `${hero.h1} (home)`, blurb: "Both tools on one page" },
    ...LANDING_PAGES.filter((x) => x.slug !== p.slug).map((x) => ({ href: landingPath(x), text: x.linkText, blurb: x.blurb })),
  ];

  return (
    <>
      <JsonLd data={landingJsonLd(p)} />

      <ToolHero h1={p.h1} h1Sub={p.h1Sub} intro={p.intro} setup={{ mode: p.mode, preset: p.preset, targetKb: p.targetKb }} />

      <div className="mx-auto max-w-5xl space-y-16 px-4 pt-16 lg:space-y-24 lg:px-6 lg:pt-24">
        <section id="how-to" aria-labelledby="how-to-title">
          <SectionTitle id="how-to-title" eyebrow="Step by step" title={p.howToTitle} />
          <Steps items={p.steps} columns={p.steps.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"} />
        </section>

        <section id="faq" aria-labelledby="faq-title">
          <SectionTitle id="faq-title" eyebrow="FAQ" title={`${p.h1}: Questions and Answers`} />
          <div className="mt-8">
            <Faq items={p.faq} />
          </div>
        </section>

        {/* JaxScan, our Android app */}
        <JaxScanShowcase />

        <section id="related" aria-labelledby="related-title">
          <SectionTitle id="related-title" eyebrow="Related" title={relatedTitle} />
          <LinkGrid links={related} />
        </section>
      </div>
    </>
  );
}
