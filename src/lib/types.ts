export interface RiskBreakdown {
  difficultyLevel: number
  isEncrypted: boolean
}

export type RiskNotes = Partial<Record<keyof RiskBreakdown, string>>

export interface RiskAssessment {
  score: number
  breakdown: RiskBreakdown
  notes: RiskNotes | null
}

export interface DecryptResult {
  decryptedMessage: string | null // null if still unknown after decrypt for whatever reason
  decryptedProbability: string | null
}
