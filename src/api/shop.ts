import { apiClient } from './client'
import type { PurchaseItemResponse, ShopItemsResponse } from './types'

export const getShopItems = (gameId: string) => {
  return apiClient.get<ShopItemsResponse>(`/${gameId}/shop`)
}

export const postPurchaseItem = (gameId: string, itemId: string) => {
  return apiClient.post<PurchaseItemResponse>(`/${gameId}/shop/buy/${itemId}`)
}
