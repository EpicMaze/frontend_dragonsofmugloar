<script setup lang="ts">
  import { RouterView, useRouter } from 'vue-router'
  import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
  import { useGameStore } from './stores/game'
  import { watch } from 'vue'

  const router = useRouter()
  const store = useGameStore()

  watch(
    () => store.gameOver.isOver,
    (isOver) => {
      if (isOver) router.push('/game-over')
    },
  )
</script>

<template>
  <RouterView />
  <VueQueryDevtools />
</template>
