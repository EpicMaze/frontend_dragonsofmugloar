import { apiClient } from './client'
import type { MessagesResponse, SolveMessageResponse } from './types'

export const getMessages = (gameId: string) => {
  return apiClient.get<MessagesResponse>(`/${gameId}/messages`)
}

export const postSolveMessage = (gameId: string, messageId: string) => {
  return apiClient.post<SolveMessageResponse>(`/${gameId}/solve/${messageId}`)
}
