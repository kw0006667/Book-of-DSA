export const metadata = {
  id: 16, part: 5,
  slug: 'recursion-backtracking',
  title: 'Recursion 與 Backtracking',
  tags: ['algo'],
  sections: [
    { slug: 'recursion-basics', title: 'Recursion 基礎' },
    { slug: 'vs-iteration', title: 'Recursion vs Iteration' },
    { slug: 'backtracking-framework', title: 'Backtracking 框架' },
    { slug: 'permutation-combination', title: 'Permutation / Combination' },
    { slug: 'pruning', title: 'Pruning 策略' },
  ]
}

export const content = `
<div class="chapter-header">
  <div class="chapter-num">Chapter 16 · Part V</div>
  <h1>Recursion 與 Backtracking</h1>
  <p>Backtracking 是一種系統化地列舉所有可能解的演算法，透過剪枝（Pruning）大幅減少搜尋空間。本質是在決策樹上的 DFS。</p>
  <div class="chapter-tags">
    <span class="tag tag-algo">Algorithm</span>
  </div>
</div>

<h2 id="recursion-basics">Recursion 基礎</h2>
<p>遞迴需要兩個要素：<strong>Base case</strong>（終止條件）和 <strong>Recursive case</strong>（縮小問題規模）。</p>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// Fibonacci — 分析遞迴的複雜度
// naive: O(2^n) time, O(n) space
function fib(n: number): number {
  if (n <= 1) return n
  return fib(n - 1) + fib(n - 2)
}

// with memoization: O(n) time, O(n) space
function fibMemo(n: number, memo = new Map<number, number>()): number {
  if (n <= 1) return n
  if (memo.has(n)) return memo.get(n)!
  const result = fibMemo(n - 1, memo) + fibMemo(n - 2, memo)
  memo.set(n, result)
  return result
}</code></pre>
  <pre slot="python"><code class="language-python">from functools import lru_cache

# naive: O(2^n)
def fib(n: int) -> int:
    if n <= 1: return n
    return fib(n - 1) + fib(n - 2)

# with @lru_cache: O(n) time, O(n) space
@lru_cache(maxsize=None)
def fib_memo(n: int) -> int:
    if n <= 1: return n
    return fib_memo(n - 1) + fib_memo(n - 2)</code></pre>
</dsa-code-block>

<h2 id="vs-iteration">Recursion vs Iteration</h2>
<table>
  <thead><tr><th></th><th>Recursion</th><th>Iteration</th></tr></thead>
  <tbody>
    <tr><td>可讀性</td><td>通常更直覺</td><td>需要顯式 stack</td></tr>
    <tr><td>Stack Overflow 風險</td><td>深度過大時</td><td>無</td></tr>
    <tr><td>尾遞迴優化</td><td>Python 不支援 TCO；JS 規範支援但引擎未普及</td><td>—</td></tr>
    <tr><td>效能</td><td>函式呼叫有 overhead</td><td>較快</td></tr>
  </tbody>
</table>

<h2 id="backtracking-framework">Backtracking 框架</h2>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// 通用 Backtracking 框架
function backtrack(
  path: number[],
  choices: number[],
  result: number[][]
): void {
  // 終止條件
  if (/* 滿足條件 */ path.length === choices.length) {
    result.push([...path])
    return
  }

  for (const choice of choices) {
    // 剪枝
    if (/* 無效選擇 */ false) continue

    // 做選擇
    path.push(choice)

    // 遞迴
    backtrack(path, choices, result)

    // 撤銷選擇（回溯）
    path.pop()
  }
}</code></pre>
  <pre slot="python"><code class="language-python">def backtrack(path: list, choices: list, result: list) -> None:
    # 終止條件
    if len(path) == len(choices):
        result.append(path[:])  # 注意要複製！
        return

    for choice in choices:
        # 剪枝
        if False:  # 無效選擇
            continue

        # 做選擇
        path.append(choice)

        # 遞迴
        backtrack(path, choices, result)

        # 撤銷選擇
        path.pop()</code></pre>
</dsa-code-block>

<h2 id="permutation-combination">Permutation / Combination</h2>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// 全排列 — LC #46
function permute(nums: number[]): number[][] {
  const result: number[][] = []
  const used = new Array(nums.length).fill(false)

  function bt(path: number[]): void {
    if (path.length === nums.length) { result.push([...path]); return }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue
      used[i] = true
      path.push(nums[i])
      bt(path)
      path.pop()
      used[i] = false
    }
  }
  bt([])
  return result
}

// 組合總和 — LC #39
function combinationSum(candidates: number[], target: number): number[][] {
  const result: number[][] = []

  function bt(start: number, path: number[], remain: number): void {
    if (remain === 0) { result.push([...path]); return }
    for (let i = start; i < candidates.length; i++) {
      if (candidates[i] > remain) break  // sorted + pruning
      path.push(candidates[i])
      bt(i, path, remain - candidates[i])  // i: 允許重複使用
      path.pop()
    }
  }
  candidates.sort((a, b) => a - b)
  bt(0, [], target)
  return result
}</code></pre>
  <pre slot="python"><code class="language-python">def permute(nums: list[int]) -> list[list[int]]:
    result = []
    used = [False] * len(nums)

    def bt(path: list) -> None:
        if len(path) == len(nums):
            result.append(path[:])
            return
        for i, num in enumerate(nums):
            if used[i]: continue
            used[i] = True
            path.append(num)
            bt(path)
            path.pop()
            used[i] = False

    bt([])
    return result

def combination_sum(candidates: list[int], target: int) -> list[list[int]]:
    candidates.sort()
    result = []

    def bt(start: int, path: list, remain: int) -> None:
        if remain == 0:
            result.append(path[:])
            return
        for i in range(start, len(candidates)):
            if candidates[i] > remain: break
            path.append(candidates[i])
            bt(i, path, remain - candidates[i])
            path.pop()

    bt(0, [], target)
    return result</code></pre>
</dsa-code-block>

<h2 id="pruning">Pruning 策略</h2>
<ul>
  <li><strong>排序後提前退出</strong>：剩餘元素都比 remain 大時直接 break</li>
  <li><strong>跳過重複</strong>：<code>nums[i] === nums[i-1] && !used[i-1]</code> 跳過同層重複</li>
  <li><strong>can-win 判斷</strong>：提前判斷當前狀態是否有可能達到目標</li>
</ul>

<h3>精選 LeetCode 題目</h3>
<ul class="problem-list">
  <li class="problem-item"><span class="problem-id">#46</span><span class="problem-name">Permutations</span><span class="diff diff-medium">Medium</span></li>
  <li class="problem-item"><span class="problem-id">#78</span><span class="problem-name">Subsets</span><span class="diff diff-medium">Medium</span></li>
  <li class="problem-item"><span class="problem-id">#39</span><span class="problem-name">Combination Sum</span><span class="diff diff-medium">Medium</span></li>
  <li class="problem-item"><span class="problem-id">#40</span><span class="problem-name">Combination Sum II</span><span class="diff diff-medium">Medium</span></li>
  <li class="problem-item"><span class="problem-id">#51</span><span class="problem-name">N-Queens</span><span class="diff diff-hard">Hard</span></li>
  <li class="problem-item"><span class="problem-id">#131</span><span class="problem-name">Palindrome Partitioning</span><span class="diff diff-medium">Medium</span></li>
  <li class="problem-item"><span class="problem-id">#79</span><span class="problem-name">Word Search</span><span class="diff diff-medium">Medium</span></li>
</ul>

<div class="chapter-footer">
  <a href="#ch15"><span class="footer-label">← 上一章</span><span class="footer-title">Sliding Window</span></a>
  <a class="next" href="#ch17"><span class="footer-label">下一章 →</span><span class="footer-title">Dynamic Programming</span></a>
</div>
`
