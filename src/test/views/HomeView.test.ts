import { describe, it, expect } from 'vitest'
import { mountWithApp } from '../wrappers'
import { useGameStore } from '@/stores/game'
import HomeView from '@/views/HomeView.vue'
import { flushPromises } from '@vue/test-utils'

const mockGame = {
  gameId: 'game-1',
  lives: 3,
  gold: 0,
  level: 1,
  score: 0,
  highScore: 0,
  turn: 0,
}

describe('HomeView', () => {
  it('renders title', () => {
    const { wrapper } = mountWithApp(HomeView)
    expect(wrapper.text()).toContain('Dragons of Mugloar')
  })

  it('continue button is disabled when no game and no game over', () => {
    const { wrapper } = mountWithApp(HomeView)
    const continueBtn = wrapper.findAll('button')[0]
    expect(continueBtn).toBeDefined()
    expect(continueBtn?.attributes('disabled')).toBeDefined()
  })

  it('continue button is enabled when game is active', async () => {
    const { wrapper, pinia } = mountWithApp(HomeView)
    const store = useGameStore(pinia)
    store.$patch({ game: mockGame })
    await flushPromises()
    const continueBtn = wrapper.findAll('button')[0]
    expect(continueBtn).toBeDefined()
    expect(continueBtn?.attributes('disabled')).toBeUndefined()
  })

  it('continue button shows "View Last Run" when game is over', async () => {
    const { wrapper, pinia } = mountWithApp(HomeView)
    const store = useGameStore(pinia)
    store.$patch({ game: mockGame })
    store.$patch({
      gameOver: { isOver: true, reason: 'lost', finalStats: mockGame },
    })
    await flushPromises()
    const continueBtn = wrapper.findAll('button')[0]
    expect(continueBtn).toBeDefined()
    expect(continueBtn?.text()).toContain('View Last Run')
  })

  it('new game button shows loading state while starting', async () => {
    const { wrapper } = mountWithApp(HomeView)
    const newGameBtn = wrapper.findAll('button')[1]
    expect(newGameBtn).toBeDefined()
    await newGameBtn?.trigger('click')
    expect(wrapper.text()).toContain('Starting...')
    await flushPromises()
  })

  it('shows error message when start game fails', async () => {
    const { http, HttpResponse } = await import('msw')
    const { server } = await import('../server')
    server.use(
      http.post(`${import.meta.env.VITE_API_BASE_URL}/game/start`, () =>
        HttpResponse.json({ message: 'error' }, { status: 500 }),
      ),
    )
    const { wrapper } = mountWithApp(HomeView)
    expect(wrapper).toBeDefined()
    await wrapper?.findAll('button')[1]?.trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('Failed to start game')
  })
})
