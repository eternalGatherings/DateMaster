<template>
  <Transition name="menu">
    <div v-if="isOpen" class="menu-wrapper">
      <div class="menu-backdrop" @click="$emit('close')"></div>
      <aside class="menu-panel">
        <header class="menu-header">
          <h2>Menu</h2>
          <button class="btn btn-icon close-btn" @click="$emit('close')" aria-label="Close menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
        </header>

        <div class="menu-content">
          <nav class="menu-nav">
            <button 
              v-for="(section, index) in sections" 
              :key="index"
              class="menu-section-btn"
              :class="{ active: activeSection === index }"
              @click="activeSection = index"
            >
              {{ section.title }}
            </button>
          </nav>

          <div class="menu-section">
            <component 
              :is="currentSection.component" 
              v-if="currentSection" 
              @add-preset="(preset) => {
                console.log('MenuPanel received add-preset:', preset)
                $emit('add-preset', preset)
              }"
            />
          </div>
        </div>
      </aside>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import ThemeSelector from './ThemeSelector.vue'
import StatsDashboard from './StatsDashboard.vue'
import SearchFilter from './SearchFilter.vue'
import NotificationPanel from './NotificationPanel.vue'
import ExportImport from './ExportImport.vue'
import QuickActions from './QuickActions.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

defineEmits(['close', 'add-preset'])

const sections = [
  { title: 'Quick Actions', component: QuickActions },
  { title: 'Search & Filter', component: SearchFilter },
  { title: 'Statistics', component: StatsDashboard },
  { title: 'Export/Import', component: ExportImport },
  { title: 'Notifications', component: NotificationPanel },
  { title: 'Themes', component: ThemeSelector }
]

const activeSection = ref(0)

const currentSection = computed(() => sections[activeSection.value])
</script>

<style scoped>
.menu-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}

.menu-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.menu-panel {
  position: relative;
  width: 100%;
  max-width: 700px;
  height: 100%;
  background: var(--bg-secondary);
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 1;
}

.menu-header {
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-color);
}

.menu-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.close-btn {
  width: 44px;
  height: 44px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
}

.menu-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.menu-nav {
  width: 200px;
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
}

.menu-section-btn {
  width: 100%;
  padding: 1rem;
  text-align: left;
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  border-bottom: 1px solid var(--border-color);
}

.menu-section-btn:hover {
  background: var(--hover-bg);
}

.menu-section-btn.active {
  background: var(--accent-color);
  color: #ffffff;
}

.menu-section {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

/* Transitions */
.menu-enter-active,
.menu-leave-active {
  transition: transform 0.3s ease;
}

.menu-enter-from,
.menu-leave-to {
  transform: translateX(100%);
}

/* Mobile Styles */
@media (max-width: 768px) {
  .menu-panel {
    max-width: none;
  }

  .menu-content {
    flex-direction: column;
  }

  .menu-nav {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .menu-section-btn {
    border-bottom: none;
    white-space: nowrap;
  }
}
</style>
