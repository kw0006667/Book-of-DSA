import { getChapterProblemIds, renderProblemList } from '../leetcode/problem-catalog.js'

export const metadata = {
  id: 3, part: 2,
  slug: 'array-string',
  title: 'Array 與 String',
  tags: ['ds', 'fe'],
  sections: [
    { slug: 'static-vs-dynamic', title: 'Static vs Dynamic Array' },
    { slug: 'language-diff', title: '語言差異' },
    { slug: 'string-immutability', title: 'String 不可變性' },
    { slug: 'techniques', title: '常用技巧' },
    { slug: 'matrix', title: 'Matrix 操作' },
  ]
}

export const content = `
<div class="chapter-header">
  <div class="chapter-num">Chapter 03 · Part II</div>
  <h1>Array 與 String</h1>
  <p>Array 是最基礎也最常用的資料結構。理解它的底層原理，才能準確分析各種操作的時間複雜度，並在面試中做出正確的設計決策。</p>
  <div class="chapter-tags">
    <span class="tag tag-ds">Data Structure</span>
    <span class="tag tag-fe">Frontend</span>
  </div>
</div>

<h2 id="static-vs-dynamic">Static vs Dynamic Array</h2>
<p><strong>Static Array</strong>：大小固定，在記憶體中連續存放，Random access <span class="complexity">O(1)</span>。</p>
<p><strong>Dynamic Array</strong>（如 Python <code>list</code>、JS <code>Array</code>）：底層仍是連續記憶體，但當空間不足時，會分配更大的記憶體（通常是 2x），並將舊資料複製過去，均攤後 push 仍是 <span class="complexity">O(1)</span>。</p>

<table>
  <thead><tr><th>操作</th><th>Time</th><th>說明</th></tr></thead>
  <tbody>
    <tr><td>Random Access <code>arr[i]</code></td><td><span class="complexity">O(1)</span></td><td>直接計算記憶體位址</td></tr>
    <tr><td>Search (unsorted)</td><td><span class="complexity">O(n)</span></td><td>線性掃描</td></tr>
    <tr><td>Insert at end</td><td><span class="complexity">O(1)*</span></td><td>均攤</td></tr>
    <tr><td>Insert at middle/front</td><td><span class="complexity">O(n)</span></td><td>需移動後續元素</td></tr>
    <tr><td>Delete at end</td><td><span class="complexity">O(1)</span></td><td></td></tr>
    <tr><td>Delete at middle/front</td><td><span class="complexity">O(n)</span></td><td>需移動後續元素</td></tr>
  </tbody>
</table>

<h2 id="language-diff">語言差異</h2>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// JS Array — sparse array, mixed types allowed (avoid in practice)
const arr: number[] = [1, 2, 3, 4, 5]

// Slice (non-destructive) — O(k)
arr.slice(1, 3)          // [2, 3]

// Splice (in-place) — O(n)
arr.splice(1, 2)         // removes 2 elements at index 1

// Spread / concat — O(n)
const merged = [...arr, ...arr]

// Fill — O(n)
new Array(5).fill(0)     // [0, 0, 0, 0, 0]

// 2D array
const matrix: number[][] = Array.from({ length: 3 }, () => new Array(3).fill(0))

// Destructuring
const [first, second, ...rest] = arr

// TypedArray — for binary data / performance
const typed = new Int32Array(1000)  // 固定大小，比 Array 更省記憶體</code></pre>
  <pre slot="python"><code class="language-python">arr = [1, 2, 3, 4, 5]

# Slice — O(k)
arr[1:3]           # [2, 3]

# In-place sort
arr.sort()         # O(n log n)
sorted(arr)        # returns new list

# List comprehension
doubled = [x * 2 for x in arr]   # O(n)
matrix = [[0] * 3 for _ in range(3)]  # 正確的 2D 初始化

# 錯誤示範！
# bad = [[0] * 3] * 3  # 三列指向同一 list！

# enumerate / zip
for i, val in enumerate(arr):
    print(i, val)

a, b = [1, 2], [3, 4]
for x, y in zip(a, b):
    print(x, y)</code></pre>
</dsa-code-block>

<h2 id="string-immutability">String 不可變性</h2>
<p>Python 和 JavaScript 的字串都是 <strong>immutable</strong>（不可變）。每次「修改」字串，其實都是建立新字串。</p>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// 錯誤：在迴圈中用 + 串接 — O(n²) 總計
let result = ''
for (const ch of 'hello world') {
  result += ch  // 每次都建新字串
}

// 正確：收集後一次 join — O(n)
const parts: string[] = []
for (const ch of 'hello world') {
  parts.push(ch)
}
const finalStr = parts.join('')

// 字元轉換
'a'.charCodeAt(0)             // 97
String.fromCharCode(97)       // 'a'
'A'.charCodeAt(0) - 'A'.charCodeAt(0)  // 0 (index in alphabet)</code></pre>
  <pre slot="python"><code class="language-python"># 錯誤：O(n²)
result = ''
for ch in 'hello world':
    result += ch  # 每次都建新字串

# 正確：O(n)
parts = []
for ch in 'hello world':
    parts.append(ch)
final_str = ''.join(parts)

# 字元轉換
ord('a')        # 97
chr(97)         # 'a'
ord('a') - ord('a')  # 0

# Python string methods
s = 'hello world'
s.split()        # ['hello', 'world']
s.replace('o', '0')
s[::-1]          # 反轉 — O(n)</code></pre>
</dsa-code-block>

<h2 id="techniques">常用技巧</h2>
<h3>Prefix Sum</h3>
<p>預先計算前綴和，讓任意區間和的查詢從 <span class="complexity">O(n)</span> 降到 <span class="complexity">O(1)</span>。</p>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// Prefix Sum
function buildPrefixSum(arr: number[]): number[] {
  const prefix = new Array(arr.length + 1).fill(0)
  for (let i = 0; i < arr.length; i++) {
    prefix[i + 1] = prefix[i] + arr[i]
  }
  return prefix
}

// Range sum [l, r] in O(1)
function rangeSum(prefix: number[], l: number, r: number): number {
  return prefix[r + 1] - prefix[l]
}

const arr = [1, 2, 3, 4, 5]
const prefix = buildPrefixSum(arr)
rangeSum(prefix, 1, 3)  // 2+3+4 = 9</code></pre>
  <pre slot="python"><code class="language-python">def build_prefix_sum(arr: list[int]) -> list[int]:
    prefix = [0] * (len(arr) + 1)
    for i, x in enumerate(arr):
        prefix[i + 1] = prefix[i] + x
    return prefix

def range_sum(prefix: list[int], l: int, r: int) -> int:
    return prefix[r + 1] - prefix[l]

arr = [1, 2, 3, 4, 5]
prefix = build_prefix_sum(arr)
print(range_sum(prefix, 1, 3))  # 9</code></pre>
</dsa-code-block>

<h2 id="matrix">Matrix 操作</h2>
<p>矩陣題型常考旋轉、轉置、螺旋遍歷。理解座標轉換公式是關鍵。</p>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// 順時針旋轉 90 度（in-place）
// 步驟：先 transpose，再 reverse 每一列
function rotate(matrix: number[][]): void {
  const n = matrix.length
  // Transpose
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]]
    }
  }
  // Reverse each row
  for (const row of matrix) row.reverse()
}

// 四個方向遍歷常數
const DIRS = [[0,1],[0,-1],[1,0],[-1,0]]  // right, left, down, up</code></pre>
  <pre slot="python"><code class="language-python">from typing import List

def rotate(matrix: List[List[int]]) -> None:
    n = len(matrix)
    # Transpose
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    # Reverse each row
    for row in matrix:
        row.reverse()

DIRS = [(0, 1), (0, -1), (1, 0), (-1, 0)]</code></pre>
</dsa-code-block>

<div class="callout callout-fe">
  <div class="callout-title">前端應用場景</div>
  <ul>
    <li><strong>Virtual Scroll</strong>：用 Array index 計算可見範圍，<span class="complexity">O(1)</span> 定位渲染起點</li>
    <li><strong>表單驗證</strong>：<code>Array.every()</code> / <code>Array.some()</code> 做批次欄位驗證</li>
    <li><strong>TypedArray</strong>：處理 WebGL vertex buffer、Canvas ImageData、WebSocket binary data</li>
    <li><strong>React 渲染優化</strong>：<code>key</code> prop 讓 diff 演算法從 <span class="complexity">O(n²)</span> 降到 <span class="complexity">O(n)</span></li>
  </ul>
</div>

<h3>精選 LeetCode 題目</h3>
${renderProblemList(getChapterProblemIds(3))}

<div class="chapter-footer">
  <a href="#ch2">
    <span class="footer-label">← 上一章</span>
    <span class="footer-title">語言工具箱</span>
  </a>
  <a class="next" href="#ch4">
    <span class="footer-label">下一章 →</span>
    <span class="footer-title">Linked List</span>
  </a>
</div>
`
