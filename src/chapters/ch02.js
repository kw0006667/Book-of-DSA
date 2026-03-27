export const metadata = {
  id: 2, part: 1,
  slug: 'language-toolbox',
  title: '語言工具箱 — Python 與 TypeScript 內建資料結構',
  tags: ['ds'],
  sections: [
    { slug: 'python-builtins', title: 'Python 內建結構' },
    { slug: 'ts-builtins', title: 'TypeScript / JS 內建結構' },
    { slug: 'complexity-comparison', title: '複雜度對照表' },
    { slug: 'decision-tree', title: '選擇決策樹' },
  ]
}

export const content = `
<div class="chapter-header">
  <div class="chapter-num">Chapter 02 · Part I</div>
  <h1>語言工具箱 — Python 與 TypeScript 內建資料結構</h1>
  <p>在動手實作資料結構之前，先了解語言本身提供了哪些工具，以及它們的複雜度特性，能讓你在解題時做出更好的選擇。</p>
  <div class="chapter-tags">
    <span class="tag tag-ds">Data Structure</span>
  </div>
</div>

<h2 id="python-builtins">Python 內建結構</h2>

<h3>list — Dynamic Array</h3>
<p>Python 的 <code>list</code> 是動態陣列，底層是連續記憶體。大部分操作都很直覺，但頭部插入是 <span class="complexity">O(n)</span>。</p>

<dsa-code-block>
  <pre slot="python"><code class="language-python">from collections import deque, defaultdict, Counter
import heapq

# list — Dynamic Array
lst = [1, 2, 3]
lst.append(4)        # O(1) amortized
lst.pop()            # O(1)
lst.insert(0, 0)     # O(n) — 避免在頭部插入
lst[0]               # O(1) random access

# dict — Hash Map
d = {}
d['key'] = 'value'   # O(1)
'key' in d           # O(1)
del d['key']         # O(1)

# set — Hash Set
s = {1, 2, 3}
s.add(4)             # O(1)
3 in s               # O(1)
s.remove(3)          # O(1)

# deque — Double-ended Queue
dq = deque([1, 2, 3])
dq.appendleft(0)     # O(1)
dq.popleft()         # O(1)
dq.append(4)         # O(1)

# heapq — Min-Heap
heap = []
heapq.heappush(heap, 3)   # O(log n)
heapq.heappop(heap)        # O(log n)
heap[0]                    # O(1) peek

# Counter
freq = Counter([1, 2, 2, 3])  # {2:2, 1:1, 3:1}
freq.most_common(2)

# defaultdict
graph = defaultdict(list)
graph['a'].append('b')</code></pre>
  <pre slot="typescript"><code class="language-typescript">// TypeScript equivalent reference (see next section)</code></pre>
</dsa-code-block>

<h2 id="ts-builtins">TypeScript / JS 內建結構</h2>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// Array — Dynamic Array
const arr: number[] = [1, 2, 3];
arr.push(4); // O(1) amortized
arr.pop(); // O(1)
arr.unshift(0); // O(n) — 避免
arr[0]; // O(1)

// Map — Hash Map (有序，保留插入順序)
const map = new Map&lt;string, number&gt;();
map.set('a', 1); // O(1)
map.get('a'); // O(1)
map.has('a'); // O(1)
map.delete('a'); // O(1)
map.size; // O(1)

// Set — Hash Set
const set = new Set&lt;number&gt;([1, 2, 3]);
set.add(4); // O(1)
set.has(3); // O(1)
set.delete(3); // O(1)

// Object as Map (key 只能是 string/symbol)
const obj: Record&lt;string, number&gt; = {};
obj['key'] = 1; // O(1)

// 模擬 Priority Queue（需自行實作或用 sorted insert）
// JS 沒有內建 heap，面試中常需手寫 MinHeap

// 模擬 Deque（用 Array，但 shift/unshift 是 O(n)）
// 高效 Deque 需自行用 Doubly Linked List 實作

// 字串處理
const s = 'hello';
s.split(''); // O(n) — 轉成字元陣列
[...s]; // O(n)
s.charCodeAt(0); // O(1)
String.fromCharCode(104); // O(1)</code></pre>
  <pre slot="python"><code class="language-python"># Python equivalent
lst = [1, 2, 3]
lst.append(4)        # O(1)
lst.pop()            # O(1)

from collections import OrderedDict
od = OrderedDict()   # 類似 JS Map 的有序 dict

s = set()
s.add(1)

# Python dict 保留插入順序（3.7+）
d = {}
d['key'] = 1</code></pre>
</dsa-code-block>

<h2 id="complexity-comparison">複雜度對照表</h2>

<table>
  <thead>
    <tr><th>操作</th><th>Python list</th><th>JS Array</th><th>Python dict / set</th><th>JS Map / Set</th></tr>
  </thead>
  <tbody>
    <tr><td>尾部 push</td><td><span class="complexity">O(1)*</span></td><td><span class="complexity">O(1)*</span></td><td>—</td><td>—</td></tr>
    <tr><td>尾部 pop</td><td><span class="complexity">O(1)</span></td><td><span class="complexity">O(1)</span></td><td>—</td><td>—</td></tr>
    <tr><td>頭部 insert / unshift</td><td><span class="complexity">O(n)</span></td><td><span class="complexity">O(n)</span></td><td>—</td><td>—</td></tr>
    <tr><td>Random access</td><td><span class="complexity">O(1)</span></td><td><span class="complexity">O(1)</span></td><td>—</td><td>—</td></tr>
    <tr><td>Search (unsorted)</td><td><span class="complexity">O(n)</span></td><td><span class="complexity">O(n)</span></td><td>—</td><td>—</td></tr>
    <tr><td>get / set</td><td>—</td><td>—</td><td><span class="complexity">O(1)*</span></td><td><span class="complexity">O(1)*</span></td></tr>
    <tr><td>contains / has</td><td><span class="complexity">O(n)</span> list / <span class="complexity">O(1)</span> set</td><td><span class="complexity">O(n)</span></td><td><span class="complexity">O(1)*</span></td><td><span class="complexity">O(1)*</span></td></tr>
    <tr><td>delete</td><td><span class="complexity">O(n)</span></td><td><span class="complexity">O(n)</span></td><td><span class="complexity">O(1)*</span></td><td><span class="complexity">O(1)*</span></td></tr>
  </tbody>
</table>
<p><small>* 均攤或平均情況</small></p>

<h2 id="decision-tree">選擇決策樹</h2>
<p>面對問題時，如何選擇合適的資料結構：</p>
<ol>
  <li><strong>需要快速查找（key → value）？</strong> → <code>dict</code> / <code>Map</code></li>
  <li><strong>需要快速判斷元素是否存在？</strong> → <code>set</code> / <code>Set</code></li>
  <li><strong>需要有序且可以 index 存取？</strong> → <code>list</code> / <code>Array</code></li>
  <li><strong>需要從兩端高效 push/pop？</strong> → <code>deque</code>（Python）/ 自行實作（JS）</li>
  <li><strong>需要隨時取得最小/最大值？</strong> → <code>heapq</code>（Python）/ MinHeap（JS 需手寫）</li>
  <li><strong>需要計算頻率？</strong> → <code>Counter</code>（Python）/ <code>Map</code> 手動計數（JS）</li>
</ol>

<div class="callout callout-warning">
  <div class="callout-title">JS 沒有內建 Heap！</div>
  <p>面試時若需要 Priority Queue，JavaScript 必須自行實作 MinHeap，或使用排序後的陣列（效能較差）。這在 Ch08 會詳細介紹 TypeScript MinHeap 的完整實作。</p>
</div>

<div class="chapter-footer">
  <a href="#ch1">
    <span class="footer-label">← 上一章</span>
    <span class="footer-title">複雜度分析</span>
  </a>
  <a class="next" href="#ch3">
    <span class="footer-label">下一章 →</span>
    <span class="footer-title">Array 與 String</span>
  </a>
</div>
`
