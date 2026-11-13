/**
 * End-to-end test of the built site (run `npm run build` first, then `npm test`).
 *
 * Serves out/ at the site's basePath like GitHub Pages, opens it in headless
 * Chromium and works on real PDFs made here with pdf-lib:
 * - Compress: a 3-page scan-like PDF at every level (smaller than the
 *   original, Extreme smallest, same page count and page size), and a tiny
 *   text PDF that is already compact (the original is kept).
 * - Merge: three PDFs with different page sizes, reordered, merged in order.
 * - A broken file shows a clear message.
 * It also fails if the page sends any request carrying data, if a request
 * goes to any server other than this site, if the browser logs an error, or
 * if the page shows anything but JaxScan (no JaxBudget, company name or email).
 * Set CHROME_PATH to use a Chrome that is already installed, and
 * TEST_PDF_DIR to keep the PDFs it makes for a look by eye.
 */
import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { chromium } from "playwright";

const OUT = fileURLToPath(new URL("../out/", import.meta.url));
const BASE = "/compress-merge-pdf";
const UTM = "utm_source%3Dweb_compress_pdf";
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2", ".txt": "text/plain", ".xml": "application/xml", ".wasm": "application/wasm", ".webmanifest": "application/manifest+json" };

// --- A tiny static server, like GitHub Pages ---------------------------------
const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (!path.startsWith(BASE)) return res.writeHead(404).end();
  let file = normalize(join(OUT, path.slice(BASE.length)));
  if (!file.startsWith(normalize(OUT))) return res.writeHead(403).end();
  if (file.endsWith("\\") || file.endsWith("/")) file = join(file, "index.html");
  try {
    const body = await readFile(file);
    res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" }).end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(0, r));
const origin = `http://localhost:${server.address().port}`;

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const page = await browser.newPage({ acceptDownloads: true });

// --- Checks ------------------------------------------------------------------
const problems = [];
const check = (ok, message) => {
  console.log(`${ok ? "  ok  " : "  FAIL"}  ${message}`);
  if (!ok) problems.push(message);
};
page.on("console", (m) => m.type() === "error" && problems.push(`Console error: ${m.text()}`));
page.on("pageerror", (e) => problems.push(`Page error: ${e.message}`));
page.on("request", (r) => {
  const url = new URL(r.url());
  if (!(url.origin === origin || url.protocol === "blob:" || url.protocol === "data:")) problems.push(`Unexpected request: ${r.url()}`);
  if (r.postData()) problems.push(`Request sent data (upload?): ${r.url()}`);
});

// --- Test PDFs ---------------------------------------------------------------
await page.goto(`${origin}${BASE}/`);

/** A scan-like page picture (paper texture, text lines), drawn in the browser at 150 dpi A4 as a high-quality JPEG. */
const scanJpeg = Buffer.from(
  await page.evaluate(async () => {
    const c = document.createElement("canvas");
    c.width = 1240;
    c.height = 1754;
    const x = c.getContext("2d");
    const img = x.createImageData(c.width, c.height);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = 235 + Math.random() * 20;
      img.data[i] = v;
      img.data[i + 1] = v - 3;
      img.data[i + 2] = v - 8;
      img.data[i + 3] = 255;
    }
    x.putImageData(img, 0, 0);
    x.fillStyle = "#1a1a1a";
    x.font = "28px serif";
    for (let y = 160; y < 1650; y += 46) x.fillText("Statement line " + y + " · Amount 1,234.56 · Reference ABCD-" + y, 110, y);
    const b = await new Promise((r) => c.toBlob(r, "image/jpeg", 0.95));
    const u = new Uint8Array(await b.arrayBuffer());
    let s = "";
    for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode(...u.subarray(i, i + 0x8000));
    return btoa(s);
  }),
  "base64",
);

async function scanPdf() {
  const doc = await PDFDocument.create();
  for (let i = 0; i < 3; i++) {
    // Each page gets its own copy of the picture, like a real 3-page scan.
    const img = await doc.embedJpg(scanJpeg);
    doc.addPage([595.28, 841.89]).drawImage(img, { x: 0, y: 0, width: 595.28, height: 841.89 });
  }
  return Buffer.from(await doc.save());
}

async function textPdf() {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  doc.addPage([595.28, 841.89]).drawText("Hello", { x: 50, y: 780, size: 12, font });
  return Buffer.from(await doc.save());
}

/** `pages` pages of `size` x `size` points, so the merged order can be checked from page sizes. */
async function sizedPdf(pages, size) {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pages; i++) doc.addPage([size, size]);
  return Buffer.from(await doc.save());
}

const pdf = (name, buffer) => ({ name, mimeType: "application/pdf", buffer });
let saved = 0;
const scan = pdf("bank statement.pdf", await scanPdf());

// --- Helpers -----------------------------------------------------------------
async function downloadResult() {
  const link = page.getByRole("link", { name: "Download PDF" });
  await link.waitFor({ timeout: 120_000 });
  const [dl] = await Promise.all([page.waitForEvent("download"), link.click()]);
  const bytes = await readFile(await dl.path());
  // Keep each PDF for a look by eye when TEST_PDF_DIR is set.
  if (process.env.TEST_PDF_DIR) await writeFile(join(process.env.TEST_PDF_DIR, `${++saved}-${dl.suggestedFilename()}`), bytes);
  return { bytes, name: dl.suggestedFilename(), doc: await PDFDocument.load(bytes) };
}

async function compress(file, level) {
  await page.goto(`${origin}${BASE}/`);
  await page.locator("#panel-compress input[type=file]").setInputFiles(file);
  await page.getByRole("button", { name: new RegExp(level) }).click();
  await page.getByRole("button", { name: "Compress PDF", exact: true }).click();
  return downloadResult();
}

// --- Tests -------------------------------------------------------------------
console.log(`Compress (original ${Math.round(scan.buffer.length / 1024)} KB, 3 pages)`);
const sizes = {};
for (const level of ["Extreme compression", "Recommended", "High quality"]) {
  const r = await compress(scan, level);
  sizes[level] = r.bytes.length;
  const { width, height } = r.doc.getPage(0).getSize();
  check(r.doc.getPageCount() === 3 && Math.abs(width - 595.28) < 1 && Math.abs(height - 841.89) < 1, `${level}: 3 A4 pages`);
  check(r.bytes.length < scan.buffer.length, `${level}: ${Math.round(r.bytes.length / 1024)} KB (${Math.round((1 - r.bytes.length / scan.buffer.length) * 100)}% smaller)`);
  check(r.name === "bank-statement-compressed.pdf", `file name ${r.name}`);
  const headline = await page.getByTestId("result-headline").textContent();
  check(/→ .* \(-\d+%\)/.test(headline), `shows the saving: "${headline}"`);
}
check(sizes["Extreme compression"] < sizes["Recommended"] && sizes["Recommended"] < sizes["High quality"], "Extreme < Recommended < High quality");
// This test scan has grain on every pixel (the hardest case); real scans compress further.
check(sizes["Extreme compression"] / 3 <= 100 * 1024, `Extreme is at most 100 KB per page (${Math.round(sizes["Extreme compression"] / 3 / 1024)} KB)`);

console.log("Already compact PDF keeps the original");
{
  const small = pdf("note.pdf", await textPdf());
  const r = await compress(small, "Recommended");
  check(r.bytes.equals(small.buffer), "original returned unchanged");
  check(await page.getByText(/already well compressed/).isVisible(), "explains it");
}

console.log("Merge");
{
  await page.goto(`${origin}${BASE}/`);
  await page.getByRole("tab", { name: "Merge PDFs" }).click();
  await page.locator("#panel-merge input[type=file]").setInputFiles([pdf("a.pdf", await sizedPdf(2, 200)), pdf("b.pdf", await sizedPdf(1, 300)), pdf("c.pdf", await sizedPdf(3, 400))]);
  await page.getByText("6 pages", { exact: false }).first().waitFor();
  await page.getByRole("button", { name: "Move c.pdf up" }).click();
  await page.getByRole("button", { name: "Move c.pdf up" }).click();
  const order = await page.getByTestId("merge-name").allTextContents();
  check(order.join(",") === "c.pdf,a.pdf,b.pdf", `order is ${order.join(",")}`);
  await page.getByRole("button", { name: "Merge 3 PDFs" }).click();
  const r = await downloadResult();
  const widths = r.doc.getPages().map((p) => p.getSize().width);
  check(widths.join(",") === "400,400,400,200,200,300", `6 pages in order (got ${widths.join(",")})`);
  check(r.name === "merged.pdf", `file name ${r.name}`);
  await page.getByRole("button", { name: "Remove a.pdf" }).click();
  check(await page.getByRole("button", { name: "Merge 2 PDFs" }).isVisible(), "removing a file updates the count");
}

console.log("Broken file");
{
  await page.goto(`${origin}${BASE}/`);
  await page.locator("#panel-compress input[type=file]").setInputFiles(pdf("broken.pdf", Buffer.from("not really a pdf")));
  await page.getByRole("button", { name: "Compress PDF", exact: true }).click();
  // Look for the message itself: Next.js adds its own (empty) role=alert announcer.
  const message = page.getByText(/broken\.pdf" doesn't look like a valid PDF/);
  await message.waitFor();
  check(await message.isVisible(), "clear error message");
  // The broken file is expected to log a PDF.js error; drop it from the problem list.
  for (let i = problems.length - 1; i >= 0; i--) if (/Console error/.test(problems[i])) problems.splice(i, 1);
}

console.log("JaxScan only");
{
  await compress(scan, "Extreme compression");
  const links = await page.locator('a[href^="https://play.google.com/"]').evaluateAll((as) => as.map((a) => a.href));
  check(links.length >= 3 && links.every((h) => h.includes("id=com.jaxenlabs.scanai") && h.includes(UTM)), `${links.length} Play links, all JaxScan with the referrer`);
  const html = await page.content();
  check(!["JaxBudget", "Jaxen Labs", "@gmail.com"].some((t) => html.includes(t)), "no JaxBudget, company name or email");
  check(await page.getByText("Compress, merge, split, sign and lock PDFs offline").isVisible(), "JaxScan card inside the result box");
}

await browser.close();
server.close();
if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n- ${[...new Set(problems)].join("\n- ")}`);
  process.exit(1);
}
console.log("\nAll tests passed.");
