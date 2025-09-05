import { createApp } from 'vue'
import { useTheme } from './composables/useTheme.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './style.css'
import './styles/toast.css'
import App from './App.vue'

const app = createApp(App)

// Initialize theme system
const { applyTheme } = useTheme()
applyTheme(localStorage.getItem('datemaster-theme') || 'dark')

app.mount('#app')
