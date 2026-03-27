import { getChapterProblemIds, renderProblemList } from '../leetcode/problem-catalog.js'

export const metadata = {
  id: 17, part: 6,
  slug: 'dynamic-programming',
  title: 'Dynamic Programming',
  tags: ['algo'],
  sections: [
    { slug: 'dp-basics', title: 'DP 基礎概念' },
    { slug: 'memoization-vs-tabulation', title: 'Memoization vs Tabulation' },
    { slug: '1d-dp', title: '一維 DP' },
    { slug: '2d-dp', title: '二維 DP' },
    { slug: 'knapsack', title: 'Knapsack 變體' },
    { slug: 'lcs-lis', title: 'LCS / LIS' },
    { slug: 'interval-dp', title: 'Interval DP' },
    { slug: 'space-opt', title: 'Space 優化' },
    { slug: 'identification', title: '識別 DP 問題' },
  ]
}

export const content = `
<div class="chapter-header">
  <div class="chapter-num">Chapter 17 · Part VI</div>
  <h1>Dynamic Programming</h1>
  <p>Dynamic Programming（動態規劃）是解決「有重疊子問題、最優子結構」問題的方法論。DP 是面試中最難也最高分的題型，掌握它需要系統性地練習多種 pattern。</p>
  <div class="chapter-tags">
    <span class="tag tag-algo">Algorithm</span>
  </div>
</div>

<h2 id="dp-basics">DP 基礎概念</h2>
<p>DP 成立的兩個條件：</p>
<ol>
  <li><strong>最優子結構</strong>：問題的最優解包含子問題的最優解</li>
  <li><strong>重疊子問題</strong>：遞迴求解時同樣的子問題被計算多次</li>
</ol>
<p>DP 的本質是「帶記憶的搜尋」，或從底部往上建立狀態表。</p>

<h2 id="memoization-vs-tabulation">Memoization vs Tabulation</h2>
<table>
  <thead><tr><th></th><th>Memoization（Top-down）</th><th>Tabulation（Bottom-up）</th></tr></thead>
  <tbody>
    <tr><td>方向</td><td>遞迴 + 快取</td><td>迴圈建表</td></tr>
    <tr><td>程式碼</td><td>通常更直覺</td><td>更省空間（可壓縮）</td></tr>
    <tr><td>Stack</td><td>有遞迴 stack overhead</td><td>無</td></tr>
    <tr><td>適合</td><td>狀態稀疏時</td><td>狀態稠密、需要優化空間時</td></tr>
  </tbody>
</table>

<h2 id="1d-dp">一維 DP</h2>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// 爬樓梯 — LC #70
function climbStairs(n: number): number {
  if (n <= 2) return n
  const dp = new Array(n + 1).fill(0)
  dp[1] = 1; dp[2] = 2
  for (let i = 3; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2]
  return dp[n]
  // Space optimized: O(1)
}

// 最大子陣列和 (Kadane's Algorithm) — LC #53
function maxSubArray(nums: number[]): number {
  let curr = nums[0], best = nums[0]
  for (let i = 1; i < nums.length; i++) {
    curr = Math.max(nums[i], curr + nums[i])
    best = Math.max(best, curr)
  }
  return best
}

// 打家劫舍 — LC #198
function rob(nums: number[]): number {
  let prev2 = 0, prev1 = 0
  for (const n of nums) {
    const curr = Math.max(prev1, prev2 + n)
    prev2 = prev1
    prev1 = curr
  }
  return prev1
}</code></pre>
  <pre slot="python"><code class="language-python">def climb_stairs(n: int) -> int:
    if n <= 2: return n
    dp = [0] * (n + 1)
    dp[1], dp[2] = 1, 2
    for i in range(3, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]

def max_sub_array(nums: list[int]) -> int:
    curr = best = nums[0]
    for num in nums[1:]:
        curr = max(num, curr + num)
        best = max(best, curr)
    return best

def rob(nums: list[int]) -> int:
    prev2 = prev1 = 0
    for n in nums:
        prev2, prev1 = prev1, max(prev1, prev2 + n)
    return prev1</code></pre>
</dsa-code-block>

<h2 id="2d-dp">二維 DP</h2>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// 最小路徑和 — LC #64
function minPathSum(grid: number[][]): number {
  const m = grid.length, n = grid[0].length
  const dp = Array.from({ length: m }, () => new Array(n).fill(0))
  dp[0][0] = grid[0][0]
  for (let i = 1; i < m; i++) dp[i][0] = dp[i-1][0] + grid[i][0]
  for (let j = 1; j < n; j++) dp[0][j] = dp[0][j-1] + grid[0][j]
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = Math.min(dp[i-1][j], dp[i][j-1]) + grid[i][j]
    }
  }
  return dp[m-1][n-1]
}</code></pre>
  <pre slot="python"><code class="language-python">def min_path_sum(grid: list[list[int]]) -> int:
    m, n = len(grid), len(grid[0])
    dp = [[0] * n for _ in range(m)]
    dp[0][0] = grid[0][0]
    for i in range(1, m): dp[i][0] = dp[i-1][0] + grid[i][0]
    for j in range(1, n): dp[0][j] = dp[0][j-1] + grid[0][j]
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]
    return dp[m-1][n-1]</code></pre>
</dsa-code-block>

<h2 id="knapsack">Knapsack 變體</h2>
<p><strong>0/1 Knapsack</strong>：每件物品只能選一次；<strong>Unbounded Knapsack</strong>：可以無限次選取。</p>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// Coin Change (Unbounded) — LC #322
function coinChange(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity)
  dp[0] = 0
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) dp[i] = Math.min(dp[i], dp[i - coin] + 1)
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount]
}

// 0/1 Knapsack
function knapsack(weights: number[], values: number[], W: number): number {
  const n = weights.length
  const dp = new Array(W + 1).fill(0)
  for (let i = 0; i < n; i++) {
    // 倒序遍歷避免同一物品選多次
    for (let w = W; w >= weights[i]; w--) {
      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i])
    }
  }
  return dp[W]
}</code></pre>
  <pre slot="python"><code class="language-python">def coin_change(coins: list[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    return -1 if dp[amount] == float('inf') else dp[amount]</code></pre>
</dsa-code-block>

<h2 id="lcs-lis">LCS / LIS</h2>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// Longest Common Subsequence — LC #1143
function longestCommonSubsequence(text1: string, text2: string): number {
  const m = text1.length, n = text2.length
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i-1] === text2[j-1]) dp[i][j] = dp[i-1][j-1] + 1
      else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1])
    }
  }
  return dp[m][n]
}

// Longest Increasing Subsequence — LC #300
// O(n log n) solution
function lengthOfLIS(nums: number[]): number {
  const tails: number[] = []
  for (const n of nums) {
    let lo = 0, hi = tails.length
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (tails[mid] < n) lo = mid + 1
      else hi = mid
    }
    tails[lo] = n
  }
  return tails.length
}</code></pre>
  <pre slot="python"><code class="language-python">import bisect

def longest_common_subsequence(text1: str, text2: str) -> int:
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]

def length_of_lis(nums: list[int]) -> int:
    tails = []
    for n in nums:
        idx = bisect.bisect_left(tails, n)
        if idx == len(tails):
            tails.append(n)
        else:
            tails[idx] = n
    return len(tails)</code></pre>
</dsa-code-block>

<h2 id="interval-dp">Interval DP</h2>
<p>對區間 <code>[i, j]</code> 定義狀態，通常枚舉分割點 <code>k</code>。</p>
<ul>
  <li>Burst Balloons (LC #312)</li>
  <li>Strange Printer (LC #664)</li>
  <li>Matrix Chain Multiplication</li>
</ul>

<h2 id="space-opt">Space 優化</h2>
<p>當 <code>dp[i]</code> 只依賴 <code>dp[i-1]</code> 時，可將二維 DP 壓縮為一維（滾動陣列）：從 <span class="complexity">O(mn)</span> 降到 <span class="complexity">O(n)</span>。</p>

<h2 id="identification">識別 DP 問題</h2>
<div class="callout callout-tip">
  <div class="callout-title">DP 適用信號</div>
  <ul>
    <li>問「最大」、「最小」、「最長」、「方案數」</li>
    <li>不需要記錄具體路徑（只需最優值）</li>
    <li>暴力解是指數時間，且有大量重複計算</li>
    <li>問題可以分解為更小規模的同類問題</li>
  </ul>
</div>

<h3>精選 LeetCode 題目</h3>
${renderProblemList(getChapterProblemIds(17))}

<div class="chapter-footer">
  <a href="#ch16"><span class="footer-label">← 上一章</span><span class="footer-title">Recursion & Backtracking</span></a>
  <a class="next" href="#ch18"><span class="footer-label">下一章 →</span><span class="footer-title">Greedy</span></a>
</div>
`
