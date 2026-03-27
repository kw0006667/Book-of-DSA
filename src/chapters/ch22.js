export const metadata = {
  id: 22, part: 7,
  slug: 'pattern-recognition',
  title: '常見面試模式總結 — Pattern Recognition',
  tags: ['algo'],
  sections: [
    { slug: 'lookup-table', title: '問題分類查找表' },
    { slug: 'pattern-matching', title: 'Pattern 對應' },
    { slug: 'solving-framework', title: '解題框架' },
    { slug: 'cheatsheet', title: 'Complexity Cheatsheet' },
  ]
}

export const content = `
<div class="chapter-header">
  <div class="chapter-num">Chapter 22 · Part VII</div>
  <h1>常見面試模式總結 — Pattern Recognition</h1>
  <p>面試成功的關鍵不是記住所有題目，而是看到題目時能快速辨識「這是哪種 pattern」，然後套用對應的解題框架。本章整理最高頻的模式識別方法。</p>
  <div class="chapter-tags">
    <span class="tag tag-algo">Algorithm</span>
  </div>
</div>

<h2 id="lookup-table">問題分類查找表</h2>
<table>
  <thead><tr><th>關鍵字 / 情境</th><th>優先考慮</th></tr></thead>
  <tbody>
    <tr><td>有序陣列 + 找值 / 插入位置</td><td>Binary Search</td></tr>
    <tr><td>子陣列 / 子字串的最大最小</td><td>Sliding Window</td></tr>
    <tr><td>陣列配對、回文、有序雙端問題</td><td>Two Pointers</td></tr>
    <tr><td>樹的遍歷 / 最大深度 / 路徑</td><td>DFS / BFS</td></tr>
    <tr><td>最短路徑（unweighted graph）</td><td>BFS</td></tr>
    <tr><td>連通性 / 合併集合</td><td>Union-Find</td></tr>
    <tr><td>前綴搜尋 / Autocomplete</td><td>Trie</td></tr>
    <tr><td>Top-K / 第 K 大</td><td>Heap（Min-Heap size K）</td></tr>
    <tr><td>排列 / 組合 / 子集</td><td>Backtracking</td></tr>
    <tr><td>最大最小值 / 方案數（最優）</td><td>Dynamic Programming</td></tr>
    <tr><td>括號匹配 / 下一個更大元素</td><td>Monotonic Stack</td></tr>
    <tr><td>頻率統計 / 快速查找</td><td>Hash Map / Set</td></tr>
    <tr><td>區間處理 / 排程</td><td>Sorting + Greedy / Heap</td></tr>
    <tr><td>課程依賴 / 任務順序</td><td>Topological Sort</td></tr>
    <tr><td>只出現一次的數字</td><td>XOR</td></tr>
  </tbody>
</table>

<h2 id="pattern-matching">Pattern 對應</h2>

<h3>Two Pointers 還是 Sliding Window？</h3>
<ul>
  <li><strong>Two Pointers</strong>：兩個指標的<strong>關係</strong>決定移動（如：sum < target → 移 left）</li>
  <li><strong>Sliding Window</strong>：維護一個<strong>連續視窗</strong>，擴大或縮小（找最長 / 最短子陣列）</li>
</ul>

<h3>DP 還是 Greedy？</h3>
<ul>
  <li>嘗試用 greedy，若能找到反例則需 DP</li>
  <li>Greedy：每步選最優，不需要回溯</li>
  <li>DP：需要考慮「現在的選擇影響未來」</li>
</ul>

<h3>BFS 還是 DFS？</h3>
<ul>
  <li><strong>BFS</strong>：最短路徑（步數最少）、層次遍歷</li>
  <li><strong>DFS</strong>：所有路徑、連通性、拓撲排序、回溯</li>
</ul>

<h2 id="solving-framework">解題框架（45 分鐘）</h2>
<ol>
  <li><strong>理解題目（5 min）</strong>：確認 input / output，詢問 edge case、規模</li>
  <li><strong>暴力解（3 min）</strong>：先說出 brute force，分析其複雜度</li>
  <li><strong>優化（10 min）</strong>：識別 pattern，提出優化方向，確認複雜度</li>
  <li><strong>實作（20 min）</strong>：乾淨地寫出程式碼，邊寫邊說明</li>
  <li><strong>測試（7 min）</strong>：用例子走一遍、考慮 edge case</li>
</ol>

<h2 id="cheatsheet">Complexity Cheatsheet</h2>
<table>
  <thead><tr><th>演算法 / 資料結構</th><th>Time</th><th>Space</th></tr></thead>
  <tbody>
    <tr><td>Array / Dynamic Array</td><td>Access <span class="complexity">O(1)</span>, Search <span class="complexity">O(n)</span>, Insert/Delete end <span class="complexity">O(1)*</span></td><td><span class="complexity">O(n)</span></td></tr>
    <tr><td>Hash Map / Set</td><td>All <span class="complexity">O(1)*</span></td><td><span class="complexity">O(n)</span></td></tr>
    <tr><td>Binary Search</td><td><span class="complexity">O(log n)</span></td><td><span class="complexity">O(1)</span></td></tr>
    <tr><td>Merge Sort / Quick Sort</td><td><span class="complexity">O(n log n)</span></td><td><span class="complexity">O(n)</span> / <span class="complexity">O(log n)</span></td></tr>
    <tr><td>Heap insert/delete</td><td><span class="complexity">O(log n)</span></td><td><span class="complexity">O(n)</span></td></tr>
    <tr><td>BFS / DFS</td><td><span class="complexity">O(V+E)</span></td><td><span class="complexity">O(V)</span></td></tr>
    <tr><td>Dijkstra</td><td><span class="complexity">O((V+E) log V)</span></td><td><span class="complexity">O(V)</span></td></tr>
    <tr><td>Union-Find</td><td><span class="complexity">O(α(n))*</span></td><td><span class="complexity">O(n)</span></td></tr>
    <tr><td>Trie insert/search</td><td><span class="complexity">O(m)</span></td><td><span class="complexity">O(m·n)</span></td></tr>
  </tbody>
</table>

<div class="chapter-footer">
  <a href="#ch21"><span class="footer-label">← 上一章</span><span class="footer-title">Bit Manipulation</span></a>
  <a class="next" href="#ch23"><span class="footer-label">下一章 →</span><span class="footer-title">前端特化題型</span></a>
</div>
`
