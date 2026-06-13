import { pinia } from '@/main'
import { useGameStore } from '@/stores/game'
import { QueryClient, QueryCache, MutationCache } from '@tanstack/vue-query'
import { isApiError } from '@/api/errors'

export const createQueryClient = () => {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        if (!isApiError(error)) return
        if (error.status !== 410 && error.status !== 404) return
        const store = useGameStore(pinia)
        if (!store.game || store.gameOver.isOver) return
        store.setGameOver(error.status === 410 ? 'lost' : 'expired')
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        if (!isApiError(error)) return
        if (error.status !== 410 && error.status !== 404) return
        const store = useGameStore(pinia)
        if (!store.game || store.gameOver.isOver) return
        store.setGameOver(error.status === 410 ? 'lost' : 'expired')
      },
    }),
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
        retry: (failureCount, error) => {
          if (isApiError(error) && [400, 404, 410].includes(error.status)) return false
          return failureCount < 3
        },
      },
    },
  })
}
