import type { Game, Reputation } from '@/types/domain'
import { apiClient } from './client'

export const postStartGame = async () => {
  return apiClient.post<Game>('/game/start')
}

export const postInvestigateReputation = async (gameId: string) => {
  return apiClient.post<Reputation>(`/${gameId}/investigate/reputation`)
}
