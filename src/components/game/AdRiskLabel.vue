<script setup lang="ts">
  import { MAX_RISK_SCORE } from '@/lib/const'
  import type { RiskBreakdown, RiskNotes } from '@/lib/types'
  import { computed } from 'vue'

  const props = defineProps<{
    score: number
    breakDown: RiskBreakdown
    notes: RiskNotes | null
  }>()

  const riskLabel = computed(() => {
    const ratio = props.score / MAX_RISK_SCORE

    if (ratio <= 0.25) return { text: 'SAFE', class: 'bg-green-100 text-green-700' }
    if (ratio <= 0.5) return { text: 'MODERATE', class: 'bg-yellow-100 text-yellow-700' }
    if (ratio <= 0.75) return { text: 'RISKY', class: 'bg-orange-100 text-orange-700' }
    return { text: 'CRITICAL', class: 'bg-red-100 text-red-700' }
  })
</script>

<template>
  <div class="group relative">
    <span
      class="cursor-default rounded-full px-2 py-0.5 text-xs font-semibold"
      :class="riskLabel.class"
    >
      {{ riskLabel.text }}
    </span>

    <!-- tooltip breakdown -->
    <div
      class="absolute right-0 top-6 z-10 hidden w-48 rounded-lg border border-slate-200 bg-white p-3 shadow-lg group-hover:block"
    >
      <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Risk breakdown
      </p>
      <div class="space-y-1 text-xs text-slate-700">
        <div class="flex justify-between">
          <span>Difficulty</span>
          <span class="font-medium" :class="notes?.difficultyLevel ? 'text-orange-500' : ''">
            +{{ breakDown.difficultyLevel }}
            <span v-if="notes?.difficultyLevel"> (unknown)</span>
          </span>
        </div>
        <div class="flex justify-between">
          <span>Encrypted</span>
          <span class="font-medium">{{ breakDown.isEncrypted ? '+1' : '+0' }}</span>
        </div>
        <div class="mt-2 flex justify-between border-t border-slate-100 pt-2">
          <span class="font-semibold">Total</span>
          <span class="font-semibold">{{ score.toFixed(0) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
