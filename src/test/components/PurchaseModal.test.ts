import { describe, it, expect } from 'vitest'
import { mountWithPinia } from '../wrappers'
import PurchaseModal from '@/components/game/PurchaseModal.vue'

const mockResult = {
  shoppingSuccess: 'true',
  lives: 3,
  gold: 50,
  level: 1,
  turn: 1,
}

const mockDiff = {
  diff: {
    gold: 50,
    level: 50,
  },
}

const mockContent = {
  result: mockResult,
  diff: mockDiff,
}

describe('PurchaseModal', () => {
  it('renders nothing when closed', () => {
    const { wrapper } = mountWithPinia(PurchaseModal, {
      props: { open: false, result: null, loading: false },
    })
    expect(wrapper.find('[class*="fixed"]').exists()).toBe(false)
  })

  it('renders loading state', () => {
    const { wrapper } = mountWithPinia(PurchaseModal, {
      props: { open: true, result: null, loading: true },
    })
    expect(wrapper.text()).toContain('Purchasing item...')
  })

  it('renders success result', () => {
    const { wrapper } = mountWithPinia(PurchaseModal, {
      props: { open: true, content: mockContent, loading: false },
    })
    expect(wrapper.text()).toContain('Purchase completed!')
  })

  it('renders failure when shoppingSuccess is falsy', () => {
    const content = {
      result: { ...mockResult, shoppingSuccess: '' },
      diff: mockDiff,
    }
    const { wrapper } = mountWithPinia(PurchaseModal, {
      props: { open: true, result: content, loading: false },
    })
    expect(wrapper.text()).toContain('Failed to buy item')
  })

  it('emits update:open false when backdrop clicked', async () => {
    const { wrapper } = mountWithPinia(PurchaseModal, {
      props: { open: true, result: mockResult, loading: false },
    })
    await wrapper.find('.absolute.inset-0').trigger('click')
    expect(wrapper.emitted('update:open')![0]).toEqual([false])
  })

  it('emits update:open false when close button clicked', async () => {
    const { wrapper } = mountWithPinia(PurchaseModal, {
      props: { open: true, result: mockResult, loading: false },
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('update:open')![0]).toEqual([false])
  })
})
