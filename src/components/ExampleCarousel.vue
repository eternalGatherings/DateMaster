<template>
  <div class="example-carousel">
    <h3 class="carousel-title">Example Date Entries</h3>
    <div class="carousel-container" 
      @mouseenter="stopAutoScroll"
      @mouseleave="startAutoScroll">
      <div class="carousel-slides" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div v-for="example in examples" :key="example.id" class="carousel-slide">
          <div class="date-entry card" :class="[example.category, `theme-${example.theme}`]">
            <div class="entry-header">
              <h3>{{ example.name }}</h3>
              <div class="entry-actions">
                <button class="btn btn-icon" aria-label="Edit entry">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                  </svg>
                </button>
                <button class="btn btn-icon" aria-label="Delete entry">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                  </svg>
                </button>
              </div>
            </div>
            <div class="entry-date">{{ example.formattedDate }}</div>
            <div class="entry-calculation">{{ example.formattedDuration }}</div>
            <div class="entry-meta">
              <span class="entry-category">{{ example.category }}</span>
              <span class="entry-type">{{ example.type }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { format, addYears, addDays, addMonths, intervalToDuration, formatDuration, differenceInDays } from 'date-fns'

const currentIndex = ref(0)
let autoScrollInterval = null

const startAutoScroll = () => {
  autoScrollInterval = setInterval(() => {
    if (currentIndex.value < examples.length - 1) {
      currentIndex.value++
    } else {
      currentIndex.value = 0
    }
  }, 3000) // Change slide every 3 seconds
}

const stopAutoScroll = () => {
  if (autoScrollInterval) {
    clearInterval(autoScrollInterval)
    autoScrollInterval = null
  }
}

onMounted(() => {
  startAutoScroll()
})

onUnmounted(() => {
  stopAutoScroll()
})

const calculateDuration = (date) => {
  const today = new Date()
  return intervalToDuration({
    start: date > today ? today : date,
    end: date > today ? date : today
  })
}

const formatCustomDuration = (duration) => {
  const parts = []
  if (duration.years) parts.push(`${duration.years}Y`)
  if (duration.months) parts.push(`${duration.months}M`)
  if (duration.days) parts.push(`${duration.days}D`)
  return parts.join(' ') || '0D'
}

const getLastDayOfMonth = () => {
  const date = new Date()
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

const examples = [
  {
    id: 'example1',
    name: 'My Age',
    date: new Date(1996, 7, 1),
    category: 'work',
    theme: 'purple',
    type: 'years',
    get formattedDate() {
      return format(this.date, 'MMMM d, yyyy')
    },
    get formattedDuration() {
      if (this.type === 'years') {
        const duration = calculateDuration(this.date)
        return `${duration.years} Years`
      } else {
        const duration = calculateDuration(this.date)
        return formatCustomDuration(duration)
      }
    }
  },
  {
    id: 'example2',
    name: 'My Total Work Experience',
    date: new Date(2019, 1, 7),
    category: 'work',
    theme: 'green',
    type: 'exact',
    get formattedDate() {
      return format(this.date, 'MMMM d, yyyy')
    },
    get formattedDuration() {
      const duration = calculateDuration(this.date)
      return formatCustomDuration(duration)
    }
  },
  {
    id: 'example3',
    name: "Next Salary In",
    date: getLastDayOfMonth(),
    category: 'anniversary',
    theme: 'yellow',
    type: 'days',
    get formattedDate() {
      return format(this.date, 'MMMM d, yyyy')
    },
    get formattedDuration() {
      if (this.type === 'days') {
        const today = new Date()
        const days = Math.abs(differenceInDays(this.date, today))
        return `${days} Days`
      } else {
        const duration = calculateDuration(this.date)
        return formatCustomDuration(duration)
      }
    }
  }
]


</script>

<style scoped>
.example-carousel {
  padding: 2rem 0 0 0;
}

.carousel-title {
  text-align: center;
}

.carousel-title {
  color: var(--text-primary);
  margin-bottom: 2rem;
  font-size: 1.5rem;
}

.carousel-container {
  position: relative;
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
}

.carousel-slides {
  display: flex;
  transition: transform 0.5s ease;
}

.carousel-slide {
  min-width: 100%;
  padding: 0;
  display: flex;
  justify-content: center;
}



.use-example {
  margin-top: 1rem;
  width: 100%;
}

.date-entry {
  width: 100%;
  padding: 1rem;
  border-radius: 8px;
  background: var(--bg-primary);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color);
  border-left: 4px solid var(--card-accent);
  position: relative;
  overflow: hidden;
}

@media (max-width: 768px) {
  .date-entry {
    width: 100%;
  }
}

/* Theme Colors */
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

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
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
  padding: 0.25rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.2s;
}

.btn-icon:hover {
  color: var(--accent-color);
}

.entry-date {
  color: var(--text-secondary);
  font-size: 0.9rem;
  text-align: left;
}

.entry-calculation {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--card-accent);
  text-align: left;
  margin-bottom: 1rem;
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
</style>
