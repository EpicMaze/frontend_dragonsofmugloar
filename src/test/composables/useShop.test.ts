import { describe, it, expect } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { http, HttpResponse } from 'msw'
import { mountComposable } from '../createWrapper'
import { useShop } from '@/composables/useShop'
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

describe('useShop', () => {
  it('fetches shop items when game is active', async () => {
    const [{ shopQuery }] = mountComposable(() => {
      const store = useGameStore()
      store.setGame(mockGame)
      return useShop('game-1')
    })
    await flushPromises()
    expect(shopQuery.data.value).toHaveLength(1)
  })

  it('does not fetch when game not active', async () => {
    const [{ shopQuery }] = mountComposable(() => useShop('game-1'))
    await flushPromises()
    expect(shopQuery.data.value).toBeUndefined()
  })

  it('updates game stats on purchase success', async () => {
    const [{ purchaseMutation }] = mountComposable(() => {
      const store = useGameStore()
      store.setGame(mockGame)
      return useShop('game-1')
    })
    await flushPromises()

    purchaseMutation.mutate('item-1')
    await flushPromises()

    const store = useGameStore()
    expect(store.game?.gold).toBe(50)
    expect(store.game?.turn).toBe(1)
  })

  it('calls setGameOver lost when lives reach 0 after purchase', async () => {
    server.use(
      http.post(`${BASE}/:gameId/shop/buy/:itemId`, () =>
        HttpResponse.json({
          shoppingSuccess: 'true',
          lives: 0,
          gold: 0,
          level: 1,
          turn: 1,
        }),
      ),
    )
    const [{ purchaseMutation }] = mountComposable(() => {
      const store = useGameStore()
      store.setGame(mockGame)
      return useShop('game-1')
    })
    await flushPromises()

    purchaseMutation.mutate('item-1')
    await flushPromises()

    const store = useGameStore()
    expect(store.gameOver.isOver).toBe(true)
    expect(store.gameOver.reason).toBe('lost')
  })

  it('rolls back shop items on error', async () => {
    server.use(
      http.post(`${BASE}/:gameId/shop/buy/:itemId`, () =>
        HttpResponse.json({ message: 'error' }, { status: 500 }),
      ),
    )
    const [{ shopQuery, purchaseMutation }] = mountComposable(() => {
      const store = useGameStore()
      store.setGame(mockGame)
      return useShop('game-1')
    })
    await flushPromises()

    purchaseMutation.mutate('item-1')
    await flushPromises()

    expect(shopQuery.data.value).toHaveLength(1)
  })
})
