<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import { useGameStore } from '@/stores/game'
  import { useReputation } from '@/composables/useReputation'
  import AdList from '@/components/AdList.vue'
  import ShopList from '@/components/ShopList.vue'
  import GameStats from '@/components/GameStats.vue'
  import ReputationStats from '@/components/ReputationStats.vue'

  type GameView = 'ads' | 'shop'

  const router = useRouter()
  const store = useGameStore()
  const { game } = storeToRefs(store)

  const currentView = ref<GameView>('ads')

  useReputation(computed(() => game.value?.gameId ?? ''))
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-6">
    <div class="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)_320px]">
      <!-- LEFT: Controls -->
      <aside class="space-y-4 order-2 lg:order-1">
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
                currentView === 'ads'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
              ]"
              @click="currentView = 'ads'"
            >
              Tasks
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
      <main class="space-y-4 order-3 lg:order-2">
        <AdList v-if="currentView === 'ads'" />
        <ShopList v-if="currentView === 'shop'" />
      </main>

      <!-- RIGHT: Stats & Reputation -->
      <aside class="space-y-4 order-1 lg:order-3">
        <GameStats />
        <ReputationStats />
      </aside>
    </div>
  </div>
</template>
