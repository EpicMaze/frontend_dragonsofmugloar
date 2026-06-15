// module for risk assesment of the message solve result

import type { Ad } from '@/types/domain.ts'
import type { DecryptResult, RiskAssessment, RiskNotes } from '@/types/risk'
import { MAX_DIFFICULTY_LEVEL, ADS_DECODERS, RISK_WEIGHTS, DIFFICULTY_LEVELS } from './const'

export const decodeAd = (ad: Pick<Ad, 'message' | 'probability' | 'encrypted'>): DecryptResult => {
  if (!ad.encrypted)
    return {
      decryptedMessage: ad.message,
      decryptedProbability: ad.probability,
    }

  const decoder = ad.encrypted ? ADS_DECODERS[ad.encrypted] : null
  if (!decoder) {
    return {
      decryptedMessage: null,
      decryptedProbability: null,
    }
  }

  try {
    return {
      decryptedMessage: decoder(ad.message),
      decryptedProbability: decoder(ad.probability),
    }
  } catch {
    return {
      decryptedMessage: null,
      decryptedProbability: null,
    }
  }
}

export const calcTurnsRemaining = (
  expiresIn: number,
  fetchTurn: number,
  currentTurn: number,
): number => {
  return fetchTurn + expiresIn - currentTurn
}

const evalDifficulty = (probability: string): number | null => {
  if (!probability) return null
  const level = DIFFICULTY_LEVELS[probability]
  return level !== undefined ? level : null
}

// general formula for risk assess
// risk =  b * difficultyLevel + (encrypted ? c : 0)
export const assessRisk = (ad: Ad): RiskAssessment => {
  const isEncrypted = !!ad.encrypted
  const decryptResult = decodeAd(ad)

  const probability = decryptResult.decryptedProbability ?? ad.probability
  const rawDifficulty = evalDifficulty(probability)
  const difficultyLevel = rawDifficulty ?? MAX_DIFFICULTY_LEVEL // unknown = max risk

  const score =
    RISK_WEIGHTS.difficulty * difficultyLevel + (isEncrypted ? RISK_WEIGHTS.encrypted : 0)

  const notes: RiskNotes = {}
  if (rawDifficulty === null) notes.difficultyLevel = 'unknown'

  return {
    score,
    breakdown: { difficultyLevel, isEncrypted },
    notes: Object.keys(notes).length ? notes : null,
  }
}
