import { describe, it, expect } from 'vitest'
import { createWrapper } from '../wrappers'
import GameStats from '@/components/game/GameStats.vue'
import { useGameStore } from '@/stores/game'

const mockGame = {
  gameId: 'abc12345-long-id',
  lives: 3,
  gold: 150,
  level: 2,
  score: 500,
  highScore: 800,
  turn: 7,
}

describe('GameStats', () => {
  it('renders loading state when no game', () => {
    const wrapper = createWrapper(GameStats)
    expect(wrapper.text()).toContain('Loading...')
  })

  it('renders game stats when game is set', () => {
    const wrapper = createWrapper(GameStats)
    const store = useGameStore()
    store.setGame(mockGame)
    expect(wrapper.text()).toContain('3') // lives
    expect(wrapper.text()).toContain('150') // gold
    expect(wrapper.text()).toContain('500') // score
    expect(wrapper.text()).toContain('2') // level
    expect(wrapper.text()).toContain('7') // turn
  })

  it('truncates gameId to 8 chars', () => {
    const wrapper = createWrapper(GameStats)
    const store = useGameStore()
    store.setGame(mockGame)
    expect(wrapper.text()).toContain('abc12345')
    expect(wrapper.text()).not.toContain('abc12345-long-id')
  })
})
