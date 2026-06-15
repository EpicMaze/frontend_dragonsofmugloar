import { describe, it, expect } from 'vitest'
import { mountWithPinia } from '../wrappers'
import ShopItem from '@/components/game/ShopItem.vue'
import { useGameStore } from '@/stores/game'
import { nextTick } from 'vue'

const mockItem = { id: 'item-1', name: 'Health Potion', cost: 50 }

describe('ShopItem', () => {
  it('renders item name and cost', () => {
    const { wrapper } = mountWithPinia(ShopItem, { props: { item: mockItem, loading: false } })
    expect(wrapper.text()).toContain('Health Potion')
    expect(wrapper.text()).toContain('50')
  })

  it('emits purchase event with item id on buy click when enough gold', async () => {
    const { wrapper, pinia } = mountWithPinia(ShopItem, {
      props: { item: mockItem, loading: false },
    })
    const store = useGameStore(pinia)
    store.$patch({ game: { gold: 999 } })
    await nextTick()
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('purchase')).toBeTruthy()
    expect(wrapper.emitted('purchase')![0]).toEqual(['item-1'])
  })

  it('does not emits purchase event with item id on buy click when not enough gold', async () => {
    const { wrapper } = mountWithPinia(ShopItem, {
      props: { item: mockItem, loading: false },
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('purchase')).toBe(undefined)
  })

  it('disables button when loading', () => {
    const { wrapper } = mountWithPinia(ShopItem, { props: { item: mockItem, loading: true } })
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })
})
