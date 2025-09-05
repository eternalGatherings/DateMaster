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
import { useTheme } from '../composables/useTheme'

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

  // Brighter colors that work well in both light and dark modes
  const colors = {
    birthday: '#FF6B8A',    // Brighter pink
    anniversary: '#5CBBFF', // Brighter blue
    work: '#4EFFE1',        // Brighter teal
    personal: '#B57FFF',    // Brighter purple
    holiday: '#FFD75C',     // Brighter yellow
    other: '#A8B3BC'        // Neutral gray
  }

  const categoryColors = Object.keys(categories).map(category => colors[category] || colors.other)

  return {
    labels: Object.keys(categories),
    datasets: [{
      data: Object.values(categories),
      backgroundColor: categoryColors.map(color => `${color}CC`), // 80% opacity
      borderColor: categoryColors,
      borderWidth: 2
    }]
  }
})

const timelineData = computed(() => {
  const months = {}
  const today = new Date()
  const isDark = currentTheme.value === 'dark' || currentTheme.value === 'ocean' || currentTheme.value === 'forest'
  
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
      borderColor: '#3498db',
      backgroundColor: 'rgba(52, 152, 219, 0.1)',
      borderWidth: 2,
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#3498db',
      pointBorderColor: isDark ? '#1E1E1E' : '#FFFFFF',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6
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

const { currentTheme } = useTheme()

// Computed chart options based on theme
const chartOptions = computed(() => {
  const isDark = currentTheme.value === 'dark' || currentTheme.value === 'ocean' || currentTheme.value === 'forest'
  
  return {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 15,
          color: isDark ? '#FFFFFF' : '#000000',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
        titleColor: isDark ? '#FFFFFF' : '#000000',
        bodyColor: isDark ? '#FFFFFF' : '#000000',
        borderColor: isDark ? '#333333' : '#E0E0E0',
        borderWidth: 1,
        padding: 10,
        displayColors: true
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        border: {
          color: isDark ? '#666666' : '#999999'
        },
        grid: {
          color: isDark ? '#333333' : '#E0E0E0',
          drawBorder: true,
          lineWidth: 0.5
        },
        ticks: {
          color: isDark ? '#FFFFFF' : '#000000',
          font: {
            size: 11
          },
          padding: 8
        }
      },
      x: {
        border: {
          color: isDark ? '#666666' : '#999999'
        },
        grid: {
          color: isDark ? '#333333' : '#E0E0E0',
          drawBorder: true,
          lineWidth: 0.5
        },
        ticks: {
          color: isDark ? '#FFFFFF' : '#000000',
          font: {
            size: 11
          },
          padding: 8
        }
      }
    }
  }
})

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
  position: relative;
  width: 100%;
  min-height: 300px;
  display: flex;
  flex-direction: column;
}

.chart-container canvas {
  max-width: 100%;
  height: auto !important;
  aspect-ratio: 16/9;
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
