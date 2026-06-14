import { describe, it, expect } from 'vitest'
import { mountWithQuery } from '../wrappers'
import AdCard from '@/components/game/AdCard.vue'
import { useGameStore } from '@/stores/game'
import { flushPromises } from '@vue/test-utils'

const mockAd = {
  adId: 'ad-1',
  message: 'Help the village',
  reward: 100,
  expiresIn: 5,
  probability: 'Sure thing',
  encrypted: null,
}

const mockGame = {
  gameId: 'game-1',
  lives: 3,
  gold: 0,
  level: 1,
  score: 0,
  highScore: 0,
  turn: 0,
}

describe('AdCard', () => {
  it('renders ad message and reward', () => {
    const { wrapper } = mountWithQuery(AdCard, {
      props: { ad: mockAd, fetchTurn: 0, loading: false },
    })
    expect(wrapper.text()).toContain('Help the village')
    expect(wrapper.text()).toContain('100')
  })

  it('renders turns remaining', async () => {
    const { wrapper, pinia } = mountWithQuery(AdCard, {
      props: { ad: mockAd, fetchTurn: 0, loading: false },
    })
    const store = useGameStore(pinia)
    store.$patch({ game: mockGame })
    await flushPromises()
    expect(wrapper.text()).toContain('turns left')
  })

  it('shows expired label when turns remaining <= 0', async () => {
    const { wrapper, pinia } = mountWithQuery(AdCard, {
      props: { ad: { ...mockAd, expiresIn: 1 }, fetchTurn: 0, loading: false },
    })
    const store = useGameStore(pinia)
    store.$patch({ game: { ...mockGame, turn: 5 } })
    await flushPromises()
    expect(wrapper.text()).toContain('Expired')
  })

  it('emits solve event with adId on button click', async () => {
    const { wrapper } = mountWithQuery(AdCard, {
      props: { ad: mockAd, fetchTurn: 0, loading: false },
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('solve')).toBeTruthy()
    expect(wrapper.emitted('solve')![0]).toEqual(['ad-1'])
  })

  it('disables solve button when loading', () => {
    const { wrapper } = mountWithQuery(AdCard, {
      props: { ad: mockAd, fetchTurn: 0, loading: true },
    })
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('shows decrypt button for encrypted ads', () => {
    const { wrapper } = mountWithQuery(AdCard, {
      props: { ad: { ...mockAd, encrypted: 1 }, fetchTurn: 0, loading: false },
    })
    expect(wrapper.text()).toContain('Decrypt')
  })

  it('does not show decrypt button for unencrypted ads', () => {
    const { wrapper } = mountWithQuery(AdCard, {
      props: { ad: mockAd, fetchTurn: 0, loading: false },
    })
    expect(wrapper.text()).not.toContain('Decrypt')
  })

  it('toggles decrypted view on decrypt button click', async () => {
    const { wrapper } = mountWithQuery(AdCard, {
      props: {
        ad: { ...mockAd, message: btoa('Hello'), probability: btoa('Sure thing'), encrypted: 1 },
        fetchTurn: 0,
        loading: false,
      },
    })
    await wrapper.find('button.text-blue-500').trigger('click')
    expect(wrapper.text()).toContain('Hello')
  })
})
