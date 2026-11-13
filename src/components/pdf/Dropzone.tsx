"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/Icon";

/** The big "choose or drop a PDF" box. `compact` is the slim version shown once files are added. */
export function Dropzone({
  multiple,
  title,
  hint,
  compact,
  onFiles,
}: {
  multiple: boolean;
  title: string;
  hint: string;
  compact?: boolean;
  onFiles: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const input = (
    <input
      ref={inputRef}
      type="file"
      accept="application/pdf,.pdf"
      multiple={multiple}
      className="sr-only"
      onChange={(e) => {
        if (e.target.files?.length) onFiles(Array.from(e.target.files));
        e.target.value = "";
      }}
    />
  );

  const dropProps = {
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(true);
    },
    onDragLeave: () => setDragging(false),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer.files.length) onFiles(Array.from(e.dataTransfer.files));
    },
  };

  if (compact) {
    return (
      <div {...dropProps}>
        {input}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`btn-ghost inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold ${dragging ? "border-accent" : ""}`}
        >
          <Icon name="plus" className="size-4" />
          {title}
        </button>
      </div>
    );
  }

  return (
    <div {...dropProps}>
      {input}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-10 text-center transition-colors sm:py-14 ${
          dragging ? "border-accent bg-accent-soft" : "border-border hover:border-accent/60 hover:bg-accent-soft/50"
        }`}
      >
        <span className="btn-primary grid size-16 place-items-center rounded-2xl">
          <Icon name="upload" className="size-7" />
        </span>
        <span className="mt-4 font-display text-xl font-semibold sm:text-2xl">{title}</span>
        <span className="mt-2 max-w-md text-sm text-muted">{hint}</span>
        <span className="mt-5 inline-flex h-12 items-center gap-2 rounded-2xl bg-text px-6 font-semibold text-bg">
          <Icon name="plus" />
          {multiple ? "Select PDF files" : "Select PDF file"}
        </span>
      </button>
    </div>
  );
}
