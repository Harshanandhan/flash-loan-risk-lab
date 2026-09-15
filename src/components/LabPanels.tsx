"use client";

import { LAB } from "@/lib/simulation";
import { Pill } from "@/components/ui";
import type { LabState } from "@/lib/simulation";
import evidence from "@/data/evidence.json";

export function VaultCards({ state }: { state: LabState }) {
  return (
    <section className="mb-8 grid gap-4 md:grid-cols-2">
      <article className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="text-base font-semibold text-rose-100">VulnerableVault</h3>
          <Pill tone={state.vuln.drained ? "danger" : "neutral"}>{state.vuln.drained ? "lab drain shown" : "waiting"}</Pill>
        </div>
        <ul className="space-y-1 font-mono text-sm text-slate-300">
          <li>collateral: {state.vuln.collateral} LAB-COLL</li>
          <li>debt liquidity: {state.vuln.debtLiquidity} LAB-USD</li>
          <li>attacker borrowed: {state.vuln.attackerDebt} LAB-USD</li>
        </ul>
        <p className="mt-3 text-xs text-slate-400">Pricing: live spot only · no TWAP · no breaker</p>
      </article>
      <article className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="text-base font-semibold text-emerald-100">MitigatedVault</h3>
          <Pill tone={state.mit.circuitOpen || state.mit.blockedReason ? "ok" : "neutral"}>
            {state.mit.blockedReason ? "blocked" : "healthy"}
          </Pill>
        </div>
        <ul className="space-y-1 font-mono text-sm text-slate-300">
          <li>collateral: {state.mit.collateral} LAB-COLL</li>
          <li>debt liquidity: {state.mit.debtLiquidity} LAB-USD</li>
          <li>circuit open: {String(state.mit.circuitOpen)}</li>
        </ul>
        {state.mit.blockedReason ? (
          <p className="mt-3 text-xs text-emerald-200/90">{state.mit.blockedReason}</p>
        ) : (
          <p className="mt-3 text-xs text-slate-400">Pricing: TWAP · deviation circuit breaker · owner pause</p>
        )}
      </article>
    </section>
  );
}

export function MitigationCards() {
  return (
    <section className="mb-8 grid gap-4 md:grid-cols-3">
      <article className="rounded-2xl border border-slate-600 bg-slate-800/40 p-4">
        <h3 className="font-semibold text-amber-200">TWAP</h3>
        <p className="mt-2 text-sm text-slate-300">Average recent oracle samples so a single-transaction spike cannot rewrite the LTV price.</p>
      </article>
      <article className="rounded-2xl border border-slate-600 bg-slate-800/40 p-4">
        <h3 className="font-semibold text-amber-200">Circuit breaker</h3>
        <p className="mt-2 text-sm text-slate-300">If spot diverges from TWAP beyond {LAB.maxDeviationBps} bps, refuse new borrows and optionally pause.</p>
      </article>
      <article className="rounded-2xl border border-slate-600 bg-slate-800/40 p-4">
        <h3 className="font-semibold text-amber-200">Access control</h3>
        <p className="mt-2 text-sm text-slate-300">Restrict who can push prices or close circuits. Lab oracle is open on purpose to teach the failure mode.</p>
      </article>
    </section>
  );
}

export function EvidencePanel() {
  return (
    <section className="rounded-2xl border border-slate-600 bg-slate-800/50 p-5">
      <h2 className="text-lg font-semibold text-slate-50">Evidence panel</h2>
      <p className="mt-1 text-sm text-slate-400">Hardhat suite proving Vulnerable drain vs Mitigated block on local demo tokens.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Pill tone="ok">{evidence.passing} passing</Pill>
        <Pill>{evidence.failing} failing</Pill>
        <Pill tone="amber">{evidence.date}</Pill>
        <Pill>{evidence.testCommand}</Pill>
      </div>
      <ul className="mt-4 list-inside list-disc text-sm text-slate-300">
        {evidence.cases.map((c) => (<li key={c}>{c}</li>))}
      </ul>
    </section>
  );
}
