import { getChapterProblemIds, renderProblemList } from '../leetcode/problem-catalog.js'

export const metadata = {
  id: 8, part: 3,
  slug: 'heap-priority-queue',
  title: 'Heap 與 Priority Queue',
  tags: ['ds', 'fe'],
  sections: [
    { slug: 'heap-properties', title: 'Heap 性質' },
    { slug: 'min-max-heap', title: 'Min-Heap / Max-Heap' },
    { slug: 'heapify', title: 'Heapify 操作' },
    { slug: 'python-heapq', title: 'Python heapq' },
    { slug: 'ts-implementation', title: 'TypeScript 實作' },
    { slug: 'top-k', title: 'Top-K Pattern' },
  ]
}

export const content = `
<div class="chapter-header">
  <div class="chapter-num">Chapter 08 · Part III</div>
  <h1>Heap 與 Priority Queue</h1>
  <p>Heap 是一種特殊的 Complete Binary Tree，讓你隨時以 <span class="complexity">O(1)</span> 取得最小值（或最大值），insert/delete 為 <span class="complexity">O(log n)</span>。Top-K、Merge K sorted lists 等問題的首選工具。</p>
  <div class="chapter-tags">
    <span class="tag tag-ds">Data Structure</span>
    <span class="tag tag-fe">Frontend</span>
  </div>
</div>

<h2 id="heap-properties">Heap 性質</h2>
<p>Heap 滿足 <strong>Heap Property</strong>：</p>
<ul>
  <li><strong>Min-Heap</strong>：父節點 ≤ 子節點，根節點是最小值</li>
  <li><strong>Max-Heap</strong>：父節點 ≥ 子節點，根節點是最大值</li>
</ul>
<p>底層用 Array 表示（完全二元樹可以緊湊存放）：index <code>i</code> 的子節點在 <code>2i+1</code>、<code>2i+2</code>，父節點在 <code>⌊(i-1)/2⌋</code>。</p>

<h2 id="min-max-heap">Min-Heap / Max-Heap 複雜度</h2>
<table>
  <thead><tr><th>操作</th><th>Time</th></tr></thead>
  <tbody>
    <tr><td>peek (get min/max)</td><td><span class="complexity">O(1)</span></td></tr>
    <tr><td>insert (push)</td><td><span class="complexity">O(log n)</span></td></tr>
    <tr><td>extract min/max (pop)</td><td><span class="complexity">O(log n)</span></td></tr>
    <tr><td>build heap from array</td><td><span class="complexity">O(n)</span></td></tr>
    <tr><td>search arbitrary</td><td><span class="complexity">O(n)</span></td></tr>
  </tbody>
</table>

<h2 id="heapify">Heapify 操作</h2>
<p><code>sift up</code>（向上調整）用於 insert；<code>sift down</code>（向下調整）用於 delete。</p>
<p>Build heap 時，從最後一個非葉節點開始往前 sift down，均攤複雜度為 <span class="complexity">O(n)</span>（比一個個 insert 的 <span class="complexity">O(n log n)</span> 更快）。</p>

<h2 id="python-heapq">Python heapq</h2>

<dsa-code-block>
  <pre slot="python"><code class="language-python">import heapq

# Python 只有 min-heap
heap = []
heapq.heappush(heap, 5)
heapq.heappush(heap, 2)
heapq.heappush(heap, 8)
heap[0]              # 2 — peek O(1)
heapq.heappop(heap)  # 2 — O(log n)

# Max-Heap：存負值
max_heap = []
heapq.heappush(max_heap, -5)
heapq.heappush(max_heap, -2)
-heapq.heappop(max_heap)  # 5

# heapify — O(n) build from list
nums = [3, 1, 4, 1, 5, 9]
heapq.heapify(nums)

# 儲存 tuple：(priority, value)
tasks = []
heapq.heappush(tasks, (1, 'low priority'))
heapq.heappush(tasks, (0, 'high priority'))

# nlargest / nsmallest — 適合 Top-K
heapq.nlargest(3, nums)
heapq.nsmallest(3, nums)</code></pre>
  <pre slot="typescript"><code class="language-typescript">// TypeScript: 需自行實作 MinHeap
class MinHeap {
  private data: number[] = [];

  push(val: number): void {
    this.data.push(val);
    this._siftUp(this.data.length - 1);
  }

  pop(): number | undefined {
    if (!this.data.length) return undefined;
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length) {
      this.data[0] = last;
      this._siftDown(0);
    }
    return top;
  }

  peek(): number | undefined {
    return this.data[0];
  }
  get size() {
    return this.data.length;
  }

  private _siftUp(i: number): void {
    while (i &gt; 0) {
      const parent = (i - 1) &gt;&gt; 1;
      if (this.data[parent] &lt;= this.data[i]) break;
      [this.data[parent], this.data[i]] = [this.data[i], this.data[parent]];
      i = parent;
    }
  }

  private _siftDown(i: number): void {
    const n = this.data.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1,
        r = 2 * i + 2;
      if (l &lt; n &amp;&amp; this.data[l] &lt; this.data[smallest]) smallest = l;
      if (r &lt; n &amp;&amp; this.data[r] &lt; this.data[smallest]) smallest = r;
      if (smallest === i) break;
      [this.data[smallest], this.data[i]] = [this.data[i], this.data[smallest]];
      i = smallest;
    }
  }
}</code></pre>
</dsa-code-block>

<h2 id="ts-implementation">TypeScript 泛型 MinHeap</h2>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// 泛型 Heap — 支援自訂 comparator
class Heap&lt;T&gt; {
  private data: T[] = [];
  constructor(private compare: (a: T, b: T) =&gt; number) {}

  push(val: T) {
    this.data.push(val);
    this._up(this.data.length - 1);
  }

  pop(): T | undefined {
    if (!this.size) return undefined;
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.size) {
      this.data[0] = last;
      this._down(0);
    }
    return top;
  }

  peek() {
    return this.data[0];
  }
  get size() {
    return this.data.length;
  }

  private _up(i: number) {
    while (i &gt; 0) {
      const p = (i - 1) &gt;&gt; 1;
      if (this.compare(this.data[p], this.data[i]) &lt;= 0) break;
      [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
      i = p;
    }
  }

  private _down(i: number) {
    const n = this.size;
    while (true) {
      let best = i;
      const l = 2 * i + 1,
        r = 2 * i + 2;
      if (l &lt; n &amp;&amp; this.compare(this.data[l], this.data[best]) &lt; 0) best = l;
      if (r &lt; n &amp;&amp; this.compare(this.data[r], this.data[best]) &lt; 0) best = r;
      if (best === i) break;
      [this.data[best], this.data[i]] = [this.data[i], this.data[best]];
      i = best;
    }
  }
}

// Usage
const minH = new Heap&lt;number&gt;((a, b) =&gt; a - b);
const maxH = new Heap&lt;number&gt;((a, b) =&gt; b - a);
const taskH = new Heap&lt;[number, string]&gt;(([a], [b]) =&gt; a - b);</code></pre>
  <pre slot="python"><code class="language-python">import heapq
from dataclasses import dataclass, field
from typing import Any

# Python 泛型：用 dataclass + field(compare=False)
@dataclass(order=True)
class PrioritizedItem:
    priority: int
    item: Any = field(compare=False)

heap = []
heapq.heappush(heap, PrioritizedItem(1, 'task_a'))
heapq.heappush(heap, PrioritizedItem(0, 'task_b'))
top = heapq.heappop(heap)  # PrioritizedItem(priority=0, item='task_b')</code></pre>
</dsa-code-block>

<h2 id="top-k">Top-K Pattern</h2>
<p>找第 K 大 / 前 K 個最大：維護一個大小為 K 的 <strong>Min-Heap</strong>，超過 K 個時 pop 最小值，最後堆中留下的就是 Top-K 大。</p>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// K 個最大元素 — LC #215 (Kth Largest)
function findKthLargest(nums: number[], k: number): number {
  const heap = new Heap&lt;number&gt;((a, b) =&gt; a - b); // min-heap
  for (const n of nums) {
    heap.push(n);
    if (heap.size &gt; k) heap.pop();
  }
  return heap.peek()!;
}</code></pre>
  <pre slot="python"><code class="language-python">def find_kth_largest(nums: list[int], k: int) -> int:
    heap = []
    for n in nums:
        heapq.heappush(heap, n)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap[0]</code></pre>
</dsa-code-block>

<h3>精選 LeetCode 題目</h3>
${renderProblemList(getChapterProblemIds(8))}

<div class="chapter-footer">
  <a href="#ch7"><span class="footer-label">← 上一章</span><span class="footer-title">Binary Tree 與 BST</span></a>
  <a class="next" href="#ch9"><span class="footer-label">下一章 →</span><span class="footer-title">Trie</span></a>
</div>
`
