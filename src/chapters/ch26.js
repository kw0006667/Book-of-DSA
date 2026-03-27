import { chapters, parts } from './index.js'
import { chapterProblemMap, getAllProblemIds, getProblemMeta, renderProblemList } from '../leetcode/problem-catalog.js'

const sectionMap = {
  2: { slug: 'linear-structures', title: '線性資料結構' },
  3: { slug: 'trees-graphs', title: '樹與圖結構' },
  4: { slug: 'sorting-searching', title: '排序與搜尋' },
  5: { slug: 'strategy-core', title: '策略核心題型' },
  6: { slug: 'strategy-advanced', title: '策略進階題型' },
}

const indexedChapters = chapters.filter(ch => chapterProblemMap[ch.id])
const totalProblems = getAllProblemIds()
const difficultyCounts = totalProblems.reduce((acc, id) => {
  const detail = getProblemMeta(id)
  acc[detail.difficulty] = (acc[detail.difficulty] ?? 0) + 1
  return acc
}, { Easy: 0, Medium: 0, Hard: 0 })

function renderPart(partId) {
  const part = parts.find(item => item.id === partId)
  const partChapters = indexedChapters.filter(ch => ch.part === partId)

  return `
    <section class="problem-index-part" id="${sectionMap[partId].slug}">
      <div class="problem-index-part-head">
        <div>
          <div class="chapter-num">${part?.label ?? ''}</div>
          <h2>${sectionMap[partId].title}</h2>
        </div>
        <span class="tag tag-lc">${partChapters.reduce((sum, ch) => sum + chapterProblemMap[ch.id].length, 0)} 題</span>
      </div>
      <div class="problem-index-grid">
        ${partChapters.map(ch => `
          <article class="problem-index-card">
            <div class="problem-index-card-head">
              <div>
                <div class="problem-index-card-number">Ch.${String(ch.id).padStart(2, '0')}</div>
                <h3><a href="#ch${ch.id}">${ch.title}</a></h3>
              </div>
              <span class="tag tag-ds">${chapterProblemMap[ch.id].length} 題</span>
            </div>
            <p class="problem-index-card-copy">點擊任一題目可直接開啟共用題解 modal；點章節標題可回到原始教學章節。</p>
            ${renderProblemList(chapterProblemMap[ch.id])}
          </article>
        `).join('')}
      </div>
    </section>
  `
}

export const metadata = {
  id: 26,
  part: 8,
  slug: 'leetcode-problem-index',
  title: 'Appendix · 全站 LeetCode 題庫索引',
  tags: ['algo', 'ds'],
  sections: [
    { slug: 'overview', title: '總覽' },
    { slug: 'linear-structures', title: '線性資料結構' },
    { slug: 'trees-graphs', title: '樹與圖結構' },
    { slug: 'sorting-searching', title: '排序與搜尋' },
    { slug: 'strategy-core', title: '策略核心題型' },
    { slug: 'strategy-advanced', title: '策略進階題型' },
  ],
}

export const content = `
<div class="chapter-header">
  <div class="chapter-num">Appendix · Part VIII</div>
  <h1>全站 LeetCode 題庫索引</h1>
  <p>這一頁收錄網站內目前所有 LeetCode 題目，依照演算法 / 資料結構分類整理。題目卡片與原章節共用同一個 modal，因此你可以直接在此頁瀏覽題解、範例與 Python / TypeScript 實作。</p>
  <div class="chapter-tags">
    <span class="tag tag-algo">Algorithm</span>
    <span class="tag tag-ds">Data Structure</span>
    <span class="tag tag-lc">LeetCode Index</span>
  </div>
</div>

<section class="problem-index-overview" id="overview">
  <div class="problem-index-overview-copy">
    <h2>題庫總覽</h2>
    <p>目前共收錄 <strong>${totalProblems.length}</strong> 題，涵蓋 Array / String、Linked List、Tree、Graph、Sorting、Binary Search、Sliding Window、Backtracking、DP、Greedy、Bit Manipulation 等主題。這些清單都直接連回各章節與共用題解 modal。</p>
  </div>
  <div class="problem-index-stats">
    <div class="problem-index-stat">
      <span class="problem-index-stat-label">分類章節</span>
      <strong>${indexedChapters.length}</strong>
    </div>
    <div class="problem-index-stat">
      <span class="problem-index-stat-label">Easy</span>
      <strong>${difficultyCounts.Easy}</strong>
    </div>
    <div class="problem-index-stat">
      <span class="problem-index-stat-label">Medium</span>
      <strong>${difficultyCounts.Medium}</strong>
    </div>
    <div class="problem-index-stat">
      <span class="problem-index-stat-label">Hard</span>
      <strong>${difficultyCounts.Hard}</strong>
    </div>
  </div>
</section>

<div class="callout callout-tip">
  <div class="callout-title">使用方式</div>
  <p>如果你想依章節閱讀，點分類卡片上的章節標題；如果你只想快速查題，直接點下面的題目列即可，會沿用網站現有的 modal 互動。</p>
</div>

${[2, 3, 4, 5, 6].map(renderPart).join('')}

<div class="chapter-footer">
  <a href="#ch25">
    <span class="footer-label">← 上一章</span>
    <span class="footer-title">面試當天的策略與心態</span>
  </a>
</div>
`
