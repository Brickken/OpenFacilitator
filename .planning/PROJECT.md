# OpenFacilitator

## What This Is

A multi-tenant crypto payment facilitator with a rewards program that pays users $OPEN tokens for volume processed. Users can create facilitators, manage products, and earn rewards. The platform supports both Solana and Base chains for payments and subscriptions.

## Core Value

Users who process volume through OpenFacilitator get rewarded with $OPEN tokens. Facilitator owners get seamless subscription management with multi-chain support.

## Current Milestone: v1.2 Subscription Wallet Overhaul

**Goal:** Replace confusing legacy embedded wallet with a dedicated Subscriptions section supporting dual-chain (Base + Solana) recurring payments.

**Target features:**
- Remove legacy wallet from header
- Dedicated Subscriptions dashboard section
- Dual-wallet support (Base + Solana) with visible addresses
- Daily recurring payment engine with 7-day grace period
- Chain preference with prominent toggle
- Pre-funding any amount allowed
- No mid-cycle refunds (subscription runs until end)

## Current State

**Shipped:**
- v1.0 Rewards Program (2026-01-20)
- v1.1 SDK & Docs (2026-01-21)

**Codebase:**
- Dashboard: ~17,400 LOC TypeScript/React
- Server: SQLite + Better Auth + Hono
- SDK: x402 v1 and v2 type support with TypeScript narrowing
- 44 files changed in v1.1 (+2,990 / -589 lines)

**Tech stack:**
- Next.js 15.5 + React 19 + Tailwind + shadcn/ui
- @solana/wallet-adapter-react for Solana wallets
- wagmi + viem for EVM wallets
- @solana/web3.js + @solana/spl-token for token transfers

## Requirements

### Validated

- ✓ User authentication via Better Auth (email/password) — existing
- ✓ Multi-tenant facilitator system with subdomain/custom domain routing — existing
- ✓ Transaction logging with facilitator_id, to_address, from_address, amount — existing
- ✓ Free facilitator at pay.openfacilitator.io — existing
- ✓ Dashboard with facilitator management, products, stats — existing
- ✓ Solana wallet generation and SPL token support — existing
- ✓ Free users can register for rewards tracking — v1.0
- ✓ Users can add/verify Solana and EVM pay-to addresses — v1.0
- ✓ Dashboard shows volume, threshold progress, estimated rewards — v1.0
- ✓ Facilitator owners get 2x multiplier automatically — v1.0
- ✓ Admin can create and manage reward campaigns — v1.0
- ✓ Volume calculated from transaction logs for verified addresses — v1.0
- ✓ Users can claim $OPEN tokens when threshold met — v1.0
- ✓ SPL token transfer from rewards wallet on claim — v1.0
- ✓ Claim history with transaction signatures — v1.0
- ✓ SDK x402 v2 type definitions with TypeScript narrowing — v1.1
- ✓ Type guards for runtime version discrimination — v1.1
- ✓ verify() and settle() handle v1 and v2 formats — v1.1
- ✓ Comprehensive refund documentation for merchants — v1.1
- ✓ Whitelabel facilitator volume tracking — v1.1

### Active

- [ ] Remove legacy embedded wallet from header
- [ ] Create Subscriptions dashboard section with status display
- [ ] Implement Base wallet alongside Solana wallet
- [ ] Show wallet addresses directly for funding
- [ ] Chain preference toggle (prominent in Subscriptions section)
- [ ] Daily billing cron job
- [ ] Auto-deduction with preferred chain fallback
- [ ] 7-day grace period for failed payments
- [ ] Low balance and payment status notifications
- [ ] Subscription payment history with tx hashes

### Future

- Dashboard features spotlight for discoverability
- Email notifications when threshold reached or claim available
- Sybil cluster detection dashboard for admins
- Prorated refunds for mid-cycle cancellation

### Out of Scope

- Leaderboards — deferred to post-launch based on demand
- Gamification (badges, streaks) — distraction from core value
- KYC verification — adds friction, not needed for loyalty program
- Complex tier systems — simplicity is a feature
- Mobile app — web dashboard sufficient
- OAuth login — email/password + wallet sufficient

## Context

**Production readiness:**
- Rewards wallet needs funding (REWARDS_WALLET_PRIVATE_KEY env var)
- OPEN_TOKEN_MINT address needs configuration
- CRON_SECRET for volume snapshot jobs
- First campaign needs creation via /rewards/admin

**Known limitations:**
- Single active campaign at a time (by design)
- 5 address limit per user (anti-gaming)
- 30-day claim window after campaign ends

## Constraints

- **Database**: SQLite (existing) — all rewards tables added to same DB
- **Auth**: Better Auth (existing) — rewards extends auth context
- **UI**: Integrated into existing dashboard at /rewards
- **Token**: $OPEN on Solana — SPL token transfers via @solana/spl-token
- **Timeline**: v1.0 shipped, claims available March 2026

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Integrate into existing dashboard | Reduces complexity, leverages existing auth | ✓ Good |
| SQLite for rewards tables | Consistent with existing infra | ✓ Good |
| Solana signature verification (Ed25519) | Industry standard, users already have wallets | ✓ Good |
| EVM signature verification (EIP-191) | Industry standard for Ethereum | ✓ Good |
| Proportional distribution | Fair allocation based on contribution | ✓ Good |
| Soft anti-gaming (track, don't block) | Gaming is acceptable CAC for v1 | — Pending |
| Snapshot + live delta for volume | Efficient aggregation at scale | ✓ Good |
| Ephemeral wallet connection for claims | Security - don't store wallet keys | ✓ Good |
| Combined initiate + execute claim | Atomic operation, simpler UX | ✓ Good |
| 5 address limit per user | Balance flexibility vs abuse prevention | ✓ Good |
| Single active campaign | Simplicity, clear rules for users | ✓ Good |
| Literal x402Version types (1, 2) | Enables TypeScript narrowing | ✓ Good |
| PaymentRequirements field presence discrimination | No version field needed, use maxAmountRequired | ✓ Good |
| getVersionSafe defaults to v1 | Backward compatibility with pre-versioning payloads | ✓ Good |
| Middleware-first refund docs | Simpler DX for most merchants | ✓ Good |
| Facilitator markers in reward_addresses | Reuses existing volume aggregation queries | ✓ Good |

| Show wallet addresses directly | Power user friendly, direct deposits | — Pending |
| 7-day grace period | Standard industry practice | — Pending |
| Pre-fund any amount | Flexibility for users | — Pending |
| No mid-cycle refunds | Simpler, subscription runs until end | — Pending |
| Prominent chain preference toggle | Easy discoverability, user control | — Pending |

---
*Last updated: 2026-01-22 after starting v1.2 milestone*
