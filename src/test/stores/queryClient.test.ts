import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useGameStore } from '@/stores/game'
import { createQueryClient } from '@/lib/queryClient'
import type { Game } from '@/types/domain.ts'

type Retry = (failureCount: number, error: unknown) => boolean

const mockGame: Game = {
  gameId: 'game-1',
  lives: 3,
  gold: 0,
  level: 1,
  score: 0,
  highScore: 0,
  turn: 0,
}

let pinia: ReturnType<typeof createPinia>

beforeEach(() => {
  pinia = createPinia()
  setActivePinia(pinia)
})

const fireQueryError = (error: unknown) => {
  const qc = createQueryClient(pinia)
  qc.getQueryCache().config.onError?.(error as Error, {} as never)
}

const fireMutationError = (error: unknown) => {
  const qc = createQueryClient(pinia)
  qc.getMutationCache().config.onError?.(
    error as Error,
    {} as never,
    {} as never,
    {} as never,
    {} as never,
  )
}

describe('queryCache onError', () => {
  it('calls setGameOver lost on 410', () => {
    const store = useGameStore()
    store.$patch({ game: mockGame })
    const spy = vi.spyOn(store, 'setGameOver')
    fireQueryError({ message: 'lost', status: 410 })
    expect(spy).toHaveBeenCalledWith('lost')
  })

  it('calls setGameOver expired on 404', () => {
    const store = useGameStore()
    store.$patch({ game: mockGame })
    const spy = vi.spyOn(store, 'setGameOver')
    fireQueryError({ message: 'expired', status: 404 })
    expect(spy).toHaveBeenCalledWith('expired')
  })

  it('does not call setGameOver when gameOver already set', () => {
    const store = useGameStore()
    store.$patch({ game: mockGame })
    store.$patch({
      game: mockGame,
      gameOver: { isOver: true, reason: 'lost', finalStats: mockGame },
    })
    const spy = vi.spyOn(store, 'setGameOver')
    fireQueryError({ message: 'lost', status: 410 })
    expect(spy).not.toHaveBeenCalled()
  })

  it('does not call setGameOver when game is null', () => {
    const store = useGameStore()
    const spy = vi.spyOn(store, 'setGameOver')
    fireQueryError({ message: 'lost', status: 410 })
    expect(spy).not.toHaveBeenCalled()
  })

  it('ignores 500 errors', () => {
    const store = useGameStore()
    store.$patch({ game: mockGame })
    const spy = vi.spyOn(store, 'setGameOver')
    fireQueryError({ message: 'server error', status: 500 })
    expect(spy).not.toHaveBeenCalled()
  })

  it('ignores non-ApiError shapes', () => {
    const store = useGameStore()
    store.$patch({ game: mockGame })
    const spy = vi.spyOn(store, 'setGameOver')
    fireQueryError(new Error('network'))
    expect(spy).not.toHaveBeenCalled()
  })
})

describe('mutationCache onError', () => {
  it('calls setGameOver lost on 410', () => {
    const store = useGameStore()
    store.$patch({ game: mockGame })
    const spy = vi.spyOn(store, 'setGameOver')
    fireMutationError({ message: 'lost', status: 410 })
    expect(spy).toHaveBeenCalledWith('lost')
  })

  it('does not call setGameOver when gameOver already set', () => {
    const store = useGameStore()
    store.$patch({ game: mockGame })
    store.$patch({
      game: mockGame,
      gameOver: { isOver: true, reason: 'lost', finalStats: mockGame },
    })
    const spy = vi.spyOn(store, 'setGameOver')
    fireMutationError({ message: 'lost', status: 410 })
    expect(spy).not.toHaveBeenCalled()
  })
})

describe('retry logic', () => {
  it('does not retry on 400', () => {
    const qc = createQueryClient(pinia)
    const retry = qc.getDefaultOptions().queries?.retry as Retry
    expect(retry(0, { message: 'bad', status: 400 })).toBe(false)
  })

  it('does not retry on 404', () => {
    const qc = createQueryClient(pinia)
    const retry = qc.getDefaultOptions().queries?.retry as Retry
    expect(retry(0, { message: 'expired', status: 404 })).toBe(false)
  })

  it('does not retry on 410', () => {
    const qc = createQueryClient(pinia)
    const retry = qc.getDefaultOptions().queries?.retry as Retry
    expect(retry(0, { message: 'lost', status: 410 })).toBe(false)
  })

  it('retries up to 3 times on other errors', () => {
    const qc = createQueryClient(pinia)
    const retry = qc.getDefaultOptions().queries?.retry as Retry
    expect(retry(0, { message: 'server error', status: 500 })).toBe(true)
    expect(retry(2, { message: 'server error', status: 500 })).toBe(true)
    expect(retry(3, { message: 'server error', status: 500 })).toBe(false)
  })
})
