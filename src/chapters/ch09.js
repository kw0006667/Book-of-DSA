export const metadata = {
  id: 9, part: 3,
  slug: 'trie',
  title: 'Trie (Prefix Tree)',
  tags: ['ds', 'fe'],
  sections: [
    { slug: 'structure', title: 'Trie 結構與操作' },
    { slug: 'implementations', title: '語言實作' },
    { slug: 'space-opt', title: 'Space 優化' },
  ]
}

export const content = `
<div class="chapter-header">
  <div class="chapter-num">Chapter 09 · Part III</div>
  <h1>Trie (Prefix Tree)</h1>
  <p>Trie 是一種多叉樹，每個節點代表一個字元，從根到某節點的路徑代表一個字串前綴。Autocomplete、URL routing、拼字檢查等場景的理想工具。</p>
  <div class="chapter-tags">
    <span class="tag tag-ds">Data Structure</span>
    <span class="tag tag-fe">Frontend</span>
  </div>
</div>

<h2 id="structure">Trie 結構與操作</h2>
<table>
  <thead><tr><th>操作</th><th>Time</th><th>說明</th></tr></thead>
  <tbody>
    <tr><td>insert(word)</td><td><span class="complexity">O(m)</span></td><td>m = 單字長度</td></tr>
    <tr><td>search(word)</td><td><span class="complexity">O(m)</span></td><td></td></tr>
    <tr><td>startsWith(prefix)</td><td><span class="complexity">O(m)</span></td><td></td></tr>
  </tbody>
</table>

<h2 id="implementations">語言實作</h2>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">class TrieNode {
  children: Map<string, TrieNode> = new Map()
  isEnd = false
}

class Trie {
  private root = new TrieNode()

  insert(word: string): void {
    let node = this.root
    for (const ch of word) {
      if (!node.children.has(ch)) {
        node.children.set(ch, new TrieNode())
      }
      node = node.children.get(ch)!
    }
    node.isEnd = true
  }

  search(word: string): boolean {
    const node = this._traverse(word)
    return node !== null && node.isEnd
  }

  startsWith(prefix: string): boolean {
    return this._traverse(prefix) !== null
  }

  // 取得所有以 prefix 開頭的單字
  autocomplete(prefix: string): string[] {
    const node = this._traverse(prefix)
    if (!node) return []
    const results: string[] = []
    this._dfs(node, prefix, results)
    return results
  }

  private _traverse(s: string): TrieNode | null {
    let node = this.root
    for (const ch of s) {
      if (!node.children.has(ch)) return null
      node = node.children.get(ch)!
    }
    return node
  }

  private _dfs(node: TrieNode, current: string, results: string[]): void {
    if (node.isEnd) results.push(current)
    for (const [ch, child] of node.children) {
      this._dfs(child, current + ch, results)
    }
  }
}</code></pre>
  <pre slot="python"><code class="language-python">class TrieNode:
    def __init__(self):
        self.children: dict[str, 'TrieNode'] = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True

    def search(self, word: str) -> bool:
        node = self._traverse(word)
        return node is not None and node.is_end

    def starts_with(self, prefix: str) -> bool:
        return self._traverse(prefix) is not None

    def autocomplete(self, prefix: str) -> list[str]:
        node = self._traverse(prefix)
        if not node:
            return []
        results = []
        self._dfs(node, prefix, results)
        return results

    def _traverse(self, s: str):
        node = self.root
        for ch in s:
            if ch not in node.children:
                return None
            node = node.children[ch]
        return node

    def _dfs(self, node: TrieNode, current: str, results: list) -> None:
        if node.is_end:
            results.append(current)
        for ch, child in node.children.items():
            self._dfs(child, current + ch, results)</code></pre>
</dsa-code-block>

<h2 id="space-opt">Space 優化</h2>
<p>用固定大小的 Array（26 個字母）代替 Map，減少 overhead：</p>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">class TrieNodeCompact {
  children: (TrieNodeCompact | null)[] = new Array(26).fill(null)
  isEnd = false
}

// 字元 → index
const idx = (ch: string) => ch.charCodeAt(0) - 'a'.charCodeAt(0)</code></pre>
  <pre slot="python"><code class="language-python">class TrieNodeCompact:
    def __init__(self):
        self.children = [None] * 26
        self.is_end = False

def char_idx(ch: str) -> int:
    return ord(ch) - ord('a')</code></pre>
</dsa-code-block>

<div class="callout callout-fe">
  <div class="callout-title">前端應用場景</div>
  <ul>
    <li><strong>Autocomplete / Typeahead</strong>：搜尋框輸入時即時提示，Trie 的 <code>startsWith</code> 讓前綴匹配 <span class="complexity">O(m)</span></li>
    <li><strong>URL Routing</strong>：前端 Router（React Router、Vue Router）的路徑匹配本質是 Trie</li>
    <li><strong>Spell Checker</strong>：偵測輸入錯誤時，在 Trie 中搜尋近似單字</li>
    <li><strong>@mentions 功能</strong>：輸入 <code>@</code> 後從使用者列表做前綴搜尋</li>
  </ul>
</div>

<h3>精選 LeetCode 題目</h3>
<ul class="problem-list">
  <li class="problem-item"><span class="problem-id">#208</span><span class="problem-name">Implement Trie (Prefix Tree)</span><span class="diff diff-medium">Medium</span></li>
  <li class="problem-item"><span class="problem-id">#212</span><span class="problem-name">Word Search II</span><span class="diff diff-hard">Hard</span></li>
  <li class="problem-item"><span class="problem-id">#211</span><span class="problem-name">Design Add and Search Words Data Structure</span><span class="diff diff-medium">Medium</span></li>
</ul>

<div class="chapter-footer">
  <a href="#ch8"><span class="footer-label">← 上一章</span><span class="footer-title">Heap 與 Priority Queue</span></a>
  <a class="next" href="#ch10"><span class="footer-label">下一章 →</span><span class="footer-title">Graph</span></a>
</div>
`
