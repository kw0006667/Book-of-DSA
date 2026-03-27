import { getChapterProblemIds, renderProblemList } from '../leetcode/problem-catalog.js'

export const metadata = {
  id: 6, part: 2,
  slug: 'hash-table',
  title: 'Hash Table',
  tags: ['ds', 'fe'],
  sections: [
    { slug: 'hash-function', title: 'Hash Function 設計' },
    { slug: 'collision', title: 'Collision 處理' },
    { slug: 'load-factor', title: 'Load Factor' },
    { slug: 'language-diff', title: '語言差異' },
    { slug: 'advanced', title: '進階技巧' },
  ]
}

export const content = `
<div class="chapter-header">
  <div class="chapter-num">Chapter 06 · Part II</div>
  <h1>Hash Table</h1>
  <p>Hash Table 是最常用的資料結構之一，提供均攤 <span class="complexity">O(1)</span> 的 insert、delete、lookup。理解其底層原理能幫助你在面試中正確分析複雜度，以及避免常見陷阱。</p>
  <div class="chapter-tags">
    <span class="tag tag-ds">Data Structure</span>
    <span class="tag tag-fe">Frontend</span>
  </div>
</div>

<h2 id="hash-function">Hash Function 設計</h2>
<p>Hash Function 將任意 key 映射到有限範圍的 index。一個好的 hash function 應具備：</p>
<ul>
  <li><strong>Deterministic</strong>：相同 key 永遠產生相同 hash</li>
  <li><strong>Uniform distribution</strong>：hash 值均勻分佈，減少碰撞</li>
  <li><strong>Fast to compute</strong>：理想情況 <span class="complexity">O(1)</span></li>
</ul>
<p>常見字串 hash：將每個字元的 ASCII 值加權求和再取模。</p>

<h2 id="collision">Collision 處理</h2>
<table>
  <thead><tr><th>方法</th><th>原理</th><th>優點</th><th>缺點</th></tr></thead>
  <tbody>
    <tr><td>Chaining（鏈結法）</td><td>同 bucket 用 Linked List 串接</td><td>實作簡單，load factor 可 > 1</td><td>記憶體碎片化</td></tr>
    <tr><td>Open Addressing（開放定址）</td><td>探測下一個空位</td><td>Cache friendly（連續記憶體）</td><td>刪除複雜，load factor 需 < 1</td></tr>
  </tbody>
</table>

<h2 id="load-factor">Load Factor</h2>
<p><code>load factor = n / capacity</code>，其中 n 是已儲存的元素數。</p>
<ul>
  <li>當 load factor 超過閾值（通常 0.75），觸發 <strong>rehash</strong>：建新陣列（通常 2x）並重新 hash 所有元素 → <span class="complexity">O(n)</span></li>
  <li>均攤後每次操作仍是 <span class="complexity">O(1)</span></li>
</ul>

<h2 id="language-diff">語言差異</h2>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// Map — 任意 key 類型，有序（插入順序）
const map = new Map<string, number>()
map.set('a', 1)
map.set('b', 2)
for (const [k, v] of map) console.log(k, v)  // 按插入順序

// Set
const seen = new Set<number>()
seen.add(1); seen.has(1)  // true

// Object as Map — key 只能是 string / symbol
const freq: Record<string, number> = {}
for (const ch of 'hello') {
  freq[ch] = (freq[ch] ?? 0) + 1
}

// 常用 pattern：Two Sum
function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>()
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i]
    if (map.has(complement)) return [map.get(complement)!, i]
    map.set(nums[i], i)
  }
  return []
}</code></pre>
  <pre slot="python"><code class="language-python">from collections import defaultdict, Counter

# dict — 有序（3.7+），任意 hashable key
freq = {}
for ch in 'hello':
    freq[ch] = freq.get(ch, 0) + 1

# defaultdict — 自動初始化 default value
graph = defaultdict(list)
graph['a'].append('b')

# Counter — 頻率計數的語法糖
counter = Counter('hello')
counter.most_common(2)   # [('l', 2), ('h', 1)]

# set
seen = set()
seen.add(1)
1 in seen  # True

# Two Sum
def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []</code></pre>
</dsa-code-block>

<h2 id="advanced">進階技巧</h2>
<h3>Anagram 分組</h3>
<p>排序字元作為 key，或計算 character frequency tuple 作為 key。</p>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// 分組 Anagram — LC #49
function groupAnagrams(strs: string[]): string[][] {
  const map = new Map<string, string[]>()
  for (const s of strs) {
    const key = s.split('').sort().join('')
    const group = map.get(key) ?? []
    group.push(s)
    map.set(key, group)
  }
  return [...map.values()]
}

// Subarray Sum Equals K — prefix sum + hash map — LC #560
function subarraySum(nums: number[], k: number): number {
  const prefixCount = new Map<number, number>([[0, 1]])
  let sum = 0, count = 0
  for (const num of nums) {
    sum += num
    count += prefixCount.get(sum - k) ?? 0
    prefixCount.set(sum, (prefixCount.get(sum) ?? 0) + 1)
  }
  return count
}</code></pre>
  <pre slot="python"><code class="language-python">from collections import defaultdict

def group_anagrams(strs: list[str]) -> list[list[str]]:
    groups = defaultdict(list)
    for s in strs:
        key = tuple(sorted(s))
        groups[key].append(s)
    return list(groups.values())

def subarray_sum(nums: list[int], k: int) -> int:
    prefix_count = defaultdict(int, {0: 1})
    total = count = 0
    for num in nums:
        total += num
        count += prefix_count[total - k]
        prefix_count[total] += 1
    return count</code></pre>
</dsa-code-block>

<div class="callout callout-fe">
  <div class="callout-title">前端應用場景</div>
  <ul>
    <li><strong>React keys</strong>：React 用 Map/Object 記錄 key → Fiber 節點的對應，實現 <span class="complexity">O(1)</span> 的 DOM diff</li>
    <li><strong>URL 參數解析</strong>：<code>URLSearchParams</code> 底層就是 HashMap</li>
    <li><strong>Memoization</strong>：<code>useMemo</code>、<code>useCallback</code> 用 Map 快取計算結果</li>
    <li><strong>State normalization</strong>：Redux 將嵌套資料扁平化為 <code>entities: { byId: {}, allIds: [] }</code> 格式，hash lookup <span class="complexity">O(1)</span></li>
    <li><strong>Feature flags</strong>：後端回傳 feature set，前端用 <code>Set.has()</code> <span class="complexity">O(1)</span> 判斷功能開關</li>
  </ul>
</div>

<h3>精選 LeetCode 題目</h3>
${renderProblemList(getChapterProblemIds(6))}

<div class="chapter-footer">
  <a href="#ch5">
    <span class="footer-label">← 上一章</span>
    <span class="footer-title">Stack 與 Queue</span>
  </a>
  <a class="next" href="#ch7">
    <span class="footer-label">下一章 →</span>
    <span class="footer-title">Binary Tree 與 BST</span>
  </a>
</div>
`
