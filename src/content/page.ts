/**
 * PAGE TEXT for the home page (the only page). Kept here, away from the
 * layout code, so wording can be tuned for search without touching
 * components. The FAQ is also turned into FAQPage structured data, so the
 * questions and answers must match what is shown on the page.
 */

export const hero = {
  h1: "Compress PDF & Merge PDF",
  h1Sub: "Reduce PDF Size Without Uploading",
  intro:
    "Shrink a PDF by up to 95% for job, bank and visa portals, or combine several PDFs into one. Free, no sign-up, no watermark, and your files never leave your device.",
};

export const privacyBadge = "Zero Cloud Uploads — Ideal for sensitive bank statements, contracts & IDs.";

export const howToTitle = "How to Compress a PDF Without Uploading";

export const steps = [
  { title: "Add your PDF", text: "Drop the PDF on the box or tap to pick it. It is opened by your own browser, not sent to a server." },
  { title: "Choose a level", text: "Extreme for the smallest file (portal uploads), Recommended for most documents, High quality for the sharpest pages." },
  { title: "Compress", text: "Each page is optimised on your device while the bar shows the progress, page by page." },
  { title: "Download", text: "See the exact saving (for example 2.4 MB → 185 KB, -92%) and download your smaller PDF." },
];

export const mergeTitle = "How to Merge PDF Files Without Uploading";

export const mergeSteps = [
  { title: "Open the Merge tab", text: "Add two or more PDFs; each shows its page count." },
  { title: "Put them in order", text: "Drag the files, or use the arrows on a phone, and remove any you don't need." },
  { title: "Merge and download", text: "One PDF with every page, kept at full quality: text, links and images are copied as they are." },
];

/** The compression levels explained, as a table. */
export const levels = {
  title: "Which Compression Level Should I Use?",
  head: ["Level", "Best for", "Typical result"],
  rows: [
    ["Extreme compression", "Job, exam, visa and bank portals with a 100–500 KB limit", "Often 80–95% smaller; a short scan of one or two pages often lands under 200 KB"],
    ["Recommended", "Emailing and sharing documents, most scans and statements", "Often 60–90% smaller with clear, readable text"],
    ["High quality", "Printing, photos and documents with fine detail", "Smaller with almost no visible change"],
  ],
};

export const whyPrivate = {
  title: "Why Compressing in Your Browser Protects Sensitive Documents",
  points: [
    "Bank statements, salary slips, contracts, tax forms and ID scans carry exactly the details fraudsters want. Most online PDF tools upload them to a cloud server where they can be stored, logged or leaked.",
    "Here the PDF is opened, compressed and merged by your own browser. Nothing is uploaded, so there is nothing on a server to leak, and it even works offline once the page has loaded.",
    "No account, no email, no watermark and no limit on files or pages. Close the tab and every trace is gone.",
  ],
};

export const faqTitle = "Compress & Merge PDF: Frequently Asked Questions";

export const faq = [
  {
    q: "How do I compress a PDF to under 200 KB?",
    a: "Add your PDF, choose Extreme compression and tap Compress PDF. A scan of one or two pages often comes out under 200 KB, and files usually shrink by 80–95%. The result shows the exact new size before you download; if it is still too big, split off the pages you need first.",
  },
  {
    q: "Is it safe to compress bank statements and ID cards here?",
    a: "Yes. Your PDF never leaves your device: it is compressed and merged entirely inside your web browser, and 0 bytes are uploaded to any server. That is why it is safe for bank statements, contracts, payslips and ID scans.",
  },
  {
    q: "How do I merge PDF files without uploading them?",
    a: "Open the Merge PDFs tab, add your files, drag them (or use the arrows) into the order you want and tap Merge. Pages are copied as they are, so text, links and quality are kept, and nothing is uploaded.",
  },
  {
    q: "Will compressing reduce the quality of my PDF?",
    a: "Compression redraws each page as an optimised image, so pages become a little softer and their text can no longer be selected or searched. Recommended keeps text clear for reading and printing; choose High quality for fine detail. Merging never changes quality.",
  },
  {
    q: "Is there a file size or page limit?",
    a: "There is no fixed limit and no daily cap. Because everything runs on your device, very large PDFs (hundreds of pages) depend on your phone or computer's memory; a laptop handles them faster than an older phone.",
  },
];

/** What this tool is, for the WebApplication structured data and the app manifest. */
export const app = {
  fullName: "Compress PDF & Merge PDF – Private PDF Compressor",
  alternateNames: ["Compress PDF", "PDF Compressor", "Reduce PDF Size", "Merge PDF", "PDF Merger"],
  subCategory: "PDF Compressor",
  features: [
    "Compress PDF with Extreme, Recommended or High quality levels",
    "Reduce PDF size for portal uploads, often by 80–95%",
    "Before and after size with the exact saving",
    "Merge multiple PDFs into one, with page counts and drag-to-reorder",
    "Page-by-page progress",
    "100% client-side: no files uploaded",
  ],
};
