import { describe, it, expect } from 'vitest'
import { mountWithPinia } from '../wrappers'
import ReputationStats from '@/components/ReputationStats.vue'
import { useGameStore } from '@/stores/game'
import { flushPromises } from '@vue/test-utils'

const mockReputation = { people: 1, state: 2, underworld: 3 }

describe('ReputationStats', () => {
  it('renders loading state when no reputation', () => {
    const { wrapper } = mountWithPinia(ReputationStats)
    expect(wrapper.text()).toContain('Loading...')
  })

  it('renders reputation values when set', async () => {
    const { wrapper } = mountWithPinia(ReputationStats)
    const store = useGameStore()
    store.$patch({ reputation: mockReputation })
    await flushPromises()
    expect(wrapper.text()).toContain('people')
    expect(wrapper.text()).toContain('1')
    expect(wrapper.text()).toContain('state')
    expect(wrapper.text()).toContain('2')
    expect(wrapper.text()).toContain('underworld')
    expect(wrapper.text()).toContain('3')
  })

  it('updates when reputation changes in store', async () => {
    const { wrapper, pinia } = mountWithPinia(ReputationStats)
    const store = useGameStore(pinia)
    store.$patch({ reputation: mockReputation })
    await flushPromises()
    expect(wrapper.text()).toContain('1')

    store.$patch({ reputation: { people: 5, state: 5, underworld: 5 } })
    await flushPromises()
    expect(wrapper.text()).toContain('5')
  })

  it('switches to loading state when reputation is cleared', async () => {
    const { wrapper, pinia } = mountWithPinia(ReputationStats)
    const store = useGameStore(pinia)
    store.$patch({ reputation: mockReputation })
    await flushPromises()
    expect(wrapper.text()).not.toContain('Loading...')

    store.$patch({ game: null, reputation: null })
    await flushPromises()
    expect(wrapper.text()).toContain('Loading...')
  })
})
