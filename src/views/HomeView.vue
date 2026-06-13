<script setup lang="ts">
  import { useGame } from '@/composables/useGame'

  const { startMutation } = useGame()
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-6">
    <h1 class="text-4xl font-bold">Dragons of Mugloar</h1>
    <p class="text-muted-foreground">Solve messages, buy items, survive.</p>

    <button
      :disabled="startMutation.isPending.value"
      class="rounded-md bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      @click="startMutation.mutate()"
    >
      {{ startMutation.isPending.value ? 'Starting...' : 'Start Game' }}
    </button>

    <p v-if="startMutation.isError.value" class="text-destructive">
      Failed to start game. Try again.
    </p>
  </div>
</template>
