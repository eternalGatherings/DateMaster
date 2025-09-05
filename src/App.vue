<template>
  <div class="app">
    <header class="app-header">
      <h1 class="app-title">DateMaster</h1>
      <div class="header-actions">
        <button class="btn btn-secondary menu-toggle" @click="toggleMenu">
          <span class="menu-icon"></span>
          <span class="visually-hidden">Toggle Menu</span>
        </button>
      </div>
    </header>

    <main class="app-main">
      <DateCalculator />
    </main>

    <MenuPanel :isOpen="isMenuOpen" @close="closeMenu" />
    <ThemeToggle />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DateCalculator from './components/DateCalculator.vue'
import MenuPanel from './components/MenuPanel.vue'
import ThemeToggle from './components/ThemeToggle.vue'

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
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-icon {
  position: relative;
  width: 20px;
  height: 2px;
  background: var(--text-primary);
}

.menu-icon::before,
.menu-icon::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: var(--text-primary);
  transition: transform 0.2s ease;
}

.menu-icon::before {
  transform: translateY(-6px);
}

.menu-icon::after {
  transform: translateY(6px);
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
