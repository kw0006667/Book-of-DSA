import { getChapterProblemIds, renderProblemList } from '../leetcode/problem-catalog.js'

export const metadata = {
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
}

export const content = `
<div class="chapter-header">
  <div class="chapter-num">Chapter 20 · Part VI</div>
  <h1>Graph 進階演算法</h1>
  <p>從最短路徑到最小生成樹，圖論進階演算法廣泛應用於地圖導航、網路路由、套件依賴管理等場景。前端開發者尤其需要了解 Topological Sort 和 Cycle Detection。</p>
  <div class="chapter-tags">
    <span class="tag tag-algo">Algorithm</span>
    <span class="tag tag-fe">Frontend</span>
  </div>
</div>

<h2 id="topological-sort">Topological Sort</h2>
<p>對 DAG（有向無環圖）的節點排序，使所有邊從前指向後。兩種方法：</p>
<ul>
  <li><strong>Kahn's Algorithm（BFS）</strong>：計算 in-degree，反覆選取 in-degree=0 的節點</li>
  <li><strong>DFS 後序</strong>：DFS 完成節點後推入 stack，最後反轉</li>
</ul>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// Kahn's Algorithm — LC #207 Course Schedule
function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  const inDegree = new Array(numCourses).fill(0)
  const graph = Array.from({ length: numCourses }, () => [] as number[])

  for (const [a, b] of prerequisites) {
    graph[b].push(a)
    inDegree[a]++
  }

  const queue = []
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i)
  }

  let completed = 0
  while (queue.length) {
    const node = queue.shift()!
    completed++
    for (const neighbor of graph[node]) {
      if (--inDegree[neighbor] === 0) queue.push(neighbor)
    }
  }
  return completed === numCourses
}

// Topological Order — LC #210
function findOrder(numCourses: number, prerequisites: number[][]): number[] {
  const inDegree = new Array(numCourses).fill(0)
  const graph: number[][] = Array.from({ length: numCourses }, () => [])
  for (const [a, b] of prerequisites) { graph[b].push(a); inDegree[a]++ }
  const queue = Array.from({ length: numCourses }, (_, i) => i).filter(i => inDegree[i] === 0)
  const result: number[] = []
  while (queue.length) {
    const node = queue.shift()!
    result.push(node)
    for (const next of graph[node]) {
      if (--inDegree[next] === 0) queue.push(next)
    }
  }
  return result.length === numCourses ? result : []
}</code></pre>
  <pre slot="python"><code class="language-python">from collections import defaultdict, deque

def can_finish(num_courses: int, prerequisites: list[list[int]]) -> bool:
    in_degree = [0] * num_courses
    graph = defaultdict(list)
    for a, b in prerequisites:
        graph[b].append(a)
        in_degree[a] += 1

    queue = deque(i for i in range(num_courses) if in_degree[i] == 0)
    completed = 0
    while queue:
        node = queue.popleft()
        completed += 1
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    return completed == num_courses</code></pre>
</dsa-code-block>

<h2 id="dijkstra">Dijkstra's Algorithm</h2>
<p>單源最短路徑（非負邊權）。使用 Min-Heap 優化到 <span class="complexity">O((V+E) log V)</span>。</p>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// Dijkstra — LC #743 Network Delay Time
function networkDelayTime(times: number[][], n: number, k: number): number {
  const graph = new Map<number, [number, number][]>()
  for (let i = 1; i <= n; i++) graph.set(i, [])
  for (const [u, v, w] of times) graph.get(u)!.push([v, w])

  const dist = new Array(n + 1).fill(Infinity)
  dist[k] = 0
  // MinHeap: [dist, node]
  const heap = new MinHeap<[number, number]>(([a], [b]) => a - b)
  heap.push([0, k])

  while (heap.size) {
    const [d, u] = heap.pop()!
    if (d > dist[u]) continue
    for (const [v, w] of graph.get(u)!) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w
        heap.push([dist[v], v])
      }
    }
  }

  const maxDist = Math.max(...dist.slice(1))
  return maxDist === Infinity ? -1 : maxDist
}</code></pre>
  <pre slot="python"><code class="language-python">import heapq
from collections import defaultdict

def network_delay_time(times: list[list[int]], n: int, k: int) -> int:
    graph = defaultdict(list)
    for u, v, w in times:
        graph[u].append((v, w))

    dist = [float('inf')] * (n + 1)
    dist[k] = 0
    heap = [(0, k)]

    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]:
            continue
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(heap, (dist[v], v))

    max_dist = max(dist[1:])
    return -1 if max_dist == float('inf') else max_dist</code></pre>
</dsa-code-block>

<h2 id="bellman-ford">Bellman-Ford</h2>
<p>處理<strong>負邊權</strong>的最短路徑。<span class="complexity">O(VE)</span>，也可偵測負環。</p>

<h2 id="mst">MST：Prim's & Kruskal's</h2>
<p>最小生成樹（Minimum Spanning Tree）：連接所有節點且邊權總和最小的樹。</p>
<ul>
  <li><strong>Kruskal's</strong>：邊按權重排序，用 Union-Find 判斷是否形成環，貪心加邊</li>
  <li><strong>Prim's</strong>：從任意節點出發，用 Min-Heap 貪心選最小邊擴展</li>
</ul>

<h2 id="cycle-detection">Cycle Detection</h2>
<ul>
  <li><strong>Undirected Graph</strong>：Union-Find（加邊時檢查）或 DFS（記錄 parent）</li>
  <li><strong>Directed Graph</strong>：DFS 用三色標記（white/grey/black）或 Topological Sort 後檢查節點數</li>
</ul>

<div class="callout callout-fe">
  <div class="callout-title">前端應用場景</div>
  <ul>
    <li><strong>Webpack dependency resolution</strong>：模組依賴圖的 Topological Sort 決定 bundle 順序</li>
    <li><strong>Google Maps / 導航</strong>：Dijkstra 或 A* 找最短路徑</li>
    <li><strong>Circular dependency detection</strong>：ESLint <code>import/no-cycle</code> 規則使用 DFS 在 import 圖中偵測環</li>
    <li><strong>DAG rendering</strong>：Notion、Linear 的任務依賴圖使用 Topological Sort 決定節點佈局</li>
  </ul>
</div>

<h3>精選 LeetCode 題目</h3>
${renderProblemList(getChapterProblemIds(20))}

<div class="chapter-footer">
  <a href="#ch19"><span class="footer-label">← 上一章</span><span class="footer-title">Divide and Conquer</span></a>
  <a class="next" href="#ch21"><span class="footer-label">下一章 →</span><span class="footer-title">Bit Manipulation</span></a>
</div>
`
