<template>
  <div class="stats-dashboard">
    <h3>Statistics Dashboard</h3>
    
    <!-- Total Entries -->
    <div class="stat-card">
      <div class="stat-value">{{ totalEntries }}</div>
      <div class="stat-label">Total Entries</div>
    </div>

    <!-- Category Distribution -->
    <div class="chart-container">
      <h4>Categories Distribution</h4>
      <Doughnut v-if="categoryData.labels.length" :data="categoryData" :options="chartOptions" />
      <p v-else class="no-data">No data available</p>
    </div>

    <!-- Timeline -->
    <div class="chart-container">
      <h4>Timeline</h4>
      <Line v-if="timelineData.labels.length" :data="timelineData" :options="chartOptions" />
      <p v-else class="no-data">No data available</p>
    </div>

    <!-- Upcoming Events -->
    <div class="upcoming-events">
      <h4>Upcoming Events</h4>
      <div v-if="upcomingEvents.length" class="events-list">
        <div v-for="event in upcomingEvents" :key="event.id" class="event-item">
          <div class="event-name">{{ event.name }}</div>
          <div class="event-date">{{ formatDate(event.date) }}</div>
          <div class="event-countdown">{{ getCountdown(event.date) }}</div>
        </div>
      </div>
      <p v-else class="no-data">No upcoming events</p>
    </div>

    <!-- Monthly Statistics -->
    <div class="monthly-stats">
      <h4>Monthly Overview</h4>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">{{ thisMonthEvents }}</div>
          <div class="stat-label">This Month</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ nextMonthEvents }}</div>
          <div class="stat-label">Next Month</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ mostActiveMonth }}</div>
          <div class="stat-label">Most Active Month</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js'
import { Doughnut, Line } from 'vue-chartjs'
import { format, addMonths, isSameMonth, isBefore, differenceInDays } from 'date-fns'

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
)

// Get entries from localStorage
const entries = ref([])

const loadEntries = () => {
  const savedEntries = localStorage.getItem('date-entries')
  if (savedEntries) {
    entries.value = JSON.parse(savedEntries)
  }
}

// Watch for changes in localStorage
watch(() => localStorage.getItem('date-entries'), loadEntries)

// Load initial data
onMounted(loadEntries)

// Computed Properties
const totalEntries = computed(() => entries.value.length)

const categoryData = computed(() => {
  const categories = {}
  entries.value.forEach(entry => {
    categories[entry.category] = (categories[entry.category] || 0) + 1
  })

  return {
    labels: Object.keys(categories),
    datasets: [{
      data: Object.values(categories),
      backgroundColor: [
        '#FF69B4', // birthday
        '#4169E1', // anniversary
        '#32CD32', // work
        '#9370DB', // personal
        '#FFD700', // holiday
        '#A9A9A9'  // other
      ]
    }]
  }
})

const timelineData = computed(() => {
  const months = {}
  const today = new Date()
  
  // Initialize last 12 months
  for (let i = 11; i >= 0; i--) {
    const date = addMonths(today, -i)
    const monthKey = format(date, 'MMM yyyy')
    months[monthKey] = 0
  }

  // Count entries per month
  entries.value.forEach(entry => {
    const monthKey = format(new Date(entry.date), 'MMM yyyy')
    if (months[monthKey] !== undefined) {
      months[monthKey]++
    }
  })

  return {
    labels: Object.keys(months),
    datasets: [{
      label: 'Number of Events',
      data: Object.values(months),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  }
})

const upcomingEvents = computed(() => {
  const today = new Date()
  return entries.value
    .filter(entry => {
      const eventDate = new Date(entry.date)
      return isBefore(today, eventDate)
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5)
})

const thisMonthEvents = computed(() => {
  const today = new Date()
  return entries.value.filter(entry => 
    isSameMonth(new Date(entry.date), today)
  ).length
})

const nextMonthEvents = computed(() => {
  const nextMonth = addMonths(new Date(), 1)
  return entries.value.filter(entry => 
    isSameMonth(new Date(entry.date), nextMonth)
  ).length
})

const mostActiveMonth = computed(() => {
  const monthCounts = {}
  entries.value.forEach(entry => {
    const monthKey = format(new Date(entry.date), 'MMMM')
    monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1
  })

  if (Object.keys(monthCounts).length === 0) return 'N/A'

  return Object.entries(monthCounts)
    .sort(([,a], [,b]) => b - a)[0][0]
})

// Chart Options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}

// Helper Functions
const formatDate = (date) => {
  return format(new Date(date), 'MMM d, yyyy')
}

const getCountdown = (date) => {
  const days = differenceInDays(new Date(date), new Date())
  return `${days} days remaining`
}
</script>

<style scoped>
.stats-dashboard {
  padding: 1rem;
}

.stat-card {
  background: var(--card-bg);
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 1.5rem;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--accent-color);
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.chart-container {
  background: var(--card-bg);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  height: 300px;
}

h4 {
  margin: 0 0 1rem;
  color: var(--text-primary);
}

.no-data {
  color: var(--text-secondary);
  text-align: center;
  padding: 2rem;
}

.upcoming-events {
  background: var(--card-bg);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.event-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--bg-primary);
  border-radius: 6px;
}

.event-name {
  font-weight: 500;
  color: var(--text-primary);
}

.event-date {
  color: var(--text-secondary);
}

.event-countdown {
  color: var(--accent-color);
  font-size: 0.9rem;
}

.monthly-stats {
  background: var(--card-bg);
  padding: 1rem;
  border-radius: 8px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 6px;
}

@media (max-width: 768px) {
  .event-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .chart-container {
    height: 250px;
  }
}
</style>
