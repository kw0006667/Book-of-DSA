import { getChapterProblemIds, renderProblemList } from '../leetcode/problem-catalog.js'

export const metadata = {
  id: 5, part: 2,
  slug: 'stack-queue',
  title: 'Stack 與 Queue',
  tags: ['ds', 'fe'],
  sections: [
    { slug: 'stack-basics', title: 'Stack 基礎' },
    { slug: 'queue-basics', title: 'Queue 基礎' },
    { slug: 'deque', title: 'Deque' },
    { slug: 'monotonic', title: 'Monotonic Stack / Queue' },
    { slug: 'cross-impl', title: '相互實作' },
  ]
}

export const content = `
<div class="chapter-header">
  <div class="chapter-num">Chapter 05 · Part II</div>
  <h1>Stack 與 Queue</h1>
  <p>Stack（後進先出 LIFO）與 Queue（先進先出 FIFO）是兩種最基本的抽象資料型別，廣泛應用於程式執行、事件處理、BFS / DFS 等場景。</p>
  <div class="chapter-tags">
    <span class="tag tag-ds">Data Structure</span>
    <span class="tag tag-fe">Frontend</span>
  </div>
</div>

<h2 id="stack-basics">Stack 基礎</h2>
<p>Stack 的核心操作：<code>push</code>（放入頂端）、<code>pop</code>（取出頂端）、<code>peek</code>（查看頂端），皆為 <span class="complexity">O(1)</span>。</p>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// JS 用 Array 模擬 Stack
const stack: number[] = [];
stack.push(1); // [1]
stack.push(2); // [1, 2]
stack.push(3); // [1, 2, 3]
stack.pop(); // returns 3, stack = [1, 2]
stack[stack.length - 1]; // peek = 2

// 經典應用：括號匹配
function isValid(s: string): boolean {
  const stack: string[] = [];
  const pairs: Record&lt;string, string&gt; = { ')': '(', ']': '[', '}': '{' };
  for (const ch of s) {
    if ('([{'.includes(ch)) {
      stack.push(ch);
    } else {
      if (stack.pop() !== pairs[ch]) return false;
    }
  }
  return stack.length === 0;
}</code></pre>
  <pre slot="python"><code class="language-python"># Python list 模擬 Stack
stack = []
stack.append(1)   # [1]
stack.append(2)   # [1, 2]
stack.append(3)   # [1, 2, 3]
stack.pop()       # 3
stack[-1]         # peek = 2

# 括號匹配
def is_valid(s: str) -> bool:
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    for ch in s:
        if ch in '([{':
            stack.append(ch)
        else:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return len(stack) == 0</code></pre>
</dsa-code-block>

<h2 id="queue-basics">Queue 基礎</h2>
<p>Queue 的核心操作：<code>enqueue</code>（尾端加入）、<code>dequeue</code>（頭端取出）。</p>
<div class="callout callout-warning">
  <div class="callout-title">不要用 Array 模擬 Queue</div>
  <p>JS 的 <code>arr.shift()</code> 是 <span class="complexity">O(n)</span>，在高頻操作中效能很差。應使用 <code>collections.deque</code>（Python）或自行實作 Linked List Queue（JS）。</p>
</div>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// BFS 通常用 Array 當 Queue（面試可接受，效能非最優）
function bfs(root: TreeNode | null): number[] {
  if (!root) return [];
  const result: number[] = [];
  const queue: TreeNode[] = [root];
  while (queue.length) {
    const node = queue.shift()!; // O(n) — 面試可接受
    result.push(node.val);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return result;
}

// 高效 Queue 用兩個指標避免 shift
class Queue&lt;T&gt; {
  private data: T[] = [];
  private head = 0;
  enqueue(val: T) {
    this.data.push(val);
  }
  dequeue(): T | undefined {
    return this.data[this.head++];
  }
  get size() {
    return this.data.length - this.head;
  }
  isEmpty() {
    return this.size === 0;
  }
}</code></pre>
  <pre slot="python"><code class="language-python">from collections import deque

# deque 的 popleft 是 O(1)
queue = deque()
queue.append(1)       # enqueue
queue.append(2)
queue.popleft()       # dequeue — O(1)

# BFS 範例
from typing import Optional

def bfs(root) -> list[int]:
    if not root:
        return []
    result = []
    queue = deque([root])
    while queue:
        node = queue.popleft()
        result.append(node.val)
        if node.left:  queue.append(node.left)
        if node.right: queue.append(node.right)
    return result</code></pre>
</dsa-code-block>

<h2 id="deque">Deque（Double-ended Queue）</h2>
<p>Deque 兩端都可以 <span class="complexity">O(1)</span> push/pop，是 Sliding Window Maximum 等問題的關鍵工具。</p>

<h2 id="monotonic">Monotonic Stack / Queue</h2>
<p>Monotonic Stack 維持堆疊內元素單調遞增或遞減，是解決「下一個更大/小的元素」類問題的標準工具。</p>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// 下一個更大的元素 — Next Greater Element
function nextGreaterElement(nums: number[]): number[] {
  const result = new Array(nums.length).fill(-1);
  const stack: number[] = []; // 存 index，維持單調遞減

  for (let i = 0; i &lt; nums.length; i++) {
    // 當前元素 &gt; 堆頂元素，堆頂找到了「下一個更大」
    while (stack.length &amp;&amp; nums[i] &gt; nums[stack[stack.length - 1]]) {
      const idx = stack.pop()!;
      result[idx] = nums[i];
    }
    stack.push(i);
  }
  return result;
}

// 柱狀圖中的最大矩形 (LC #84)
function largestRectangleArea(heights: number[]): number {
  const stack: number[] = [];
  let maxArea = 0;
  const h = [...heights, 0]; // sentinel

  for (let i = 0; i &lt; h.length; i++) {
    while (stack.length &amp;&amp; h[i] &lt; h[stack[stack.length - 1]]) {
      const height = h[stack.pop()!];
      const width = stack.length ? i - stack[stack.length - 1] - 1 : i;
      maxArea = Math.max(maxArea, height * width);
    }
    stack.push(i);
  }
  return maxArea;
}</code></pre>
  <pre slot="python"><code class="language-python">def next_greater_element(nums: list[int]) -> list[int]:
    result = [-1] * len(nums)
    stack = []  # 存 index，維持單調遞減

    for i, num in enumerate(nums):
        while stack and num > nums[stack[-1]]:
            idx = stack.pop()
            result[idx] = num
        stack.append(i)
    return result

def largest_rectangle_area(heights: list[int]) -> int:
    stack = []
    max_area = 0
    h = heights + [0]

    for i, height in enumerate(h):
        while stack and height < h[stack[-1]]:
            top = stack.pop()
            width = i if not stack else i - stack[-1] - 1
            max_area = max(max_area, h[top] * width)
        stack.append(i)
    return max_area</code></pre>
</dsa-code-block>

<h2 id="cross-impl">相互實作</h2>
<p>用兩個 Stack 實作 Queue（經典面試題），反之亦然：</p>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// 用兩個 Stack 實作 Queue — LC #232
class MyQueue {
  private inbox: number[] = []; // push stack
  private outbox: number[] = []; // pop stack

  push(x: number): void {
    this.inbox.push(x);
  }

  pop(): number {
    this.move();
    return this.outbox.pop()!;
  }

  peek(): number {
    this.move();
    return this.outbox[this.outbox.length - 1];
  }

  empty(): boolean {
    return !this.inbox.length &amp;&amp; !this.outbox.length;
  }

  private move(): void {
    if (!this.outbox.length) {
      while (this.inbox.length) {
        this.outbox.push(this.inbox.pop()!);
      }
    }
  }
  // 均攤 O(1) per operation
}</code></pre>
  <pre slot="python"><code class="language-python">class MyQueue:
    def __init__(self):
        self.inbox = []   # push stack
        self.outbox = []  # pop stack

    def push(self, x: int) -> None:
        self.inbox.append(x)

    def pop(self) -> int:
        self._move()
        return self.outbox.pop()

    def peek(self) -> int:
        self._move()
        return self.outbox[-1]

    def empty(self) -> bool:
        return not self.inbox and not self.outbox

    def _move(self) -> None:
        if not self.outbox:
            while self.inbox:
                self.outbox.append(self.inbox.pop())</code></pre>
</dsa-code-block>

<div class="callout callout-fe">
  <div class="callout-title">前端應用場景</div>
  <ul>
    <li><strong>JavaScript Call Stack</strong>：函式呼叫就是 Stack，遞迴過深會 stack overflow</li>
    <li><strong>Event Loop / Task Queue</strong>：Macrotask Queue、Microtask Queue（Promise）都是 Queue</li>
    <li><strong>括號 / HTML 標籤配對</strong>：HTML parser 用 Stack 驗證標籤配對</li>
    <li><strong>DOM 深度優先遍歷</strong>：iterative DFS 用 Stack 避免遞迴 stack overflow</li>
    <li><strong>Toast / Notification 佇列</strong>：訊息依序顯示的實作核心是 Queue</li>
  </ul>
</div>

<h3>精選 LeetCode 題目</h3>
${renderProblemList(getChapterProblemIds(5))}

<div class="chapter-footer">
  <a href="#ch4">
    <span class="footer-label">← 上一章</span>
    <span class="footer-title">Linked List</span>
  </a>
  <a class="next" href="#ch6">
    <span class="footer-label">下一章 →</span>
    <span class="footer-title">Hash Table</span>
  </a>
</div>
`
