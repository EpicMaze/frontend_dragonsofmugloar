import { apiClient } from './client'
import type { Ad, SolveAdResponse } from './types'

export const getAds = (gameId: string) => {
  return apiClient.get<Ad[]>(`/${gameId}/messages`)
}

export const postSolveAd = (gameId: string, adId: string) => {
  return apiClient.post<SolveAdResponse>(`/${gameId}/solve/${adId}`)
}
