/**
 * Navigation — builds sidebar nav tree, mobile drawer, and sections panel.
 * Manages active state, sidebar collapse/expand, and mobile state machine.
 */

import { chapters, parts } from './chapters/index.js'

// Mobile state: 'closed' | 'drawer' | 'sections'
let mobileState = 'closed'
let _currentChapterId = null

const SIDEBAR_KEY  = 'dsa-sidebar-collapsed'
const SECTIONS_KEY = 'dsa-desktop-sections-collapsed'

export function initNav() {
  buildSidebarNav()
  buildDrawerNav()
  initDesktopSidebarControls()
  initMobileControls()
}

// ─── Desktop Sidebar Nav (chapters + expandable sections) ───

function buildSidebarNav() {
  const nav = document.getElementById('sidebar-nav')
  if (!nav) return

  const collapsedParts = JSON.parse(localStorage.getItem('dsa-collapsed-parts') ?? '[]')

  const html = parts.map(part => {
    const partChapters = chapters.filter(ch => ch.part === part.id)
    return `
      <div class="nav-part-label">${part.label}</div>
      <ul>${partChapters.map(ch => buildChapterItem(ch)).join('')}</ul>
    `
  }).join('')

  nav.innerHTML = html

  // Attach toggle + navigation to each chapter trigger
  nav.querySelectorAll('.nav-chapter-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const li = btn.closest('.nav-chapter')
      if (!li) return
      const chapterId = parseInt(btn.dataset.chapter, 10)

      // Toggle section expansion
      const wasOpen = li.classList.contains('is-open')
      nav.querySelectorAll('.nav-chapter').forEach(el => el.classList.remove('is-open'))
      if (!wasOpen) li.classList.add('is-open')

      // Navigate to chapter
      location.hash = `ch${chapterId}`
    })
  })
}

function buildChapterItem(ch) {
  const hasSections = ch.sections?.length > 0
  const sectionsHtml = hasSections
    ? ch.sections.map(s => `
        <li>
          <a class="nav-section-link"
             href="#ch${ch.id}-${s.slug}"
             data-chapter="${ch.id}"
             data-section="${s.slug}">${s.title}</a>
        </li>
      `).join('')
    : ''

  return `
    <li class="nav-chapter" data-chapter-id="${ch.id}">
      <button class="nav-chapter-trigger" data-chapter="${ch.id}">
        <span class="nav-chapter-arrow">▶</span>
        <span class="nav-chapter-title">
          <span class="nav-chapter-num">Ch.${String(ch.id).padStart(2, '0')}</span>
          ${ch.title}
        </span>
      </button>
      ${hasSections ? `<ul class="nav-sections">${sectionsHtml}</ul>` : ''}
    </li>
  `
}

// ─── Mobile Drawer Nav (chapters only, no sections) ───

function buildDrawerNav() {
  const nav = document.getElementById('drawer-nav')
  if (!nav) return

  const html = parts.map(part => {
    const partChapters = chapters.filter(ch => ch.part === part.id)
    const links = partChapters.map(ch => `
      <a href="#ch${ch.id}" class="drawer-chapter-link" data-chapter="${ch.id}">
        Ch.${String(ch.id).padStart(2, '0')} — ${ch.title}
      </a>
    `).join('')
    return `
      <div class="drawer-part-label">${part.label}</div>
      ${links}
    `
  }).join('')

  nav.innerHTML = html

  // Close drawer when a chapter is selected
  nav.querySelectorAll('.drawer-chapter-link').forEach(a => {
    a.addEventListener('click', () => setMobileState('closed'))
  })
}

// ─── Active State ───

export function setActive(chapterId, sectionSlug = null) {
  _currentChapterId = chapterId

  // Update desktop sidebar
  const sidebarNav = document.getElementById('sidebar-nav')
  if (sidebarNav) {
    sidebarNav.querySelectorAll('.nav-chapter--active').forEach(el => el.classList.remove('nav-chapter--active'))
    sidebarNav.querySelectorAll('.nav-chapter.is-open').forEach(el => el.classList.remove('is-open'))
    sidebarNav.querySelectorAll('.nav-section-link.active').forEach(el => el.classList.remove('active'))

    const chapterLi = sidebarNav.querySelector(`.nav-chapter[data-chapter-id="${chapterId}"]`)
    if (chapterLi) {
      chapterLi.classList.add('nav-chapter--active', 'is-open')
      const trigger = chapterLi.querySelector('.nav-chapter-trigger')
      if (trigger) trigger.setAttribute('aria-expanded', 'true')
      setTimeout(() => chapterLi.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 50)
    }

    if (sectionSlug) {
      const sectionLink = sidebarNav.querySelector(
        `.nav-section-link[data-chapter="${chapterId}"][data-section="${sectionSlug}"]`
      )
      if (sectionLink) sectionLink.classList.add('active')
    }
  }

  // Update mobile drawer
  const drawerNav = document.getElementById('drawer-nav')
  if (drawerNav) {
    drawerNav.querySelectorAll('.drawer-chapter-link.active').forEach(el => el.classList.remove('active'))
    const drawerLink = drawerNav.querySelector(`.drawer-chapter-link[data-chapter="${chapterId}"]`)
    if (drawerLink) drawerLink.classList.add('active')
  }

  // Build sections panel content
  buildSectionsPanel(chapterId)
  updateSectionsPanelActive(sectionSlug)
}

export function setActiveSection(sectionSlug) {
  // Sidebar section links
  document.querySelectorAll('.nav-section-link').forEach(link => {
    link.classList.toggle('active', link.dataset.section === sectionSlug)
  })
  // Sections panel
  updateSectionsPanelActive(sectionSlug)
}

// ─── Sections Panel ───

function buildSectionsPanel(chapterId) {
  const nav = document.getElementById('sections-nav')
  if (!nav) return

  const ch = chapters.find(c => c.id === chapterId)
  if (!ch?.sections?.length) {
    nav.innerHTML = ''
    return
  }

  nav.innerHTML = ch.sections.map(s => `
    <a href="#ch${ch.id}-${s.slug}" class="panel-section-link" data-section="${s.slug}">${s.title}</a>
  `).join('')

  // Close mobile panel when a section is clicked
  nav.querySelectorAll('.panel-section-link').forEach(a => {
    a.addEventListener('click', () => {
      if (!isDesktop()) setMobileState('closed')
    })
  })
}

function updateSectionsPanelActive(sectionSlug) {
  const nav = document.getElementById('sections-nav')
  if (!nav) return
  nav.querySelectorAll('.panel-section-link.active').forEach(el => el.classList.remove('active'))
  if (sectionSlug) {
    const link = nav.querySelector(`.panel-section-link[data-section="${sectionSlug}"]`)
    if (link) link.classList.add('active')
  }
}

// ─── Desktop Sidebar Controls ───

function initDesktopSidebarControls() {
  const collapseToggle = document.getElementById('sidebar-collapse-toggle')
  const expandToggle   = document.getElementById('sidebar-expand-toggle')

  // Restore persisted states
  const sidebarCollapsed  = localStorage.getItem(SIDEBAR_KEY)  === 'true'
  const sectionsCollapsed = localStorage.getItem(SECTIONS_KEY) === 'true'

  if (sidebarCollapsed && isDesktop()) applyDesktopSidebarState(true)
  if (sectionsCollapsed) applyDesktopSectionsState(true)

  collapseToggle?.addEventListener('click', () => {
    applyDesktopSidebarState(true)
    applyDesktopSectionsState(false) // reset sections visibility on collapse
  })

  expandToggle?.addEventListener('click', () => {
    applyDesktopSidebarState(false)
  })
}

// ─── Mobile Controls ───

function initMobileControls() {
  const hamburger     = document.getElementById('hamburger')
  const drawerClose   = document.getElementById('drawer-close')
  const sectionsToggle = document.getElementById('sections-toggle')
  const sectionsClose  = document.getElementById('sections-close')
  const overlay        = document.getElementById('overlay')

  hamburger?.addEventListener('click', () => {
    setMobileState(mobileState === 'drawer' ? 'closed' : 'drawer')
  })

  drawerClose?.addEventListener('click', () => setMobileState('closed'))

  sectionsToggle?.addEventListener('click', () => {
    if (isDesktop()) {
      applyDesktopSectionsState(false)
      return
    }
    setMobileState(mobileState === 'sections' ? 'closed' : 'sections')
  })

  sectionsClose?.addEventListener('click', () => {
    if (isDesktop()) {
      applyDesktopSectionsState(true)
      return
    }
    setMobileState('closed')
  })

  overlay?.addEventListener('click', () => setMobileState('closed'))
}

// ─── Mobile State Machine ───

function setMobileState(newState) {
  // On desktop, always closed (desktop uses CSS-driven visibility)
  if (isDesktop()) newState = 'closed'
  mobileState = newState

  const drawer        = document.getElementById('mobile-drawer')
  const panel         = document.getElementById('sections-panel')
  const overlay       = document.getElementById('overlay')
  const hamburger     = document.getElementById('hamburger')
  const sectionsToggle = document.getElementById('sections-toggle')

  drawer?.classList.toggle('open', newState === 'drawer')
  drawer?.setAttribute('aria-hidden', String(newState !== 'drawer'))

  panel?.classList.toggle('open', newState === 'sections')
  panel?.setAttribute('aria-hidden', String(newState !== 'sections'))

  overlay?.classList.toggle('active', newState !== 'closed')

  hamburger?.setAttribute('aria-expanded', String(newState === 'drawer'))
  sectionsToggle?.setAttribute('aria-expanded', String(newState === 'sections'))

  // Prevent body scroll while drawer/panel is open on mobile
  document.body.style.overflow = (newState !== 'closed' && !isDesktop()) ? 'hidden' : ''
}

// ─── Desktop Sidebar State ───

function applyDesktopSidebarState(collapsed) {
  document.body.classList.toggle('sidebar-collapsed', collapsed)
  localStorage.setItem(SIDEBAR_KEY, String(collapsed))

  const collapseToggle = document.getElementById('sidebar-collapse-toggle')
  const expandToggle   = document.getElementById('sidebar-expand-toggle')

  collapseToggle?.setAttribute('aria-expanded', String(!collapsed))
  expandToggle?.setAttribute('aria-expanded', String(!collapsed))

  if (!collapsed) {
    // When expanding sidebar, ensure sections panel is also hidden
    setMobileState('closed')
  }
}

function applyDesktopSectionsState(collapsed) {
  document.body.classList.toggle('desktop-sections-collapsed', collapsed)
  localStorage.setItem(SECTIONS_KEY, String(collapsed))

  const panel = document.getElementById('sections-panel')
  const shouldShow = isDesktop()
    && document.body.classList.contains('sidebar-collapsed')
    && !collapsed

  panel?.setAttribute('aria-hidden', String(!shouldShow))
}

// ─── Utilities ───

function isDesktop() {
  return window.matchMedia('(min-width: 768px)').matches
}
