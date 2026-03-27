import { getChapterProblemIds, renderProblemList } from '../leetcode/problem-catalog.js'

export const metadata = {
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
}

export const content = `
<div class="chapter-header">
  <div class="chapter-num">Chapter 10 · Part III</div>
  <h1>Graph</h1>
  <p>Graph 由節點（Vertex）與邊（Edge）組成，是模擬現實世界關係的通用工具：社交網路、路徑規劃、模組依賴、狀態機都是 Graph 的應用場景。</p>
  <div class="chapter-tags">
    <span class="tag tag-ds">Data Structure</span>
    <span class="tag tag-fe">Frontend</span>
  </div>
</div>

<h2 id="basics">Graph 基礎</h2>
<table>
  <thead><tr><th>術語</th><th>說明</th></tr></thead>
  <tbody>
    <tr><td>Directed / Undirected</td><td>有向圖（單向邊）/ 無向圖（雙向邊）</td></tr>
    <tr><td>Weighted</td><td>邊有權重（距離、成本）</td></tr>
    <tr><td>Cyclic / Acyclic</td><td>是否有環路；DAG = Directed Acyclic Graph</td></tr>
    <tr><td>Connected</td><td>任意兩節點間存在路徑</td></tr>
    <tr><td>Degree</td><td>節點的邊數；有向圖分 in-degree / out-degree</td></tr>
  </tbody>
</table>

<h2 id="representation">表示方法</h2>
<table>
  <thead><tr><th>方式</th><th>Space</th><th>Edge lookup</th><th>適合場景</th></tr></thead>
  <tbody>
    <tr><td>Adjacency List</td><td><span class="complexity">O(V+E)</span></td><td><span class="complexity">O(degree)</span></td><td>稀疏圖（大多數場景）</td></tr>
    <tr><td>Adjacency Matrix</td><td><span class="complexity">O(V²)</span></td><td><span class="complexity">O(1)</span></td><td>稠密圖、Floyd-Warshall</td></tr>
    <tr><td>Edge List</td><td><span class="complexity">O(E)</span></td><td><span class="complexity">O(E)</span></td><td>Kruskal's MST</td></tr>
  </tbody>
</table>

<h2 id="implementations">語言實作</h2>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// Adjacency List — 最常用
type Graph = Map&lt;number, number[]&gt;;

function buildGraph(edges: number[][], n: number): Graph {
  const graph: Graph = new Map();
  for (let i = 0; i &lt; n; i++) graph.set(i, []);
  for (const [u, v] of edges) {
    graph.get(u)!.push(v);
    graph.get(v)!.push(u); // undirected
  }
  return graph;
}

// DFS — iterative
function dfs(graph: Graph, start: number): number[] {
  const visited = new Set&lt;number&gt;();
  const stack = [start];
  const result: number[] = [];
  while (stack.length) {
    const node = stack.pop()!;
    if (visited.has(node)) continue;
    visited.add(node);
    result.push(node);
    for (const neighbor of graph.get(node) ?? []) {
      if (!visited.has(neighbor)) stack.push(neighbor);
    }
  }
  return result;
}

// BFS
function bfs(graph: Graph, start: number): number[] {
  const visited = new Set&lt;number&gt;([start]);
  const queue = [start];
  const result: number[] = [];
  while (queue.length) {
    const node = queue.shift()!;
    result.push(node);
    for (const neighbor of graph.get(node) ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return result;
}</code></pre>
  <pre slot="python"><code class="language-python">from collections import defaultdict, deque
from typing import List

# Adjacency List
def build_graph(edges: List[List[int]], n: int) -> dict:
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)  # undirected
    return graph

# DFS — recursive
def dfs(graph: dict, node: int, visited: set) -> None:
    visited.add(node)
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)

# BFS
def bfs(graph: dict, start: int) -> List[int]:
    visited = {start}
    queue = deque([start])
    result = []
    while queue:
        node = queue.popleft()
        result.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return result</code></pre>
</dsa-code-block>

<h2 id="dfs-bfs">DFS vs BFS</h2>
<table>
  <thead><tr><th></th><th>DFS</th><th>BFS</th></tr></thead>
  <tbody>
    <tr><td>資料結構</td><td>Stack（或遞迴）</td><td>Queue</td></tr>
    <tr><td>Space</td><td><span class="complexity">O(H)</span> H=深度</td><td><span class="complexity">O(W)</span> W=寬度</td></tr>
    <tr><td>最短路徑（unweighted）</td><td>❌</td><td>✅</td></tr>
    <tr><td>Connected components</td><td>✅</td><td>✅</td></tr>
    <tr><td>Topological sort</td><td>✅</td><td>✅（Kahn's）</td></tr>
    <tr><td>Cycle detection</td><td>✅</td><td>✅</td></tr>
  </tbody>
</table>

<div class="callout callout-fe">
  <div class="callout-title">前端應用場景</div>
  <ul>
    <li><strong>模組依賴分析</strong>：Webpack / Vite 的 dependency graph，Circular dependency 就是有環 DAG</li>
    <li><strong>狀態機（State Machine）</strong>：XState 的狀態轉換是有向圖，每個 event 是邊</li>
    <li><strong>社交網路 / 關注關係</strong>：「共同好友」是 BFS 找兩節點距離 2 的節點</li>
    <li><strong>Drag & Drop DAG</strong>：任務依賴圖（Notion、Linear）中確保無循環依賴</li>
  </ul>
</div>

<h3>精選 LeetCode 題目</h3>
${renderProblemList(getChapterProblemIds(10))}

<div class="chapter-footer">
  <a href="#ch9"><span class="footer-label">← 上一章</span><span class="footer-title">Trie</span></a>
  <a class="next" href="#ch11"><span class="footer-label">下一章 →</span><span class="footer-title">Union-Find</span></a>
</div>
`
