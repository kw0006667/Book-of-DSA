import { getChapterProblemIds, renderProblemList } from '../leetcode/problem-catalog.js'

export const metadata = {
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
}

export const content = `
<div class="chapter-header">
  <div class="chapter-num">Chapter 21 · Part VI</div>
  <h1>Bit Manipulation</h1>
  <p>位元操作讓某些問題得以在 <span class="complexity">O(1)</span> 或 <span class="complexity">O(log n)</span> 內解決，且不需要額外空間。雖然面試不常考，但一旦碰到就是決勝關鍵。</p>
  <div class="chapter-tags">
    <span class="tag tag-algo">Algorithm</span>
  </div>
</div>

<h2 id="basics">Bit 運算基礎</h2>
<table>
  <thead><tr><th>運算</th><th>符號</th><th>範例</th><th>用途</th></tr></thead>
  <tbody>
    <tr><td>AND</td><td><code>&</code></td><td><code>5 & 3 = 1</code></td><td>遮罩、清除 bit</td></tr>
    <tr><td>OR</td><td><code>|</code></td><td><code>5 | 3 = 7</code></td><td>設置 bit</td></tr>
    <tr><td>XOR</td><td><code>^</code></td><td><code>5 ^ 3 = 6</code></td><td>翻轉 bit、找不重複元素</td></tr>
    <tr><td>NOT</td><td><code>~</code></td><td><code>~5 = -6</code></td><td>翻轉所有 bit</td></tr>
    <tr><td>Left Shift</td><td><code><<</code></td><td><code>1 << 3 = 8</code></td><td>乘以 2^n</td></tr>
    <tr><td>Right Shift</td><td><code>>></code></td><td><code>8 >> 1 = 4</code></td><td>除以 2^n</td></tr>
  </tbody>
</table>

<h2 id="techniques">常用技巧</h2>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// 常用位元操作一覽
const n = 13; // 0b1101

// 判斷第 i 位是否為 1
const isBitSet = (n: number, i: number) =&gt; ((n &gt;&gt; i) &amp; 1) === 1;

// 設置第 i 位為 1
const setBit = (n: number, i: number) =&gt; n | (1 &lt;&lt; i);

// 清除第 i 位
const clearBit = (n: number, i: number) =&gt; n &amp; ~(1 &lt;&lt; i);

// 翻轉第 i 位
const toggleBit = (n: number, i: number) =&gt; n ^ (1 &lt;&lt; i);

// 清除最低的 1-bit（Brian Kernighan）
const clearLowestBit = (n: number) =&gt; n &amp; (n - 1);

// 只保留最低的 1-bit
const lowestBit = (n: number) =&gt; n &amp; -n;

// 判斷是否為 2 的冪
const isPowerOf2 = (n: number) =&gt; n &gt; 0 &amp;&amp; (n &amp; (n - 1)) === 0;

// 計算 1-bit 個數（Hamming Weight）
function countBits(n: number): number {
  let count = 0;
  while (n) {
    n &amp;= n - 1;
    count++;
  }
  return count;
}

// 中點（避免溢位）
const mid = (lo: number, hi: number) =&gt; lo + ((hi - lo) &gt;&gt; 1);</code></pre>
  <pre slot="python"><code class="language-python">n = 13  # 0b1101

# 判斷第 i 位
is_bit_set = lambda n, i: (n >> i & 1) == 1

# 設置 / 清除 / 翻轉
set_bit    = lambda n, i: n | (1 << i)
clear_bit  = lambda n, i: n & ~(1 << i)
toggle_bit = lambda n, i: n ^ (1 << i)

# 清除最低的 1-bit
clear_lowest = lambda n: n & (n - 1)

# 判斷是否為 2 的冪
is_power_of_2 = lambda n: n > 0 and (n & (n - 1)) == 0

# 計算 1-bit 個數
def count_bits(n: int) -> int:
    count = 0
    while n:
        n &= n - 1
        count += 1
    return count

# Python 內建
bin(13)           # '0b1101'
bin(13).count('1')  # 3
13.bit_length()   # 4</code></pre>
</dsa-code-block>

<h2 id="lang-diff">Python vs TypeScript 差異</h2>
<table>
  <thead><tr><th></th><th>Python</th><th>TypeScript / JS</th></tr></thead>
  <tbody>
    <tr><td>整數大小</td><td>任意精度（bigint）</td><td>32-bit signed (bitwise ops)</td></tr>
    <tr><td>右移</td><td><code>>></code>（算術）</td><td><code>>></code>（算術）<code>>>></code>（邏輯，填 0）</td></tr>
    <tr><td>NOT</td><td><code>~x = -(x+1)</code></td><td>同 Python</td></tr>
    <tr><td>大整數</td><td>原生支援</td><td>需用 <code>BigInt</code></td></tr>
  </tbody>
</table>

<h2 id="xor">XOR 性質</h2>
<p>XOR 的三個關鍵性質：</p>
<ul>
  <li><code>a ^ a = 0</code>（相同數 XOR 抵消）</li>
  <li><code>a ^ 0 = a</code>（與 0 XOR 不變）</li>
  <li>交換律、結合律成立</li>
</ul>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// 找出只出現一次的數字 — LC #136
function singleNumber(nums: number[]): number {
  return nums.reduce((xor, n) =&gt; xor ^ n, 0);
}

// 不用額外空間交換兩個數
function swapXOR(arr: number[], i: number, j: number): void {
  arr[i] ^= arr[j];
  arr[j] ^= arr[i];
  arr[i] ^= arr[j];
}</code></pre>
  <pre slot="python"><code class="language-python">from functools import reduce
import operator

def single_number(nums: list[int]) -> int:
    return reduce(operator.xor, nums, 0)
    # 或
    result = 0
    for n in nums:
        result ^= n
    return result</code></pre>
</dsa-code-block>

<h3>精選 LeetCode 題目</h3>
${renderProblemList(getChapterProblemIds(21))}

<div class="chapter-footer">
  <a href="#ch20"><span class="footer-label">← 上一章</span><span class="footer-title">Graph 進階演算法</span></a>
  <a class="next" href="#ch22"><span class="footer-label">下一章 →</span><span class="footer-title">Pattern Recognition</span></a>
</div>
`
