/** Small line icons (24x24, drawn with the current text colour). */
const PATHS = {
  upload: "M12 16V4m0 0-4 4m4-4 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2",
  left: "M15 18l-6-6 6-6",
  right: "M9 6l6 6-6 6",
  rotate: "M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3",
  download: "M12 4v12m0 0-4-4m4 4 4-4M4 20h16",
  shield: "M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3zm-3.5 9 2.5 2.5 4.5-5",
  check: "M5 12.5l4.5 4.5L19 7",
  chevron: "M6 9l6 6 6-6",
  plus: "M12 5v14M5 12h14",
  x: "M6 6l12 12M18 6 6 18",
  file: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5zm0 0v5h5",
  card: "M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6zm4 4h4m-4 4h7",
  bolt: "M13 3 4 14h7l-1 7 9-11h-7l1-7z",
  wifiOff: "M3 3l18 18M8.5 16.5a5 5 0 0 1 7 0M5 13a10 10 0 0 1 5.2-2.8M12 20h.01M16.7 10.6A10 10 0 0 1 19 13M2 9a15 15 0 0 1 4.6-3M10.7 5.1A15 15 0 0 1 22 9",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  up: "M18 15l-6-6-6 6",
  down: "M6 9l6 6 6-6",
  lock: "M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4",
  unlock: "M6 11h12v10H6zM8 11V7a4 4 0 0 1 7.5-2",
  image: "M4 5h16v14H4zM4 15l4-4 4 4 3-3 5 5M15 9h.01",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={PATHS[name]} />
    </svg>
  );
}
