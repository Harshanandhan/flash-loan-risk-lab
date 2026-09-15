"use client";

export function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "amber" | "ok" | "danger" }) {
  const colors = {
    neutral: "border-slate-600 bg-slate-800 text-slate-200",
    amber: "border-amber-600/60 bg-amber-500/10 text-amber-200",
    ok: "border-emerald-600/50 bg-emerald-500/10 text-emerald-200",
    danger: "border-rose-600/50 bg-rose-500/10 text-rose-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors[tone]}`}>
      {children}
    </span>
  );
}

export function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-slate-600/80 bg-slate-900/50 px-3 py-2">
      <div className="text-[11px] uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-0.5 font-mono text-lg text-slate-100">{value}</div>
      {sub ? <div className="text-xs text-slate-500">{sub}</div> : null}
    </div>
  );
}

export function StepButton({
  label, detail, onClick, disabled, accent,
}: {
  label: string; detail: string; onClick: () => void; disabled?: boolean; accent?: boolean;
}) {
  return (
    <button type="button" disabled={disabled} onClick={onClick}
      className={`rounded-xl border px-4 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${
        accent ? "border-amber-500/70 bg-amber-500/15 hover:bg-amber-500/25" : "border-slate-600 bg-slate-800/80 hover:border-slate-400 hover:bg-slate-800"
      }`}>
      <div className="text-sm font-semibold text-slate-100">{label}</div>
      <div className="mt-1 text-xs text-slate-400">{detail}</div>
    </button>
  );
}
