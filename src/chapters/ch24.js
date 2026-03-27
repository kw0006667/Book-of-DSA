export const metadata = {
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
}

export const content = `
<div class="chapter-header">
  <div class="chapter-num">Chapter 24 · Part VII</div>
  <h1>System Design 中的資料結構思維</h1>
  <p>System Design 面試常要求設計一個功能正確且具備良好效能的系統。本章介紹幾個最高頻的設計題，以及背後關鍵的資料結構選擇。</p>
  <div class="chapter-tags">
    <span class="tag tag-ds">Data Structure</span>
    <span class="tag tag-algo">Algorithm</span>
  </div>
</div>

<h2 id="lru-lfu">LRU / LFU Cache 設計</h2>
<h3>LRU Cache（Least Recently Used）</h3>
<p>核心需求：<span class="complexity">O(1)</span> get 和 put，滿容後淘汰最久未使用的。</p>
<p><strong>解法</strong>：Doubly Linked List（維持使用順序）+ HashMap（<span class="complexity">O(1)</span> 存取節點指標）</p>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">class LRUCache {
  private capacity: number;
  private map: Map&lt;number, DoublyNode&gt; = new Map();
  private head = new DoublyNode(0, 0); // dummy
  private tail = new DoublyNode(0, 0); // dummy

  constructor(capacity: number) {
    this.capacity = capacity;
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key: number): number {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key)!;
    this.moveToFront(node);
    return node.val;
  }

  put(key: number, value: number): void {
    if (this.map.has(key)) {
      const node = this.map.get(key)!;
      node.val = value;
      this.moveToFront(node);
    } else {
      const node = new DoublyNode(key, value);
      this.map.set(key, node);
      this.insertFront(node);
      if (this.map.size &gt; this.capacity) {
        const lru = this.tail.prev!;
        this.removeNode(lru);
        this.map.delete(lru.key);
      }
    }
  }

  private moveToFront(node: DoublyNode) {
    this.removeNode(node);
    this.insertFront(node);
  }
  private insertFront(node: DoublyNode) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next!.prev = node;
    this.head.next = node;
  }
  private removeNode(node: DoublyNode) {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }
}

class DoublyNode {
  constructor(
    public key: number,
    public val: number,
    public prev: DoublyNode | null = null,
    public next: DoublyNode | null = null,
  ) {}
}</code></pre>
  <pre slot="python"><code class="language-python">from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)  # 移除最舊的</code></pre>
</dsa-code-block>

<h2 id="rate-limiter">Rate Limiter</h2>
<p>常見算法：</p>
<ul>
  <li><strong>Fixed Window</strong>：每個時間窗口有固定請求上限，用 Hash Map 計數</li>
  <li><strong>Sliding Window</strong>：更精確，用 Sorted Set / Deque 記錄時間戳</li>
  <li><strong>Token Bucket</strong>：桶裡有 token，請求消耗 token，定期補充</li>
  <li><strong>Leaky Bucket</strong>：請求進 Queue，以固定速率出去</li>
</ul>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// Sliding Window Rate Limiter
class RateLimiter {
  private requests: Map&lt;string, number[]&gt; = new Map();

  constructor(
    private maxRequests: number,
    private windowMs: number,
  ) {}

  isAllowed(userId: string): boolean {
    const now = Date.now();
    const times = this.requests.get(userId) ?? [];

    // 清除視窗外的時間戳
    const windowStart = now - this.windowMs;
    const validTimes = times.filter((t) =&gt; t &gt; windowStart);

    if (validTimes.length &gt;= this.maxRequests) return false;

    validTimes.push(now);
    this.requests.set(userId, validTimes);
    return true;
  }
}</code></pre>
  <pre slot="python"><code class="language-python">import time
from collections import defaultdict, deque

class RateLimiter:
    def __init__(self, max_requests: int, window_sec: float):
        self.max_requests = max_requests
        self.window_sec = window_sec
        self.requests: dict[str, deque] = defaultdict(deque)

    def is_allowed(self, user_id: str) -> bool:
        now = time.time()
        window_start = now - self.window_sec
        q = self.requests[user_id]

        # 移除視窗外的時間戳
        while q and q[0] <= window_start:
            q.popleft()

        if len(q) >= self.max_requests:
            return False

        q.append(now)
        return True</code></pre>
</dsa-code-block>

<h2 id="bloom-filter">Bloom Filter & HyperLogLog</h2>
<p><strong>Bloom Filter</strong>：用多個 hash function 和 bit array 判斷元素<strong>是否不存在</strong>（有 false positive，無 false negative）。空間極省，適合快速過濾（如判斷 URL 是否被爬過）。</p>
<p><strong>HyperLogLog</strong>：以極少空間估算 cardinality（不重複元素數），誤差率約 1-2%。Redis 的 <code>PFADD</code> / <code>PFCOUNT</code> 即為此實作。</p>

<h2 id="consistent-hashing">Consistent Hashing</h2>
<p>解決分散式系統中節點增減時，最小化 key 重新分配的問題。用<strong>虛擬節點</strong>（virtual nodes）讓負載更均勻。</p>

<h2 id="message-queue">Message / Priority Queue</h2>
<p>訊息佇列設計要點：</p>
<ul>
  <li><strong>Ordering</strong>：FIFO（Queue）or Priority-based（Heap）</li>
  <li><strong>Persistence</strong>：記憶體（快）vs 磁碟（持久）</li>
  <li><strong>At-least-once / At-most-once / Exactly-once</strong> delivery</li>
  <li><strong>Back-pressure</strong>：生產者過快時如何控制流量</li>
</ul>

<div class="chapter-footer">
  <a href="#ch23"><span class="footer-label">← 上一章</span><span class="footer-title">前端特化題型</span></a>
  <a class="next" href="#ch25"><span class="footer-label">下一章 →</span><span class="footer-title">面試當天的策略</span></a>
</div>
`
