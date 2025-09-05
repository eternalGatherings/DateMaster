import { ref, onMounted } from 'vue'

export function useNotifications() {
  const permission = ref('default')
  const notifications = ref([])
  const toasts = ref([])
  const notificationSettings = ref({
    enabled: true,
    daysBeforeEvent: 7,
    timeOfDay: '09:00',
    soundEnabled: true
  })

  // Load settings from localStorage
  onMounted(() => {
    const savedSettings = localStorage.getItem('notification-settings')
    if (savedSettings) {
      notificationSettings.value = JSON.parse(savedSettings)
    }
    
    const savedNotifications = localStorage.getItem('notifications-history')
    if (savedNotifications) {
      notifications.value = JSON.parse(savedNotifications)
    }

    // Check permission status
    if ('Notification' in window) {
      permission.value = Notification.permission
    }
  })

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      return false
    }

    try {
      const result = await Notification.requestPermission()
      permission.value = result
      return result === 'granted'
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }

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

  const scheduleNotification = (entry) => {
    if (!notificationSettings.value.enabled || permission.value !== 'granted') {
      return false
    }

    const entryDate = new Date(entry.date)
    const notifyDate = new Date(entryDate)
    notifyDate.setDate(entryDate.getDate() - notificationSettings.value.daysBeforeEvent)
    
    const [hours, minutes] = notificationSettings.value.timeOfDay.split(':')
    notifyDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)

    // Store scheduled notification
    const notification = {
      id: crypto.randomUUID(),
      entryId: entry.id,
      title: entry.name,
      date: notifyDate.toISOString(),
      status: 'pending'
    }

    notifications.value.push(notification)
    localStorage.setItem('notifications-history', JSON.stringify(notifications.value))

    // Schedule the notification
    const timeUntilNotification = notifyDate.getTime() - Date.now()
    if (timeUntilNotification > 0) {
      setTimeout(() => {
        showNotification(entry)
        updateNotificationStatus(notification.id, 'sent')
      }, timeUntilNotification)
    }

    return true
  }

  const showNotification = (entry) => {
    if (!('Notification' in window) || permission.value !== 'granted') {
      return
    }

    const notification = new Notification(entry.name, {
      body: `Reminder: ${entry.name} is coming up!`,
      icon: '/notification-icon.png', // You'll need to add this icon
      silent: !notificationSettings.value.soundEnabled
    })

    notification.onclick = () => {
      window.focus()
      // You can emit an event or use router to navigate to the entry
    }
  }

  const updateNotificationStatus = (id, status) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.status = status
      localStorage.setItem('notifications-history', JSON.stringify(notifications.value))
    }
  }

  const updateSettings = (settings) => {
    notificationSettings.value = { ...notificationSettings.value, ...settings }
    localStorage.setItem('notification-settings', JSON.stringify(notificationSettings.value))
  }

  const clearHistory = () => {
    notifications.value = notifications.value.filter(n => n.status === 'pending')
    localStorage.setItem('notifications-history', JSON.stringify(notifications.value))
  }

  return {
    permission,
    notifications,
    notificationSettings,
    requestPermission,
    scheduleNotification,
    showNotification,
    updateSettings,
    clearHistory
  }
}
