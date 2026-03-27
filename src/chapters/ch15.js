import { getChapterProblemIds, renderProblemList } from '../leetcode/problem-catalog.js'

export const metadata = {
  id: 15, part: 5,
  slug: 'sliding-window',
  title: 'Sliding Window',
  tags: ['algo', 'fe'],
  sections: [
    { slug: 'fixed-window', title: 'Fixed-size Window' },
    { slug: 'dynamic-window', title: 'Dynamic Window' },
    { slug: 'shrinkable', title: 'Shrinkable Window Template' },
    { slug: 'monotonic-deque', title: 'Monotonic Deque' },
  ]
}

export const content = `
<div class="chapter-header">
  <div class="chapter-num">Chapter 15 · Part V</div>
  <h1>Sliding Window</h1>
  <p>Sliding Window 是 Two Pointers 的進化版，維護一個「視窗」在序列上滑動，用 <span class="complexity">O(n)</span> 解決子陣列 / 子字串相關問題。</p>
  <div class="chapter-tags">
    <span class="tag tag-algo">Algorithm</span>
    <span class="tag tag-fe">Frontend</span>
  </div>
</div>

<h2 id="fixed-window">Fixed-size Window</h2>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// 大小為 k 的子陣列最大和
function maxSumSubarray(nums: number[], k: number): number {
  let sum = nums.slice(0, k).reduce((a, b) => a + b, 0)
  let maxSum = sum
  for (let i = k; i < nums.length; i++) {
    sum += nums[i] - nums[i - k]  // 進一個，出一個
    maxSum = Math.max(maxSum, sum)
  }
  return maxSum
}</code></pre>
  <pre slot="python"><code class="language-python">def max_sum_subarray(nums: list[int], k: int) -> int:
    window_sum = sum(nums[:k])
    max_sum = window_sum
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)
    return max_sum</code></pre>
</dsa-code-block>

<h2 id="dynamic-window">Dynamic Window</h2>
<p>視窗大小動態調整：<code>right</code> 擴展加入元素，不滿足條件時 <code>left</code> 收縮。</p>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// 最長不重複子字串 — LC #3
function lengthOfLongestSubstring(s: string): number {
  const lastSeen = new Map<string, number>()
  let left = 0, maxLen = 0
  for (let right = 0; right < s.length; right++) {
    const ch = s[right]
    if (lastSeen.has(ch) && lastSeen.get(ch)! >= left) {
      left = lastSeen.get(ch)! + 1
    }
    lastSeen.set(ch, right)
    maxLen = Math.max(maxLen, right - left + 1)
  }
  return maxLen
}</code></pre>
  <pre slot="python"><code class="language-python">def length_of_longest_substring(s: str) -> int:
    last_seen = {}
    left = max_len = 0
    for right, ch in enumerate(s):
        if ch in last_seen and last_seen[ch] >= left:
            left = last_seen[ch] + 1
        last_seen[ch] = right
        max_len = max(max_len, right - left + 1)
    return max_len</code></pre>
</dsa-code-block>

<h2 id="shrinkable">Shrinkable Window Template</h2>
<p>通用模板：找滿足條件的最短 / 最長視窗。</p>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// 最小覆蓋子字串 — LC #76
function minWindow(s: string, t: string): string {
  const need = new Map<string, number>()
  for (const ch of t) need.set(ch, (need.get(ch) ?? 0) + 1)

  let have = 0, required = need.size
  let lo = 0, minLen = Infinity, minStart = 0
  const window = new Map<string, number>()

  for (let hi = 0; hi < s.length; hi++) {
    const ch = s[hi]
    window.set(ch, (window.get(ch) ?? 0) + 1)
    if (need.has(ch) && window.get(ch) === need.get(ch)) have++

    while (have === required) {
      if (hi - lo + 1 < minLen) { minLen = hi - lo + 1; minStart = lo }
      const leftCh = s[lo]
      window.set(leftCh, window.get(leftCh)! - 1)
      if (need.has(leftCh) && window.get(leftCh)! < need.get(leftCh)!) have--
      lo++
    }
  }
  return minLen === Infinity ? '' : s.slice(minStart, minStart + minLen)
}</code></pre>
  <pre slot="python"><code class="language-python">from collections import Counter, defaultdict

def min_window(s: str, t: str) -> str:
    need = Counter(t)
    window = defaultdict(int)
    have, required = 0, len(need)
    lo = 0
    min_len, min_start = float('inf'), 0

    for hi, ch in enumerate(s):
        window[ch] += 1
        if ch in need and window[ch] == need[ch]:
            have += 1
        while have == required:
            if hi - lo + 1 < min_len:
                min_len = hi - lo + 1
                min_start = lo
            left_ch = s[lo]
            window[left_ch] -= 1
            if left_ch in need and window[left_ch] < need[left_ch]:
                have -= 1
            lo += 1

    return '' if min_len == float('inf') else s[min_start:min_start + min_len]</code></pre>
</dsa-code-block>

<h2 id="monotonic-deque">Monotonic Deque</h2>
<p>結合 Deque 的 Sliding Window，可以在 <span class="complexity">O(1)</span> 時間內查詢視窗的最大/最小值。</p>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// Sliding Window Maximum — LC #239
function maxSlidingWindow(nums: number[], k: number): number[] {
  const deque: number[] = []  // 存 index，維持單調遞減
  const result: number[] = []
  for (let i = 0; i < nums.length; i++) {
    // 移除超出視窗的元素
    if (deque.length && deque[0] < i - k + 1) deque.shift()
    // 維持單調遞減
    while (deque.length && nums[deque[deque.length - 1]] < nums[i]) {
      deque.pop()
    }
    deque.push(i)
    if (i >= k - 1) result.push(nums[deque[0]])
  }
  return result
}</code></pre>
  <pre slot="python"><code class="language-python">from collections import deque

def max_sliding_window(nums: list[int], k: int) -> list[int]:
    dq = deque()  # 存 index，單調遞減
    result = []
    for i, num in enumerate(nums):
        if dq and dq[0] < i - k + 1:
            dq.popleft()
        while dq and nums[dq[-1]] < num:
            dq.pop()
        dq.append(i)
        if i >= k - 1:
            result.append(nums[dq[0]])
    return result</code></pre>
</dsa-code-block>

<div class="callout callout-fe">
  <div class="callout-title">前端應用場景</div>
  <ul>
    <li><strong>Rate limiting / Throttle / Debounce</strong>：固定時間窗口內計算事件次數</li>
    <li><strong>Virtualized List</strong>：計算當前視口（viewport）內的可見 item 範圍，本質是 fixed-size window</li>
    <li><strong>Moving Average</strong>：監控資料（FPS、latency）的滑動平均，fixed-size window sum</li>
    <li><strong>Input 搜尋防抖</strong>：sliding window 概念：只有視窗內最後一次輸入才觸發 API</li>
  </ul>
</div>

<h3>精選 LeetCode 題目</h3>
${renderProblemList(getChapterProblemIds(15))}

<div class="chapter-footer">
  <a href="#ch14"><span class="footer-label">← 上一章</span><span class="footer-title">Two Pointers</span></a>
  <a class="next" href="#ch16"><span class="footer-label">下一章 →</span><span class="footer-title">Recursion & Backtracking</span></a>
</div>
`
