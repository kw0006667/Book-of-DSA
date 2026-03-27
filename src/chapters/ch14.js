export const metadata = {
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
}

export const content = `
<div class="chapter-header">
  <div class="chapter-num">Chapter 14 · Part V</div>
  <h1>Two Pointers</h1>
  <p>Two Pointers 用兩個指標在陣列或字串上協作遍歷，將 <span class="complexity">O(n²)</span> 的暴力解優化到 <span class="complexity">O(n)</span>。掌握「對向」和「同向」兩種模式，能解決大量面試題。</p>
  <div class="chapter-tags">
    <span class="tag tag-algo">Algorithm</span>
  </div>
</div>

<h2 id="opposite">對向指標（Opposite Direction）</h2>
<p>左右兩端各一個指標，向中間靠攏。適合有序陣列上的「配對」問題。</p>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// Two Sum II — 有序陣列 LC #167
function twoSumSorted(numbers: number[], target: number): number[] {
  let lo = 0, hi = numbers.length - 1
  while (lo < hi) {
    const sum = numbers[lo] + numbers[hi]
    if (sum === target) return [lo + 1, hi + 1]
    else if (sum < target) lo++
    else hi--
  }
  return []
}

// 反轉字串 — LC #344
function reverseString(s: string[]): void {
  let lo = 0, hi = s.length - 1
  while (lo < hi) {
    ;[s[lo], s[hi]] = [s[hi], s[lo]]
    lo++; hi--
  }
}

// 三數之和 — LC #15
function threeSum(nums: number[]): number[][] {
  nums.sort((a, b) => a - b)
  const result: number[][] = []
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue  // skip duplicates
    let lo = i + 1, hi = nums.length - 1
    while (lo < hi) {
      const sum = nums[i] + nums[lo] + nums[hi]
      if (sum === 0) {
        result.push([nums[i], nums[lo], nums[hi]])
        while (lo < hi && nums[lo] === nums[lo + 1]) lo++
        while (lo < hi && nums[hi] === nums[hi - 1]) hi--
        lo++; hi--
      } else if (sum < 0) lo++
      else hi--
    }
  }
  return result
}</code></pre>
  <pre slot="python"><code class="language-python">def two_sum_sorted(numbers: list[int], target: int) -> list[int]:
    lo, hi = 0, len(numbers) - 1
    while lo < hi:
        s = numbers[lo] + numbers[hi]
        if s == target: return [lo + 1, hi + 1]
        elif s < target: lo += 1
        else: hi -= 1
    return []

def three_sum(nums: list[int]) -> list[list[int]]:
    nums.sort()
    result = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        lo, hi = i + 1, len(nums) - 1
        while lo < hi:
            s = nums[i] + nums[lo] + nums[hi]
            if s == 0:
                result.append([nums[i], nums[lo], nums[hi]])
                while lo < hi and nums[lo] == nums[lo + 1]: lo += 1
                while lo < hi and nums[hi] == nums[hi - 1]: hi -= 1
                lo += 1; hi -= 1
            elif s < 0: lo += 1
            else: hi -= 1
    return result</code></pre>
</dsa-code-block>

<h2 id="same-direction">同向指標（Fast & Slow / Same Direction）</h2>
<p>兩個指標同向移動，常用於 in-place 移除元素、找重複等。</p>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// 移除重複元素 — LC #26
function removeDuplicates(nums: number[]): number {
  let slow = 0
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++
      nums[slow] = nums[fast]
    }
  }
  return slow + 1
}

// 移動零到末尾 — LC #283
function moveZeroes(nums: number[]): void {
  let slow = 0
  for (let fast = 0; fast < nums.length; fast++) {
    if (nums[fast] !== 0) {
      nums[slow] = nums[fast]
      slow++
    }
  }
  for (; slow < nums.length; slow++) nums[slow] = 0
}</code></pre>
  <pre slot="python"><code class="language-python">def remove_duplicates(nums: list[int]) -> int:
    slow = 0
    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:
            slow += 1
            nums[slow] = nums[fast]
    return slow + 1

def move_zeroes(nums: list[int]) -> None:
    slow = 0
    for fast in range(len(nums)):
        if nums[fast] != 0:
            nums[slow] = nums[fast]
            slow += 1
    while slow < len(nums):
        nums[slow] = 0
        slow += 1</code></pre>
</dsa-code-block>

<h2 id="three-pointers">Three Pointers</h2>
<p>荷蘭國旗問題（Dutch National Flag）：將陣列分成三個區域，使用三個指標維護各區域邊界。</p>

<dsa-code-block>
  <pre slot="typescript"><code class="language-typescript">// Sort Colors (0, 1, 2) — LC #75
function sortColors(nums: number[]): void {
  let lo = 0, mid = 0, hi = nums.length - 1
  while (mid <= hi) {
    if (nums[mid] === 0) {
      ;[nums[lo], nums[mid]] = [nums[mid], nums[lo]]
      lo++; mid++
    } else if (nums[mid] === 1) {
      mid++
    } else {
      ;[nums[mid], nums[hi]] = [nums[hi], nums[mid]]
      hi--
      // 注意：此處不移動 mid，因為換過來的值未驗證
    }
  }
}</code></pre>
  <pre slot="python"><code class="language-python">def sort_colors(nums: list[int]) -> None:
    lo, mid, hi = 0, 0, len(nums) - 1
    while mid <= hi:
        if nums[mid] == 0:
            nums[lo], nums[mid] = nums[mid], nums[lo]
            lo += 1; mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[hi] = nums[hi], nums[mid]
            hi -= 1</code></pre>
</dsa-code-block>

<h2 id="when-to-use">使用時機</h2>
<div class="callout callout-tip">
  <div class="callout-title">Two Pointers 適用信號</div>
  <ul>
    <li>陣列/字串已排序，或排序後可以解題</li>
    <li>需要找「配對」（pair）或「三元組」</li>
    <li>需要 in-place 操作（移除、壓縮）</li>
    <li>回文檢驗</li>
    <li>Linked List 的中點、環路（Fast & Slow）</li>
  </ul>
</div>

<h3>精選 LeetCode 題目</h3>
<ul class="problem-list">
  <li class="problem-item"><span class="problem-id">#167</span><span class="problem-name">Two Sum II - Input Array Is Sorted</span><span class="diff diff-medium">Medium</span></li>
  <li class="problem-item"><span class="problem-id">#15</span><span class="problem-name">3Sum</span><span class="diff diff-medium">Medium</span></li>
  <li class="problem-item"><span class="problem-id">#11</span><span class="problem-name">Container With Most Water</span><span class="diff diff-medium">Medium</span></li>
  <li class="problem-item"><span class="problem-id">#42</span><span class="problem-name">Trapping Rain Water</span><span class="diff diff-hard">Hard</span></li>
  <li class="problem-item"><span class="problem-id">#75</span><span class="problem-name">Sort Colors</span><span class="diff diff-medium">Medium</span></li>
</ul>

<div class="chapter-footer">
  <a href="#ch13"><span class="footer-label">← 上一章</span><span class="footer-title">Binary Search</span></a>
  <a class="next" href="#ch15"><span class="footer-label">下一章 →</span><span class="footer-title">Sliding Window</span></a>
</div>
`
