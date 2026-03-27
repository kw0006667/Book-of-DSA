import { getChapterProblemIds, renderProblemList } from '../leetcode/problem-catalog.js'

export const metadata = {
  id: 13, part: 4,
  slug: 'binary-search',
  title: 'Binary Search 與其變體',
  tags: ['algo', 'fe'],
  sections: [
    { slug: 'basic', title: 'Basic Binary Search' },
    { slug: 'lower-upper-bound', title: 'Lower / Upper Bound' },
    { slug: 'rotated', title: 'Rotated Array' },
    { slug: 'search-on-answer', title: 'Binary Search on Answer' },
    { slug: 'matrix-search', title: 'Matrix Search' },
  ]
}

export const content = `
<div class="chapter-header">
  <div class="chapter-num">Chapter 13 · Part IV</div>
  <h1>Binary Search 與其變體</h1>
  <p>Binary Search 將搜尋空間每次減半，達到 <span class="complexity">O(log n)</span> 的效率。它不只用於「找值」，更是解決許多「在某個單調條件上找最優值」問題的通用框架。</p>
  <div class="chapter-tags">
    <span class="tag tag-algo">Algorithm</span>
    <span class="tag tag-fe">Frontend</span>
  </div>
</div>

<h2 id="basic">Basic Binary Search</h2>
<p>統一模板：使用 <code>[lo, hi]</code> 閉區間，避免邊界錯誤（off-by-one error）：</p>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">function binarySearch(arr: number[], target: number): number {
  let lo = 0, hi = arr.length - 1
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1)  // 避免 (lo+hi) 溢位
    if (arr[mid] === target) return mid
    else if (arr[mid] < target) lo = mid + 1
    else hi = mid - 1
  }
  return -1
}</code></pre>
  <pre slot="python"><code class="language-python">import bisect

def binary_search(arr: list[int], target: int) -> int:
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

# Python 內建：bisect_left / bisect_right
idx = bisect.bisect_left(arr, target)  # lower bound</code></pre>
</dsa-code-block>

<h2 id="lower-upper-bound">Lower / Upper Bound</h2>
<p>找第一個 ≥ target（lower bound）或第一個 > target（upper bound）的位置：</p>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// Lower bound: 第一個 >= target 的 index
function lowerBound(arr: number[], target: number): number {
  let lo = 0, hi = arr.length
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1)
    if (arr[mid] < target) lo = mid + 1
    else hi = mid
  }
  return lo  // [0, n]，n 表示找不到
}

// Upper bound: 第一個 > target 的 index
function upperBound(arr: number[], target: number): number {
  let lo = 0, hi = arr.length
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1)
    if (arr[mid] <= target) lo = mid + 1
    else hi = mid
  }
  return lo
}</code></pre>
  <pre slot="python"><code class="language-python">import bisect

# lower bound: 第一個 >= target 的 index
bisect.bisect_left(arr, target)

# upper bound: 第一個 > target 的 index
bisect.bisect_right(arr, target)

# 手寫版
def lower_bound(arr: list[int], target: int) -> int:
    lo, hi = 0, len(arr)
    while lo < hi:
        mid = (lo + hi) // 2
        if arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid
    return lo</code></pre>
</dsa-code-block>

<h2 id="rotated">Rotated Array</h2>
<p>即使陣列被旋轉，仍能用 Binary Search 在 <span class="complexity">O(log n)</span> 找目標值。關鍵在於每次判斷哪半段是有序的。</p>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// LC #33 — Search in Rotated Sorted Array
function searchRotated(nums: number[], target: number): number {
  let lo = 0, hi = nums.length - 1
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1)
    if (nums[mid] === target) return mid
    // 左半有序
    if (nums[lo] <= nums[mid]) {
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1
      else lo = mid + 1
    } else {
      // 右半有序
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1
      else hi = mid - 1
    }
  }
  return -1
}</code></pre>
  <pre slot="python"><code class="language-python">def search_rotated(nums: list[int], target: int) -> int:
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[lo] <= nums[mid]:  # 左半有序
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:  # 右半有序
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1</code></pre>
</dsa-code-block>

<h2 id="search-on-answer">Binary Search on Answer</h2>
<p>對「答案空間」做 Binary Search：答案是單調的（越大越容易滿足某條件），找最小可行解。</p>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// 最小化最大值：Koko Eating Bananas (LC #875)
function minEatingSpeed(piles: number[], h: number): number {
  let lo = 1, hi = Math.max(...piles)
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1)
    const hours = piles.reduce((sum, p) => sum + Math.ceil(p / mid), 0)
    if (hours <= h) hi = mid
    else lo = mid + 1
  }
  return lo
}</code></pre>
  <pre slot="python"><code class="language-python">import math

def min_eating_speed(piles: list[int], h: int) -> int:
    lo, hi = 1, max(piles)
    while lo < hi:
        mid = (lo + hi) // 2
        hours = sum(math.ceil(p / mid) for p in piles)
        if hours <= h:
            hi = mid
        else:
            lo = mid + 1
    return lo</code></pre>
</dsa-code-block>

<h2 id="matrix-search">Matrix Search</h2>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// 每行有序、行首 > 上行行尾 — LC #74
function searchMatrix(matrix: number[][], target: number): boolean {
  const m = matrix.length, n = matrix[0].length
  let lo = 0, hi = m * n - 1
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1)
    const val = matrix[Math.floor(mid / n)][mid % n]
    if (val === target) return true
    else if (val < target) lo = mid + 1
    else hi = mid - 1
  }
  return false
}</code></pre>
  <pre slot="python"><code class="language-python">def search_matrix(matrix: list[list[int]], target: int) -> bool:
    m, n = len(matrix), len(matrix[0])
    lo, hi = 0, m * n - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        val = matrix[mid // n][mid % n]
        if val == target: return True
        elif val < target: lo = mid + 1
        else: hi = mid - 1
    return False</code></pre>
</dsa-code-block>

<div class="callout callout-fe">
  <div class="callout-title">前端應用場景</div>
  <ul>
    <li><strong>Virtual Scroll 定位</strong>：已知各列高度的 prefix sum 陣列，用 Binary Search 找到 scrollTop 對應的起始 row index</li>
    <li><strong>Timeline / Slider</strong>：在有序的時間點陣列中 binary search 找到最近的 snap point</li>
    <li><strong>搜尋結果過濾</strong>：價格/日期範圍篩選，在排序後的資料上用 lower/upper bound 找邊界 index</li>
    <li><strong>Performance profiling</strong>：在時間序列資料中 binary search 找某 timestamp 的對應 frame</li>
  </ul>
</div>

<h3>精選 LeetCode 題目</h3>
${renderProblemList(getChapterProblemIds(13))}

<div class="chapter-footer">
  <a href="#ch12"><span class="footer-label">← 上一章</span><span class="footer-title">Sorting Algorithms</span></a>
  <a class="next" href="#ch14"><span class="footer-label">下一章 →</span><span class="footer-title">Two Pointers</span></a>
</div>
`
