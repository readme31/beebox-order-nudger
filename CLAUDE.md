# Context for AI Coding Tools

## What this project is
A staff-facing upsell tool for Beebox Packaging. Detects when a client's
cart is below the next sticker-reward tier and generates a line for staff to say.

## Business Rules — never violate
- Sticker tiers: 500=25, 1000=60, 3000=200, 5000=400, 10000=900 stickers
- Custom-Ready threshold: 10,000 pcs lifetime volume
- Currency is always PHP (₱), two decimals, never USD
- Gross margin floor is 33% — never suggest a discount that breaks it
- Tier qualification is based on TOTAL PIECES, not peso value

## Hard Constraints
- ANTHROPIC_API_KEY is read ONLY server-side via process.env
- Never reference the key in any file under /app that renders in the browser
- Do not add authentication
- Do not add payment processing
- Do not add a database — use seeded data in lib/data.ts
- Do not add inventory or stock tracking

## Tone of AI output
The nudge line is spoken by a Filipino sales staff member to a client in person.
Warm, conversational, never pushy. One to two sentences maximum.