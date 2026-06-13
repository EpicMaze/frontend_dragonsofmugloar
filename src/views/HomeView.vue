<script setup lang="ts">
  import { useGame } from '@/composables/useGame'
  import { useGameStore } from '@/stores/game'
  import { storeToRefs } from 'pinia'
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const store = useGameStore()
  const { gameOver, isGameActive } = storeToRefs(store)
  const canContinue = computed(() => isGameActive.value || gameOver.value.isOver)

  const { startMutation } = useGame()

  const handleStartGame = () => {
    store.resetGame()
    startMutation.mutate()
  }

  const handleContinue = () => {
    if (isGameActive.value) {
      router.push('/play')
      return
    }
    if (gameOver.value.isOver) {
      router.push('/game-over')
    }
  }

  const continueLabel = computed(() => {
    if (isGameActive.value) return 'Continue'
    if (gameOver.value.isOver) return 'View Last Run'
    return 'Continue'
  })
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-6">
    <h1 class="text-4xl font-bold">Dragons of Mugloar</h1>
    <p class="text-muted-foreground">Solve messages, buy items, survive.</p>

    <div class="flex flex-col gap-3 w-full max-w-xs">
      <button
        :disabled="!canContinue || startMutation.isPending.value"
        class="rounded-md border border-slate-200 bg-white px-6 py-3 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        @click="handleContinue"
      >
        {{ continueLabel }}
      </button>

      <button
        :disabled="startMutation.isPending.value"
        class="rounded-md bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        @click="handleStartGame"
      >
        {{ startMutation.isPending.value ? 'Starting...' : 'New game' }}
      </button>
    </div>

    <p v-if="startMutation.isError.value" class="text-destructive">
      Failed to start game. Try again.
    </p>
  </div>
</template>
