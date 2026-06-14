import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { mountComposable } from '../createWrapper'
import { useSolveModal } from '@/composables/useSolveModal'
import type { ApiError, SolveAdResponse } from '@/api/types'

type MutateCallback<T> = {
  onSuccess?: (result: T) => void
  onError?: (error: ApiError) => void
}

const makeMockMutation = (overrides = {}) => ({
  mutate: vi.fn,
  isPending: ref(false),
  ...overrides,
})

describe('useSolveModal', () => {
  it('solveAd opens modal immediately before mutation resolves', () => {
    const mutation = makeMockMutation()
    const [modal] = mountComposable(() => useSolveModal(mutation as never))
    modal.solveAd('ad-1')
    expect(modal.isOpen.value).toBe(true)
  })

  it('on success sets result content', () => {
    const result: SolveAdResponse = {
      success: true,
      lives: 3,
      gold: 100,
      score: 100,
      highScore: 100,
      turn: 2,
      message: 'You did it',
    }
    const mutation = makeMockMutation({
      mutate: vi.fn((_adId, callbacks) => callbacks.onSuccess?.(result)),
    })
    const [modal] = mountComposable(() => useSolveModal(mutation as never))
    modal.solveAd('ad-1')
    expect(modal.result.value).toEqual(result)
    expect(modal.isOpen.value).toBe(true)
  })

  it('on 400 error sets expired true and keeps modal open', () => {
    const mutation = makeMockMutation({
      mutate: vi.fn<(adId: string, callbacks: MutateCallback<SolveAdResponse>) => void>(
        (_adId, callbacks) => callbacks.onError?.({ status: 400, message: 'expired' }),
      ),
    })
    const [modal] = mountComposable(() => useSolveModal(mutation as never))
    modal.solveAd('ad-1')
    expect(modal.expired.value).toBe(true)
    expect(modal.isOpen.value).toBe(true)
  })

  it('on non-400 error closes modal', () => {
    const mutation = makeMockMutation({
      mutate: vi.fn<(adId: string, callbacks: MutateCallback<SolveAdResponse>) => void>(
        (_adId, callbacks) => callbacks.onError?.({ status: 500, message: 'server error' }),
      ),
    })
    const [modal] = mountComposable(() => useSolveModal(mutation as never))
    modal.solveAd('ad-1')
    expect(modal.isOpen.value).toBe(false)
  })

  it('exposes isPending from mutation', () => {
    const isPending = ref(true)
    const mutation = makeMockMutation({ isPending })
    const [modal] = mountComposable(() => useSolveModal(mutation as never))
    expect(modal.isPending.value).toBe(true)
  })
})
