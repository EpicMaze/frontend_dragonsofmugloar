import type { ApiError } from '@/api/types'
import { notify } from '@/lib/notify'
import { fetchShopItemsService, purchaseItemService } from '@/service/shop'
import { useGameStore } from '@/stores/game'
import type { ShopItem } from '@/types/domain'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, ref, toValue, type MaybeRefOrGetter } from 'vue'

interface ShopStatsSnapShot {
  gold: number
  level: number
}

export interface PurchaseStatsDiff {
  gold: number
  level: number
}

export const shopQueryKey = (gameId: string) => ['shopItems', gameId] as const

export const useShop = (gameId: MaybeRefOrGetter<string>) => {
  const queryKey = computed(() => shopQueryKey(toValue(gameId)))
  const store = useGameStore()
  const queryClient = useQueryClient()

  const purchaseDiff = ref<PurchaseStatsDiff | null>(null)

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
    { prevShopItems?: ShopItem[]; prevStats?: ShopStatsSnapShot }
  >({
    mutationFn: (itemId: string) => {
      return purchaseItemService(toValue(gameId), itemId)
    },
    onMutate: async (_itemId: string) => {
      // cancel ongoing querues
      await queryClient.cancelQueries({ queryKey: queryKey.value })

      // take snapshot
      const prevShopItems = queryClient.getQueryData<ShopItem[]>(queryKey.value)

      const prevStats = store.game
        ? {
            gold: store.game.gold,
            level: store.game.level,
          }
        : undefined

      return { prevShopItems, prevStats }
    },
    onSuccess: (result, _itemId, context) => {
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

      purchaseDiff.value = context?.prevStats
        ? {
            gold: result.gold - context.prevStats.gold,
            level: result.level - context.prevStats.level,
          }
        : null
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
    purchaseDiff,
  }
}
