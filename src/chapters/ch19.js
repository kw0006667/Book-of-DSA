export const metadata = {
  id: 19, part: 6,
  slug: 'divide-conquer',
  title: 'Divide and Conquer',
  tags: ['algo'],
  sections: [
    { slug: 'three-steps', title: '三步驟框架' },
    { slug: 'master-theorem', title: 'Master Theorem' },
    { slug: 'quick-select', title: 'Quick Select' },
    { slug: 'merge-sort-rel', title: 'Merge Sort 關聯' },
  ]
}

export const content = `
<div class="chapter-header">
  <div class="chapter-num">Chapter 19 · Part VI</div>
  <h1>Divide and Conquer</h1>
  <p>分治法：將問題分解為同類的子問題，遞迴求解後合併結果。Merge Sort、Quick Sort、Binary Search 都是分治法的應用。</p>
  <div class="chapter-tags">
    <span class="tag tag-algo">Algorithm</span>
  </div>
</div>

<h2 id="three-steps">三步驟框架</h2>
<ol>
  <li><strong>Divide</strong>：將問題分成較小的子問題</li>
  <li><strong>Conquer</strong>：遞迴解決子問題（base case 直接求解）</li>
  <li><strong>Combine</strong>：合併子問題的解</li>
</ol>

<h2 id="master-theorem">Master Theorem</h2>
<p>分析遞迴式 <code>T(n) = aT(n/b) + f(n)</code> 的複雜度：</p>
<table>
  <thead><tr><th>條件</th><th>結果</th><th>範例</th></tr></thead>
  <tbody>
    <tr><td><code>f(n) = O(n^(log_b a - ε))</code></td><td><span class="complexity">O(n^log_b(a))</span></td><td>Binary Search: O(log n)</td></tr>
    <tr><td><code>f(n) = Θ(n^(log_b a))</code></td><td><span class="complexity">O(n^log_b(a) · log n)</span></td><td>Merge Sort: O(n log n)</td></tr>
    <tr><td><code>f(n) = Ω(n^(log_b a + ε))</code></td><td><span class="complexity">O(f(n))</span></td><td>—</td></tr>
  </tbody>
</table>

<h2 id="quick-select">Quick Select（第 K 小元素）</h2>
<p>利用 Quick Sort 的 partition，但只遞迴一側，平均 <span class="complexity">O(n)</span>。</p>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// 第 K 大的元素 — LC #215
function findKthLargest(nums: number[], k: number): number {
  const target = nums.length - k  // k-th largest = (n-k)-th smallest

  function quickSelect(lo: number, hi: number): number {
    const pivotIdx = partition(nums, lo, hi)
    if (pivotIdx === target) return nums[pivotIdx]
    return pivotIdx < target
      ? quickSelect(pivotIdx + 1, hi)
      : quickSelect(lo, pivotIdx - 1)
  }

  function partition(arr: number[], lo: number, hi: number): number {
    const randIdx = lo + Math.floor(Math.random() * (hi - lo + 1))
    ;[arr[randIdx], arr[hi]] = [arr[hi], arr[randIdx]]
    const pivot = arr[hi]
    let i = lo - 1
    for (let j = lo; j < hi; j++) {
      if (arr[j] <= pivot) { i++; [arr[i], arr[j]] = [arr[j], arr[i]] }
    }
    ;[arr[i+1], arr[hi]] = [arr[hi], arr[i+1]]
    return i + 1
  }

  return quickSelect(0, nums.length - 1)
}</code></pre>
  <pre slot="python"><code class="language-python">import random

def find_kth_largest(nums: list[int], k: int) -> int:
    target = len(nums) - k

    def quick_select(lo: int, hi: int) -> int:
        pivot_idx = partition(lo, hi)
        if pivot_idx == target:
            return nums[pivot_idx]
        elif pivot_idx < target:
            return quick_select(pivot_idx + 1, hi)
        else:
            return quick_select(lo, pivot_idx - 1)

    def partition(lo: int, hi: int) -> int:
        rand_idx = random.randint(lo, hi)
        nums[rand_idx], nums[hi] = nums[hi], nums[rand_idx]
        pivot = nums[hi]
        i = lo - 1
        for j in range(lo, hi):
            if nums[j] <= pivot:
                i += 1
                nums[i], nums[j] = nums[j], nums[i]
        nums[i+1], nums[hi] = nums[hi], nums[i+1]
        return i + 1

    return quick_select(0, len(nums) - 1)</code></pre>
</dsa-code-block>

<h2 id="merge-sort-rel">應用：計算逆序對</h2>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// 計算陣列中的逆序對數（merge sort 過程中統計）
function countInversions(nums: number[]): number {
  let count = 0

  function mergeSort(arr: number[]): number[] {
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
      if (left[i] <= right[j]) {
        result.push(left[i++])
      } else {
        count += left.length - i  // 所有剩餘的 left 元素都比 right[j] 大
        result.push(right[j++])
      }
    }
    return result.concat(left.slice(i), right.slice(j))
  }

  mergeSort(nums)
  return count
}</code></pre>
  <pre slot="python"><code class="language-python">def count_inversions(nums: list[int]) -> int:
    count = 0

    def merge_sort(arr: list[int]) -> list[int]:
        nonlocal count
        if len(arr) <= 1: return arr
        mid = len(arr) // 2
        left = merge_sort(arr[:mid])
        right = merge_sort(arr[mid:])
        return merge(left, right)

    def merge(left: list[int], right: list[int]) -> list[int]:
        nonlocal count
        result, i, j = [], 0, 0
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                result.append(left[i]); i += 1
            else:
                count += len(left) - i
                result.append(right[j]); j += 1
        return result + left[i:] + right[j:]

    merge_sort(nums)
    return count</code></pre>
</dsa-code-block>

<h3>精選 LeetCode 題目</h3>
<ul class="problem-list">
  <li class="problem-item"><span class="problem-id">#215</span><span class="problem-name">Kth Largest Element in an Array</span><span class="diff diff-medium">Medium</span></li>
  <li class="problem-item"><span class="problem-id">#23</span><span class="problem-name">Merge k Sorted Lists</span><span class="diff diff-hard">Hard</span></li>
  <li class="problem-item"><span class="problem-id">#4</span><span class="problem-name">Median of Two Sorted Arrays</span><span class="diff diff-hard">Hard</span></li>
  <li class="problem-item"><span class="problem-id">#315</span><span class="problem-name">Count of Smaller Numbers After Self</span><span class="diff diff-hard">Hard</span></li>
</ul>

<div class="chapter-footer">
  <a href="#ch18"><span class="footer-label">← 上一章</span><span class="footer-title">Greedy</span></a>
  <a class="next" href="#ch20"><span class="footer-label">下一章 →</span><span class="footer-title">Graph 進階演算法</span></a>
</div>
`
