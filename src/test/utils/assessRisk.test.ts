import {
  DIFFICULTIES,
  DIFFICULTY_LEVELS,
  MAX_DIFFICULTY,
  MAX_DIFFICULTY_LEVEL,
  RISK_WEIGHTS,
} from '@/lib/const'
import { assessRisk } from '@/lib/riskAnalysis'
import { describe, expect, it } from 'vitest'

const maxDifficultyScore = RISK_WEIGHTS.difficulty * MAX_DIFFICULTY_LEVEL

describe('assessRisk', () => {
  const baseAd = {
    adId: 'test',
    message: 'Test',
    reward: 100,
    expiresIn: 5,
  }

  it('scores 0 for easiest unencrypted probability', () => {
    const result = assessRisk({
      ...baseAd,
      probability: DIFFICULTIES.WALK_IN_THE_PARK,
      encrypted: null,
    })
    expect(result.score).toBe(0)
    expect(result.breakdown.difficultyLevel).toBe(0)
    expect(result.breakdown.isEncrypted).toBe(false)
    expect(result.notes).toBeNull()
  })

  it('scores max difficulty for hardest unencrypted probability', () => {
    const result = assessRisk({ ...baseAd, probability: MAX_DIFFICULTY, encrypted: null })
    expect(result.score).toBe(MAX_DIFFICULTY_LEVEL)
    expect(result.breakdown.difficultyLevel).toBe(maxDifficultyScore)
  })

  it('adds encrypted weight on top of difficulty', () => {
    const probability = DIFFICULTIES.SURE_THING
    const result = assessRisk({ ...baseAd, probability, encrypted: null })
    const unencryptedScore = result.score // 2

    const encryptedMessage = btoa('Test')
    const encryptedProb = btoa(probability)
    const encryptedResult = assessRisk({
      ...baseAd,
      message: encryptedMessage,
      probability: encryptedProb,
      encrypted: 1,
    })

    expect(encryptedResult.score).toBe(unencryptedScore + RISK_WEIGHTS.encrypted)
    expect(encryptedResult.breakdown.isEncrypted).toBe(true)
  })

  it('uses MAX_DIFFICULTY when probability is unknown', () => {
    const result = assessRisk({
      ...baseAd,
      probability: 'Black tarantula Time fi di massive come sing ere',
      encrypted: null,
    })
    expect(result.breakdown.difficultyLevel).toBe(MAX_DIFFICULTY_LEVEL)
    expect(result.notes?.difficultyLevel).toBe('unknown')
  })

  it('uses MAX_DIFFICULTY when decryption fails', () => {
    const result = assessRisk({ ...baseAd, message: '!!!', probability: '!!!', encrypted: 1 })
    expect(result.breakdown.difficultyLevel).toBe(MAX_DIFFICULTY_LEVEL)
    expect(result.notes?.difficultyLevel).toBe('unknown')
  })

  it('notes is null when difficulty is known', () => {
    const result = assessRisk({ ...baseAd, probability: DIFFICULTIES.GAMBLE, encrypted: null })
    expect(result.notes).toBeNull()
  })

  it('decrypts ROT13 probability before assessing difficulty', () => {
    // Sure thing ROT13 Fher guvat
    const expectedDiffcultyLevel = DIFFICULTY_LEVELS[DIFFICULTIES.SURE_THING]
    const result = assessRisk({
      ...baseAd,
      message: 'oololol',
      probability: 'Fher guvat',
      encrypted: 2,
    })
    expect(result.breakdown.difficultyLevel).toBe(expectedDiffcultyLevel)
    expect(result.notes).toBeNull()
  })
})
