import { ref, readonly } from 'vue'

// Create a global state
const toasts = ref([])

// Actions
const showToast = (message, type = 'success') => {
  const id = Date.now()
  const toast = {
    id,
    message,
    type,
    timestamp: new Date()
  }
  toasts.value.push(toast)
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    removeToast(id)
  }, 3000)
}

const removeToast = (id) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index !== -1) {
    toasts.value.splice(index, 1)
  }
}

// Export composable
export function useToasts() {
  return {
    toasts: readonly(toasts),
    showToast,
    removeToast
  }
}
