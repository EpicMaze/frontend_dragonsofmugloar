import { describe, it, expect } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { http, HttpResponse } from 'msw'
import { mountWithQuery } from '../wrappers'
import ShopPanel from '@/components/game/ShopPanel.vue'
import { useGameStore } from '@/stores/game'
import { server } from '../server'

const BASE = import.meta.env.VITE_API_BASE_URL

const mockGame = {
  gameId: 'game-1',
  lives: 3,
  gold: 100,
  level: 1,
  score: 0,
  highScore: 0,
  turn: 0,
}

describe('ShopPanel', () => {
  it('renders loading state initially when game active', async () => {
    const { wrapper, pinia } = mountWithQuery(ShopPanel)
    const store = useGameStore(pinia)
    store.$patch({ game: mockGame })
    expect(wrapper.text()).toContain('Loading shop...')
  })

  it('renders shop items when available', async () => {
    const { wrapper, pinia } = mountWithQuery(ShopPanel)
    const store = useGameStore(pinia)
    store.$patch({ game: mockGame })
    await flushPromises()
    expect(wrapper.text()).toContain('Test Item')
  })

  it('renders empty state when no items', async () => {
    server.use(http.get(`${BASE}/:gameId/shop`, () => HttpResponse.json([])))
    const { wrapper, pinia } = mountWithQuery(ShopPanel)
    const store = useGameStore(pinia)
    store.$patch({ game: mockGame })
    await flushPromises()
    expect(wrapper.text()).toContain('No items available')
  })

  it('renders error state on fetch failure', async () => {
    server.use(
      http.get(`${BASE}/:gameId/shop`, () =>
        HttpResponse.json({ message: 'error' }, { status: 500 }),
      ),
    )
    const { wrapper, pinia } = mountWithQuery(ShopPanel)
    const store = useGameStore(pinia)
    store.$patch({ game: mockGame })
    await flushPromises()
    expect(wrapper.text()).toContain('Failed to load shop')
  })

  it('shows item count', async () => {
    const { wrapper, pinia } = mountWithQuery(ShopPanel)
    const store = useGameStore(pinia)
    store.$patch({ game: mockGame })
    await flushPromises()
    expect(wrapper.text()).toContain('1')
  })
})
