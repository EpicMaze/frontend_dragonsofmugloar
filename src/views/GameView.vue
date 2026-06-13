<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import { useGameStore } from '@/stores/game'
  import { useMessages } from '@/composables/useMessages'
  import { useReputation } from '@/composables/useReputation'
  import { useShop } from '@/composables/useShop'
  import MessageList from '@/components/game/MessageList.vue'
  import ShopPanel from '@/components/game/ShopPanel.vue'
  import GameStats from '@/components/game/GameStats.vue'
  import ReputationStats from '@/components/game/ReputationStats.vue'

  type GameView = 'messages' | 'shop'

  const router = useRouter()
  const store = useGameStore()
  const { game } = storeToRefs(store)

  const currentView = ref<GameView>('messages')
  const gameId = computed(() => game.value?.gameId ?? '')

  const { messagesQuery, solveMutation, refetchMessages, fetchTurn } = useMessages(gameId.value)
  const { shopQuery, purchaseMutation } = useShop(gameId.value)
  useReputation(gameId.value)
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-6">
    <div class="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)_320px]">
      <!-- LEFT: Controls -->
      <aside class="space-y-4">
        <button
          class="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          @click="router.push('/')"
        >
          ← Back
        </button>

        <div class="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
          <h3 class="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Views</h3>
          <div class="space-y-2">
            <button
              :class="[
                'w-full rounded-md px-3 py-2 text-sm font-medium transition-colors',
                currentView === 'messages'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
              ]"
              @click="currentView = 'messages'"
            >
              Messages
            </button>
            <button
              :class="[
                'w-full rounded-md px-3 py-2 text-sm font-medium transition-colors',
                currentView === 'shop'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
              ]"
              @click="currentView = 'shop'"
            >
              Shop
            </button>
          </div>
        </div>
      </aside>

      <!-- CENTER: Main Viewport -->
      <main class="space-y-4">
        <MessageList
          v-if="currentView === 'messages'"
          :messages="messagesQuery.data.value?.messages ?? []"
          :is-loading="messagesQuery.isPending.value"
          :is-error="messagesQuery.isError.value"
          :solve-mutation="solveMutation"
          :fetch-turn="fetchTurn"
          @refetch="refetchMessages"
        />
        <ShopPanel
          v-if="currentView === 'shop'"
          :items="shopQuery.data.value ?? []"
          :is-loading="shopQuery.isPending.value"
          :purchase-mutation="purchaseMutation"
        />
      </main>

      <!-- RIGHT: Stats & Reputation -->
      <aside class="space-y-4">
        <GameStats />
        <ReputationStats />
      </aside>
    </div>
  </div>
</template>
