import { site } from "@/content/site";

/**
 * Loads PDF.js (about 1 MB) only when a PDF is actually compressed, and
 * points it at the worker, fonts and decoders this site serves itself from
 * /pdfjs/ (copied there by scripts/copy-pdfjs.mjs), so nothing is fetched
 * from another server.
 */
const ROOT = `${site.basePath}/pdfjs`;

let ready: Promise<typeof import("pdfjs-dist")> | undefined;

function loadPdfjs() {
  ready ??= import("pdfjs-dist").then((pdfjs) => {
    pdfjs.GlobalWorkerOptions.workerSrc = `${ROOT}/pdf.worker.min.js`;
    return pdfjs;
  });
  return ready;
}

/**
 * Opens a PDF from its bytes. Pages are drawn on this page's own canvases
 * (we need their pixels). Call `close()` when done to free the worker's memory.
 */
export async function openPdf(data: Uint8Array) {
  const pdfjs = await loadPdfjs();
  const task = pdfjs.getDocument({
    data,
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
    throw e;
  }
}
