<script setup lang="ts">
  import { computed } from 'vue'
  import { useGameStore } from '@/stores/game'
  import { useAds } from '@/composables/useAds.ts'
  import { useSolveModal } from '@/composables/useSolveModal'
  import AdCard from './AdCard.vue'
  import SolveModal from './SolveModal.vue'

  const store = useGameStore()

  const { adsQuery, solveMutation, refetchAds, fetchTurn, solveDiff } = useAds(
    computed(() => store.gameId ?? ''),
  )
  const { solveAd, isPending, isOpen, handleOpenChange, result, expired } = useSolveModal(
    solveMutation,
    solveDiff,
  )

  const ads = computed(() => adsQuery.data.value ?? [])
</script>

<template>
  <div class="space-y-4">
    <SolveModal
      :open="isOpen"
      :result="result"
      :solve-diff="solveDiff"
      :expired="expired"
      :loading="isPending"
      @update:open="handleOpenChange"
    />

    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <h2 class="text-lg font-bold text-slate-900">Tasks</h2>
        <span class="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
          {{ ads.length }}
        </span>
      </div>

      <button
        class="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        @click="refetchAds"
      >
        Refresh tasks
      </button>
    </div>

    <p v-if="adsQuery.isPending.value" class="text-slate-500">Loading tasks...</p>

    <p v-else-if="adsQuery.isError.value" class="text-red-600">Failed to load tasks.</p>

    <p v-else-if="ads.length === 0" class="text-center text-slate-500">No tasks available.</p>

    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <AdCard
        v-for="ad in ads"
        :key="ad.adId"
        :ad="ad"
        :fetch-turn="fetchTurn ?? 0"
        :loading="isPending"
        @solve="solveAd"
      />
    </div>
  </div>
</template>
