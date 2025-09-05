<template>
  <div class="export-import">
    <h3>Export/Import</h3>

    <!-- Export Section -->
    <div class="section">
      <h4>Export Data</h4>
      <p class="section-desc">Download your date entries as a file for backup.</p>
      
      <div class="export-options">
        <button class="btn btn-primary" @click="exportJSON">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
          </svg>
          Export as JSON
        </button>
        <button class="btn btn-primary" @click="exportCSV">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
          </svg>
          Export as CSV
        </button>
      </div>
    </div>

    <!-- Import Section -->
    <div class="section">
      <h4>Import Data</h4>
      <p class="section-desc">Import your date entries from a file.</p>
      
      <div class="import-options">
        <div class="file-input-wrapper">
          <input
            type="file"
            ref="fileInput"
            accept=".json,.csv"
            @change="handleFileSelect"
            class="file-input"
          >
          <button class="btn btn-secondary" @click="triggerFileInput">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
              <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
            </svg>
            Select File
          </button>
        </div>
        <p class="file-info" v-if="selectedFile">
          Selected: {{ selectedFile.name }}
        </p>
      </div>

      <!-- Text Import -->
      <div class="text-import">
        <p class="section-desc">Or paste your data here:</p>
        <textarea
          v-model="importText"
          class="form-control"
          placeholder="Paste JSON or CSV data here..."
          rows="5"
        ></textarea>
        <button
          class="btn btn-primary"
          :disabled="!importText"
          @click="importFromText"
        >
          Import from Text
        </button>
      </div>
    </div>

    <!-- Backup History -->
    <div class="section">
      <h4>Backup History</h4>
      <div v-if="backupHistory.length" class="backup-list">
        <div v-for="backup in backupHistory" :key="backup.id" class="backup-item">
          <div class="backup-info">
            <div class="backup-date">{{ formatDate(backup.date) }}</div>
            <div class="backup-type">{{ backup.type }} Export</div>
          </div>
          <button
            class="btn btn-icon"
            @click="restoreBackup(backup)"
            :title="'Restore this ' + backup.type + ' backup'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
            </svg>
          </button>
        </div>
      </div>
      <p v-else class="no-data">No backup history available</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { saveAs } from 'file-saver'
import { format } from 'date-fns'

// State
const fileInput = ref(null)
const selectedFile = ref(null)
const importText = ref('')
const backupHistory = ref([])

// Load backup history from localStorage
const loadBackupHistory = () => {
  const saved = localStorage.getItem('backup-history')
  if (saved) {
    backupHistory.value = JSON.parse(saved)
  }
}

// Save backup history to localStorage
const saveBackupHistory = () => {
  localStorage.setItem('backup-history', JSON.stringify(backupHistory.value))
}

// Initialize
loadBackupHistory()

// Methods
const exportJSON = () => {
  const entries = localStorage.getItem('date-entries')
  const blob = new Blob([entries || '[]'], { type: 'application/json' })
  const filename = `datemaster-export-${format(new Date(), 'yyyy-MM-dd')}.json`
  saveAs(blob, filename)

  // Add to backup history
  addToBackupHistory('JSON')
}

const exportCSV = () => {
  const entries = JSON.parse(localStorage.getItem('date-entries') || '[]')
  
  // CSV Header
  const headers = ['name', 'date', 'type', 'category', 'theme', 'createdAt', 'updatedAt']
  const csvContent = [
    headers.join(','),
    ...entries.map(entry => 
      headers.map(key => JSON.stringify(entry[key])).join(',')
    )
  ].join('\\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
  const filename = `datemaster-export-${format(new Date(), 'yyyy-MM-dd')}.csv`
  saveAs(blob, filename)

  // Add to backup history
  addToBackupHistory('CSV')
}

const addToBackupHistory = (type) => {
  backupHistory.value.unshift({
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    type
  })

  // Keep only last 5 backups
  if (backupHistory.value.length > 5) {
    backupHistory.value.pop()
  }

  saveBackupHistory()
}

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return

  selectedFile.value = file
  const reader = new FileReader()

  reader.onload = (e) => {
    const content = e.target.result
    if (file.name.endsWith('.json')) {
      importJSON(content)
    } else if (file.name.endsWith('.csv')) {
      importCSV(content)
    }
  }

  reader.readAsText(file)
}

const importJSON = (content) => {
  try {
    // Validate JSON structure
    const data = JSON.parse(content)
    if (!Array.isArray(data)) throw new Error('Invalid data structure')

    // Validate each entry
    data.forEach(validateEntry)

    // Save to localStorage
    localStorage.setItem('date-entries', JSON.stringify(data))
    showSuccess('Data imported successfully')
  } catch (error) {
    showError('Invalid JSON format: ' + error.message)
  }
}

const importCSV = (content) => {
  try {
    const lines = content.split('\\n')
    const headers = lines[0].split(',')
    const entries = []

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue
      
      const values = lines[i].split(',')
      const entry = {}
      
      headers.forEach((header, index) => {
        entry[header] = JSON.parse(values[index])
      })

      validateEntry(entry)
      entries.push(entry)
    }

    localStorage.setItem('date-entries', JSON.stringify(entries))
    showSuccess('Data imported successfully')
  } catch (error) {
    showError('Invalid CSV format: ' + error.message)
  }
}

const validateEntry = (entry) => {
  const requiredFields = ['id', 'name', 'date', 'type', 'category', 'theme']
  requiredFields.forEach(field => {
    if (!entry[field]) throw new Error(`Missing required field: ${field}`)
  })
}

const importFromText = () => {
  try {
    // Try parsing as JSON first
    JSON.parse(importText.value)
    importJSON(importText.value)
  } catch {
    // If not JSON, try CSV
    importCSV(importText.value)
  }
}

const restoreBackup = (backup) => {
  // Implement backup restoration logic
  // This would typically involve loading the backup file and importing its data
  console.log('Restoring backup:', backup)
}

const formatDate = (date) => {
  return format(new Date(date), 'MMM d, yyyy HH:mm')
}

const showSuccess = (message) => {
  alert(message) // Replace with proper toast notification
}

const showError = (message) => {
  alert(message) // Replace with proper toast notification
}
</script>

<style scoped>
.export-import {
  padding: 1rem;
}

.section {
  background: var(--card-bg);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.section h4 {
  margin: 0 0 0.5rem;
}

.section-desc {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0 0 1rem;
}

.export-options,
.import-options {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.file-input-wrapper {
  position: relative;
}

.file-input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
}

.file-info {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0.5rem 0;
}

.text-import {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.backup-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.backup-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--bg-primary);
  border-radius: 6px;
}

.backup-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.backup-date {
  font-weight: 500;
  color: var(--text-primary);
}

.backup-type {
  font-size: 0.8rem;
  color: var(--text-secondary);
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

.no-data {
  text-align: center;
  color: var(--text-secondary);
  padding: 2rem;
}

@media (max-width: 768px) {
  .export-options,
  .import-options {
    flex-direction: column;
  }
}
</style>
