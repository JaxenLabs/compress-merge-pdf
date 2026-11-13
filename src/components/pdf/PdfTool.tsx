"use client";

import { useState } from "react";
import { CompressPanel } from "./CompressPanel";
import { MergePanel } from "./MergePanel";

const TABS = [
  { id: "compress", label: "Compress PDF" },
  { id: "merge", label: "Merge PDFs" },
] as const;

type Tab = (typeof TABS)[number]["id"];

/**
 * The tool: two modes in one card, like an app's segmented tabs. Both panels
 * stay mounted, so switching tabs keeps each one's files and results.
 */
export function PdfTool() {
  const [tab, setTab] = useState<Tab>("compress");
  return (
    <div className="card p-3 sm:p-5 lg:p-6">
      <div role="tablist" aria-label="Mode" className="segment mb-4 sm:mb-5">
        {TABS.map((t) => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => setTab(t.id)}
            className="!min-h-11 !text-sm"
          >
            {t.label}
          </button>
        ))}
      </div>
      <div id="panel-compress" role="tabpanel" aria-labelledby="tab-compress" hidden={tab !== "compress"}>
        <CompressPanel />
      </div>
      <div id="panel-merge" role="tabpanel" aria-labelledby="tab-merge" hidden={tab !== "merge"}>
        <MergePanel />
      </div>
    </div>
  );
}
