markdown# 🐝 Beebox Order-Value Maximizer

> A staff-facing AI tool that detects sticker-tier gaps at checkout and gives sales staff a ready-to-say upsell line — built for Beebox Packaging's generic-to-custom conversion strategy.

**Live app:** [beebox-order-nudger.vercel.app](https://beebox-order-nudger.vercel.app)

---

## The problem it solves

Beebox runs a sticker-reward program: clients earn free custom stickers based on order volume. A client ordering 700 pieces is 300 pieces away from earning 60 free stickers — but without a system, that gap is invisible at the counter. Staff process the order, the moment passes, and Beebox records a smaller sale than the client may have been willing to place.

This tool makes the gap visible and hands staff the exact words to close it.

---

## How it works
Staff builds cart → tier engine computes gap (local, instant)
→ Staff clicks Generate → Claude Haiku drafts a nudge line (server-side, ~2s)
→ Staff reads the line to the client → larger order, more stickers earned

### Sticker tiers

| Order size | Free stickers earned |
|-----------|----------------------|
| 500 pcs   | 25 stickers          |
| 1,000 pcs | 60 stickers          |
| 3,000 pcs | 200 stickers         |
| 5,000 pcs | 400 stickers         |
| 10,000 pcs | 900 stickers        |

Clients who cross 10,000 pieces lifetime are flagged **Custom-Ready** — the signal to pitch full custom packaging.

---

## Tech stack

| Layer | Tool |
|-------|------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| AI | Claude Haiku via Anthropic API |
| API security | Next.js Route Handler — key never reaches the browser |
| Deployment | Vercel |
| CI/CD | GitHub Actions — tests + build on every push |

---

## Security model

The `ANTHROPIC_API_KEY` lives in exactly two places:
- `.env.local` on the development machine (gitignored)
- Vercel Environment Variables in production

It is never imported into any file that runs in the browser. All AI calls go through `/api/nudge`, a server-only Route Handler.

---

## Run locally

```bash
git clone https://github.com/readme31/beebox-order-nudger.git
cd beebox-order-nudger
npm install
```

Create `.env.local` in the root:
ANTHROPIC_API_KEY=sk-ant-your-key-here

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Run tests

```bash
npm test
```

Four tests on the tier engine:

| Test | What it checks |
|------|---------------|
| Zero-piece cart | No tier, no API call triggered |
| 700-piece cart | Bronze tier detected, 300 pcs gap to Silver |
| 10,000-piece cart | Diamond top tier, no nudge needed |
| Multi-line cart sum | Quantities summed correctly across SKUs |

---

## Architecture
app/
page.tsx              ← Client UI (cart, tier display, nudge button)
api/nudge/route.ts    ← Server-only: reads API key, calls Claude Haiku
lib/
tierEngine.ts         ← Pure function: computes tier + gap (no API, unit tested)
data.ts               ← Seeded SKUs and demo clients
.github/workflows/
ci.yml                ← Runs tests + build on every push to main

The tier engine is intentionally framework-agnostic so it can be lifted into Beebox's production single-file HTML POS without modification.

---

## Environment variables

| Variable | Where to set |
|----------|-------------|
| `ANTHROPIC_API_KEY` | `.env.local` locally, Vercel dashboard in production |

---

## v2 roadmap

[Issue #1](https://github.com/readme31/beebox-order-nudger/issues/1) — **Custom-Readiness Forecaster**

Read each client's order trajectory and forecast when they will cross the 10,000-piece lifetime threshold, with a pitch drafted before the moment arrives. Shifts the tool from reactive to proactive.

---

*Built by Nico Dioneda for the AIM Postgraduate Certificate in Generative & Agentic AI — Week 4 Graded Assignment.*