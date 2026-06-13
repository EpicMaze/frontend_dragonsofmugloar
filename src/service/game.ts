import { axiosToApiError, responseToApiError } from '@/api/errors'
import { postInvestigateReputation, postStartGame } from '@/api/game'

export const startGameService = async () => {
  try {
    const response = await postStartGame()
    if (!response.data) throw responseToApiError(response)
    return response.data
  } catch (error) {
    throw axiosToApiError(error)
  }
}

export const fetchReputationService = async (gameId: string) => {
  try {
    const response = await postInvestigateReputation(gameId)
    if (!response.data) throw responseToApiError(response)
    return response.data
  } catch (error) {
    throw axiosToApiError(error)
  }
}
