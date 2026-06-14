import { describe, it, expect } from 'vitest'
import { mountWithPinia } from '../wrappers'
import ShopItem from '@/components/game/ShopItem.vue'

const mockItem = { id: 'item-1', name: 'Health Potion', cost: 50 }

describe('ShopItem', () => {
  it('renders item name and cost', () => {
    const { wrapper } = mountWithPinia(ShopItem, { props: { item: mockItem, loading: false } })
    expect(wrapper.text()).toContain('Health Potion')
    expect(wrapper.text()).toContain('50')
  })

  it('emits purchase event with item id on buy click', async () => {
    const { wrapper } = mountWithPinia(ShopItem, { props: { item: mockItem, loading: false } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('purchase')).toBeTruthy()
    expect(wrapper.emitted('purchase')![0]).toEqual(['item-1'])
  })

  it('disables button when loading', () => {
    const { wrapper } = mountWithPinia(ShopItem, { props: { item: mockItem, loading: true } })
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })
})
