import { createTestingPinia } from '@pinia/testing'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { mount, type MountingOptions } from '@vue/test-utils'
import { createAppRouter, eagerRoutes } from '@/router'
import { defineComponent, type Component } from 'vue'
import { createMemoryHistory } from 'vue-router'

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
  const pinia = createTestingPinia({ stubActions: false })
  const router = createAppRouter(pinia, createMemoryHistory(), eagerRoutes)

  const wrapper = mount(component, {
    global: {
      plugins: [pinia, [VueQueryPlugin, { queryClient: createTestQueryClient() }], router],
      stubs: { Teleport: true, VueQueryDevtools: true },
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
  const router = createAppRouter(pinia)

  mount(TestComponent, {
    global: {
      plugins: [pinia, [VueQueryPlugin, { queryClient }], router],
    },
  })

  return { wrapper: wrapper!, router, pinia } as const
}
