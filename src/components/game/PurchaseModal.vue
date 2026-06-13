<script setup lang="ts">
  import type { PurchaseItemResponse } from '@/api/types'

  defineProps<{
    open: boolean
    result: PurchaseItemResponse | null
    loading: boolean
  }>()

  const emit = defineEmits<{
    'update:open': [value: boolean]
  }>()
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="emit('update:open', false)" />

      <div class="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div
          v-if="loading"
          class="flex min-h-[220px] flex-col items-center justify-center gap-4 py-8"
        >
          <div
            class="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700"
          />
          <p class="text-sm font-medium text-slate-700">Purchasing item...</p>
        </div>

        <template v-else>
          <h2 class="text-lg font-semibold text-slate-900">
            {{ result?.shoppingSuccess ? '✅ Item bought!' : '❌ Failed to buy item' }}
          </h2>

          <div
            class="mt-4 grid grid-cols-2 gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm"
          >
            <div>
              <p class="text-xs uppercase tracking-wide text-slate-500">Lives</p>
              <p class="mt-1 font-medium text-slate-900">{{ result?.lives ?? '—' }}</p>
            </div>
            <div>
              <p class="text-xs uppercase tracking-wide text-slate-500">Gold</p>
              <p class="mt-1 font-medium text-slate-900">{{ result?.gold ?? '—' }}</p>
            </div>
            <div>
              <p class="text-xs uppercase tracking-wide text-slate-500">Level</p>
              <p class="mt-1 font-medium text-slate-900">{{ result?.level ?? '—' }}</p>
            </div>
            <div>
              <p class="text-xs uppercase tracking-wide text-slate-500">Turn</p>
              <p class="mt-1 font-medium text-slate-900">{{ result?.turn ?? '—' }}</p>
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
