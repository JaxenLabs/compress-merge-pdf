import { headerCta, jaxscan } from "@/content/jaxscan";
import { site } from "@/content/site";
import { JaxScanIcon, PlayGlyph } from "./JaxScanPromo";

/** Section links in the desktop header. */
const NAV = [
  { href: "#how-to", label: "How it works" },
  { href: "#levels", label: "Levels" },
  { href: "#merge", label: "Merge" },
  { href: "#faq", label: "FAQ" },
];

/**
 * Sticky top bar: the logo on the left (the JaxScan icon, "<Tool> by
 * JaxScan") and a JaxScan install button on the right, so the app is in view
 * from the first second on every screen. Desktop: a floating glass bar with
 * section links in the middle. Phones and tablets: a compact app bar.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 pt-[env(safe-area-inset-top)] lg:px-6 lg:pt-4">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 border-b border-border bg-bg/85 px-4 backdrop-blur-xl lg:h-16 lg:rounded-2xl lg:border lg:bg-bg/70 lg:pr-2.5 lg:shadow-[0_8px_40px_-16px_var(--shadow)]">
        <a href="#top" className="flex items-center gap-2.5">
          <JaxScanIcon size={36} eager className="size-9 rounded-xl" />
          <span className="font-display text-lg leading-none font-semibold tracking-tight">
            {site.name}
            <span className="block text-[0.625rem] font-medium tracking-wide text-muted uppercase">by JaxScan</span>
          </span>
        </a>
        <nav aria-label="Sections" className="hidden items-center gap-1 text-sm lg:flex">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="rounded-xl px-3 py-2 text-muted transition-colors hover:bg-accent-soft hover:text-accent">
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href={jaxscan.play("header")}
          target="_blank"
          rel="noopener"
          className="btn-primary inline-flex h-10 items-center gap-2 rounded-xl px-3.5 text-sm font-semibold sm:px-4 lg:h-11"
        >
          <PlayGlyph className="size-4" />
          <span className="sm:hidden">{headerCta.short}</span>
          <span className="hidden sm:inline">{headerCta.long}</span>
        </a>
      </div>
    </header>
  );
}
