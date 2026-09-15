# Flash Loan Risk Lab

**Educational lab · demo funds only · not production DeFi · not financial advice.**

Interactive Next.js demo + Hardhat contracts: VulnerableVault (spot oracle drain in lab) vs MitigatedVault (TWAP + circuit breaker blocks).

## Live demo

https://flash-loan-risk-lab.vercel.app

Repo: https://github.com/Harshanandhan/flash-loan-risk-lab

## Try the UI

1. Open the live URL or `npm run dev`
2. Simulate flash borrow → Manipulate lab price → Attempt drain (Vulnerable) then (Mitigated)
3. Read evidence panel (6 Hardhat tests)

## Tests

```bash
npm install --legacy-peer-deps
npx hardhat test
# 6 passing (2026-09-15)
```

## Evidence

- Hardhat: **6 passing** (2026-09-15)
- Commit at first Vercel prod: `a9576bc`
- Deploy alias: https://flash-loan-risk-lab.vercel.app

## Limits

Demo tokens only. No mainnet. Not financial advice. Not an exploit weapon.

## License

MIT
