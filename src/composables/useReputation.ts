import { fetchReputationService } from '@/service/game'
import { useGameStore } from '@/stores/game'
import { useQuery } from '@tanstack/vue-query'
import { computed, toValue, watch, type MaybeRefOrGetter } from 'vue'

export const useReputation = (gameId: MaybeRefOrGetter<string>) => {
  const store = useGameStore()

  const query = useQuery({
    queryKey: ['reputation', toValue(gameId)],
    queryFn: () => fetchReputationService(toValue(gameId)),
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
