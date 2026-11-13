"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { friendlyPdfError } from "@/lib/pdf/errors";
import { formatBytes, isPdf, outputName, percentChange } from "@/lib/pdf/format";
import { DEFAULT_PRESET, PRESETS, type CompressionPreset } from "@/lib/pdf/presets";
import { Dropzone } from "./Dropzone";
import { Progress } from "./Progress";
import { ResultBox } from "./ResultBox";

interface Result {
  url: string;
  size: number;
  pages: number;
  alreadySmall: boolean;
  preset: CompressionPreset["id"];
}

/** Compress mode: one PDF, a compression level, a progress bar and the before/after result. */
export function CompressPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [presetId, setPresetId] = useState<CompressionPreset["id"]>(DEFAULT_PRESET);
  const [progress, setProgress] = useState<{ page: number; total: number } | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clearResult = () =>
    setResult((old) => {
      if (old) URL.revokeObjectURL(old.url);
      return null;
    });

  const pick = (files: File[]) => {
    const pdf = files.find(isPdf);
    if (!pdf) return setError("Please choose a PDF file (.pdf).");
    clearResult();
    setError(null);
    setFile(pdf);
  };

  const compress = async () => {
    if (!file) return;
    const preset = PRESETS.find((p) => p.id === presetId)!;
    clearResult();
    setError(null);
    setProgress({ page: 0, total: 0 });
    try {
      // Loaded only now: PDF.js and pdf-lib are big and most visitors arrive just to read.
      const { compressPdf } = await import("@/lib/pdf/compress");
      const out = await compressPdf(file, preset, (page, total) => setProgress({ page, total }));
      setResult({ url: URL.createObjectURL(out.blob), size: out.blob.size, pages: out.pages, alreadySmall: out.alreadySmall, preset: preset.id });
    } catch (e) {
      console.error(e);
      setError(friendlyPdfError(e, file.name));
    } finally {
      setProgress(null);
    }
  };

  if (!file) {
    return (
      <>
        <Dropzone multiple={false} title="Choose a PDF to compress" hint="Drop it here or tap to pick it. Bank statements, contracts, IDs, scans: all stay on your device." onFiles={pick} />
        {error && <ErrorText text={error} />}
      </>
    );
  }

  const busy = progress !== null;
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-surface p-3 sm:p-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
          <Icon name="file" />
        </span>
        <p className="min-w-0 flex-1">
          <span className="block truncate font-semibold">{file.name}</span>
          <span className="text-sm text-muted">{formatBytes(file.size)}</span>
        </p>
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            clearResult();
            setFile(null);
          }}
          className="btn-ghost h-10 rounded-xl px-3.5 text-sm font-semibold disabled:opacity-50"
        >
          Change file
        </button>
      </div>

      <fieldset disabled={busy}>
        <legend className="mb-2 text-xs font-semibold tracking-wide text-muted uppercase">Compression level</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={presetId === p.id}
              onClick={() => {
                setPresetId(p.id);
                clearResult();
              }}
              className="rounded-2xl border border-border bg-surface p-4 text-left transition-colors hover:border-accent/50 aria-pressed:border-accent aria-pressed:bg-accent-soft disabled:opacity-60"
            >
              <span className="block font-semibold">{p.label}</span>
              <span className="mt-1 block text-xs leading-relaxed text-muted">{p.hint}</span>
              <span className="mt-2 block text-[0.6875rem] font-semibold text-accent">
                {p.dpi} DPI · {Math.round(p.quality * 100)}% quality
              </span>
            </button>
          ))}
        </div>
      </fieldset>

      {busy ? (
        <Progress
          label={progress.total ? `Compressing page ${progress.page} of ${progress.total}…` : "Opening PDF…"}
          done={Math.max(0, progress.page - 1)}
          total={progress.total}
        />
      ) : (
        <button type="button" onClick={compress} className="btn-primary flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-base font-semibold">
          Compress PDF
          <Icon name="right" />
        </button>
      )}

      {error && <ErrorText text={error} />}

      {result && (
        <ResultBox
          headline={result.alreadySmall ? `${formatBytes(result.size)}: already compact` : `${formatBytes(file.size)} → ${formatBytes(result.size)} (${percentChange(file.size, result.size)})`}
          details={`${result.pages} page${result.pages > 1 ? "s" : ""} · ${PRESETS.find((p) => p.id === result.preset)!.label} · made on your device`}
          note={result.alreadySmall ? "This PDF is already well compressed, so your original file is kept. Try Extreme compression for a smaller file." : undefined}
          href={result.url}
          fileName={outputName(file.name, "compressed")}
        />
      )}
    </div>
  );
}

export function ErrorText({ text }: { text: string }) {
  return (
    <p role="alert" className="mt-3 rounded-xl border border-danger/40 px-4 py-3 text-sm text-danger">
      {text}
    </p>
  );
}
