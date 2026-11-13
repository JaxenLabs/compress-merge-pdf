import { JaxScanCard } from "@/components/JaxScanPromo";
import { Icon } from "@/components/Icon";

/**
 * The finished file: a headline (e.g. "2.40 MB → 185.0 KB (-92%)"), details,
 * the download button and, inside the same box, the JaxScan offer.
 */
export function ResultBox({ headline, details, note, href, fileName }: { headline: string; details: string; note?: string; href: string; fileName: string }) {
  return (
    <div className="animate-rise space-y-4 rounded-2xl border border-accent/40 bg-accent-soft p-4 sm:p-5">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent text-bg">
          <Icon name="check" className="size-6" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-semibold sm:text-xl" data-testid="result-headline">
            {headline}
          </p>
          <p className="text-sm text-muted">{details}</p>
        </div>
        <a href={href} download={fileName} className="btn-primary inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl px-6 font-semibold sm:w-auto">
          <Icon name="download" />
          Download PDF
        </a>
      </div>
      {note && <p className="text-sm text-text">{note}</p>}
      <JaxScanCard />
    </div>
  );
}
