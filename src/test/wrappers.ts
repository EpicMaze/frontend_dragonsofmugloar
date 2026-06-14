import { createTestingPinia } from '@pinia/testing'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { mount, type MountingOptions } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { routes } from '@/router'
import { defineComponent, type Component } from 'vue'

// fresh query per test so no cache shenanigans
const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  })
}

export const mountWithPinia = (component: Component, options: MountingOptions<unknown> = {}) => {
  return mount(component, {
    global: {
      plugins: [
        createTestingPinia({ stubActions: false }), // use real store
      ],
    },
    ...options,
  })
}

export const mountComposable = <T>(composable: () => T) => {
  let result: T
  const TestComponent = defineComponent({
    setup() {
      result = composable()
      return () => null
    },
  })

  const pinia = createTestingPinia({ stubActions: false })
  const queryClient = createTestQueryClient()
  const router = createRouter({
    history: createMemoryHistory(),
    routes,
  })

  mount(TestComponent, {
    global: {
      plugins: [pinia, [VueQueryPlugin, { queryClient }], router],
    },
  })

  return [result!, router] as const
}
