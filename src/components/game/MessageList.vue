<script setup lang="ts">
  import { computed } from 'vue'
  import { useGameStore } from '@/stores/game'
  import { useMessages } from '@/composables/useMessages'
  import { useSolveModal } from '@/composables/useSolveModal'
  import MessageCard from './MessageCard.vue'
  import SolveModal from './SolveModal.vue'

  const store = useGameStore()

  const { messagesQuery, solveMutation, refetchMessages, fetchTurn } = useMessages(
    computed(() => store.gameId! ?? ''),
  )
  const { solveMessage, isPending, isOpen, handleOpenChange, result, expired } =
    useSolveModal(solveMutation)

  const messages = computed(() => messagesQuery.data.value ?? [])
</script>

<template>
  <div class="space-y-4">
    <SolveModal
      :open="isOpen"
      :result="result"
      :expired="expired"
      :loading="isPending"
      @update:open="handleOpenChange"
    />

    <div class="flex items-center justify-between">
      <h2 class="text-lg font-bold text-slate-900">
        Messages
        <span class="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
          {{ messages.length }}
        </span>
      </h2>
      <button
        class="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        @click="refetchMessages"
      >
        Refresh
      </button>
    </div>

    <p v-if="messagesQuery.isPending.value" class="text-slate-500">Loading messages...</p>

    <p v-else-if="messagesQuery.isError.value" class="text-red-600">Failed to load messages.</p>

    <p v-else-if="messages.length === 0" class="text-center text-slate-500">
      No messages available.
    </p>

    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <MessageCard
        v-for="message in messages"
        :key="message.adId"
        :message="message"
        :text="message.message"
        :fetch-turn="fetchTurn"
        :loading="isPending"
        @solve="solveMessage"
      />
    </div>
  </div>
</template>
