<template>
  <div class="app">
    <header class="app-header">
      <h1 class="app-title">DateMaster</h1>
      <div class="header-actions">
        <button class="btn btn-secondary menu-toggle" @click="toggleMenu" aria-label="Toggle Menu">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
          </svg>
        </button>
      </div>
    </header>

    <main class="app-main">
      <DateCalculator />
    </main>

    <MenuPanel 
      :isOpen="isMenuOpen" 
      @close="closeMenu"
    />
    <ThemeToggle />
    <ToastNotification />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DateCalculator from './components/DateCalculator.vue'
import MenuPanel from './components/MenuPanel.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import ToastNotification from './components/ToastNotification.vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}
</script>

<style>
.app {
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--bg-secondary);
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.menu-toggle {
  width: 44px;
  height: 44px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  transition: color 0.2s ease;
}

.menu-toggle:hover {
  color: var(--accent-color);
}

.app-main {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 76px); /* Header height + padding */
}

@media (max-width: 768px) {
  .app-main {
    padding: 0.5rem;
  }
}
</style>
