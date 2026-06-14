import { describe, expect, it } from 'vitest'
import { mountWithApp } from '../wrappers'
import App from '@/App.vue'
import { flushPromises } from '@vue/test-utils'
import { useGameStore } from '@/stores/game'

const mockGame = {
  gameId: 'game-1',
  lives: 3,
  gold: 0,
  level: 1,
  score: 0,
  highScore: 0,
  turn: 0,
}

describe('router guards', () => {
  it('/play redirects to home when no active game', async () => {
    const { router } = mountWithApp(App)
    await router.push('/play')
    await flushPromises()
    expect(router.currentRoute.value.name).toBe('home')
  })

  it('/play redirects to game-over when game is over', async () => {
    const { router, pinia } = mountWithApp(App)
    const store = useGameStore(pinia)
    store.setGame(mockGame)
    store.setGameOver('lost')
    await router.push('/play')
    await flushPromises()
    expect(router.currentRoute.value.name).toBe('game-over')
  })

  it('/play allows access when game is active', async () => {
    const { router, pinia } = mountWithApp(App)
    const store = useGameStore(pinia)
    store.setGame(mockGame)
    await router.push('/play')
    await flushPromises()
    expect(router.currentRoute.value.name).toBe('play')
  })

  it('/game-over redirects to home when game is not over', async () => {
    const { router } = mountWithApp(App)
    await router.push('/game-over')
    await flushPromises()
    expect(router.currentRoute.value.name).toBe('home')
  })

  it('/game-over allows access when game is over', async () => {
    const { router, pinia } = mountWithApp(App)
    const store = useGameStore(pinia)
    store.setGame(mockGame)
    store.setGameOver('expired')
    await router.push('/game-over')
    await flushPromises()
    expect(router.currentRoute.value.name).toBe('game-over')
  })

  it('/ is always accessible', async () => {
    const { router } = mountWithApp(App)
    await router.push('/')
    await flushPromises()
    expect(router.currentRoute.value.name).toBe('home')
  })
})
