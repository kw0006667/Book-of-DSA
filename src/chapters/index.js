/**
 * Book of DSA — Chapter & Part Metadata
 * 25 chapters across 7 parts
 */

export const parts = [
  { id: 1, label: 'Part I：基礎觀念與分析工具' },
  { id: 2, label: 'Part II：線性資料結構' },
  { id: 3, label: 'Part III：樹狀與圖形結構' },
  { id: 4, label: 'Part IV：排序與搜尋' },
  { id: 5, label: 'Part V：演算法策略（上）' },
  { id: 6, label: 'Part VI：演算法策略（下）' },
  { id: 7, label: 'Part VII：實戰整合與面試策略' },
]

export const chapters = [
  // ---- Part I ----
  {
    id: 1, part: 1,
    slug: 'complexity-analysis',
    title: '複雜度分析 — Big O Notation 與效能思維',
    tags: ['algo'],
    sections: [
      { slug: 'big-o-basics', title: 'Big O 基礎概念' },
      { slug: 'complexity-tiers', title: '常見複雜度等級' },
      { slug: 'space-complexity', title: 'Space Complexity' },
      { slug: 'best-worst-average', title: 'Best / Worst / Average Case' },
      { slug: 'code-analysis', title: '程式碼複雜度分析' },
      { slug: 'hidden-ops', title: '隱藏操作成本' },
    ]
  },
  {
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
  },

  // ---- Part II ----
  {
    id: 3, part: 2,
    slug: 'array-string',
    title: 'Array 與 String',
    tags: ['ds', 'fe'],
    sections: [
      { slug: 'static-vs-dynamic', title: 'Static vs Dynamic Array' },
      { slug: 'language-diff', title: '語言差異' },
      { slug: 'string-immutability', title: 'String 不可變性' },
      { slug: 'techniques', title: '常用技巧' },
      { slug: 'matrix', title: 'Matrix 操作' },
    ]
  },
  {
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
  },
  {
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
  },
  {
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
  },

  // ---- Part III ----
  {
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
  },
  {
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
  },
  {
    id: 9, part: 3,
    slug: 'trie',
    title: 'Trie (Prefix Tree)',
    tags: ['ds', 'fe'],
    sections: [
      { slug: 'structure', title: 'Trie 結構與操作' },
      { slug: 'implementations', title: '語言實作' },
      { slug: 'space-opt', title: 'Space 優化' },
    ]
  },
  {
    id: 10, part: 3,
    slug: 'graph',
    title: 'Graph',
    tags: ['ds', 'fe'],
    sections: [
      { slug: 'basics', title: 'Graph 基礎' },
      { slug: 'representation', title: '表示方法' },
      { slug: 'implementations', title: '語言實作' },
      { slug: 'dfs-bfs', title: 'DFS vs BFS' },
    ]
  },
  {
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
  },

  // ---- Part IV ----
  {
    id: 12, part: 4,
    slug: 'sorting',
    title: 'Sorting Algorithms',
    tags: ['algo'],
    sections: [
      { slug: 'basic-sorts', title: 'Bubble / Selection / Insertion Sort' },
      { slug: 'merge-sort', title: 'Merge Sort' },
      { slug: 'quick-sort', title: 'Quick Sort' },
      { slug: 'heap-sort', title: 'Heap Sort' },
      { slug: 'non-comparison', title: 'Non-comparison Sorts' },
      { slug: 'builtin-sort', title: '內建 Sort 比較' },
      { slug: 'stability', title: 'Stability & Comparators' },
    ]
  },
  {
    id: 13, part: 4,
    slug: 'binary-search',
    title: 'Binary Search 與其變體',
    tags: ['algo', 'fe'],
    sections: [
      { slug: 'basic', title: 'Basic Binary Search' },
      { slug: 'lower-upper-bound', title: 'Lower / Upper Bound' },
      { slug: 'rotated', title: 'Rotated Array' },
      { slug: 'search-on-answer', title: 'Binary Search on Answer' },
      { slug: 'matrix-search', title: 'Matrix Search' },
    ]
  },

  // ---- Part V ----
  {
    id: 14, part: 5,
    slug: 'two-pointers',
    title: 'Two Pointers',
    tags: ['algo'],
    sections: [
      { slug: 'opposite', title: '對向指標' },
      { slug: 'same-direction', title: '同向指標' },
      { slug: 'three-pointers', title: 'Three Pointers' },
      { slug: 'when-to-use', title: '使用時機' },
    ]
  },
  {
    id: 15, part: 5,
    slug: 'sliding-window',
    title: 'Sliding Window',
    tags: ['algo', 'fe'],
    sections: [
      { slug: 'fixed-window', title: 'Fixed-size Window' },
      { slug: 'dynamic-window', title: 'Dynamic Window' },
      { slug: 'shrinkable', title: 'Shrinkable Window Template' },
      { slug: 'monotonic-deque', title: 'Monotonic Deque' },
    ]
  },
  {
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
  },

  // ---- Part VI ----
  {
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
  },
  {
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
  },
  {
    id: 19, part: 6,
    slug: 'divide-conquer',
    title: 'Divide and Conquer',
    tags: ['algo'],
    sections: [
      { slug: 'three-steps', title: '三步驟框架' },
      { slug: 'master-theorem', title: 'Master Theorem' },
      { slug: 'quick-select', title: 'Quick Select' },
      { slug: 'merge-sort-rel', title: 'Merge Sort 關聯' },
    ]
  },
  {
    id: 20, part: 6,
    slug: 'graph-advanced',
    title: 'Graph 進階演算法',
    tags: ['algo', 'fe'],
    sections: [
      { slug: 'topological-sort', title: 'Topological Sort' },
      { slug: 'dijkstra', title: "Dijkstra's Algorithm" },
      { slug: 'bellman-ford', title: 'Bellman-Ford' },
      { slug: 'mst', title: "MST：Prim's & Kruskal's" },
      { slug: 'cycle-detection', title: 'Cycle Detection' },
    ]
  },
  {
    id: 21, part: 6,
    slug: 'bit-manipulation',
    title: 'Bit Manipulation',
    tags: ['algo'],
    sections: [
      { slug: 'basics', title: 'Bit 運算基礎' },
      { slug: 'techniques', title: '常用技巧' },
      { slug: 'lang-diff', title: 'Python vs TypeScript 差異' },
      { slug: 'xor', title: 'XOR 性質' },
    ]
  },

  // ---- Part VII ----
  {
    id: 22, part: 7,
    slug: 'pattern-recognition',
    title: '常見面試模式總結 — Pattern Recognition',
    tags: ['algo'],
    sections: [
      { slug: 'lookup-table', title: '問題分類查找表' },
      { slug: 'pattern-matching', title: 'Pattern 對應' },
      { slug: 'solving-framework', title: '解題框架' },
      { slug: 'cheatsheet', title: 'Complexity Cheatsheet' },
    ]
  },
  {
    id: 23, part: 7,
    slug: 'frontend-specific',
    title: '前端工程師特化題型與應用',
    tags: ['fe'],
    sections: [
      { slug: 'dom-tree-graph', title: 'DOM / Tree / Graph 題型' },
      { slug: 'event-loop-async', title: 'Event Loop / Promise / Async' },
      { slug: 'implementation', title: '實作挑戰題' },
      { slug: 'state-management', title: 'State Management' },
      { slug: 'performance', title: '效能優化題' },
    ]
  },
  {
    id: 24, part: 7,
    slug: 'system-design-ds',
    title: 'System Design 中的資料結構思維',
    tags: ['ds', 'algo'],
    sections: [
      { slug: 'lru-lfu', title: 'LRU / LFU Cache 設計' },
      { slug: 'rate-limiter', title: 'Rate Limiter' },
      { slug: 'bloom-filter', title: 'Bloom Filter & HyperLogLog' },
      { slug: 'consistent-hashing', title: 'Consistent Hashing' },
      { slug: 'message-queue', title: 'Message / Priority Queue' },
    ]
  },
  {
    id: 25, part: 7,
    slug: 'interview-strategy',
    title: '面試當天的策略與心態',
    tags: [],
    sections: [
      { slug: 'time-allocation', title: '45 分鐘時間分配' },
      { slug: 'communication', title: '溝通策略' },
      { slug: 'blockers', title: '卡關應對' },
      { slug: 'edge-cases', title: 'Edge Cases & Testing' },
      { slug: 'followup', title: 'Follow-up 處理' },
    ]
  },
]

/** Convenience map: id → chapter */
export const chapterMap = Object.fromEntries(chapters.map(ch => [ch.id, ch]))
