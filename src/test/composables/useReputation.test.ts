import { describe, it, expect } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountComposable } from '../wrappers'
import { useReputation } from '@/composables/useReputation'
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

describe('useReputation', () => {
  it('syncs fetched reputation to store', async () => {
    let store: ReturnType<typeof useGameStore>
    mountComposable(() => {
      store = useGameStore()
      store.$patch({ game: mockGame })
      return useReputation('game-1')
    })
    await flushPromises()
    expect(store!.reputation).not.toBeNull()
  })

  it('does not fetch when game not active', async () => {
    const { wrapper: query } = mountComposable(() => useReputation('game-1'))
    await flushPromises()
    expect(query.data.value).toBeUndefined()
  })
})
