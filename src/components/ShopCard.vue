<script setup lang="ts">
  import { useGameStore } from '@/stores/game'
  import type { ShopItem } from '@/types/domain'
  import { computed } from 'vue'

  const props = defineProps<{
    item: ShopItem
    loading: boolean
  }>()

  const emit = defineEmits<{
    purchase: [itemId: string]
  }>()

  const store = useGameStore()

  const notEnoughGold = computed(() => {
    const playerGold = store.game?.gold ?? 0
    return playerGold < props.item.cost
  })
</script>

<template>
  <div
    class="flex flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
  >
    <div class="flex-1 space-y-3">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Item:</p>
        <p class="mt-1 text-sm font-medium text-slate-900">{{ item.name }}</p>
      </div>

      <div class="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p class="text-xs text-slate-500">Cost:</p>
          <p class="font-medium text-yellow-600">{{ item.cost }} gold</p>
        </div>
      </div>
    </div>

    <button
      :disabled="loading || notEnoughGold"
      class="mt-4 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      @click="emit('purchase', item.id)"
    >
      Buy
    </button>
  </div>
</template>
