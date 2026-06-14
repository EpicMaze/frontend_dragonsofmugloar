import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { mountComposable } from '../wrappers'
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
    const { wrapper } = mountComposable(() => useSolveModal(mutation as never))
    wrapper.solveAd('ad-1')
    expect(wrapper.isOpen.value).toBe(true)
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
    const { wrapper } = mountComposable(() => useSolveModal(mutation as never))
    wrapper.solveAd('ad-1')
    expect(wrapper.result.value).toEqual(result)
    expect(wrapper.isOpen.value).toBe(true)
  })

  it('on 400 error sets expired true and keeps modal open', () => {
    const mutation = makeMockMutation({
      mutate: vi.fn<(adId: string, callbacks: MutateCallback<SolveAdResponse>) => void>(
        (_adId, callbacks) => callbacks.onError?.({ status: 400, message: 'expired' }),
      ),
    })
    const { wrapper } = mountComposable(() => useSolveModal(mutation as never))
    wrapper.solveAd('ad-1')
    expect(wrapper.expired.value).toBe(true)
    expect(wrapper.isOpen.value).toBe(true)
  })

  it('on non-400 error closes modal', () => {
    const mutation = makeMockMutation({
      mutate: vi.fn<(adId: string, callbacks: MutateCallback<SolveAdResponse>) => void>(
        (_adId, callbacks) => callbacks.onError?.({ status: 500, message: 'server error' }),
      ),
    })
    const { wrapper } = mountComposable(() => useSolveModal(mutation as never))
    wrapper.solveAd('ad-1')
    expect(wrapper.isOpen.value).toBe(false)
  })

  it('exposes isPending from mutation', () => {
    const isPending = ref(true)
    const mutation = makeMockMutation({ isPending })
    const { wrapper } = mountComposable(() => useSolveModal(mutation as never))
    expect(wrapper.isPending.value).toBe(true)
  })
})
