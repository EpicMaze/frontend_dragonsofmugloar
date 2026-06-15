import type { Ref } from 'vue'
import { useActionModal } from './useActionModal'
import type { SolveStatsDiff, useAds } from './useAds'
import type { ApiError } from '@/api/types'
import type { SolveModalContent } from '@/components/SolveModal.vue'

type SolveMutation = ReturnType<typeof useAds>['solveMutation']

export const useSolveModal = (
  solveMutation: SolveMutation,
  solveDiff: Ref<SolveStatsDiff | null>,
) => {
  const modal = useActionModal<SolveModalContent>()

  const solveAd = (adId: string) => {
    modal.handleOpen()
    solveMutation.mutate(adId, {
      onSuccess: (result) => {
        modal.setContent({ result, diff: solveDiff.value })
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
