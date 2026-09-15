/**
 * Client-side deterministic simulation mirroring the Solidity lab logic.
 * Demo funds only — no chain, no mainnet, no real assets.
 */

export const LAB = {
  initialSpot: 1,
  spikeSpot: 10,
  ltvBps: 9000,
  maxDeviationBps: 500,
  twapWindow: 5,
  collateralDeposit: 100,
  flashAmount: 200,
  vulnDebtLiquidity: 1000,
  mitDebtLiquidity: 1000,
  poolLiquidity: 1000,
} as const;

export type StepId =
  | "idle"
  | "borrowed"
  | "manipulated"
  | "vulnerable_drain"
  | "mitigated_blocked"
  | "reset";

export interface LabState {
  step: StepId;
  spot: number;
  twapSamples: number[];
  flashBorrowed: boolean;
  flashOutstanding: number;
  vuln: {
    collateral: number;
    debtLiquidity: number;
    attackerDebt: number;
    drained: boolean;
  };
  mit: {
    collateral: number;
    debtLiquidity: number;
    attackerDebt: number;
    circuitOpen: boolean;
    blockedReason: string | null;
  };
  log: string[];
}

export function initialState(): LabState {
  const samples = Array.from({ length: LAB.twapWindow }, () => LAB.initialSpot);
  return {
    step: "idle",
    spot: LAB.initialSpot,
    twapSamples: samples,
    flashBorrowed: false,
    flashOutstanding: 0,
    vuln: {
      collateral: 0,
      debtLiquidity: LAB.vulnDebtLiquidity,
      attackerDebt: 0,
      drained: false,
    },
    mit: {
      collateral: 0,
      debtLiquidity: LAB.mitDebtLiquidity,
      attackerDebt: 0,
      circuitOpen: false,
      blockedReason: null,
    },
    log: [
      "Lab ready · demo tokens LAB-COLL / LAB-USD · spot $1 · TWAP seeded at $1",
    ],
  };
}

export function twap(samples: number[]): number {
  if (!samples.length) return 0;
  return samples.reduce((a, b) => a + b, 0) / samples.length;
}

export function deviationBps(spot: number, avg: number): number {
  const hi = Math.max(spot, avg);
  const lo = Math.min(spot, avg);
  if (hi === 0) return 0;
  return ((hi - lo) / hi) * 10_000;
}

export function maxBorrowSpot(collateral: number, spot: number, ltvBps: number): number {
  return (collateral * spot * ltvBps) / 10_000;
}

export function simulateFlashBorrow(state: LabState): LabState {
  if (state.flashBorrowed) {
    return {
      ...state,
      log: [...state.log, "Flash already outstanding in this lab run — reset to borrow again."],
    };
  }
  return {
    ...state,
    step: "borrowed",
    flashBorrowed: true,
    flashOutstanding: LAB.flashAmount,
    log: [
      ...state.log,
      `Simulated flash borrow: ${LAB.flashAmount} LAB-COLL from lab pool (atomic capital, demo only).`,
    ],
  };
}

export function simulateManipulate(state: LabState): LabState {
  if (state.flashBorrowed === false && false) {}
  return {
    ...state,
    step: "manipulated",
    spot: LAB.spikeSpot,
    log: [
      ...state.log,
      `Lab oracle spot spiked $${LAB.initialSpot} → $${LAB.spikeSpot} (models single-block / thin-pool manipulation).`,
      `TWAP still ≈ $${twap(state.twapSamples).toFixed(2)} (window not yet polluted).`,
    ],
  };
}

export function simulateVulnerableDrain(state: LabState): LabState {
  const collateral = LAB.collateralDeposit;
  const capacity = maxBorrowSpot(collateral, state.spot, LAB.ltvBps);
  const take = Math.min(capacity, state.vuln.debtLiquidity);
  return {
    ...state,
    step: "vulnerable_drain",
    vuln: {
      collateral,
      debtLiquidity: state.vuln.debtLiquidity - take,
      attackerDebt: take,
      drained: take > 0,
    },
    log: [
      ...state.log,
      `VulnerableVault uses live spot $${state.spot} only → max borrow ≈ ${capacity.toFixed(0)} LAB-USD.`,
      take > 0
        ? `Lab drain: borrowed ${take.toFixed(0)} LAB-USD against ${collateral} LAB-COLL. Vault liquidity left: ${(state.vuln.debtLiquidity - take).toFixed(0)}.`
        : "No liquidity to drain in this run.",
    ],
  };
}

export function simulateMitigatedAttempt(state: LabState): LabState {
  const avg = twap(state.twapSamples);
  const bps = deviationBps(state.spot, avg);
  const collateral = LAB.collateralDeposit;

  if (bps > LAB.maxDeviationBps) {
    return {
      ...state,
      step: "mitigated_blocked",
      mit: {
        collateral,
        debtLiquidity: state.mit.debtLiquidity,
        attackerDebt: 0,
        circuitOpen: true,
        blockedReason: `Circuit breaker: spot vs TWAP deviation ${bps.toFixed(0)} bps > ${LAB.maxDeviationBps} bps`,
      },
      log: [
        ...state.log,
        `MitigatedVault checks spot $${state.spot} vs TWAP $${avg.toFixed(2)} (${bps.toFixed(0)} bps).`,
        `Blocked — circuit breaker opened. Vault LAB-USD liquidity untouched: ${state.mit.debtLiquidity}.`,
      ],
    };
  }

  const capacity = maxBorrowSpot(collateral, avg, LAB.ltvBps);
  const take = Math.min(capacity, state.mit.debtLiquidity);
  return {
    ...state,
    step: "mitigated_blocked",
    mit: {
      collateral,
      debtLiquidity: state.mit.debtLiquidity - take,
      attackerDebt: take,
      circuitOpen: false,
      blockedReason: null,
    },
    log: [
      ...state.log,
      `Unexpected path: deviation within limits; TWAP borrow ${take.toFixed(0)} (honest case).`,
    ],
  };
}

export function simulateReset(): LabState {
  const s = initialState();
  return { ...s, step: "reset", log: [...s.log, "Lab state reset."] };
}

export const EVIDENCE = {
  testCommand: "npx hardhat test",
  passing: 6,
  date: "2026-09-15",
  suite: "Flash Loan Risk Lab (educational)",
} as const;
