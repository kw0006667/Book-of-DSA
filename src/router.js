/**
 * Hash-based router
 * Formats: #ch1  |  #ch1-section-slug
 */

import { setActive, setActiveSection } from './nav.js'

const HASH_RE = /^ch(\d+)(?:-(.+))?$/

let currentChapterId = null
let scrollCleanup = null

export function initRouter() {
  window.addEventListener('hashchange', handleHash)
  handleHash()
}

async function handleHash() {
  const hash = location.hash.slice(1) // remove '#'
  const match = hash.match(HASH_RE)

  if (!match) {
    // Show home screen
    showHome()
    return
  }

  const chapterId = parseInt(match[1], 10)
  const sectionSlug = match[2] ?? null

  if (isNaN(chapterId) || chapterId < 1 || chapterId > 25) {
    showHome()
    return
  }

  if (chapterId !== currentChapterId) {
    await loadChapter(chapterId, sectionSlug)
  } else if (sectionSlug) {
    scrollToSection(sectionSlug)
  }
}

async function loadChapter(id, sectionSlug) {
  const overlay = document.getElementById('loading-overlay')
  if (overlay) overlay.classList.add('visible')

  // Clean up previous scroll listener
  if (scrollCleanup) { scrollCleanup(); scrollCleanup = null }

  try {
    const mod = await import(`./chapters/ch${String(id).padStart(2, '0')}.js`)
    const { metadata, content } = mod

    const article = document.getElementById('chapter-content')
    if (!article) return

    // Hide home screen, show chapter
    const home = document.getElementById('home-screen')
    if (home) home.style.display = 'none'

    article.innerHTML = content
    currentChapterId = id

    // Re-run Prism
    if (window.Prism) window.Prism.highlightAllUnder(article)

    // Upgrade any dsa-code-block elements that were injected
    article.querySelectorAll('dsa-code-block').forEach(el => {
      if (window.Prism) window.Prism.highlightAllUnder(el)
    })

    setActive(id, sectionSlug)

    if (sectionSlug) {
      // Defer scroll until after paint
      requestAnimationFrame(() => scrollToSection(sectionSlug))
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }

    // Init section scroll sync
    scrollCleanup = initSectionSync(metadata?.sections ?? [])

    // Add copy buttons to standalone pre blocks
    addCopyButtons(article)

    document.title = metadata?.title
      ? `${metadata.title} — Book of DSA`
      : 'Book of DSA'

  } catch (err) {
    console.error('Failed to load chapter', id, err)
    document.getElementById('chapter-content').innerHTML = `
      <div style="padding:48px 24px;text-align:center;color:var(--color-text-muted)">
        <p>章節載入失敗，請重新整理頁面。</p>
      </div>
    `
  } finally {
    if (overlay) overlay.classList.remove('visible')
  }
}

function scrollToSection(slug) {
  const target = document.getElementById(slug)
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveSection(slug)
  }
}

function showHome() {
  const home = document.getElementById('home-screen')
  const article = document.getElementById('chapter-content')
  if (home) { home.style.display = ''; article.innerHTML = ''; article.appendChild(home) }
  currentChapterId = null
  document.title = 'Book of DSA — 資料結構與演算法實戰指南'
  if (scrollCleanup) { scrollCleanup(); scrollCleanup = null }
}

// ---- Section scroll sync ----
function initSectionSync(sections) {
  if (!sections.length) return () => {}

  const headings = sections
    .map(s => document.getElementById(s.slug))
    .filter(Boolean)

  const onScroll = () => {
    const scrollY = window.scrollY + window.innerHeight * 0.28

    let active = headings[0]
    for (const h of headings) {
      if (h.offsetTop <= scrollY) active = h
      else break
    }
    if (active) setActiveSection(active.id)
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  return () => window.removeEventListener('scroll', onScroll)
}

// ---- Copy buttons for standalone pre blocks ----
function addCopyButtons(container) {
  container.querySelectorAll('pre[class*="language-"]:not(dsa-code-block pre)').forEach(pre => {
    if (pre.querySelector('.standalone-copy-btn')) return
    const btn = document.createElement('button')
    btn.className = 'code-copy-btn standalone-copy-btn'
    btn.textContent = '複製'
    btn.style.cssText = 'position:absolute;top:8px;right:8px;'
    pre.style.position = 'relative'
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(pre.querySelector('code')?.textContent ?? '')
      btn.textContent = '已複製 ✓'
      btn.classList.add('copied')
      setTimeout(() => { btn.textContent = '複製'; btn.classList.remove('copied') }, 1800)
    })
    pre.appendChild(btn)
  })
}
