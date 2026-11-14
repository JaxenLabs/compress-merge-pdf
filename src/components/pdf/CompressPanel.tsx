"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { friendlyPdfError } from "@/lib/pdf/errors";
import { formatBytes, onlyPdfs, outputName, percentChange } from "@/lib/pdf/format";
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

/**
 * Compress mode: one PDF, a compression level, a progress bar and the
 * before/after result. A password-protected PDF asks for its password and
 * is compressed into an unlocked copy.
 */
export function CompressPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [presetId, setPresetId] = useState<CompressionPreset["id"]>(DEFAULT_PRESET);
  const [progress, setProgress] = useState<{ page: number; total: number } | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  /** Set when the PDF turned out to be password-protected (`wrong` after a wrong attempt). */
  const [locked, setLocked] = useState<{ wrong: boolean } | null>(null);
  const [password, setPassword] = useState("");

  const clearResult = () =>
    setResult((old) => {
      if (old) URL.revokeObjectURL(old.url);
      return null;
    });

  const pick = async (files: File[]) => {
    const [pdf] = await onlyPdfs(files);
    if (!pdf) return setError("Please choose a PDF file (.pdf).");
    clearResult();
    setError(null);
    setLocked(null);
    setPassword("");
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
      const [{ compressPdf }, { PdfPasswordError }] = await Promise.all([import("@/lib/pdf/compress"), import("@/lib/pdf/pdfjs")]);
      try {
        const out = await compressPdf(file, preset, (page, total) => setProgress({ page, total }), locked ? password : undefined);
        setResult({ url: URL.createObjectURL(out.blob), size: out.blob.size, pages: out.pages, alreadySmall: out.alreadySmall, preset: preset.id });
      } catch (e) {
        if (!(e instanceof PdfPasswordError)) throw e;
        // Ask for the password (again, if it was wrong) instead of showing an error.
        setLocked({ wrong: e.wrong });
      }
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
          <Icon name={locked ? "lock" : "file"} />
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
            setLocked(null);
            setPassword("");
            setFile(null);
          }}
          className="btn-ghost h-10 rounded-xl px-3.5 text-sm font-semibold disabled:opacity-50"
        >
          Change file
        </button>
      </div>

      {locked && (
        <label className="block rounded-2xl border border-border bg-surface p-4">
          <span className="block text-sm font-semibold">This PDF is password-protected</span>
          <span className="mt-0.5 block text-sm text-muted">Type its password to compress it. The compressed copy won&rsquo;t need a password. Nothing leaves your device.</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && password && compress()}
            disabled={busy}
            autoFocus
            autoComplete="off"
            placeholder="PDF password"
            aria-label="PDF password"
            aria-invalid={locked.wrong}
            className={`mt-3 h-12 w-full rounded-xl border bg-surface-strong px-3 text-base font-semibold outline-none focus:border-accent ${locked.wrong ? "border-danger" : "border-border"}`}
          />
          {locked.wrong && <span className="mt-1 block text-sm text-danger">That password isn&rsquo;t right. Please try again.</span>}
        </label>
      )}

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
        <button
          type="button"
          onClick={compress}
          disabled={!!locked && !password}
          className="btn-primary flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-base font-semibold"
        >
          {locked ? "Unlock & Compress PDF" : "Compress PDF"}
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
