import { describe, it, expect } from 'vitest'
import { mountWithPinia } from '../wrappers'
import GameStats from '@/components/game/GameStats.vue'
import { useGameStore } from '@/stores/game'
import { flushPromises } from '@vue/test-utils'

const mockGame = {
  gameId: 'abc12345-long-id',
  lives: 3,
  gold: 150,
  level: 2,
  score: 500,
  highScore: 800,
  turn: 7,
}

describe('GameStats', () => {
  it('renders loading state when no game', () => {
    const { wrapper } = mountWithPinia(GameStats)
    expect(wrapper.text()).toContain('Loading...')
  })

  it('renders game stats when game is set', async () => {
    const { wrapper, pinia } = mountWithPinia(GameStats)
    const store = useGameStore(pinia)
    store.$patch({ game: mockGame })
    await flushPromises()
    expect(wrapper.text()).toContain('3') // lives
    expect(wrapper.text()).toContain('150') // gold
    expect(wrapper.text()).toContain('500') // score
    expect(wrapper.text()).toContain('2') // level
    expect(wrapper.text()).toContain('7') // turn
  })

  it('updates rendered values when pinia game stats change', async () => {
    const { wrapper, pinia } = mountWithPinia(GameStats)
    const store = useGameStore(pinia)
    store.$patch({ game: mockGame })

    await flushPromises()
    expect(wrapper.text()).toContain('150') // gold

    store.$patch((state) => {
      if (state.game) state.game.gold = 999
    })
    await flushPromises()
    expect(wrapper.text()).toContain('999')
  })

  it('switches to loading state when game is cleared', async () => {
    const { wrapper, pinia } = mountWithPinia(GameStats)
    const store = useGameStore(pinia)

    store.$patch({ game: mockGame })
    await flushPromises()
    expect(wrapper.text()).not.toContain('Loading...')

    store.$patch({ game: null, reputation: null })
    await flushPromises()
    expect(wrapper.text()).toContain('Loading...')
  })
})
