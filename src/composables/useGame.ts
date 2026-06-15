import type { ApiError, Game } from '@/api/types'
import { notify } from '@/lib/notify'
import { startGameService } from '@/service/game'
import { useGameStore } from '@/stores/game'
import { useMutation } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'

export const useGame = () => {
  const store = useGameStore()
  const router = useRouter()

  const startMutation = useMutation({
    mutationFn: () => startGameService(),
    onSuccess: (game: Game) => {
      store.resetGame()
      store.setGame(game)
      router.push('/play')
    },
    onError: (error: ApiError) => {
      notify.error('Failed to start game!', error.message)
    },
  })

  return {
    startMutation,
  }
}
