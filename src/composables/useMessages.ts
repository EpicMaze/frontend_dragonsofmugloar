import type { ApiError, Message } from '@/api/types'
import { fetchMessagesService, solveMessageService } from '@/service/messages'
import { useGameStore } from '@/stores/game'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, ref, toValue, watch, type MaybeRefOrGetter } from 'vue'

export const messagesQueryKey = (gameId: string) => ['messages', gameId] as const

export const useMessages = (gameId: MaybeRefOrGetter<string>) => {
  const queryKey = computed(() => messagesQueryKey(toValue(gameId)))
  const queryClient = useQueryClient()
  const store = useGameStore()

  const fetchTurn = ref<number | null>(null)

  const messagesQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const messages = await fetchMessagesService(toValue(gameId))

      fetchTurn.value = store.gameTurn
      return messages
    },
    enabled: computed(() => !!toValue(gameId) && store.isGameActive),
    staleTime: Infinity,
    refetchOnReconnect: false,
  })

  const solveMutation = useMutation<
    Awaited<ReturnType<typeof solveMessageService>>, //useMutation expects resolved type not a promise? since when?
    ApiError,
    string,
    { previousMessages?: Message[] }
  >({
    mutationFn: (messageId: string) => solveMessageService(toValue(gameId), messageId),
    onMutate: async (messageId: string) => {
      // cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: queryKey.value })

      // take snapshot
      const previousMessages = queryClient.getQueryData<Message[]>(queryKey.value)

      // optimistic update -> remove message from cached object
      queryClient.setQueryData<Message[]>(queryKey.value, (old) => {
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
        queryClient.setQueryData(queryKey.value, context)
      }
      console.error('SolveMessageResponse', error)
    },
  })

  const refetchMessages = () => {
    queryClient.invalidateQueries({ queryKey: queryKey.value })
  }

  watch(
    () => messagesQuery.data.value,
    (data) => {
      console.log('messagesQuery data:', data)
    },
    { immediate: true },
  )

  return {
    messagesQuery,
    solveMutation,
    refetchMessages,
    fetchTurn,
  }
}
