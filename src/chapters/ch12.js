export const metadata = {
  id: 12, part: 4,
  slug: 'sorting',
  title: 'Sorting Algorithms',
  tags: ['algo'],
  sections: [
    { slug: 'basic-sorts', title: 'Bubble / Selection / Insertion Sort' },
    { slug: 'merge-sort', title: 'Merge Sort' },
    { slug: 'quick-sort', title: 'Quick Sort' },
    { slug: 'heap-sort', title: 'Heap Sort' },
    { slug: 'non-comparison', title: 'Non-comparison Sorts' },
    { slug: 'builtin-sort', title: '內建 Sort 比較' },
    { slug: 'stability', title: 'Stability & Comparators' },
  ]
}

export const content = `
<div class="chapter-header">
  <div class="chapter-num">Chapter 12 · Part IV</div>
  <h1>Sorting Algorithms</h1>
  <p>排序是演算法學習的里程碑。理解各種排序的原理與複雜度，不只是面試必備，更能幫助你在系統設計中做出正確的效能決策。</p>
  <div class="chapter-tags">
    <span class="tag tag-algo">Algorithm</span>
  </div>
</div>

<h2 id="basic-sorts">Bubble / Selection / Insertion Sort</h2>
<table>
  <thead><tr><th>演算法</th><th>Best</th><th>Average</th><th>Worst</th><th>Space</th><th>Stable</th></tr></thead>
  <tbody>
    <tr><td>Bubble Sort</td><td><span class="complexity">O(n)</span></td><td><span class="complexity">O(n²)</span></td><td><span class="complexity">O(n²)</span></td><td><span class="complexity">O(1)</span></td><td>✅</td></tr>
    <tr><td>Selection Sort</td><td><span class="complexity">O(n²)</span></td><td><span class="complexity">O(n²)</span></td><td><span class="complexity">O(n²)</span></td><td><span class="complexity">O(1)</span></td><td>❌</td></tr>
    <tr><td>Insertion Sort</td><td><span class="complexity">O(n)</span></td><td><span class="complexity">O(n²)</span></td><td><span class="complexity">O(n²)</span></td><td><span class="complexity">O(1)</span></td><td>✅</td></tr>
  </tbody>
</table>
<p>三者都是 <span class="complexity">O(n²)</span>，但 <strong>Insertion Sort</strong> 在近乎有序的資料上表現最好，且是 cache-friendly 的，常被用於小型陣列的優化（如 Timsort 的底層）。</p>

<h2 id="merge-sort">Merge Sort</h2>
<p>分治法：將陣列分半、遞迴排序、再合併。穩定排序，時間複雜度恆為 <span class="complexity">O(n log n)</span>。</p>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr
  const mid = arr.length >> 1
  const left = mergeSort(arr.slice(0, mid))
  const right = mergeSort(arr.slice(mid))
  return merge(left, right)
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = []
  let i = 0, j = 0
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++])
    else result.push(right[j++])
  }
  return result.concat(left.slice(i), right.slice(j))
}</code></pre>
  <pre slot="python"><code class="language-python">def merge_sort(arr: list[int]) -> list[int]:
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left: list[int], right: list[int]) -> list[int]:
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]</code></pre>
</dsa-code-block>

<h2 id="quick-sort">Quick Sort</h2>
<p>選一個 pivot，partition 成「小於 pivot」和「大於 pivot」兩部分，遞迴排序。平均 <span class="complexity">O(n log n)</span>，in-place，但不穩定。</p>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">function quickSort(arr: number[], lo = 0, hi = arr.length - 1): void {
  if (lo >= hi) return
  const pivotIdx = partition(arr, lo, hi)
  quickSort(arr, lo, pivotIdx - 1)
  quickSort(arr, pivotIdx + 1, hi)
}

function partition(arr: number[], lo: number, hi: number): number {
  // Randomize pivot to avoid O(n²) worst case
  const randIdx = lo + Math.floor(Math.random() * (hi - lo + 1))
  ;[arr[randIdx], arr[hi]] = [arr[hi], arr[randIdx]]
  const pivot = arr[hi]
  let i = lo - 1
  for (let j = lo; j < hi; j++) {
    if (arr[j] <= pivot) {
      i++
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
  }
  ;[arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]]
  return i + 1
}</code></pre>
  <pre slot="python"><code class="language-python">import random

def quick_sort(arr: list[int], lo: int = 0, hi: int = -1) -> None:
    if hi == -1: hi = len(arr) - 1
    if lo >= hi: return
    pivot_idx = partition(arr, lo, hi)
    quick_sort(arr, lo, pivot_idx - 1)
    quick_sort(arr, pivot_idx + 1, hi)

def partition(arr: list[int], lo: int, hi: int) -> int:
    rand_idx = random.randint(lo, hi)
    arr[rand_idx], arr[hi] = arr[hi], arr[rand_idx]
    pivot = arr[hi]
    i = lo - 1
    for j in range(lo, hi):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[hi] = arr[hi], arr[i + 1]
    return i + 1</code></pre>
</dsa-code-block>

<h2 id="heap-sort">Heap Sort</h2>
<p>利用 Max-Heap：先 build heap <span class="complexity">O(n)</span>，再反覆 extract max <span class="complexity">O(log n)</span>，總計 <span class="complexity">O(n log n)</span>，in-place，但不穩定且 cache 不友好。</p>

<h2 id="non-comparison">Non-comparison Sorts</h2>
<table>
  <thead><tr><th>演算法</th><th>Time</th><th>Space</th><th>限制</th></tr></thead>
  <tbody>
    <tr><td>Counting Sort</td><td><span class="complexity">O(n + k)</span></td><td><span class="complexity">O(k)</span></td><td>整數，值域 k 不能太大</td></tr>
    <tr><td>Radix Sort</td><td><span class="complexity">O(d(n + k))</span></td><td><span class="complexity">O(n + k)</span></td><td>整數或固定長度字串</td></tr>
    <tr><td>Bucket Sort</td><td><span class="complexity">O(n)</span> avg</td><td><span class="complexity">O(n + k)</span></td><td>均勻分佈的浮點數</td></tr>
  </tbody>
</table>

<h2 id="builtin-sort">內建 Sort 比較</h2>
<table>
  <thead><tr><th></th><th>Python <code>list.sort()</code></th><th>JS <code>Array.prototype.sort()</code></th></tr></thead>
  <tbody>
    <tr><td>演算法</td><td>Timsort（Merge + Insertion）</td><td>V8: Timsort（2019+）</td></tr>
    <tr><td>時間</td><td><span class="complexity">O(n log n)</span></td><td><span class="complexity">O(n log n)</span></td></tr>
    <tr><td>Stable</td><td>✅</td><td>✅（ES2019+）</td></tr>
    <tr><td>In-place</td><td>✅</td><td>✅</td></tr>
  </tbody>
</table>

<div class="callout callout-warning">
  <div class="callout-title">JS sort 的數字陷阱</div>
  <p><code>[10, 9, 2].sort()</code> 結果是 <code>[10, 2, 9]</code>！預設按字典序。排數字一定要傳 comparator：<code>.sort((a, b) => a - b)</code>。</p>
</div>

<h2 id="stability">Stability & Comparators</h2>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// 自訂排序：按多個欄位
interface Task { name: string; priority: number; createdAt: number }

const tasks: Task[] = [
  { name: 'A', priority: 1, createdAt: 200 },
  { name: 'B', priority: 1, createdAt: 100 },
  { name: 'C', priority: 2, createdAt: 300 },
]

// 先按 priority 升序，再按 createdAt 升序
tasks.sort((a, b) => a.priority - b.priority || a.createdAt - b.createdAt)</code></pre>
  <pre slot="python"><code class="language-python">from dataclasses import dataclass

@dataclass
class Task:
    name: str
    priority: int
    created_at: int

tasks = [
    Task('A', 1, 200),
    Task('B', 1, 100),
    Task('C', 2, 300),
]

# key tuple：先按 priority，再按 created_at
tasks.sort(key=lambda t: (t.priority, t.created_at))</code></pre>
</dsa-code-block>

<h3>精選 LeetCode 題目</h3>
<ul class="problem-list">
  <li class="problem-item"><span class="problem-id">#912</span><span class="problem-name">Sort an Array</span><span class="diff diff-medium">Medium</span></li>
  <li class="problem-item"><span class="problem-id">#56</span><span class="problem-name">Merge Intervals</span><span class="diff diff-medium">Medium</span></li>
  <li class="problem-item"><span class="problem-id">#315</span><span class="problem-name">Count of Smaller Numbers After Self</span><span class="diff diff-hard">Hard</span></li>
  <li class="problem-item"><span class="problem-id">#75</span><span class="problem-name">Sort Colors</span><span class="diff diff-medium">Medium</span></li>
  <li class="problem-item"><span class="problem-id">#179</span><span class="problem-name">Largest Number</span><span class="diff diff-medium">Medium</span></li>
</ul>

<div class="chapter-footer">
  <a href="#ch11"><span class="footer-label">← 上一章</span><span class="footer-title">Union-Find</span></a>
  <a class="next" href="#ch13"><span class="footer-label">下一章 →</span><span class="footer-title">Binary Search</span></a>
</div>
`
