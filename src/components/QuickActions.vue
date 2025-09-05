<template>
  <div class="quick-actions">
    <h3>Quick Actions</h3>

    <!-- Common Calculations -->
    <div class="action-section">
      <h4>Quick Calculate</h4>
      <div class="action-grid">
        <button class="action-btn" @click="addDays">
          <div class="action-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z"/>
              <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
            </svg>
          </div>
          <span>Add Days</span>
        </button>

        <button class="action-btn" @click="addMonths">
          <div class="action-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
            </svg>
          </div>
          <span>Add Months</span>
        </button>

        <button class="action-btn" @click="calculateWorkdays">
          <div class="action-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M6.5 1A.5.5 0 0 1 7 1.5V8H1.5a.5.5 0 0 1 0-1h5V1.5a.5.5 0 0 1 .5-.5z"/>
              <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
            </svg>
          </div>
          <span>Workdays</span>
        </button>

        <button class="action-btn" @click="calculateAge">
          <div class="action-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
            </svg>
          </div>
          <span>Calculate Age</span>
        </button>
      </div>
    </div>

    <!-- Presets -->
    <div class="action-section">
      <h4>Quick Add</h4>
      <div class="preset-grid">
        <button 
          v-for="preset in presets" 
          :key="preset.name"
          class="preset-btn"
          @click="addPreset(preset)"
        >
          {{ preset.name }}
        </button>
      </div>
    </div>

    <!-- Calculator Modal -->
    <Modal v-if="showModal" @close="closeModal">
      <template #header>
        <h3 class="section-title">{{ modalTitle }}</h3>
      </template>
      
      <template #default>
        <div class="calculator-form">
          <div class="form-group">
            <label :for="modalInputId">{{ modalLabel }}</label>
            <div class="input-wrapper">
              <input
                :id="modalInputId"
                v-model="calculatorInput.value"
                :type="calculatorInput.type"
                required
              >
              <span v-if="calculatorInput.unit" class="input-unit">
                {{ calculatorInput.unit }}
              </span>
            </div>
          </div>

          <div class="result-box" v-if="calculationResult">
            <strong>Result:</strong> {{ calculationResult }}
          </div>
        </div>
      </template>

      <template #footer>
        <button class="btn btn-outline" @click="closeModal">Cancel</button>
        <button class="btn btn-primary" @click="calculateResult">Calculate</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { addDays as addDaysDate, addMonths as addMonthsDate, differenceInBusinessDays, differenceInYears } from 'date-fns'
import Modal from './Modal.vue'
import { useDates } from '../store/dates'
import { getRandomTheme } from '../composables/useEntryThemes'

const { addEntry } = useDates()

// State
const showModal = ref(false)
const modalType = ref('')
const calculatorInput = ref({ value: '', type: 'number', unit: '' })
const calculationResult = ref('')

// Presets for quick adding common dates
const presets = [
  { name: 'Birthday', category: 'birthday', type: 'years' },
  { name: 'Anniversary', category: 'anniversary', type: 'years' },
  { name: 'Work Deadline', category: 'work', type: 'days' },
  { name: 'Holiday', category: 'holiday', type: 'exact' },
  { name: 'Meeting', category: 'work', type: 'days' },
  { name: 'Project', category: 'work', type: 'months' }
]

// Computed properties for modal
const modalTitle = computed(() => {
  const titles = {
    'add-days': 'Add Days',
    'add-months': 'Add Months',
    'workdays': 'Calculate Workdays',
    'age': 'Calculate Age'
  }
  return titles[modalType.value] || 'Calculator'
})

const modalLabel = computed(() => {
  const labels = {
    'add-days': 'Number of days to add',
    'add-months': 'Number of months to add',
    'workdays': 'End date',
    'age': 'Birth date'
  }
  return labels[modalType.value] || 'Value'
})

const modalInputId = computed(() => `calculator-input-${modalType.value}`)

// Methods
const addDays = () => {
  modalType.value = 'add-days'
  calculatorInput.value = { value: '', type: 'number', unit: 'days' }
  calculationResult.value = ''
  showModal.value = true
}

const addMonths = () => {
  modalType.value = 'add-months'
  calculatorInput.value = { value: '', type: 'number', unit: 'months' }
  calculationResult.value = ''
  showModal.value = true
}

const calculateWorkdays = () => {
  modalType.value = 'workdays'
  calculatorInput.value = { value: '', type: 'date', unit: '' }
  calculationResult.value = ''
  showModal.value = true
}

const calculateAge = () => {
  modalType.value = 'age'
  calculatorInput.value = { value: '', type: 'date', unit: '' }
  calculationResult.value = ''
  showModal.value = true
}

const calculateResult = () => {
  const value = calculatorInput.value.value
  const today = new Date()

  switch (modalType.value) {
    case 'add-days':
      const futureDate = addDaysDate(today, parseInt(value))
      calculationResult.value = futureDate.toLocaleDateString()
      break
    case 'add-months':
      const monthsAhead = addMonthsDate(today, parseInt(value))
      calculationResult.value = monthsAhead.toLocaleDateString()
      break
    case 'workdays':
      const workdays = differenceInBusinessDays(new Date(value), today)
      calculationResult.value = `${Math.abs(workdays)} business days ${workdays >= 0 ? 'until' : 'ago'}`
      break
    case 'age':
      const age = differenceInYears(today, new Date(value))
      calculationResult.value = `${age} years old`
      break
  }
}

const addPreset = (preset) => {
  const now = new Date()
  // For some preset types, we might want to set specific dates
  let date = now.toISOString().split('T')[0]
  
  switch (preset.type) {
    case 'years':
      // For birthdays and anniversaries, set it to next occurrence
      const nextOccurrence = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
      date = nextOccurrence.toISOString().split('T')[0]
      break
    case 'days':
      // For deadlines and meetings, set it a week from now
      const weekFromNow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7)
      date = weekFromNow.toISOString().split('T')[0]
      break
    case 'months':
      // For projects, set it a month from now
      const monthFromNow = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())
      date = monthFromNow.toISOString().split('T')[0]
      break
  }

  // Add entry directly using the store
  const newEntry = {
    name: preset.name,
    category: preset.category,
    type: preset.type,
    date: date,
    displayDate: new Date(date).toLocaleDateString(),
    theme: getRandomTheme()
  }
  addEntry(newEntry)
}

const closeModal = () => {
  showModal.value = false
  calculatorInput.value = { value: '', type: 'number', unit: '' }
  calculationResult.value = ''
}
</script>

<style scoped>
.quick-actions {
  padding: 1rem;
}

.action-section {
  background: var(--card-bg);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

h4 {
  margin: 0 0 1rem;
  color: var(--text-primary);
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: var(--hover-bg);
  transform: translateY(-2px);
}

.action-icon {
  color: var(--accent-color);
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.5rem;
}

.preset-btn {
  padding: 0.5rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.preset-btn:hover {
  background: var(--hover-bg);
  border-color: var(--accent-color);
}

.calculator-form {
  padding: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.input-unit {
  color: var(--text-secondary);
}

.result {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 6px;
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .action-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .preset-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
