import type { ApiError, Message } from '@/api/types'
import { fetchMessagesService, solveMessageService } from '@/service/messages'
import { useGameStore } from '@/stores/game'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, ref } from 'vue'

export const messagesQueryKey = (gameId: string) => ['messages', gameId] as const

export const useMessages = (gameId: string) => {
  const queryKey = messagesQueryKey(gameId)
  const queryClient = useQueryClient()
  const store = useGameStore()

  const fetchTurn = ref<number | null>(null)

  const messagesQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const messages = await fetchMessagesService(gameId)

      fetchTurn.value = store.gameTurn
      return messages
    },
    enabled: computed(() => !!gameId && store.isGameActive),
    staleTime: Infinity,
    refetchOnReconnect: false,
  })

  const solveMutation = useMutation<
    Awaited<ReturnType<typeof solveMessageService>>, //useMutation expects resolved type not a promise? since when?
    ApiError,
    string,
    { previousMessages?: Message[] }
  >({
    mutationFn: (messageId: string) => solveMessageService(gameId, messageId),
    onMutate: async (messageId: string) => {
      // cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: queryKey })

      // take snapshot
      const previousMessages = queryClient.getQueryData<Message[]>(queryKey)

      // optimistic update -> remove message from cached object
      queryClient.setQueryData<Message[]>(queryKey, (old) => {
        if (!old) return old
        return old.filter((msg) => msg.adId !== messageId)
      })

      return { previousMessages }
    },
    onSuccess: (result) => {
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
    onError: (error, _messageId, context) => {
      // if you can't beat them join them (c) Sun Tzu probably
      if (error.status === 400) return
      // rollback
      if (context) {
        queryClient.setQueryData(queryKey, context)
      }
      console.error('SolveMessageResponse', error)
    },
  })

  const refetchMessages = () => {
    queryClient.invalidateQueries({ queryKey: queryKey })
  }

  return {
    messagesQuery,
    solveMutation,
    refetchMessages,
    fetchTurn,
  }
}
