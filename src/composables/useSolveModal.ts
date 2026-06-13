import { useActionModal } from './useActionModal'
import type { useMessages } from './useMessages'
import type { SolveMessageResponse, ApiError } from '@/api/types'

type SolveMutation = ReturnType<typeof useMessages>['solveMutation']

export const useSolveModal = (solveMutation: SolveMutation) => {
  const modal = useActionModal<SolveMessageResponse>()

  const solveMessage = (adId: string) => {
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
    solveMessage,
    isPending: solveMutation.isPending,
    isOpen: modal.isOpen,
    handleOpenChange: modal.handleOpenChange,
    result: modal.content,
    expired: modal.expired,
  }
}
