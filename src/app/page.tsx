import { Faq } from "@/components/Faq";
import { Icon } from "@/components/Icon";
import { JaxScanShowcase } from "@/components/JaxScanPromo";
import { JsonLd } from "@/components/JsonLd";
import { LinkGrid, SectionTitle, Steps, ToolHero } from "@/components/Sections";
import { LANDING_PAGES, popularTools } from "@/content/landing";
import { faqTitle, hero, howToTitle, levels, mergeSteps, mergeTitle, steps, whyPrivate } from "@/content/page";
import { landingPath, pageJsonLd } from "@/lib/seo";

/**
 * The home page: the PDF tool at the top (above the fold), then the
 * explanations search engines and visitors read below it, and links to the
 * landing pages (src/content/landing.ts).
 */
export default function Home() {
  return (
    <>
      <JsonLd data={pageJsonLd()} />

      {/* Tool first: heading, privacy badge, tool */}
      <ToolHero h1={hero.h1} h1Sub={hero.h1Sub} intro={hero.intro} />

      <div className="mx-auto max-w-5xl space-y-16 px-4 pt-16 lg:space-y-24 lg:px-6 lg:pt-24">
        {/* How to compress */}
        <section id="how-to" aria-labelledby="how-to-title">
          <SectionTitle id="how-to-title" eyebrow="Step by step" title={howToTitle} />
          <Steps items={steps} />
        </section>

        {/* Compression levels */}
        <section id="levels" aria-labelledby="levels-title">
          <SectionTitle id="levels-title" eyebrow="Compression levels" title={levels.title} />
          {/* Scrolls sideways on narrow phones instead of squashing the columns. */}
          <div className="card mt-8 overflow-x-auto p-0">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="border-b border-border text-xs tracking-wide text-muted uppercase">
                <tr>
                  {levels.head.map((h) => (
                    <th key={h} scope="col" className="px-5 py-4 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {levels.rows.map(([level, use, result]) => (
                  <tr key={level}>
                    <th scope="row" className="px-5 py-4 font-semibold whitespace-nowrap text-accent">
                      {level}
                    </th>
                    <td className="px-5 py-4">{use}</td>
                    <td className="px-5 py-4 text-muted">{result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* How to merge */}
        <section id="merge" aria-labelledby="merge-title">
          <SectionTitle id="merge-title" eyebrow="Merge PDFs" title={mergeTitle} />
          <Steps items={mergeSteps} columns="lg:grid-cols-3" />
        </section>

        {/* Privacy */}
        <section id="privacy" aria-labelledby="privacy-title">
          <SectionTitle id="privacy-title" eyebrow="0 bytes uploaded" title={whyPrivate.title} />
          <ul className="mt-8 grid gap-3 md:grid-cols-3">
            {whyPrivate.points.map((p) => (
              <li key={p} className="card flex gap-3 p-5 text-sm leading-relaxed text-muted">
                <Icon name="shield" className="mt-0.5 size-5 shrink-0 text-accent" />
                {p}
              </li>
            ))}
          </ul>
        </section>

        {/* JaxScan, our Android app */}
        <JaxScanShowcase />

        {/* Links to every landing page (compress to a size, merge, combine) */}
        <section id="popular" aria-labelledby="popular-title">
          <SectionTitle id="popular-title" eyebrow={popularTools.eyebrow} title={popularTools.title} />
          <LinkGrid links={LANDING_PAGES.map((p) => ({ href: landingPath(p), text: p.linkText, blurb: p.blurb }))} />
        </section>

        {/* FAQ */}
        <section id="faq" aria-labelledby="faq-title">
          <SectionTitle id="faq-title" eyebrow="FAQ" title={faqTitle} />
          <div className="mt-8">
            <Faq />
          </div>
        </section>
      </div>
    </>
  );
}
