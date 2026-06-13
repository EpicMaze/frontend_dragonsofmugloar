<script setup lang="ts">
  import { useTurnsRemaining } from '@/composables/useTurnsRemaining'
  import type { Message } from '@/api/types'

  const props = defineProps<{
    message: Omit<Message, 'message'>
    text: string
    fetchTurn: number | null
    loading: boolean
  }>()

  const emit = defineEmits<{
    solve: [adId: string]
  }>()

  const turnsRemaining = useTurnsRemaining(props.message.expiresIn, props.fetchTurn ?? 0)
</script>

<template>
  <div
    class="flex flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
  >
    <!-- Expire label placeholder -->
    <div
      class="mb-2 text-xs font-medium"
      :class="turnsRemaining <= 0 ? 'text-red-500' : 'text-slate-500'"
    >
      {{ turnsRemaining <= 0 ? 'Expired' : `${turnsRemaining} turns left` }}
    </div>

    <div class="flex-1 space-y-3">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Task</p>
        <p class="mt-1 text-sm font-medium text-slate-900">{{ text }}</p>
      </div>

      <div class="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p class="text-xs text-slate-500">Probability</p>
          <p class="font-medium text-slate-700">{{ message.probability ?? '—' }}</p>
        </div>
        <div>
          <p class="text-xs text-slate-500">Reward</p>
          <p class="font-medium text-slate-700">{{ message.reward }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p class="text-xs text-slate-500">Expires</p>
          <p class="font-medium text-slate-700">{{ message.expiresIn }}</p>
        </div>
        <div>
          <p class="text-xs text-slate-500">Encryption</p>
          <p class="font-medium text-slate-700">{{ message.encrypted ?? 'None' }}</p>
        </div>
      </div>
    </div>

    <button
      :disabled="loading"
      class="mt-4 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      @click="emit('solve', message.adId)"
    >
      Solve
    </button>
  </div>
</template>
