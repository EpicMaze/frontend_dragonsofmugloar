<script setup lang="ts">
  import type { Ad } from '@/types/domain.ts'
  import { computed, ref } from 'vue'
  import { assessRisk, calcTurnsRemaining, decodeAd } from '@/lib/riskAnalysis.ts'
  import AdRiskLabel from './AdRiskLabel.vue'
  import { useGameStore } from '@/stores/game'

  const props = defineProps<{
    ad: Ad
    fetchTurn: number
    loading: boolean
  }>()

  const emit = defineEmits<{
    solve: [adId: string]
  }>()

  const store = useGameStore()
  const isDecrypted = ref<boolean>(false)
  const decrypted = computed(() => decodeAd(props.ad))
  const risk = computed(() => assessRisk(props.ad))

  const turnsRemaining = computed(() =>
    calcTurnsRemaining(props.ad.expiresIn, props.fetchTurn ?? 0, store.game?.turn ?? 0),
  )

  const display = computed(() => {
    if (!isDecrypted.value) {
      return {
        text: props.ad.message,
        probability: props.ad.probability,
      }
    }
    return {
      text: decrypted.value.decryptedMessage ?? props.ad.message,
      probability: decrypted.value.decryptedProbability ?? props.ad.probability,
    }
  })

  const turnsClass = computed(() => {
    if (turnsRemaining.value <= 0) return 'text-red-500'
    if (turnsRemaining.value <= 4) return 'text-orange-500'
    return 'text-slate-500'
  })
</script>

<template>
  <div
    class="flex flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
  >
    <div class="mb-3 flex items-center justify-between">
      <span class="text-xs font-medium" :class="turnsClass">
        {{ turnsRemaining <= 0 ? `Expired` : `${turnsRemaining} turns left` }}
      </span>
      <AdRiskLabel :score="risk.score" :break-down="risk.breakdown" :notes="risk.notes" />
    </div>

    <div class="flex-1 space-y-3">
      <div>
        <div class="flex items-center justify-between">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Task:</p>
          <button
            v-if="ad.encrypted"
            class="text-xs font-medium text-blue-500 hover:text-blue-700"
            @click="isDecrypted = !isDecrypted"
          >
            {{ isDecrypted ? 'Show encrypted' : 'Decrypt' }}
          </button>
        </div>
        <p class="mt-1 text-sm font-medium text-slate-900 break-words">{{ display.text }}</p>
        <p v-if="ad.encrypted && !isDecrypted" class="mt-1 text-xs text-slate-400">Encoded</p>
      </div>

      <div class="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p class="text-xs text-slate-500">Reward:</p>
          <p class="font-medium text-slate-700">{{ ad.reward }} gold</p>
        </div>
      </div>
    </div>

    <button
      :disabled="loading"
      class="mt-4 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      @click="emit('solve', ad.adId)"
    >
      Solve
    </button>
  </div>
</template>
