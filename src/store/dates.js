import { ref, computed } from 'vue'
import { useToasts } from '../composables/useToasts'

const entries = ref([])
const searchQuery = ref('')
const { showToast } = useToasts()

// Load entries from localStorage
const loadEntries = () => {
  const savedEntries = localStorage.getItem('date-entries')
  if (savedEntries) {
    entries.value = JSON.parse(savedEntries)
  }
}

// Initialize data
loadEntries()

// Computed filtered entries
const filteredEntries = computed(() => {
  let result = entries.value
  
  // Apply search filter if query exists
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(entry => 
      entry.name.toLowerCase().includes(query) ||
      entry.category.toLowerCase().includes(query)
    )
  }
  
  // Sort by creation date in descending order (newest first)
  return [...result].sort((a, b) => 
    new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  )
})

// Save entries to localStorage
const saveEntries = () => {
  try {
    localStorage.setItem('date-entries', JSON.stringify(entries.value))
    return true
  } catch (error) {
    console.error('Failed to save entries:', error)
    return false
  }
}

// Actions
const addEntry = (entry) => {
  const now = new Date()
  const newEntry = {
    id: Date.now(),
    createdAt: now.toISOString(),
    ...entry,
    theme: entry.theme || 'blue'
  }
  try {
    entries.value = [...entries.value, newEntry]
    if (saveEntries()) {
      showToast(`Successfully added "${entry.name}"`)
      return newEntry
    } else {
      throw new Error('Failed to save entries')
    }
  } catch (error) {
    showToast(`Failed to add "${entry.name}"`, 'error')
    throw error
  }
}

const updateEntry = (entry) => {
  try {
    const index = entries.value.findIndex(e => e.id === entry.id)
    if (index === -1) throw new Error('Entry not found')

    entries.value[index] = { ...entry }
    entries.value = [...entries.value]
    
    if (saveEntries()) {
      showToast(`Successfully updated "${entry.name}"`)
    } else {
      throw new Error('Failed to save entries')
    }
  } catch (error) {
    showToast(`Failed to update "${entry.name}"`, 'error')
    throw error
  }
}

const deleteEntry = (entryId) => {
  try {
    const entry = entries.value.find(e => e.id === entryId)
    if (!entry) throw new Error('Entry not found')
    
    entries.value = entries.value.filter(e => e.id !== entryId)
    
    if (saveEntries()) {
      showToast(`Successfully deleted "${entry.name}"`)
    } else {
      throw new Error('Failed to save entries')
    }
  } catch (error) {
    showToast('Failed to delete entry', 'error')
    throw error
  }
}

const setSearchQuery = (query) => {
  searchQuery.value = query
}

export const useDates = () => {
  return {
    entries,
    filteredEntries,
    searchQuery,
    addEntry,
    updateEntry,
    deleteEntry,
    setSearchQuery
  }
}
