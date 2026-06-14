// module for risk assesment of the message solve result

import type { Message } from '@/api/types'
import type { DecryptResult, RiskAssessment, RiskNotes } from './types'
import { DIFFICULTIES, MAX_DIFFICULTY, MESSAGE_DECODERS, RISK_WEIGHTS } from './const'

export const decryptMessage = (
  ad: Pick<Message, 'message' | 'probability' | 'encrypted'>,
): DecryptResult => {
  if (!ad.encrypted)
    return {
      decryptedMessage: ad.message,
      decryptedProbability: ad.probability,
    }

  const decode = ad.encrypted ? MESSAGE_DECODERS[ad.encrypted] : null
  if (!decode) {
    return {
      decryptedMessage: null,
      decryptedProbability: null,
    }
  }

  try {
    return {
      decryptedMessage: decode(ad.message),
      decryptedProbability: decode(ad.probability),
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
  const index = DIFFICULTIES.indexOf(probability)
  return index === -1 ? null : index
}

// general formula for risk assess
// risk =  b * difficultyLevel + (encrypted ? c : 0)
export const assessRisk = (message: Message): RiskAssessment => {
  const isEncrypted = !!message.encrypted
  const decryptResult = decryptMessage(message)

  const probability = decryptResult.decryptedProbability ?? message.probability
  const rawDifficulty = evalDifficulty(probability)
  const difficultyLevel = rawDifficulty ?? MAX_DIFFICULTY // unknown = max risk

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
