import { describe, it, expect } from 'vitest'
import { mountComposable } from '../wrappers'
import { useActionModal } from '@/composables/useActionModal'

describe('useActionModal', () => {
  it('initializes with closed state', () => {
    const [modal] = mountComposable(() => useActionModal<string>())
    expect(modal.isOpen.value).toBe(false)
    expect(modal.expired.value).toBe(false)
    expect(modal.content.value).toBeNull()
  })

  it('handleOpen sets isOpen true and resets content and expired', () => {
    const [modal] = mountComposable(() => useActionModal<string>())
    modal.setContent('old content')
    modal.setExpired(true)
    modal.handleOpen()
    expect(modal.isOpen.value).toBe(true)
    expect(modal.content.value).toBeNull()
    expect(modal.expired.value).toBe(false)
  })

  it('handleOpenChange(false) closes and clears content', () => {
    const [modal] = mountComposable(() => useActionModal<string>())
    modal.handleOpen()
    modal.setContent('some content')
    modal.handleOpenChange(false)
    expect(modal.isOpen.value).toBe(false)
    expect(modal.content.value).toBeNull()
  })

  it('handleOpenChange(true) does nothing', () => {
    const [modal] = mountComposable(() => useActionModal<string>())
    modal.handleOpenChange(true)
    expect(modal.isOpen.value).toBe(false)
  })

  it('setContent sets content value', () => {
    const [modal] = mountComposable(() => useActionModal<string>())
    modal.setContent('hello')
    expect(modal.content.value).toBe('hello')
  })

  it('setExpired sets expired value', () => {
    const [modal] = mountComposable(() => useActionModal<string>())
    modal.setExpired(true)
    expect(modal.expired.value).toBe(true)
  })

  it('handleOpen resets expired to false on reopen', () => {
    const [modal] = mountComposable(() => useActionModal<string>())
    modal.setExpired(true)
    modal.handleOpen()
    expect(modal.expired.value).toBe(false)
  })

  it('handleOpen resets content to null on reopen', () => {
    const [modal] = mountComposable(() => useActionModal<string>())
    modal.setContent('stale')
    modal.handleOpen()
    expect(modal.content.value).toBeNull()
  })
})
