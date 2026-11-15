import type { CompressionPreset } from "./presets";

/**
 * Target sizes for the "compress PDF to 100 KB" pages. There is no
 * exact-size mode: the levels do the work, and the result tells the visitor
 * whether the file fits and what to try next when it doesn't.
 *
 * The check counts 1 KB as 1000 bytes (100 KB = 100,000 bytes, 1 MB = 1000 KB),
 * the stricter of the two ways portals count, so a file that passes here
 * passes any portal. Sizes are still shown with 1 KB = 1024 bytes
 * (formatBytes), so a file shown as "98.5 KB" can be over a 100 KB target;
 * the note then gives the limit in bytes.
 *
 * Kept free of other imports so scripts/test.mjs can test it directly.
 */

/** "100 KB", "1 MB" (a target of 1000 KB). */
export const sizeLabel = (kb: number) => (kb >= 1000 ? `${kb / 1000} MB` : `${kb} KB`);

/** True when `bytes` is at most the target (1 KB = 1000 bytes). */
export const fitsTarget = (bytes: number, targetKb: number) => bytes <= targetKb * 1000;

/** The line shown under the compress result on a target-size page. */
export function targetNote(size: number, targetKb: number, preset: CompressionPreset["id"]) {
  const limit = sizeLabel(targetKb);
  if (fitsTarget(size, targetKb)) return `Under ${limit}: ready to upload.`;
  const above = `Still above ${limit} (${(targetKb * 1000).toLocaleString("en-US")} bytes).`;
  if (preset !== "extreme") return `${above} Choose Extreme compression and compress again for a smaller file.`;
  return `${above} This is as small as Extreme compression makes this PDF; upload fewer pages per file, or rescan it in black and white.`;
}
