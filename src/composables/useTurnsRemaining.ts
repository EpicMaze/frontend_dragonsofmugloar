import { useGameStore } from '@/stores/game'
import { computed } from 'vue'

export const useTurnsRemaining = (messageExpiresIn: number, fetchTurn: number) => {
  const store = useGameStore()

  return computed(() => {
    const currentTurn = store.gameTurn ?? 0
    return fetchTurn + messageExpiresIn - currentTurn
  })
}
