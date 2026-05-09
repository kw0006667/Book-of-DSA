import { LitElement, html } from 'lit'

const CODE_LANGUAGE_CHANGE_EVENT = 'dsa-code-language-change'
const CODE_LANGUAGE_STORAGE_KEY = 'dsa-code-language'
const SUPPORTED_CODE_LANGUAGES = ['python', 'typescript']

function getDefaultCodeLanguage() {
  const stored = window.localStorage?.getItem(CODE_LANGUAGE_STORAGE_KEY)
  return SUPPORTED_CODE_LANGUAGES.includes(stored) ? stored : 'python'
}

/**
 * <dsa-code-block> — per-block Python / TypeScript switcher
 *
 * Usage:
 *   <dsa-code-block>
 *     <pre slot="typescript"><code class="language-typescript">...</code></pre>
 *     <pre slot="python"><code class="language-python">...</code></pre>
 *   </dsa-code-block>
 *
 * Uses light DOM so Prism's external CSS applies directly to <code> elements.
 * Slots don't work in light DOM, so visibility is controlled via updated().
 */
class DsaCodeBlock extends LitElement {
  static properties = {
    _lang: { state: true },
    _copied: { state: true },
  }

  // Light DOM — Prism CSS reaches code elements directly
  createRenderRoot() { return this }

  constructor() {
    super()
    this._lang = getDefaultCodeLanguage()
    this._copied = false
    this._hasLocalSelection = false
    this._handleDefaultLanguageChange = (event) => {
      if (this._hasLocalSelection) return
      this._setLang(event.detail?.language ?? getDefaultCodeLanguage())
    }
  }

  _switchLang(lang) {
    this._hasLocalSelection = true
    this._setLang(lang)
  }

  _setLang(lang) {
    if (!this._hasLanguage(lang)) {
      lang = lang === 'python' ? 'typescript' : 'python'
    }

    if (!this._hasLanguage(lang)) return

    this._lang = lang
    this.updateComplete.then(() => {
      if (window.Prism) window.Prism.highlightAllUnder(this)
    })
  }

  _hasLanguage(lang) {
    return !!this.querySelector(`[slot="${lang}"]`)
  }

  _copy() {
    const pre = this.querySelector(`[slot="${this._lang}"]`)
    const code = pre?.querySelector('code')
    if (!code) return
    navigator.clipboard.writeText(code.textContent ?? '').then(() => {
      this._copied = true
      setTimeout(() => { this._copied = false }, 1800)
    })
  }

  // After each render, directly show/hide the <pre> children.
  // Slots don't work in light DOM, so we manage visibility ourselves.
  updated() {
    if (!this._hasLanguage(this._lang)) {
      this._setLang(getDefaultCodeLanguage())
    }

    ;['typescript', 'python'].forEach(lang => {
      const el = this.querySelector(`[slot="${lang}"]`)
      if (el) el.style.display = lang === this._lang ? 'block' : 'none'
    })
  }

  render() {
    const hasPython = !!this.querySelector('[slot="python"]')
    const hasTs = !!this.querySelector('[slot="typescript"]')

    return html`
      <div class="code-tabs">
        ${hasPython ? html`
          <button
            class="code-tab ${this._lang === 'python' ? 'active' : ''}"
            @click=${() => this._switchLang('python')}
          >
            <span class="code-tab-icon">Py</span> Python
          </button>
        ` : ''}
        ${hasTs ? html`
          <button
            class="code-tab ${this._lang === 'typescript' ? 'active' : ''}"
            @click=${() => this._switchLang('typescript')}
          >
            <span class="code-tab-icon">TS</span> TypeScript
          </button>
        ` : ''}
        <button class="code-copy-btn ${this._copied ? 'copied' : ''}" @click=${this._copy}>
          ${this._copied ? '已複製 ✓' : '複製'}
        </button>
      </div>
    `
  }

  connectedCallback() {
    super.connectedCallback()
    window.addEventListener(CODE_LANGUAGE_CHANGE_EVENT, this._handleDefaultLanguageChange)
    this.updateComplete.then(() => {
      this._setLang(getDefaultCodeLanguage())
      if (window.Prism) window.Prism.highlightAllUnder(this)
    })
  }

  disconnectedCallback() {
    window.removeEventListener(CODE_LANGUAGE_CHANGE_EVENT, this._handleDefaultLanguageChange)
    super.disconnectedCallback()
  }
}

customElements.define('dsa-code-block', DsaCodeBlock)
