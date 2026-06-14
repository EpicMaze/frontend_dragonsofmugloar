import { describe, it, expect } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { http, HttpResponse } from 'msw'
import { mountWithQuery } from '../wrappers'
import AdList from '@/components/game/AdList.vue'
import { useGameStore } from '@/stores/game'
import { server } from '../server'

const BASE = import.meta.env.VITE_API_BASE_URL

const mockGame = {
  gameId: 'game-1',
  lives: 3,
  gold: 0,
  level: 1,
  score: 0,
  highScore: 0,
  turn: 0,
}

describe('AdList', () => {
  it('renders loading state initially when game active', async () => {
    const { wrapper, pinia } = mountWithQuery(AdList)
    const store = useGameStore(pinia)
    store.$patch({ game: mockGame })
    expect(wrapper.text()).toContain('Loading ads...')
  })

  it('renders ad cards when ads available', async () => {
    const { wrapper, pinia } = mountWithQuery(AdList)
    const store = useGameStore(pinia)
    store.$patch({ game: mockGame })
    await flushPromises()
    expect(wrapper.text()).toContain('Test message')
  })

  it('renders empty state when no ads', async () => {
    server.use(http.get(`${BASE}/:gameId/messages`, () => HttpResponse.json([])))
    const { wrapper, pinia } = mountWithQuery(AdList)
    const store = useGameStore(pinia)
    store.$patch({ game: mockGame })
    await flushPromises()
    expect(wrapper.text()).toContain('No ads available')
  })

  it('renders error state on fetch failure', async () => {
    server.use(
      http.get(`${BASE}/:gameId/messages`, () =>
        HttpResponse.json({ message: 'error' }, { status: 500 }),
      ),
    )
    const { wrapper, pinia } = mountWithQuery(AdList)
    const store = useGameStore(pinia)
    store.$patch({ game: mockGame })
    await flushPromises()
    expect(wrapper.text()).toContain('Failed to load ads')
  })

  it('shows ad count', async () => {
    const { wrapper, pinia } = mountWithQuery(AdList)
    const store = useGameStore(pinia)
    store.$patch({ game: mockGame })
    await flushPromises()
    expect(wrapper.text()).toContain('1') // one ad in handler
  })
})
