/**
 * Copies what PDF.js needs at runtime from node_modules into public/pdfjs/,
 * so the site serves it itself (no CDN, nothing from another server):
 *   pdf.worker.min.js  the PDF reader that runs in a background thread
 *                      (saved as .js so every static host serves it as JavaScript)
 *   cmaps/             character maps for Chinese, Japanese and Korean text
 *   standard_fonts/    the 14 standard PDF fonts, for PDFs that don't embed them
 *   wasm/              decoders for JPEG 2000 and JBIG2 scans
 *   iccs/              colour profiles
 * Runs automatically before `npm run dev` and `npm run build`.
 */
import { cp, mkdir } from "node:fs/promises";

const from = (p) => new URL(`../node_modules/pdfjs-dist/${p}`, import.meta.url);
const to = (p) => new URL(`../public/pdfjs/${p}`, import.meta.url);

await mkdir(to(""), { recursive: true });
await cp(from("build/pdf.worker.min.mjs"), to("pdf.worker.min.js"));
for (const dir of ["cmaps", "standard_fonts", "wasm", "iccs"]) await cp(from(dir), to(dir), { recursive: true });
