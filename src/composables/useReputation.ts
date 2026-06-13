import { fetchReputationService } from '@/service/game'
import { useGameStore } from '@/stores/game'
import { useQuery } from '@tanstack/vue-query'
import { computed, watch } from 'vue'

export const useReputation = (gameId: string) => {
  const store = useGameStore()

  const query = useQuery({
    queryKey: ['reputation', gameId],
    queryFn: () => fetchReputationService(gameId),
    enabled: computed(() => !!gameId && store.isGameActive),
    staleTime: Infinity,
  })

  watch(
    () => query.data.value,
    (data) => {
      if (data) store.setReputation(data)
    },
    { immediate: true },
  )

  return query
}
