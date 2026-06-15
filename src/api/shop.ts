import type { ShopItem } from '@/types/domain'
import { apiClient } from './client'
import type { PurchaseItemResponse } from './types'

export const getShopItems = (gameId: string) => {
  return apiClient.get<ShopItem[]>(`/${gameId}/shop`)
}

export const postPurchaseItem = (gameId: string, itemId: string) => {
  return apiClient.post<PurchaseItemResponse>(`/${gameId}/shop/buy/${itemId}`)
}
