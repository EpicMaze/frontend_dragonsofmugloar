import { calcTurnsRemaining } from '@/lib/riskAnalysis'
import { describe, expect, it } from 'vitest'

describe('calcTurnsRemaining', () => {
  it('returns full expiresIn when fetched and current turn are same', () => {
    expect(calcTurnsRemaining(5, 0, 0)).toBe(5)
  })

  it('decrements as current turn advances', () => {
    expect(calcTurnsRemaining(5, 0, 2)).toBe(3)
  })

  it('returns 0 when exactly expired', () => {
    expect(calcTurnsRemaining(5, 0, 5)).toBe(0)
  })

  it('returns negative when past expiry', () => {
    expect(calcTurnsRemaining(5, 0, 7)).toBe(-2)
  })

  it('accounts for fetchTurn offset', () => {
    // fetchTurn + expiresIn - currentTurn
    // 3 + 5 - 6 = 2
    expect(calcTurnsRemaining(5, 3, 6)).toBe(2)
  })

  it('solve costs 2 turns - remaining after solve', () => {
    // fetchTurn + expiresIn - currentTurn
    // 0 + 5 - 2 = 3
    expect(calcTurnsRemaining(5, 0, 2)).toBe(3)
  })

  it('expiresIn 1 means gone after one fetch turn', () => {
    expect(calcTurnsRemaining(1, 0, 1)).toBe(0)
  })
})
