import type { ApiError } from '@/api/types'
import { notify } from '@/lib/notify'
import { fetchAdsService, solveAdService } from '@/service/ads'
import { useGameStore } from '@/stores/game'
import type { Ad } from '@/types/domain'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, ref, toValue, type MaybeRefOrGetter } from 'vue'

interface GameStatsSnapshot {
  gold: number
  score: number
  lives: number
}

export interface SolveStatsDiff {
  gold: number
  score: number
  lives: number
}

export const adsQueryKey = (gameId: string) => ['ads', gameId] as const

export const useAds = (gameId: MaybeRefOrGetter<string>) => {
  const queryKey = computed(() => adsQueryKey(toValue(gameId)))
  const queryClient = useQueryClient()
  const store = useGameStore()

  const fetchTurn = ref<number | null>(null)

  const solveDiff = ref<SolveStatsDiff | null>(null)

  const adsQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const ads = await fetchAdsService(toValue(gameId))

      fetchTurn.value = store.gameTurn
      return ads
    },
    enabled: computed(() => !!toValue(gameId) && store.isGameActive),
    staleTime: Infinity,
    refetchOnReconnect: false,
  })

  const solveMutation = useMutation<
    Awaited<ReturnType<typeof solveAdService>>,
    ApiError,
    string,
    { previousAds?: Ad[]; previousStats?: GameStatsSnapshot }
  >({
    mutationFn: (adId: string) => solveAdService(toValue(gameId), adId),
    onMutate: async (adId: string) => {
      // cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: queryKey.value })

      // take snapshot
      const previousAds = queryClient.getQueryData<Ad[]>(queryKey.value)

      // take prev stats + reputation snapshop
      const previousStats = store.game
        ? {
            gold: store.game.gold,
            score: store.game.score,
            lives: store.game.lives,
          }
        : undefined

      // optimistic update -> remove message from cached object
      queryClient.setQueryData<Ad[]>(queryKey.value, (old) => {
        if (!old) return old
        return old.filter((msg) => msg.adId !== adId)
      })

      return { previousAds, previousStats }
    },
    onSuccess: (result, _adId, context) => {
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

      solveDiff.value = context?.previousStats
        ? {
            gold: result.gold - context.previousStats.gold,
            score: result.score - context.previousStats.score,
            lives: result.lives - context.previousStats.lives,
          }
        : null

      // invalidate reputation -> refetch
      queryClient.invalidateQueries({ queryKey: ['reputation', toValue(gameId)] })
    },
    onError: (error, _adId, context) => {
      // if you can't beat them join them (c) Sun Tzu probably
      if (error.status === 400) return
      // rollback
      if (context) {
        queryClient.setQueryData(queryKey.value, context.previousAds)
      }
      notify.error('Failed to solve message!', error.message)
    },
  })

  const refetchAds = () => {
    queryClient.invalidateQueries({ queryKey: queryKey.value })
  }

  return {
    adsQuery,
    solveMutation,
    refetchAds,
    fetchTurn,
    solveDiff,
  }
}
