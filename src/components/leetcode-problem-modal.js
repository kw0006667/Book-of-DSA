import { getProblemDetail } from '../leetcode/problem-data.js'

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function renderExample(example) {
  return `
    <article class="leetcode-example">
      <div><strong>Input:</strong> <code>${escapeHtml(example.input)}</code></div>
      <div><strong>Output:</strong> <code>${escapeHtml(example.output)}</code></div>
      <p>${escapeHtml(example.explanation)}</p>
    </article>
  `
}

function renderApproach(item) {
  const pros = item.pros?.length
    ? `<div class="leetcode-approach-subsection"><h5>優點</h5><ul>${item.pros.map(text => `<li>${escapeHtml(text)}</li>`).join('')}</ul></div>`
    : ''
  const cons = item.cons?.length
    ? `<div class="leetcode-approach-subsection"><h5>限制</h5><ul>${item.cons.map(text => `<li>${escapeHtml(text)}</li>`).join('')}</ul></div>`
    : ''
  const whenToUse = item.whenToUse
    ? `<div class="leetcode-approach-subsection"><h5>適用時機</h5><p>${escapeHtml(item.whenToUse)}</p></div>`
    : ''

  return `
    <article class="leetcode-approach${item.recommended ? ' recommended' : ''}">
      <div class="leetcode-approach-head">
        <h4>${escapeHtml(item.name)}</h4>
        ${item.recommended ? '<span class="leetcode-recommended">Recommended</span>' : ''}
      </div>
      <p>${escapeHtml(item.idea)}</p>
      <div class="leetcode-complexities">
        <span><strong>Time</strong> ${escapeHtml(item.time)}</span>
        <span><strong>Space</strong> ${escapeHtml(item.space)}</span>
      </div>
      ${pros}
      ${cons}
      ${whenToUse}
    </article>
  `
}

function renderBulletSection(title, items = []) {
  if (!items?.length) return ''

  return `
    <section class="leetcode-section">
      <h3>${escapeHtml(title)}</h3>
      <ul class="leetcode-detail-list">
        ${items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
      </ul>
    </section>
  `
}

function renderOverview(detail) {
  const recommended = detail.approaches.find(item => item.recommended) ?? detail.approaches[0]
  if (!recommended) return ''

  return `
    <section class="leetcode-overview-grid">
      <article class="leetcode-overview-card">
        <span class="leetcode-overview-label">Recommended Approach</span>
        <h3>${escapeHtml(recommended.name)}</h3>
        <p>${escapeHtml(recommended.idea)}</p>
      </article>
      <article class="leetcode-overview-card leetcode-overview-metrics">
        <div>
          <span class="leetcode-overview-label">Time Complexity</span>
          <strong>${escapeHtml(recommended.time)}</strong>
        </div>
        <div>
          <span class="leetcode-overview-label">Space Complexity</span>
          <strong>${escapeHtml(recommended.space)}</strong>
        </div>
      </article>
    </section>
  `
}

function renderApproachTable(approaches = []) {
  if (!approaches.length) return ''

  return `
    <div class="leetcode-approach-table-wrap">
      <div class="leetcode-approach-table" role="table" aria-label="Approach comparison">
        <div class="leetcode-approach-row leetcode-approach-row-head" role="row">
          <div role="columnheader">Approach</div>
          <div role="columnheader">Time</div>
          <div role="columnheader">Space</div>
          <div role="columnheader">When To Use</div>
        </div>
        ${approaches.map(item => `
          <div class="leetcode-approach-row" role="row">
            <div role="cell">${escapeHtml(item.name)}${item.recommended ? ' · Recommended' : ''}</div>
            <div role="cell">${escapeHtml(item.time)}</div>
            <div role="cell">${escapeHtml(item.space)}</div>
            <div role="cell">${escapeHtml(item.whenToUse || item.idea)}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

class LeetCodeProblemModal extends HTMLElement {
  constructor() {
    super()
    this._handleKeydown = this._handleKeydown.bind(this)
    this._handleBackdropClick = this._handleBackdropClick.bind(this)
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="leetcode-modal-backdrop" hidden>
        <div class="leetcode-modal" role="dialog" aria-modal="true" aria-labelledby="leetcode-modal-title">
          <button class="leetcode-modal-close" type="button" aria-label="關閉題目詳解">✕</button>
          <div class="leetcode-modal-scroll">
            <div class="leetcode-modal-content"></div>
          </div>
        </div>
      </div>
    `

    this._backdrop = this.querySelector('.leetcode-modal-backdrop')
    this._content = this.querySelector('.leetcode-modal-content')
    this._closeButton = this.querySelector('.leetcode-modal-close')

    this._closeButton?.addEventListener('click', () => this.close())
    this._backdrop?.addEventListener('click', this._handleBackdropClick)
    document.addEventListener('keydown', this._handleKeydown)
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this._handleKeydown)
    this._backdrop?.removeEventListener('click', this._handleBackdropClick)
  }

  open(problemMeta) {
    const detail = getProblemDetail(problemMeta.id, problemMeta)

    this._content.innerHTML = `
      <header class="leetcode-modal-header">
        <div>
          <div class="leetcode-modal-id">LeetCode #${detail.id}</div>
          <h2 id="leetcode-modal-title">${escapeHtml(detail.title)}</h2>
        </div>
        <span class="diff diff-${String(detail.difficulty).toLowerCase()}">${escapeHtml(detail.difficulty)}</span>
      </header>

      <div class="leetcode-modal-body">
        ${renderOverview(detail)}

        <section class="leetcode-section">
          <h3>題目要做什麼</h3>
          <p>${escapeHtml(detail.statement)}</p>
        </section>

        ${detail.focus ? `
          <section class="leetcode-section">
            <h3>這題主要在考什麼</h3>
            <p>${escapeHtml(detail.focus)}</p>
          </section>
        ` : ''}

        ${detail.dataStructureChoice ? `
          <section class="leetcode-section">
            <h3>資料結構 / 演算法怎麼選</h3>
            <p>${escapeHtml(detail.dataStructureChoice)}</p>
          </section>
        ` : ''}

        ${renderBulletSection('解題思路拆解', detail.strategy)}

        <section class="leetcode-section">
          <h3>Examples</h3>
          <div class="leetcode-examples">
            ${detail.examples.length ? detail.examples.map(renderExample).join('') : '<p>此題尚未補上 example。</p>'}
          </div>
        </section>

        <section class="leetcode-section">
          <h3>解題技巧</h3>
          <ul class="leetcode-chip-list">
            ${detail.techniques.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
          </ul>
        </section>

        <section class="leetcode-section">
          <h3>不同解法與複雜度</h3>
          ${renderApproachTable(detail.approaches)}
          <div class="leetcode-approach-list">
            ${detail.approaches.map(renderApproach).join('')}
          </div>
        </section>

        <section class="leetcode-section leetcode-code-section">
          <h3>實作</h3>
          <dsa-code-block>
            <pre slot="python"><code class="language-python">${escapeHtml(detail.python)}</code></pre>
            <pre slot="typescript"><code class="language-typescript">${escapeHtml(detail.typescript)}</code></pre>
          </dsa-code-block>
        </section>
      </div>
    `

    this._backdrop.hidden = false
    document.body.classList.add('leetcode-modal-open')

    if (window.Prism) {
      window.Prism.highlightAllUnder(this._content)
    }
  }

  close() {
    if (!this._backdrop) return
    this._backdrop.hidden = true
    document.body.classList.remove('leetcode-modal-open')
  }

  _handleKeydown(event) {
    if (event.key === 'Escape' && this._backdrop && !this._backdrop.hidden) {
      this.close()
    }
  }

  _handleBackdropClick(event) {
    if (event.target === this._backdrop) {
      this.close()
    }
  }
}

customElements.define('leetcode-problem-modal', LeetCodeProblemModal)
