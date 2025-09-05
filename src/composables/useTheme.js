import { ref, onMounted, watch } from 'vue'

const THEME_KEY = 'datemaster-theme'
const themes = {
  dark: {
    '--bg-primary': '#121212',
    '--bg-secondary': '#1E1E1E',
    '--text-primary': '#FFFFFF',
    '--text-secondary': '#B3B3B3',
    '--accent-color': '#3498db',
    '--border-color': '#333333',
    '--card-bg': '#1A1A1A',
    '--hover-bg': '#2A2A2A'
  },
  light: {
    '--bg-primary': '#FFFFFF',
    '--bg-secondary': '#F5F5F5',
    '--text-primary': '#000000',
    '--text-secondary': '#666666',
    '--accent-color': '#2980b9',
    '--border-color': '#E0E0E0',
    '--card-bg': '#FFFFFF',
    '--hover-bg': '#F0F0F0'
  },
  ocean: {
    '--bg-primary': '#1a3b5c',
    '--bg-secondary': '#234b76',
    '--text-primary': '#FFFFFF',
    '--text-secondary': '#B3E0FF',
    '--accent-color': '#4FB4FF',
    '--border-color': '#2D5F8E',
    '--card-bg': '#1E4268',
    '--hover-bg': '#2A557C'
  },
  forest: {
    '--bg-primary': '#1b4332',
    '--bg-secondary': '#2d6a4f',
    '--text-primary': '#FFFFFF',
    '--text-secondary': '#B7E4C7',
    '--accent-color': '#74C69D',
    '--border-color': '#40916C',
    '--card-bg': '#1B4332',
    '--hover-bg': '#2D6A4F'
  },
  sunset: {
    '--bg-primary': '#7D4E57',
    '--bg-secondary': '#96575D',
    '--text-primary': '#FFFFFF',
    '--text-secondary': '#FFD6D6',
    '--accent-color': '#FF9E9E',
    '--border-color': '#A16D74',
    '--card-bg': '#854B55',
    '--hover-bg': '#9E5A63'
  },
  purple: {
    '--bg-primary': '#44318D',
    '--bg-secondary': '#4A359D',
    '--text-primary': '#FFFFFF',
    '--text-secondary': '#E4D9FF',
    '--accent-color': '#A388EE',
    '--border-color': '#5A43AD',
    '--card-bg': '#483696',
    '--hover-bg': '#5641B0'
  },
  minimal: {
    '--bg-primary': '#FAFAFA',
    '--bg-secondary': '#F0F0F0',
    '--text-primary': '#2C2C2C',
    '--text-secondary': '#666666',
    '--accent-color': '#808080',
    '--border-color': '#E0E0E0',
    '--card-bg': '#FFFFFF',
    '--hover-bg': '#F5F5F5'
  },
  neon: {
    '--bg-primary': '#0C0C14',
    '--bg-secondary': '#1A1A24',
    '--text-primary': '#00FF9C',
    '--text-secondary': '#00CC7A',
    '--accent-color': '#FF00FF',
    '--border-color': '#333342',
    '--card-bg': '#14141E',
    '--hover-bg': '#1E1E2C'
  }
}

export function useTheme() {
  const currentTheme = ref(localStorage.getItem(THEME_KEY) || 'light')
  const favoriteThemes = ref(JSON.parse(localStorage.getItem('favorite-themes') || '[]'))

  const applyTheme = (themeName) => {
    const theme = themes[themeName]
    if (!theme) return

    Object.entries(theme).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value)
    })
    document.body.classList.remove(...Object.keys(themes))
    document.body.classList.add(themeName)
    currentTheme.value = themeName
    localStorage.setItem(THEME_KEY, themeName)
  }

  const toggleFavorite = (themeName) => {
    const index = favoriteThemes.value.indexOf(themeName)
    if (index === -1) {
      favoriteThemes.value.push(themeName)
    } else {
      favoriteThemes.value.splice(index, 1)
    }
    localStorage.setItem('favorite-themes', JSON.stringify(favoriteThemes.value))
  }

  const detectSystemTheme = () => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return isDark ? 'dark' : 'light'
  }

  onMounted(() => {
    if (!localStorage.getItem(THEME_KEY)) {
      const systemTheme = detectSystemTheme()
      applyTheme(systemTheme)
    } else {
      applyTheme(currentTheme.value)
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light')
      }
    })
  })

  watch(currentTheme, (newTheme) => {
    applyTheme(newTheme)
  })

  return {
    currentTheme,
    themes: Object.keys(themes),
    favoriteThemes,
    applyTheme,
    toggleFavorite
  }
}
