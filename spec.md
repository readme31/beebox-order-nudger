# Beebox Order-Value Maximizer — Spec

## Purpose
Detect when a client's cart is below the next sticker-reward tier and give staff a ready-to-say upsell line.

## Input
- Cart: array of { sku, name, quantity, unitPrice }
- Client: { name, lifetimeVolume }

## Processing
1. Sum total pieces in cart.
2. Tier engine determines current tier, next tier, and pieces needed to reach it.
3. If a gap exists, send tier context to Claude via server route.
4. Claude returns a 1-2 sentence staff-facing nudge line.

## Output
- Current sticker tier (name + stickers earned)
- Next tier and exact pieces needed
- AI-generated nudge line
- Copy-to-clipboard action

## Sticker Tiers
| Pieces | Stickers |
|--------|----------|
| 500    | 25       |
| 1,000  | 60       |
| 3,000  | 200      |
| 5,000  | 400      |
| 10,000 | 900      |

## Acceptance Criteria
- Cart of 700 pcs → current tier 500, next tier 1000, gap 300
- Cart of exactly 1,000 pcs → current tier 1000, gap 0
- Cart above 10,000 pcs → top-tier state, no nudge
- Cart of 0 pcs → no tier, no API call
- Nudge returns in under 3 seconds
- ANTHROPIC_API_KEY never appears in client-side code
- App loads correctly in incognito at the live URL

## Failure Behavior
If the Claude API call fails, the tier gap must still display.
The AI line is an enhancement, not a dependency.