import { useGameStore } from '@/stores/game'
import { computed, type Ref } from 'vue'

export const useTurnsRemaining = (messageExpiresIn: number, fetchTurn: Ref<number | null>) => {
  const store = useGameStore()

  return computed(() => {
    const turn = store.gameTurn ?? 0
    const ft = fetchTurn.value ?? 0
    return ft + messageExpiresIn - turn
  })
}
