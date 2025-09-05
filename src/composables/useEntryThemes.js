// Available themes for date entries
export const entryThemes = {
  blue: {
    name: 'Blue',
    color: '#1E90FF'  // Dodger blue - bright and clearly blue
  },
  green: {
    name: 'Green',
    color: '#32CD32'
  },
  purple: {
    name: 'Purple',
    color: '#9370DB'
  },
  orange: {
    name: 'Orange',
    color: '#FF8C00'
  },
  red: {
    name: 'Red',
    color: '#FF4444'
  },
  teal: {
    name: 'Teal',
    color: '#20B2AA'
  },
  pink: {
    name: 'Pink',
    color: '#FF69B4'
  },
  yellow: {
    name: 'Yellow',
    color: '#FFD700'
  }
}

// Get a random theme
export const getRandomTheme = () => {
  const themes = Object.keys(entryThemes)
  const randomIndex = Math.floor(Math.random() * themes.length)
  return themes[randomIndex]
}
