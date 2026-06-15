import type { Ad } from '@/types/domain'
import { apiClient } from './client'
import type { SolveAdResponse } from './types'

export const getAds = (gameId: string) => {
  return apiClient.get<Ad[]>(`/${gameId}/messages`)
}

export const postSolveAd = (gameId: string, adId: string) => {
  return apiClient.post<SolveAdResponse>(`/${gameId}/solve/${adId}`)
}
