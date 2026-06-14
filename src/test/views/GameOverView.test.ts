import { describe, it, expect } from 'vitest'
import { mountWithApp } from '../wrappers'
import { useGameStore } from '@/stores/game'
import GameOverView from '@/views/GameOverView.vue'
import { flushPromises } from '@vue/test-utils'

const mockGame = {
  gameId: 'game-1',
  lives: 0,
  gold: 200,
  level: 3,
  score: 999,
  highScore: 1200,
  turn: 15,
}

describe('GameOverView', () => {
  it('shows "You Died" when reason is lost', async () => {
    const { wrapper, pinia } = mountWithApp(GameOverView)
    const store = useGameStore(pinia)
    store.$patch({ game: mockGame })
    store.$patch({
      gameOver: { isOver: true, reason: 'lost', finalStats: mockGame },
    })
    await flushPromises()
    expect(wrapper.text()).toContain('You Died')
  })

  it('shows "Session Expired" when reason is expired', async () => {
    const { wrapper, pinia } = mountWithApp(GameOverView)
    const store = useGameStore(pinia)
    store.$patch({ game: mockGame })
    store.$patch({
      gameOver: { isOver: true, reason: 'expired', finalStats: mockGame },
    })
    await flushPromises()
    expect(wrapper.text()).toContain('Session Expired')
  })

  it('renders final stats', async () => {
    const { wrapper, pinia } = mountWithApp(GameOverView)
    const store = useGameStore(pinia)
    store.$patch({ game: mockGame })
    store.$patch({
      gameOver: { isOver: true, reason: 'lost', finalStats: mockGame },
    })
    await flushPromises()
    expect(wrapper.text()).toContain('999') // score
    expect(wrapper.text()).toContain('1200') // highScore
    expect(wrapper.text()).toContain('200') // gold
  })

  it('renders play again button', () => {
    const { wrapper } = mountWithApp(GameOverView)
    expect(wrapper.text()).toContain('Play Again')
  })

  it('renders back to menu button', () => {
    const { wrapper } = mountWithApp(GameOverView)
    expect(wrapper.text()).toContain('Back to menu')
  })
})
