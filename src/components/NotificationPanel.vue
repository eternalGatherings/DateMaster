<template>
  <div class="notification-panel">
    <h3>Notifications</h3>

    <!-- Permission Status -->
    <div class="permission-status" v-if="permission !== 'granted'">
      <div class="alert" :class="permission === 'denied' ? 'alert-error' : 'alert-warning'">
        <div v-if="permission === 'denied'">
          <h4>Notifications Blocked</h4>
          <p>Please enable notifications in your browser settings to receive reminders.</p>
        </div>
        <div v-else>
          <h4>Enable Notifications</h4>
          <p>Get reminders for your important dates.</p>
          <button class="btn btn-primary" @click="requestPermission">
            Enable Notifications
          </button>
        </div>
      </div>
    </div>

    <!-- Notification Settings -->
    <div class="settings-section">
      <h4>Settings</h4>
      <div class="settings-form">
        <div class="form-group">
          <label class="switch">
            <input
              type="checkbox"
              v-model="settings.enabled"
              @change="updateSettings"
            >
            <span class="slider"></span>
          </label>
          <span>Enable Notifications</span>
        </div>

        <div class="form-group">
          <label>Remind me</label>
          <select
            v-model="settings.daysBeforeEvent"
            class="form-control"
            @change="updateSettings"
          >
            <option value="0">On the day</option>
            <option value="1">1 day before</option>
            <option value="3">3 days before</option>
            <option value="7">1 week before</option>
            <option value="14">2 weeks before</option>
            <option value="30">1 month before</option>
          </select>
        </div>

        <div class="form-group">
          <label>Time of Day</label>
          <input
            type="time"
            v-model="settings.timeOfDay"
            class="form-control"
            @change="updateSettings"
          >
        </div>

        <div class="form-group">
          <label class="switch">
            <input
              type="checkbox"
              v-model="settings.soundEnabled"
              @change="updateSettings"
            >
            <span class="slider"></span>
          </label>
          <span>Enable Sound</span>
        </div>
      </div>
    </div>

    <!-- Notification History -->
    <div class="history-section">
      <div class="section-header">
        <h4>Notification History</h4>
        <button
          v-if="notifications.length"
          class="btn btn-text"
          @click="clearHistory"
        >
          Clear History
        </button>
      </div>

      <div v-if="notifications.length" class="notifications-list">
        <div
          v-for="notification in sortedNotifications"
          :key="notification.id"
          class="notification-item"
          :class="notification.status"
        >
          <div class="notification-icon">
            <svg v-if="notification.status === 'sent'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
            <svg v-else-if="notification.status === 'pending'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
            </svg>
          </div>

          <div class="notification-content">
            <div class="notification-title">{{ notification.title }}</div>
            <div class="notification-time">
              {{ formatDate(notification.date) }}
            </div>
          </div>

          <div class="notification-status">
            {{ notification.status }}
          </div>
        </div>
      </div>
      <p v-else class="no-data">No notifications yet</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useNotifications } from '../composables/useNotifications'
import { format } from 'date-fns'

const {
  permission,
  notifications,
  notificationSettings: settings,
  requestPermission,
  updateSettings,
  clearHistory
} = useNotifications()

const sortedNotifications = computed(() => {
  return [...notifications.value].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  )
})

const formatDate = (date) => {
  return format(new Date(date), 'MMM d, yyyy HH:mm')
}
</script>

<style scoped>
.notification-panel {
  padding: 1rem;
}

.alert {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.alert h4 {
  margin: 0 0 0.5rem;
}

.alert p {
  margin: 0 0 1rem;
}

.alert-warning {
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.2);
  color: #856404;
}

.alert-error {
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.2);
  color: #721c24;
}

.settings-section {
  background: var(--card-bg);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Switch Toggle */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--bg-secondary);
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: var(--text-primary);
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--accent-color);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.history-section {
  background: var(--card-bg);
  padding: 1rem;
  border-radius: 8px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h4 {
  margin: 0;
}

.btn-text {
  background: none;
  border: none;
  color: var(--accent-color);
  padding: 0;
  font-size: 0.9rem;
  cursor: pointer;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.notification-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: var(--bg-primary);
  border-radius: 6px;
}

.notification-icon {
  color: var(--text-secondary);
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: 500;
  color: var(--text-primary);
}

.notification-time {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.notification-status {
  font-size: 0.8rem;
  text-transform: capitalize;
}

.notification-item.sent .notification-icon {
  color: #28a745;
}

.notification-item.pending .notification-icon {
  color: #ffc107;
}

.no-data {
  text-align: center;
  color: var(--text-secondary);
  padding: 2rem;
}

@media (max-width: 768px) {
  .form-group {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
