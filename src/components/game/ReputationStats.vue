<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useGameStore } from '@/stores/game'

  const store = useGameStore()
  const { reputation } = storeToRefs(store)
</script>

<template>
  <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
    <h3 class="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Reputation</h3>
    <div class="space-y-2 text-sm">
      <template v-if="reputation">
        <div
          v-for="(value, key) in reputation"
          :key="key"
          class="flex items-center justify-between"
        >
          <span class="text-slate-600 capitalize">{{ key }}</span>
          <span class="font-medium text-slate-900">{{ value.toFixed(1) }}</span>
        </div>
      </template>

      <p v-else class="text-slate-500">Loading...</p>
    </div>
  </div>
</template>
