# Beebox Order-Value Maximizer

A staff-facing AI tool for Beebox Packaging that detects when a client's order is close to the next sticker-reward tier and generates a natural upsell nudge line for sales staff to say out loud.

## What it does

1. Staff builds a client's order from the SKU catalog
2. The tier engine computes the gap to the next sticker tier in real time
3. Staff clicks "Generate Staff Nudge Line"
4. Claude Haiku returns a warm, conversational line tailored to that client and gap
5. Staff copies the line and uses it during the transaction

## Why it exists

Beebox runs a sticker-reward program where clients earn free custom stickers based on order volume (500 pcs = 25 stickers, up to 10,000 pcs = 900 stickers). Without automation, staff miss upsell moments every time a client orders just below a tier threshold. This tool makes the gap visible and gives staff the exact words to close it.

## Live URL

[beebox-order-nudger.vercel.app](https://beebox-order-nudger.vercel.app)

## Tech stack

- Next.js 14 (App Router)
- Tailwind CSS
- Claude Haiku via Anthropic API (server-side only)
- Vercel (deployment)
- GitHub Actions (CI/CD)

## Run locally

```bash
git clone https://github.com/readme31/beebox-order-nudger.git
cd beebox-order-nudger
npm install
```

Create a `.env.local` file in the root:
Then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Run tests

```bash
npm test
```

4 tests covering the tier engine: zero-piece cart, mid-tier cart, top-tier cart, and multi-line cart sum.

## Environment variables

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Anthropic API key. Set in Vercel dashboard for production. Never commit this. |

## Architecture
The API key lives only in `.env.local` (local) and Vercel environment variables (production). It never touches the browser.

## v2 roadmap

See [Issue #1](https://github.com/readme31/beebox-order-nudger/issues/1) — Custom-Readiness Forecaster.