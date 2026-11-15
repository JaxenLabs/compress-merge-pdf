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
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { chromium } from "playwright";

const OUT = fileURLToPath(new URL("../out/", import.meta.url));
const BASE = "";
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

/**
 * A one-page PDF protected with `password` (the standard PDF security
 * handler, revision 2: RC4 with a 40-bit key), built by hand because no
 * library here encrypts PDFs. Text: "Locked statement page".
 */
function encryptedPdf(password) {
  const md5 = (...parts) => createHash("md5").update(Buffer.concat(parts)).digest();
  const rc4 = (key, data) => {
    const s = [...Array(256).keys()];
    for (let i = 0, j = 0; i < 256; i++) {
      j = (j + s[i] + key[i % key.length]) & 255;
      [s[i], s[j]] = [s[j], s[i]];
    }
    const out = Buffer.alloc(data.length);
    for (let n = 0, i = 0, j = 0; n < data.length; n++) {
      i = (i + 1) & 255;
      j = (j + s[i]) & 255;
      [s[i], s[j]] = [s[j], s[i]];
      out[n] = data[n] ^ s[(s[i] + s[j]) & 255];
    }
    return out;
  };
  const PAD = Buffer.from("28BF4E5E4E758A4164004E56FFFA01082E2E00B6D0683E802F0CA9FE6453697A", "hex");
  const padded = (pw) => Buffer.concat([Buffer.from(pw, "latin1"), PAD]).subarray(0, 32);
  const id = Buffer.from("0123456789abcdef0123456789abcdef", "hex");
  const P = -4;
  const O = rc4(md5(padded("owner-secret")).subarray(0, 5), padded(password));
  const pBytes = Buffer.alloc(4);
  pBytes.writeInt32LE(P);
  const key = md5(padded(password), O, pBytes, id).subarray(0, 5);
  const U = rc4(key, PAD);
  const objectKey = (num) => md5(key, Buffer.from([num & 255, (num >> 8) & 255, (num >> 16) & 255, 0, 0])).subarray(0, 10);
  const content = rc4(objectKey(4), Buffer.from("BT /F1 24 Tf 72 720 Td (Locked statement page) Tj ET"));
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    Buffer.concat([Buffer.from(`<< /Length ${content.length} >>\nstream\n`), content, Buffer.from("\nendstream")]),
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Filter /Standard /V 1 /R 2 /O <${O.toString("hex")}> /U <${U.toString("hex")}> /P ${P} >>`,
  ];
  const parts = [Buffer.from("%PDF-1.4\n")];
  const offsets = [];
  let length = parts[0].length;
  objects.forEach((body, i) => {
    offsets.push(length);
    const chunk = Buffer.concat([Buffer.from(`${i + 1} 0 obj\n`), Buffer.isBuffer(body) ? body : Buffer.from(body), Buffer.from("\nendobj\n")]);
    parts.push(chunk);
    length += chunk.length;
  });
  const xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("")}`;
  const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Encrypt 6 0 R /ID [<${id.toString("hex")}> <${id.toString("hex")}>] >>\nstartxref\n${length}\n%%EOF\n`;
  return Buffer.concat([...parts, Buffer.from(xref + trailer)]);
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

console.log("Not a PDF, broken file");
{
  await page.goto(`${origin}${BASE}/`);
  await page.locator("#panel-compress input[type=file]").setInputFiles(pdf("photo.pdf", Buffer.from("not really a pdf")));
  await page.getByText("Please choose a PDF file (.pdf).").waitFor();
  check(true, "a file that isn't a PDF (whatever its name) is explained");
  await page.getByRole("tab", { name: "Merge PDFs" }).click();
  await page.locator("#panel-merge input[type=file]").setInputFiles([pdf("a.pdf", await sizedPdf(1, 200)), { name: "notes.txt", mimeType: "text/plain", buffer: Buffer.from("hello") }]);
  await page.getByText("Skipped 1 file(s) that are not PDFs.").waitFor();
  check(await page.getByTestId("merge-name").count() === 1, "merge skips files that aren't PDFs");
  await page.goto(`${origin}${BASE}/`);
  await page.locator("#panel-compress input[type=file]").setInputFiles(pdf("broken.pdf", Buffer.from("%PDF-1.7\nthis file was cut off")));
  await page.getByRole("button", { name: "Compress PDF", exact: true }).click();
  // Look for the message itself: Next.js adds its own (empty) role=alert announcer.
  const message = page.getByText(/broken\.pdf" doesn't look like a valid PDF/);
  await message.waitFor();
  check(await message.isVisible(), "clear error message");
  // The broken file is expected to log a PDF.js error; drop it from the problem list.
  for (let i = problems.length - 1; i >= 0; i--) if (/Console error/.test(problems[i])) problems.splice(i, 1);
}

console.log("Password-protected PDF");
{
  await page.goto(`${origin}${BASE}/`);
  await page.locator("#panel-compress input[type=file]").setInputFiles(pdf("statement.pdf", encryptedPdf("1234")));
  await page.getByRole("button", { name: "Compress PDF", exact: true }).click();
  await page.getByLabel("PDF password").waitFor();
  check(await page.getByText("This PDF is password-protected").isVisible(), "asks for the password instead of failing");
  await page.getByLabel("PDF password").fill("0000");
  await page.getByRole("button", { name: "Unlock & Compress PDF" }).click();
  await page.getByText(/That password isn.t right/).waitFor();
  check(true, "a wrong password is explained, and it asks again");
  await page.getByLabel("PDF password").fill("1234");
  await page.getByRole("button", { name: "Unlock & Compress PDF" }).click();
  const r = await downloadResult();
  check(r.doc.getPageCount() === 1 && !r.doc.isEncrypted, "the right password gives an unlocked compressed copy");
}

console.log("Phone files and older browsers");
{
  // Phones often hand over PDFs with no ".pdf" in the name and no type.
  const nameless = { name: "document", mimeType: "", buffer: scan.buffer };
  await page.goto(`${origin}${BASE}/`);
  await page.locator("#panel-compress input[type=file]").setInputFiles(nameless);
  await page.getByRole("button", { name: "Compress PDF", exact: true }).click();
  check((await downloadResult()).doc.getPageCount() === 3, "a PDF with no .pdf name and no type compresses");

  // An older browser (or an in-app browser) without these newer features.
  const OLD = `try { delete Promise.withResolvers; delete Math.sumPrecise; delete Uint8Array.fromBase64; delete Uint8Array.prototype.toHex;
    delete Uint8Array.prototype.toBase64; delete Response.prototype.bytes; delete Blob.prototype.bytes; delete AbortSignal.any; delete Crypto.prototype.randomUUID; } catch {}`;
  const old = await browser.newContext({ acceptDownloads: true });
  await old.addInitScript(OLD);
  // Workers don't run init scripts, so the same features are removed at the top of the PDF.js worker.
  await old.route("**/pdfjs/pdf.worker.min.js", async (route) => {
    const res = await route.fetch();
    route.fulfill({ response: res, body: OLD + (await res.text()) });
  });
  const p2 = await old.newPage();
  p2.on("pageerror", (e) => problems.push(`Page error (older browser): ${e.message}`));
  await p2.goto(`${origin}${BASE}/`);
  check((await p2.evaluate(() => typeof Promise.withResolvers)) === "undefined", "older browser simulated");
  await p2.locator("#panel-compress input[type=file]").setInputFiles(pdf("note.pdf", await textPdf()));
  await p2.getByRole("button", { name: "Extreme compression" }).click();
  await p2.getByRole("button", { name: "Compress PDF", exact: true }).click();
  await p2.getByRole("link", { name: "Download PDF" }).or(p2.locator('p[role="alert"]')).first().waitFor({ timeout: 120_000 });
  check((await p2.getByRole("link", { name: "Download PDF" }).count()) === 1, "older browser: compress works");
  await p2.getByRole("tab", { name: "Merge PDFs" }).click();
  await p2.locator("#panel-merge input[type=file]").setInputFiles([pdf("a.pdf", await sizedPdf(2, 200)), pdf("b.pdf", await sizedPdf(1, 300))]);
  await p2.getByRole("button", { name: "Merge 2 PDFs" }).click();
  await p2.getByRole("link", { name: "Download PDF" }).or(p2.locator('p[role="alert"]')).first().waitFor({ timeout: 60_000 });
  check((await p2.getByRole("link", { name: "Download PDF" }).count()) === 1, "older browser: merge works");
  await old.close();
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
