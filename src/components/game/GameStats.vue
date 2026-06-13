<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useGameStore } from '@/stores/game'

  const store = useGameStore()
  const { game } = storeToRefs(store)
</script>

<template>
  <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
    <h3 class="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Game Stats</h3>
    <div class="space-y-2 text-sm">
      <div class="flex items-center justify-between">
        <span class="text-slate-600">Game ID</span>
        <span class="font-mono text-xs text-slate-900">{{ game?.gameId.slice(0, 8) }}...</span>
      </div>

      <template v-if="game">
        <div class="flex items-center justify-between">
          <span class="text-slate-600">Lives</span>
          <span class="font-bold text-slate-900">{{ game.lives }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-slate-600">Gold</span>
          <span class="font-bold text-yellow-600">{{ game.gold }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-slate-600">Score</span>
          <span class="font-bold text-slate-900">{{ game.score }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-slate-600">Level</span>
          <span class="font-bold text-slate-900">{{ game.level }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-slate-600">Turn</span>
          <span class="font-bold text-slate-900">{{ game.turn }}</span>
        </div>
      </template>

      <p v-else class="text-slate-500">Loading...</p>
    </div>
  </div>
</template>
