/** Progress bar with a line of text, e.g. "Compressing page 3 of 12…". */
export function Progress({ label, done, total }: { label: string; done: number; total: number }) {
  const percent = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className="space-y-2" aria-live="polite">
      <div className="flex justify-between text-sm">
        <span className="font-semibold">{label}</span>
        <span className="text-muted">{percent}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-surface-strong" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
        <div className="h-full rounded-full bg-gradient-to-r from-[#34e3a0] to-[#22d3ee] transition-[width] duration-300" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
