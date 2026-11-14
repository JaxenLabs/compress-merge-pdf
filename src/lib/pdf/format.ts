/** "48.2 KB" / "2.40 MB" (1 KB = 1024 bytes, as Windows and phones show it). */
export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 ** 2).toFixed(2)} MB`;
}

/** "-87%" or "+12%" change from `before` to `after`. */
export function percentChange(before: number, after: number) {
  const p = Math.round(((after - before) / before) * 100);
  return `${p > 0 ? "+" : ""}${p}%`;
}

/** "bank statement.pdf" + "compressed" → "bank-statement-compressed.pdf". */
export function outputName(original: string, suffix: string) {
  const base = original.replace(/\.pdf$/i, "").replace(/[^\w.-]+/g, "-").slice(0, 60) || "document";
  return `${base}-${suffix}.pdf`;
}

/**
 * True when the file is a PDF, judged by its content: every PDF starts with
 * "%PDF-" (allowed within the first 1 KB, as the PDF standard does). The name
 * and type are not trusted, because files picked on phones (from WhatsApp,
 * Google Drive or a downloads app) often arrive with no type and no ".pdf"
 * in their name.
 */
export async function isPdf(file: File) {
  if (!file.size) return false;
  const head = new Uint8Array(await file.slice(0, 1024).arrayBuffer());
  return String.fromCharCode(...head).includes("%PDF-");
}

/** The files in `files` that are PDFs, in their original order. */
export async function onlyPdfs(files: File[]) {
  const checks = await Promise.all(files.map(isPdf));
  return files.filter((_, i) => checks[i]);
}
