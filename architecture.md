# System Architecture

## Data Flow

Browser (Next.js App Router, client component)
  -> Staff builds cart from seeded SKU list
  -> Tier engine runs LOCALLY (pure function, no network)
  -> Displays current tier + gap immediately
  -> Staff presses "Generate Nudge"
  -> POST /api/nudge

Server (Next.js Route Handler — runs on Vercel, never in browser)
  -> Reads ANTHROPIC_API_KEY from process.env
  -> Builds prompt from tier gap + client name
  -> Calls Claude Haiku
  -> Returns { nudge: string }

Browser
  -> Displays nudge line
  -> Copy button

## Layers
- UI:      app/page.tsx
- Logic:   lib/tierEngine.ts    (pure, framework-agnostic, unit tested)
- Data:    lib/data.ts          (seeded SKUs + demo clients)
- AI:      app/api/nudge/route.ts  (server only)

## Security
The API key exists in exactly two places:
- .env.local on the dev machine (gitignored)
- Vercel Environment Variables panel in production
It is never imported into any file that ships to the browser.

## Why the tier engine is separate
Pure math, no framework dependency. Unit-testable. Can be lifted
into Beebox's production single-file HTML POS later without rewriting.