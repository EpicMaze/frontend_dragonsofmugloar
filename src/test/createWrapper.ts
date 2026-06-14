import { createTestingPinia } from '@pinia/testing'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { mount, type MountingOptions } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { routes } from '@/router'
import type { Component } from 'vue'

// fresh query per test so no cache shenanigans
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  })
}

export function createWrapper(component: Component, options: MountingOptions<unknown> = {}) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes,
  })

  const queryClient = createTestQueryClient()

  return mount(component, {
    global: {
      plugins: [
        createTestingPinia({ stubActions: false }), // use real store
        [VueQueryPlugin, { queryClient }],
        router,
      ],
    },
    ...options,
  })
}

// if composables need exposed query client
export function createTestQueryClientWrapper() {
  return createTestQueryClient()
}
