/**
 * Compression levels. Each page is redrawn as an image at `dpi` and saved as
 * JPEG at `quality`: lower means a smaller file and a softer page.
 */
export interface CompressionPreset {
  id: "extreme" | "recommended" | "high";
  label: string;
  hint: string;
  dpi: number;
  quality: number;
}

export const PRESETS: CompressionPreset[] = [
  { id: "extreme", label: "Extreme compression", hint: "Smallest file, for portal uploads with a KB limit", dpi: 96, quality: 0.45 },
  { id: "recommended", label: "Recommended", hint: "Clear text and a much smaller file", dpi: 130, quality: 0.65 },
  { id: "high", label: "High quality", hint: "Light compression, sharpest pages", dpi: 180, quality: 0.82 },
];

export const DEFAULT_PRESET: CompressionPreset["id"] = "recommended";
