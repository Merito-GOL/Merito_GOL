export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: number
  type: ToastType
  title: string
  message?: string
  duration?: number
}

let nextId = 1

const toasts = useState<Toast[]>('app.toasts', () => [])

export const useToast = () => {
  const add = (toast: Omit<Toast, 'id'>) => {
    const id = nextId++
    const entry: Toast = { duration: 4000, ...toast, id }
    toasts.value = [...toasts.value, entry]

    setTimeout(() => {
      remove(id)
    }, entry.duration)

    return id
  }

  const remove = (id: number) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  const success = (title: string, message?: string) =>
    add({ type: 'success', title, message })

  const error = (title: string, message?: string) =>
    add({ type: 'error', title, message, duration: 6000 })

  const warning = (title: string, message?: string) =>
    add({ type: 'warning', title, message })

  const info = (title: string, message?: string) =>
    add({ type: 'info', title, message })

  return { toasts, add, remove, success, error, warning, info }
}
