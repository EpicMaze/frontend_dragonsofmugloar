import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '@/stores/game'
import type { Game } from '@/api/types'

const mockGame: Game = {
  gameId: 'game-1',
  lives: 3,
  gold: 0,
  level: 1,
  score: 0,
  highScore: 0,
  turn: 0,
}

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('setGame', () => {
  it('sets game', () => {
    const store = useGameStore()
    store.setGame(mockGame)
    expect(store.game).toEqual(mockGame)
  })
})

describe('updateGameStats', () => {
  it('updates partial stats on active game', () => {
    const store = useGameStore()
    store.setGame(mockGame)
    store.updateGameStats({ gold: 100, turn: 2 })
    expect(store.game?.gold).toBe(100)
    expect(store.game?.turn).toBe(2)
    expect(store.game?.lives).toBe(3)
  })

  it('does nothing when game is null', () => {
    const store = useGameStore()
    store.updateGameStats({ gold: 100 })
    expect(store.game).toBeNull()
  })

  it('preserves all other fields on partial update', () => {
    const store = useGameStore()
    store.setGame(mockGame)
    store.updateGameStats({ score: 500, highScore: 500 })
    expect(store.game).toEqual({ ...mockGame, score: 500, highScore: 500 })
  })
})

describe('setGameOver', () => {
  it('sets isOver true with lost reason', () => {
    const store = useGameStore()
    store.setGame(mockGame)
    store.setGameOver('lost')
    expect(store.gameOver.isOver).toBe(true)
    expect(store.gameOver.reason).toBe('lost')
  })

  it('sets isOver true with expired reason', () => {
    const store = useGameStore()
    store.setGame(mockGame)
    store.setGameOver('expired')
    expect(store.gameOver.reason).toBe('expired')
  })

  it('snapshots current game as finalStats', () => {
    const store = useGameStore()
    store.setGame(mockGame)
    store.updateGameStats({ score: 999 })
    store.setGameOver('lost')
    expect(store.gameOver.finalStats?.score).toBe(999)
  })

  it('finalStats is null when game is null', () => {
    const store = useGameStore()
    store.setGameOver('lost')
    expect(store.gameOver.finalStats).toBeNull()
  })

  it('isGameActive becomes false after setGameOver', () => {
    const store = useGameStore()
    store.setGame(mockGame)
    expect(store.isGameActive).toBe(true)
    store.setGameOver('lost')
    expect(store.isGameActive).toBe(false)
  })
})

describe('clearActiveGame', () => {
  it('nulls game and reputation but preserves gameOver', () => {
    const store = useGameStore()
    store.setGame(mockGame)
    store.setGameOver('lost')
    store.clearActiveGame()
    expect(store.game).toBeNull()
    expect(store.reputation).toBeNull()
    expect(store.gameOver.isOver).toBe(true)
  })
})

describe('resetGame', () => {
  it('clears everything including gameOver', () => {
    const store = useGameStore()
    store.setGame(mockGame)
    store.setGameOver('lost')
    store.resetGame()
    expect(store.game).toBeNull()
    expect(store.gameOver).toEqual({ isOver: false, finalStats: null, reason: null })
  })
})

describe('computed getters', () => {
  it('gameId returns null when no game', () => {
    const store = useGameStore()
    expect(store.gameId).toBeNull()
  })

  it('gameId returns gameId when game set', () => {
    const store = useGameStore()
    store.setGame(mockGame)
    expect(store.gameId).toBe('game-1')
  })

  it('gameTurn returns null when no game', () => {
    const store = useGameStore()
    expect(store.gameTurn).toBeNull()
  })

  it('gameTurn returns current turn', () => {
    const store = useGameStore()
    store.setGame(mockGame)
    store.updateGameStats({ turn: 4 })
    expect(store.gameTurn).toBe(4)
  })

  it('isGameActive is false when no game', () => {
    const store = useGameStore()
    expect(store.isGameActive).toBe(false)
  })

  it('isGameActive is true when game set and not over', () => {
    const store = useGameStore()
    store.setGame(mockGame)
    expect(store.isGameActive).toBe(true)
  })
})
