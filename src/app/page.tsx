import { Faq } from "@/components/Faq";
import { Icon, type IconName } from "@/components/Icon";
import { JaxScanShowcase } from "@/components/JaxScanPromo";
import { JsonLd } from "@/components/JsonLd";
import { PdfTool } from "@/components/pdf/PdfTool";
import { faqTitle, hero, howToTitle, levels, mergeSteps, mergeTitle, privacyBadge, steps, whyPrivate } from "@/content/page";
import { pageJsonLd } from "@/lib/seo";

const HIGHLIGHTS: { icon: IconName; text: string }[] = [
  { icon: "shield", text: "No upload" },
  { icon: "bolt", text: "Fast" },
  { icon: "wifiOff", text: "Works offline" },
  { icon: "check", text: "No watermark" },
];

/**
 * The whole site is this one page: the PDF tool at the top (above the fold),
 * then the explanations search engines and visitors read below it.
 */
export default function Home() {
  return (
    <>
      <JsonLd data={pageJsonLd()} />

      {/* Tool first: heading, privacy badge, tool */}
      <section id="top" className="mx-auto max-w-5xl px-4 pt-4 lg:px-6 lg:pt-10">
        <div className="text-center">
          <h1 className="font-display text-[1.75rem] leading-tight font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {hero.h1}{" "}
            <span className="block text-gradient sm:inline">
              {/* The dash only joins the two parts when they share a line. */}
              <span className="hidden sm:inline">– </span>
              {hero.h1Sub}
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">{hero.intro}</p>
          <p className="mx-auto mt-4 inline-flex max-w-full items-center gap-2 rounded-full border border-accent/40 bg-accent-soft px-4 py-2 text-left text-xs font-semibold text-accent sm:text-sm">
            <Icon name="shield" className="size-4 shrink-0" />
            {privacyBadge}
          </p>
        </div>
        <div className="mt-5">
          <PdfTool />
        </div>
        <ul className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted sm:text-sm">
          {HIGHLIGHTS.map((h) => (
            <li key={h.text} className="flex items-center gap-1.5">
              <Icon name={h.icon} className="size-4 text-accent" />
              {h.text}
            </li>
          ))}
        </ul>
      </section>

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

function SectionTitle({ id, eyebrow, title }: { id: string; eyebrow: string; title: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold tracking-wide text-accent uppercase">{eyebrow}</p>
      <h2 id={id} className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}

function Steps({ items, columns = "lg:grid-cols-4" }: { items: { title: string; text: string }[]; columns?: string }) {
  return (
    <ol className={`mt-8 grid gap-3 sm:grid-cols-2 ${columns}`}>
      {items.map((s, i) => (
        <li key={s.title} className="card p-5">
          <span className="grid size-9 place-items-center rounded-xl bg-accent-soft font-display font-bold text-accent">{i + 1}</span>
          <h3 className="mt-3 font-semibold">{s.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}
