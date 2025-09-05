<template>
  <Transition name="toast">
    <div
      v-if="toasts.length"
      class="toast-container"
    >
      <TransitionGroup name="toast-list">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="toast.type"
        >
          <div class="toast-content">
            {{ toast.message }}
          </div>
          <button 
            class="toast-close"
            @click="removeToast(toast.id)"
            aria-label="Close notification"
          ></button>
        </div>
      </TransitionGroup>
    </div>
  </Transition>
</template>

<script setup>
import { useToasts } from '../composables/useToasts'

const { toasts, removeToast } = useToasts()
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 100%;
  width: 380px;
  padding: 0.5rem;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  background: var(--toast-info-bg);
  color: var(--toast-info-text);
  border-left: 4px solid var(--toast-info-border);
  box-shadow: var(--toast-shadow);
  backdrop-filter: blur(8px);
  opacity: var(--toast-opacity);
}

.toast::before {
  content: '';
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.toast.success {
  background: var(--toast-success-bg);
  color: var(--toast-success-text);
  border-color: var(--toast-success-border);
}

.toast.success::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2347b347'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3E%3C/svg%3E");
}

.toast.error {
  background: var(--toast-error-bg);
  color: var(--toast-error-text);
  border-color: var(--toast-error-border);
}

.toast.error::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ef5350'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'/%3E%3C/svg%3E");
}

.toast-content {
  flex: 1;
  padding: 0.125rem 0;
  font-size: 0.9375rem;
  line-height: 1.4;
}

.toast-close {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin: 0.125rem 0 0 0.5rem;
  background: transparent;
  border: none;
  color: inherit;
  opacity: 0.6;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease;
}

.toast-close::before {
  content: '×';
  font-size: 1.5rem;
  line-height: 1;
  font-weight: 400;
}

.toast-close:hover {
  opacity: 1;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-list-move,
.toast-list-enter-active,
.toast-list-leave-active {
  transition: all 0.3s ease;
}

.toast-list-leave-active {
  position: absolute;
}

.toast-list-enter-from,
.toast-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
