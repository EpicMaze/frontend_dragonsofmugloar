<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useGameStore } from '@/stores/game'
  import { useShop } from '@/composables/useShop'
  import { usePurchaseModal } from '@/composables/usePurchaseModal'
  import ShopCard from './ShopCard.vue'
  import PurchaseModal from './PurchaseModal.vue'

  const store = useGameStore()
  const { gameId } = storeToRefs(store)

  const { shopQuery, purchaseMutation, purchaseDiff } = useShop(computed(() => gameId.value ?? ''))
  const { purchaseItem, isPending, isOpen, handleOpenChange, result } = usePurchaseModal(
    purchaseMutation,
    purchaseDiff,
  )

  const items = computed(() => shopQuery.data.value ?? [])
</script>

<template>
  <div class="space-y-4">
    <PurchaseModal
      :open="isOpen"
      :content="result"
      :loading="isPending"
      @update:open="handleOpenChange"
    />

    <div class="flex items-center justify-between">
      <h2 class="text-lg font-bold text-slate-900">
        Shop
        <span class="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
          {{ items.length }}
        </span>
      </h2>
    </div>

    <p v-if="shopQuery.isPending.value" class="text-slate-500">Loading shop...</p>

    <p v-else-if="shopQuery.isError.value" class="text-red-600">Failed to load shop.</p>

    <p v-else-if="items.length === 0" class="text-center text-slate-500">No items available.</p>

    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <ShopCard
        v-for="item in items"
        :key="item.id"
        :item="item"
        :loading="isPending"
        @purchase="purchaseItem"
      />
    </div>
  </div>
</template>
