import type { Game, Reputation } from '@/api/types'
import { defineStore } from 'pinia'
import { computed, readonly, ref } from 'vue'

export interface FinalGameStats {
  score: number
  highScore: number
  gold: number
  level: number
  turn: number
}

export interface GameOver {
  isOver: boolean
  finalStats: FinalGameStats | null
  reason: 'lost' | 'expired' | null
}

export interface GameStatsUpdate {
  lives?: number
  gold?: number
  turn?: number
  score?: number
  highScore?: number
  level?: number
}

export const useGameStore = defineStore(
  'game',
  () => {
    const game = ref<Game | null>(null)
    const reputation = ref<Reputation | null>(null)
    const gameOver = ref<GameOver>({
      isOver: false,
      finalStats: null,
      reason: null,
    })

    const isGameActive = computed(() => game.value !== null && !gameOver.value.isOver)
    const gameId = computed(() => game.value?.gameId ?? null)
    const gameTurn = computed(() => game.value?.turn ?? null)

    const setGame = (newGame: Game) => {
      game.value = newGame
    }

    const setReputation = (rep: Reputation) => {
      reputation.value = rep
    }

    const setGameOver = (reason: 'lost' | 'expired') => {
      gameOver.value = {
        isOver: true,
        finalStats: game.value,
        reason,
      }
    }

    const updateGameStats = (stats: GameStatsUpdate) => {
      if (!game.value) return
      game.value = { ...game.value, ...stats }
    }

    const clearActiveGame = () => {
      game.value = null
      reputation.value = null
    }

    const resetGame = () => {
      game.value = null
      reputation.value = null
      gameOver.value = { isOver: false, finalStats: null, reason: null }
    }

    return {
      game: readonly(game),
      reputation: readonly(reputation),
      gameOver: readonly(gameOver),

      isGameActive,
      gameId,
      gameTurn,

      setGame,
      setReputation,
      setGameOver,
      updateGameStats,
      clearActiveGame,
      resetGame,
    }
  },
  {
    persist: {
      pick: ['game', 'reputation', 'gameOver'],
    },
  },
)
