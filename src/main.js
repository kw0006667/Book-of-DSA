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

const CODE_LANGUAGE_STORAGE_KEY = 'dsa-code-language'
const CODE_LANGUAGE_CHANGE_EVENT = 'dsa-code-language-change'
const CODE_LANGUAGE_LABELS = {
  python: 'Python',
  typescript: 'TypeScript',
}

// ---- Boot ----
initTheme()

document.addEventListener('DOMContentLoaded', () => {
  initNav()
  initRouter()
  initLanguageMenus()
  initCodeLanguageMenus()
  initThemeToggles()
})

// ---- Theme toggle buttons ----
function initThemeToggles() {
  document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme)
  document.getElementById('theme-toggle-mobile')?.addEventListener('click', toggleTheme)
}

function initLanguageMenus() {
  const menus = Array.from(document.querySelectorAll('[data-language-menu]'))
  if (menus.length === 0) return

  const closeMenu = (menu) => {
    menu.classList.remove('is-open')
    menu.querySelector('.language-menu-trigger')?.setAttribute('aria-expanded', 'false')
    menu.querySelector('.language-menu')?.setAttribute('hidden', '')
  }

  const openMenu = (menu) => {
    menus.forEach(item => {
      if (item !== menu) closeMenu(item)
    })
    menu.classList.add('is-open')
    menu.querySelector('.language-menu-trigger')?.setAttribute('aria-expanded', 'true')
    menu.querySelector('.language-menu')?.removeAttribute('hidden')
  }

  menus.forEach(menu => {
    const trigger = menu.querySelector('.language-menu-trigger')
    if (!trigger) return
    if (trigger.disabled) {
      closeMenu(menu)
      return
    }

    trigger.addEventListener('click', (event) => {
      event.stopPropagation()
      if (menu.classList.contains('is-open')) {
        closeMenu(menu)
        return
      }

      openMenu(menu)
    })
  })

  document.addEventListener('click', (event) => {
    menus.forEach(menu => {
      if (!menu.contains(event.target)) closeMenu(menu)
    })
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') menus.forEach(closeMenu)
  })
}

function initCodeLanguageMenus() {
  const menus = Array.from(document.querySelectorAll('[data-code-language-menu]'))
  if (menus.length === 0) return

  const getLanguage = () => {
    const stored = window.localStorage?.getItem(CODE_LANGUAGE_STORAGE_KEY)
    return CODE_LANGUAGE_LABELS[stored] ? stored : 'python'
  }

  const closeMenu = (menu) => {
    menu.classList.remove('is-open')
    menu.querySelector('.language-menu-trigger')?.setAttribute('aria-expanded', 'false')
    menu.querySelector('.language-menu')?.setAttribute('hidden', '')
  }

  const closeAll = () => {
    menus.forEach(closeMenu)
  }

  const openMenu = (menu) => {
    closeAll()
    document.querySelectorAll('[data-language-menu]').forEach(item => {
      item.classList.remove('is-open')
      item.querySelector('.language-menu-trigger')?.setAttribute('aria-expanded', 'false')
      item.querySelector('.language-menu')?.setAttribute('hidden', '')
    })
    menu.classList.add('is-open')
    menu.querySelector('.language-menu-trigger')?.setAttribute('aria-expanded', 'true')
    menu.querySelector('.language-menu')?.removeAttribute('hidden')
  }

  const syncMenus = (language) => {
    menus.forEach(menu => {
      menu.querySelector('[data-code-language-label]').textContent = CODE_LANGUAGE_LABELS[language]
      menu.querySelectorAll('[data-code-language]').forEach(item => {
        const isActive = item.dataset.codeLanguage === language
        item.classList.toggle('is-active', isActive)
        item.setAttribute('aria-checked', String(isActive))
      })
    })
  }

  const setLanguage = (language) => {
    if (!CODE_LANGUAGE_LABELS[language]) return
    window.localStorage?.setItem(CODE_LANGUAGE_STORAGE_KEY, language)
    syncMenus(language)
    window.dispatchEvent(new CustomEvent(CODE_LANGUAGE_CHANGE_EVENT, {
      detail: { language },
    }))
  }

  syncMenus(getLanguage())

  menus.forEach(menu => {
    const trigger = menu.querySelector('.language-menu-trigger')
    trigger?.addEventListener('click', (event) => {
      event.stopPropagation()
      if (menu.classList.contains('is-open')) {
        closeMenu(menu)
        return
      }

      openMenu(menu)
    })

    menu.querySelectorAll('[data-code-language]').forEach(item => {
      item.addEventListener('click', (event) => {
        event.stopPropagation()
        setLanguage(item.dataset.codeLanguage)
        closeMenu(menu)
      })
    })
  })

  document.addEventListener('click', (event) => {
    menus.forEach(menu => {
      if (!menu.contains(event.target)) closeMenu(menu)
    })
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAll()
  })
}
