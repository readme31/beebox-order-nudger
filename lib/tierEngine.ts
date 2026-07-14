// Beebox Order-Value Maximizer — Tier Engine
// Pure function. No framework imports. Unit-testable. 
// Can be lifted into the single-file HTML POS without modification.

import { STICKER_TIERS, StickerTier } from "./data"

export interface TierResult {
  totalPieces: number
  currentTier: StickerTier | null  // null if below 500 pcs
  nextTier: StickerTier | null     // null if already at top tier
  piecesNeeded: number             // 0 if already at top tier
  isTopTier: boolean
  isBelowAllTiers: boolean
}

export function calculateTier(totalPieces: number): TierResult {
  if (totalPieces < 0) {
    throw new Error("totalPieces cannot be negative")
  }

  // Find the highest tier the cart currently qualifies for
  let currentTier: StickerTier | null = null
  for (const tier of STICKER_TIERS) {
    if (totalPieces >= tier.minPieces) {
      currentTier = tier
    }
  }

  // Find the next tier above the current one
  const topTier = STICKER_TIERS[STICKER_TIERS.length - 1]
  const isTopTier = totalPieces >= topTier.minPieces
  const isBelowAllTiers = currentTier === null

  let nextTier: StickerTier | null = null
  let piecesNeeded = 0

  if (!isTopTier) {
    // Find the lowest tier the cart has NOT yet reached
    for (const tier of STICKER_TIERS) {
      if (totalPieces < tier.minPieces) {
        nextTier = tier
        piecesNeeded = tier.minPieces - totalPieces
        break
      }
    }
  }

  return {
    totalPieces,
    currentTier,
    nextTier,
    piecesNeeded,
    isTopTier,
    isBelowAllTiers,
  }
}

export function sumCartPieces(
  cart: Array<{ quantity: number }>
): number {
  return cart.reduce((sum, line) => sum + line.quantity, 0)
}