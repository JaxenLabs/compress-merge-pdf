/**
 * Renders the site's icons and share image from the JaxScan app icon
 * (public/jaxscan-icon.png, 512x512, also used by the web app manifest)
 * with a headless browser:
 *   src/app/apple-icon.png       180x180  (iPhone home screen)
 *   src/app/icon1.png            192x192  (Google search results favicon: a multiple of 48px)
 *   public/favicon.ico           48x48    (browsers that ask for /favicon.ico; PNG inside an .ico)
 *   src/app/opengraph-image.png  1200x630 (preview card when the link is shared)
 * Run after changing the icon or the site title: `npm run images`.
 * Uses Playwright's Chromium; set CHROME_PATH to use another Chrome.
 */
import { readFile, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

/** Share-image wording for this tool. */
const SHARE = {
  name: "Compress PDF",
  title: "Compress & Merge PDF",
  subtitle: "Under 200 KB for portals · no upload",
  chips: ["100% private", "0 bytes uploaded", "Free", "No watermark"],
  alt: "Compress PDF by JaxScan: compress PDF under 200 KB and merge PDFs, 100% private in your browser",
};

const root = new URL("../", import.meta.url);
const png = await readFile(new URL("public/jaxscan-icon.png", root));
const iconUrl = `data:image/png;base64,${png.toString("base64")}`;

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const page = await browser.newPage();

async function shot(html, width, height) {
  await page.setViewportSize({ width, height });
  await page.setContent(`<html><body style="margin:0">${html}</body></html>`);
  await page.waitForLoadState("networkidle");
  return page.screenshot({ omitBackground: true });
}

const icon = (size) => shot(`<img src="${iconUrl}" width="${size}" height="${size}" style="display:block">`, size, size);

/** Wraps a PNG in the .ico container (one image), which every browser and Google accept. */
function pngToIco(png, size) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // one image
  header.writeUInt8(size, 6);
  header.writeUInt8(size, 7);
  header.writeUInt16LE(1, 10); // colour planes
  header.writeUInt16LE(32, 12); // bits per pixel
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18); // image data starts after this header
  return Buffer.concat([header, png]);
}

await writeFile(new URL("src/app/apple-icon.png", root), await icon(180));
await writeFile(new URL("src/app/icon1.png", root), await icon(192));
await writeFile(new URL("public/favicon.ico", root), pngToIco(await icon(48), 48));

const og = `
<div style="width:1200px;height:630px;box-sizing:border-box;padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between;
  font-family:'Segoe UI',Inter,Arial,sans-serif;color:#eef3f6;
  background:radial-gradient(700px 420px at 0% 0%,rgba(52,227,160,.28),transparent 70%),radial-gradient(600px 400px at 100% 10%,rgba(34,211,238,.22),transparent 70%),#05080d">
  <div style="display:flex;align-items:center;gap:22px">
    <img src="${iconUrl}" width="88" height="88" style="border-radius:20px">
    <div style="font-size:40px;font-weight:700">${SHARE.name} <span style="color:#8d9aa8;font-weight:500">by JaxScan</span></div>
  </div>
  <div>
    <div style="font-size:76px;font-weight:800;line-height:1.05;letter-spacing:-1.5px">${SHARE.title}</div>
    <div style="font-size:40px;font-weight:600;margin-top:14px;background:linear-gradient(100deg,#34e3a0,#22d3ee);-webkit-background-clip:text;color:transparent">${SHARE.subtitle}</div>
  </div>
  <div style="display:flex;gap:14px;font-size:26px;font-weight:600">
    ${SHARE.chips
      .map((t) => `<span style="padding:12px 22px;border-radius:999px;border:2px solid rgba(52,227,160,.45);color:#34e3a0;background:rgba(52,227,160,.1)">${t}</span>`)
      .join("")}
  </div>
</div>`;
await writeFile(new URL("src/app/opengraph-image.png", root), await shot(og, 1200, 630));
await writeFile(new URL("src/app/opengraph-image.alt.txt", root), SHARE.alt);

await browser.close();
console.log("Images written.");
