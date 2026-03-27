import { getChapterProblemIds, renderProblemList } from '../leetcode/problem-catalog.js'

export const metadata = {
  id: 7, part: 3,
  slug: 'binary-tree-bst',
  title: 'Binary Tree 與 Binary Search Tree',
  tags: ['ds', 'fe'],
  sections: [
    { slug: 'terminology', title: '樹的術語' },
    { slug: 'representation', title: '樹的表示法' },
    { slug: 'traversals', title: 'DFS Traversals' },
    { slug: 'level-order', title: 'Level Order / BFS' },
    { slug: 'bst-ops', title: 'BST 操作' },
    { slug: 'balanced', title: 'Balanced Trees' },
  ]
}

export const content = `
<div class="chapter-header">
  <div class="chapter-num">Chapter 07 · Part III</div>
  <h1>Binary Tree 與 Binary Search Tree</h1>
  <p>樹形結構是面試中最高頻的考題類別之一。掌握各種遍歷方式與 BST 操作，是解決 DOM 操作、Virtual DOM diff、AST 分析等前端問題的基礎。</p>
  <div class="chapter-tags">
    <span class="tag tag-ds">Data Structure</span>
    <span class="tag tag-fe">Frontend</span>
  </div>
</div>

<h2 id="terminology">樹的術語</h2>
<table>
  <thead><tr><th>術語</th><th>說明</th></tr></thead>
  <tbody>
    <tr><td>Root</td><td>根節點，沒有父節點</td></tr>
    <tr><td>Leaf</td><td>葉節點，沒有子節點</td></tr>
    <tr><td>Height</td><td>從節點到最深葉節點的路徑長度</td></tr>
    <tr><td>Depth</td><td>從根節點到該節點的路徑長度</td></tr>
    <tr><td>Balanced</td><td>任意節點的左右子樹高度差 ≤ 1</td></tr>
    <tr><td>Complete</td><td>除最後一層外全滿，最後一層靠左</td></tr>
    <tr><td>Full</td><td>每個節點有 0 或 2 個子節點</td></tr>
  </tbody>
</table>

<h2 id="representation">樹的表示法</h2>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// 最常見的節點定義
class TreeNode {
  val: number
  left: TreeNode | null = null
  right: TreeNode | null = null
  constructor(val: number) { this.val = val }
}

// Array 表示（Heap / Complete Binary Tree 常用）
// 對於 index i：
// parent = Math.floor((i - 1) / 2)
// left child = 2 * i + 1
// right child = 2 * i + 2</code></pre>
  <pre slot="python"><code class="language-python">from typing import Optional

class TreeNode:
    def __init__(self, val: int = 0,
                 left=None, right=None):
        self.val = val
        self.left = left
        self.right = right</code></pre>
</dsa-code-block>

<h2 id="traversals">DFS Traversals</h2>
<p>三種 DFS 遍歷只差在 <strong>root 的處理時機</strong>：</p>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// Preorder: Root → Left → Right
function preorder(root: TreeNode | null): number[] {
  if (!root) return []
  return [root.val, ...preorder(root.left), ...preorder(root.right)]
}

// Inorder: Left → Root → Right (BST 中序 = 升序)
function inorder(root: TreeNode | null): number[] {
  if (!root) return []
  return [...inorder(root.left), root.val, ...inorder(root.right)]
}

// Postorder: Left → Right → Root
function postorder(root: TreeNode | null): number[] {
  if (!root) return []
  return [...postorder(root.left), ...postorder(root.right), root.val]
}

// Iterative Inorder（避免遞迴 stack overflow）
function inorderIterative(root: TreeNode | null): number[] {
  const result: number[] = []
  const stack: TreeNode[] = []
  let curr: TreeNode | null = root
  while (curr || stack.length) {
    while (curr) { stack.push(curr); curr = curr.left }
    curr = stack.pop()!
    result.push(curr.val)
    curr = curr.right
  }
  return result
}</code></pre>
  <pre slot="python"><code class="language-python">def preorder(root: Optional[TreeNode]) -> list[int]:
    if not root: return []
    return [root.val] + preorder(root.left) + preorder(root.right)

def inorder(root: Optional[TreeNode]) -> list[int]:
    if not root: return []
    return inorder(root.left) + [root.val] + inorder(root.right)

def postorder(root: Optional[TreeNode]) -> list[int]:
    if not root: return []
    return postorder(root.left) + postorder(root.right) + [root.val]

# Iterative Inorder
def inorder_iterative(root: Optional[TreeNode]) -> list[int]:
    result, stack = [], []
    curr = root
    while curr or stack:
        while curr:
            stack.append(curr)
            curr = curr.left
        curr = stack.pop()
        result.append(curr.val)
        curr = curr.right
    return result</code></pre>
</dsa-code-block>

<h2 id="level-order">Level Order / BFS</h2>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return []
  const result: number[][] = []
  const queue: TreeNode[] = [root]

  while (queue.length) {
    const levelSize = queue.length
    const level: number[] = []
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!
      level.push(node.val)
      if (node.left)  queue.push(node.left)
      if (node.right) queue.push(node.right)
    }
    result.push(level)
  }
  return result
}

// 樹的最大深度
function maxDepth(root: TreeNode | null): number {
  if (!root) return 0
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right))
}</code></pre>
  <pre slot="python"><code class="language-python">from collections import deque

def level_order(root: Optional[TreeNode]) -> list[list[int]]:
    if not root: return []
    result = []
    queue = deque([root])

    while queue:
        level_size = len(queue)
        level = []
        for _ in range(level_size):
            node = queue.popleft()
            level.append(node.val)
            if node.left:  queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level)
    return result

def max_depth(root: Optional[TreeNode]) -> int:
    if not root: return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))</code></pre>
</dsa-code-block>

<h2 id="bst-ops">BST 操作</h2>
<p>BST 性質：左子樹所有節點 < 根 < 右子樹所有節點。<strong>中序遍歷結果為升序排列。</strong></p>
<p>Search / Insert / Delete 的平均複雜度為 <span class="complexity">O(log n)</span>，但最壞（退化成鏈）為 <span class="complexity">O(n)</span>。</p>

<h2 id="balanced">Balanced Trees</h2>
<p>為保證 <span class="complexity">O(log n)</span> 的搜尋效率，需要平衡樹：</p>
<ul>
  <li><strong>AVL Tree</strong>：嚴格平衡（高度差 ≤ 1），查詢快，插入/刪除需旋轉較多</li>
  <li><strong>Red-Black Tree</strong>：近似平衡，旋轉次數少，C++ STL <code>map</code>、Java <code>TreeMap</code> 的底層</li>
  <li><strong>B-Tree / B+ Tree</strong>：資料庫索引常用，適合磁碟 I/O</li>
</ul>

<div class="callout callout-fe">
  <div class="callout-title">前端應用場景</div>
  <ul>
    <li><strong>DOM Tree 遍歷</strong>：<code>TreeWalker</code>、<code>querySelectorAll</code> 本質是樹的遍歷</li>
    <li><strong>Virtual DOM Diffing</strong>：React / Vue 的 diff 演算法在同層比較，是基於樹結構的啟發式演算法</li>
    <li><strong>AST (Abstract Syntax Tree)</strong>：Babel、ESLint、TypeScript compiler 都將程式碼解析為 AST 進行分析和轉換</li>
    <li><strong>組件樹</strong>：React component tree、Lit 的 Shadow DOM tree 都是二元/多元樹結構</li>
    <li><strong>File System UI</strong>：資料夾展開/收合就是樹的 lazy loading + DFS</li>
  </ul>
</div>

<h3>精選 LeetCode 題目</h3>
${renderProblemList(getChapterProblemIds(7))}

<div class="chapter-footer">
  <a href="#ch6">
    <span class="footer-label">← 上一章</span>
    <span class="footer-title">Hash Table</span>
  </a>
  <a class="next" href="#ch8">
    <span class="footer-label">下一章 →</span>
    <span class="footer-title">Heap 與 Priority Queue</span>
  </a>
</div>
`
