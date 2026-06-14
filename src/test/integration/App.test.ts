import { useGameStore } from '@/stores/game'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { mountWithApp } from '../wrappers'
import App from '@/App.vue'
import { setActivePinia } from 'pinia'

const mockGame = {
  gameId: 'game-1',
  lives: 3,
  gold: 0,
  level: 1,
  score: 0,
  highScore: 0,
  turn: 0,
}

describe('App.vue gameOver watch', () => {
  it('navigates to /game-over when gameOver.isOver becomes true', async () => {
    const { router, pinia } = mountWithApp(App)
    setActivePinia(pinia)

    const store = useGameStore()
    store.setGame(mockGame)
    await router.push('/play')
    await flushPromises()
    expect(router.currentRoute.value.name).toBe('play')

    store.setGameOver('lost')
    await flushPromises()
    expect(router.currentRoute.value.name).toBe('game-over')
  })

  it('does not navigate when gameOver.isOver is false', async () => {
    const { router, pinia } = mountWithApp(App)
    setActivePinia(pinia)
    const store = useGameStore()
    store.setGame(mockGame)
    await router.push('/play')
    await flushPromises()
    expect(router.currentRoute.value.name).toBe('play')
  })
})
