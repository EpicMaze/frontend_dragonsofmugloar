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
  const pinia = createTestingPinia({ stubActions: false })
  const wrapper = mount(component, {
    global: {
      plugins: [pinia],
      stubs: { Teleport: true },
    },
    ...options,
  })

  return { wrapper, pinia }
}

export const mountWithQuery = (component: Component, options: MountingOptions<unknown> = {}) => {
  const pinia = createTestingPinia({ stubActions: false })

  const wrapper = mount(component, {
    global: {
      plugins: [pinia, [VueQueryPlugin, { queryClient: createTestQueryClient() }]],
      stubs: { Teleport: true },
    },
    ...options,
  })
  return { wrapper, pinia }
}

export const mountWithApp = (component: Component, options: MountingOptions<unknown> = {}) => {
  const router = createRouter({ history: createMemoryHistory(), routes })
  const pinia = createTestingPinia({ stubActions: false })

  const wrapper = mount(component, {
    global: {
      plugins: [pinia, [VueQueryPlugin, { queryClient: createTestQueryClient() }], router],
      stubs: { Teleport: true },
    },
    ...options,
  })
  return { wrapper, pinia, router }
}

export const mountComposable = <T>(composable: () => T) => {
  let wrapper: T
  const TestComponent = defineComponent({
    setup() {
      wrapper = composable()
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

  return { wrapper: wrapper!, router, pinia } as const
}
