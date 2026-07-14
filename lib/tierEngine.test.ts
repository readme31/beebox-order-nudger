import { calculateTier, sumCartPieces } from './tierEngine'

describe('calculateTier', () => {
  test('cart of 0 pieces returns no tier and no nudge', () => {
    const result = calculateTier(0)
    expect(result.currentTier).toBeNull()
    expect(result.nextTier).not.toBeNull()
    expect(result.isBelowAllTiers).toBe(true)
    expect(result.isTopTier).toBe(false)
  })

  test('cart of 700 pieces returns Bronze tier with 300 pieces needed for Silver', () => {
    const result = calculateTier(700)
    expect(result.currentTier?.label).toBe('Bronze')
    expect(result.nextTier?.label).toBe('Silver')
    expect(result.piecesNeeded).toBe(300)
    expect(result.isTopTier).toBe(false)
  })

  test('cart of 10000 pieces returns Diamond top tier with no nudge needed', () => {
    const result = calculateTier(10000)
    expect(result.currentTier?.label).toBe('Diamond')
    expect(result.isTopTier).toBe(true)
    expect(result.nextTier).toBeNull()
    expect(result.piecesNeeded).toBe(0)
  })
})

describe('sumCartPieces', () => {
  test('sums quantities correctly across multiple cart lines', () => {
    const cart = [
      { quantity: 400 },
      { quantity: 300 },
    ]
    expect(sumCartPieces(cart)).toBe(700)
  })
})