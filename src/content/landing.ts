import type { CompressionPreset } from "@/lib/pdf/presets";

/**
 * KEYWORD LANDING PAGES: one page per popular search (/compress-pdf-to-100kb/,
 * /merge-pdf/ ...). Each opens the tool already set up for that job, with its
 * own title, description, intro, steps and FAQ. The steps and FAQ also feed
 * the HowTo and FAQPage structured data, so they must match what is shown.
 *
 * The compressor has three fixed levels and no "exact size" mode, so a size
 * page presets a level and its target: the result then says whether the PDF
 * came in under it. The wording never promises a size; it says the tool makes
 * the file as small as it can and shows the result.
 */

export interface LandingPage {
  slug: string;
  /** Which panel of the tool opens first. */
  mode: "compress" | "merge";
  /** Compression level chosen when the page opens (compress pages). */
  preset?: CompressionPreset["id"];
  /**
   * Size the visitor is aiming for, in KB. The check counts 1 KB as 1000 bytes
   * (100 KB = 100,000 bytes; 1 MB = 1000 KB), so the file passes portals
   * whichever way they count.
   */
  targetKb?: number;
  /** <title>: starts with the search phrase, at most 60 characters. */
  title: string;
  /** Meta description: at most 160 characters. */
  description: string;
  /** H1: the search phrase, then a short second line. */
  h1: string;
  h1Sub: string;
  intro: string;
  keywords: string[];
  /** Anchor text for links to this page (home page "Popular tools", Related lists). */
  linkText: string;
  /** One line under the link on the home page. */
  blurb: string;
  howToTitle: string;
  steps: { title: string; text: string }[];
  faq: { q: string; a: string }[];
}

const privacyQ = {
  q: "Is it safe to use with bank statements and ID documents?",
  a: "Yes. The PDF is processed entirely inside your web browser and 0 bytes are uploaded, so there is no copy on a server to be stored or leaked. It even keeps working offline once the page has loaded.",
};

/** The steps every "compress to a size" page shares, with that page's size and level filled in. */
function sizeSteps(size: string, level: string) {
  return [
    { title: "Add your PDF", text: `Drop the PDF on the box or tap to pick it. ${level} is already chosen for a ${size} limit.` },
    { title: "Compress", text: "Tap Compress PDF. Each page is optimised on your device while the bar shows the progress." },
    { title: `Check it is under ${size}`, text: `The result shows the new size and says whether it fits under ${size}, before you download anything.` },
    { title: "Download and upload", text: "Download the smaller PDF and upload it to the portal or attach it to your email." },
  ];
}

export const LANDING_PAGES: LandingPage[] = [
  {
    slug: "compress-pdf",
    mode: "compress",
    preset: "recommended",
    title: "Compress PDF Free – Reduce PDF File Size Without Uploading",
    description: "Compress PDF files free in your browser. Pick a level, see the exact new size and download. No upload, no sign-up, no watermark.",
    h1: "Compress PDF",
    h1Sub: "Nothing Uploaded",
    intro:
      "Make a PDF smaller for email, sharing or a portal upload. Recommended is chosen for clear text and a much smaller file; switch to Extreme when you need the smallest size. The PDF never leaves your device.",
    keywords: ["compress pdf", "pdf compressor", "compress pdf free", "compress pdf online", "compress pdf without uploading"],
    linkText: "Compress PDF",
    blurb: "Three levels, exact before and after size",
    howToTitle: "How to Compress a PDF",
    steps: [
      { title: "Add your PDF", text: "Drop the PDF on the box or tap to pick it. It is opened by your browser, not sent to a server." },
      { title: "Pick a level", text: "Recommended suits most documents. Extreme gives the smallest file; High quality keeps fine detail." },
      { title: "Compress", text: "Tap Compress PDF and watch the progress, page by page." },
      { title: "Download", text: "See the before and after size (for example 2.40 MB → 310 KB) and download the smaller PDF." },
    ],
    faq: [
      {
        q: "How much smaller will my PDF get?",
        a: "It depends on what is inside. Scans and photo-heavy PDFs often shrink by 60–90% on Recommended and more on Extreme. A PDF that is mostly plain text may already be compact; then your original is kept and the result says so.",
      },
      {
        q: "Which compression level should I choose?",
        a: "Recommended for emailing and sharing, Extreme for portals with a KB limit, and High quality for printing or documents with small print and photos. You can try another level on the same file straight away.",
      },
      {
        q: "Can I still select the text after compressing?",
        a: "No. Each page is redrawn as an optimised image, which is what makes the file so much smaller, so the text can no longer be selected or searched. It stays readable and printable.",
      },
      privacyQ,
    ],
  },
  {
    slug: "merge-pdf",
    mode: "merge",
    title: "Merge PDF Files Free – Combine PDFs Without Uploading",
    description: "Merge PDF files into one in your browser. Add PDFs, drag them into order and download one file at full quality. Free and nothing is uploaded.",
    h1: "Merge PDF",
    h1Sub: "In Any Order",
    intro:
      "Put several PDFs together into one file. Add them, see each file's page count, drag them into order and merge. Pages are copied exactly as they are, so text, links and quality stay the same.",
    keywords: ["merge pdf", "merge pdf files", "pdf merger", "merge pdf free", "merge pdf without uploading"],
    linkText: "Merge PDF files",
    blurb: "Join PDFs in any order, full quality",
    howToTitle: "How to Merge PDF Files",
    steps: [
      { title: "Add your PDFs", text: "Drop two or more PDFs on the box or tap to pick them. Each shows its page count." },
      { title: "Set the order", text: "Drag the files into place, or use the up and down arrows on a phone. Remove any you don't need." },
      { title: "Merge and download", text: "Tap Merge and download one PDF with every page, in the order you chose." },
    ],
    faq: [
      {
        q: "Does merging reduce the quality of my PDFs?",
        a: "No. Pages are copied into the new file exactly as they are, so text stays selectable, links keep working and images are untouched. The merged file is about the size of the originals added together.",
      },
      {
        q: "How many PDFs can I merge at once?",
        a: "There is no fixed limit. Everything runs on your device, so very large sets depend on its memory; a computer handles hundreds of pages faster than an older phone.",
      },
      {
        q: "The merged PDF is too big. What can I do?",
        a: "Download it, open the Compress PDF tab and compress the merged file. Extreme gives the smallest size for portal uploads.",
      },
      privacyQ,
    ],
  },
  {
    slug: "compress-pdf-to-100kb",
    mode: "compress",
    preset: "extreme",
    targetKb: 100,
    title: "Compress PDF to 100 KB – Free, Private, No Upload",
    description: "Compress a PDF towards 100 KB for job, exam and visa portals. Extreme is preset; the result shows if it fits. Free and nothing is uploaded.",
    h1: "Compress PDF to 100 KB",
    h1Sub: "For Strict Portals",
    intro:
      "Many application and exam portals refuse PDFs over 100 KB. Extreme compression is already chosen: it makes the file as small as this tool can, then tells you whether it came in under 100 KB. One-page scans usually do; long documents may need fewer pages per file.",
    keywords: ["compress pdf to 100kb", "compress pdf under 100kb", "reduce pdf size to 100kb", "pdf to 100kb", "compress pdf 100kb"],
    linkText: "Compress PDF to 100 KB",
    blurb: "Strictest portal limit, one-page scans",
    howToTitle: "How to Compress a PDF to 100 KB",
    steps: sizeSteps("100 KB", "Extreme compression"),
    faq: [
      {
        q: "Can every PDF be compressed to 100 KB?",
        a: "No tool can promise that. A one-page scan or certificate usually ends up under 100 KB on Extreme; a long or photo-heavy PDF may not. The result tells you the exact size, so you know before you upload.",
      },
      {
        q: "My PDF is still over 100 KB. What now?",
        a: "Extreme is the strongest level, so this is as small as the tool gets it. Upload fewer pages per file if the portal allows it, or scan the document again in black and white at a lower resolution.",
      },
      {
        q: "Will the text still be readable at 100 KB?",
        a: "Extreme keeps normal printed text readable on screen, but very small print and photos become soft. Check the downloaded file before you submit it.",
      },
      {
        q: "Why does it say “still above 100 KB” when the size shows 98 KB?",
        a: "Portals count KB in two ways: 1000 or 1024 bytes. To be safe, the result only says it is under 100 KB at 100,000 bytes or less, so it passes either way. The size shown counts 1 KB as 1024 bytes, as Windows and phones do.",
      },
      privacyQ,
    ],
  },
  {
    slug: "compress-pdf-to-200kb",
    mode: "compress",
    preset: "extreme",
    targetKb: 200,
    title: "Compress PDF to 200 KB – Free Online, Nothing Uploaded",
    description: "Compress a PDF towards 200 KB for job, bank and visa portals. Extreme is preset and the result shows if it fits. Free, private, in your browser.",
    h1: "Compress PDF to 200 KB",
    h1Sub: "For Applications",
    intro:
      "200 KB is a common limit for job, exam and visa applications. Extreme compression is already chosen to make the PDF as small as possible, and the result says whether it is under 200 KB. Scans of one or two pages often are.",
    keywords: ["compress pdf to 200kb", "compress pdf under 200kb", "reduce pdf size to 200kb", "pdf to 200kb", "compress pdf 200kb"],
    linkText: "Compress PDF to 200 KB",
    blurb: "Job, exam and visa applications",
    howToTitle: "How to Compress a PDF to 200 KB",
    steps: sizeSteps("200 KB", "Extreme compression"),
    faq: [
      {
        q: "Will my PDF get under 200 KB?",
        a: "A scan of one or two pages often does on Extreme, and many files shrink by 80–95%. Longer or photo-heavy PDFs may stay above it. You see the exact size before you download, so there are no surprises at the portal.",
      },
      {
        q: "It came out at 230 KB. How do I get it lower?",
        a: "Extreme is already the strongest level here. Upload the pages in separate files if the portal allows several, or rescan the document in black and white.",
      },
      {
        q: "Why is 200 KB so hard for some PDFs?",
        a: "Each page needs a picture of the page, and a busy page (colour photos, stamps, background patterns) takes more space than plain black text on white paper. More pages means more pictures.",
      },
      privacyQ,
    ],
  },
  {
    slug: "compress-pdf-to-500kb",
    mode: "compress",
    preset: "extreme",
    targetKb: 500,
    title: "Compress PDF to 500 KB – Free and Private in Your Browser",
    description: "Compress a PDF towards 500 KB for uploads and email. Extreme is preset, and the result shows the new size and whether it fits. Nothing uploaded.",
    h1: "Compress PDF to 500 KB",
    h1Sub: "For Statements",
    intro:
      "500 KB is a typical limit for uploading statements, certificates and multi-page forms. Extreme compression is already chosen, and the result shows whether the file is under 500 KB. If it fits easily, try Recommended for sharper pages.",
    keywords: ["compress pdf to 500kb", "compress pdf under 500kb", "reduce pdf size to 500kb", "pdf to 500kb", "compress pdf 500kb"],
    linkText: "Compress PDF to 500 KB",
    blurb: "Statements and multi-page forms",
    howToTitle: "How to Compress a PDF to 500 KB",
    steps: sizeSteps("500 KB", "Extreme compression"),
    faq: [
      {
        q: "How many pages fit in 500 KB?",
        a: "It varies with the content. Plain scanned text pages often take well under 100 KB each on Extreme, so short statements and forms usually fit. Pages full of colour photos take much more.",
      },
      {
        q: "Can I get a sharper file and still stay under 500 KB?",
        a: "Yes, if there is room. Compress on Extreme first; if the result is well under 500 KB, choose Recommended and compress again for clearer text, then check it still fits.",
      },
      {
        q: "What if it is still over 500 KB?",
        a: "Extreme is the strongest level, so the result is as small as the tool can make it. Upload the pages in two files if the portal allows it.",
      },
      privacyQ,
    ],
  },
  {
    slug: "compress-pdf-to-1mb",
    mode: "compress",
    preset: "recommended",
    targetKb: 1000,
    title: "Compress PDF to 1 MB – Reduce PDF Size Free, No Upload",
    description: "Compress a PDF towards 1 MB with clear, readable pages. Recommended is preset and the result shows whether it fits. Free, private, in your browser.",
    h1: "Compress PDF to 1 MB",
    h1Sub: "Clear and Readable",
    intro:
      "A 1 MB limit leaves room for good quality, so Recommended is chosen: clear text and a much smaller file. The result tells you whether it is under 1 MB; if not, switch to Extreme and compress again.",
    keywords: ["compress pdf to 1mb", "compress pdf under 1mb", "reduce pdf size to 1mb", "pdf to 1mb", "compress pdf less than 1mb"],
    linkText: "Compress PDF to 1 MB",
    blurb: "Email attachments and larger uploads",
    howToTitle: "How to Compress a PDF to 1 MB",
    steps: sizeSteps("1 MB", "Recommended"),
    faq: [
      {
        q: "Why is Recommended chosen instead of Extreme?",
        a: "1 MB is a roomy limit for most documents, so Recommended keeps text sharper while still cutting the size a lot. If the result is still over 1 MB, choose Extreme and compress the same file again.",
      },
      {
        q: "Will a 20-page scan fit in 1 MB?",
        a: "Often, on Extreme: plain scanned pages are small once compressed. Pages with large colour photos take more space. The result shows the exact size, so you can check before you send it.",
      },
      {
        q: "Is 1 MB the same as 1000 KB?",
        a: "For the check, yes: the result only says it is under 1 MB when the file is at most 1,000,000 bytes, the stricter way portals count, so it passes whether the form means 1000 KB or 1024 KB. The size shown counts 1 KB as 1024 bytes, as Windows and phones do, so a file shown as 0.97 MB can still be just over.",
      },
      privacyQ,
    ],
  },
  {
    slug: "reduce-pdf-size",
    mode: "compress",
    preset: "recommended",
    title: "Reduce PDF Size Free – Make a PDF Smaller, Privately",
    description: "Reduce PDF file size in your browser for email, WhatsApp and uploads. See the exact saving before you download. Free, no sign-up, nothing uploaded.",
    h1: "Reduce PDF Size",
    h1Sub: "Make It Smaller",
    intro:
      "Too big to email, send on WhatsApp or upload? Reduce the PDF's file size here. Scanned and photo-heavy PDFs shrink the most, and you see the before and after size before you download.",
    keywords: ["reduce pdf size", "reduce pdf file size", "make pdf smaller", "shrink pdf", "decrease pdf size"],
    linkText: "Reduce PDF size",
    blurb: "Too big for email or WhatsApp",
    howToTitle: "How to Reduce the Size of a PDF",
    steps: [
      { title: "Add the large PDF", text: "Drop it on the box or tap to pick it from your files, downloads or WhatsApp documents." },
      { title: "Keep Recommended", text: "It balances size and clarity. Choose Extreme if you need the file as small as possible." },
      { title: "Reduce the size", text: "Tap Compress PDF. Every page is optimised on your device." },
      { title: "Compare and download", text: "Check the before and after size and the saving in percent, then download." },
    ],
    faq: [
      {
        q: "Why is my PDF so large?",
        a: "Usually because it holds scans or photos at a high resolution: a phone camera picture of a page can be several MB. Redrawing each page at a sensible resolution is what reduces the size.",
      },
      {
        q: "How do I make a PDF small enough for email?",
        a: "Most email services accept attachments up to about 20–25 MB, but smaller is faster to send. Recommended usually takes a scanned document down to a fraction of its size.",
      },
      {
        q: "Why didn't the size go down?",
        a: "Some PDFs, mostly plain text from a word processor, are already compact. Then your original file is kept and the result says so. Extreme may still help if the file contains pictures.",
      },
      privacyQ,
    ],
  },
  {
    slug: "combine-pdf",
    mode: "merge",
    title: "Combine PDF Files into One – Free, Private, No Upload",
    description: "Combine PDF files into one document in your browser: scans, receipts, forms and certificates. Reorder, then download. Nothing is uploaded.",
    h1: "Combine PDF Files",
    h1Sub: "Into One File",
    intro:
      "Portals and forms often ask for a single file. Combine your documents (application form, ID scan, certificates, receipts) into one PDF in the order you choose, then download it. Nothing leaves your device.",
    keywords: ["combine pdf", "combine pdf files", "combine pdf into one", "join pdf", "put pdfs together"],
    linkText: "Combine PDF files into one",
    blurb: "One file for forms and portals",
    howToTitle: "How to Combine PDF Files into One",
    steps: [
      { title: "Pick the documents", text: "Add every PDF the form asks for: application, ID, certificates, receipts. Add more at any time." },
      { title: "Arrange them", text: "Put them in the order the reader expects. Drag, or use the arrows, and remove extras." },
      { title: "Combine", text: "Tap Merge to build one PDF with all their pages." },
      { title: "Check the size", text: "If the portal has a size limit, compress the combined PDF in the Compress PDF tab." },
    ],
    faq: [
      {
        q: "What is the difference between combining and merging PDFs?",
        a: "None: both mean putting several PDF files together into one document. Here the pages are added one after another in the order you set.",
      },
      {
        q: "Can I combine scanned documents with normal PDFs?",
        a: "Yes. Any mix of PDFs works, including scans, forms and documents with different page sizes. Each page keeps its own size and orientation.",
      },
      {
        q: "How do I make the combined PDF small enough to upload?",
        a: "Download it, switch to the Compress PDF tab and compress it. Extreme gives the smallest file; the result shows the new size.",
      },
      privacyQ,
    ],
  },
];

export const landingBySlug = (slug: string) => LANDING_PAGES.find((p) => p.slug === slug);

/** Home page section that links to every landing page. */
export const popularTools = {
  eyebrow: "Popular tools",
  title: "Compress to a Size, Merge or Combine",
};

/** Heading of the "Related" list under a landing page. */
export const relatedTitle = "Related PDF tools";
