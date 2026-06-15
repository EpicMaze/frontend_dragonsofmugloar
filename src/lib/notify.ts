import { toast } from 'vue-sonner'

export const notify = {
  error: (msg: string, desc: string) => {
    toast.error(msg, {
      description: desc,
      class: 'custom-notify custom-notify-error',
      closeButton: true,
    })
  },

  warning: (msg: string) => {
    toast.warning('Warning!', {
      description: msg,
      class: 'custom-notify custom-notify-warning',
      closeButton: true,
    })
  },
}
