/**
 * Book of DSA — App entry point
 * Registers Lit components, initialises theme, nav, and router.
 */

// Register Lit custom elements
import './components/dsa-code-block.js'
import './components/leetcode-problem-modal.js'

// Core modules
import { initTheme, toggleTheme } from './theme.js'
import { initNav } from './nav.js'
import { initRouter } from './router.js'

// ---- Boot ----
initTheme()

document.addEventListener('DOMContentLoaded', () => {
  initNav()
  initRouter()
  initThemeToggles()
})

// ---- Theme toggle buttons ----
function initThemeToggles() {
  document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme)
  document.getElementById('theme-toggle-mobile')?.addEventListener('click', toggleTheme)
}
