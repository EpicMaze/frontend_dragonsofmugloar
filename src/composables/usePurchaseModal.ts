import type { Ref } from 'vue'
import { useActionModal } from './useActionModal'
import type { PurchaseStatsDiff, useShop } from './useShop'
import type { ApiError } from '@/api/types'
import type { PurchaseModalContent } from '@/components/game/PurchaseModal.vue'

type PurchaseMutation = ReturnType<typeof useShop>['purchaseMutation']

export const usePurchaseModal = (
  purchaseMutation: PurchaseMutation,
  purchaseDiff: Ref<PurchaseStatsDiff | null>,
) => {
  const modal = useActionModal<PurchaseModalContent>()

  const purchaseItem = (itemId: string) => {
    modal.handleOpen()
    purchaseMutation.mutate(itemId, {
      onSuccess: (result) => {
        modal.setContent({ result, diff: purchaseDiff.value })
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
