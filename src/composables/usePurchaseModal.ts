import { useActionModal } from './useActionModal'
import type { useShop } from './useShop'
import type { PurchaseItemResponse, ApiError } from '@/api/types'

type PurchaseMutation = ReturnType<typeof useShop>['purchaseMutation']

export const usePurchaseModal = (purchaseMutation: PurchaseMutation) => {
  const modal = useActionModal<PurchaseItemResponse>()

  const purchaseItem = (itemId: string) => {
    modal.handleOpen()
    purchaseMutation.mutate(itemId, {
      onSuccess: (result) => {
        modal.setContent(result)
      },
      onError: (_error: ApiError) => {
        modal.handleOpenChange(false)
      },
    })
  }

  return {
    purchaseItem,
    isPending: purchaseMutation.isPending,
    isOpen: modal.isOpen,
    handleOpenChange: modal.handleOpenChange,
    result: modal.content,
  }
}
