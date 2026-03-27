export const metadata = {
  id: 1, part: 1,
  slug: 'complexity-analysis',
  title: '複雜度分析 — Big O Notation 與效能思維',
  tags: ['algo'],
  sections: [
    { slug: 'big-o-basics', title: 'Big O 基礎概念' },
    { slug: 'complexity-tiers', title: '常見複雜度等級' },
    { slug: 'space-complexity', title: 'Space Complexity' },
    { slug: 'best-worst-average', title: 'Best / Worst / Average Case' },
    { slug: 'code-analysis', title: '程式碼複雜度分析' },
    { slug: 'hidden-ops', title: '隱藏操作成本' },
  ]
}

export const content = `
<div class="chapter-header">
  <div class="chapter-num">Chapter 01 · Part I</div>
  <h1>複雜度分析 — Big O Notation 與效能思維</h1>
  <p>在開始學習任何資料結構或演算法之前，我們必須先建立衡量「效率」的語言。Big O Notation 是工程師討論演算法效能的通用語言。</p>
  <div class="chapter-tags">
    <span class="tag tag-algo">Algorithm</span>
  </div>
</div>

<h2 id="big-o-basics">Big O 基礎概念</h2>
<p>Big O Notation 描述的是演算法在輸入規模 <code>n</code> 趨向無窮大時，執行時間（或記憶體）的<strong>成長趨勢</strong>，而非精確的執行時間。</p>
<p>核心思路是：忽略常數係數與低階項，只保留主導項。</p>
<ul>
  <li><code>5n² + 3n + 100</code> → <span class="complexity">O(n²)</span></li>
  <li><code>2 log n + 50</code> → <span class="complexity">O(log n)</span></li>
  <li><code>n/2</code> → <span class="complexity">O(n)</span></li>
</ul>

<div class="callout callout-info">
  <div class="callout-title">為什麼忽略常數？</div>
  <p>常數係數依賴於硬體、程式語言等環境因素。Big O 描述的是演算法本身的擴展性 (scalability)，與環境無關。</p>
</div>

<h2 id="complexity-tiers">常見複雜度等級</h2>
<p>由快到慢排列，<code>n = 10,000</code> 時的操作次數對比：</p>

<table>
  <thead><tr><th>符號</th><th>名稱</th><th>n=10,000 時</th><th>典型範例</th></tr></thead>
  <tbody>
    <tr><td><span class="complexity">O(1)</span></td><td>Constant</td><td>1</td><td>Hash lookup、Array index</td></tr>
    <tr><td><span class="complexity">O(log n)</span></td><td>Logarithmic</td><td>~13</td><td>Binary search、平衡 BST</td></tr>
    <tr><td><span class="complexity">O(n)</span></td><td>Linear</td><td>10,000</td><td>Linear scan、單次迴圈</td></tr>
    <tr><td><span class="complexity">O(n log n)</span></td><td>Linearithmic</td><td>~132,000</td><td>Merge sort、Heap sort</td></tr>
    <tr><td><span class="complexity">O(n²)</span></td><td>Quadratic</td><td>100,000,000</td><td>Bubble sort、雙層巢狀迴圈</td></tr>
    <tr><td><span class="complexity">O(2ⁿ)</span></td><td>Exponential</td><td>無法計算</td><td>暴力 Subset enumeration</td></tr>
    <tr><td><span class="complexity">O(n!)</span></td><td>Factorial</td><td>無法計算</td><td>暴力 Permutation</td></tr>
  </tbody>
</table>

<h2 id="space-complexity">Space Complexity</h2>
<p>Space complexity 衡量演算法所需的<strong>額外記憶體</strong>（不含輸入本身）。</p>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// O(1) space — 只用固定幾個變數
function sum(arr: number[]): number {
  let total = 0
  for (const x of arr) total += x
  return total
}

// O(n) space — 建了一個同等大小的陣列
function doubled(arr: number[]): number[] {
  return arr.map(x => x * 2)
}

// O(n) space — 遞迴呼叫堆疊深度 = n
function factorial(n: number): number {
  if (n <= 1) return 1
  return n * factorial(n - 1)
}</code></pre>
  <pre slot="python"><code class="language-python"># O(1) space
def sum_array(arr: list[int]) -> int:
    total = 0
    for x in arr:
        total += x
    return total

# O(n) space
def doubled(arr: list[int]) -> list[int]:
    return [x * 2 for x in arr]

# O(n) space — call stack depth = n
def factorial(n: int) -> int:
    if n <= 1:
        return 1
    return n * factorial(n - 1)</code></pre>
</dsa-code-block>

<h2 id="best-worst-average">Best / Worst / Average Case</h2>
<p>Big O 通常討論 <strong>Worst Case</strong>（最壞情況），但三種情況各有用途：</p>

<table>
  <thead><tr><th>情況</th><th>符號</th><th>說明</th></tr></thead>
  <tbody>
    <tr><td>Best Case</td><td>Ω (Omega)</td><td>最理想輸入下的複雜度</td></tr>
    <tr><td>Average Case</td><td>Θ (Theta)</td><td>隨機輸入的平均複雜度</td></tr>
    <tr><td>Worst Case</td><td>O (Big O)</td><td>最壞輸入下的複雜度（最常用）</td></tr>
  </tbody>
</table>

<div class="callout callout-tip">
  <div class="callout-title">Quick Sort 的三種情況</div>
  <p>Best/Average: <span class="complexity">O(n log n)</span>，Worst（已排序陣列 + 選第一個 pivot）: <span class="complexity">O(n²)</span>。這就是為什麼實務上常用隨機 pivot。</p>
</div>

<h2 id="code-analysis">程式碼複雜度分析</h2>
<p>分析時遵循幾個規則：</p>
<ol>
  <li><strong>加法規則</strong>：兩段連續程式碼，取較大者。<code>O(n) + O(n²) = O(n²)</code></li>
  <li><strong>乘法規則</strong>：巢狀迴圈相乘。<code>O(n) × O(n) = O(n²)</code></li>
  <li><strong>Drop constants</strong>：<code>O(2n) = O(n)</code></li>
  <li><strong>Drop lower terms</strong>：<code>O(n² + n) = O(n²)</code></li>
</ol>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">function analyze(arr: number[]): void {
  const n = arr.length

  // O(n) — single loop
  for (const x of arr) console.log(x)

  // O(n²) — nested loops
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      console.log(arr[i] + arr[j])
    }
  }
  // Total: O(n) + O(n²) = O(n²)
}

// O(log n) — divides problem in half each time
function binarySearch(arr: number[], target: number): number {
  let lo = 0, hi = arr.length - 1
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    if (arr[mid] === target) return mid
    else if (arr[mid] < target) lo = mid + 1
    else hi = mid - 1
  }
  return -1
}</code></pre>
  <pre slot="python"><code class="language-python">def analyze(arr: list) -> None:
    n = len(arr)

    # O(n) — single loop
    for x in arr:
        print(x)

    # O(n^2) — nested loops
    for i in range(n):
        for j in range(n):
            print(arr[i] + arr[j])
    # Total: O(n) + O(n^2) = O(n^2)

# O(log n)
def binary_search(arr: list[int], target: int) -> int:
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1</code></pre>
</dsa-code-block>

<h2 id="hidden-ops">隱藏操作成本</h2>
<p>內建操作並非免費，理解這些成本能避免寫出看似簡潔卻效能低落的程式碼：</p>

<table>
  <thead><tr><th>操作</th><th>Python</th><th>TypeScript/JS</th><th>複雜度</th></tr></thead>
  <tbody>
    <tr><td>陣列末端 push</td><td><code>list.append(x)</code></td><td><code>arr.push(x)</code></td><td><span class="complexity">O(1)</span> 均攤</td></tr>
    <tr><td>陣列頭部 insert</td><td><code>list.insert(0, x)</code></td><td><code>arr.unshift(x)</code></td><td><span class="complexity">O(n)</span></td></tr>
    <tr><td>字串串接</td><td><code>'a' + 'b'</code> in loop</td><td><code>str += x</code> in loop</td><td><span class="complexity">O(n²)</span> 累計</td></tr>
    <tr><td>排序</td><td><code>list.sort()</code></td><td><code>arr.sort()</code></td><td><span class="complexity">O(n log n)</span></td></tr>
    <tr><td>in 檢查</td><td><code>x in list</code></td><td><code>arr.includes(x)</code></td><td><span class="complexity">O(n)</span></td></tr>
    <tr><td>in 檢查（集合）</td><td><code>x in set</code></td><td><code>set.has(x)</code></td><td><span class="complexity">O(1)</span></td></tr>
  </tbody>
</table>

<div class="callout callout-warning">
  <div class="callout-title">字串串接陷阱</div>
  <p>在迴圈中使用 <code>+</code> 串接字串，每次都會建立新字串，總複雜度為 <span class="complexity">O(n²)</span>。應改用陣列收集後一次 <code>join()</code>，複雜度降為 <span class="complexity">O(n)</span>。</p>
</div>

<div class="chapter-footer">
  <a class="next" href="#ch2">
    <span class="footer-label">下一章 →</span>
    <span class="footer-title">語言工具箱</span>
  </a>
</div>
`
