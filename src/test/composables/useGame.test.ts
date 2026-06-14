import { describe, it, expect, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountComposable } from '../wrappers'
import { useGame } from '@/composables/useGame'
import { useGameStore } from '@/stores/game'
import { http, HttpResponse } from 'msw'
import { server } from '../server'

const BASE = import.meta.env.VITE_API_BASE_URL

describe('useGame', () => {
  it('navigates to /play on success', async () => {
    const {
      wrapper: { startMutation },
      router,
    } = mountComposable(() => useGame())
    const pushSpy = vi.spyOn(router, 'push')
    startMutation.mutate()
    await flushPromises()

    expect(pushSpy).toHaveBeenCalledWith('/play')
  })

  it('resets store and sets new game on success', async () => {
    const {
      wrapper: { startMutation },
      pinia,
    } = mountComposable(() => useGame())
    const store = useGameStore(pinia)
    const resetSpy = vi.spyOn(store, 'resetGame')
    const setGameSpy = vi.spyOn(store, 'setGame')

    startMutation.mutate()
    await flushPromises()

    expect(resetSpy).toHaveBeenCalled()
    expect(setGameSpy).toHaveBeenCalledWith(expect.objectContaining({ gameId: 'test-game-id' }))
  })

  it('does not navigate on error', async () => {
    server.use(
      http.post(`${BASE}/game/start`, () =>
        HttpResponse.json({ message: 'error' }, { status: 500 }),
      ),
    )
    const {
      wrapper: { startMutation },
      router,
    } = mountComposable(() => useGame())
    const pushSpy = vi.spyOn(router, 'push')
    startMutation.mutate()
    await flushPromises()

    expect(pushSpy).not.toHaveBeenCalled()
  })
})
