<script setup lang="ts">
  import type { SolveAdResponse } from '@/api/types'
  import type { SolveStatsDiff } from '@/composables/useAds'
  export interface SolveModalContent {
    result: SolveAdResponse
    diff: SolveStatsDiff | null
  }
  defineProps<{
    open: boolean
    content: SolveModalContent | null
    expired: boolean
    loading: boolean
  }>()

  const emit = defineEmits<{
    'update:open': [value: boolean]
  }>()
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50" @click="emit('update:open', false)" />

      <!-- Modal -->
      <div class="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <!-- Loading -->
        <div
          v-if="loading"
          class="flex min-h-[220px] flex-col items-center justify-center gap-4 py-8 text-slate-700"
        >
          <div
            class="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700"
          />
          <p class="text-sm font-medium text-slate-700">Attempting to solve</p>
        </div>

        <!-- Expired -->
        <template v-else-if="expired">
          <h2 class="text-lg font-semibold text-slate-900">Too late!</h2>
          <p class="mt-2 text-sm text-slate-600">
            Contractor got tired of waiting and took their business elsewhere...
          </p>
          <button
            class="mt-4 w-full rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
            @click="emit('update:open', false)"
          >
            Close
          </button>
        </template>

        <!-- Result -->
        <template v-else-if="content?.result">
          <h2
            :class="[
              'text-lg font-semibold',
              { 'text-green-700': content.result.success, 'text-red-700': !content.result.success },
            ]"
          >
            {{
              content.result.success ? 'Task solved succesfully!' : 'You failed to solve the task!'
            }}
          </h2>
          <div
            :class="[
              'mt-4 grid grid-cols-3 gap-3 rounded-3xl border p-4 text-sm text-slate-700',
              {
                'border-green-200 bg-green-50': content.result.success,
                'border-red-200 bg-red-50': !content.result.success,
              },
            ]"
          >
            <div>
              <p class="'text-xs capitalized tracking-wide text-slate-500">
                {{
                  content.result.success
                    ? 'You live for another day'
                    : 'You lost a live, carefull buddy'
                }}
              </p>
            </div>
            <div>
              <p class="text-xs uppercase tracking-wide text-slate-500">Gold:</p>
              <p class="mt-1 font-medium text-yellow-600">+{{ content.diff?.gold ?? 0 }}</p>
            </div>
            <div>
              <p class="text-xs uppercase tracking-wide text-slate-500">Score:</p>
              <p class="mt-1 font-medium text-slate-900">+{{ content.diff?.score ?? 0 }}</p>
            </div>
          </div>
          <button
            class="mt-4 w-full rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
            @click="emit('update:open', false)"
          >
            Close
          </button>
        </template>
      </div>
    </div>
  </Teleport>
</template>
