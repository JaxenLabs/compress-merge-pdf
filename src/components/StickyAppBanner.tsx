"use client";

import { useEffect, useState } from "react";
import { jaxscan, stickyBar } from "@/content/jaxscan";
import { site } from "@/content/site";
import { Icon } from "./Icon";
import { JaxScanIcon, PlayGlyph } from "./JaxScanPromo";

/** Remembers a dismissal (kept per site). */
const KEY = `jaxscan-banner-closed${site.basePath}`;

/**
 * Phones and tablets: a slim JaxScan bar stuck to the bottom of the screen,
 * like an app's bottom bar. It appears once the visitor scrolls past the
 * tool, and stays closed for a week after they dismiss it.
 * localStorage is wrapped in try/catch: it can throw in private mode.
 */
export function StickyAppBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const closed = Number(localStorage.getItem(KEY) ?? 0);
      if (Date.now() - closed < 7 * 864e5) return;
    } catch {}
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  const close = () => {
    setVisible(false);
    try {
      localStorage.setItem(KEY, String(Date.now()));
    } catch {}
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 animate-rise border-t border-border bg-bg/90 px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-2xl items-center gap-3">
        <JaxScanIcon size={44} className="size-11 rounded-xl" />
        <p className="min-w-0 flex-1 text-[0.8125rem] leading-snug">
          <span className="block truncate font-semibold">{stickyBar.title}</span>
          <span className="block truncate text-muted">{stickyBar.text}</span>
        </p>
        <a href={jaxscan.play("sticky_banner")} target="_blank" rel="noopener" className="btn-primary inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl px-3.5 text-sm font-semibold">
          <PlayGlyph className="size-4" />
          {stickyBar.cta}
        </a>
        <button type="button" onClick={close} aria-label="Close" className="grid size-8 shrink-0 place-items-center rounded-full text-muted">
          <Icon name="x" className="size-4" />
        </button>
      </div>
    </div>
  );
}
