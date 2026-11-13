import { site } from "./site";

/**
 * JAXSCAN, the Android app this site promotes: its details, its Play Store
 * links, and the marketing text shown after a conversion, in the big section
 * on the page and in the sticky phone bar. Every claim comes from the JaxScan
 * Play Store listing; keep it that way when editing.
 */

/**
 * The icon is copied into this site (public/jaxscan-icon.png, from the Play
 * Store listing) so the page makes no request to another server for it.
 */
export const jaxscan = {
  name: "JaxScan",
  title: "JaxScan: PDF, OCR, Cam Scanner",
  id: "com.jaxenlabs.scanai",
  icon: `${site.basePath}/jaxscan-icon.png`,
  /**
   * Google Play link with an install referrer, so the Play Console shows which
   * site (`utm_source`) and which button (`utm_content`: header, post_compress,
   * page_section...) brought the install. The referrer is URL-encoded once, as
   * Google Play expects.
   */
  play: (placement: string) => {
    const referrer = encodeURIComponent(`utm_source=${site.utmSource}&utm_medium=web&utm_content=${placement}`);
    return `https://play.google.com/store/apps/details?id=com.jaxenlabs.scanai&referrer=${referrer}`;
  },
} as const;

/** Install button at the right of the header, on every screen. */
export const headerCta = {
  short: "Get the app",
  long: "Get JaxScan free",
};

/** Card pinned in the empty space right of the page on wide screens, so the app is always in view. */
export const sideCard = {
  eyebrow: "Free Android app",
  title: "Scan to PDF with your phone camera",
  points: ["Compress & merge PDFs", "Sign & redact", "AES-256 PDF lock", "Offline OCR"],
  footnote: "No account · No ads",
  cta: "Get it free",
};

/** Card shown inside the result box, right after compressing or merging, when the offer is most relevant. */
export const postAction = {
  placement: "post_compress",
  eyebrow: "PDF tools on your phone, no internet needed",
  title: "Compress, merge, split, sign and lock PDFs offline",
  text: "Need to compress, merge, split, sign or password-protect PDFs on your phone without internet? Get JaxScan on Google Play: 100% offline and ad-free, with AES-256 PDF lock.",
  cta: "Get JaxScan free",
};

/** The big section further down the page. */
export const showcase = {
  eyebrow: "Free Android app",
  title: "JaxScan: the private scanner in your pocket",
  text: "Scan, compress, convert, sign and protect documents offline on your Android phone, without uploading a single page.",
  cta: "Get JaxScan free",
  features: [
    {
      title: "Scan to PDF in seconds",
      text: "Auto edge detection and 10 filters that lift shadows and turn paper bright white. Batch-scan a whole stack into one PDF.",
    },
    {
      title: "ID card photocopy",
      text: "Front and back on one printable page, like a photocopy, ready for any job, bank or visa application.",
    },
    {
      title: "Offline OCR in many languages",
      text: "Copy text from any photo: English, Spanish, French, German, Hindi, Chinese, Japanese, Korean and more, even in airplane mode.",
    },
    {
      title: "Sign, redact & lock",
      text: "Draw your signature once and reuse it, black out private details for good and lock PDFs with an AES-256 password.",
    },
    {
      title: "Complete PDF toolkit",
      text: "Merge, split and compress PDFs, add page numbers and watermarks, and convert to Word, PowerPoint and images.",
    },
    {
      title: "QR & barcode scanner",
      text: "Join Wi-Fi, open links, save contacts and events in one tap, with a full scan history.",
    },
  ],
  trust: ["No account", "No ads", "No cloud upload", "Works offline", "Fingerprint app lock"],
};

/** The slim bar pinned to the bottom of phones and tablets. */
export const stickyBar = {
  title: "JaxScan – Scan to PDF",
  text: "Free · Offline · No ads",
  cta: "Install",
};
