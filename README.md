# Flash Loan Risk Lab

**Educational lab · demo funds only · not production DeFi · not financial advice.**

Interactive Next.js demo + Hardhat contracts: VulnerableVault (spot oracle drain in lab) vs MitigatedVault (TWAP + circuit breaker blocks).

## Live demo

Pending Vercel production deploy from Shadow (`vercel --prod --yes --scope na-ndureddy-s-projects`).

Repo: https://github.com/Harshanandhan/flash-loan-risk-lab

## Try the UI

1. Open live URL or `npm run dev`
2. Simulate flash borrow → Manipulate lab price → Attempt drain (Vulnerable) then (Mitigated)
3. Read evidence panel (6 Hardhat tests)

## Tests

```bash
npm install --legacy-peer-deps
npx hardhat test
# 6 passing (2026-09-15)
```

## Limits

Demo tokens only. No mainnet. Not financial advice. Not an exploit weapon.

## License

MIT
