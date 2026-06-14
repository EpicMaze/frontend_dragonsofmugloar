import { describe, it, expect } from 'vitest'
import { mountComposable } from '../wrappers'
import { useActionModal } from '@/composables/useActionModal'

describe('useActionModal', () => {
  it('initializes with closed state', () => {
    const { wrapper } = mountComposable(() => useActionModal<string>())
    expect(wrapper.isOpen.value).toBe(false)
    expect(wrapper.expired.value).toBe(false)
    expect(wrapper.content.value).toBeNull()
  })

  it('handleOpen sets isOpen true and resets content and expired', () => {
    const { wrapper } = mountComposable(() => useActionModal<string>())
    wrapper.setContent('old content')
    wrapper.setExpired(true)
    wrapper.handleOpen()
    expect(wrapper.isOpen.value).toBe(true)
    expect(wrapper.content.value).toBeNull()
    expect(wrapper.expired.value).toBe(false)
  })

  it('handleOpenChange(false) closes and clears content', () => {
    const { wrapper } = mountComposable(() => useActionModal<string>())
    wrapper.handleOpen()
    wrapper.setContent('some content')
    wrapper.handleOpenChange(false)
    expect(wrapper.isOpen.value).toBe(false)
    expect(wrapper.content.value).toBeNull()
  })

  it('handleOpenChange(true) does nothing', () => {
    const { wrapper } = mountComposable(() => useActionModal<string>())
    wrapper.handleOpenChange(true)
    expect(wrapper.isOpen.value).toBe(false)
  })

  it('setContent sets content value', () => {
    const { wrapper } = mountComposable(() => useActionModal<string>())
    wrapper.setContent('hello')
    expect(wrapper.content.value).toBe('hello')
  })

  it('setExpired sets expired value', () => {
    const { wrapper } = mountComposable(() => useActionModal<string>())
    wrapper.setExpired(true)
    expect(wrapper.expired.value).toBe(true)
  })

  it('handleOpen resets expired to false on reopen', () => {
    const { wrapper } = mountComposable(() => useActionModal<string>())
    wrapper.setExpired(true)
    wrapper.handleOpen()
    expect(wrapper.expired.value).toBe(false)
  })

  it('handleOpen resets content to null on reopen', () => {
    const { wrapper } = mountComposable(() => useActionModal<string>())
    wrapper.setContent('stale')
    wrapper.handleOpen()
    expect(wrapper.content.value).toBeNull()
  })
})
