import { ref } from 'vue'

export const useActionModal = <T>() => {
  const isOpen = ref(false)
  const expired = ref(false)
  const content = ref<T | null>(null)

  const handleOpen = () => {
    content.value = null
    expired.value = false
    isOpen.value = true
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      isOpen.value = false
      content.value = null
    }
  }

  const setContent = (data: T) => {
    content.value = data
  }

  const setExpired = (value: boolean) => {
    expired.value = value
  }

  return { isOpen, expired, content, setContent, setExpired, handleOpen, handleOpenChange }
}
