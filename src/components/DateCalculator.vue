<template>
  <div class="date-calculator">
    <!-- Header with actions -->
    <div class="actions-bar">
      <div class="search-box">
        <input
          type="text"
          class="form-control"
          v-model="searchQuery"
          placeholder="Search dates..."
        >
      </div>
      <button class="btn btn-primary add-entry-btn" @click="showAddModal = true">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
        </svg>
        Add Date
      </button>
    </div>

    <!-- Date entries grid -->
    <div v-if="filteredEntries.length" class="entries-grid">
      <div
        v-for="entry in filteredEntries"
        :key="entry.id"
        class="date-entry card"
        :class="[entry.category, `theme-${entry.theme || 'blue'}`]"
      >
        <div class="entry-header">
          <h3>{{ entry.name }}</h3>
          <div class="entry-actions">
            <button 
              class="btn btn-icon"
              @click="editEntry(entry)"
              aria-label="Edit entry"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
              </svg>
            </button>
            <button
              class="btn btn-icon"
              @click="deleteEntry(entry)"
              aria-label="Delete entry"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="entry-date">{{ formatDate(entry.date) }}</div>
        
        <div class="entry-calculation">
          {{ calculateDateDifference(entry) }}
        </div>

        <div class="entry-meta">
          <span class="entry-category">{{ entry.category }}</span>
          <span class="entry-type">{{ entry.type }}</span>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
        <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zM8 7.993c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132z"/>
      </svg>
      <h2>No dates found</h2>
      <p>{{ searchQuery ? 'Try a different search term' : 'Add your first date to get started' }}</p>
      <button class="btn btn-primary" @click="showAddModal = true">Add Date</button>
    </div>

    <!-- Add/Edit Modal -->
    <Transition name="modal">
      <div v-if="showAddModal" class="modal-backdrop">
        <div class="modal-content">
          <h2>{{ editingEntry ? 'Edit Date' : 'Add New Date' }}</h2>
          
          <form @submit.prevent="saveEntry" class="entry-form">
            <div class="form-group">
              <label for="name">Name</label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                class="form-control"
                required
              >
            </div>

            <div class="form-group">
              <label for="date">Date</label>
              <input
                id="date"
                v-model="formData.date"
                type="date"
                class="form-control"
                required
              >
            </div>

            <div class="form-group">
              <label for="type">Calculation Type</label>
              <select
                id="type"
                v-model="formData.type"
                class="form-control"
                required
              >
                <option value="exact">Exact (Years, Months, Days)</option>
                <option value="days">Days</option>
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>

            <div class="form-group">
              <label for="category">Category</label>
              <select
                id="category"
                v-model="formData.category"
                class="form-control"
                required
              >
                <option value="birthday">Birthday</option>
                <option value="anniversary">Anniversary</option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="holiday">Holiday</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div class="form-group">
              <label for="theme">Color Theme</label>
              <select
                id="theme"
                v-model="formData.theme"
                class="form-control"
              >
                <option 
                  v-for="(theme, key) in entryThemes" 
                  :key="key"
                  :value="key"
                >
                  {{ theme.name }}
                </option>
              </select>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="closeModal">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary">
                {{ editingEntry ? 'Save Changes' : 'Add Date' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { format, formatDistanceStrict, intervalToDuration } from 'date-fns'
import { useDates } from '../store/dates'
import { entryThemes, getRandomTheme } from '../composables/useEntryThemes'

// Get store methods
const { entries, filteredEntries, searchQuery, addEntry, updateEntry, deleteEntry: deleteStoreEntry } = useDates()

// Component state
const showAddModal = ref(false)
const editingEntry = ref(null)
const formData = ref({
  name: '',
  date: '',
  displayDate: '',
  type: 'exact',
  category: 'personal',
  theme: getRandomTheme()
})

// Methods
const formatDate = (date) => {
  return format(new Date(date), 'MMMM d, yyyy')
}

const calculateDateDifference = (entry) => {
  const entryDate = new Date(entry.date)
  const today = new Date()

  switch (entry.type) {
    case 'exact': {
      const duration = intervalToDuration({
        start: entryDate,
        end: today
      })
      const future = entryDate > today
      const parts = []
      
      if (duration.years) {
        parts.push(`${duration.years}Y`)
      }
      if (duration.months) {
        parts.push(`${duration.months}M`)
      }
      if (duration.days) {
        parts.push(`${duration.days}D`)
      }
      
      // If all values are 0, show 0D
      if (parts.length === 0) {
        parts.push('0D')
      }
      
      return parts.join(' ') + (future ? ' future' : '')
    }
    case 'days': {
      const distance = formatDistanceStrict(entryDate, today, { unit: 'day' })
      return entryDate > today ? `${distance} in the future` : distance
    }
    case 'months': {
      const distance = formatDistanceStrict(entryDate, today, { unit: 'month' })
      return entryDate > today ? `${distance} in the future` : distance
    }
    case 'years': {
      const distance = formatDistanceStrict(entryDate, today, { unit: 'year' })
      return entryDate > today ? `${distance} in the future` : distance
    }
  }
}

const filterEntries = () => {
  // Debounced search can be implemented here if needed
}

// Convert date string to dd/mm/yyyy format
// Format date for display in the UI
const formatDisplayDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return format(date, 'MMMM d, yyyy')
}

const resetForm = () => {
  formData.value = {
    name: '',
    date: new Date().toISOString().split('T')[0],
    type: 'exact',
    category: 'personal',
    theme: getRandomTheme()
  }
  editingEntry.value = null
}

const editEntry = (entry) => {
  editingEntry.value = entry
  formData.value = {
    ...entry
  }
  showAddModal.value = true
}

const deleteEntry = (entry) => {
  if (confirm('Are you sure you want to delete this entry?')) {
    deleteStoreEntry(entry.id)
  }
}

const saveEntry = () => {
  const data = {
    ...formData.value,
    updatedAt: new Date().toISOString()
  }

  if (editingEntry.value) {
    // Update existing entry
    const updatedEntry = {
      ...editingEntry.value,
      ...data
    }
    updateEntry(updatedEntry)
  } else {
    // Add new entry
    addEntry({
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    })
  }

  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  resetForm()
}
</script>

<style scoped>
.date-calculator {
  padding: 1rem;
}

.actions-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-box {
  flex: 1;
}

.search-box input::placeholder {
  color: var(--text-secondary);
  opacity: 0.7;
}

.entries-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.date-entry {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.entry-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.entry-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.entry-date {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.entry-calculation {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--accent-color);
}

.entry-meta {
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
}

.entry-category,
.entry-type {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
}

/* Theme Colors */
.date-entry {
  border-left: 4px solid var(--card-accent);
  background: var(--bg-primary);
}

.date-entry .entry-calculation {
  color: var(--card-accent);
}

.date-entry[class*="theme-"] {
  --card-accent: #4169E1;
}

.date-entry.theme-blue { 
  --card-accent: #4169E1;
}

.date-entry.theme-green { 
  --card-accent: #32CD32;
}

.date-entry.theme-purple { 
  --card-accent: #9370DB;
}

.date-entry.theme-orange { 
  --card-accent: #FF8C00;
}

.date-entry.theme-red { 
  --card-accent: #FF4444;
}

.date-entry.theme-pink { 
  --card-accent: #FF69B4;
}

.date-entry.theme-teal { 
  --card-accent: #20B2AA;
}

.date-entry.theme-yellow { 
  --card-accent: #FFD700;
}

.date-entry.theme-gray { 
  --card-accent: #808080;
}

.date-entry.theme-white { 
  --card-accent: #FFFFFF;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 1rem;
  color: var(--text-secondary);
}

.empty-state svg {
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h2 {
  margin: 0 0 0.5rem;
  color: var(--text-primary);
}

.empty-state p {
  margin: 0 0 1.5rem;
}

/* Form Styles */
.entry-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.form-group input.form-control,
.form-group select.form-control {
  color: var(--text-primary);
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  padding: 0.5rem;
  border-radius: 4px;
}

.form-group input.form-control::placeholder {
  color: var(--text-secondary);
  opacity: 0.7;
}

.form-group input.form-control:focus,
.form-group select.form-control:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px var(--accent-color-transparent);
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

/* Modal Styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: 
    0 10px 25px rgba(0, 0, 0, 0.1),
    0 0 1px rgba(0, 0, 0, 0.15);
  position: relative;
  padding: 1.5rem;
}

.modal-content h2 {
  margin: 0 0 1.5rem;
  font-size: 1.25rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease-out;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95) translateY(10px);
}

.modal-enter-to .modal-content,
.modal-leave-from .modal-content {
  transform: scale(1) translateY(0);
}

/* Mobile Styles */
@media (max-width: 768px) {
  .actions-bar {
    flex-direction: column;
  }

  .entries-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    padding: 1rem;
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }
}
</style>
