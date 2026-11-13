import { jaxscan } from "@/content/jaxscan";
import { site } from "@/content/site";
import { JaxScanIcon, PlayGlyph } from "./JaxScanPromo";

/** Bottom of the page: what the tool is, the JaxScan app, copyright. */
export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:grid-cols-[1fr_auto] lg:px-6">
        <div>
          <p className="font-display text-lg font-semibold">
            {site.brandName}
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
            {site.tagline} Your files are never uploaded, stored or seen by anyone.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted uppercase">Android app</p>
          {/* The whole card is one big tap target. */}
          <a
            href={jaxscan.play("footer")}
            target="_blank"
            rel="noopener"
            className="card mt-3 flex min-h-16 items-center gap-3 p-3 pr-4 transition-colors hover:border-accent/50 active:scale-[0.98]"
          >
            <JaxScanIcon size={48} className="size-12 rounded-xl" />
            <span className="min-w-0 flex-1 text-sm font-semibold">
              {jaxscan.title}
              <span className="block text-xs font-normal text-muted">Free on Google Play</span>
            </span>
            <span className="btn-primary inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold">
              <PlayGlyph className="size-4" />
              Install
            </span>
          </a>
        </div>
      </div>
      <p className="border-t border-border px-4 py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} JaxScan. Files are processed on your device and never uploaded.
      </p>
    </footer>
  );
}
