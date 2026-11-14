"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { friendlyPdfError } from "@/lib/pdf/errors";
import { formatBytes, onlyPdfs } from "@/lib/pdf/format";
import { ErrorText } from "./CompressPanel";
import { Dropzone } from "./Dropzone";
import { Progress } from "./Progress";
import { ResultBox } from "./ResultBox";

interface Entry {
  id: string;
  file: File;
  /** Null while it is being counted. */
  pages: number | null;
  error?: string;
}

/** Ids for the file list (a counter: crypto.randomUUID() is missing on older iPhones). */
let nextId = 0;

/** Moves one entry of a list from index `from` to index `to`. */
function move<T>(list: T[], from: number, to: number) {
  const next = list.slice();
  const [it] = next.splice(from, 1);
  next.splice(to, 0, it);
  return next;
}

/** Merge mode: several PDFs, their page counts, reordering (drag or arrows) and one merged PDF. */
export function MergePanel() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [result, setResult] = useState<{ url: string; size: number; pages: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clearResult = () =>
    setResult((old) => {
      if (old) URL.revokeObjectURL(old.url);
      return null;
    });

  const update = (next: Entry[]) => {
    setEntries(next);
    clearResult();
  };

  const add = async (files: File[]) => {
    const pdfs = await onlyPdfs(files);
    setError(pdfs.length < files.length ? `Skipped ${files.length - pdfs.length} file(s) that are not PDFs.` : null);
    if (!pdfs.length) return;
    const added = pdfs.map((file) => ({ id: String(++nextId), file, pages: null }));
    setEntries((cur) => [...cur, ...added]);
    clearResult();
    // Count pages in the background; pdf-lib is loaded only now.
    const { countPages } = await import("@/lib/pdf/merge");
    for (const entry of added) {
      const patch = await countPages(entry.file).then(
        (pages) => ({ pages }),
        (e) => ({ pages: 0, error: friendlyPdfError(e, entry.file.name) }),
      );
      setEntries((cur) => cur.map((x) => (x.id === entry.id ? { ...x, ...patch } : x)));
    }
  };

  const valid = entries.filter((e) => !e.error && e.pages);
  const counting = entries.some((e) => e.pages === null);
  const totalPages = valid.reduce((n, e) => n + (e.pages ?? 0), 0);

  const merge = async () => {
    clearResult();
    setError(null);
    setProgress({ done: 0, total: valid.length });
    try {
      const { mergePdfs } = await import("@/lib/pdf/merge");
      const out = await mergePdfs(
        valid.map((e) => e.file),
        (done, total) => setProgress({ done, total }),
      );
      setResult({ url: URL.createObjectURL(out.blob), size: out.blob.size, pages: out.pages });
    } catch (e) {
      console.error(e);
      setError(friendlyPdfError(e, "One of the files"));
    } finally {
      setProgress(null);
    }
  };

  if (!entries.length) {
    return (
      <>
        <Dropzone multiple title="Choose PDFs to merge" hint="Add two or more PDF files. You can put them in any order before merging." onFiles={add} />
        {error && <ErrorText text={error} />}
      </>
    );
  }

  const busy = progress !== null;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold">
          {entries.length} file{entries.length > 1 ? "s" : ""} · {totalPages} page{totalPages === 1 ? "" : "s"}
          <span className="ml-2 font-normal text-muted">Drag or use the arrows to reorder</span>
        </p>
        <div className="flex gap-2">
          <Dropzone multiple compact title="Add more" hint="" onFiles={add} />
          <button type="button" onClick={() => update([])} disabled={busy} className="btn-ghost h-11 rounded-xl px-4 text-sm font-semibold text-muted">
            Clear all
          </button>
        </div>
      </div>

      <ol className="space-y-2">
        {entries.map((e, i) => (
          <li
            key={e.id}
            draggable={!busy}
            onDragStart={() => setDragIndex(i)}
            onDragOver={(ev) => dragIndex !== null && ev.preventDefault()}
            onDrop={(ev) => {
              if (dragIndex === null) return;
              ev.preventDefault();
              ev.stopPropagation();
              if (dragIndex !== i) update(move(entries, dragIndex, i));
              setDragIndex(null);
            }}
            onDragEnd={() => setDragIndex(null)}
            className={`flex items-center gap-3 rounded-2xl border bg-surface p-2.5 pl-3 transition ${dragIndex === i ? "opacity-40" : ""} ${
              e.error ? "border-danger/40" : "border-border"
            } cursor-grab active:cursor-grabbing`}
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent-soft text-sm font-bold text-accent">{i + 1}</span>
            <p className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold" data-testid="merge-name">
                {e.file.name}
              </span>
              <span className={`text-xs ${e.error ? "text-danger" : "text-muted"}`}>
                {e.error ?? (e.pages === null ? "Counting pages…" : `${e.pages} page${e.pages > 1 ? "s" : ""} · ${formatBytes(e.file.size)}`)}
              </span>
            </p>
            <IconButton label={`Move ${e.file.name} up`} icon="up" disabled={busy || i === 0} onClick={() => update(move(entries, i, i - 1))} />
            <IconButton label={`Move ${e.file.name} down`} icon="down" disabled={busy || i === entries.length - 1} onClick={() => update(move(entries, i, i + 1))} />
            <IconButton label={`Remove ${e.file.name}`} icon="trash" disabled={busy} onClick={() => update(entries.filter((x) => x.id !== e.id))} danger />
          </li>
        ))}
      </ol>

      {busy ? (
        <Progress label={`Merging file ${Math.min(progress.done + 1, progress.total)} of ${progress.total}…`} done={progress.done} total={progress.total} />
      ) : (
        <button
          type="button"
          onClick={merge}
          disabled={valid.length < 2 || counting}
          className="btn-primary flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-base font-semibold"
        >
          {counting ? "Reading files…" : valid.length < 2 ? "Add at least 2 PDFs to merge" : `Merge ${valid.length} PDFs`}
          {!counting && valid.length >= 2 && <Icon name="right" />}
        </button>
      )}

      {error && <ErrorText text={error} />}

      {result && (
        <ResultBox
          headline={`Merged into one PDF · ${formatBytes(result.size)}`}
          details={`${result.pages} pages from ${valid.length} files · made on your device`}
          href={result.url}
          fileName="merged.pdf"
        />
      )}
    </div>
  );
}

function IconButton({ label, icon, onClick, disabled, danger }: { label: string; icon: "up" | "down" | "trash"; onClick: () => void; disabled?: boolean; danger?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`grid size-10 shrink-0 place-items-center rounded-xl transition-colors disabled:opacity-25 ${
        danger ? "text-muted hover:bg-danger/10 hover:text-danger" : "text-muted hover:bg-accent-soft hover:text-accent"
      }`}
    >
      <Icon name={icon} className="size-[18px]" />
    </button>
  );
}
