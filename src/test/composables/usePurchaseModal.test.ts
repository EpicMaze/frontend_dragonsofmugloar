import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { mountComposable } from '../wrappers'
import { usePurchaseModal } from '@/composables/usePurchaseModal'
import type { PurchaseItemResponse } from '@/api/types'
import type { PurchaseStatsDiff } from '@/composables/useShop'

const makeMockMutation = (overrides = {}) => ({
  mutate: vi.fn(),
  isPending: ref(false),
  ...overrides,
})

describe('usePurchaseModal', () => {
  it('purchaseItem opens modal immediately', () => {
    const mutation = makeMockMutation()
    const { wrapper } = mountComposable(() => usePurchaseModal(mutation as never, ref(null)))
    wrapper.purchaseItem('item-1')
    expect(wrapper.isOpen.value).toBe(true)
  })

  it('on success sets result content', () => {
    const result: PurchaseItemResponse = {
      shoppingSuccess: 'true',
      gold: 50,
      lives: 3,
      level: 1,
      turn: 1,
    }
    const diff: PurchaseStatsDiff = {
      gold: 50,
      level: 100,
    }
    const mutation = makeMockMutation({
      mutate: vi.fn((_itemId, callbacks) => callbacks.onSuccess(result)),
    })
    const { wrapper } = mountComposable(() => usePurchaseModal(mutation as never, ref(diff)))
    wrapper.purchaseItem('item-1')
    expect(wrapper.result.value).toEqual({ result, diff })
    expect(wrapper.isOpen.value).toBe(true)
  })

  it('on error closes modal', () => {
    const mutation = makeMockMutation({
      mutate: vi.fn((_itemId, callbacks) => callbacks.onError({ status: 500, message: 'error' })),
    })
    const { wrapper } = mountComposable(() => usePurchaseModal(mutation as never, ref(null)))
    wrapper.purchaseItem('item-1')
    expect(wrapper.isOpen.value).toBe(false)
  })

  it('exposes isPending from mutation', () => {
    const isPending = ref(true)
    const mutation = makeMockMutation({ isPending })
    const { wrapper } = mountComposable(() => usePurchaseModal(mutation as never, ref(null)))
    expect(wrapper.isPending.value).toBe(true)
  })

  it('has no expired state', () => {
    const mutation = makeMockMutation()
    const { wrapper } = mountComposable(() => usePurchaseModal(mutation as never, ref(null)))
    expect('expired' in wrapper).toBe(false)
  })
})
