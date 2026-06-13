import { axiosToApiError, responseToApiError } from '@/api/errors'
import { getMessages, postSolveMessage } from '@/api/messages'

export const fetchMessagesService = async (gameId: string) => {
  try {
    const response = await getMessages(gameId)
    if (!response.data) throw responseToApiError(response)
    return response.data
  } catch (error) {
    throw axiosToApiError(error)
  }
}

export const solveMessageService = async (gameId: string, messageId: string) => {
  try {
    const response = await postSolveMessage(gameId, messageId)
    if (!response.data) throw responseToApiError(response)
    return response.data
  } catch (error) {
    throw axiosToApiError(error)
  }
}
