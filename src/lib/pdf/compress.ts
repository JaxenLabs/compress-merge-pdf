import { PDFDocument } from "pdf-lib";
import { SITE_URL, site } from "@/content/site";
import { openPdf } from "./pdfjs";
import type { CompressionPreset } from "./presets";

/**
 * Compresses a PDF in the browser: PDF.js draws each page on a <canvas> at
 * the preset's resolution, the picture is saved as JPEG, and pdf-lib puts the
 * pictures into a new PDF with the same page sizes. Scans and photo-heavy
 * PDFs shrink the most. Text becomes part of the page image, so it can no
 * longer be selected (the page explains this).
 */

export interface CompressResult {
  blob: Blob;
  pages: number;
  /** True when the compressed file was not smaller, so the original is returned unchanged. */
  alreadySmall: boolean;
}

/** Phones refuse canvases much bigger than this; very large pages are drawn a little lower to fit. */
const MAX_PIXELS = 16_000_000;

function toJpeg(canvas: HTMLCanvasElement, quality: number): Promise<Uint8Array> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? b.arrayBuffer().then((buf) => resolve(new Uint8Array(buf)), reject) : reject(new Error("Your browser could not draw this page."))),
      "image/jpeg",
      quality,
    ),
  );
}

export async function compressPdf(file: Blob, preset: CompressionPreset, onProgress: (page: number, total: number) => void): Promise<CompressResult> {
  const original = new Uint8Array(await file.arrayBuffer());
  // PDF.js takes ownership of the bytes it is given, so it gets a copy.
  const { doc, close } = await openPdf(original.slice());
  const out = await PDFDocument.create();
  out.setProducer(site.brandName);
  out.setCreator(SITE_URL);
  // One canvas, reused for every page; PDF.js draws on it.
  const canvas = document.createElement("canvas");

  try {
    for (let n = 1; n <= doc.numPages; n++) {
      onProgress(n, doc.numPages);
      const page = await doc.getPage(n);
      // Page size in points (1/72 inch), already turned if the page is rotated.
      const size = page.getViewport({ scale: 1 });
      let scale = preset.dpi / 72;
      const pixels = size.width * size.height * scale * scale;
      if (pixels > MAX_PIXELS) scale *= Math.sqrt(MAX_PIXELS / pixels);
      const viewport = page.getViewport({ scale });
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      await page.render({ canvas, viewport, background: "#ffffff" }).promise;
      const image = await out.embedJpg(await toJpeg(canvas, preset.quality));
      out.addPage([size.width, size.height]).drawImage(image, { x: 0, y: 0, width: size.width, height: size.height });
      page.cleanup();
    }
  } finally {
    // Free the canvas memory straight away (matters on phones) and close the document.
    canvas.width = canvas.height = 0;
    await close();
  }

  const bytes = await out.save();
  if (bytes.length >= original.length) {
    return { blob: new Blob([original as BlobPart], { type: "application/pdf" }), pages: out.getPageCount(), alreadySmall: true };
  }
  return { blob: new Blob([bytes as BlobPart], { type: "application/pdf" }), pages: out.getPageCount(), alreadySmall: false };
}
