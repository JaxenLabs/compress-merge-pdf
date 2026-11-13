/** Turns a PDF library error into a sentence a visitor understands. */
export function friendlyPdfError(e: unknown, name: string) {
  const text = e instanceof Error ? `${e.name} ${e.message}` : String(e);
  if (/password|encrypt/i.test(text)) return `"${name}" is password-protected. Unlock it first, then try again.`;
  if (/invalid pdf|no pdf header|failed to parse|corrupt|unexpected|xref/i.test(text)) return `"${name}" doesn't look like a valid PDF file.`;
  return `"${name}" could not be read. ${e instanceof Error ? e.message : ""}`.trim();
}
