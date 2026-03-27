export const metadata = {
  id: 11, part: 3,
  slug: 'union-find',
  title: 'Union-Find (Disjoint Set Union)',
  tags: ['ds'],
  sections: [
    { slug: 'core-ops', title: 'Core Operations' },
    { slug: 'optimizations', title: 'Path Compression & Union by Rank' },
    { slug: 'implementations', title: '語言實作' },
    { slug: 'when-to-use', title: '使用時機' },
  ]
}

export const content = `
<div class="chapter-header">
  <div class="chapter-num">Chapter 11 · Part III</div>
  <h1>Union-Find (Disjoint Set Union)</h1>
  <p>Union-Find 是解決「動態連通性」問題的專用資料結構，能以近乎 <span class="complexity">O(1)</span> 均攤的代價合併集合與查詢連通性。</p>
  <div class="chapter-tags">
    <span class="tag tag-ds">Data Structure</span>
  </div>
</div>

<h2 id="core-ops">Core Operations</h2>
<ul>
  <li><code>find(x)</code>：找到 x 所在集合的代表元素（root）</li>
  <li><code>union(x, y)</code>：合併 x 和 y 所在的集合</li>
  <li><code>connected(x, y)</code>：判斷 x 和 y 是否在同一集合</li>
</ul>

<h2 id="optimizations">Path Compression & Union by Rank</h2>
<p>兩種優化合用，均攤複雜度為 <span class="complexity">O(α(n))</span>（逆 Ackermann 函數，實際上視為常數）：</p>
<ul>
  <li><strong>Path Compression</strong>：<code>find</code> 時將路徑上所有節點直接指向 root，壓平樹高</li>
  <li><strong>Union by Rank</strong>：將較矮的樹掛到較高的樹下，避免退化成鏈</li>
</ul>

<h2 id="implementations">語言實作</h2>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">class UnionFind {
  private parent: number[]
  private rank: number[]
  count: number  // 連通分量數

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i)
    this.rank = new Array(n).fill(0)
    this.count = n
  }

  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x])  // path compression
    }
    return this.parent[x]
  }

  union(x: number, y: number): boolean {
    const px = this.find(x), py = this.find(y)
    if (px === py) return false  // already connected
    // union by rank
    if (this.rank[px] < this.rank[py]) this.parent[px] = py
    else if (this.rank[px] > this.rank[py]) this.parent[py] = px
    else { this.parent[py] = px; this.rank[px]++ }
    this.count--
    return true
  }

  connected(x: number, y: number): boolean {
    return this.find(x) === this.find(y)
  }
}

// 範例：Number of Provinces (LC #547)
function findCircleNum(isConnected: number[][]): number {
  const n = isConnected.length
  const uf = new UnionFind(n)
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (isConnected[i][j]) uf.union(i, j)
    }
  }
  return uf.count
}</code></pre>
  <pre slot="python"><code class="language-python">class UnionFind:
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.count = n

    def find(self, x: int) -> int:
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x: int, y: int) -> bool:
        px, py = self.find(x), self.find(y)
        if px == py:
            return False
        if self.rank[px] < self.rank[py]:
            self.parent[px] = py
        elif self.rank[px] > self.rank[py]:
            self.parent[py] = px
        else:
            self.parent[py] = px
            self.rank[px] += 1
        self.count -= 1
        return True

    def connected(self, x: int, y: int) -> bool:
        return self.find(x) == self.find(y)</code></pre>
</dsa-code-block>

<h2 id="when-to-use">使用時機</h2>
<div class="callout callout-tip">
  <div class="callout-title">選擇 Union-Find 的信號</div>
  <ul>
    <li>問題涉及「動態合併集合」或「連通分量數量」</li>
    <li>題目有「不相交集合」、「朋友圈」、「省份數量」等關鍵字</li>
    <li>需要判斷「加入這條邊是否會形成環路」（Kruskal's MST）</li>
    <li>Grid 問題中動態地把 cell 加入連通分量</li>
  </ul>
</div>

<h3>精選 LeetCode 題目</h3>
<ul class="problem-list">
  <li class="problem-item"><span class="problem-id">#547</span><span class="problem-name">Number of Provinces</span><span class="diff diff-medium">Medium</span></li>
  <li class="problem-item"><span class="problem-id">#684</span><span class="problem-name">Redundant Connection</span><span class="diff diff-medium">Medium</span></li>
  <li class="problem-item"><span class="problem-id">#128</span><span class="problem-name">Longest Consecutive Sequence</span><span class="diff diff-medium">Medium</span></li>
  <li class="problem-item"><span class="problem-id">#305</span><span class="problem-name">Number of Islands II</span><span class="diff diff-hard">Hard</span></li>
</ul>

<div class="chapter-footer">
  <a href="#ch10"><span class="footer-label">← 上一章</span><span class="footer-title">Graph</span></a>
  <a class="next" href="#ch12"><span class="footer-label">下一章 →</span><span class="footer-title">Sorting Algorithms</span></a>
</div>
`
