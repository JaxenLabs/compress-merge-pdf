import { site } from "@/content/site";
// Must run before PDF.js loads (see the file for why).
import "./polyfills.mjs";

/**
 * Loads PDF.js (about 1 MB) only when a PDF is actually compressed, and
 * points it at the worker, fonts and decoders this site serves itself from
 * /pdfjs/ (copied there by scripts/copy-pdfjs.mjs), so nothing is fetched
 * from another server.
 *
 * This is PDF.js's "legacy" build (the same version, with fallbacks for
 * most missing browser features), plus ./polyfills.mjs for the few it
 * leaves out. The standard build calls Math.sumPrecise, Promise.withResolvers
 * and other very new features directly, so on older phones and in-app
 * browsers (a link opened inside Facebook, WhatsApp or Messenger) every PDF
 * failed to open with "Promise.withResolvers is not a function". The worker
 * is the matching legacy one, with the same fallbacks (copy-pdfjs.mjs).
 */
const ROOT = `${site.basePath}/pdfjs`;

let ready: Promise<typeof import("pdfjs-dist")> | undefined;

function loadPdfjs() {
  ready ??= import("pdfjs-dist/legacy/build/pdf.mjs").then((pdfjs) => {
    pdfjs.GlobalWorkerOptions.workerSrc = `${ROOT}/pdf.worker.min.js`;
    return pdfjs;
  });
  return ready;
}

/** Thrown by openPdf for a password-protected PDF: `wrong` when a password was given and didn't match. */
export class PdfPasswordError extends Error {
  constructor(readonly wrong: boolean) {
    super(wrong ? "Wrong password" : "Password required");
    this.name = "PdfPasswordError";
  }
}

/**
 * Opens a PDF from its bytes (with `password` for a protected one). Pages are
 * drawn on this page's own canvases (we need their pixels). Call `close()`
 * when done to free the worker's memory. PDF.js takes ownership of `data`,
 * so pass fresh bytes for every attempt.
 */
export async function openPdf(data: Uint8Array, password?: string) {
  const pdfjs = await loadPdfjs();
  const task = pdfjs.getDocument({
    data,
    password,
    cMapUrl: `${ROOT}/cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `${ROOT}/standard_fonts/`,
    wasmUrl: `${ROOT}/wasm/`,
    iccUrl: `${ROOT}/iccs/`,
    disableWorkerRendering: true,
  });
  try {
    return { doc: await task.promise, close: () => task.destroy() };
  } catch (e) {
    await task.destroy();
    if (e instanceof pdfjs.PasswordException) throw new PdfPasswordError(e.code === pdfjs.PasswordResponses.INCORRECT_PASSWORD);
    throw e;
  }
}
