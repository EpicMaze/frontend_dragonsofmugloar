import type { ApiError, Message, SolveMessageResponse } from '@/api/types'
import { fetchMessagesService, solveMessageService } from '@/service/messages'
import { useGameStore } from '@/stores/game'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { storeToRefs } from 'pinia'

type MessagesCache = {
  messages: Message[]
  fetchTurn?: number
}

export const useMessages = (gameId: string) => {
  const queryClient = useQueryClient()
  const store = useGameStore()
  const { isGameActive, gameTurn } = storeToRefs(store)

  const messagesQuery = useQuery({
    queryKey: ['messages', gameId],
    queryFn: async () => {
      const messages = await fetchMessagesService(gameId)
      return { messages, fetchTurn: gameTurn }
    },
    enabled: !!gameId && isGameActive,
    staleTime: Infinity,
    refetchOnReconnect: false,
  })

  const solveMutation = useMutation<
    Awaited<ReturnType<typeof solveMessageService>>, //useMutation expects resolved type not a promise? since when?
    ApiError,
    string,
    { previousMessages?: MessagesCache }
  >({
    mutationFn: (messageId: string) => solveMessageService(gameId, messageId),
    onMutate: async (messageId: string) => {
      // cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: ['messages', gameId] })

      // take snapshot
      const previousMessages = queryClient.getQueryData<MessagesCache>(['messages', gameId])

      // optimistic update -> remove message from cached object
      queryClient.setQueryData<MessagesCache>(['messages', gameId], (old) => {
        if (!old?.messages) return old
        return {
          ...old,
          messages: old.messages.filter((msg) => msg.adId !== messageId),
        }
      })

      return { previousMessages }
    },
    onSuccess: (result: SolveMessageResponse) => {
      const updatedStats = {
        lives: result.lives,
        gold: result.gold,
        score: result.score,
        highScore: result.highScore,
        turn: result.turn,
      }
      store.updateGameStats(updatedStats)

      if (result.lives <= 0) {
        store.setGameOver('lost')
        return
      }

      // invalidate reputation -> refetch
      queryClient.invalidateQueries({ queryKey: ['reputation', gameId] })
    },
    onError: (error: ApiError, messageId, context) => {
      // if you can't beat them join them (c) Sun Tzu probably
      if (error.status === 400) return
      // rollback
      if (context?.previousMessages) {
        queryClient.setQueryData(['messages', gameId], context.previousMessages)
      }
      // gameNotify.error(error.message)
      console.error('SolveMessageResponse', error)
    },
  })

  const refetchMessages = () => {
    queryClient.invalidateQueries({ queryKey: ['messages', gameId] })
  }

  return {
    messagesQuery,
    solveMutation,
    refetchMessages,
  }
}
