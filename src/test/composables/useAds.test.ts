import { describe, it, expect } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { http, HttpResponse } from 'msw'
import { mountComposable } from '../wrappers'
import { useAds } from '@/composables/useAds'
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

describe('useAds', () => {
  it('fetches ads when game is active', async () => {
    const {
      wrapper: { adsQuery },
    } = mountComposable(() => {
      const store = useGameStore()
      store.setGame(mockGame)
      return useAds('game-1')
    })
    await flushPromises()
    expect(adsQuery.data.value).toHaveLength(1)
  })

  it('does not fetch when game not active', async () => {
    const {
      wrapper: { adsQuery },
    } = mountComposable(() => useAds('game-1'))
    await flushPromises()
    expect(adsQuery.data.value).toBeUndefined()
  })

  it('sets fetchTurn to current gameTurn after fetch', async () => {
    const {
      wrapper: { fetchTurn },
    } = mountComposable(() => {
      const store = useGameStore()
      store.setGame({ ...mockGame, turn: 4 })
      return useAds('game-1')
    })
    await flushPromises()
    expect(fetchTurn.value).toBe(4)
  })

  it('removes solved ad from cache immediately on mutate (optimistic)', async () => {
    const {
      wrapper: { adsQuery, solveMutation },
    } = mountComposable(() => {
      const store = useGameStore()
      store.setGame(mockGame)
      return useAds('game-1')
    })
    await flushPromises()
    expect(adsQuery.data.value).toHaveLength(1)

    // delay response so we can check optimistic state
    server.use(
      http.post(`${BASE}/:gameId/solve/:adId`, async () => {
        await new Promise((r) => setTimeout(r, 100))
        return HttpResponse.json({
          success: true,
          lives: 3,
          gold: 100,
          score: 100,
          highScore: 100,
          turn: 2,
          message: 'ok',
        })
      }),
    )

    solveMutation.mutate('msg-1')
    await flushPromises()
    expect(adsQuery.data.value).toHaveLength(0)
  })

  it('updates game stats on solve success', async () => {
    const {
      wrapper: { solveMutation },
    } = mountComposable(() => {
      const store = useGameStore()
      store.setGame(mockGame)
      return useAds('game-1')
    })
    await flushPromises()

    solveMutation.mutate('msg-1')
    await flushPromises()

    const store = useGameStore()
    expect(store.game?.gold).toBe(100)
    expect(store.game?.turn).toBe(2)
  })

  it('calls setGameOver lost when lives reach 0', async () => {
    server.use(
      http.post(`${BASE}/:gameId/solve/:adId`, () =>
        HttpResponse.json({
          success: true,
          lives: 0,
          gold: 0,
          score: 0,
          highScore: 0,
          turn: 2,
          message: 'dead',
        }),
      ),
    )
    const {
      wrapper: { solveMutation },
    } = mountComposable(() => {
      const store = useGameStore()
      store.setGame(mockGame)
      return useAds('game-1')
    })
    await flushPromises()

    solveMutation.mutate('msg-1')
    await flushPromises()

    const store = useGameStore()
    expect(store.gameOver.isOver).toBe(true)
    expect(store.gameOver.reason).toBe('lost')
  })

  it('does not rollback on 400 — keeps ad removed', async () => {
    server.use(
      http.post(`${BASE}/:gameId/solve/:adId`, () =>
        HttpResponse.json({ message: 'expired' }, { status: 400 }),
      ),
    )
    const {
      wrapper: { adsQuery, solveMutation },
    } = mountComposable(() => {
      const store = useGameStore()
      store.setGame(mockGame)
      return useAds('game-1')
    })
    await flushPromises()

    solveMutation.mutate('msg-1')
    await flushPromises()

    expect(adsQuery.data.value).toHaveLength(0)
  })

  it('rolls back ads on non-400 error', async () => {
    server.use(
      http.post(`${BASE}/:gameId/solve/:adId`, () =>
        HttpResponse.json({ message: 'server error' }, { status: 500 }),
      ),
    )
    const {
      wrapper: { adsQuery, solveMutation },
    } = mountComposable(() => {
      const store = useGameStore()
      store.setGame(mockGame)
      return useAds('game-1')
    })
    await flushPromises()

    solveMutation.mutate('msg-1')
    await flushPromises()

    expect(adsQuery.data.value).toHaveLength(1)
  })
})
