import { getChapterProblemIds, renderProblemList } from '../leetcode/problem-catalog.js'

export const metadata = {
  id: 4, part: 2,
  slug: 'linked-list',
  title: 'Linked List',
  tags: ['ds', 'fe'],
  sections: [
    { slug: 'singly-doubly', title: 'Singly / Doubly / Circular' },
    { slug: 'implementation', title: '實作方式' },
    { slug: 'sentinel-nodes', title: 'Sentinel Nodes' },
    { slug: 'fast-slow-pointers', title: 'Fast & Slow Pointers' },
  ]
}

export const content = `
<div class="chapter-header">
  <div class="chapter-num">Chapter 04 · Part II</div>
  <h1>Linked List</h1>
  <p>Linked List 是節點（Node）透過指標串接的線性結構。它解決了 Array 插入/刪除需要移動元素的問題，但犧牲了 Random Access 的能力。</p>
  <div class="chapter-tags">
    <span class="tag tag-ds">Data Structure</span>
    <span class="tag tag-fe">Frontend</span>
  </div>
</div>

<h2 id="singly-doubly">Singly / Doubly / Circular</h2>
<table>
  <thead><tr><th>類型</th><th>指標</th><th>特點</th><th>用途</th></tr></thead>
  <tbody>
    <tr><td>Singly</td><td><code>next</code></td><td>只能向前遍歷</td><td>Stack、簡單序列</td></tr>
    <tr><td>Doubly</td><td><code>prev</code>, <code>next</code></td><td>雙向遍歷，刪除 <span class="complexity">O(1)</span></td><td>LRU Cache、Deque</td></tr>
    <tr><td>Circular</td><td>tail → head</td><td>無尾端，可繞圈</td><td>Round-robin、輪播</td></tr>
  </tbody>
</table>

<h2 id="implementation">實作方式</h2>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">class ListNode {
  val: number
  next: ListNode | null = null
  constructor(val: number) { this.val = val }
}

class DoublyNode {
  val: number
  prev: DoublyNode | null = null
  next: DoublyNode | null = null
  constructor(val: number) { this.val = val }
}

// 反轉 Linked List — O(n) time, O(1) space
function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null
  let curr = head
  while (curr) {
    const next = curr.next
    curr.next = prev
    prev = curr
    curr = next
  }
  return prev
}

// 合併兩個有序 Linked List
function mergeTwoLists(
  l1: ListNode | null,
  l2: ListNode | null
): ListNode | null {
  const dummy = new ListNode(0)
  let cur = dummy
  while (l1 && l2) {
    if (l1.val <= l2.val) { cur.next = l1; l1 = l1.next }
    else                   { cur.next = l2; l2 = l2.next }
    cur = cur.next!
  }
  cur.next = l1 ?? l2
  return dummy.next
}</code></pre>
  <pre slot="python"><code class="language-python">from typing import Optional

class ListNode:
    def __init__(self, val: int = 0, next=None):
        self.val = val
        self.next = next

# 反轉 Linked List — O(n) time, O(1) space
def reverse_list(head: Optional[ListNode]) -> Optional[ListNode]:
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev

# 合併兩個有序 Linked List
def merge_two_lists(
    l1: Optional[ListNode],
    l2: Optional[ListNode]
) -> Optional[ListNode]:
    dummy = ListNode(0)
    cur = dummy
    while l1 and l2:
        if l1.val <= l2.val:
            cur.next = l1
            l1 = l1.next
        else:
            cur.next = l2
            l2 = l2.next
        cur = cur.next
    cur.next = l1 or l2
    return dummy.next</code></pre>
</dsa-code-block>

<h2 id="sentinel-nodes">Sentinel Nodes（哨兵節點）</h2>
<p>在 head 前加一個 <strong>dummy node</strong>，可以統一處理「頭節點需要特殊邏輯」的情況，大幅簡化程式碼。</p>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// 刪除倒數第 N 個節點
// 有了 dummy node，不需要特判 head 被刪除的情況
function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  const dummy = new ListNode(0)
  dummy.next = head
  let fast: ListNode | null = dummy
  let slow: ListNode | null = dummy

  // fast 先走 n+1 步
  for (let i = 0; i <= n; i++) fast = fast!.next

  while (fast) {
    fast = fast.next
    slow = slow!.next
  }

  // slow 此時指向待刪節點的前一個
  slow!.next = slow!.next!.next
  return dummy.next
}</code></pre>
  <pre slot="python"><code class="language-python">def remove_nth_from_end(head: Optional[ListNode], n: int) -> Optional[ListNode]:
    dummy = ListNode(0)
    dummy.next = head
    fast = slow = dummy

    for _ in range(n + 1):
        fast = fast.next

    while fast:
        fast = fast.next
        slow = slow.next

    slow.next = slow.next.next
    return dummy.next</code></pre>
</dsa-code-block>

<h2 id="fast-slow-pointers">Fast & Slow Pointers（Floyd's Algorithm）</h2>
<p>兩個指標以不同速度移動，可以偵測環路（Cycle）、找到中點、找到環入口等。</p>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// 偵測環路
function hasCycle(head: ListNode | null): boolean {
  let slow = head, fast = head
  while (fast && fast.next) {
    slow = slow!.next
    fast = fast.next.next
    if (slow === fast) return true
  }
  return false
}

// 找到 Linked List 中點
function findMiddle(head: ListNode | null): ListNode | null {
  let slow = head, fast = head
  while (fast && fast.next) {
    slow = slow!.next
    fast = fast.next.next
  }
  return slow  // 奇數長度 → 正中間；偶數長度 → 後半段的第一個
}</code></pre>
  <pre slot="python"><code class="language-python">def has_cycle(head: Optional[ListNode]) -> bool:
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False

def find_middle(head: Optional[ListNode]) -> Optional[ListNode]:
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow</code></pre>
</dsa-code-block>

<div class="callout callout-fe">
  <div class="callout-title">前端應用場景</div>
  <ul>
    <li><strong>Browser History</strong>：瀏覽器的上一頁 / 下一頁就是 Doubly Linked List</li>
    <li><strong>Undo / Redo</strong>：文字編輯器的操作歷史，每個節點代表一個狀態</li>
    <li><strong>React Fiber</strong>：React 16+ 的協調（Reconciliation）架構，每個 Fiber 節點都有 <code>child</code>、<code>sibling</code>、<code>return</code> 指標，本質是 Linked List + Tree 的混合</li>
    <li><strong>LRU Cache</strong>：Doubly Linked List + HashMap 實作 <span class="complexity">O(1)</span> 的快取淘汰（見 Ch24）</li>
  </ul>
</div>

<h3>精選 LeetCode 題目</h3>
${renderProblemList(getChapterProblemIds(4))}

<div class="chapter-footer">
  <a href="#ch3">
    <span class="footer-label">← 上一章</span>
    <span class="footer-title">Array 與 String</span>
  </a>
  <a class="next" href="#ch5">
    <span class="footer-label">下一章 →</span>
    <span class="footer-title">Stack 與 Queue</span>
  </a>
</div>
`
