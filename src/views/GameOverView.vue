<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useGameStore } from '@/stores/game'
  import { useGame } from '@/composables/useGame'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const store = useGameStore()
  const { gameOver } = storeToRefs(store)
  const { startMutation } = useGame()

  const onRestart = () => {
    store.resetGame()
    startMutation.mutate()
  }
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-6">
    <h1 class="text-4xl font-bold">
      {{ gameOver.reason === 'lost' ? 'You Died' : 'Session Expired' }}
    </h1>

    <div v-if="gameOver.finalStats" class="flex flex-col gap-2 text-center">
      <p>Score: {{ gameOver.finalStats.score }}</p>
      <p>High Score: {{ gameOver.finalStats.highScore }}</p>
      <p>Gold: {{ gameOver.finalStats.gold }}</p>
      <p>Level: {{ gameOver.finalStats.level }}</p>
      <p>Turn: {{ gameOver.finalStats.turn }}</p>
    </div>

    <button
      :disabled="startMutation.isPending.value"
      class="rounded-md bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      @click="onRestart"
    >
      {{ startMutation.isPending.value ? 'Starting...' : 'Play Again' }}
    </button>
    <button
      class="rounded-md bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      @click="router.push('/')"
    >
      Back to menu
    </button>
  </div>
</template>
