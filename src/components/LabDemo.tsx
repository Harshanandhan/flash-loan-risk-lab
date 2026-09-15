"use client";

import { useMemo, useState } from "react";
import {
  LAB, initialState, simulateFlashBorrow, simulateManipulate,
  simulateMitigatedAttempt, simulateReset, simulateVulnerableDrain,
  twap, deviationBps, type LabState,
} from "@/lib/simulation";
import { Pill, Stat, StepButton } from "@/components/ui";
import { VaultCards, MitigationCards, EvidencePanel } from "@/components/LabPanels";

export default function LabDemo() {
  const [state, setState] = useState<LabState>(() => initialState());
  const avg = useMemo(() => twap(state.twapSamples), [state.twapSamples]);
  const bps = useMemo(() => deviationBps(state.spot, avg), [state.spot, avg]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 pb-16 sm:px-6">
      <div className="mb-6 rounded-2xl border border-amber-700/50 bg-gradient-to-r from-amber-950/80 to-slate-900/80 px-4 py-3 text-sm text-amber-100">
        <strong className="font-semibold">Educational lab · demo funds only · not production DeFi · not financial advice.</strong>
        <span className="mt-1 block text-amber-100/80">No real assets, no mainnet keys, no mainnet targeting. Hardhat + client simulation only.</span>
      </div>

      <header className="mb-8">
        <div className="mb-3 flex flex-wrap gap-2">
          <Pill tone="amber">Flash loan risk</Pill>
          <Pill>Oracle manipulation</Pill>
          <Pill>TWAP + circuit breaker</Pill>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">Flash Loan Risk Lab</h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          Click through a same-block style lab scenario: flash-borrow demo capital → spike an unsecured spot oracle →
          attempt to over-borrow from a <em>VulnerableVault</em> (lab success) versus a <em>MitigatedVault</em> that
          prices with a TWAP window and trips a circuit breaker (blocked).
        </p>
      </header>

      <section className="mb-8 grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-600 bg-slate-800/40 p-5">
          <h2 className="text-lg font-semibold text-slate-50">What goes wrong?</h2>
          <p className="mt-2 text-sm text-slate-300">
            If a lending vault trusts a <strong>single spot price</strong> that can move inside one atomic transaction
            (flash loan + thin pool / lab oracle), an attacker can temporarily inflate collateral value, borrow more
            debt than the honest price allows, then repay the flash loan — leaving the vault short.
          </p>
        </article>
        <article className="rounded-2xl border border-slate-600 bg-slate-800/40 p-5">
          <h2 className="text-lg font-semibold text-slate-50">What mitigates it?</h2>
          <p className="mt-2 text-sm text-slate-300">
            <strong>TWAP-style windows</strong> average recent samples so a one-tick spike barely moves the LTV price.
            A <strong>circuit breaker</strong> refuses borrows when spot diverges too far from TWAP. Access control
            limits who can update feeds or pause markets.
          </p>
        </article>
      </section>

      <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Lab spot" value={`$${state.spot.toFixed(2)}`} sub="LabOracle.latestPrice" />
        <Stat label="TWAP" value={`$${avg.toFixed(2)}`} sub={`${LAB.twapWindow}-sample window`} />
        <Stat label="Deviation" value={`${bps.toFixed(0)} bps`} sub={`trip > ${LAB.maxDeviationBps} bps`} />
        <Stat label="Flash outstanding" value={state.flashBorrowed ? `${state.flashOutstanding}` : "0"} sub="LAB-COLL demo units" />
      </section>

      <section className="mb-8 rounded-2xl border border-slate-600 bg-slate-900/40 p-5">
        <h2 className="mb-3 text-lg font-semibold text-slate-50">Interactive lab steps</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <StepButton label="1 · Simulate flash borrow" detail={`${LAB.flashAmount} LAB-COLL from lab pool`}
            onClick={() => setState((s) => simulateFlashBorrow(s))} disabled={state.flashBorrowed} accent />
          <StepButton label="2 · Manipulate lab price" detail={`Spot $${LAB.initialSpot} → $${LAB.spikeSpot}`}
            onClick={() => setState((s) => simulateManipulate(s))} disabled={state.spot === LAB.spikeSpot} accent />
          <StepButton label="3a · Attempt drain (Vulnerable)" detail="Uses live spot → lab success"
            onClick={() => setState((s) => simulateVulnerableDrain(s))} disabled={state.spot === LAB.initialSpot || state.vuln.drained} />
          <StepButton label="3b · Attempt drain (Mitigated)" detail="TWAP + circuit breaker → blocked"
            onClick={() => setState((s) => simulateMitigatedAttempt(s))}
            disabled={state.spot === LAB.initialSpot || state.mit.circuitOpen || state.mit.blockedReason !== null} />
          <StepButton label="Reset lab" detail="Restore deterministic balances" onClick={() => setState(simulateReset())} />
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Tip: run 1 → 2 → 3a and 3b. Mirrors Solidity tests in <code className="text-amber-200/90">test/FlashLoanRiskLab.js</code>.
        </p>
      </section>

      <VaultCards state={state} />

      <section className="mb-8 rounded-2xl border border-slate-600 bg-slate-950/60 p-5">
        <h2 className="mb-2 text-lg font-semibold text-slate-50">Event log</h2>
        <ol className="max-h-56 space-y-1 overflow-y-auto font-mono text-xs text-slate-400">
          {state.log.map((line, i) => (
            <li key={`${i}-${line.slice(0, 24)}`}>
              <span className="text-amber-500/80">{String(i + 1).padStart(2, "0")}</span> {line}
            </li>
          ))}
        </ol>
      </section>

      <MitigationCards />
      <EvidencePanel />

      <footer className="mt-10 border-t border-slate-700 pt-6 text-sm text-slate-500">
        <p>Contracts under <code className="text-slate-400">contracts/</code> · tests under <code className="text-slate-400">test/</code>. Run <code className="text-amber-200/80">npx hardhat test</code>.</p>
        <p className="mt-1">Educational portfolio lab — not a vault-drain weapon or mainnet toolkit.</p>
      </footer>
    </div>
  );
}
