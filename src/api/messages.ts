import { apiClient } from './client'
import type { Message, SolveMessageResponse } from './types'

export const getMessages = (gameId: string) => {
  return apiClient.get<Message[]>(`/${gameId}/messages`)
}

export const postSolveMessage = (gameId: string, messageId: string) => {
  return apiClient.post<SolveMessageResponse>(`/${gameId}/solve/${messageId}`)
}
