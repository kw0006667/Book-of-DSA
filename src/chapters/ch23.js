export const metadata = {
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
}

export const content = `
<div class="chapter-header">
  <div class="chapter-num">Chapter 23 · Part VII</div>
  <h1>前端工程師特化題型與應用</h1>
  <p>前端面試除了通用演算法題，還有許多專屬場景：DOM 操作、非同步控制、實作 JavaScript 原生功能等。本章整理前端工程師最常被問到的特殊題型。</p>
  <div class="chapter-tags">
    <span class="tag tag-fe">Frontend</span>
  </div>
</div>

<h2 id="dom-tree-graph">DOM / Tree / Graph 題型</h2>
<p>DOM 本質是多叉樹，許多 Tree 演算法可直接應用。</p>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// 深度序列化 DOM 結構
interface VNode {
  tag: string
  children: VNode[]
  attrs?: Record<string, string>
}

// Flatten DOM tree（DFS）
function flattenDOM(root: Element): Element[] {
  const result: Element[] = []
  const stack: Element[] = [root]
  while (stack.length) {
    const node = stack.pop()!
    result.push(node)
    // 逆序推入，保證左子節點先處理
    for (let i = node.children.length - 1; i >= 0; i--) {
      stack.push(node.children[i] as Element)
    }
  }
  return result
}

// 找到 DOM 中所有特定類型節點
function findAllByTag(root: Element, tag: string): Element[] {
  const result: Element[] = []
  function dfs(node: Element) {
    if (node.tagName.toLowerCase() === tag.toLowerCase()) {
      result.push(node)
    }
    for (const child of Array.from(node.children)) {
      dfs(child as Element)
    }
  }
  dfs(root)
  return result
}

// Virtual DOM Diff（簡化版）
function diff(oldVNode: VNode, newVNode: VNode): Patch[] {
  const patches: Patch[] = []
  // ... 比較 tag、attrs、children
  return patches
}</code></pre>
  <pre slot="python"><code class="language-python"># Python 不常見 DOM 操作
# 但樹結構的 serialize/deserialize 常考

from typing import Optional

# Serialize / Deserialize 多叉樹
class Node:
    def __init__(self, val: int, children: list = None):
        self.val = val
        self.children = children or []

def serialize(root: Optional[Node]) -> str:
    if not root:
        return ''
    parts = []
    def dfs(node: Node) -> None:
        parts.append(str(node.val))
        parts.append(str(len(node.children)))
        for child in node.children:
            dfs(child)
    dfs(root)
    return ','.join(parts)</code></pre>
</dsa-code-block>

<h2 id="event-loop-async">Event Loop / Promise / Async</h2>
<p>這類問題考察你對 JavaScript 執行模型的理解：</p>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// 實作 Promise.all
function promiseAll<T>(promises: Promise<T>[]): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const results: T[] = new Array(promises.length)
    let completed = 0
    if (promises.length === 0) resolve([])

    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then(val => {
          results[i] = val
          if (++completed === promises.length) resolve(results)
        })
        .catch(reject)
    })
  })
}

// 實作 Promise.allSettled
function promiseAllSettled<T>(
  promises: Promise<T>[]
): Promise<PromiseSettledResult<T>[]> {
  return Promise.all(
    promises.map(p =>
      Promise.resolve(p)
        .then(value => ({ status: 'fulfilled' as const, value }))
        .catch(reason => ({ status: 'rejected' as const, reason }))
    )
  )
}

// 並發控制：最多 n 個同時執行
async function parallelLimit<T>(
  tasks: (() => Promise<T>)[],
  limit: number
): Promise<T[]> {
  const results: T[] = []
  const executing = new Set<Promise<void>>()

  for (const task of tasks) {
    const p: Promise<void> = task().then(r => {
      results.push(r)
      executing.delete(p)
    })
    executing.add(p)
    if (executing.size >= limit) await Promise.race(executing)
  }
  await Promise.all(executing)
  return results
}</code></pre>
  <pre slot="python"><code class="language-python">import asyncio
from typing import Coroutine, TypeVar, Any

T = TypeVar('T')

# Python asyncio 的等效操作
async def gather_limited(
    coros: list[Coroutine],
    limit: int
) -> list[Any]:
    semaphore = asyncio.Semaphore(limit)

    async def run_with_limit(coro):
        async with semaphore:
            return await coro

    return await asyncio.gather(
        *[run_with_limit(c) for c in coros]
    )</code></pre>
</dsa-code-block>

<h2 id="implementation">實作挑戰題</h2>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// 實作 debounce
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// 實作 throttle
function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastRun = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastRun >= limit) {
      lastRun = now
      fn(...args)
    }
  }
}

// 實作 memoize（支援多參數）
function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>()
  return function (...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)!
    const result = fn(...args)
    cache.set(key, result)
    return result
  } as T
}

// 實作 curry
function curry(fn: Function) {
  return function curried(...args: any[]): any {
    if (args.length >= fn.length) return fn(...args)
    return (...moreArgs: any[]) => curried(...args, ...moreArgs)
  }
}</code></pre>
  <pre slot="python"><code class="language-python">import time
from functools import wraps
from typing import Callable, TypeVar

F = TypeVar('F', bound=Callable)

def debounce(delay: float):
    def decorator(fn: F) -> F:
        timer = None
        @wraps(fn)
        def wrapper(*args, **kwargs):
            nonlocal timer
            if timer: timer.cancel()
            import threading
            timer = threading.Timer(delay, fn, args, kwargs)
            timer.start()
        return wrapper  # type: ignore
    return decorator

def memoize(fn: F) -> F:
    cache = {}
    @wraps(fn)
    def wrapper(*args):
        if args not in cache:
            cache[args] = fn(*args)
        return cache[args]
    return wrapper  # type: ignore</code></pre>
</dsa-code-block>

<h2 id="state-management">State Management</h2>
<p>實作簡易 Redux / Zustand 的核心邏輯：</p>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// 實作簡易 Store（Pub/Sub + Reducer）
type Reducer<S, A> = (state: S, action: A) => S
type Listener = () => void

function createStore<S, A>(
  reducer: Reducer<S, A>,
  initialState: S
) {
  let state = initialState
  const listeners = new Set<Listener>()

  return {
    getState: () => state,
    dispatch: (action: A) => {
      state = reducer(state, action)
      listeners.forEach(l => l())
    },
    subscribe: (listener: Listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    }
  }
}</code></pre>
  <pre slot="python"><code class="language-python">from typing import TypeVar, Callable, Generic

S = TypeVar('S')
A = TypeVar('A')

class Store(Generic[S, A]):
    def __init__(self, reducer: Callable[[S, A], S], initial: S):
        self._state = initial
        self._reducer = reducer
        self._listeners: list[Callable] = []

    def get_state(self) -> S:
        return self._state

    def dispatch(self, action: A) -> None:
        self._state = self._reducer(self._state, action)
        for listener in self._listeners:
            listener()

    def subscribe(self, listener: Callable) -> Callable:
        self._listeners.append(listener)
        return lambda: self._listeners.remove(listener)</code></pre>
</dsa-code-block>

<h2 id="performance">效能優化題</h2>
<ul>
  <li><strong>Virtual Scroll</strong>：只渲染可視範圍的 DOM 節點，Binary Search 定位 scrollTop 對應的起始 index</li>
  <li><strong>Web Worker 分片</strong>：大量計算移到 worker，用 message queue 協調</li>
  <li><strong>requestIdleCallback 排程</strong>：低優先級任務在瀏覽器空閒時執行，類似 Priority Queue</li>
</ul>

<div class="chapter-footer">
  <a href="#ch22"><span class="footer-label">← 上一章</span><span class="footer-title">Pattern Recognition</span></a>
  <a class="next" href="#ch24"><span class="footer-label">下一章 →</span><span class="footer-title">System Design 中的 DSA</span></a>
</div>
`
