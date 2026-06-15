import type { ApiError, ShopItem } from '@/api/types'
import { notify } from '@/lib/notify'
import { fetchShopItemsService, purchaseItemService } from '@/service/shop'
import { useGameStore } from '@/stores/game'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'

export const shopQueryKey = (gameId: string) => ['shopItems', gameId] as const

export const useShop = (gameId: MaybeRefOrGetter<string>) => {
  const queryKey = computed(() => shopQueryKey(toValue(gameId)))
  const store = useGameStore()
  const queryClient = useQueryClient()

  const shopQuery = useQuery({
    queryKey,
    queryFn: () => fetchShopItemsService(toValue(gameId)),
    enabled: computed(() => !!gameId && store.isGameActive),
    staleTime: Infinity,
    refetchOnReconnect: false,
  })

  const purchaseMutation = useMutation<
    Awaited<ReturnType<typeof purchaseItemService>>,
    ApiError,
    string,
    { prevShopItems?: ShopItem[] }
  >({
    mutationFn: (itemId: string) => {
      return purchaseItemService(toValue(gameId), itemId)
    },
    onMutate: async (_itemId: string) => {
      // cancel ongoing querues
      await queryClient.cancelQueries({ queryKey: queryKey.value })

      // take snapshot
      const prevShopItems = queryClient.getQueryData<ShopItem[]>(queryKey.value)

      return { prevShopItems }
    },
    onSuccess: (result) => {
      const updatedStats = {
        gold: result.gold,
        lives: result.lives,
        level: result.level,
        turn: result.turn,
      }
      store.updateGameStats(updatedStats)

      if (result.lives <= 0) {
        store.setGameOver('lost')
        return
      }
    },
    onError: (error: ApiError, _, context) => {
      // rollback
      if (context?.prevShopItems) {
        queryClient.setQueryData(queryKey.value, context.prevShopItems)
      }
      notify.error('Failed to purchase an item!', error.message)
    },
  })

  return {
    shopQuery,
    purchaseMutation,
  }
}
