import { PDFDocument } from "pdf-lib";
import { SITE_URL, site } from "@/content/site";

/**
 * Merging with pdf-lib: pages are copied as they are (text, links and
 * quality kept), in the order given. Nothing is redrawn or uploaded.
 */

/** Opens a PDF to count its pages; throws (with a readable error) if it is not a PDF or is password-protected. */
export async function countPages(file: Blob) {
  const doc = await PDFDocument.load(await file.arrayBuffer(), { updateMetadata: false });
  return doc.getPageCount();
}

export async function mergePdfs(files: Blob[], onProgress: (done: number, total: number) => void) {
  const out = await PDFDocument.create();
  out.setProducer(site.brandName);
  out.setCreator(SITE_URL);
  for (let i = 0; i < files.length; i++) {
    onProgress(i, files.length);
    const doc = await PDFDocument.load(await files[i].arrayBuffer());
    const pages = await out.copyPages(doc, doc.getPageIndices());
    pages.forEach((p) => out.addPage(p));
  }
  onProgress(files.length, files.length);
  const bytes = await out.save();
  return { blob: new Blob([bytes as BlobPart], { type: "application/pdf" }), pages: out.getPageCount() };
}
