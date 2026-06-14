import { axiosToApiError, responseToApiError } from '@/api/errors'
import { getAds, postSolveAd } from '@/api/ads'

export const fetchAdsService = async (gameId: string) => {
  try {
    const response = await getAds(gameId)
    if (!response.data) throw responseToApiError(response)
    return response.data
  } catch (error) {
    throw axiosToApiError(error)
  }
}

export const solveAdService = async (gameId: string, adId: string) => {
  try {
    const response = await postSolveAd(gameId, adId)
    if (!response.data) throw responseToApiError(response)
    return response.data
  } catch (error) {
    throw axiosToApiError(error)
  }
}
