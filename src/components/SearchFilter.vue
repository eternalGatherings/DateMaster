<template>
  <div class="search-filter">
    <h3>Search & Filter</h3>

    <!-- Search Input -->
    <div class="search-box">
      <input
        type="text"
        v-model="searchQuery"
        class="form-control"
        placeholder="Search by name or description..."
        @input="updateFilters"
      >
    </div>

    <!-- Filter Controls -->
    <div class="filter-controls">
      <!-- Category Filter -->
      <div class="filter-group">
        <label>Categories</label>
        <div class="checkbox-group">
          <label v-for="category in categories" :key="category" class="checkbox-label">
            <input
              type="checkbox"
              v-model="selectedCategories"
              :value="category"
              @change="updateFilters"
            >
            {{ formatCategory(category) }}
          </label>
        </div>
      </div>

      <!-- Type Filter -->
      <div class="filter-group">
        <label>Types</label>
        <div class="checkbox-group">
          <label v-for="type in types" :key="type" class="checkbox-label">
            <input
              type="checkbox"
              v-model="selectedTypes"
              :value="type"
              @change="updateFilters"
            >
            {{ formatType(type) }}
          </label>
        </div>
      </div>

      <!-- Date Range Filter -->
      <div class="filter-group">
        <label>Date Range</label>
        <div class="date-range">
          <input
            type="date"
            v-model="dateRange.start"
            class="form-control"
            @change="updateFilters"
          >
          <span>to</span>
          <input
            type="date"
            v-model="dateRange.end"
            class="form-control"
            @change="updateFilters"
          >
        </div>
      </div>
    </div>

    <!-- Active Filters -->
    <div v-if="hasActiveFilters" class="active-filters">
      <div class="filter-tags">
        <!-- Search Query Tag -->
        <div v-if="searchQuery" class="filter-tag">
          <span>Search: {{ searchQuery }}</span>
          <button @click="clearSearch" class="clear-btn">×</button>
        </div>

        <!-- Category Tags -->
        <div v-for="category in selectedCategories" :key="category" class="filter-tag">
          <span>{{ formatCategory(category) }}</span>
          <button @click="removeCategory(category)" class="clear-btn">×</button>
        </div>

        <!-- Type Tags -->
        <div v-for="type in selectedTypes" :key="type" class="filter-tag">
          <span>{{ formatType(type) }}</span>
          <button @click="removeType(type)" class="clear-btn">×</button>
        </div>

        <!-- Date Range Tag -->
        <div v-if="dateRange.start || dateRange.end" class="filter-tag">
          <span>
            {{ formatDateRange }}
          </span>
          <button @click="clearDateRange" class="clear-btn">×</button>
        </div>
      </div>

      <button @click="clearAllFilters" class="clear-all-btn">
        Clear All Filters
      </button>
    </div>

    <!-- Search History -->
    <div v-if="searchHistory.length" class="search-history">
      <h4>Recent Searches</h4>
      <div class="history-list">
        <button
          v-for="(search, index) in searchHistory"
          :key="index"
          class="history-item"
          @click="applyHistoryItem(search)"
        >
          {{ search }}
        </button>
      </div>
    </div>

    <!-- Results Counter -->
    <div class="results-counter">
      {{ filteredEntries.length }} results found
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { format } from 'date-fns'

// Constants
const categories = ['birthday', 'anniversary', 'work', 'personal', 'holiday', 'other']
const types = ['exact', 'days', 'months', 'years']

// State
const searchQuery = ref('')
const selectedCategories = ref([])
const selectedTypes = ref([])
const dateRange = ref({ start: '', end: '' })
const searchHistory = ref([])

// Load entries from localStorage
const entries = computed(() => {
  const savedEntries = localStorage.getItem('date-entries')
  return savedEntries ? JSON.parse(savedEntries) : []
})

// Computed Properties
const hasActiveFilters = computed(() => {
  return searchQuery.value ||
    selectedCategories.value.length > 0 ||
    selectedTypes.value.length > 0 ||
    dateRange.value.start ||
    dateRange.value.end
})

const formatDateRange = computed(() => {
  if (!dateRange.value.start && !dateRange.value.end) return ''
  
  const start = dateRange.value.start ? format(new Date(dateRange.value.start), 'MMM d, yyyy') : 'Any'
  const end = dateRange.value.end ? format(new Date(dateRange.value.end), 'MMM d, yyyy') : 'Any'
  
  return `${start} - ${end}`
})

const filteredEntries = computed(() => {
  let filtered = entries.value

  // Apply search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(entry => 
      entry.name.toLowerCase().includes(query)
    )
  }

  // Apply category filter
  if (selectedCategories.value.length > 0) {
    filtered = filtered.filter(entry =>
      selectedCategories.value.includes(entry.category)
    )
  }

  // Apply type filter
  if (selectedTypes.value.length > 0) {
    filtered = filtered.filter(entry =>
      selectedTypes.value.includes(entry.type)
    )
  }

  // Apply date range filter
  if (dateRange.value.start) {
    filtered = filtered.filter(entry =>
      new Date(entry.date) >= new Date(dateRange.value.start)
    )
  }
  if (dateRange.value.end) {
    filtered = filtered.filter(entry =>
      new Date(entry.date) <= new Date(dateRange.value.end)
    )
  }

  return filtered
})

// Methods
const formatCategory = (category) => {
  return category.charAt(0).toUpperCase() + category.slice(1)
}

const formatType = (type) => {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

const updateFilters = () => {
  // Add search query to history if it's not empty and not already in history
  if (searchQuery.value && !searchHistory.value.includes(searchQuery.value)) {
    searchHistory.value.unshift(searchQuery.value)
    // Keep only last 5 searches
    if (searchHistory.value.length > 5) {
      searchHistory.value.pop()
    }
    // Save to localStorage
    localStorage.setItem('search-history', JSON.stringify(searchHistory.value))
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  updateFilters()
}

const removeCategory = (category) => {
  selectedCategories.value = selectedCategories.value.filter(c => c !== category)
  updateFilters()
}

const removeType = (type) => {
  selectedTypes.value = selectedTypes.value.filter(t => t !== type)
  updateFilters()
}

const clearDateRange = () => {
  dateRange.value = { start: '', end: '' }
  updateFilters()
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedCategories.value = []
  selectedTypes.value = []
  dateRange.value = { start: '', end: '' }
  updateFilters()
}

const applyHistoryItem = (search) => {
  searchQuery.value = search
  updateFilters()
}

// Initialize
const init = () => {
  // Load search history from localStorage
  const savedHistory = localStorage.getItem('search-history')
  if (savedHistory) {
    searchHistory.value = JSON.parse(savedHistory)
  }
}

init()
</script>

<style scoped>
.search-filter {
  padding: 1rem;
}

.search-box {
  margin-bottom: 1.5rem;
}

.filter-controls {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-primary);
  cursor: pointer;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.date-range span {
  color: var(--text-secondary);
}

.active-filters {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 8px;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.filter-tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  background: var(--bg-secondary);
  border-radius: 4px;
  font-size: 0.9rem;
}

.clear-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0;
  font-size: 1.2rem;
  line-height: 1;
}

.clear-btn:hover {
  color: var(--text-primary);
}

.clear-all-btn {
  background: none;
  border: none;
  color: var(--accent-color);
  cursor: pointer;
  padding: 0;
  font-size: 0.9rem;
}

.search-history {
  margin-bottom: 1.5rem;
}

.search-history h4 {
  margin: 0 0 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.history-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.history-item {
  background: var(--bg-secondary);
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  color: var(--text-primary);
  cursor: pointer;
  font-size: 0.9rem;
}

.history-item:hover {
  background: var(--hover-bg);
}

.results-counter {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .date-range {
    flex-direction: column;
    align-items: stretch;
  }

  .checkbox-group {
    grid-template-columns: 1fr;
  }
}
</style>
