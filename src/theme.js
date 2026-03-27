/**
 * Theme management — persists dark/light preference in localStorage
 */

const STORAGE_KEY = 'dsa-book-theme'

export function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEY)
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const theme = saved ?? (prefersDark ? 'dark' : 'light')
  applyTheme(theme)
}

export function toggleTheme() {
  const current = document.documentElement.dataset.theme ?? 'light'
  const next = current === 'dark' ? 'light' : 'dark'
  applyTheme(next)
  localStorage.setItem(STORAGE_KEY, next)
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme

  // Prism stylesheet swap
  const light = document.getElementById('prism-light')
  const dark  = document.getElementById('prism-dark')
  if (light) light.disabled = theme === 'dark'
  if (dark)  dark.disabled  = theme !== 'dark'
}
