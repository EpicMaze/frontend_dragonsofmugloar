import { describe, it, expect } from 'vitest'
import { mountWithPinia } from '../wrappers'
import SolveModal from '@/components/game/SolveModal.vue'

const mockResult = {
  success: true,
  lives: 3,
  gold: 100,
  score: 100,
  highScore: 100,
  turn: 2,
  message: 'Done',
}
const mockDiff = {
  diff: {
    gold: 50,
    score: 50,
    lives: 3,
  },
}

const mockContent = {
  result: mockResult,
  diff: mockDiff,
}

describe('SolveModal', () => {
  it('renders nothing when closed', () => {
    const { wrapper } = mountWithPinia(SolveModal, {
      props: { open: false, result: null, expired: false, loading: false },
    })
    expect(wrapper.find('[class*="fixed"]').exists()).toBe(false)
  })

  it('renders loading state', () => {
    const { wrapper } = mountWithPinia(SolveModal, {
      props: { open: true, result: null, expired: false, loading: true },
    })
    expect(wrapper.text()).toContain('Attempting to solve')
  })

  it('renders expired state', () => {
    const { wrapper } = mountWithPinia(SolveModal, {
      props: { open: true, result: null, expired: true, loading: false },
    })
    expect(wrapper.text()).toContain('Too late!')
  })

  it('renders success result', () => {
    const { wrapper } = mountWithPinia(SolveModal, {
      props: { open: true, content: mockContent, expired: false, loading: false },
    })
    expect(wrapper.text()).toContain('Task solved succesfully!')
  })

  it('renders failure result', () => {
    const content = {
      result: { ...mockResult, success: false },
      diff: mockDiff,
    }
    const { wrapper } = mountWithPinia(SolveModal, {
      props: {
        open: true,
        content: content,
        expired: false,
        loading: false,
      },
    })
    expect(wrapper.text()).toContain('You failed to solve the task!')
  })

  it('emits update:open false when backdrop clicked', async () => {
    const { wrapper } = mountWithPinia(SolveModal, {
      props: { open: true, result: null, expired: true, loading: false },
    })
    await wrapper.find('.absolute.inset-0').trigger('click')
    expect(wrapper.emitted('update:open')).toBeTruthy()
    expect(wrapper.emitted('update:open')![0]).toEqual([false])
  })

  it('emits update:open false when close button clicked', async () => {
    const { wrapper } = mountWithPinia(SolveModal, {
      props: { open: true, result: null, expired: true, loading: false },
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('update:open')![0]).toEqual([false])
  })
})
