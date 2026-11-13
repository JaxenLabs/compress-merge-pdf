# Compress PDF by JaxScan

Free PDF compressor and merger that runs **100% in the browser**: PDFs are never uploaded. Safe for bank statements, contracts and IDs.

Live: **https://jaxenlabs.github.io/compress-merge-pdf/** (moving to compressmergepdf.com)

## What it does

- **Compress PDF** (default tab): PDF.js draws each page on a `<canvas>`, the page is saved as JPEG, and pdf-lib rebuilds the PDF with the same page sizes. There are three levels: Extreme (96 DPI, 45%), Recommended (130 DPI, 65%) and High quality (180 DPI, 82%). A progress bar shows "Compressing page X of Y", and the result shows before → after with the saving (e.g. `3.06 MB → 283 KB (-91%)`). If the result isn't smaller, the original is kept and the page says so. Compressed pages are images, so their text can't be selected (the FAQ explains this).
- **Merge PDFs** tab: add several PDFs and see each one's page count. Reorder by dragging or with the arrows, remove files, then merge with pdf-lib. Pages are copied as they are, so quality, text and links are kept.
- Clear messages for files that aren't valid PDFs or are password-protected.
- **JaxScan promotion:** a Get JaxScan button in the header, a pinned side card on screens 1480px and wider, a card inside the result box, a feature section, a sticky bar on phones and tablets, and a footer card. The text is in `src/content/jaxscan.ts`; Google Play links carry `referrer=utm_source=web_compress_pdf…` plus the button they came from.

## Tech

Next.js 16 (App Router, static export) + TypeScript + Tailwind CSS 4, `pdf-lib` and `pdfjs-dist` (both loaded only when a PDF is processed).
PDF.js's worker, character maps, standard fonts, image decoders and colour profiles are copied from `node_modules` into `public/pdfjs/` by `scripts/copy-pdfjs.mjs` (runs before `dev` and `build`; not committed), so the site loads nothing from another server.

```
src/
  app/               page, layout (<head> / SEO), robots, sitemap, manifest, icons, share image
  components/        header, footer, FAQ, JaxScan promo, sticky banner
  components/pdf/    PdfTool (tabs), CompressPanel, MergePanel, Dropzone, Progress, ResultBox
  content/           site.ts (name, URL, keywords), page.ts (page text, levels, FAQ, app facts), jaxscan.ts (JaxScan)
  lib/pdf/           pdfjs (loader), compress, merge, presets, errors, format
  lib/seo.ts         JSON-LD: WebApplication, FAQPage, HowTo, WebSite, Organization
scripts/
  copy-pdfjs.mjs     copies PDF.js runtime files into public/pdfjs/
  make-images.mjs    renders icons, favicon and share image from public/jaxscan-icon.png
  test.mjs           end-to-end test in a real browser with real PDFs
```

## Commands

```bash
npm install
npm run dev        # http://localhost:3000/compress-merge-pdf/
npm run check      # typecheck + lint + build (to out/)
npm test           # end-to-end test of out/ (needs Playwright's Chromium: npx playwright install chromium)
npm run images     # rebuild icons and share image
```

Every push to `main` deploys to GitHub Pages (`.github/workflows/deploy.yml`).

## Moving to a custom domain (compressmergepdf.com)

1. In `src/content/site.ts`, set `origin: "https://compressmergepdf.com"` and `basePath: ""`.
2. Add `public/CNAME` containing `compressmergepdf.com`.
3. Point the domain's DNS at GitHub Pages and set the custom domain in the repo's **Settings → Pages**.
