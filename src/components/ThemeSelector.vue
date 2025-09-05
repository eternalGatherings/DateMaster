<template>
  <div class="theme-selector">
    <h3>Theme Selection</h3>
    <div class="theme-grid">
      <button
        v-for="theme in themes"
        :key="theme"
        class="theme-option"
        :class="{ active: currentTheme === theme }"
        :data-theme="theme"
        @click="applyTheme(theme)"
      >
        <div class="theme-preview">
          <div class="preview-header">
            <div class="accent-dot"></div>
          </div>
          <div class="preview-content">
            <div class="preview-line"></div>
            <div class="preview-line"></div>
            <div class="preview-accent"></div>
          </div>
        </div>
        <div class="theme-info">
          <span class="theme-name">{{ formatThemeName(theme) }}</span>
          <button 
            class="favorite-btn"
            @click.stop="toggleFavorite(theme)"
            :aria-label="isFavorite(theme) ? 'Remove from favorites' : 'Add to favorites'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path v-if="isFavorite(theme)" d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
              <path v-else d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.523-3.356c.329-.314.158-.888-.283-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767l-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
            </svg>
          </button>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from '../composables/useTheme'

const { currentTheme, themes, favoriteThemes, applyTheme, toggleFavorite } = useTheme()

const formatThemeName = (theme) => {
  return theme.charAt(0).toUpperCase() + theme.slice(1)
}

const isFavorite = (theme) => {
  return favoriteThemes.value.includes(theme)
}
</script>

<style scoped>
.theme-selector {
  padding: 1rem;
}

h3 {
  margin: 0 0 1rem;
  color: var(--text-primary);
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.theme-option {
  background: none;
  border: 2px solid transparent;
  padding: 0;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease;
}

.theme-option:hover {
  transform: translateY(-2px);
}

.theme-option.active {
  border-color: var(--accent-color);
}

.theme-preview {
  width: 100%;
  height: 100px;
  border-radius: 6px;
  overflow: hidden;
}

/* Theme previews with static colors */
[data-theme="dark"] .theme-preview {
  background: #121212;
}
[data-theme="dark"] .preview-header {
  background: #1E1E1E;
}
[data-theme="dark"] .preview-line {
  height: 8px;
  background: #2A2A2A;
  margin-bottom: 8px;
  border-radius: 4px;
  border: 1px solid #333333;
}

[data-theme="light"] .theme-preview {
  background: #FFFFFF;
}
[data-theme="light"] .preview-header {
  background: #F5F5F5;
}
[data-theme="light"] .preview-line {
  height: 8px;
  background: #F0F0F0;
  margin-bottom: 8px;
  border-radius: 4px;
  border: 1px solid #E0E0E0;
}

[data-theme="ocean"] .theme-preview {
  background: #1a3b5c;
}
[data-theme="ocean"] .preview-header {
  background: #234b76;
}
[data-theme="ocean"] .preview-line {
  height: 8px;
  background: #2A557C;
  margin-bottom: 8px;
  border-radius: 4px;
  border: 1px solid #2D5F8E;
}

[data-theme="forest"] .theme-preview {
  background: #1b4332;
}
[data-theme="forest"] .preview-header {
  background: #2d6a4f;
}
[data-theme="forest"] .preview-line {
  height: 8px;
  background: #2D6A4F;
  margin-bottom: 8px;
  border-radius: 4px;
  border: 1px solid #40916C;
}

[data-theme="sunset"] .theme-preview {
  background: #7D4E57;
}
[data-theme="sunset"] .preview-header {
  background: #96575D;
}
[data-theme="sunset"] .preview-line {
  height: 8px;
  background: #A65D63;
  margin-bottom: 8px;
  border-radius: 4px;
  border: 1px solid #B25D63;
}

/* Purple theme preview */
[data-theme="purple"] .theme-preview {
  background: #44318D;
}
[data-theme="purple"] .preview-header {
  background: #4A359D;
}
[data-theme="purple"] .preview-line {
  height: 8px;
  background: #5641B0;
  margin-bottom: 8px;
  border-radius: 4px;
  border: 1px solid #5A43AD;
}

/* Minimal theme preview */
[data-theme="minimal"] .theme-preview {
  background: #FAFAFA;
}
[data-theme="minimal"] .preview-header {
  background: #F0F0F0;
}
[data-theme="minimal"] .preview-line {
  height: 8px;
  background: #F5F5F5;
  margin-bottom: 8px;
  border-radius: 4px;
  border: 1px solid #E0E0E0;
}

/* Neon theme preview */
[data-theme="neon"] .theme-preview {
  background: #0C0C14;
}
[data-theme="neon"] .preview-header {
  background: #1A1A24;
}
[data-theme="neon"] .preview-line {
  height: 8px;
  background: #14141E;
  margin-bottom: 8px;
  border-radius: 4px;
  border: 1px solid #333342;
}

.preview-content {
  padding: 8px;
}

.preview-header {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 8px;
}

.accent-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 6px;
}

.preview-accent {
  height: 4px;
  width: 40%;
  border-radius: 2px;
  margin-top: 8px;
}

/* Theme-specific accent colors */
[data-theme="dark"] .accent-dot,
[data-theme="dark"] .preview-accent {
  background: #3498db;
}

[data-theme="light"] .accent-dot,
[data-theme="light"] .preview-accent {
  background: #2980b9;
}

[data-theme="ocean"] .accent-dot,
[data-theme="ocean"] .preview-accent {
  background: #4FB4FF;
}

[data-theme="forest"] .accent-dot,
[data-theme="forest"] .preview-accent {
  background: #74C69D;
}

[data-theme="sunset"] .accent-dot,
[data-theme="sunset"] .preview-accent {
  background: #FF9E9E;
}

[data-theme="purple"] .accent-dot,
[data-theme="purple"] .preview-accent {
  background: #A388EE;
}

[data-theme="minimal"] .accent-dot,
[data-theme="minimal"] .preview-accent {
  background: #808080;
}

[data-theme="neon"] .accent-dot,
[data-theme="neon"] .preview-accent {
  background: #FF00FF;
}

.theme-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  background: var(--card-bg);
}

.theme-name {
  color: var(--text-primary);
  font-size: 0.9rem;
  font-weight: 500;
}

[data-theme="light"] .theme-name,
[data-theme="minimal"] .theme-name {
  color: #000000;
}

[data-theme="dark"] .theme-name,
[data-theme="ocean"] .theme-name,
[data-theme="forest"] .theme-name,
[data-theme="sunset"] .theme-name,
[data-theme="purple"] .theme-name,
[data-theme="neon"] .theme-name {
  color: #FFFFFF;
}

.favorite-btn {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: var(--text-secondary);
  opacity: 0.7;
  transition: opacity 0.2s ease, color 0.2s ease;
}

.favorite-btn:hover {
  opacity: 1;
}

.favorite-btn svg {
  display: block;
}

.favorite-btn path {
  fill: currentColor;
}

/* Theme-specific preview styles */
.dark .preview-header,
.dark .preview-line {
  background: rgba(255, 255, 255, 0.1);
}

.light .preview-header,
.light .preview-line {
  background: rgba(0, 0, 0, 0.1);
}

.ocean .preview-header,
.ocean .preview-line {
  background: rgba(255, 255, 255, 0.15);
}

.forest .preview-header,
.forest .preview-line {
  background: rgba(255, 255, 255, 0.15);
}

.sunset .preview-header,
.sunset .preview-line {
  background: rgba(255, 255, 255, 0.15);
}

.purple .preview-header,
.purple .preview-line {
  background: rgba(255, 255, 255, 0.15);
}

.minimal .preview-header,
.minimal .preview-line {
  background: rgba(0, 0, 0, 0.1);
}

.neon .preview-header,
.neon .preview-line {
  background: rgba(0, 255, 156, 0.15);
}
</style>
