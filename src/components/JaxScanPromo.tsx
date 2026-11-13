import { jaxscan, postAction, showcase, sideCard } from "@/content/jaxscan";
import { Icon, type IconName } from "./Icon";

/** The JaxScan app icon (local copy of the Play Store icon). `eager` for the header logo, which is always on screen. */
export function JaxScanIcon({ size, eager = false, className = "" }: { size: number; eager?: boolean; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- a static file; next/image adds nothing in a static export
    <img
      src={jaxscan.icon}
      alt="JaxScan app icon"
      width={size}
      height={size}
      loading={eager ? "eager" : "lazy"}
      className={`shrink-0 ${className}`}
    />
  );
}

/**
 * Google Play button. `placement` goes into the Play Store referrer so installs
 * can be traced to it. " on Google Play" is added from tablet width up, so the
 * label stays on one line on phones.
 */
export function PlayButton({ placement, label, className = "" }: { placement: string; label: string; className?: string }) {
  return (
    <a
      href={jaxscan.play(placement)}
      target="_blank"
      rel="noopener"
      className={`btn-primary inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 font-semibold ${className}`}
    >
      <PlayGlyph />
      <span>
        {label}
        <span className="hidden sm:inline"> on Google Play</span>
      </span>
    </a>
  );
}

/**
 * Wide screens only: a JaxScan card pinned in the empty space right of the
 * page, so the app stays in view while the visitor scrolls. It appears only
 * from 1480px wide, where that space (beside the 64rem-wide content) is wide
 * enough that the card never covers the page.
 */
export function JaxScanSideCard() {
  return (
    <aside
      aria-label="JaxScan for Android"
      className="fixed top-28 right-5 z-20 hidden w-[10.5rem] animate-rise rounded-3xl border border-border bg-bg/80 p-4 text-center shadow-[0_20px_60px_-24px_var(--shadow)] backdrop-blur-xl min-[1480px]:block"
    >
      <a href={jaxscan.play("side_card")} target="_blank" rel="noopener" className="block">
        <JaxScanIcon size={80} eager className="mx-auto size-20 rounded-[1.25rem] shadow-lg shadow-accent/20" />
        <p className="mt-3 text-[0.625rem] font-semibold tracking-wide text-accent uppercase">{sideCard.eyebrow}</p>
        <p className="mt-1 font-display text-base leading-snug font-bold">{jaxscan.name}</p>
        <p className="mt-1 text-xs leading-snug text-muted">{sideCard.title}</p>
      </a>
      <ul className="mt-3 space-y-1.5 text-left text-[0.6875rem] text-muted">
        {sideCard.points.map((p) => (
          <li key={p} className="flex items-center gap-1.5">
            <Icon name="check" className="size-3.5 shrink-0 text-accent" />
            {p}
          </li>
        ))}
      </ul>
      <a
        href={jaxscan.play("side_card")}
        target="_blank"
        rel="noopener"
        className="btn-primary mt-4 flex h-10 items-center justify-center gap-1.5 rounded-xl text-sm font-semibold"
      >
        <PlayGlyph className="size-4" />
        {sideCard.cta}
      </a>
      <p className="mt-2 text-[0.625rem] text-muted">{sideCard.footnote}</p>
    </aside>
  );
}

/** Card shown right after the tool finishes. */
export function JaxScanCard() {
  return (
    <aside aria-label="JaxScan for Android" className="card relative overflow-hidden p-5 sm:p-6">
      <div aria-hidden className="pointer-events-none absolute -top-20 -right-16 size-56 rounded-full bg-accent/15 blur-3xl" />
      <div className="flex items-start gap-4">
        <JaxScanIcon size={64} className="size-16 rounded-2xl shadow-lg" />
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-wide text-accent uppercase">{postAction.eyebrow}</p>
          <h3 className="mt-1 font-display text-lg font-semibold sm:text-xl">{postAction.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">{postAction.text}</p>
        </div>
      </div>
      <PlayButton placement={postAction.placement} label={postAction.cta} className="mt-5 w-full sm:w-auto" />
    </aside>
  );
}

const FEATURE_ICONS: IconName[] = ["file", "card", "grid", "shield", "bolt", "check"];

/** The big JaxScan section on the page: headline, six features, trust points and the install button. */
export function JaxScanShowcase() {
  return (
    <section id="jaxscan" aria-labelledby="jaxscan-title" className="card relative overflow-hidden p-6 sm:p-10">
      <div aria-hidden className="pointer-events-none absolute -top-32 -left-24 size-96 rounded-full bg-accent/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-24 -bottom-32 size-96 rounded-full bg-accent-2/10 blur-3xl" />

      <div className="relative grid items-center gap-8 lg:grid-cols-[auto_1fr]">
        <JaxScanIcon size={160} className="mx-auto size-28 rounded-[1.75rem] shadow-2xl shadow-accent/20 sm:size-36 lg:size-40" />
        <div className="text-center lg:text-left">
          <p className="text-xs font-semibold tracking-wide text-accent uppercase">{showcase.eyebrow}</p>
          <h2 id="jaxscan-title" className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-4xl">
            {showcase.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base lg:mx-0">{showcase.text}</p>
          <ul className="mt-4 flex flex-wrap justify-center gap-2 lg:justify-start">
            {showcase.trust.map((t) => (
              <li key={t} className="flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
                <Icon name="check" className="size-3.5" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ul className="relative mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {showcase.features.map((f, i) => (
          <li key={f.title} className="rounded-2xl border border-border bg-surface p-5">
            <span className="grid size-10 place-items-center rounded-xl bg-accent-soft text-accent">
              <Icon name={FEATURE_ICONS[i % FEATURE_ICONS.length]} />
            </span>
            <h3 className="mt-3 font-semibold">{f.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.text}</p>
          </li>
        ))}
      </ul>

      <div className="relative mt-8 flex justify-center lg:justify-start">
        <PlayButton placement="page_section" label={showcase.cta} className="h-14 w-full px-7 text-base sm:w-auto" />
      </div>
    </section>
  );
}

/** Google Play's triangle mark, simplified. */
export function PlayGlyph({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="currentColor" d="M4.5 2.8c-.3.3-.5.8-.5 1.4v15.6c0 .6.2 1.1.5 1.4l8.7-9.2-8.7-9.2zm9.9 10.4 2.6 2.7-10.7 6.1 8.1-8.8zm0-2.4L6.3 2l10.7 6.1-2.6 2.7zm3.9-1.9 3 1.7c.9.5.9 1.4 0 1.9l-3 1.7-2.8-2.7 2.8-2.6z" />
    </svg>
  );
}
