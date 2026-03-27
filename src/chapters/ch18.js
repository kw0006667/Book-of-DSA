export const metadata = {
  id: 18, part: 6,
  slug: 'greedy',
  title: 'Greedy',
  tags: ['algo'],
  sections: [
    { slug: 'basics', title: 'Greedy 基礎' },
    { slug: 'vs-dp', title: 'Greedy vs DP' },
    { slug: 'interval-scheduling', title: 'Interval Scheduling' },
    { slug: 'correctness', title: '正確性證明' },
  ]
}

export const content = `
<div class="chapter-header">
  <div class="chapter-num">Chapter 18 · Part VI</div>
  <h1>Greedy</h1>
  <p>Greedy 演算法在每一步都選擇當前看起來最優的選擇，不回頭。它比 DP 更快，但只在特定問題上正確，需要證明「局部最優 → 全局最優」。</p>
  <div class="chapter-tags">
    <span class="tag tag-algo">Algorithm</span>
  </div>
</div>

<h2 id="basics">Greedy 基礎</h2>
<p>Greedy 成立需要：</p>
<ul>
  <li><strong>Greedy Choice Property</strong>：局部最優選擇能導向全局最優</li>
  <li><strong>Optimal Substructure</strong>：問題的最優解包含子問題的最優解</li>
</ul>

<h2 id="vs-dp">Greedy vs DP</h2>
<table>
  <thead><tr><th></th><th>Greedy</th><th>DP</th></tr></thead>
  <tbody>
    <tr><td>決策</td><td>每步做最優選擇，不回頭</td><td>嘗試所有可能，取最優</td></tr>
    <tr><td>時間</td><td>通常 <span class="complexity">O(n log n)</span> 或更快</td><td>通常 <span class="complexity">O(n²)</span> 或更高</td></tr>
    <tr><td>適用</td><td>特定問題（需證明）</td><td>更廣泛</td></tr>
    <tr><td>範例</td><td>Interval Scheduling、Huffman Coding</td><td>Coin Change、LCS</td></tr>
  </tbody>
</table>

<h2 id="interval-scheduling">Interval Scheduling</h2>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// 最多不重疊區間數 — LC #435（等同 Activity Selection）
// Greedy：按結束時間排序，貪心選擇結束最早的
function eraseOverlapIntervals(intervals: number[][]): number {
  intervals.sort((a, b) => a[1] - b[1])  // sort by end time
  let count = 0, prevEnd = -Infinity
  for (const [start, end] of intervals) {
    if (start >= prevEnd) {
      prevEnd = end  // 選這個區間
    } else {
      count++  // 移除這個重疊的
    }
  }
  return count
}

// 跳躍遊戲 — LC #55
function canJump(nums: number[]): boolean {
  let maxReach = 0
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false
    maxReach = Math.max(maxReach, i + nums[i])
  }
  return true
}

// 任務調度器 — LC #621
function leastInterval(tasks: string[], n: number): number {
  const freq = new Array(26).fill(0)
  for (const t of tasks) freq[t.charCodeAt(0) - 65]++
  freq.sort((a, b) => b - a)
  const maxFreq = freq[0]
  const maxCount = freq.filter(f => f === maxFreq).length
  return Math.max(tasks.length, (maxFreq - 1) * (n + 1) + maxCount)
}</code></pre>
  <pre slot="python"><code class="language-python">def erase_overlap_intervals(intervals: list[list[int]]) -> int:
    intervals.sort(key=lambda x: x[1])
    count, prev_end = 0, float('-inf')
    for start, end in intervals:
        if start >= prev_end:
            prev_end = end
        else:
            count += 1
    return count

def can_jump(nums: list[int]) -> bool:
    max_reach = 0
    for i, jump in enumerate(nums):
        if i > max_reach:
            return False
        max_reach = max(max_reach, i + jump)
    return True</code></pre>
</dsa-code-block>

<h2 id="correctness">正確性證明</h2>
<p>常見的證明方法：</p>
<ul>
  <li><strong>Exchange Argument</strong>：假設有更優解，證明可以「交換」成 greedy 選擇而不變差</li>
  <li><strong>Cut and Paste</strong>：假設最優解不採用 greedy 選擇，證明換成 greedy 後至少一樣好</li>
</ul>

<div class="callout callout-warning">
  <div class="callout-title">Greedy 常見錯誤</div>
  <p>Coin Change 問題：某些硬幣組合下 greedy 是錯的（如 coins = [1, 3, 4], target = 6，greedy 選 4+1+1=3枚，但最優是 3+3=2枚）。此類問題需要 DP。</p>
</div>

<h3>精選 LeetCode 題目</h3>
<ul class="problem-list">
  <li class="problem-item"><span class="problem-id">#455</span><span class="problem-name">Assign Cookies</span><span class="diff diff-easy">Easy</span></li>
  <li class="problem-item"><span class="problem-id">#55</span><span class="problem-name">Jump Game</span><span class="diff diff-medium">Medium</span></li>
  <li class="problem-item"><span class="problem-id">#435</span><span class="problem-name">Non-overlapping Intervals</span><span class="diff diff-medium">Medium</span></li>
  <li class="problem-item"><span class="problem-id">#134</span><span class="problem-name">Gas Station</span><span class="diff diff-medium">Medium</span></li>
  <li class="problem-item"><span class="problem-id">#621</span><span class="problem-name">Task Scheduler</span><span class="diff diff-medium">Medium</span></li>
  <li class="problem-item"><span class="problem-id">#45</span><span class="problem-name">Jump Game II</span><span class="diff diff-medium">Medium</span></li>
</ul>

<div class="chapter-footer">
  <a href="#ch17"><span class="footer-label">← 上一章</span><span class="footer-title">Dynamic Programming</span></a>
  <a class="next" href="#ch19"><span class="footer-label">下一章 →</span><span class="footer-title">Divide and Conquer</span></a>
</div>
`
