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

/** True when the file looks like a PDF (by name, type or its "%PDF" header is checked later when loading). */
export function isPdf(file: File) {
  return file.type === "application/pdf" || /\.pdf$/i.test(file.name);
}
