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
  tag: string;
  children: VNode[];
  attrs?: Record&lt;string, string&gt;;
}

// Flatten DOM tree（DFS）
function flattenDOM(root: Element): Element[] {
  const result: Element[] = [];
  const stack: Element[] = [root];
  while (stack.length) {
    const node = stack.pop()!;
    result.push(node);
    // 逆序推入，保證左子節點先處理
    for (let i = node.children.length - 1; i &gt;= 0; i--) {
      stack.push(node.children[i] as Element);
    }
  }
  return result;
}

// 找到 DOM 中所有特定類型節點
function findAllByTag(root: Element, tag: string): Element[] {
  const result: Element[] = [];
  function dfs(node: Element) {
    if (node.tagName.toLowerCase() === tag.toLowerCase()) {
      result.push(node);
    }
    for (const child of Array.from(node.children)) {
      dfs(child as Element);
    }
  }
  dfs(root);
  return result;
}

// Virtual DOM Diff（簡化版）
function diff(oldVNode: VNode, newVNode: VNode): Patch[] {
  const patches: Patch[] = [];
  // ... 比較 tag、attrs、children
  return patches;
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
function promiseAll&lt;T&gt;(promises: Promise&lt;T&gt;[]): Promise&lt;T[]&gt; {
  return new Promise((resolve, reject) =&gt; {
    const results: T[] = new Array(promises.length);
    let completed = 0;
    if (promises.length === 0) resolve([]);

    promises.forEach((p, i) =&gt; {
      Promise.resolve(p)
        .then((val) =&gt; {
          results[i] = val;
          if (++completed === promises.length) resolve(results);
        })
        .catch(reject);
    });
  });
}

// 實作 Promise.allSettled
function promiseAllSettled&lt;T&gt;(promises: Promise&lt;T&gt;[]): Promise&lt;PromiseSettledResult&lt;T&gt;[]&gt; {
  return Promise.all(
    promises.map((p) =&gt;
      Promise.resolve(p)
        .then((value) =&gt; ({ status: 'fulfilled' as const, value }))
        .catch((reason) =&gt; ({ status: 'rejected' as const, reason })),
    ),
  );
}

// 並發控制：最多 n 個同時執行
async function parallelLimit&lt;T&gt;(tasks: (() =&gt; Promise&lt;T&gt;)[], limit: number): Promise&lt;T[]&gt; {
  const results: T[] = [];
  const executing = new Set&lt;Promise&lt;void&gt;&gt;();

  for (const task of tasks) {
    const p: Promise&lt;void&gt; = task().then((r) =&gt; {
      results.push(r);
      executing.delete(p);
    });
    executing.add(p);
    if (executing.size &gt;= limit) await Promise.race(executing);
  }
  await Promise.all(executing);
  return results;
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
function debounce&lt;T extends (...args: any[]) =&gt; any&gt;(
  fn: T,
  delay: number,
): (...args: Parameters&lt;T&gt;) =&gt; void {
  let timer: ReturnType&lt;typeof setTimeout&gt;;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() =&gt; fn(...args), delay);
  };
}

// 實作 throttle
function throttle&lt;T extends (...args: any[]) =&gt; any&gt;(
  fn: T,
  limit: number,
): (...args: Parameters&lt;T&gt;) =&gt; void {
  let lastRun = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastRun &gt;= limit) {
      lastRun = now;
      fn(...args);
    }
  };
}

// 實作 memoize（支援多參數）
function memoize&lt;T extends (...args: any[]) =&gt; any&gt;(fn: T): T {
  const cache = new Map&lt;string, ReturnType&lt;T&gt;&gt;();
  return function (...args: Parameters&lt;T&gt;): ReturnType&lt;T&gt; {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key)!;
    const result = fn(...args);
    cache.set(key, result);
    return result;
  } as T;
}

// 實作 curry
function curry(fn: Function) {
  return function curried(...args: any[]): any {
    if (args.length &gt;= fn.length) return fn(...args);
    return (...moreArgs: any[]) =&gt; curried(...args, ...moreArgs);
  };
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
type Reducer&lt;S, A&gt; = (state: S, action: A) =&gt; S;
type Listener = () =&gt; void;

function createStore&lt;S, A&gt;(reducer: Reducer&lt;S, A&gt;, initialState: S) {
  let state = initialState;
  const listeners = new Set&lt;Listener&gt;();

  return {
    getState: () =&gt; state,
    dispatch: (action: A) =&gt; {
      state = reducer(state, action);
      listeners.forEach((l) =&gt; l());
    },
    subscribe: (listener: Listener) =&gt; {
      listeners.add(listener);
      return () =&gt; listeners.delete(listener);
    },
  };
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
<p>這三題其實對應前端最常見的三種瓶頸：<strong>DOM 太多</strong>、<strong>Main Thread 計算太重</strong>、<strong>非關鍵工作搶走互動時間</strong>。用 Web Component 實作時，一個很大的優勢是：你可以把效能策略封裝在 custom element 內部，外部只需要丟資料和屬性，不必知道內部如何做節流、排程或分片。</p>

<h3>1. Virtual Scroll</h3>
<p>當列表有幾千到幾萬筆資料時，真正拖慢頁面的通常不是 JavaScript 陣列本身，而是一次建立太多 DOM 節點。就算每一列只是一個簡單的 <code>&lt;div&gt;</code>，累積到數千個節點後，layout、paint、style recalculation 都會變重。</p>
<p><strong>核心想法</strong>是把「資料總量」和「實際渲染的節點數」拆開。資料可以有 10,000 筆，但畫面上只保留視窗附近的 20 到 40 筆節點。若每列高度固定，可以直接用 <code>Math.floor(scrollTop / itemHeight)</code> 找起點；若高度不固定，就先維護 prefix sum，高度查找時再用 <strong>Binary Search</strong> 找到目前 scrollTop 落在哪一列。</p>
<p>在 Web Component 中，最自然的做法是封裝成 <code>&lt;virtual-list&gt;</code>。它只暴露 <code>items</code>、<code>item-height</code> 這類 API，內部自己處理 scroll 事件、spacer 高度與可視範圍渲染。</p>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">class VirtualList extends HTMLElement {
  private items: string[] = [];
  private itemHeight = 48;
  private overscan = 5;
  private viewport!: HTMLDivElement;
  private spacer!: HTMLDivElement;
  private content!: HTMLDivElement;

  set data(value: string[]) {
    this.items = value;
    this.renderVisibleItems();
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });

    this.viewport = document.createElement('div');
    this.spacer = document.createElement('div');
    this.content = document.createElement('div');

    this.viewport.style.cssText = 'height: 320px; overflow: auto; position: relative;';
    this.content.style.cssText = 'position: absolute; inset: 0 auto auto 0; width: 100%;';

    this.viewport.addEventListener('scroll', () =&gt; this.renderVisibleItems());
    this.viewport.append(this.spacer, this.content);
    shadow.append(this.viewport);

    const attrHeight = Number(this.getAttribute('item-height'));
    if (attrHeight &gt; 0) this.itemHeight = attrHeight;

    this.renderVisibleItems();
  }

  private renderVisibleItems() {
    if (!this.viewport || !this.content || !this.spacer) return;

    const viewportHeight = this.viewport.clientHeight;
    const start = Math.max(
      0,
      Math.floor(this.viewport.scrollTop / this.itemHeight) - this.overscan,
    );
    const visibleCount = Math.ceil(viewportHeight / this.itemHeight) + this.overscan * 2;
    const end = Math.min(this.items.length, start + visibleCount);

    this.spacer.style.height = String(this.items.length * this.itemHeight) + 'px';
    this.content.style.transform = 'translateY(' + start * this.itemHeight + 'px)';
    this.content.replaceChildren();

    for (let i = start; i &lt; end; i++) {
      const row = document.createElement('div');
      row.textContent = this.items[i];
      row.style.cssText =
        'height: 48px; display: flex; align-items: center; border-bottom: 1px solid #eee;';
      this.content.append(row);
    }
  }
}

customElements.define('virtual-list', VirtualList);

// 若是動態高度列表，可先算 prefixHeights，再 Binary Search 找 start index
function findStartIndex(prefixHeights: number[], scrollTop: number): number {
  let left = 0;
  let right = prefixHeights.length - 1;

  while (left &lt; right) {
    const mid = Math.floor((left + right) / 2);
    if (prefixHeights[mid] &lt; scrollTop) left = mid + 1;
    else right = mid;
  }

  return left;
}</code></pre>
</dsa-code-block>

<p><strong>實際應用場景</strong>：聊天室、log viewer、商品列表、後台表格、檔案總管。只要列表很長，而且使用者一次只會看到一小段內容，就適合做 Virtual Scroll。</p>

<h3>2. Web Worker 分片</h3>
<p>如果瓶頸不是 DOM，而是大量計算，例如 50,000 筆資料做搜尋、排序、統計、語法分析或 highlight，單純減少 DOM 節點並不能解決卡頓。因為真正被塞滿的是 Main Thread，滑動、點擊、輸入都會一起變慢。</p>
<p>這時要把工作搬到 <strong>Web Worker</strong>。從資料結構角度看，可以把大任務切成多個 chunk，像 queue 一樣一批一批處理；Main Thread 只負責派工、收進度、更新 UI。這就是原本 bullet 提到的「用 message queue 協調」。</p>
<p>在 Web Component 中，常見做法是 element 自己持有 worker 實例。當屬性改變或使用者輸入時，component 發出新 job 給 worker；worker 處理完成後再把結果丟回來。這樣封裝後，外部照樣只是在用一個普通的 custom element。</p>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// search-worker.ts
type SearchJob = {
  jobId: number;
  items: string[];
  keyword: string;
};

self.onmessage = (event: MessageEvent&lt;SearchJob&gt;) =&gt; {
  const { jobId, items, keyword } = event.data;
  const result: string[] = [];
  const chunkSize = 1000;
  let index = 0;

  function processChunk() {
    const end = Math.min(index + chunkSize, items.length);
    for (let i = index; i &lt; end; i++) {
      if (items[i].includes(keyword)) result.push(items[i]);
    }

    index = end;
    self.postMessage({ jobId, type: 'progress', value: index / items.length });

    if (index &lt; items.length) {
      setTimeout(processChunk, 0);
    } else {
      self.postMessage({ jobId, type: 'done', value: result });
    }
  }

  processChunk();
};

// search-panel.ts
class SearchPanel extends HTMLElement {
  private items: string[] = [];
  private latestJobId = 0;
  private worker = new Worker(new URL('./search-worker.ts', import.meta.url), {
    type: 'module',
  });

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML =
      '&lt;input placeholder="search" /&gt;' + '&lt;div id="status"&gt;&lt;/div&gt;' + '&lt;ul id="result"&gt;&lt;/ul&gt;';

    const input = shadow.querySelector('input')!;
    const status = shadow.querySelector('#status') as HTMLDivElement;
    const result = shadow.querySelector('#result') as HTMLUListElement;

    input.addEventListener('input', () =&gt; {
      this.latestJobId += 1;
      status.textContent = 'Searching...';
      this.worker.postMessage({
        jobId: this.latestJobId,
        items: this.items,
        keyword: input.value.trim(),
      });
    });

    this.worker.onmessage = (event) =&gt; {
      const { jobId, type, value } = event.data;
      if (jobId !== this.latestJobId) return;

      if (type === 'progress') {
        status.textContent = 'Progress: ' + Math.round(value * 100) + '%';
      }

      if (type === 'done') {
        status.textContent = 'Done: ' + value.length + ' matches';
        result.replaceChildren(
          ...value.slice(0, 50).map((text: string) =&gt; {
            const li = document.createElement('li');
            li.textContent = text;
            return li;
          }),
        );
      }
    };
  }

  disconnectedCallback() {
    this.worker.terminate();
  }
}

customElements.define('search-panel', SearchPanel);</code></pre>
</dsa-code-block>

<p><strong>實際應用場景</strong>：大檔案全文搜尋、CSV / JSON 匯入後清洗資料、語法高亮、圖片處理、報表聚合、離線索引建立。若資料量更大，還可以搭配 <code>TypedArray</code> 或 transferable objects，減少複製成本。</p>

<h3>3. requestIdleCallback 排程</h3>
<p>有些工作不是一定要立刻做，例如建立搜尋索引、預載下一頁、發 analytics、快取圖片、補做語法高亮。這些工作如果在使用者點開元件的第一時間就全部執行，往往會搶走首次互動的時間。</p>
<p><code>requestIdleCallback</code> 的用途就是把這些「低優先級但仍然需要做」的工作延後到瀏覽器空檔。從 DSA 角度，它很像在維護一個 Priority Queue：高優先級工作先做，低優先級工作排到空閒時段慢慢清掉。</p>
<p>在 Web Component 裡，這很適合用在 <code>connectedCallback()</code> 之後。先把 UI render 出來，再把不影響首屏互動的任務放入 idle queue。這和框架世界常見的 deferred hydration、background precomputation 是同一種思路。</p>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">type IdleTask = {
  priority: number;
  run: () =&gt; void;
};

class SmartFeed extends HTMLElement {
  private queue: IdleTask[] = [];
  private idleId: number | null = null;

  connectedCallback() {
    this.renderShell();

    this.scheduleIdleTask(() =&gt; this.buildSearchIndex(), 1);
    this.scheduleIdleTask(() =&gt; this.prefetchNextPage(), 5);
    this.scheduleIdleTask(() =&gt; this.sendAnalytics(), 10);
  }

  disconnectedCallback() {
    if (this.idleId !== null &amp;&amp; 'cancelIdleCallback' in window) {
      window.cancelIdleCallback(this.idleId);
    }
  }

  private scheduleIdleTask(run: () =&gt; void, priority: number) {
    this.queue.push({ run, priority });
    this.queue.sort((a, b) =&gt; a.priority - b.priority);
    this.requestFlush();
  }

  private requestFlush() {
    if (this.idleId !== null) return;

    const flush = (deadline: IdleDeadline) =&gt; {
      while (this.queue.length &gt; 0 &amp;&amp; deadline.timeRemaining() &gt; 2) {
        const task = this.queue.shift()!;
        task.run();
      }

      this.idleId = null;
      if (this.queue.length &gt; 0) this.requestFlush();
    };

    if ('requestIdleCallback' in window) {
      this.idleId = window.requestIdleCallback(flush);
    } else {
      this.idleId = window.setTimeout(() =&gt; {
        flush({
          didTimeout: false,
          timeRemaining: () =&gt; 8,
        } as IdleDeadline);
      }, 16);
    }
  }

  private renderShell() {
    this.textContent = 'Feed ready';
  }

  private buildSearchIndex() {}
  private prefetchNextPage() {}
  private sendAnalytics() {}
}

customElements.define('smart-feed', SmartFeed);</code></pre>
</dsa-code-block>

<p><strong>實際應用場景</strong>：文件站建立目錄索引、商城頁預抓下一頁商品、文章頁延後高亮 code block、Dashboard 背景建立 filter index。原則很簡單：<strong>會影響點擊、輸入、scroll 的工作先不要搶</strong>，能 idle 做的就 idle 做。</p>
<p>總結來說，這三個技巧分別在解三種不同問題：<strong>Virtual Scroll</strong> 解決「畫太多 DOM」、<strong>Web Worker</strong> 解決「算太重」、<strong>requestIdleCallback</strong> 解決「時機不對」。面試時如果你能先判斷瓶頸屬於哪一類，再提出對應的 Web Component 封裝方式，答案會比只背名詞強很多。</p>

<div class="chapter-footer">
  <a href="#ch22"><span class="footer-label">← 上一章</span><span class="footer-title">Pattern Recognition</span></a>
  <a class="next" href="#ch24"><span class="footer-label">下一章 →</span><span class="footer-title">System Design 中的 DSA</span></a>
</div>
`
