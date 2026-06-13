import { axiosToApiError, responseToApiError } from '@/api/errors'
import { getShopItems, postPurchaseItem } from '@/api/shop'

export const fetchShopItemsService = async (gameId: string) => {
  try {
    const response = await getShopItems(gameId)
    if (!response.data) throw responseToApiError(response)
    return response.data
  } catch (error) {
    throw axiosToApiError(error)
  }
}

export const purchaseItemService = async (gameId: string, itemId: string) => {
  try {
    const response = await postPurchaseItem(gameId, itemId)
    if (!response.data) throw responseToApiError(response)
    return response.data
  } catch (error) {
    throw axiosToApiError(error)
  }
}
