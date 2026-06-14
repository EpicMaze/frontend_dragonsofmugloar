import { useActionModal } from './useActionModal'
import type { useAds } from './useAds'
import type { SolveAdResponse, ApiError } from '@/api/types'

type SolveMutation = ReturnType<typeof useAds>['solveMutation']

export const useSolveModal = (solveMutation: SolveMutation) => {
  const modal = useActionModal<SolveAdResponse>()

  const solveAd = (adId: string) => {
    modal.handleOpen()
    solveMutation.mutate(adId, {
      onSuccess: (result) => {
        modal.setContent(result)
      },
      onError: (error: ApiError) => {
        if (error.status === 400) {
          modal.setExpired(true)
          return
        }
        modal.handleOpenChange(false)
      },
    })
  }

  return {
    solveAd,
    isPending: solveMutation.isPending,
    isOpen: modal.isOpen,
    handleOpenChange: modal.handleOpenChange,
    result: modal.content,
    expired: modal.expired,
  }
}
