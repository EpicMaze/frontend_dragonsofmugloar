import { apiClient } from './client'
import type { Game, Reputation } from './types'

export const postStartGame = async () => {
  return apiClient.post<Game>('/game/start')
}

export const postInvestigateReputation = async (gameId: string) => {
  return apiClient.post<Reputation>(`/${gameId}/investigate/reputation`)
}
