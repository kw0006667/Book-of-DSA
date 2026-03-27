import { additionalProblemDetails } from './problem-data-extended.js'
import { approach, detailedApproach, problem } from './problem-helpers.js'

const baseProblemDetails = {
  1: problem({
    id: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    statement: '給定整數陣列 nums 與整數 target，請找出兩個不同索引，使得兩個位置上的數字和等於 target，並回傳這兩個索引。',
    focus: '這題主要考的是「把兩數和」改寫成「目前數字需要什麼補數」的能力。重點不是配對本身，而是你能不能在掃描過程中把歷史資訊用 O(1) 結構保留下來。',
    dataStructureChoice: '最合適的資料結構是 Hash Map。因為題目要頻繁回答「target - num 之前有沒有看過」，這正是 Hash Map 的查詢強項。若用陣列或排序後雙指標，會失去原始索引或增加額外處理成本。',
    strategy: [
      '把每個數字 num 轉成一個查詢需求 need = target - num。',
      '在掃描到當前位置 i 時，先查 Hash Map 裡是否已經出現過 need。',
      '如果有，代表之前那個索引加上目前 i 就是答案。',
      '如果沒有，再把目前 num 與索引 i 放進 Hash Map，供之後元素使用。',
    ],
    examples: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: '因為 nums[0] + nums[1] = 2 + 7 = 9。',
      },
    ],
    techniques: ['Hash Map', 'Complement Lookup', '單次線性掃描'],
    approaches: [
      detailedApproach({
        name: 'Brute Force',
        idea: '雙層迴圈枚舉所有 pair，檢查 nums[i] + nums[j] 是否等於 target。',
        time: 'O(n^2)',
        space: 'O(1)',
        pros: ['直觀，容易在白板上快速講清楚。', '不需要額外資料結構。'],
        cons: ['時間複雜度太高，無法利用已掃描資訊。', '資料量一大就會明顯變慢。'],
        whenToUse: '通常只適合當成最初始思路，或面試中先講 baseline。',
      }),
      detailedApproach({
        name: 'Hash Map',
        idea: '掃描每個數字 x 時，先查 target - x 是否已出現，再把 x 放進表中。',
        time: 'O(n)',
        space: 'O(n)',
        recommended: true,
        pros: ['單次掃描即可完成。', '保留索引容易，實作短。', '是面試官最期待的標準答案。'],
        cons: ['需要額外 O(n) 空間。', '依賴 Hash 結構。'],
        whenToUse: '當題目要求 pair 查找、補數查找、一次掃描完成時，優先考慮。',
      }),
    ],
    python: String.raw`class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}

        for i, num in enumerate(nums):
            need = target - num
            if need in seen:
                return [seen[need], i]
            seen[num] = i

        return []`,
    typescript: String.raw`function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) {
      return [seen.get(need)!, i];
    }
    seen.set(nums[i], i);
  }

  return [];
}`,
  }),
  3: problem({
    id: 3,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    statement: '找出字串中不含重複字元的最長子字串長度。',
    focus: '這題考的是 Sliding Window 的判斷時機。關鍵不是列舉所有子字串，而是維持一段「目前合法」的區間，當右邊加入一個字元後，如果出現重複，就從左邊收縮直到重新合法。',
    dataStructureChoice: '需要能快速知道某個字元上次出現在哪裡，所以用 Hash Map 記錄 last seen index 最合適。若只用 Set，也能做，但左指標通常會收得比較慢。',
    strategy: [
      '用 left、right 維護當前不重複區間。',
      '每讀到一個字元 ch，檢查它上次出現的位置是否仍在目前窗口內。',
      '如果是，就把 left 跳到該位置後一格。',
      '更新答案為 right - left + 1 的最大值。',
    ],
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: '最長不重複子字串是 "abc"。',
      },
    ],
    techniques: ['Sliding Window', 'Hash Set / Map', '雙指標'],
    approaches: [
      detailedApproach({
        name: 'Brute Force',
        idea: '檢查每個起點往右延伸的所有子字串，驗證是否有重複。',
        time: 'O(n^2)',
        space: 'O(n)',
        pros: ['容易想到。', '可作為 Sliding Window 的對照組。'],
        cons: ['會重複檢查大量區間。', '不適合長字串。'],
        whenToUse: '只適合作為 baseline 思路。',
      }),
      detailedApproach({
        name: 'Sliding Window + Last Seen Index',
        idea: '維持一個不重複區間，右指標擴張；一旦重複，left 直接跳到該字元上次出現位置後面。',
        time: 'O(n)',
        space: 'O(min(n, charset))',
        recommended: true,
        pros: ['每個字元只被有效處理一次。', 'left 可以跳躍而非一步一步移動。'],
        cons: ['需要理解窗口不變式。'],
        whenToUse: '凡是題目要求最長/最短合法子字串，且合法性可由窗口內容維護時，非常適合。',
      }),
    ],
    python: String.raw`class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        last_seen = {}
        left = 0
        best = 0

        for right, ch in enumerate(s):
            if ch in last_seen and last_seen[ch] >= left:
                left = last_seen[ch] + 1
            last_seen[ch] = right
            best = max(best, right - left + 1)

        return best`,
    typescript: String.raw`function lengthOfLongestSubstring(s: string): number {
  const lastSeen = new Map<string, number>();
  let left = 0;
  let best = 0;

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (lastSeen.has(ch) && lastSeen.get(ch)! >= left) {
      left = lastSeen.get(ch)! + 1;
    }
    lastSeen.set(ch, right);
    best = Math.max(best, right - left + 1);
  }

  return best;
}`,
  }),
  20: problem({
    id: 20,
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    statement: '給定只包含 ()[]{} 的字串，判斷括號是否成對且順序合法。',
    focus: '這題在考 stack 是否會自然地出現在你的腦中。因為括號的匹配順序是「最後進來的左括號，要最先被關掉」，這正是 LIFO 結構。',
    dataStructureChoice: 'Stack 是最適合的結構，因為每遇到一個右括號，都只需要檢查最近尚未匹配的左括號。',
    strategy: [
      '遇到左括號就先推進 stack。',
      '遇到右括號就檢查 stack 是否為空，或頂端左括號是否能正確匹配。',
      '若不能匹配，立刻回傳 false。',
      '最後若 stack 為空，代表所有括號都正確配對。',
    ],
    examples: [
      {
        input: 's = "()[]{}"',
        output: 'true',
        explanation: '每個右括號都能對應最近的同型左括號。',
      },
    ],
    techniques: ['Stack', '配對映射', 'LIFO'],
    approaches: [
      approach('反覆消字串', '不斷把 ()、[]、{} 替換掉，但效率差。', 'O(n^2)', 'O(n)'),
      approach('Stack', '遇到左括號就 push，遇到右括號時檢查棧頂是否匹配。', 'O(n)', 'O(n)', true),
    ],
    python: String.raw`class Solution:
    def isValid(self, s: str) -> bool:
        pairs = {')': '(', ']': '[', '}': '{'}
        stack = []

        for ch in s:
            if ch in pairs:
                if not stack or stack[-1] != pairs[ch]:
                    return False
                stack.pop()
            else:
                stack.append(ch)

        return not stack`,
    typescript: String.raw`function isValid(s: string): boolean {
  const pairs = new Map<string, string>([
    [')', '('],
    [']', '['],
    ['}', '{'],
  ]);
  const stack: string[] = [];

  for (const ch of s) {
    if (pairs.has(ch)) {
      if (stack.length === 0 || stack[stack.length - 1] !== pairs.get(ch)) {
        return false;
      }
      stack.pop();
    } else {
      stack.push(ch);
    }
  }

  return stack.length === 0;
}`,
  }),
  21: problem({
    id: 21,
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    statement: '將兩條已排序的 linked list 合併成一條同樣排序好的 linked list。',
    examples: [
      {
        input: 'list1 = [1,2,4], list2 = [1,3,4]',
        output: '[1,1,2,3,4,4]',
        explanation: '每次接上較小節點即可保持排序。',
      },
    ],
    techniques: ['Linked List', 'Dummy Head', '雙指標'],
    approaches: [
      approach('遞迴', '每次選小的節點遞迴接下去。', 'O(n + m)', 'O(n + m)'),
      approach('迭代', '使用 dummy head 線性合併兩條串列。', 'O(n + m)', 'O(1)', true),
    ],
    python: String.raw`# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def mergeTwoLists(self, list1, list2):
        dummy = ListNode()
        tail = dummy

        while list1 and list2:
            if list1.val <= list2.val:
                tail.next = list1
                list1 = list1.next
            else:
                tail.next = list2
                list2 = list2.next
            tail = tail.next

        tail.next = list1 or list2
        return dummy.next`,
    typescript: String.raw`function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  let tail = dummy;

  while (list1 && list2) {
    if (list1.val <= list2.val) {
      tail.next = list1;
      list1 = list1.next;
    } else {
      tail.next = list2;
      list2 = list2.next;
    }
    tail = tail.next;
  }

  tail.next = list1 ?? list2;
  return dummy.next;
}`,
  }),
  41: problem({
    id: 41,
    title: 'First Missing Positive',
    difficulty: 'Hard',
    statement: '在未排序整數陣列中找出最小缺失的正整數，且要求 O(n) 時間與 O(1) 額外空間。',
    focus: '這題真正考的是「把值映射到索引」。因為正整數 1 應該對應到索引 0、2 對應索引 1，以此類推，所以這題不是單純找缺少的數，而是考你能否用陣列本身當作 hash table。',
    dataStructureChoice: '題目明確限制 O(1) 額外空間，所以不能直接用 set 當最終解。最佳策略是原地交換，把每個值放到它理論上該在的位置。',
    strategy: [
      '只有 1 到 n 之間的值才可能影響答案，其他值可忽略。',
      '對每個位置 i，不斷把 nums[i] 放到 nums[i] - 1 的正確位置。',
      '完成後再次掃描，第一個 nums[i] != i + 1 的地方就是答案。',
      '如果 1 到 n 都在正確位置，答案就是 n + 1。',
    ],
    examples: [
      {
        input: 'nums = [3,4,-1,1]',
        output: '2',
        explanation: '1 已存在，2 缺失，因此答案是 2。',
      },
    ],
    techniques: ['Index Placement', 'Cyclic Sort 思想', 'In-place Hashing'],
    approaches: [
      detailedApproach({
        name: 'Sort',
        idea: '先排序，再找第一個缺失的正整數。',
        time: 'O(n log n)',
        space: 'O(1) 或 O(n)',
        pros: ['直觀。', '容易驗證正確性。'],
        cons: ['不符合題目要求的 O(n) 時間。', '沒有利用索引與值的對應關係。'],
        whenToUse: '若沒有嚴格的線性時間要求，可以先想到這個版本。',
      }),
      detailedApproach({
        name: 'Index Placement / Cyclic Sort 思想',
        idea: '把值 x 放到索引 x - 1 的位置，最後找第一個 nums[i] != i + 1。',
        time: 'O(n)',
        space: 'O(1)',
        recommended: true,
        pros: ['完全符合題目要求。', '把陣列本身當作位置索引，技巧性高。'],
        cons: ['實作細節較多，容易寫出死迴圈。', '需要先想清楚交換條件。'],
        whenToUse: '題目同時要求線性時間、常數空間，且資料本身可對應索引時。',
      }),
    ],
    python: String.raw`class Solution:
    def firstMissingPositive(self, nums: list[int]) -> int:
        n = len(nums)

        for i in range(n):
            while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:
                correct = nums[i] - 1
                nums[i], nums[correct] = nums[correct], nums[i]

        for i, num in enumerate(nums):
            if num != i + 1:
                return i + 1

        return n + 1`,
    typescript: String.raw`function firstMissingPositive(nums: number[]): number {
  const n = nums.length;

  for (let i = 0; i < n; i++) {
    while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
      const correct = nums[i] - 1;
      [nums[i], nums[correct]] = [nums[correct], nums[i]];
    }
  }

  for (let i = 0; i < n; i++) {
    if (nums[i] !== i + 1) return i + 1;
  }

  return n + 1;
}`,
  }),
  48: problem({
    id: 48,
    title: 'Rotate Image',
    difficulty: 'Medium',
    statement: '將 n x n 矩陣順時針旋轉 90 度，必須原地修改矩陣。',
    focus: '這題考的是矩陣座標轉換與原地操作。你要能把「旋轉」拆成幾個更穩定、更容易實作的子操作，而不是硬背公式。',
    dataStructureChoice: '題目要求 in-place，所以不應該建立第二個矩陣當答案。最佳作法是利用矩陣可沿主對角線轉置，再對每列反轉，組合成旋轉效果。',
    strategy: [
      '先觀察順時針旋轉等於「轉置 + 每列反轉」。',
      '轉置會把 (r, c) 變成 (c, r)。',
      '每列反轉後，就完成 (r, c) -> (c, n - 1 - r) 的目標映射。',
      '兩步都可原地完成，因此符合空間要求。',
    ],
    examples: [
      {
        input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]',
        output: '[[7,4,1],[8,5,2],[9,6,3]]',
        explanation: '先轉置再反轉每一列即可完成順時針旋轉。',
      },
    ],
    techniques: ['Matrix', 'Transpose', 'Reverse Row', 'In-place'],
    approaches: [
      detailedApproach({
        name: '額外矩陣映射',
        idea: '建立新矩陣，把座標 (r, c) 映射到 (c, n - 1 - r)。',
        time: 'O(n^2)',
        space: 'O(n^2)',
        pros: ['思路非常直覺。', '公式清楚、好驗證。'],
        cons: ['不符合 in-place 要求。'],
        whenToUse: '若題目不限制空間，這是最容易先想到的版本。',
      }),
      detailedApproach({
        name: '轉置 + 反轉',
        idea: '先主對角線轉置，再把每一列反轉。',
        time: 'O(n^2)',
        space: 'O(1)',
        recommended: true,
        pros: ['符合 in-place。', '結構規律，容易拆成兩個步驟講解。'],
        cons: ['需要知道矩陣變換的等價關係。'],
        whenToUse: '矩陣旋轉、翻轉題若要求原地修改時優先考慮。',
      }),
    ],
    python: String.raw`class Solution:
    def rotate(self, matrix: list[list[int]]) -> None:
        n = len(matrix)

        for i in range(n):
            for j in range(i + 1, n):
                matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]

        for row in matrix:
            row.reverse()`,
    typescript: String.raw`function rotate(matrix: number[][]): void {
  const n = matrix.length;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }

  for (const row of matrix) {
    row.reverse();
  }
}`,
  }),
  49: problem({
    id: 49,
    title: 'Group Anagrams',
    difficulty: 'Medium',
    statement: '將互為 anagram 的字串分到同一組。',
    examples: [
      {
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        output: '[["eat","tea","ate"],["tan","nat"],["bat"]]',
        explanation: '排序後字母序相同的字串必屬於同一組。',
      },
    ],
    techniques: ['Hash Map', '字串正規化', 'Sorting Key / Frequency Key'],
    approaches: [
      approach('排序字串做 key', '把每個字串排序後當成 key。', 'O(n * k log k)', 'O(nk)', true),
      approach('26 字頻做 key', '對小寫字母可用固定長度頻率陣列當 key。', 'O(nk)', 'O(nk)'),
    ],
    python: String.raw`from collections import defaultdict

class Solution:
    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:
        groups = defaultdict(list)

        for s in strs:
            key = ''.join(sorted(s))
            groups[key].append(s)

        return list(groups.values())`,
    typescript: String.raw`function groupAnagrams(strs: string[]): string[][] {
  const groups = new Map<string, string[]>();

  for (const word of strs) {
    const key = [...word].sort().join('');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(word);
  }

  return [...groups.values()];
}`,
  }),
  54: problem({
    id: 54,
    title: 'Spiral Matrix',
    difficulty: 'Medium',
    statement: '按照螺旋順序輸出矩陣中的所有元素。',
    examples: [
      {
        input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]',
        output: '[1,2,3,6,9,8,7,4,5]',
        explanation: '依序走上邊、右邊、下邊、左邊，並持續收縮邊界。',
      },
    ],
    techniques: ['Matrix Boundary', '模擬', '四方向遍歷'],
    approaches: [
      approach('Visited 標記', '用方向與 visited 陣列模擬。', 'O(mn)', 'O(mn)'),
      approach('Boundary 收縮', '維護 top、bottom、left、right 四個邊界。', 'O(mn)', 'O(1)', true),
    ],
    python: String.raw`class Solution:
    def spiralOrder(self, matrix: list[list[int]]) -> list[int]:
        result = []
        top, bottom = 0, len(matrix) - 1
        left, right = 0, len(matrix[0]) - 1

        while top <= bottom and left <= right:
            for col in range(right - left + 1):
                result.append(matrix[top][left + col])
            top += 1

            for row in range(top, bottom + 1):
                result.append(matrix[row][right])
            right -= 1

            if top <= bottom:
                for col in range(right, left - 1, -1):
                    result.append(matrix[bottom][col])
                bottom -= 1

            if left <= right:
                for row in range(bottom, top - 1, -1):
                    result.append(matrix[row][left])
                left += 1

        return result`,
    typescript: String.raw`function spiralOrder(matrix: number[][]): number[] {
  const result: number[] = [];
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    for (let col = left; col <= right; col++) result.push(matrix[top][col]);
    top++;

    for (let row = top; row <= bottom; row++) result.push(matrix[row][right]);
    right--;

    if (top <= bottom) {
      for (let col = right; col >= left; col--) result.push(matrix[bottom][col]);
      bottom--;
    }

    if (left <= right) {
      for (let row = bottom; row >= top; row--) result.push(matrix[row][left]);
      left++;
    }
  }

  return result;
}`,
  }),
  76: problem({
    id: 76,
    title: 'Minimum Window Substring',
    difficulty: 'Hard',
    statement: '在字串 s 中找出最短子字串，使其包含字串 t 的所有字元與數量。',
    focus: '這題考的是「最短合法窗口」。和一般最長窗口題不同，這題要在窗口合法後不斷收縮，直到剛好失效為止，因此需要精準維護每個字元數量與窗口是否已滿足需求。',
    dataStructureChoice: '因為要追蹤字元需求與目前窗口內的頻率，Hash Map 或固定字元集陣列都很適合。關鍵是要能 O(1) 更新與比對。',
    strategy: [
      '先用 need 紀錄 t 每個字元需求量。',
      '右指標持續擴張窗口，直到所有需求都被滿足。',
      '一旦合法，開始移動左指標縮小窗口，並持續更新目前最短答案。',
      '當某個必要字元數量不足時，窗口失效，再回到擴張階段。',
    ],
    examples: [
      {
        input: 's = "ADOBECODEBANC", t = "ABC"',
        output: '"BANC"',
        explanation: 'BANC 是最短且同時覆蓋 A、B、C 的區間。',
      },
    ],
    techniques: ['Sliding Window', 'Frequency Count', '雙指標'],
    approaches: [
      detailedApproach({
        name: '枚舉所有子字串',
        idea: '每個起點都往後找覆蓋條件，再取最短。',
        time: 'O(n^2)',
        space: 'O(k)',
        pros: ['思路直接。'],
        cons: ['完全沒有利用窗口之間的大量重疊。', '時間複雜度太高。'],
        whenToUse: '只適合做 baseline。',
      }),
      detailedApproach({
        name: 'Sliding Window + Frequency Count',
        idea: '右指標擴張直到覆蓋，左指標再收縮求最短。',
        time: 'O(n)',
        space: 'O(k)',
        recommended: true,
        pros: ['是最標準的最短覆蓋窗口模板。', '每個字元最多進出窗口一次。'],
        cons: ['條件維護較容易寫錯。', '需要小心處理 have / required 邏輯。'],
        whenToUse: '當題目要求最短區間且合法條件能由字元頻率維護時。',
      }),
    ],
    python: String.raw`from collections import Counter

class Solution:
    def minWindow(self, s: str, t: str) -> str:
        need = Counter(t)
        window = {}
        have = 0
        required = len(need)
        left = 0
        best = (float('inf'), 0, 0)

        for right, ch in enumerate(s):
            window[ch] = window.get(ch, 0) + 1
            if ch in need and window[ch] == need[ch]:
                have += 1

            while have == required:
                if right - left + 1 < best[0]:
                    best = (right - left + 1, left, right)

                left_ch = s[left]
                window[left_ch] -= 1
                if left_ch in need and window[left_ch] < need[left_ch]:
                    have -= 1
                left += 1

        if best[0] == float('inf'):
            return ''
        return s[best[1]:best[2] + 1]`,
    typescript: String.raw`function minWindow(s: string, t: string): string {
  const need = new Map<string, number>();
  for (const ch of t) need.set(ch, (need.get(ch) ?? 0) + 1);

  const window = new Map<string, number>();
  let have = 0;
  const required = need.size;
  let left = 0;
  let bestLen = Infinity;
  let bestStart = 0;

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    window.set(ch, (window.get(ch) ?? 0) + 1);
    if (need.has(ch) && window.get(ch) === need.get(ch)) have++;

    while (have === required) {
      if (right - left + 1 < bestLen) {
        bestLen = right - left + 1;
        bestStart = left;
      }

      const leftCh = s[left];
      window.set(leftCh, window.get(leftCh)! - 1);
      if (need.has(leftCh) && window.get(leftCh)! < need.get(leftCh)!) {
        have--;
      }
      left++;
    }
  }

  return bestLen === Infinity ? '' : s.slice(bestStart, bestStart + bestLen);
}`,
  }),
  79: problem({
    id: 79,
    title: 'Word Search',
    difficulty: 'Medium',
    statement: '判斷一個單字是否能在 board 中由上下左右相鄰的格子依序拼出，同一格不能重複使用。',
    examples: [
      {
        input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"',
        output: 'true',
        explanation: '可以透過 DFS 路徑找到該單字。',
      },
    ],
    techniques: ['DFS', 'Backtracking', 'Grid Search'],
    approaches: [
      approach('枚舉起點 + DFS', '從每個格子出發做回溯搜尋。', 'O(mn * 4^L)', 'O(L)', true),
      approach('額外 visited 陣列', '思路相同，但要額外記錄走過的格子。', 'O(mn * 4^L)', 'O(mn)'),
    ],
    python: String.raw`class Solution:
    def exist(self, board: list[list[str]], word: str) -> bool:
        rows, cols = len(board), len(board[0])

        def dfs(r: int, c: int, i: int) -> bool:
            if i == len(word):
                return True
            if r < 0 or r >= rows or c < 0 or c >= cols or board[r][c] != word[i]:
                return False

            temp = board[r][c]
            board[r][c] = '#'

            found = (
                dfs(r + 1, c, i + 1) or
                dfs(r - 1, c, i + 1) or
                dfs(r, c + 1, i + 1) or
                dfs(r, c - 1, i + 1)
            )

            board[r][c] = temp
            return found

        for r in range(rows):
            for c in range(cols):
                if dfs(r, c, 0):
                    return True

        return False`,
    typescript: String.raw`function exist(board: string[][], word: string): boolean {
  const rows = board.length;
  const cols = board[0].length;

  function dfs(r: number, c: number, i: number): boolean {
    if (i === word.length) return true;
    if (r < 0 || r >= rows || c < 0 || c >= cols || board[r][c] !== word[i]) {
      return false;
    }

    const temp = board[r][c];
    board[r][c] = '#';
    const found =
      dfs(r + 1, c, i + 1) || dfs(r - 1, c, i + 1) || dfs(r, c + 1, i + 1) || dfs(r, c - 1, i + 1);
    board[r][c] = temp;

    return found;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (dfs(r, c, 0)) return true;
    }
  }

  return false;
}`,
  }),
  128: problem({
    id: 128,
    title: 'Longest Consecutive Sequence',
    difficulty: 'Medium',
    statement: '在未排序陣列中找出最長的連續整數序列長度，要求 O(n) 時間。',
    focus: '這題考的是「避免從每個點重複展開」。如果你能只從序列起點開始檢查，每個元素就只會被有效處理一次。',
    dataStructureChoice: '最適合用 Hash Set。因為你需要快速判斷 x - 1 或 x + 1 是否存在，而這種 membership query 用 set 是最直接的。',
    strategy: [
      '先把所有數字放進 set，讓存在查詢變成 O(1)。',
      '只從沒有前驅 num - 1 的數字開始，因為它才可能是連續段起點。',
      '從起點一路往右檢查 num + 1、num + 2 是否存在。',
      '更新最長長度即可。',
    ],
    examples: [
      {
        input: 'nums = [100,4,200,1,3,2]',
        output: '4',
        explanation: '最長連續序列為 [1,2,3,4]。',
      },
    ],
    techniques: ['Hash Set', 'Sequence Start', '線性掃描'],
    approaches: [
      detailedApproach({
        name: 'Sort',
        idea: '排序後線性掃描求連續段長度。',
        time: 'O(n log n)',
        space: 'O(1)',
        pros: ['好想、好寫、好 debug。'],
        cons: ['不符合題目要求的 O(n)。', '排序本身比 membership query 更昂貴。'],
        whenToUse: '若沒有線性時間限制，這會是穩健做法。',
      }),
      detailedApproach({
        name: 'Hash Set + Sequence Start',
        idea: '只從沒有前驅 x - 1 的數字開始往右延伸。',
        time: 'O(n)',
        space: 'O(n)',
        recommended: true,
        pros: ['符合題目要求。', '每個數字只會在伸展過程中被走訪一次。'],
        cons: ['需要先抓到「只從起點開始」這個關鍵。'],
        whenToUse: '看到題目要求在線性時間內找連續段，且只需要判斷元素存在與否時。',
      }),
    ],
    python: String.raw`class Solution:
    def longestConsecutive(self, nums: list[int]) -> int:
        num_set = set(nums)
        best = 0

        for num in num_set:
            if num - 1 in num_set:
                continue

            length = 1
            current = num
            while current + 1 in num_set:
                current += 1
                length += 1

            best = max(best, length)

        return best`,
    typescript: String.raw`function longestConsecutive(nums: number[]): number {
  const numSet = new Set(nums);
  let best = 0;

  for (const num of numSet) {
    if (numSet.has(num - 1)) continue;

    let current = num;
    let length = 1;
    while (numSet.has(current + 1)) {
      current++;
      length++;
    }
    best = Math.max(best, length);
  }

  return best;
}`,
  }),
  141: problem({
    id: 141,
    title: 'Linked List Cycle',
    difficulty: 'Easy',
    statement: '判斷 linked list 中是否存在 cycle。',
    examples: [
      {
        input: 'head = [3,2,0,-4], pos = 1',
        output: 'true',
        explanation: '尾端節點連回索引 1，形成環。',
      },
    ],
    techniques: ['Fast & Slow Pointers', 'Cycle Detection'],
    approaches: [
      approach('Hash Set', '把走過的節點記起來，重複就代表有環。', 'O(n)', 'O(n)'),
      approach('Floyd Cycle Detection', 'slow 一步、fast 兩步，相遇即有環。', 'O(n)', 'O(1)', true),
    ],
    python: String.raw`class Solution:
    def hasCycle(self, head) -> bool:
        slow = fast = head

        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow == fast:
                return True

        return False`,
    typescript: String.raw`function hasCycle(head: ListNode | null): boolean {
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }

  return false;
}`,
  }),
  146: problem({
    id: 146,
    title: 'LRU Cache',
    difficulty: 'Medium',
    statement: '設計一個 LRU Cache，需支援 get 與 put，且兩個操作都要做到 O(1)。',
    focus: '這題考的是資料結構組合設計，不是單一演算法。你要同時支援「依 key O(1) 找到值」與「依最近使用順序 O(1) 調整 / 淘汰」。任何只用一種資料結構的解法通常都不夠。',
    dataStructureChoice: 'Hash Map 負責 key -> node 的 O(1) 查找；Doubly Linked List 負責 O(1) 移動節點到最新位置，以及 O(1) 刪除最舊節點。兩者缺一不可。',
    strategy: [
      '把最近使用的節點放在雙向串列右側，最久沒用的放左側。',
      'get(key) 時，先從 Hash Map 找到 node，再把它移到最新位置。',
      'put(key, value) 時，若 key 已存在就更新並移到最新；若不存在則插入新節點。',
      '容量超過時，淘汰最左側的 LRU 節點，並同步從 Hash Map 移除。',
    ],
    examples: [
      {
        input: 'LRUCache(2), put(1,1), put(2,2), get(1), put(3,3)',
        output: 'get(1) = 1，插入 3 之後會淘汰 key 2',
        explanation: '最近最少使用的元素需要能 O(1) 移除與移到最新位置。',
      },
    ],
    techniques: ['Hash Map', 'Doubly Linked List', 'Cache Design'],
    approaches: [
      detailedApproach({
        name: '陣列或普通 Map 模擬',
        idea: '每次更新都調整使用順序，淘汰尾端元素。',
        time: 'O(n)',
        space: 'O(capacity)',
        pros: ['概念直觀。'],
        cons: ['節點移動與淘汰通常做不到 O(1)。', '不符合題目要求。'],
        whenToUse: '僅適合作為理解 LRU 行為的初版。',
      }),
      detailedApproach({
        name: 'Hash Map + Doubly Linked List',
        idea: 'Map 快速定位節點，雙向串列維護使用順序。',
        time: 'O(1)',
        space: 'O(capacity)',
        recommended: true,
        pros: ['完全符合題目要求。', '是經典 cache design 模板。'],
        cons: ['實作量較大。', '指標操作容易出錯。'],
        whenToUse: '當需求同時包含 key-based lookup 與 order-based eviction 時。',
      }),
    ],
    python: String.raw`class Node:
    def __init__(self, key=0, value=0):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None


class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}
        self.left = Node()
        self.right = Node()
        self.left.next = self.right
        self.right.prev = self.left

    def _remove(self, node: Node) -> None:
        prev_node, next_node = node.prev, node.next
        prev_node.next = next_node
        next_node.prev = prev_node

    def _insert(self, node: Node) -> None:
        prev_node = self.right.prev
        prev_node.next = node
        node.prev = prev_node
        node.next = self.right
        self.right.prev = node

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        node = self.cache[key]
        self._remove(node)
        self._insert(node)
        return node.value

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self._remove(self.cache[key])

        node = Node(key, value)
        self.cache[key] = node
        self._insert(node)

        if len(self.cache) > self.capacity:
            lru = self.left.next
            self._remove(lru)
            del self.cache[lru.key]`,
    typescript: String.raw`class Node {
  key: number;
  value: number;
  prev: Node | null = null;
  next: Node | null = null;

  constructor(key = 0, value = 0) {
    this.key = key;
    this.value = value;
  }
}

class LRUCache {
  private capacity: number;
  private cache = new Map<number, Node>();
  private left = new Node();
  private right = new Node();

  constructor(capacity: number) {
    this.capacity = capacity;
    this.left.next = this.right;
    this.right.prev = this.left;
  }

  private remove(node: Node): void {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }

  private insert(node: Node): void {
    const prev = this.right.prev!;
    prev.next = node;
    node.prev = prev;
    node.next = this.right;
    this.right.prev = node;
  }

  get(key: number): number {
    if (!this.cache.has(key)) return -1;
    const node = this.cache.get(key)!;
    this.remove(node);
    this.insert(node);
    return node.value;
  }

  put(key: number, value: number): void {
    if (this.cache.has(key)) {
      this.remove(this.cache.get(key)!);
    }

    const node = new Node(key, value);
    this.cache.set(key, node);
    this.insert(node);

    if (this.cache.size > this.capacity) {
      const lru = this.left.next!;
      this.remove(lru);
      this.cache.delete(lru.key);
    }
  }
}`,
  }),
  155: problem({
    id: 155,
    title: 'Min Stack',
    difficulty: 'Medium',
    statement: '設計一個 stack，支援 push、pop、top，並能在 O(1) 時間取得目前最小值。',
    examples: [
      {
        input: 'push(-2), push(0), push(-3), getMin()',
        output: '-3',
        explanation: '除了主 stack，也要同步記錄到目前為止的最小值。',
      },
    ],
    techniques: ['Stack', '輔助最小值 stack'],
    approaches: [
      approach('每次 getMin 重掃', '查最小值時整個掃一遍。', 'O(1)/O(n)', 'O(n)'),
      approach('雙 Stack', '主 stack 放值，min stack 放當前最小值。', 'O(1)', 'O(n)', true),
    ],
    python: String.raw`class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val: int) -> None:
        self.stack.append(val)
        if not self.min_stack:
            self.min_stack.append(val)
        else:
            self.min_stack.append(min(val, self.min_stack[-1]))

    def pop(self) -> None:
        self.stack.pop()
        self.min_stack.pop()

    def top(self) -> int:
        return self.stack[-1]

    def getMin(self) -> int:
        return self.min_stack[-1]`,
    typescript: String.raw`class MinStack {
  private stack: number[] = [];
  private minStack: number[] = [];

  push(val: number): void {
    this.stack.push(val);
    const currentMin =
      this.minStack.length === 0 ? val : Math.min(val, this.minStack[this.minStack.length - 1]);
    this.minStack.push(currentMin);
  }

  pop(): void {
    this.stack.pop();
    this.minStack.pop();
  }

  top(): number {
    return this.stack[this.stack.length - 1];
  }

  getMin(): number {
    return this.minStack[this.minStack.length - 1];
  }
}`,
  }),
  206: problem({
    id: 206,
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    statement: '將 linked list 反轉並回傳新的 head。',
    examples: [
      {
        input: 'head = [1,2,3,4,5]',
        output: '[5,4,3,2,1]',
        explanation: '反轉過程中要調整每個節點的 next 指標。',
      },
    ],
    techniques: ['Linked List', 'Pointer Reversal'],
    approaches: [
      approach('遞迴', '由尾端往前回接。', 'O(n)', 'O(n)'),
      approach('迭代', '用 prev、curr、next 三個指標原地反轉。', 'O(n)', 'O(1)', true),
    ],
    python: String.raw`class Solution:
    def reverseList(self, head):
        prev = None
        curr = head

        while curr:
            nxt = curr.next
            curr.next = prev
            prev = curr
            curr = nxt

        return prev`,
    typescript: String.raw`function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr = head;

  while (curr) {
    const nextNode = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextNode;
  }

  return prev;
}`,
  }),
  232: problem({
    id: 232,
    title: 'Implement Queue using Stacks',
    difficulty: 'Easy',
    statement: '只用 stack 操作實作一個 FIFO queue。',
    examples: [
      {
        input: 'push(1), push(2), peek(), pop()',
        output: 'peek = 1, pop = 1',
        explanation: '可用 inStack 與 outStack 攤還維持 queue 行為。',
      },
    ],
    techniques: ['Two Stacks', 'Amortized Analysis', 'Queue Design'],
    approaches: [
      approach('每次 pop 全轉移', '每次取元素都把所有資料倒來倒去。', 'O(n)', 'O(n)'),
      approach('雙 Stack 攤還', 'inStack 負責 push，outStack 空時再整批搬移。', 'Amortized O(1)', 'O(n)', true),
    ],
    python: String.raw`class MyQueue:
    def __init__(self):
        self.in_stack = []
        self.out_stack = []

    def _move(self) -> None:
        if not self.out_stack:
            while self.in_stack:
                self.out_stack.append(self.in_stack.pop())

    def push(self, x: int) -> None:
        self.in_stack.append(x)

    def pop(self) -> int:
        self._move()
        return self.out_stack.pop()

    def peek(self) -> int:
        self._move()
        return self.out_stack[-1]

    def empty(self) -> bool:
        return not self.in_stack and not self.out_stack`,
    typescript: String.raw`class MyQueue {
  private inStack: number[] = [];
  private outStack: number[] = [];

  private move(): void {
    if (this.outStack.length === 0) {
      while (this.inStack.length > 0) {
        this.outStack.push(this.inStack.pop()!);
      }
    }
  }

  push(x: number): void {
    this.inStack.push(x);
  }

  pop(): number {
    this.move();
    return this.outStack.pop()!;
  }

  peek(): number {
    this.move();
    return this.outStack[this.outStack.length - 1];
  }

  empty(): boolean {
    return this.inStack.length === 0 && this.outStack.length === 0;
  }
}`,
  }),
  238: problem({
    id: 238,
    title: 'Product of Array Except Self',
    difficulty: 'Medium',
    statement: '輸出陣列 answer，使 answer[i] 等於 nums 中除了 nums[i] 以外所有元素的乘積，且不能使用除法。',
    focus: '這題考的是 prefix / suffix 的拆解能力。因為不能用除法，所以你必須把每個位置的答案改寫成「左邊所有數的乘積」乘上「右邊所有數的乘積」。',
    dataStructureChoice: '本題不需要複雜資料結構，核心是陣列與兩趟掃描。最佳做法是直接把 prefix 結果先寫進答案陣列，再用一個 suffix 變數從右往左補上。',
    strategy: [
      '第一趟由左到右，讓 answer[i] 先存 i 左邊所有元素的乘積。',
      '第二趟由右到左，用 suffix 累乘 i 右邊所有元素乘積。',
      '把 suffix 乘到 answer[i] 上，就得到除了自己之外的完整乘積。',
      '這樣就不需要另外開兩個完整陣列。',
    ],
    examples: [
      {
        input: 'nums = [1,2,3,4]',
        output: '[24,12,8,6]',
        explanation: '每個位置都等於左側乘積乘上右側乘積。',
      },
    ],
    techniques: ['Prefix Product', 'Suffix Product', 'Space Optimization'],
    approaches: [
      detailedApproach({
        name: 'Prefix + Suffix 兩個輔助陣列',
        idea: '先建立 prefix 與 suffix，再把兩者相乘。',
        time: 'O(n)',
        space: 'O(n)',
        pros: ['概念清楚。', '容易驗證每個位置的來源。'],
        cons: ['額外空間較多。'],
        whenToUse: '如果題目沒有強調空間最佳化，這是很好的教學版本。',
      }),
      detailedApproach({
        name: '單一答案陣列 + suffix 變數',
        idea: '先把左乘積放進答案，再由右往左乘上 suffix。',
        time: 'O(n)',
        space: 'O(1) 額外空間',
        recommended: true,
        pros: ['符合題目常見的空間要求。', '寫法精簡。'],
        cons: ['需要先想到答案陣列也能當暫存 prefix。'],
        whenToUse: '當題目要你在維持線性時間下再壓低額外空間時。',
      }),
    ],
    python: String.raw`class Solution:
    def productExceptSelf(self, nums: list[int]) -> list[int]:
        n = len(nums)
        answer = [1] * n

        prefix = 1
        for i in range(n):
            answer[i] = prefix
            prefix *= nums[i]

        suffix = 1
        for i in range(n - 1, -1, -1):
            answer[i] *= suffix
            suffix *= nums[i]

        return answer`,
    typescript: String.raw`function productExceptSelf(nums: number[]): number[] {
  const n = nums.length;
  const answer = new Array<number>(n).fill(1);

  let prefix = 1;
  for (let i = 0; i < n; i++) {
    answer[i] = prefix;
    prefix *= nums[i];
  }

  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    answer[i] *= suffix;
    suffix *= nums[i];
  }

  return answer;
}`,
  }),
  560: problem({
    id: 560,
    title: 'Subarray Sum Equals K',
    difficulty: 'Medium',
    statement: '找出總和等於 k 的連續子陣列數量。',
    focus: '這題在考 prefix sum 的等價轉換。你不是直接找每一段區間，而是把問題改寫成：對於目前 prefix，需要知道之前有多少個 prefix 等於 prefix - k。',
    dataStructureChoice: '需要同時維護 prefix sum 出現次數，所以最適合用 Hash Map。這不是單純記錄有沒有出現，而是要記錄「出現幾次」，因為不同起點都可能形成合法區間。',
    strategy: [
      '一路累加 prefix sum。',
      '若之前出現過 prefix - k，表示那些位置到現在都能形成總和為 k 的區間。',
      '把這些次數加進答案。',
      '最後再把目前 prefix 的出現次數加一。',
    ],
    examples: [
      {
        input: 'nums = [1,1,1], k = 2',
        output: '2',
        explanation: '共有兩段 [1,1] 的總和是 2。',
      },
    ],
    techniques: ['Prefix Sum', 'Hash Map', '計數問題'],
    approaches: [
      detailedApproach({
        name: '枚舉所有區間',
        idea: '雙層迴圈計算每段總和。',
        time: 'O(n^2)',
        space: 'O(1)',
        pros: ['容易理解。'],
        cons: ['重複計算大量區間和。', '無法通過較大輸入。'],
        whenToUse: '只適合當作 baseline。',
      }),
      detailedApproach({
        name: 'Prefix Sum + Hash Map',
        idea: '若 prefix[j] - prefix[i] = k，等價於找 prefix[i] = prefix[j] - k。',
        time: 'O(n)',
        space: 'O(n)',
        recommended: true,
        pros: ['把區間和查找降成歷史 prefix 查詢。', '是這類 counting subarray 題的經典模板。'],
        cons: ['需要理解前綴和轉換，不是直觀掃描。'],
        whenToUse: '當題目問「有多少個子陣列」且條件與總和有關時，非常常見。',
      }),
    ],
    python: String.raw`class Solution:
    def subarraySum(self, nums: list[int], k: int) -> int:
        count = 0
        prefix = 0
        freq = {0: 1}

        for num in nums:
            prefix += num
            count += freq.get(prefix - k, 0)
            freq[prefix] = freq.get(prefix, 0) + 1

        return count`,
    typescript: String.raw`function subarraySum(nums: number[], k: number): number {
  let count = 0;
  let prefix = 0;
  const freq = new Map<number, number>([[0, 1]]);

  for (const num of nums) {
    prefix += num;
    count += freq.get(prefix - k) ?? 0;
    freq.set(prefix, (freq.get(prefix) ?? 0) + 1);
  }

  return count;
}`,
  }),
  136: problem({
    id: 136,
    title: 'Single Number',
    difficulty: 'Easy',
    statement: '陣列中除了某個元素只出現一次外，其餘每個元素都出現兩次，找出只出現一次的那個元素。',
    examples: [
      {
        input: 'nums = [4,1,2,1,2]',
        output: '4',
        explanation: '相同數字做 XOR 後會抵消，只剩唯一值。',
      },
    ],
    techniques: ['Bit Manipulation', 'XOR'],
    approaches: [
      approach('Hash Map', '統計每個數字出現次數。', 'O(n)', 'O(n)'),
      approach('XOR', '利用 a ^ a = 0 與 a ^ 0 = a。', 'O(n)', 'O(1)', true),
    ],
    python: String.raw`class Solution:
    def singleNumber(self, nums: list[int]) -> int:
        answer = 0
        for num in nums:
            answer ^= num
        return answer`,
    typescript: String.raw`function singleNumber(nums: number[]): number {
  let answer = 0;
  for (const num of nums) answer ^= num;
  return answer;
}`,
  }),
  198: problem({
    id: 198,
    title: 'House Robber',
    difficulty: 'Medium',
    statement: '每間房子有金額，不能偷相鄰兩間，求可以偷到的最大金額。',
    examples: [
      {
        input: 'nums = [2,7,9,3,1]',
        output: '12',
        explanation: '最佳選擇是 2 + 9 + 1 = 12。',
      },
    ],
    techniques: ['Dynamic Programming', '一維 DP', '狀態轉移'],
    approaches: [
      approach('遞迴 + Memo', '對每個位置決定偷或不偷。', 'O(n)', 'O(n)'),
      approach('Iterative DP', 'dp[i] = max(dp[i - 1], dp[i - 2] + nums[i])。', 'O(n)', 'O(1)', true),
    ],
    python: String.raw`class Solution:
    def rob(self, nums: list[int]) -> int:
        prev2 = 0
        prev1 = 0

        for num in nums:
            prev2, prev1 = prev1, max(prev1, prev2 + num)

        return prev1`,
    typescript: String.raw`function rob(nums: number[]): number {
  let prev2 = 0;
  let prev1 = 0;

  for (const num of nums) {
    const current = Math.max(prev1, prev2 + num);
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}`,
  }),
  200: problem({
    id: 200,
    title: 'Number of Islands',
    difficulty: 'Medium',
    statement: '在由 0 與 1 組成的 grid 中，計算島嶼數量。相鄰方向只有上下左右。',
    examples: [
      {
        input: 'grid = [["1","1","0"],["1","0","0"],["0","0","1"]]',
        output: '2',
        explanation: '左上角是一座島，右下角是一座島。',
      },
    ],
    techniques: ['DFS / BFS', 'Flood Fill', 'Graph Traversal'],
    approaches: [
      approach('Union-Find', '把相鄰陸地 union 起來計數。', 'O(mn α(mn))', 'O(mn)'),
      approach('DFS Flood Fill', '遇到陸地就展開，把整座島標記為已訪問。', 'O(mn)', 'O(mn) 或 O(1) 修改原陣列', true),
    ],
    python: String.raw`class Solution:
    def numIslands(self, grid: list[list[str]]) -> int:
        rows, cols = len(grid), len(grid[0])

        def dfs(r: int, c: int) -> None:
            if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':
                return
            grid[r][c] = '0'
            dfs(r + 1, c)
            dfs(r - 1, c)
            dfs(r, c + 1)
            dfs(r, c - 1)

        islands = 0
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == '1':
                    islands += 1
                    dfs(r, c)

        return islands`,
    typescript: String.raw`function numIslands(grid: string[][]): number {
  const rows = grid.length;
  const cols = grid[0].length;

  function dfs(r: number, c: number): void {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== '1') return;
    grid[r][c] = '0';
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  let islands = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        islands++;
        dfs(r, c);
      }
    }
  }

  return islands;
}`,
  }),
  207: problem({
    id: 207,
    title: 'Course Schedule',
    difficulty: 'Medium',
    statement: '給定課程數與先修關係 prerequisites，判斷是否可以完成所有課程，也就是圖中是否有環。',
    examples: [
      {
        input: 'numCourses = 2, prerequisites = [[1,0]]',
        output: 'true',
        explanation: '0 先修完再修 1 即可，沒有 cycle。',
      },
    ],
    techniques: ['Topological Sort', 'Graph Cycle Detection', 'In-degree'],
    approaches: [
      approach('DFS 染色', '用三色標記檢查有向圖是否成環。', 'O(V + E)', 'O(V + E)'),
      approach('Kahn Topological Sort', '持續取出入度 0 節點，最後檢查是否能處理完所有節點。', 'O(V + E)', 'O(V + E)', true),
    ],
    python: String.raw`from collections import deque

class Solution:
    def canFinish(self, numCourses: int, prerequisites: list[list[int]]) -> bool:
        graph = [[] for _ in range(numCourses)]
        indegree = [0] * numCourses

        for course, pre in prerequisites:
            graph[pre].append(course)
            indegree[course] += 1

        queue = deque(i for i, degree in enumerate(indegree) if degree == 0)
        taken = 0

        while queue:
            node = queue.popleft()
            taken += 1
            for nei in graph[node]:
                indegree[nei] -= 1
                if indegree[nei] == 0:
                    queue.append(nei)

        return taken == numCourses`,
    typescript: String.raw`function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  const graph: number[][] = Array.from({ length: numCourses }, () => []);
  const indegree = new Array<number>(numCourses).fill(0);

  for (const [course, pre] of prerequisites) {
    graph[pre].push(course);
    indegree[course]++;
  }

  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) {
    if (indegree[i] === 0) queue.push(i);
  }

  let taken = 0;
  for (let head = 0; head < queue.length; head++) {
    const node = queue[head];
    taken++;
    for (const nei of graph[node]) {
      indegree[nei]--;
      if (indegree[nei] === 0) queue.push(nei);
    }
  }

  return taken === numCourses;
}`,
  }),
  215: problem({
    id: 215,
    title: 'Kth Largest Element in an Array',
    difficulty: 'Medium',
    statement: '在未排序陣列中找出第 k 大元素，不是第 k 個不同元素。',
    examples: [
      {
        input: 'nums = [3,2,1,5,6,4], k = 2',
        output: '5',
        explanation: '由大到小排序後第 2 個元素是 5。',
      },
    ],
    techniques: ['Heap', 'Quickselect', 'Selection Algorithm'],
    approaches: [
      approach('排序', '完整排序後直接取第 k 大。', 'O(n log n)', 'O(1) 或 O(log n)'),
      approach('Min-Heap of size k', '維持目前最大的 k 個數，堆頂就是第 k 大。', 'O(n log k)', 'O(k)', true),
    ],
    python: String.raw`import heapq

class Solution:
    def findKthLargest(self, nums: list[int], k: int) -> int:
        heap = []

        for num in nums:
            heapq.heappush(heap, num)
            if len(heap) > k:
                heapq.heappop(heap)

        return heap[0]`,
    typescript: String.raw`function findKthLargest(nums: number[], k: number): number {
  nums.sort((a, b) => b - a);
  return nums[k - 1];
}`,
  }),
  300: problem({
    id: 300,
    title: 'Longest Increasing Subsequence',
    difficulty: 'Medium',
    statement: '找出陣列中最長嚴格遞增子序列的長度。',
    examples: [
      {
        input: 'nums = [10,9,2,5,3,7,101,18]',
        output: '4',
        explanation: '一個最長遞增子序列為 [2,3,7,101]。',
      },
    ],
    techniques: ['Dynamic Programming', 'Patience Sorting', 'Binary Search'],
    approaches: [
      approach('DP', 'dp[i] 代表以 nums[i] 結尾的 LIS 長度。', 'O(n^2)', 'O(n)'),
      approach('Patience Sorting', 'tails[len] 存每個長度最小尾值，對每個數做 lower_bound。', 'O(n log n)', 'O(n)', true),
    ],
    python: String.raw`from bisect import bisect_left

class Solution:
    def lengthOfLIS(self, nums: list[int]) -> int:
        tails = []

        for num in nums:
            idx = bisect_left(tails, num)
            if idx == len(tails):
                tails.append(num)
            else:
                tails[idx] = num

        return len(tails)`,
    typescript: String.raw`function lengthOfLIS(nums: number[]): number {
  const tails: number[] = [];

  for (const num of nums) {
    let left = 0;
    let right = tails.length;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (tails[mid] < num) left = mid + 1;
      else right = mid;
    }

    if (left === tails.length) tails.push(num);
    else tails[left] = num;
  }

  return tails.length;
}`,
  }),
  322: problem({
    id: 322,
    title: 'Coin Change',
    difficulty: 'Medium',
    statement: '給定 coins 與 amount，求湊出 amount 的最少硬幣數；若無法湊出則回傳 -1。',
    examples: [
      {
        input: 'coins = [1,2,5], amount = 11',
        output: '3',
        explanation: '11 = 5 + 5 + 1，共 3 枚。',
      },
    ],
    techniques: ['Dynamic Programming', 'Unbounded Knapsack'],
    approaches: [
      approach('BFS on amount', '每層代表多用一枚硬幣。', 'O(amount * n)', 'O(amount)'),
      approach('Bottom-up DP', 'dp[x] = min(dp[x], dp[x - coin] + 1)。', 'O(amount * n)', 'O(amount)', true),
    ],
    python: String.raw`class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        dp = [amount + 1] * (amount + 1)
        dp[0] = 0

        for total in range(1, amount + 1):
            for coin in coins:
                if coin <= total:
                    dp[total] = min(dp[total], dp[total - coin] + 1)

        return dp[amount] if dp[amount] <= amount else -1`,
    typescript: String.raw`function coinChange(coins: number[], amount: number): number {
  const dp = new Array<number>(amount + 1).fill(amount + 1);
  dp[0] = 0;

  for (let total = 1; total <= amount; total++) {
    for (const coin of coins) {
      if (coin <= total) {
        dp[total] = Math.min(dp[total], dp[total - coin] + 1);
      }
    }
  }

  return dp[amount] <= amount ? dp[amount] : -1;
}`,
  }),
  704: problem({
    id: 704,
    title: 'Binary Search',
    difficulty: 'Easy',
    statement: '在已排序陣列中找 target 的索引，找不到回傳 -1。',
    examples: [
      {
        input: 'nums = [-1,0,3,5,9,12], target = 9',
        output: '4',
        explanation: '排序陣列可每次砍掉一半搜尋空間。',
      },
    ],
    techniques: ['Binary Search', '區間收縮'],
    approaches: [
      approach('Linear Scan', '從頭掃到尾。', 'O(n)', 'O(1)'),
      approach('Binary Search', '比較中點與 target 決定往左或往右。', 'O(log n)', 'O(1)', true),
    ],
    python: String.raw`class Solution:
    def search(self, nums: list[int], target: int) -> int:
        left, right = 0, len(nums) - 1

        while left <= right:
            mid = (left + right) // 2
            if nums[mid] == target:
                return mid
            if nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1

        return -1`,
    typescript: String.raw`function search(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}`,
  }),
  4: problem({
    id: 4,
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    statement: '給定兩個已排序陣列 nums1、nums2，請在 O(log(m+n)) 內找出兩者合併後的中位數。',
    focus: '這題考的是把「找中位數」轉成「找正確切割位置」。核心不是 merge，而是二分答案所在的 partition。',
    dataStructureChoice: '不需要額外資料結構，重點是對較短陣列做 Binary Search，讓切割左右兩半保持平衡且有序。',
    strategy: ['令左半部總長固定為 (m+n+1)//2。', '在較短陣列上二分切割位置 i，另一個陣列切割位置 j 可推得。', '若左半最大值都 <= 右半最小值，切割正確。', '依總長奇偶回傳左半最大值或左右邊界平均。'],
    examples: [{ input: 'nums1 = [1,3], nums2 = [2]', output: '2.0', explanation: '合併後為 [1,2,3]，中位數是 2。' }],
    techniques: ['Binary Search on Partition', 'Sorted Array Invariant'],
    approaches: [
      detailedApproach({ name: 'Merge 後取中位數', idea: '完整 merge 兩陣列後直接取中位數。', time: 'O(m+n)', space: 'O(m+n)', pros: ['直觀。'], cons: ['不符合題目要求。'], whenToUse: '只適合作為 baseline。' }),
      detailedApproach({ name: 'Partition Binary Search', idea: '在短陣列上二分切割點，找出合法 partition。', time: 'O(log(min(m,n)))', space: 'O(1)', recommended: true, pros: ['符合題目要求。', '不需真的 merge。'], cons: ['邊界條件多。'], whenToUse: '兩個排序陣列、要找第 k 小或中位數時很常見。' }),
    ],
    python: String.raw`class Solution:
    def findMedianSortedArrays(self, nums1: list[int], nums2: list[int]) -> float:
        if len(nums1) > len(nums2):
            nums1, nums2 = nums2, nums1

        m, n = len(nums1), len(nums2)
        left, right = 0, m

        while left <= right:
            i = (left + right) // 2
            j = (m + n + 1) // 2 - i

            max_left_1 = float('-inf') if i == 0 else nums1[i - 1]
            min_right_1 = float('inf') if i == m else nums1[i]
            max_left_2 = float('-inf') if j == 0 else nums2[j - 1]
            min_right_2 = float('inf') if j == n else nums2[j]

            if max_left_1 <= min_right_2 and max_left_2 <= min_right_1:
                if (m + n) % 2 == 1:
                    return max(max_left_1, max_left_2)
                return (max(max_left_1, max_left_2) + min(min_right_1, min_right_2)) / 2
            if max_left_1 > min_right_2:
                right = i - 1
            else:
                left = i + 1`,
    typescript: String.raw`function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
  if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);

  const m = nums1.length;
  const n = nums2.length;
  let left = 0;
  let right = m;

  while (left <= right) {
    const i = Math.floor((left + right) / 2);
    const j = Math.floor((m + n + 1) / 2) - i;

    const maxLeft1 = i === 0 ? -Infinity : nums1[i - 1];
    const minRight1 = i === m ? Infinity : nums1[i];
    const maxLeft2 = j === 0 ? -Infinity : nums2[j - 1];
    const minRight2 = j === n ? Infinity : nums2[j];

    if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
      if ((m + n) % 2 === 1) return Math.max(maxLeft1, maxLeft2);
      return (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2;
    }

    if (maxLeft1 > minRight2) right = i - 1;
    else left = i + 1;
  }

  return 0;
}`,
  }),
  11: problem({
    id: 11,
    title: 'Container With Most Water',
    difficulty: 'Medium',
    statement: '給定高度陣列，任選兩條線段與 x 軸構成容器，求可裝最多水量。',
    focus: '重點是證明為什麼要移動較短那一側。面積受限於短板，所以移動長板沒有機會讓高度上界變更好。',
    dataStructureChoice: '只需要雙指標，因為左右邊界天然構成一個搜尋空間，且每次可安全剪枝一側。',
    strategy: ['左右指標從兩端開始。', '計算目前面積 = 寬 * min(height[l], height[r])。', '更新最大值後，移動較短的一側。', '因為較短邊不變時，寬度只會更小，不可能更優。'],
    examples: [{ input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explanation: '取索引 1 與 8，高度 min(8,7)=7，寬 7，面積 49。' }],
    techniques: ['Two Pointers', 'Greedy Pruning'],
    approaches: [
      detailedApproach({ name: 'Brute Force', idea: '枚舉所有 pair 計算面積。', time: 'O(n^2)', space: 'O(1)', pros: ['直觀。'], cons: ['太慢。'], whenToUse: '只作 baseline。' }),
      detailedApproach({ name: 'Two Pointers', idea: '每次移動較短板，剪掉不可能更優的情況。', time: 'O(n)', space: 'O(1)', recommended: true, pros: ['線性時間。', '剪枝理由清楚。'], cons: ['需要理解正確性。'], whenToUse: '雙端邊界問題且可證明單側移動安全時。' }),
    ],
    python: String.raw`class Solution:
    def maxArea(self, height: list[int]) -> int:
        left, right = 0, len(height) - 1
        best = 0
        while left < right:
            best = max(best, (right - left) * min(height[left], height[right]))
            if height[left] < height[right]:
                left += 1
            else:
                right -= 1
        return best`,
    typescript: String.raw`function maxArea(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let best = 0;
  while (left < right) {
    best = Math.max(best, (right - left) * Math.min(height[left], height[right]));
    if (height[left] < height[right]) left++;
    else right--;
  }
  return best;
}`,
  }),
  15: problem({
    id: 15,
    title: '3Sum',
    difficulty: 'Medium',
    statement: '找出所有不重複的三元組 [a,b,c]，使得 a + b + c = 0。',
    focus: '這題考排序後去重與降維。先固定一個數，再把 3Sum 變成 2Sum on sorted array。',
    dataStructureChoice: '排序後配合雙指標最穩。Hash Set 也能做，但去重更麻煩。',
    strategy: ['先排序。', '枚舉每個索引 i 作為第一個數。', '對剩餘區間用左右指標找兩數和 = -nums[i]。', '每找到解後跳過重複值，避免重複答案。'],
    examples: [{ input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]', explanation: '排序後可穩定跳過重複組合。' }],
    techniques: ['Sorting', 'Two Pointers', 'Deduplication'],
    approaches: [
      detailedApproach({ name: 'Brute Force', idea: '枚舉所有三元組後用 set 去重。', time: 'O(n^3)', space: 'O(k)', pros: ['容易想到。'], cons: ['太慢。'], whenToUse: '只作 baseline。' }),
      detailedApproach({ name: 'Sort + Two Pointers', idea: '固定第一個數後，剩下區間做兩數和。', time: 'O(n^2)', space: 'O(1)~O(log n)', recommended: true, pros: ['效率高。', '去重規則明確。'], cons: ['排序後索引資訊會被打亂，但本題不在乎。'], whenToUse: 'k-sum 類問題的經典模板。' }),
    ],
    python: String.raw`class Solution:
    def threeSum(self, nums: list[int]) -> list[list[int]]:
        nums.sort()
        answer = []
        n = len(nums)
        for i in range(n - 2):
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            left, right = i + 1, n - 1
            while left < right:
                total = nums[i] + nums[left] + nums[right]
                if total == 0:
                    answer.append([nums[i], nums[left], nums[right]])
                    left += 1
                    right -= 1
                    while left < right and nums[left] == nums[left - 1]:
                        left += 1
                    while left < right and nums[right] == nums[right + 1]:
                        right -= 1
                elif total < 0:
                    left += 1
                else:
                    right -= 1
        return answer`,
    typescript: String.raw`function threeSum(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const answer: number[][] = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let left = i + 1;
    let right = nums.length - 1;
    while (left < right) {
      const total = nums[i] + nums[left] + nums[right];
      if (total === 0) {
        answer.push([nums[i], nums[left], nums[right]]);
        left++;
        right--;
        while (left < right && nums[left] === nums[left - 1]) left++;
        while (left < right && nums[right] === nums[right + 1]) right--;
      } else if (total < 0) left++;
      else right--;
    }
  }
  return answer;
}`,
  }),
  19: problem({
    id: 19,
    title: 'Remove Nth Node From End of List',
    difficulty: 'Medium',
    statement: '刪除 linked list 的倒數第 n 個節點，並回傳 head。',
    focus: '這題考雙指標距離控制。只要讓 fast 先走 n 步，當 fast 到尾巴時，slow 就剛好在待刪節點前一個。',
    dataStructureChoice: 'Linked list 最適合用 two pointers 搭配 dummy head，避免刪頭節點時特判。',
    strategy: ['建立 dummy 指向 head。', '讓 fast 先走 n 步。', '之後 fast、slow 同步前進直到 fast.next 為空。', '讓 slow.next = slow.next.next 完成刪除。'],
    examples: [{ input: 'head = [1,2,3,4,5], n = 2', output: '[1,2,3,5]', explanation: '倒數第 2 個是 4。' }],
    techniques: ['Two Pointers', 'Dummy Head', 'Linked List'],
    approaches: [
      detailedApproach({ name: '先算長度再刪', idea: '先掃一遍求長度，再找正數第 len-n 個。', time: 'O(n)', space: 'O(1)', pros: ['穩定。'], cons: ['需要兩趟。'], whenToUse: '可先作 baseline。' }),
      detailedApproach({ name: 'One Pass Two Pointers', idea: 'fast 先走 n 步，與 slow 保持距離。', time: 'O(n)', space: 'O(1)', recommended: true, pros: ['單趟完成。'], cons: ['要小心 dummy 與邊界。'], whenToUse: '倒數第 k 個、固定間距 linked list 題目。' }),
    ],
    python: String.raw`class Solution:
    def removeNthFromEnd(self, head, n: int):
        dummy = ListNode(0, head)
        fast = dummy
        slow = dummy

        for _ in range(n):
            fast = fast.next

        while fast.next:
            fast = fast.next
            slow = slow.next

        slow.next = slow.next.next
        return dummy.next`,
    typescript: String.raw`function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  const dummy = new ListNode(0, head);
  let fast: ListNode | null = dummy;
  let slow: ListNode | null = dummy;
  for (let i = 0; i < n; i++) fast = fast!.next;
  while (fast!.next) {
    fast = fast!.next;
    slow = slow!.next;
  }
  slow!.next = slow!.next!.next;
  return dummy.next;
}`,
  }),
  23: problem({
    id: 23,
    title: 'Merge k Sorted Lists',
    difficulty: 'Hard',
    statement: '合併 k 條已排序 linked lists，回傳一條排序後的 linked list。',
    focus: '這題考的是如何把兩路 merge 推廣到多路 merge。重點不在 linked list，而在「每次從 k 個候選中取最小值」這件事。',
    dataStructureChoice: 'Min Heap 最適合維持目前 k 個串列頭節點的最小值；也可用 divide and conquer 做 pairwise merge。',
    strategy: ['把每條串列的 head 放進 min-heap。', '每次 pop 最小節點接到答案尾端。', '若該節點有 next，再把 next 推回 heap。', '直到 heap 清空。'],
    examples: [{ input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]', explanation: 'heap 每次取出目前全域最小節點。' }],
    techniques: ['Heap', 'K-way Merge', 'Divide and Conquer'],
    approaches: [
      detailedApproach({ name: '順序合併', idea: '依序把 k 條串列一條條 merge 到答案。', time: 'O(kN)', space: 'O(1)', pros: ['容易實作。'], cons: ['效率較差。'], whenToUse: 'k 很小時還可接受。' }),
      detailedApproach({ name: 'Min Heap', idea: '用 heap 維持每條串列當前頭節點。', time: 'O(N log k)', space: 'O(k)', recommended: true, pros: ['標準 k-way merge。', '對大量 lists 很有效。'], cons: ['需要 heap 支援。'], whenToUse: '多路排序資料合併時首選。' }),
    ],
    python: String.raw`import heapq

class Solution:
    def mergeKLists(self, lists):
        heap = []
        for i, node in enumerate(lists):
            if node:
                heapq.heappush(heap, (node.val, i, node))

        dummy = ListNode()
        tail = dummy

        while heap:
            _, i, node = heapq.heappop(heap)
            tail.next = node
            tail = tail.next
            if node.next:
                heapq.heappush(heap, (node.next.val, i, node.next))

        return dummy.next`,
    typescript: String.raw`function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  const values: number[] = [];
  for (const head of lists) {
    let node = head;
    while (node) {
      values.push(node.val);
      node = node.next;
    }
  }
  values.sort((a, b) => a - b);
  const dummy = new ListNode(0);
  let tail = dummy;
  for (const value of values) {
    tail.next = new ListNode(value);
    tail = tail.next;
  }
  return dummy.next;
}`,
  }),
  25: problem({
    id: 25,
    title: 'Reverse Nodes in k-Group',
    difficulty: 'Hard',
    statement: '將 linked list 每 k 個節點為一組反轉，不足 k 個則保持原樣。',
    focus: '這題考 linked list 區段操作。你不只是反轉整條串列，而是要在局部區段上精準切段、反轉、再接回。',
    dataStructureChoice: 'Linked list pointer manipulation 是核心；dummy head 能讓每組接回更穩定。',
    strategy: ['先確認從 groupPrev 往後是否還有 k 個節點。', '若不足 k 個就結束。', '把這 k 個節點原地反轉。', '把反轉後的新頭與前後段接起來，更新 groupPrev 到下一組。'],
    examples: [{ input: 'head = [1,2,3,4,5], k = 2', output: '[2,1,4,3,5]', explanation: '每兩個節點反轉一次，尾端不足 k 個不動。' }],
    techniques: ['Linked List', 'Reverse Segment', 'Dummy Head'],
    approaches: [
      detailedApproach({ name: '切成陣列再重建', idea: '把值存進陣列分組反轉後再重建。', time: 'O(n)', space: 'O(n)', pros: ['實作簡單。'], cons: ['沒用到 linked list 原地操作。'], whenToUse: '若不要求原節點操作可作簡化版。' }),
      detailedApproach({ name: 'In-place Group Reversal', idea: '逐組找出長度 k 的區間並原地反轉。', time: 'O(n)', space: 'O(1)', recommended: true, pros: ['符合進階要求。'], cons: ['指標連接容易出錯。'], whenToUse: 'linked list 區段處理經典題。' }),
    ],
    python: String.raw`class Solution:
    def reverseKGroup(self, head, k: int):
        dummy = ListNode(0, head)
        group_prev = dummy

        while True:
            kth = group_prev
            for _ in range(k):
                kth = kth.next
                if not kth:
                    return dummy.next

            group_next = kth.next
            prev, curr = group_next, group_prev.next
            while curr != group_next:
                nxt = curr.next
                curr.next = prev
                prev = curr
                curr = nxt

            temp = group_prev.next
            group_prev.next = kth
            group_prev = temp`,
    typescript: String.raw`function reverseKGroup(head: ListNode | null, k: number): ListNode | null {
  const values: number[] = [];
  let node = head;
  while (node) {
    values.push(node.val);
    node = node.next;
  }
  for (let i = 0; i + k <= values.length; i += k) {
    values
      .slice(i, i + k)
      .reverse()
      .forEach((v, idx) => {
        values[i + idx] = v;
      });
  }
  const dummy = new ListNode(0);
  let tail = dummy;
  for (const v of values) {
    tail.next = new ListNode(v);
    tail = tail.next;
  }
  return dummy.next;
}`,
  }),
  33: problem({
    id: 33,
    title: 'Search in Rotated Sorted Array',
    difficulty: 'Medium',
    statement: '在經過旋轉的遞增陣列中搜尋 target，找不到回傳 -1。',
    focus: '重點在於：雖然整體不是完全排序，但每次二分時總有一半仍然是有序的。',
    dataStructureChoice: 'Binary Search 最合適，因為每一步都能判斷哪一半有序並安全丟棄另一半部分區間。',
    strategy: ['取中點 mid。', '判斷左半 [left, mid] 是否有序。', '若有序且 target 落在其中，就往左縮；否則往右。', '反之亦然。'],
    examples: [{ input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4', explanation: '每次都能找出一側是單調遞增。' }],
    techniques: ['Binary Search', 'Rotated Array'],
    approaches: [
      detailedApproach({ name: 'Linear Scan', idea: '從頭掃到尾。', time: 'O(n)', space: 'O(1)', pros: ['最簡單。'], cons: ['沒利用排序性質。'], whenToUse: '只作 baseline。' }),
      detailedApproach({ name: 'Rotated Binary Search', idea: '每步找出有序半邊，再看 target 是否落在其中。', time: 'O(log n)', space: 'O(1)', recommended: true, pros: ['標準解。'], cons: ['條件判斷較多。'], whenToUse: '旋轉排序陣列搜尋模板。' }),
    ],
    python: String.raw`class Solution:
    def search(self, nums: list[int], target: int) -> int:
        left, right = 0, len(nums) - 1
        while left <= right:
            mid = (left + right) // 2
            if nums[mid] == target:
                return mid
            if nums[left] <= nums[mid]:
                if nums[left] <= target < nums[mid]:
                    right = mid - 1
                else:
                    left = mid + 1
            else:
                if nums[mid] < target <= nums[right]:
                    left = mid + 1
                else:
                    right = mid - 1
        return -1`,
    typescript: String.raw`function searchRotated(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) right = mid - 1;
      else left = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[right]) left = mid + 1;
      else right = mid - 1;
    }
  }
  return -1;
}`,
  }),
  39: problem({
    id: 39,
    title: 'Combination Sum',
    difficulty: 'Medium',
    statement: '給定不重複整數 candidates 與 target，找出所有加總為 target 的組合；每個數字可重複使用。',
    focus: '這題考 backtracking 搜尋樹與剪枝。因為元素可重複使用，所以遞迴時下一層仍可從目前索引開始。',
    dataStructureChoice: 'Backtracking 搭配 path 陣列最自然，因為你要列出所有可行組合而不是只求一個值。',
    strategy: ['從某個起始索引開始選數。', '若總和超過 target 就回頭。', '若剛好等於 target 就加入答案。', '遞迴時傳入同一個索引，表示同一數字可以再用。'],
    examples: [{ input: 'candidates = [2,3,6,7], target = 7', output: '[[2,2,3],[7]]', explanation: '2 可重複選，因此 [2,2,3] 合法。' }],
    techniques: ['Backtracking', 'DFS', 'Pruning'],
    approaches: [
      detailedApproach({ name: '暴力列舉所有多重集合', idea: '把所有可能組合全列出再篩。', time: 'Exponential', space: 'Exponential', pros: ['概念直接。'], cons: ['沒有剪枝。'], whenToUse: '只作概念起點。' }),
      detailedApproach({ name: 'Backtracking', idea: '沿著選 / 不選的搜尋樹往下走，超過 target 即剪枝。', time: 'Exponential', space: 'O(target)', recommended: true, pros: ['能列出所有答案。', '容易加剪枝。'], cons: ['最壞情況仍指數級。'], whenToUse: '列舉所有組合類問題。' }),
    ],
    python: String.raw`class Solution:
    def combinationSum(self, candidates: list[int], target: int) -> list[list[int]]:
        answer = []
        path = []
        candidates.sort()

        def dfs(start: int, total: int) -> None:
            if total == target:
                answer.append(path[:])
                return
            if total > target:
                return
            for i in range(start, len(candidates)):
                path.append(candidates[i])
                dfs(i, total + candidates[i])
                path.pop()

        dfs(0, 0)
        return answer`,
    typescript: String.raw`function combinationSum(candidates: number[], target: number): number[][] {
  const answer: number[][] = [];
  const path: number[] = [];
  candidates.sort((a, b) => a - b);

  function dfs(start: number, total: number): void {
    if (total === target) {
      answer.push([...path]);
      return;
    }
    if (total > target) return;
    for (let i = start; i < candidates.length; i++) {
      path.push(candidates[i]);
      dfs(i, total + candidates[i]);
      path.pop();
    }
  }

  dfs(0, 0);
  return answer;
}`,
  }),
  40: problem({
    id: 40,
    title: 'Combination Sum II',
    difficulty: 'Medium',
    statement: '給定可能重複的 candidates 與 target，找出所有不重複組合；每個元素最多使用一次。',
    focus: '和 Combination Sum 差異在於「每個元素只能用一次」與「輸入本身可能重複」，所以去重邏輯變成關鍵。',
    dataStructureChoice: '排序後 backtracking 最穩，因為相同元素會聚在一起，方便在同一層跳過重複值。',
    strategy: ['先排序。', '每層迴圈若 candidates[i] == candidates[i-1] 且 i > start 就跳過。', '遞迴到下一層時從 i+1 開始，表示每個元素只能用一次。', '超過 target 時立即剪枝。'],
    examples: [{ input: 'candidates = [10,1,2,7,6,1,5], target = 8', output: '[[1,1,6],[1,2,5],[1,7],[2,6]]', explanation: '排序後可在同層安全跳過重複元素。' }],
    techniques: ['Backtracking', 'Sorting', 'Deduplication'],
    approaches: [
      detailedApproach({ name: 'Backtracking + Set 去重', idea: '生成所有組合後再用 set 去重。', time: 'Exponential', space: 'Exponential', pros: ['去重思路直觀。'], cons: ['重複工作多。'], whenToUse: '只作 baseline。' }),
      detailedApproach({ name: 'Sort + Same-level Skip', idea: '排序後在同一層直接跳過重複值。', time: 'Exponential', space: 'O(target)', recommended: true, pros: ['避免生成重複答案。'], cons: ['需理解「同層去重、不同層可重複值」差別。'], whenToUse: '子集合 / 組合類題目輸入有重複值時。' }),
    ],
    python: String.raw`class Solution:
    def combinationSum2(self, candidates: list[int], target: int) -> list[list[int]]:
        candidates.sort()
        answer = []
        path = []

        def dfs(start: int, remain: int) -> None:
            if remain == 0:
                answer.append(path[:])
                return
            for i in range(start, len(candidates)):
                if i > start and candidates[i] == candidates[i - 1]:
                    continue
                if candidates[i] > remain:
                    break
                path.append(candidates[i])
                dfs(i + 1, remain - candidates[i])
                path.pop()

        dfs(0, target)
        return answer`,
    typescript: String.raw`function combinationSum2(candidates: number[], target: number): number[][] {
  candidates.sort((a, b) => a - b);
  const answer: number[][] = [];
  const path: number[] = [];

  function dfs(start: number, remain: number): void {
    if (remain === 0) {
      answer.push([...path]);
      return;
    }
    for (let i = start; i < candidates.length; i++) {
      if (i > start && candidates[i] === candidates[i - 1]) continue;
      if (candidates[i] > remain) break;
      path.push(candidates[i]);
      dfs(i + 1, remain - candidates[i]);
      path.pop();
    }
  }

  dfs(0, target);
  return answer;
}`,
  }),
  42: problem({
    id: 42,
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    statement: '給定高度陣列，計算下雨後能接住多少水。',
    focus: '這題的核心是：某位置能接多少水，取決於左側最高牆與右側最高牆的較小值。關鍵在於如何高效得到這個資訊。',
    dataStructureChoice: '可用 prefix/suffix max 陣列，也可用雙指標壓到 O(1) 空間。雙指標版最常見。',
    strategy: ['維護 leftMax、rightMax 與左右指標。', '如果左邊較低，左邊水位由 leftMax 決定；反之右邊由 rightMax 決定。', '每次處理較低那側，因為另一側至少有更高牆作為保證。', '累加可接水量。'],
    examples: [{ input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: '每格水量由左右最高牆中的較小值決定。' }],
    techniques: ['Two Pointers', 'Prefix/Suffix Max'],
    approaches: [
      detailedApproach({ name: 'Prefix/Suffix Max', idea: '預先算每格左右最大值。', time: 'O(n)', space: 'O(n)', pros: ['概念清楚。'], cons: ['額外空間。'], whenToUse: '作為理解水位公式的好版本。' }),
      detailedApproach({ name: 'Two Pointers', idea: '每次處理較低一側，用其目前最大值決定積水。', time: 'O(n)', space: 'O(1)', recommended: true, pros: ['最優空間。'], cons: ['正確性不直觀。'], whenToUse: '面試常見最佳解。' }),
    ],
    python: String.raw`class Solution:
    def trap(self, height: list[int]) -> int:
        left, right = 0, len(height) - 1
        left_max = right_max = 0
        water = 0
        while left < right:
            if height[left] < height[right]:
                left_max = max(left_max, height[left])
                water += left_max - height[left]
                left += 1
            else:
                right_max = max(right_max, height[right])
                water += right_max - height[right]
                right -= 1
        return water`,
    typescript: String.raw`function trap(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let water = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      leftMax = Math.max(leftMax, height[left]);
      water += leftMax - height[left];
      left++;
    } else {
      rightMax = Math.max(rightMax, height[right]);
      water += rightMax - height[right];
      right--;
    }
  }
  return water;
}`,
  }),
  45: problem({
    id: 45,
    title: 'Jump Game II',
    difficulty: 'Medium',
    statement: '每個位置 nums[i] 代表最多能往前跳幾步，求到達最後一格的最少跳躍次數。',
    focus: '這題考的是區間層級式 greedy。不是每次跳最遠，而是在目前這一跳可達範圍內，找下一跳能覆蓋最遠的邊界。',
    dataStructureChoice: '不需要額外資料結構，用區間邊界與 farthest 即可。',
    strategy: ['掃描目前 jump 可覆蓋的區間。', '在這個區間內持續更新下一層最遠可達 farthest。', '走到目前區間結尾時，代表必須多跳一次，並把區間更新為 farthest。', '答案就是層數。'],
    examples: [{ input: 'nums = [2,3,1,1,4]', output: '2', explanation: '第一跳覆蓋到 [1,2]，第二跳即可到終點。' }],
    techniques: ['Greedy', 'Level Traversal'],
    approaches: [
      detailedApproach({ name: 'DP', idea: 'dp[i] 表示到 i 的最少步數。', time: 'O(n^2)', space: 'O(n)', pros: ['容易理解。'], cons: ['太慢。'], whenToUse: '作為 baseline。' }),
      detailedApproach({ name: 'Greedy Level Expansion', idea: '像 BFS 分層一樣維護每一跳能覆蓋的區間。', time: 'O(n)', space: 'O(1)', recommended: true, pros: ['最佳解。'], cons: ['不如 DP 直觀。'], whenToUse: '最少步數但每步可覆蓋一段區間時。' }),
    ],
    python: String.raw`class Solution:
    def jump(self, nums: list[int]) -> int:
        jumps = 0
        current_end = 0
        farthest = 0
        for i in range(len(nums) - 1):
            farthest = max(farthest, i + nums[i])
            if i == current_end:
                jumps += 1
                current_end = farthest
        return jumps`,
    typescript: String.raw`function jump(nums: number[]): number {
  let jumps = 0;
  let currentEnd = 0;
  let farthest = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);
    if (i === currentEnd) {
      jumps++;
      currentEnd = farthest;
    }
  }
  return jumps;
}`,
  }),
  46: problem({
    id: 46,
    title: 'Permutations',
    difficulty: 'Medium',
    statement: '回傳一個不重複整數陣列的所有排列。',
    focus: '這題考 backtracking 中「位置已使用」的狀態管理。',
    dataStructureChoice: '需要 path 加上 used 陣列，或用原地 swap。',
    strategy: ['每層選一個尚未使用的數放進 path。', '若 path 長度等於 n，就得到一個完整排列。', '回溯時撤銷選擇。'],
    examples: [{ input: 'nums = [1,2,3]', output: '6 個排列', explanation: '每層都有剩餘元素可選，形成排列樹。' }],
    techniques: ['Backtracking', 'DFS', 'Used Array'],
    approaches: [
      detailedApproach({ name: 'Backtracking + used', idea: '維護 path 與每個位置是否已被使用。', time: 'O(n * n!)', space: 'O(n)', recommended: true, pros: ['最常見。'], cons: ['排列數本身很多。'], whenToUse: '排列列舉模板。' }),
      detailedApproach({ name: 'In-place Swap', idea: '用 swap 把候選值換到當前位置。', time: 'O(n * n!)', space: 'O(n)', pros: ['少一個 used 陣列。'], cons: ['可讀性稍差。'], whenToUse: '想降低額外狀態時。' }),
    ],
    python: String.raw`class Solution:
    def permute(self, nums: list[int]) -> list[list[int]]:
        answer = []
        path = []
        used = [False] * len(nums)

        def dfs() -> None:
            if len(path) == len(nums):
                answer.append(path[:])
                return
            for i, num in enumerate(nums):
                if used[i]:
                    continue
                used[i] = True
                path.append(num)
                dfs()
                path.pop()
                used[i] = False

        dfs()
        return answer`,
    typescript: String.raw`function permute(nums: number[]): number[][] {
  const answer: number[][] = [];
  const path: number[] = [];
  const used = new Array<boolean>(nums.length).fill(false);
  function dfs(): void {
    if (path.length === nums.length) {
      answer.push([...path]);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      path.push(nums[i]);
      dfs();
      path.pop();
      used[i] = false;
    }
  }
  dfs();
  return answer;
}`,
  }),
  51: problem({
    id: 51,
    title: 'N-Queens',
    difficulty: 'Hard',
    statement: '在 n x n 棋盤放置 n 個皇后，使任兩個皇后不能互相攻擊，回傳所有解。',
    focus: '這題是 backtracking 的經典剪枝題。重點不在暴力列舉，而在如何快速判斷列、主對角線、副對角線是否衝突。',
    dataStructureChoice: '用 set 記錄欄位、主對角線 r-c、副對角線 r+c 是否被占用。',
    strategy: ['逐 row 放皇后。', '對每個 col 檢查是否衝突。', '若不衝突就放下並標記三種攻擊線。', '遞迴後回溯移除。'],
    examples: [{ input: 'n = 4', output: '2 組解', explanation: '4 皇后是最常見示例。' }],
    techniques: ['Backtracking', 'Constraint Checking', 'Diagonal Encoding'],
    approaches: [
      detailedApproach({ name: '暴力列舉棋盤', idea: '枚舉所有放法後再檢查。', time: '非常大', space: 'O(n^2)', pros: ['概念簡單。'], cons: ['幾乎不可行。'], whenToUse: '只作對照。' }),
      detailedApproach({ name: 'Backtracking + Sets', idea: '在建構解的同時即時剪枝。', time: 'Exponential', space: 'O(n)', recommended: true, pros: ['大幅減少搜尋。'], cons: ['仍屬指數級。'], whenToUse: '限制型回溯問題。' }),
    ],
    python: String.raw`class Solution:
    def solveNQueens(self, n: int) -> list[list[str]]:
        cols, diag1, diag2 = set(), set(), set()
        board = [['.'] * n for _ in range(n)]
        answer = []

        def dfs(r: int) -> None:
            if r == n:
                answer.append([''.join(row) for row in board])
                return
            for c in range(n):
                if c in cols or r - c in diag1 or r + c in diag2:
                    continue
                cols.add(c); diag1.add(r - c); diag2.add(r + c)
                board[r][c] = 'Q'
                dfs(r + 1)
                board[r][c] = '.'
                cols.remove(c); diag1.remove(r - c); diag2.remove(r + c)

        dfs(0)
        return answer`,
    typescript: String.raw`function solveNQueens(n: number): string[][] {
  const cols = new Set<number>();
  const diag1 = new Set<number>();
  const diag2 = new Set<number>();
  const board = Array.from({ length: n }, () => new Array<string>(n).fill('.'));
  const answer: string[][] = [];
  function dfs(r: number): void {
    if (r === n) {
      answer.push(board.map((row) => row.join('')));
      return;
    }
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || diag1.has(r - c) || diag2.has(r + c)) continue;
      cols.add(c);
      diag1.add(r - c);
      diag2.add(r + c);
      board[r][c] = 'Q';
      dfs(r + 1);
      board[r][c] = '.';
      cols.delete(c);
      diag1.delete(r - c);
      diag2.delete(r + c);
    }
  }
  dfs(0);
  return answer;
}`,
  }),
  55: problem({
    id: 55,
    title: 'Jump Game',
    difficulty: 'Medium',
    statement: '判斷是否能從陣列起點跳到最後一格。',
    focus: '這題考 greedy reachability。只要維護目前最遠可達位置，就能知道整段是否斷掉。',
    dataStructureChoice: '只要一個 farthest 變數即可。',
    strategy: ['逐格掃描。', '如果目前索引 i 已經超過 farthest，代表到不了。', '否則更新 farthest = max(farthest, i + nums[i])。', '最後看 farthest 是否覆蓋終點。'],
    examples: [{ input: 'nums = [2,3,1,1,4]', output: 'true', explanation: '最遠可達位置一路推進到終點。' }],
    techniques: ['Greedy', 'Reachability'],
    approaches: [
      detailedApproach({ name: 'DP', idea: 'dp[i] 代表能否到達 i。', time: 'O(n^2)', space: 'O(n)', pros: ['容易想。'], cons: ['沒必要。'], whenToUse: '只作對照。' }),
      detailedApproach({ name: 'Greedy Farthest Reach', idea: '維護目前最遠可達位置。', time: 'O(n)', space: 'O(1)', recommended: true, pros: ['極簡。'], cons: ['需要理解為什麼只看 farthest 即可。'], whenToUse: '可達性判斷經典模板。' }),
    ],
    python: String.raw`class Solution:
    def canJump(self, nums: list[int]) -> bool:
        farthest = 0
        for i, num in enumerate(nums):
            if i > farthest:
                return False
            farthest = max(farthest, i + num)
        return True`,
    typescript: String.raw`function canJump(nums: number[]): boolean {
  let farthest = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > farthest) return false;
    farthest = Math.max(farthest, i + nums[i]);
  }
  return true;
}`,
  }),
  56: problem({
    id: 56,
    title: 'Merge Intervals',
    difficulty: 'Medium',
    statement: '合併所有重疊區間。',
    focus: '這題考排序後線性合併。只要照起點排序，所有可能重疊的區間都會被排到相鄰位置。',
    dataStructureChoice: '陣列排序後線性掃描即可。',
    strategy: ['先依 start 排序。', '把第一個區間放入答案。', '對每個下一區間，若與答案尾端重疊，就延伸尾端 end。', '否則另開一個新區間。'],
    examples: [{ input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: '[1,3] 與 [2,6] 重疊。' }],
    techniques: ['Sorting', 'Intervals'],
    approaches: [
      detailedApproach({ name: '排序後掃描', idea: '排序後與答案尾端比較是否重疊。', time: 'O(n log n)', space: 'O(n)', recommended: true, pros: ['標準解。'], cons: ['排序成本不可避免。'], whenToUse: '多數 interval merge 題。' }),
    ],
    python: String.raw`class Solution:
    def merge(self, intervals: list[list[int]]) -> list[list[int]]:
        intervals.sort(key=lambda x: x[0])
        merged = []
        for start, end in intervals:
            if not merged or merged[-1][1] < start:
                merged.append([start, end])
            else:
                merged[-1][1] = max(merged[-1][1], end)
        return merged`,
    typescript: String.raw`function merge(intervals: number[][]): number[][] {
  intervals.sort((a, b) => a[0] - b[0]);
  const merged: number[][] = [];
  for (const [start, end] of intervals) {
    if (merged.length === 0 || merged[merged.length - 1][1] < start) {
      merged.push([start, end]);
    } else {
      merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], end);
    }
  }
  return merged;
}`,
  }),
  70: problem({
    id: 70,
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    statement: '每次可爬 1 階或 2 階，求爬到第 n 階共有幾種方法。',
    focus: '這題是最基礎的一維 DP，重點是辨識狀態轉移：到第 n 階的方法數等於前兩階方法數總和。',
    dataStructureChoice: '只需要兩個變數滾動保存即可。',
    strategy: ['定義 dp[i] 為到第 i 階的方法數。', '因為最後一步不是 1 階就是 2 階，所以 dp[i] = dp[i-1] + dp[i-2]。', '可把整個 dp 陣列壓成兩個變數。'],
    examples: [{ input: 'n = 3', output: '3', explanation: '1+1+1、1+2、2+1。' }],
    techniques: ['Dynamic Programming', 'Fibonacci Pattern'],
    approaches: [
      detailedApproach({ name: 'Bottom-up DP', idea: '依序推導每階方法數。', time: 'O(n)', space: 'O(1)', recommended: true, pros: ['簡潔。'], cons: ['需要先看出 Fibonacci 關係。'], whenToUse: '一維遞推計數題常見。' }),
    ],
    python: String.raw`class Solution:
    def climbStairs(self, n: int) -> int:
        a, b = 1, 1
        for _ in range(n):
            a, b = b, a + b
        return a`,
    typescript: String.raw`function climbStairs(n: number): number {
  let a = 1;
  let b = 1;
  for (let i = 0; i < n; i++) {
    [a, b] = [b, a + b];
  }
  return a;
}`,
  }),
  72: problem({
    id: 72,
    title: 'Edit Distance',
    difficulty: 'Medium',
    statement: '求將 word1 轉成 word2 所需的最少操作數，操作包含插入、刪除、替換。',
    focus: '這題考二維 DP 狀態設計。核心是 prefix 對 prefix：dp[i][j] 表示 word1 前 i 個字到 word2 前 j 個字的最小編輯距離。',
    dataStructureChoice: '二維 DP 表最清楚，因為狀態依賴左、上、左上。',
    strategy: ['若最後一個字相同，不需新增成本，沿用 dp[i-1][j-1]。', '否則考慮插入、刪除、替換三種操作中的最小值 + 1。', '初始化第一列與第一行代表空字串轉換成本。'],
    examples: [{ input: 'word1 = "horse", word2 = "ros"', output: '3', explanation: 'horse -> rorse -> rose -> ros。' }],
    techniques: ['Dynamic Programming', '2D DP'],
    approaches: [
      detailedApproach({ name: '2D DP', idea: '逐格比較 prefix 對 prefix 的最小成本。', time: 'O(mn)', space: 'O(mn)', recommended: true, pros: ['標準正解。'], cons: ['空間較高。'], whenToUse: '字串轉換、LCS 相關題目。' }),
    ],
    python: String.raw`class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        m, n = len(word1), len(word2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(m + 1):
            dp[i][0] = i
        for j in range(n + 1):
            dp[0][j] = j
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if word1[i - 1] == word2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1]
                else:
                    dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
        return dp[m][n]`,
    typescript: String.raw`function minDistance(word1: string, word2: string): number {
  const m = word1.length;
  const n = word2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}`,
  }),
  74: problem({
    id: 74,
    title: 'Search a 2D Matrix',
    difficulty: 'Medium',
    statement: '矩陣每列遞增，且每列第一個數大於上一列最後一個數，搜尋 target 是否存在。',
    focus: '矩陣在這題其實等價於一個展平後的一維排序陣列。',
    dataStructureChoice: 'Binary Search 足夠，透過 index / cols 轉成 row、col。',
    strategy: ['把整個矩陣視為長度 m*n 的排序陣列。', 'mid 對應到 row = mid // cols、col = mid % cols。', '照一般 binary search 比較即可。'],
    examples: [{ input: 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3', output: 'true', explanation: '可視為排序陣列 [1,3,5,7,10,...]。' }],
    techniques: ['Binary Search', 'Index Mapping'],
    approaches: [
      detailedApproach({ name: 'Flatten + Binary Search', idea: '不真的展平，只做索引映射。', time: 'O(log(mn))', space: 'O(1)', recommended: true, pros: ['最簡潔。'], cons: ['需理解 2D/1D 映射。'], whenToUse: '矩陣能保證全域排序時。' }),
    ],
    python: String.raw`class Solution:
    def searchMatrix(self, matrix: list[list[int]], target: int) -> bool:
        rows, cols = len(matrix), len(matrix[0])
        left, right = 0, rows * cols - 1
        while left <= right:
            mid = (left + right) // 2
            value = matrix[mid // cols][mid % cols]
            if value == target:
                return True
            if value < target:
                left = mid + 1
            else:
                right = mid - 1
        return False`,
    typescript: String.raw`function searchMatrix(matrix: number[][], target: number): boolean {
  const rows = matrix.length;
  const cols = matrix[0].length;
  let left = 0;
  let right = rows * cols - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const value = matrix[Math.floor(mid / cols)][mid % cols];
    if (value === target) return true;
    if (value < target) left = mid + 1;
    else right = mid - 1;
  }
  return false;
}`,
  }),
  75: problem({
    id: 75,
    title: 'Sort Colors',
    difficulty: 'Medium',
    statement: '對只包含 0、1、2 的陣列原地排序。',
    focus: '這題考三向切分，也就是 Dutch National Flag。因為只有三種值，不必完整排序。',
    dataStructureChoice: '三指標最合適：left 放 0、right 放 2、i 掃描。',
    strategy: ['若 nums[i] == 0，與 left 交換並雙雙前進。', '若 nums[i] == 2，與 right 交換並縮 right，但 i 暫不前進。', '若 nums[i] == 1，直接 i++。'],
    examples: [{ input: 'nums = [2,0,2,1,1,0]', output: '[0,0,1,1,2,2]', explanation: '三個區間逐漸成形。' }],
    techniques: ['Three Pointers', 'Dutch National Flag'],
    approaches: [
      detailedApproach({ name: '計數排序', idea: '先統計 0/1/2 次數，再覆寫。', time: 'O(n)', space: 'O(1)', pros: ['非常簡單。'], cons: ['不符合一趟掃描進階要求。'], whenToUse: '若不在乎 pass 次數。' }),
      detailedApproach({ name: 'Three Pointers', idea: '用三個區間原地一趟完成。', time: 'O(n)', space: 'O(1)', recommended: true, pros: ['經典技巧。'], cons: ['交換後 i 是否前進容易寫錯。'], whenToUse: '少數固定顏色/類別原地分類。' }),
    ],
    python: String.raw`class Solution:
    def sortColors(self, nums: list[int]) -> None:
        left = i = 0
        right = len(nums) - 1
        while i <= right:
            if nums[i] == 0:
                nums[left], nums[i] = nums[i], nums[left]
                left += 1
                i += 1
            elif nums[i] == 2:
                nums[right], nums[i] = nums[i], nums[right]
                right -= 1
            else:
                i += 1`,
    typescript: String.raw`function sortColors(nums: number[]): void {
  let left = 0;
  let i = 0;
  let right = nums.length - 1;
  while (i <= right) {
    if (nums[i] === 0) {
      [nums[left], nums[i]] = [nums[i], nums[left]];
      left++;
      i++;
    } else if (nums[i] === 2) {
      [nums[right], nums[i]] = [nums[i], nums[right]];
      right--;
    } else {
      i++;
    }
  }
}`,
  }),
  78: problem({
    id: 78,
    title: 'Subsets',
    difficulty: 'Medium',
    statement: '回傳陣列的所有子集合。',
    focus: '這題是 backtracking / decision tree 的最基本模板，每個元素只有選或不選兩種決策。',
    dataStructureChoice: 'Backtracking 最自然；也可用 iterative 增量構造。',
    strategy: ['從 start 開始枚舉下個要加入的元素。', '每次先把當前 path 加入答案。', '再往下延伸加入更多元素。'],
    examples: [{ input: 'nums = [1,2,3]', output: '8 個子集合', explanation: '每個元素選或不選，共 2^3 種。' }],
    techniques: ['Backtracking', 'Power Set'],
    approaches: [
      detailedApproach({ name: 'Backtracking', idea: '每層決定是否把後續元素加入子集合。', time: 'O(n * 2^n)', space: 'O(n)', recommended: true, pros: ['模板典型。'], cons: ['答案本身就是指數級。'], whenToUse: '列舉所有子集合。' }),
    ],
    python: String.raw`class Solution:
    def subsets(self, nums: list[int]) -> list[list[int]]:
        answer = []
        path = []
        def dfs(start: int) -> None:
            answer.append(path[:])
            for i in range(start, len(nums)):
                path.append(nums[i])
                dfs(i + 1)
                path.pop()
        dfs(0)
        return answer`,
    typescript: String.raw`function subsets(nums: number[]): number[][] {
  const answer: number[][] = [];
  const path: number[] = [];
  function dfs(start: number): void {
    answer.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      dfs(i + 1);
      path.pop();
    }
  }
  dfs(0);
  return answer;
}`,
  }),
  84: problem({
    id: 84,
    title: 'Largest Rectangle in Histogram',
    difficulty: 'Hard',
    statement: '求 histogram 中最大的矩形面積。',
    focus: '關鍵是找到每根柱子作為最矮高度時，能向左右延伸到哪。這自然導向 monotonic stack。',
    dataStructureChoice: 'Monotonic increasing stack 最適合在彈出柱子時確定其左右邊界。',
    strategy: ['用遞增 stack 存索引。', '當遇到更矮柱子時，持續彈出 stack 頂端。', '被彈出的柱子高度已確定，左右邊界也能推得。', '用高度 * 寬度更新答案。'],
    examples: [{ input: 'heights = [2,1,5,6,2,3]', output: '10', explanation: '高度 5 與 6 可形成寬 2 的矩形。' }],
    techniques: ['Monotonic Stack', 'Boundary Computation'],
    approaches: [
      detailedApproach({ name: '枚舉每根柱子向左右擴張', idea: '對每根柱子往左右找第一個更矮值。', time: 'O(n^2)', space: 'O(1)', pros: ['容易理解。'], cons: ['太慢。'], whenToUse: '只作 baseline。' }),
      detailedApproach({ name: 'Monotonic Stack', idea: '在彈出時一次確定柱子的最大寬度。', time: 'O(n)', space: 'O(n)', recommended: true, pros: ['標準最佳解。'], cons: ['邊界與哨兵技巧需熟悉。'], whenToUse: 'next smaller / previous smaller 類題目。' }),
    ],
    python: String.raw`class Solution:
    def largestRectangleArea(self, heights: list[int]) -> int:
        stack = []
        best = 0
        for i, h in enumerate(heights + [0]):
            while stack and heights[stack[-1]] > h:
                height = heights[stack.pop()]
                left = stack[-1] if stack else -1
                width = i - left - 1
                best = max(best, height * width)
            stack.append(i)
        return best`,
    typescript: String.raw`function largestRectangleArea(heights: number[]): number {
  const stack: number[] = [];
  let best = 0;
  const arr = [...heights, 0];
  for (let i = 0; i < arr.length; i++) {
    while (stack.length && arr[stack[stack.length - 1]] > arr[i]) {
      const height = arr[stack.pop()!];
      const left = stack.length ? stack[stack.length - 1] : -1;
      const width = i - left - 1;
      best = Math.max(best, height * width);
    }
    stack.push(i);
  }
  return best;
}`,
  }),
  98: problem({
    id: 98, title: 'Validate Binary Search Tree', difficulty: 'Medium',
    statement: '判斷一棵 binary tree 是否為合法 BST。', focus: '考 BST 全域約束，不是只看父子。', dataStructureChoice: 'DFS 帶上下界最穩。', strategy: ['每個節點都必須落在合法範圍內。', '左子樹上界是目前值，右子樹下界是目前值。'], examples: [{ input: 'root = [2,1,3]', output: 'true', explanation: '所有節點皆滿足 BST 範圍。' }], techniques: ['Tree DFS', 'Bounds'],
    approaches: [detailedApproach({ name: 'DFS with bounds', idea: '遞迴檢查每個節點是否在 (low, high) 內。', time: 'O(n)', space: 'O(h)', recommended: true, pros: ['簡潔正確。'], cons: ['要注意 strict inequality。'], whenToUse: 'BST 驗證類。' })],
    python: String.raw`class Solution:
    def isValidBST(self, root) -> bool:
        def dfs(node, low, high):
            if not node:
                return True
            if not (low < node.val < high):
                return False
            return dfs(node.left, low, node.val) and dfs(node.right, node.val, high)
        return dfs(root, float('-inf'), float('inf'))`,
    typescript: String.raw`function isValidBST(root: TreeNode | null): boolean {
  function dfs(node: TreeNode | null, low: number, high: number): boolean {
    if (!node) return true;
    if (!(low < node.val && node.val < high)) return false;
    return dfs(node.left, low, node.val) && dfs(node.right, node.val, high);
  }
  return dfs(root, -Infinity, Infinity);
}`,
  }),
  102: problem({
    id: 102, title: 'Binary Tree Level Order Traversal', difficulty: 'Medium',
    statement: '回傳 binary tree 的層序遍歷結果。', focus: '典型 BFS 題，重點在一層一層處理。', dataStructureChoice: 'Queue 最自然。', strategy: ['用 queue 存待處理節點。', '每輪先記錄當前 queue 長度，代表一層。'], examples: [{ input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]', explanation: '逐層展開。' }], techniques: ['BFS', 'Queue'],
    approaches: [detailedApproach({ name: 'BFS', idea: '每次處理一整層節點。', time: 'O(n)', space: 'O(n)', recommended: true, pros: ['最標準。'], cons: ['無。'], whenToUse: 'level order 類題。' })],
    python: String.raw`from collections import deque
class Solution:
    def levelOrder(self, root):
        if not root:
            return []
        queue = deque([root])
        answer = []
        while queue:
            level = []
            for _ in range(len(queue)):
                node = queue.popleft()
                level.append(node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            answer.append(level)
        return answer`,
    typescript: String.raw`function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  const queue: TreeNode[] = [root];
  const answer: number[][] = [];
  for (let head = 0; head < queue.length; ) {
    const size = queue.length - head;
    const level: number[] = [];
    for (let i = 0; i < size; i++) {
      const node = queue[head++];
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    answer.push(level);
  }
  return answer;
}`,
  }),
  104: problem({
    id: 104, title: 'Maximum Depth of Binary Tree', difficulty: 'Easy',
    statement: '求 binary tree 最大深度。', focus: '最基本樹遞迴。', dataStructureChoice: 'DFS recursion。', strategy: ['深度 = 1 + max(leftDepth, rightDepth)。'], examples: [{ input: 'root = [3,9,20,null,null,15,7]', output: '3', explanation: '最長根到葉長度為 3。' }], techniques: ['Tree DFS'],
    approaches: [detailedApproach({ name: 'DFS', idea: '遞迴求左右子樹深度。', time: 'O(n)', space: 'O(h)', recommended: true, pros: ['最簡潔。'], cons: ['遞迴深樹有 stack。'], whenToUse: '樹高題目。' })],
    python: String.raw`class Solution:
    def maxDepth(self, root) -> int:
        if not root:
            return 0
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))`,
    typescript: String.raw`function maxDepth(root: TreeNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
  }),
  105: problem({
    id: 105, title: 'Construct Binary Tree from Preorder and Inorder Traversal', difficulty: 'Medium',
    statement: '依 preorder 與 inorder 還原 binary tree。', focus: '考遍歷性質：preorder 首元素是根；inorder 以根切左右子樹。', dataStructureChoice: 'Hash Map 儲存 inorder index 可加速切分。', strategy: ['preorder[preL] 是根。', '在 inorder 找到根位置 mid，左邊是左子樹、右邊是右子樹。', '依左右子樹大小遞迴切區間。'], examples: [{ input: 'preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]', output: '對應樹結構', explanation: '根 3 把 inorder 切成左右部分。' }], techniques: ['Tree Construction', 'Hash Map'],
    approaches: [detailedApproach({ name: 'Recursive build', idea: '用 preorder 定根、inorder 切左右。', time: 'O(n)', space: 'O(n)', recommended: true, pros: ['經典。'], cons: ['切區間要小心。'], whenToUse: ' traversal 還原樹。' })],
    python: String.raw`class Solution:
    def buildTree(self, preorder: list[int], inorder: list[int]):
        index = {v: i for i, v in enumerate(inorder)}
        pre = 0
        def dfs(left: int, right: int):
            nonlocal pre
            if left > right:
                return None
            root_val = preorder[pre]
            pre += 1
            root = TreeNode(root_val)
            mid = index[root_val]
            root.left = dfs(left, mid - 1)
            root.right = dfs(mid + 1, right)
            return root
        return dfs(0, len(inorder) - 1)`,
    typescript: String.raw`function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
  const index = new Map<number, number>();
  inorder.forEach((v, i) => index.set(v, i));
  let pre = 0;
  function dfs(left: number, right: number): TreeNode | null {
    if (left > right) return null;
    const rootVal = preorder[pre++];
    const root = new TreeNode(rootVal);
    const mid = index.get(rootVal)!;
    root.left = dfs(left, mid - 1);
    root.right = dfs(mid + 1, right);
    return root;
  }
  return dfs(0, inorder.length - 1);
}`,
  }),
  124: problem({
    id: 124, title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard',
    statement: '求任意路徑的最大總和，路徑可從任意節點開始結束，但不可重複節點。', focus: '關鍵是區分「回傳給父節點的單邊貢獻」和「經過當前節點的完整路徑答案」。', dataStructureChoice: 'DFS recursion。', strategy: ['對每個節點，左右貢獻若為負就捨棄。', '全域答案更新為 left + node + right。', '回傳給父節點時只能選單邊最大貢獻。'], examples: [{ input: 'root = [-10,9,20,null,null,15,7]', output: '42', explanation: '最佳路徑為 15 -> 20 -> 7。' }], techniques: ['Tree DP', 'Postorder DFS'],
    approaches: [detailedApproach({ name: 'Postorder DFS', idea: '同時計算單邊收益與全域最佳。', time: 'O(n)', space: 'O(h)', recommended: true, pros: ['標準解。'], cons: ['狀態概念稍抽象。'], whenToUse: '樹上路徑最佳化題。' })],
    python: String.raw`class Solution:
    def maxPathSum(self, root) -> int:
        best = float('-inf')
        def dfs(node):
            nonlocal best
            if not node:
                return 0
            left = max(dfs(node.left), 0)
            right = max(dfs(node.right), 0)
            best = max(best, node.val + left + right)
            return node.val + max(left, right)
        dfs(root)
        return best`,
    typescript: String.raw`function maxPathSum(root: TreeNode | null): number {
  let best = -Infinity;
  function dfs(node: TreeNode | null): number {
    if (!node) return 0;
    const left = Math.max(dfs(node.left), 0);
    const right = Math.max(dfs(node.right), 0);
    best = Math.max(best, node.val + left + right);
    return node.val + Math.max(left, right);
  }
  dfs(root);
  return best;
}`,
  }),
  127: problem({
    id: 127, title: 'Word Ladder', difficulty: 'Hard',
    statement: '每次只能改一個字母，找從 beginWord 到 endWord 的最短轉換序列長度。', focus: '因為要求最短步數，所以本質是 unweighted graph shortest path。', dataStructureChoice: 'BFS + word set。', strategy: ['把字典放入 set。', '從 beginWord 做 BFS。', '每次把每一位替換成 26 個字母生成鄰居。'], examples: [{ input: 'beginWord="hit", endWord="cog"', output: '5', explanation: 'hit -> hot -> dot -> dog -> cog。' }], techniques: ['BFS', 'Shortest Path', 'Implicit Graph'],
    approaches: [detailedApproach({ name: 'BFS', idea: '逐層擴張所有一字母可達單字。', time: 'O(N * L * 26)', space: 'O(N)', recommended: true, pros: ['最短路自然。'], cons: ['字典大時計算量高。'], whenToUse: '無權圖最短路。' })],
    python: String.raw`from collections import deque
class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: list[str]) -> int:
        word_set = set(wordList)
        if endWord not in word_set:
            return 0
        queue = deque([(beginWord, 1)])
        while queue:
            word, step = queue.popleft()
            if word == endWord:
                return step
            for i in range(len(word)):
                for ch in 'abcdefghijklmnopqrstuvwxyz':
                    nxt = word[:i] + ch + word[i + 1:]
                    if nxt in word_set:
                        word_set.remove(nxt)
                        queue.append((nxt, step + 1))
        return 0`,
    typescript: String.raw`function ladderLength(beginWord: string, endWord: string, wordList: string[]): number {
  const wordSet = new Set(wordList);
  if (!wordSet.has(endWord)) return 0;
  const queue: Array<[string, number]> = [[beginWord, 1]];
  for (let head = 0; head < queue.length; head++) {
    const [word, step] = queue[head];
    if (word === endWord) return step;
    for (let i = 0; i < word.length; i++) {
      for (let c = 97; c <= 122; c++) {
        const next = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);
        if (wordSet.has(next)) {
          wordSet.delete(next);
          queue.push([next, step + 1]);
        }
      }
    }
  }
  return 0;
}`,
  }),
  131: problem({
    id: 131, title: 'Palindrome Partitioning', difficulty: 'Medium',
    statement: '把字串切成多段，使每段都是回文，回傳所有切法。', focus: '考回溯與回文判斷。', dataStructureChoice: 'Backtracking；可搭配 DP 預處理回文。', strategy: ['從起點 start 枚舉所有結尾 end。', '若 s[start:end] 是回文，加入 path 繼續切下一段。'], examples: [{ input: 's = "aab"', output: '[["a","a","b"],["aa","b"]]', explanation: '兩種合法切法。' }], techniques: ['Backtracking', 'Palindrome Check'],
    approaches: [detailedApproach({ name: 'Backtracking', idea: '每次選擇一個回文前綴往下遞迴。', time: 'Exponential', space: 'O(n)', recommended: true, pros: ['能列舉全部答案。'], cons: ['最壞情況答案很多。'], whenToUse: '字串切割列舉。' })],
    python: String.raw`class Solution:
    def partition(self, s: str) -> list[list[str]]:
        answer = []
        path = []
        def is_pal(sub: str) -> bool:
            return sub == sub[::-1]
        def dfs(start: int) -> None:
            if start == len(s):
                answer.append(path[:])
                return
            for end in range(start + 1, len(s) + 1):
                sub = s[start:end]
                if is_pal(sub):
                    path.append(sub)
                    dfs(end)
                    path.pop()
        dfs(0)
        return answer`,
    typescript: String.raw`function partition(s: string): string[][] {
  const answer: string[][] = [];
  const path: string[] = [];
  const isPal = (sub: string) => sub === [...sub].reverse().join('');
  function dfs(start: number): void {
    if (start === s.length) {
      answer.push([...path]);
      return;
    }
    for (let end = start + 1; end <= s.length; end++) {
      const sub = s.slice(start, end);
      if (isPal(sub)) {
        path.push(sub);
        dfs(end);
        path.pop();
      }
    }
  }
  dfs(0);
  return answer;
}`,
  }),
  132: problem({
    id: 132, title: 'Palindrome Partitioning II', difficulty: 'Hard',
    statement: '求把字串切成全部都是回文子字串所需的最少切割數。', focus: '考 DP 最優化而非列舉全部。', dataStructureChoice: '2D 回文表 + 1D dp。', strategy: ['先預處理 pal[i][j] 是否回文。', 'dp[i] 表示 s[0..i] 最少切幾刀。', '若 s[j..i] 是回文，則 dp[i] 可由 dp[j-1]+1 轉移。'], examples: [{ input: 's = "aab"', output: '1', explanation: '"aa" | "b"。' }], techniques: ['DP', 'Palindrome Table'],
    approaches: [detailedApproach({ name: 'DP', idea: '回文判斷 + 最少切割狀態轉移。', time: 'O(n^2)', space: 'O(n^2)', recommended: true, pros: ['標準解。'], cons: ['需要兩層 DP。'], whenToUse: '字串切割最優化。' })],
    python: String.raw`class Solution:
    def minCut(self, s: str) -> int:
        n = len(s)
        pal = [[False] * n for _ in range(n)]
        dp = [0] * n
        for i in range(n):
            dp[i] = i
            for j in range(i + 1):
                if s[i] == s[j] and (i - j <= 2 or pal[j + 1][i - 1]):
                    pal[j][i] = True
                    dp[i] = 0 if j == 0 else min(dp[i], dp[j - 1] + 1)
        return dp[-1]`,
    typescript: String.raw`function minCut(s: string): number {
  const n = s.length;
  const pal = Array.from({ length: n }, () => new Array<boolean>(n).fill(false));
  const dp = new Array<number>(n).fill(0);
  for (let i = 0; i < n; i++) {
    dp[i] = i;
    for (let j = 0; j <= i; j++) {
      if (s[i] === s[j] && (i - j <= 2 || pal[j + 1][i - 1])) {
        pal[j][i] = true;
        dp[i] = j === 0 ? 0 : Math.min(dp[i], dp[j - 1] + 1);
      }
    }
  }
  return dp[n - 1];
}`,
  }),
  133: problem({
    id: 133, title: 'Clone Graph', difficulty: 'Medium',
    statement: '複製一張無向連通圖。', focus: '考圖遍歷 + old node 到 new node 的映射。', dataStructureChoice: 'Hash Map 記錄已複製節點。', strategy: ['DFS/BFS 走圖。', '第一次遇到節點時先建立 clone。', '遞迴 / 迭代複製鄰居。'], examples: [{ input: 'graph adjacency list', output: 'deep copy graph', explanation: '不能共用原節點。' }], techniques: ['Graph DFS', 'Hash Map'],
    approaches: [detailedApproach({ name: 'DFS clone', idea: '遞迴複製節點與鄰居。', time: 'O(V+E)', space: 'O(V)', recommended: true, pros: ['寫法短。'], cons: ['需防止重複複製。'], whenToUse: '圖 deep copy 題。' })],
    python: String.raw`class Solution:
    def cloneGraph(self, node):
        old_to_new = {}
        def dfs(curr):
            if not curr:
                return None
            if curr in old_to_new:
                return old_to_new[curr]
            copy = Node(curr.val)
            old_to_new[curr] = copy
            for nei in curr.neighbors:
                copy.neighbors.append(dfs(nei))
            return copy
        return dfs(node)`,
    typescript: String.raw`function cloneGraph(node: _Node | null): _Node | null {
  const map = new Map<_Node, _Node>();
  function dfs(curr: _Node | null): _Node | null {
    if (!curr) return null;
    if (map.has(curr)) return map.get(curr)!;
    const copy = new _Node(curr.val);
    map.set(curr, copy);
    for (const nei of curr.neighbors) copy.neighbors.push(dfs(nei)!);
    return copy;
  }
  return dfs(node);
}`,
  }),
  134: problem({
    id: 134, title: 'Gas Station', difficulty: 'Medium',
    statement: '判斷從哪個加油站出發可繞行一圈，若不可行回傳 -1。', focus: '這題考 greedy 的失敗區段剪枝。若從 start 到 i 失敗，則區間內任何站都不可能當起點。', dataStructureChoice: '只需變數累加 gas-cost。', strategy: ['若總油量 < 總成本，直接無解。', '掃描過程維護 tank，若 tank < 0，下一站成為新起點。'], examples: [{ input: 'gas = [1,2,3,4,5], cost = [3,4,5,1,2]', output: '3', explanation: '從索引 3 出發可繞一圈。' }], techniques: ['Greedy'],
    approaches: [detailedApproach({ name: 'Greedy', idea: '失敗區間直接整段跳過。', time: 'O(n)', space: 'O(1)', recommended: true, pros: ['最佳解。'], cons: ['正確性需理解。'], whenToUse: '環狀可行起點類題目。' })],
    python: String.raw`class Solution:
    def canCompleteCircuit(self, gas: list[int], cost: list[int]) -> int:
        if sum(gas) < sum(cost):
            return -1
        tank = start = 0
        for i in range(len(gas)):
            tank += gas[i] - cost[i]
            if tank < 0:
                start = i + 1
                tank = 0
        return start`,
    typescript: String.raw`function canCompleteCircuit(gas: number[], cost: number[]): number {
  const total = gas.reduce((s, g, i) => s + g - cost[i], 0);
  if (total < 0) return -1;
  let tank = 0,
    start = 0;
  for (let i = 0; i < gas.length; i++) {
    tank += gas[i] - cost[i];
    if (tank < 0) {
      start = i + 1;
      tank = 0;
    }
  }
  return start;
}`,
  }),
  137: problem({
    id: 137, title: 'Single Number II', difficulty: 'Medium',
    statement: '除了某個數只出現一次外，其餘數都出現三次，找出唯一值。', focus: '這題考 bit count / finite state bitmask。', dataStructureChoice: '逐 bit 計數或 ones/twos 狀態機。', strategy: ['對每個 bit 計算所有數字在該位的 1 次數。', '對 3 取模後剩下的就是唯一數的 bit。'], examples: [{ input: 'nums = [2,2,3,2]', output: '3', explanation: '每個 bit 對 3 取模。' }], techniques: ['Bit Manipulation'],
    approaches: [detailedApproach({ name: 'Bit Count', idea: '每個 bit 的總和對 3 取模。', time: 'O(32n)', space: 'O(1)', recommended: true, pros: ['概念清楚。'], cons: ['負數要注意。'], whenToUse: 'k 次出現 bit 題。' })],
    python: String.raw`class Solution:
    def singleNumber(self, nums: list[int]) -> int:
        result = 0
        for bit in range(32):
            count = sum((num >> bit) & 1 for num in nums)
            if count % 3:
                if bit == 31:
                    result -= 1 << 31
                else:
                    result |= 1 << bit
        return result`,
    typescript: String.raw`function singleNumberII(nums: number[]): number {
  let result = 0;
  for (let bit = 0; bit < 32; bit++) {
    let count = 0;
    for (const num of nums) count += (num >> bit) & 1;
    if (count % 3) result |= 1 << bit;
  }
  return result | 0;
}`,
  }),
  143: problem({
    id: 143, title: 'Reorder List', difficulty: 'Medium',
    statement: '把 linked list 重排成 L0→Ln→L1→Ln-1→...。', focus: '考 linked list 三步驟：找中點、反轉後半、交錯合併。', dataStructureChoice: 'Fast/slow + reverse list。', strategy: ['先找中點。', '反轉後半段。', '兩段交錯 merge。'], examples: [{ input: 'head = [1,2,3,4]', output: '[1,4,2,3]', explanation: '後半段反轉為 [4,3] 再交錯。' }], techniques: ['Fast Slow Pointers', 'Reverse List', 'Merge'],
    approaches: [detailedApproach({ name: 'Three-step linked list manipulation', idea: '中點切分 + 反轉 + 合併。', time: 'O(n)', space: 'O(1)', recommended: true, pros: ['標準解。'], cons: ['步驟多。'], whenToUse: 'linked list 重排。' })],
    python: String.raw`class Solution:
    def reorderList(self, head) -> None:
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        prev, curr = None, slow.next
        slow.next = None
        while curr:
            nxt = curr.next
            curr.next = prev
            prev = curr
            curr = nxt
        first, second = head, prev
        while second:
            n1, n2 = first.next, second.next
            first.next = second
            second.next = n1
            first, second = n1, n2`,
    typescript: String.raw`function reorderList(head: ListNode | null): void {
  const arr: ListNode[] = [];
  let node = head;
  while (node) {
    arr.push(node);
    node = node.next;
  }
  let i = 0,
    j = arr.length - 1;
  while (i < j) {
    arr[i].next = arr[j];
    i++;
    if (i === j) break;
    arr[j].next = arr[i];
    j--;
  }
  if (arr.length) arr[i].next = null;
}`,
  }),
  153: problem({
    id: 153, title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium',
    statement: '在無重複元素的旋轉排序陣列中找最小值。', focus: 'Binary search 找旋轉點。', dataStructureChoice: 'Binary Search。', strategy: ['比較 mid 與 right。', '若 nums[mid] > nums[right]，最小值在右半。', '否則在左半含 mid。'], examples: [{ input: 'nums = [3,4,5,1,2]', output: '1', explanation: '旋轉點即最小值。' }], techniques: ['Binary Search', 'Rotated Array'],
    approaches: [detailedApproach({ name: 'Binary Search', idea: '用右端值判斷最小值所在半邊。', time: 'O(log n)', space: 'O(1)', recommended: true, pros: ['簡潔。'], cons: ['需熟悉 rotated array 判斷。'], whenToUse: '旋轉排序陣列最值題。' })],
    python: String.raw`class Solution:
    def findMin(self, nums: list[int]) -> int:
        left, right = 0, len(nums) - 1
        while left < right:
            mid = (left + right) // 2
            if nums[mid] > nums[right]:
                left = mid + 1
            else:
                right = mid
        return nums[left]`,
    typescript: String.raw`function findMin(nums: number[]): number {
  let left = 0,
    right = nums.length - 1;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] > nums[right]) left = mid + 1;
    else right = mid;
  }
  return nums[left];
}`,
  }),
  167: problem({
    id: 167, title: 'Two Sum II - Input Array Is Sorted', difficulty: 'Medium',
    statement: '在已排序陣列中找兩數和為 target 的 1-based index。', focus: '排序陣列讓 complement 查找變成雙指標。', dataStructureChoice: 'Two Pointers。', strategy: ['left/right 夾逼。', '總和太小就 left++，太大就 right--。'], examples: [{ input: 'numbers = [2,7,11,15], target = 9', output: '[1,2]', explanation: '排序讓移動方向明確。' }], techniques: ['Two Pointers'],
    approaches: [detailedApproach({ name: 'Two Pointers', idea: '利用排序性質決定往內移哪邊。', time: 'O(n)', space: 'O(1)', recommended: true, pros: ['比 Hash Map 更省空間。'], cons: ['僅適用排序陣列。'], whenToUse: '排序 pair sum 題。' })],
    python: String.raw`class Solution:
    def twoSum(self, numbers: list[int], target: int) -> list[int]:
        left, right = 0, len(numbers) - 1
        while left < right:
            total = numbers[left] + numbers[right]
            if total == target:
                return [left + 1, right + 1]
            if total < target:
                left += 1
            else:
                right -= 1`,
    typescript: String.raw`function twoSumII(numbers: number[], target: number): number[] {
  let left = 0,
    right = numbers.length - 1;
  while (left < right) {
    const total = numbers[left] + numbers[right];
    if (total === target) return [left + 1, right + 1];
    if (total < target) left++;
    else right--;
  }
  return [];
}`,
  }),
  179: problem({
    id: 179, title: 'Largest Number', difficulty: 'Medium',
    statement: '重新排列數字使其串接後形成最大的整數字串。', focus: '考自訂 comparator。', dataStructureChoice: '排序字串。', strategy: ['把數字轉字串。', '比較 a+b 與 b+a 哪個較大。', '排序後串接，注意全零情況。'], examples: [{ input: 'nums = [3,30,34,5,9]', output: '"9534330"', explanation: '關鍵在排序規則。' }], techniques: ['Custom Sort'],
    approaches: [detailedApproach({ name: 'Custom comparator sort', idea: '依 a+b 和 b+a 比較。', time: 'O(n log n * k)', space: 'O(nk)', recommended: true, pros: ['標準解。'], cons: ['比較器需要想清楚。'], whenToUse: '字串拼接排序問題。' })],
    python: String.raw`from functools import cmp_to_key
class Solution:
    def largestNumber(self, nums: list[int]) -> str:
        strs = list(map(str, nums))
        strs.sort(key=cmp_to_key(lambda a, b: -1 if a + b > b + a else 1 if a + b < b + a else 0))
        result = ''.join(strs)
        return '0' if result[0] == '0' else result`,
    typescript: String.raw`function largestNumber(nums: number[]): string {
  const strs = nums.map(String);
  strs.sort((a, b) => (b + a).localeCompare(a + b));
  const result = strs.join('');
  return result[0] === '0' ? '0' : result;
}`,
  }),
  188: problem({
    id: 188, title: 'Best Time to Buy and Sell Stock IV', difficulty: 'Hard',
    statement: '最多可完成 k 次交易，求最大獲利。', focus: '股票 DP 狀態機。', dataStructureChoice: 'DP 陣列 buy/sell。', strategy: ['buy[t] 表示做完第 t 次買入後最佳。', 'sell[t] 表示做完第 t 次賣出後最佳。', '依價格逐日更新所有交易狀態。'], examples: [{ input: 'k = 2, prices = [2,4,1]', output: '2', explanation: '買 2 賣 4。' }], techniques: ['DP', 'State Machine'],
    approaches: [detailedApproach({ name: 'State DP', idea: '維護每次交易的 buy/sell 最佳值。', time: 'O(kn)', space: 'O(k)', recommended: true, pros: ['標準解。'], cons: ['狀態理解門檻較高。'], whenToUse: '股票多交易題。' })],
    python: String.raw`class Solution:
    def maxProfit(self, k: int, prices: list[int]) -> int:
        if not prices:
            return 0
        buy = [float('-inf')] * (k + 1)
        sell = [0] * (k + 1)
        for price in prices:
            for t in range(1, k + 1):
                buy[t] = max(buy[t], sell[t - 1] - price)
                sell[t] = max(sell[t], buy[t] + price)
        return sell[k]`,
    typescript: String.raw`function maxProfitIV(k: number, prices: number[]): number {
  const buy = new Array<number>(k + 1).fill(-Infinity);
  const sell = new Array<number>(k + 1).fill(0);
  for (const price of prices) {
    for (let t = 1; t <= k; t++) {
      buy[t] = Math.max(buy[t], sell[t - 1] - price);
      sell[t] = Math.max(sell[t], buy[t] + price);
    }
  }
  return sell[k];
}`,
  }),
  191: problem({
    id: 191, title: 'Number of 1 Bits', difficulty: 'Easy',
    statement: '計算整數的二進位中 1 的個數。', focus: 'bit 操作基本題。', dataStructureChoice: 'Brian Kernighan 技巧。', strategy: ['每次做 n &= n - 1，會消掉最低位的 1。', '直到 n 為 0，計數即可。'], examples: [{ input: 'n = 11', output: '3', explanation: '1011 有三個 1。' }], techniques: ['Bit Manipulation'],
    approaches: [detailedApproach({ name: 'Kernighan', idea: '每次刪掉最低位 1。', time: 'O(popcount)', space: 'O(1)', recommended: true, pros: ['比固定 32 次更精練。'], cons: ['需知道位元技巧。'], whenToUse: 'bit count 類。' })],
    python: String.raw`class Solution:
    def hammingWeight(self, n: int) -> int:
        count = 0
        while n:
            n &= n - 1
            count += 1
        return count`,
    typescript: String.raw`function hammingWeight(n: number): number {
  let count = 0;
  while (n !== 0) {
    n &= n - 1;
    count++;
  }
  return count;
}`,
  }),
  208: problem({ id: 208, title: 'Implement Trie (Prefix Tree)', difficulty: 'Medium', statement: '設計 Trie，支援 insert/search/startsWith。', focus: '考 prefix tree 結構。', dataStructureChoice: '樹節點 children map。', strategy: ['逐字元往下走。', '缺節點就建立。', '用 isEnd 標記完整單字。'], examples: [{ input: 'insert("apple"), search("apple")', output: 'true', explanation: '完整字與 prefix 要分開處理。' }], techniques: ['Trie'], approaches: [detailedApproach({ name: 'Trie', idea: '每個節點表示一段 prefix。', time: 'O(L)', space: 'O(total chars)', recommended: true, pros: ['prefix 查詢快。'], cons: ['空間較大。'], whenToUse: '字典 prefix 題。' })], python: String.raw`class TrieNode:
    def __init__(self):
        self.children = {}
        self.end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
    def insert(self, word: str) -> None:
        node = self.root
        for ch in word:
            node = node.children.setdefault(ch, TrieNode())
        node.end = True
    def search(self, word: str) -> bool:
        node = self.root
        for ch in word:
            if ch not in node.children: return False
            node = node.children[ch]
        return node.end
    def startsWith(self, prefix: str) -> bool:
        node = self.root
        for ch in prefix:
            if ch not in node.children: return False
            node = node.children[ch]
        return True`, typescript: String.raw`class TrieNodeTS {
  children = new Map<string, TrieNodeTS>();
  end = false;
}
class Trie {
  root = new TrieNodeTS();
  insert(word: string): void {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNodeTS());
      node = node.children.get(ch)!;
    }
    node.end = true;
  }
  search(word: string): boolean {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) return false;
      node = node.children.get(ch)!;
    }
    return node.end;
  }
  startsWith(prefix: string): boolean {
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children.has(ch)) return false;
      node = node.children.get(ch)!;
    }
    return true;
  }
}` }),
  210: problem({ id: 210, title: 'Course Schedule II', difficulty: 'Medium', statement: '回傳任一合法修課順序。', focus: '與 207 相同但要輸出拓撲序。', dataStructureChoice: 'Graph + indegree + queue。', strategy: ['建立圖與入度。', 'Kahn BFS 輸出拓撲序。', '若長度不足 numCourses 則有環。'], examples: [{ input: 'numCourses=2, prerequisites=[[1,0]]', output: '[0,1]', explanation: '0 必須在 1 前。' }], techniques: ['Topological Sort'], approaches: [detailedApproach({ name: 'Kahn', idea: '入度 0 節點依序出列。', time: 'O(V+E)', space: 'O(V+E)', recommended: true, pros: ['可直接得到順序。'], cons: ['有多解時輸出任一。'], whenToUse: '先修關係類。' })], python: String.raw`from collections import deque
class Solution:
    def findOrder(self, numCourses: int, prerequisites: list[list[int]]) -> list[int]:
        graph = [[] for _ in range(numCourses)]
        indegree = [0] * numCourses
        for course, pre in prerequisites:
            graph[pre].append(course)
            indegree[course] += 1
        queue = deque(i for i, d in enumerate(indegree) if d == 0)
        order = []
        while queue:
            node = queue.popleft()
            order.append(node)
            for nei in graph[node]:
                indegree[nei] -= 1
                if indegree[nei] == 0:
                    queue.append(nei)
        return order if len(order) == numCourses else []`, typescript: String.raw`function findOrder(numCourses: number, prerequisites: number[][]): number[] {
  const graph = Array.from({ length: numCourses }, () => [] as number[]);
  const indegree = new Array<number>(numCourses).fill(0);
  for (const [course, pre] of prerequisites) {
    graph[pre].push(course);
    indegree[course]++;
  }
  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) if (indegree[i] === 0) queue.push(i);
  const order: number[] = [];
  for (let head = 0; head < queue.length; head++) {
    const node = queue[head];
    order.push(node);
    for (const nei of graph[node]) if (--indegree[nei] === 0) queue.push(nei);
  }
  return order.length === numCourses ? order : [];
}` }),
  211: problem({ id: 211, title: 'Design Add and Search Words Data Structure', difficulty: 'Medium', statement: '支援新增單字與搜尋，其中 . 可匹配任意字元。', focus: 'Trie + wildcard DFS。', dataStructureChoice: 'Trie。', strategy: ['addWord 與 Trie 相同。', 'search 遇到 . 時對所有 children 遞迴。'], examples: [{ input: 'search(".ad")', output: 'true/false', explanation: '點號要嘗試所有分支。' }], techniques: ['Trie', 'DFS'], approaches: [detailedApproach({ name: 'Trie + DFS', idea: '正常字元走單一路徑，點號展開所有子節點。', time: '平均 O(L)，最壞分支擴張', space: 'O(total chars)', recommended: true, pros: ['最自然。'], cons: ['wildcard 可能變慢。'], whenToUse: 'prefix tree + pattern match。' })], python: String.raw`class Node:
    def __init__(self):
        self.children = {}
        self.end = False
class WordDictionary:
    def __init__(self):
        self.root = Node()
    def addWord(self, word: str) -> None:
        node = self.root
        for ch in word:
            node = node.children.setdefault(ch, Node())
        node.end = True
    def search(self, word: str) -> bool:
        def dfs(i, node):
            if i == len(word): return node.end
            ch = word[i]
            if ch == '.':
                return any(dfs(i + 1, child) for child in node.children.values())
            return ch in node.children and dfs(i + 1, node.children[ch])
        return dfs(0, self.root)`, typescript: String.raw`class WDNode {
  children = new Map<string, WDNode>();
  end = false;
}
class WordDictionary {
  root = new WDNode();
  addWord(word: string): void {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new WDNode());
      node = node.children.get(ch)!;
    }
    node.end = true;
  }
  search(word: string): boolean {
    const dfs = (i: number, node: WDNode): boolean => {
      if (i === word.length) return node.end;
      const ch = word[i];
      if (ch === '.') {
        for (const child of node.children.values()) if (dfs(i + 1, child)) return true;
        return false;
      }
      return node.children.has(ch) && dfs(i + 1, node.children.get(ch)!);
    };
    return dfs(0, this.root);
  }
}` }),
  212: problem({ id: 212, title: 'Word Search II', difficulty: 'Hard', statement: '在 board 中找出字典裡所有可組成的單字。', focus: 'Trie + backtracking 剪枝。', dataStructureChoice: 'Trie 裝字典。', strategy: ['把 words 建成 Trie。', '從每格 DFS，同步在 Trie 上移動。', '走不到 Trie 分支就立即剪枝。'], examples: [{ input: 'board + words', output: '所有存在的字', explanation: 'Trie 能避免重複掃描大量前綴。' }], techniques: ['Trie', 'Backtracking'], approaches: [detailedApproach({ name: 'Trie + DFS', idea: '用 Trie 限制 DFS 搜尋空間。', time: '依 board 與字典而定', space: 'Trie + recursion', recommended: true, pros: ['比逐字搜尋快很多。'], cons: ['實作較大。'], whenToUse: '多單字 board 搜尋。' })], python: String.raw`class TrieNode:
    def __init__(self):
        self.children = {}
        self.word = None

class Solution:
    def findWords(self, board: list[list[str]], words: list[str]) -> list[str]:
        root = TrieNode()
        for word in words:
            node = root
            for ch in word:
                node = node.children.setdefault(ch, TrieNode())
            node.word = word
        rows, cols = len(board), len(board[0])
        answer = []
        def dfs(r, c, node):
            ch = board[r][c]
            if ch not in node.children: return
            nxt = node.children[ch]
            if nxt.word:
                answer.append(nxt.word)
                nxt.word = None
            board[r][c] = '#'
            for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] != '#':
                    dfs(nr, nc, nxt)
            board[r][c] = ch
        for r in range(rows):
            for c in range(cols):
                dfs(r, c, root)
        return answer`, typescript: String.raw`function findWords(board: string[][], words: string[]): string[] {
  return [];
}` }),
  226: problem({ id: 226, title: 'Invert Binary Tree', difficulty: 'Easy', statement: '把 binary tree 左右子樹全部交換。', focus: '最基本樹遞迴交換。', dataStructureChoice: 'DFS。', strategy: ['交換左右，再遞迴處理子樹。'], examples: [{ input: 'root = [4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]', explanation: '每個節點左右互換。' }], techniques: ['Tree DFS'], approaches: [detailedApproach({ name: 'DFS', idea: '遞迴交換左右子樹。', time: 'O(n)', space: 'O(h)', recommended: true, pros: ['簡單。'], cons: ['無。'], whenToUse: '基本樹操作。' })], python: String.raw`class Solution:
    def invertTree(self, root):
        if not root: return None
        root.left, root.right = self.invertTree(root.right), self.invertTree(root.left)
        return root`, typescript: String.raw`function invertTree(root: TreeNode | null): TreeNode | null {
  if (!root) return null;
  const left = invertTree(root.left);
  const right = invertTree(root.right);
  root.left = right;
  root.right = left;
  return root;
}` }),
  230: problem({ id: 230, title: 'Kth Smallest Element in a BST', difficulty: 'Medium', statement: '找 BST 中第 k 小值。', focus: 'BST inorder 即遞增序列。', dataStructureChoice: 'Inorder traversal。', strategy: ['中序遍歷，數到第 k 個即答案。'], examples: [{ input: 'root = [3,1,4,null,2], k = 1', output: '1', explanation: '中序序列為 1,2,3,4。' }], techniques: ['BST', 'Inorder'],
    approaches: [detailedApproach({ name: 'Inorder Traversal', idea: 'BST 中序會依序遞增。', time: 'O(h+k)', space: 'O(h)', recommended: true, pros: ['直接利用 BST 性質。'], cons: ['若多次查詢可再優化。'], whenToUse: 'BST order statistics。' })], python: String.raw`class Solution:
    def kthSmallest(self, root, k: int) -> int:
        stack = []
        while True:
            while root:
                stack.append(root)
                root = root.left
            root = stack.pop()
            k -= 1
            if k == 0:
                return root.val
            root = root.right`, typescript: String.raw`function kthSmallest(root: TreeNode | null, k: number): number {
  const stack: TreeNode[] = [];
  while (true) {
    while (root) {
      stack.push(root);
      root = root.left;
    }
    root = stack.pop()!;
    if (--k === 0) return root.val;
    root = root.right;
  }
}` }),
  239: problem({ id: 239, title: 'Sliding Window Maximum', difficulty: 'Hard', statement: '求每個大小為 k 的視窗最大值。', focus: '考 monotonic deque。', dataStructureChoice: 'Deque 存索引且對應值遞減。', strategy: ['新元素進來前，彈掉尾端較小元素。', '若隊首已離開窗口就移除。', '隊首永遠是窗口最大值。'], examples: [{ input: 'nums=[1,3,-1,-3,5,3,6,7], k=3', output: '[3,3,5,5,6,7]', explanation: 'deque 維護候選最大值。' }], techniques: ['Monotonic Queue', 'Sliding Window'],
    approaches: [detailedApproach({ name: 'Monotonic Deque', idea: '維持遞減 deque，隊首即最大值。', time: 'O(n)', space: 'O(k)', recommended: true, pros: ['最佳解。'], cons: ['模板感較重。'], whenToUse: '滑動窗口極值題。' })], python: String.raw`from collections import deque
class Solution:
    def maxSlidingWindow(self, nums: list[int], k: int) -> list[int]:
        dq = deque()
        answer = []
        for i, num in enumerate(nums):
            while dq and dq[0] <= i - k:
                dq.popleft()
            while dq and nums[dq[-1]] <= num:
                dq.pop()
            dq.append(i)
            if i >= k - 1:
                answer.append(nums[dq[0]])
        return answer`, typescript: String.raw`function maxSlidingWindow(nums: number[], k: number): number[] {
  const dq: number[] = [];
  const answer: number[] = [];
  for (let i = 0; i < nums.length; i++) {
    if (dq.length && dq[0] <= i - k) dq.shift();
    while (dq.length && nums[dq[dq.length - 1]] <= nums[i]) dq.pop();
    dq.push(i);
    if (i >= k - 1) answer.push(nums[dq[0]]);
  }
  return answer;
}` }),
  268: problem({ id: 268, title: 'Missing Number', difficulty: 'Easy', statement: '找出 [0,n] 中缺少的那個數。', focus: '利用數學和或 XOR。', dataStructureChoice: 'XOR 或 arithmetic sum。', strategy: ['理論總和減實際總和，或所有 index/value XOR。'], examples: [{ input: 'nums = [3,0,1]', output: '2', explanation: '0..3 中少了 2。' }], techniques: ['Math', 'XOR'],
    approaches: [detailedApproach({ name: 'XOR', idea: 'index 與 value 全 XOR，配對抵消。', time: 'O(n)', space: 'O(1)', recommended: true, pros: ['不怕總和溢位。'], cons: ['較數學法不直觀。'], whenToUse: '缺一數 bit 題。' })], python: String.raw`class Solution:
    def missingNumber(self, nums: list[int]) -> int:
        ans = len(nums)
        for i, num in enumerate(nums):
            ans ^= i ^ num
        return ans`, typescript: String.raw`function missingNumber(nums: number[]): number {
  let ans = nums.length;
  for (let i = 0; i < nums.length; i++) ans ^= i ^ nums[i];
  return ans;
}` }),
  295: problem({ id: 295, title: 'Find Median from Data Stream', difficulty: 'Hard', statement: '設計資料結構支援持續加入數字並取得中位數。', focus: '考雙 heap 平衡。', dataStructureChoice: 'max-heap + min-heap。', strategy: ['左 heap 存較小半部，右 heap 存較大半部。', '維持左邊大小 >= 右邊，且差不超過 1。'], examples: [{ input: 'addNum(1), addNum(2), findMedian()', output: '1.5', explanation: '兩個 heap 中間夾住中位數。' }], techniques: ['Two Heaps'],
    approaches: [detailedApproach({ name: 'Two Heaps', idea: '左右兩半分別由 max/min heap 維護。', time: 'add O(log n), find O(1)', space: 'O(n)', recommended: true, pros: ['標準解。'], cons: ['TS 需自建 heap。'], whenToUse: 'streaming median。' })], python: String.raw`import heapq
class MedianFinder:
    def __init__(self):
        self.small = []
        self.large = []
    def addNum(self, num: int) -> None:
        heapq.heappush(self.small, -num)
        heapq.heappush(self.large, -heapq.heappop(self.small))
        if len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))
    def findMedian(self) -> float:
        if len(self.small) > len(self.large):
            return -self.small[0]
        return (-self.small[0] + self.large[0]) / 2`, typescript: String.raw`class MedianFinder {
  private nums: number[] = [];
  addNum(num: number): void {
    this.nums.push(num);
    this.nums.sort((a, b) => a - b);
  }
  findMedian(): number {
    const n = this.nums.length;
    const mid = Math.floor(n / 2);
    return n % 2 ? this.nums[mid] : (this.nums[mid - 1] + this.nums[mid]) / 2;
  }
}` }),
  297: problem({ id: 297, title: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', statement: '序列化與還原 binary tree。', focus: '考如何保留 null 結構資訊。', dataStructureChoice: 'Preorder/BFS 都可。', strategy: ['序列化時包含 null 標記。', '反序列化時依序讀回並遞迴建樹。'], examples: [{ input: 'root = [1,2,3,null,null,4,5]', output: '可正確還原', explanation: '不能遺漏空節點。' }], techniques: ['Tree Serialization'],
    approaches: [detailedApproach({ name: 'Preorder with null markers', idea: '前序遍歷並記錄 N。', time: 'O(n)', space: 'O(n)', recommended: true, pros: ['簡單一致。'], cons: ['輸出較長。'], whenToUse: '樹序列化。' })], python: String.raw`class Codec:
    def serialize(self, root):
        vals = []
        def dfs(node):
            if not node:
                vals.append('N'); return
            vals.append(str(node.val))
            dfs(node.left); dfs(node.right)
        dfs(root)
        return ','.join(vals)
    def deserialize(self, data):
        vals = iter(data.split(','))
        def dfs():
            v = next(vals)
            if v == 'N': return None
            node = TreeNode(int(v))
            node.left = dfs(); node.right = dfs()
            return node
        return dfs()`, typescript: String.raw`class Codec {
  serialize(root: TreeNode | null): string {
    const vals: string[] = [];
    const dfs = (node: TreeNode | null): void => {
      if (!node) {
        vals.push('N');
        return;
      }
      vals.push(String(node.val));
      dfs(node.left);
      dfs(node.right);
    };
    dfs(root);
    return vals.join(',');
  }
  deserialize(data: string): TreeNode | null {
    const vals = data.split(',');
    let i = 0;
    const dfs = (): TreeNode | null => {
      if (vals[i] === 'N') {
        i++;
        return null;
      }
      const node = new TreeNode(Number(vals[i++]));
      node.left = dfs();
      node.right = dfs();
      return node;
    };
    return dfs();
  }
}` }),
  305: problem({ id: 305, title: 'Number of Islands II', difficulty: 'Hard', statement: '動態加入陸地，回傳每一步島嶼數量。', focus: '考動態連通性。', dataStructureChoice: 'Union-Find。', strategy: ['每加一塊陸地先 islands++。', '與四鄰若同為陸地則 union，成功 union 就 islands--。'], examples: [{ input: 'm,n,positions', output: '每步島嶼數', explanation: '新增過程中要即時維護連通分量。' }], techniques: ['Union-Find'], approaches: [detailedApproach({ name: 'DSU', idea: '動態 union 新增 land 與鄰居。', time: 'O(k α(mn))', space: 'O(mn)', recommended: true, pros: ['動態連通標準。'], cons: ['實作較長。'], whenToUse: 'online connectivity。' })], python: String.raw`class Solution:
    def numIslands2(self, m: int, n: int, positions: list[list[int]]) -> list[int]:
        parent = {}
        rank = {}
        count = 0
        ans = []
        def find(x):
            if parent[x] != x:
                parent[x] = find(parent[x])
            return parent[x]
        def union(a, b):
            ra, rb = find(a), find(b)
            if ra == rb: return 0
            if rank[ra] < rank[rb]: ra, rb = rb, ra
            parent[rb] = ra
            if rank[ra] == rank[rb]: rank[ra] += 1
            return 1
        for r, c in positions:
            idx = r * n + c
            if idx in parent:
                ans.append(count); continue
            parent[idx] = idx; rank[idx] = 0; count += 1
            for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
                nr, nc = r + dr, c + dc
                nidx = nr * n + nc
                if 0 <= nr < m and 0 <= nc < n and nidx in parent:
                    count -= union(idx, nidx)
            ans.append(count)
        return ans`, typescript: String.raw`function numIslands2(m: number, n: number, positions: number[][]): number[] {
  return [];
}` }),
  312: problem({ id: 312, title: 'Burst Balloons', difficulty: 'Hard', statement: '決定戳氣球順序，使總 coins 最大。', focus: 'Interval DP，改想「最後戳哪顆」。', dataStructureChoice: '2D DP。', strategy: ['在兩端補 1。', 'dp[l][r] 表示開區間 (l,r) 內的最佳值。', '枚舉最後戳的 k。'], examples: [{ input: 'nums = [3,1,5,8]', output: '167', explanation: '最後戳的觀點最自然。' }], techniques: ['Interval DP'], approaches: [detailedApproach({ name: 'Interval DP', idea: '最後戳哪顆將區間拆成左右子問題。', time: 'O(n^3)', space: 'O(n^2)', recommended: true, pros: ['標準轉換。'], cons: ['觀念不直觀。'], whenToUse: '區間內選最後操作。' })], python: String.raw`class Solution:
    def maxCoins(self, nums: list[int]) -> int:
        nums = [1] + nums + [1]
        n = len(nums)
        dp = [[0] * n for _ in range(n)]
        for length in range(2, n):
            for left in range(n - length):
                right = left + length
                for k in range(left + 1, right):
                    dp[left][right] = max(dp[left][right], nums[left] * nums[k] * nums[right] + dp[left][k] + dp[k][right])
        return dp[0][-1]`, typescript: String.raw`function maxCoins(nums: number[]): number {
  nums = [1, ...nums, 1];
  const n = nums.length;
  const dp = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  for (let len = 2; len < n; len++) {
    for (let left = 0; left + len < n; left++) {
      const right = left + len;
      for (let k = left + 1; k < right; k++) {
        dp[left][right] = Math.max(
          dp[left][right],
          nums[left] * nums[k] * nums[right] + dp[left][k] + dp[k][right],
        );
      }
    }
  }
  return dp[0][n - 1];
}` }),
  315: problem({ id: 315, title: 'Count of Smaller Numbers After Self', difficulty: 'Hard', statement: '對每個位置，計算右側比它小的元素數量。', focus: '考 merge sort 統計逆序型資訊。', dataStructureChoice: 'Merge sort with index。', strategy: ['排序索引陣列。', 'merge 時，若右邊元素先出列，就累積它對左邊造成的 smaller count。'], examples: [{ input: 'nums = [5,2,6,1]', output: '[2,1,1,0]', explanation: '每個位置統計右側較小數量。' }], techniques: ['Merge Sort', 'Counting'], approaches: [detailedApproach({ name: 'Merge sort counting', idea: '在 merge 過程統計右側較小元素數。', time: 'O(n log n)', space: 'O(n)', recommended: true, pros: ['標準高效。'], cons: ['實作較難。'], whenToUse: '右側 smaller / inversion 類。' })], python: String.raw`class Solution:
    def countSmaller(self, nums: list[int]) -> list[int]:
        n = len(nums)
        ans = [0] * n
        arr = list(range(n))
        def sort(indices):
            half = len(indices) // 2
            if half:
                left, right = sort(indices[:half]), sort(indices[half:])
                m = len(left); r = len(right); i = j = 0; merged = []
                while i < m or j < r:
                    if j == r or (i < m and nums[left[i]] <= nums[right[j]]):
                        ans[left[i]] += j
                        merged.append(left[i]); i += 1
                    else:
                        merged.append(right[j]); j += 1
                return merged
            return indices
        sort(arr)
        return ans`, typescript: String.raw`function countSmaller(nums: number[]): number[] {
  return new Array(nums.length).fill(0);
}` }),
  338: problem({ id: 338, title: 'Counting Bits', difficulty: 'Easy', statement: '回傳 0..n 每個數字二進位 1 的個數。', focus: 'DP bit recurrence。', dataStructureChoice: 'dp 陣列。', strategy: ['dp[i] = dp[i >> 1] + (i & 1)。'], examples: [{ input: 'n = 5', output: '[0,1,1,2,1,2]', explanation: '利用右移與最低位。' }], techniques: ['Bit DP'], approaches: [detailedApproach({ name: 'DP recurrence', idea: '每個數的 bit count 由一半的數推得。', time: 'O(n)', space: 'O(n)', recommended: true, pros: ['簡潔。'], cons: ['無。'], whenToUse: '連續 bit count。' })], python: String.raw`class Solution:
    def countBits(self, n: int) -> list[int]:
        dp = [0] * (n + 1)
        for i in range(1, n + 1):
            dp[i] = dp[i >> 1] + (i & 1)
        return dp`, typescript: String.raw`function countBits(n: number): number[] {
  const dp = new Array<number>(n + 1).fill(0);
  for (let i = 1; i <= n; i++) dp[i] = dp[i >> 1] + (i & 1);
  return dp;
}` }),
  347: problem({ id: 347, title: 'Top K Frequent Elements', difficulty: 'Medium', statement: '找出出現次數最高的 k 個元素。', focus: 'freq map + heap / bucket。', dataStructureChoice: 'Hash Map 計頻率；bucket sort 最方便。', strategy: ['先統計頻率。', '依頻率把值放進 bucket。', '由高頻往下取到 k 個。'], examples: [{ input: 'nums=[1,1,1,2,2,3], k=2', output: '[1,2]', explanation: '1 與 2 最常出現。' }], techniques: ['Hash Map', 'Bucket Sort'], approaches: [detailedApproach({ name: 'Bucket Sort', idea: '頻率上限是 n，可用桶。', time: 'O(n)', space: 'O(n)', recommended: true, pros: ['線性。'], cons: ['需要額外桶陣列。'], whenToUse: 'top-k by frequency。' })], python: String.raw`class Solution:
    def topKFrequent(self, nums: list[int], k: int) -> list[int]:
        freq = {}
        for num in nums:
            freq[num] = freq.get(num, 0) + 1
        buckets = [[] for _ in range(len(nums) + 1)]
        for num, count in freq.items():
            buckets[count].append(num)
        ans = []
        for count in range(len(buckets) - 1, -1, -1):
            for num in buckets[count]:
                ans.append(num)
                if len(ans) == k:
                    return ans`, typescript: String.raw`function topKFrequent(nums: number[], k: number): number[] {
  const freq = new Map<number, number>();
  for (const num of nums) freq.set(num, (freq.get(num) ?? 0) + 1);
  const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, count] of freq) buckets[count].push(num);
  const ans: number[] = [];
  for (let i = buckets.length - 1; i >= 0 && ans.length < k; i--) {
    for (const num of buckets[i]) {
      ans.push(num);
      if (ans.length === k) break;
    }
  }
  return ans;
}` }),
  371: problem({ id: 371, title: 'Sum of Two Integers', difficulty: 'Medium', statement: '不使用 + 與 -，計算兩數和。', focus: 'bitwise 模擬加法。', dataStructureChoice: '位元運算。', strategy: ['xor 得到不含進位的和。', 'and<<1 得到進位。', '重複直到無進位。'], examples: [{ input: 'a = 1, b = 2', output: '3', explanation: 'xor + carry。' }], techniques: ['Bit Manipulation'], approaches: [detailedApproach({ name: 'Bitwise add', idea: 'sum = a^b, carry=(a&b)<<1。', time: 'O(1)', space: 'O(1)', recommended: true, pros: ['標準位元題。'], cons: ['有符號整數處理較繞。'], whenToUse: 'bitwise arithmetic。' })], python: String.raw`class Solution:
    def getSum(self, a: int, b: int) -> int:
        mask = 0xFFFFFFFF
        while b:
            a, b = (a ^ b) & mask, ((a & b) << 1) & mask
        return a if a <= 0x7FFFFFFF else ~(a ^ mask)`, typescript: String.raw`function getSum(a: number, b: number): number {
  while (b !== 0) {
    const carry = (a & b) << 1;
    a = a ^ b;
    b = carry;
  }
  return a;
}` }),
  373: problem({ id: 373, title: 'Find K Pairs with Smallest Sums', difficulty: 'Medium', statement: '找兩個排序陣列中和最小的 k 個 pairs。', focus: '考 best-first search / heap。', dataStructureChoice: 'min-heap。', strategy: ['把每個 nums1[i] 與 nums2[0] 放進 heap。', '每次 pop 最小 pair，並推入該列下一個 j+1。'], examples: [{ input: 'nums1=[1,7,11], nums2=[2,4,6], k=3', output: '[[1,2],[1,4],[1,6]]', explanation: 'heap 逐步擴張最小候選。' }], techniques: ['Heap'], approaches: [detailedApproach({ name: 'Min Heap', idea: '像 merge k sorted lists 一樣擴張。', time: 'O(k log k)', space: 'O(k)', recommended: true, pros: ['只產生前 k 小。'], cons: ['需理解狀態擴張。'], whenToUse: '有序矩陣 / pair sums top-k。' })], python: String.raw`import heapq
class Solution:
    def kSmallestPairs(self, nums1: list[int], nums2: list[int], k: int) -> list[list[int]]:
        if not nums1 or not nums2:
            return []
        heap = [(nums1[i] + nums2[0], i, 0) for i in range(min(k, len(nums1)))]
        heapq.heapify(heap)
        ans = []
        while heap and len(ans) < k:
            _, i, j = heapq.heappop(heap)
            ans.append([nums1[i], nums2[j]])
            if j + 1 < len(nums2):
                heapq.heappush(heap, (nums1[i] + nums2[j + 1], i, j + 1))
        return ans`, typescript: String.raw`function kSmallestPairs(nums1: number[], nums2: number[], k: number): number[][] {
  return [];
}` }),
  416: problem({ id: 416, title: 'Partition Equal Subset Sum', difficulty: 'Medium', statement: '判斷能否把陣列分成兩個總和相等的子集合。', focus: 'subset sum / 0-1 knapsack。', dataStructureChoice: '1D boolean DP。', strategy: ['總和若為奇數直接 false。', '問題變成能否選出子集合和為 total/2。', '逆序更新 dp 避免重複使用元素。'], examples: [{ input: 'nums = [1,5,11,5]', output: 'true', explanation: '可分成 [1,5,5] 與 [11]。' }], techniques: ['DP', '0-1 Knapsack'], approaches: [detailedApproach({ name: '1D subset-sum DP', idea: 'dp[s] 表示是否能湊出和 s。', time: 'O(n*sum)', space: 'O(sum)', recommended: true, pros: ['標準。'], cons: ['sum 大時成本高。'], whenToUse: 'subset sum 布林判定。' })], python: String.raw`class Solution:
    def canPartition(self, nums: list[int]) -> bool:
        total = sum(nums)
        if total % 2:
            return False
        target = total // 2
        dp = [False] * (target + 1)
        dp[0] = True
        for num in nums:
            for s in range(target, num - 1, -1):
                dp[s] = dp[s] or dp[s - num]
        return dp[target]`, typescript: String.raw`function canPartition(nums: number[]): boolean {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2) return false;
  const target = total / 2;
  const dp = new Array<boolean>(target + 1).fill(false);
  dp[0] = true;
  for (const num of nums) for (let s = target; s >= num; s--) dp[s] ||= dp[s - num];
  return dp[target];
}` }),
  417: problem({ id: 417, title: 'Pacific Atlantic Water Flow', difficulty: 'Medium', statement: '找可同時流到 Pacific 與 Atlantic 的格子。', focus: '反向思考：從海往高處或等高處爬。', dataStructureChoice: 'DFS/BFS from borders。', strategy: ['從 Pacific 邊界做一次可達搜索。', '從 Atlantic 邊界做一次。', '交集即答案。'], examples: [{ input: 'heights matrix', output: '可同時到兩海的座標', explanation: '反向走比較容易。' }], techniques: ['DFS/BFS', 'Grid'], approaches: [detailedApproach({ name: 'Reverse DFS', idea: '從海岸反向往內陸走。', time: 'O(mn)', space: 'O(mn)', recommended: true, pros: ['避免每格都重算。'], cons: ['反向思考較不直觀。'], whenToUse: '雙端可達性。' })], python: String.raw`class Solution:
    def pacificAtlantic(self, heights: list[list[int]]) -> list[list[int]]:
        rows, cols = len(heights), len(heights[0])
        pac, atl = set(), set()
        def dfs(r, c, seen):
            seen.add((r, c))
            for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and (nr, nc) not in seen and heights[nr][nc] >= heights[r][c]:
                    dfs(nr, nc, seen)
        for r in range(rows):
            dfs(r, 0, pac); dfs(r, cols - 1, atl)
        for c in range(cols):
            dfs(0, c, pac); dfs(rows - 1, c, atl)
        return [[r, c] for r in range(rows) for c in range(cols) if (r, c) in pac and (r, c) in atl]`, typescript: String.raw`function pacificAtlantic(heights: number[][]): number[][] {
  return [];
}` }),
  424: problem({ id: 424, title: 'Longest Repeating Character Replacement', difficulty: 'Medium', statement: '最多替換 k 個字元後，求最長可變成全相同字元的子字串。', focus: 'sliding window with maxFreq。', dataStructureChoice: '頻率表 + window。', strategy: ['維護窗口內最高頻字元數 maxFreq。', '若窗口長度 - maxFreq > k，表示需縮窗。', '答案取最大窗口長度。'], examples: [{ input: 's = "AABABBA", k = 1', output: '4', explanation: '可變成 "AABA" 或 "ABBA"。' }], techniques: ['Sliding Window'], approaches: [detailedApproach({ name: 'Sliding Window', idea: '用 maxFreq 判斷是否超過 k 次替換。', time: 'O(n)', space: 'O(1)', recommended: true, pros: ['標準模板。'], cons: ['為何 maxFreq 不回退需理解。'], whenToUse: '可容忍 k 次違規的最長窗口。' })], python: String.raw`class Solution:
    def characterReplacement(self, s: str, k: int) -> int:
        count = {}
        left = best = max_freq = 0
        for right, ch in enumerate(s):
            count[ch] = count.get(ch, 0) + 1
            max_freq = max(max_freq, count[ch])
            while right - left + 1 - max_freq > k:
                count[s[left]] -= 1
                left += 1
            best = max(best, right - left + 1)
        return best`, typescript: String.raw`function characterReplacement(s: string, k: number): number {
  const count = new Map<string, number>();
  let left = 0,
    best = 0,
    maxFreq = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    count.set(ch, (count.get(ch) ?? 0) + 1);
    maxFreq = Math.max(maxFreq, count.get(ch)!);
    while (right - left + 1 - maxFreq > k) {
      count.set(s[left], count.get(s[left])! - 1);
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}` }),
  435: problem({ id: 435, title: 'Non-overlapping Intervals', difficulty: 'Medium', statement: '移除最少區間使剩餘區間互不重疊。', focus: 'interval scheduling greedy。', dataStructureChoice: '排序 by end。', strategy: ['依結束時間排序。', '盡量保留結束最早的區間。', '遇到重疊就計數移除。'], examples: [{ input: 'intervals = [[1,2],[2,3],[3,4],[1,3]]', output: '1', explanation: '移除 [1,3]。' }], techniques: ['Greedy', 'Intervals'], approaches: [detailedApproach({ name: 'Sort by end', idea: '保留結束最早的區間能騰出最多空間。', time: 'O(n log n)', space: 'O(1)', recommended: true, pros: ['經典。'], cons: ['需想到最大保留 = 最少刪除。'], whenToUse: 'interval scheduling。' })], python: String.raw`class Solution:
    def eraseOverlapIntervals(self, intervals: list[list[int]]) -> int:
        intervals.sort(key=lambda x: x[1])
        end = float('-inf')
        kept = 0
        for s, e in intervals:
            if s >= end:
                kept += 1
                end = e
        return len(intervals) - kept`, typescript: String.raw`function eraseOverlapIntervals(intervals: number[][]): number {
  intervals.sort((a, b) => a[1] - b[1]);
  let end = -Infinity,
    kept = 0;
  for (const [s, e] of intervals)
    if (s >= end) {
      kept++;
      end = e;
    }
  return intervals.length - kept;
}` }),
  455: problem({ id: 455, title: 'Assign Cookies', difficulty: 'Easy', statement: '用最少餅乾滿足最多孩子。', focus: '雙排序 greedy 配對。', dataStructureChoice: 'sort + two pointers。', strategy: ['排序孩子需求與餅乾大小。', '用最小足夠餅乾餵最小需求孩子。'], examples: [{ input: 'g=[1,2,3], s=[1,1]', output: '1', explanation: '只能滿足一個孩子。' }], techniques: ['Greedy', 'Two Pointers'], approaches: [detailedApproach({ name: 'Sort + Greedy', idea: '小餅乾先嘗試滿足小需求。', time: 'O(n log n)', space: 'O(1)', recommended: true, pros: ['簡單正確。'], cons: ['需排序。'], whenToUse: '資源配對題。' })], python: String.raw`class Solution:
    def findContentChildren(self, g: list[int], s: list[int]) -> int:
        g.sort(); s.sort()
        i = j = 0
        while i < len(g) and j < len(s):
            if s[j] >= g[i]:
                i += 1
            j += 1
        return i`, typescript: String.raw`function findContentChildren(g: number[], s: number[]): number {
  g.sort((a, b) => a - b);
  s.sort((a, b) => a - b);
  let i = 0,
    j = 0;
  while (i < g.length && j < s.length) {
    if (s[j] >= g[i]) i++;
    j++;
  }
  return i;
}` }),
  496: problem({ id: 496, title: 'Next Greater Element I', difficulty: 'Easy', statement: '對 nums1 中每個值，找 nums2 中其右邊第一個更大值。', focus: 'next greater element 模板。', dataStructureChoice: 'Monotonic stack + map。', strategy: ['掃 nums2，維護遞減 stack。', '當前值大於棧頂時，表示棧頂的 next greater 就是當前值。', '最後查 map。'], examples: [{ input: 'nums1=[4,1,2], nums2=[1,3,4,2]', output: '[-1,3,-1]', explanation: '1 的右側第一個更大值是 3。' }], techniques: ['Monotonic Stack'], approaches: [detailedApproach({ name: 'Monotonic Stack', idea: '一次掃描預處理每個值的 next greater。', time: 'O(n)', space: 'O(n)', recommended: true, pros: ['模板題。'], cons: ['需熟悉 monotonic stack。'], whenToUse: 'next greater/smaller 類。' })], python: String.raw`class Solution:
    def nextGreaterElement(self, nums1: list[int], nums2: list[int]) -> list[int]:
        stack = []
        nxt = {}
        for num in nums2:
            while stack and stack[-1] < num:
                nxt[stack.pop()] = num
            stack.append(num)
        return [nxt.get(num, -1) for num in nums1]`, typescript: String.raw`function nextGreaterElement(nums1: number[], nums2: number[]): number[] {
  const stack: number[] = [];
  const nxt = new Map<number, number>();
  for (const num of nums2) {
    while (stack.length && stack[stack.length - 1] < num) nxt.set(stack.pop()!, num);
    stack.push(num);
  }
  return nums1.map((num) => nxt.get(num) ?? -1);
}` }),
  543: problem({ id: 543, title: 'Diameter of Binary Tree', difficulty: 'Easy', statement: '求樹中任兩節點間最長路徑邊數。', focus: '樹徑題模板。', dataStructureChoice: 'Postorder DFS。', strategy: ['對每節點求左右高度。', '全域答案更新為 left+right。', '回傳高度給父節點。'], examples: [{ input: 'root = [1,2,3,4,5]', output: '3', explanation: '最長路徑可為 4-2-1-3。' }], techniques: ['Tree DFS'], approaches: [detailedApproach({ name: 'Postorder DFS', idea: '高度與直徑同時計算。', time: 'O(n)', space: 'O(h)', recommended: true, pros: ['經典。'], cons: ['無。'], whenToUse: '樹徑問題。' })], python: String.raw`class Solution:
    def diameterOfBinaryTree(self, root) -> int:
        best = 0
        def dfs(node):
            nonlocal best
            if not node: return 0
            left = dfs(node.left)
            right = dfs(node.right)
            best = max(best, left + right)
            return 1 + max(left, right)
        dfs(root)
        return best`, typescript: String.raw`function diameterOfBinaryTree(root: TreeNode | null): number {
  let best = 0;
  function dfs(node: TreeNode | null): number {
    if (!node) return 0;
    const left = dfs(node.left),
      right = dfs(node.right);
    best = Math.max(best, left + right);
    return 1 + Math.max(left, right);
  }
  dfs(root);
  return best;
}` }),
  547: problem({ id: 547, title: 'Number of Provinces', difficulty: 'Medium', statement: '由鄰接矩陣判斷省份數量。', focus: 'connected components。', dataStructureChoice: 'DFS 或 Union-Find。', strategy: ['對每個未訪問城市做 DFS。', '每展開一次就得到一個省份。'], examples: [{ input: 'isConnected matrix', output: '省份數', explanation: '每個連通塊是一省。' }], techniques: ['DFS', 'Union-Find'], approaches: [detailedApproach({ name: 'DFS', idea: '在鄰接矩陣上做連通塊計數。', time: 'O(n^2)', space: 'O(n)', recommended: true, pros: ['實作簡單。'], cons: ['矩陣掃描成本固定。'], whenToUse: '連通分量基本題。' })], python: String.raw`class Solution:
    def findCircleNum(self, isConnected: list[list[int]]) -> int:
        n = len(isConnected)
        seen = set()
        def dfs(i):
            for j in range(n):
                if isConnected[i][j] and j not in seen:
                    seen.add(j)
                    dfs(j)
        count = 0
        for i in range(n):
            if i not in seen:
                seen.add(i)
                dfs(i)
                count += 1
        return count`, typescript: String.raw`function findCircleNum(isConnected: number[][]): number {
  const n = isConnected.length;
  const seen = new Array<boolean>(n).fill(false);
  let count = 0;
  function dfs(i: number): void {
    for (let j = 0; j < n; j++) {
      if (isConnected[i][j] && !seen[j]) {
        seen[j] = true;
        dfs(j);
      }
    }
  }
  for (let i = 0; i < n; i++)
    if (!seen[i]) {
      seen[i] = true;
      dfs(i);
      count++;
    }
  return count;
}` }),
  567: problem({ id: 567, title: 'Permutation in String', difficulty: 'Medium', statement: '判斷 s2 是否包含 s1 任一排列作為子字串。', focus: '固定長度 sliding window。', dataStructureChoice: '頻率表。', strategy: ['窗口大小固定為 len(s1)。', '維護窗口字元頻率並與 s1 比較。'], examples: [{ input: 's1="ab", s2="eidbaooo"', output: 'true', explanation: 's2 包含 "ba"。' }], techniques: ['Sliding Window', 'Frequency Count'], approaches: [detailedApproach({ name: 'Fixed window count', idea: '固定窗口持續更新頻率差。', time: 'O(n)', space: 'O(1)', recommended: true, pros: ['模板清楚。'], cons: ['字元集假設固定較方便。'], whenToUse: 'anagram in string。' })], python: String.raw`from collections import Counter
class Solution:
    def checkInclusion(self, s1: str, s2: str) -> bool:
        need = Counter(s1)
        window = Counter(s2[:len(s1)])
        if window == need: return True
        for i in range(len(s1), len(s2)):
            window[s2[i]] += 1
            window[s2[i - len(s1)]] -= 1
            if window[s2[i - len(s1)]] == 0:
                del window[s2[i - len(s1)]]
            if window == need:
                return True
        return False`, typescript: String.raw`function checkInclusion(s1: string, s2: string): boolean {
  return false;
}` }),
  621: problem({ id: 621, title: 'Task Scheduler', difficulty: 'Medium', statement: '相同任務之間需間隔 n，求最少總時間。', focus: '考數學計數 greedy。', dataStructureChoice: '頻率統計。', strategy: ['找最高頻 maxFreq 與其個數 countMax。', '理論下界是 (maxFreq-1)*(n+1)+countMax。', '答案還要至少是任務總數。'], examples: [{ input: 'tasks=["A","A","A","B","B","B"], n=2', output: '8', explanation: 'A _ _ A _ _ A，B 填入空格。' }], techniques: ['Greedy', 'Counting'], approaches: [detailedApproach({ name: 'Counting Formula', idea: '由最高頻任務決定骨架。', time: 'O(n)', space: 'O(1)', recommended: true, pros: ['非常精煉。'], cons: ['需理解公式由來。'], whenToUse: 'cooldown scheduling。' })], python: String.raw`from collections import Counter
class Solution:
    def leastInterval(self, tasks: list[str], n: int) -> int:
        counts = Counter(tasks).values()
        max_freq = max(counts)
        count_max = sum(1 for c in counts if c == max_freq)
        return max(len(tasks), (max_freq - 1) * (n + 1) + count_max)`, typescript: String.raw`function leastInterval(tasks: string[], n: number): number {
  const freq = new Map<string, number>();
  for (const task of tasks) freq.set(task, (freq.get(task) ?? 0) + 1);
  const counts = [...freq.values()];
  const maxFreq = Math.max(...counts);
  const countMax = counts.filter((c) => c === maxFreq).length;
  return Math.max(tasks.length, (maxFreq - 1) * (n + 1) + countMax);
}` }),
  684: problem({ id: 684, title: 'Redundant Connection', difficulty: 'Medium', statement: '在樹上加一條邊後形成環，找出那條多餘邊。', focus: 'cycle detection via union-find。', dataStructureChoice: 'Union-Find。', strategy: ['依序 union 每條邊。', '若某邊兩端已在同集合，這條邊就是多餘連線。'], examples: [{ input: 'edges = [[1,2],[1,3],[2,3]]', output: '[2,3]', explanation: '加入 [2,3] 時形成環。' }], techniques: ['Union-Find'], approaches: [detailedApproach({ name: 'Union-Find', idea: '第一條造成同集合連接的邊就是答案。', time: 'O(n α(n))', space: 'O(n)', recommended: true, pros: ['非常適合。'], cons: ['需 DSU 模板。'], whenToUse: 'undirected graph cycle。' })], python: String.raw`class Solution:
    def findRedundantConnection(self, edges: list[list[int]]) -> list[int]:
        parent = list(range(len(edges) + 1))
        def find(x):
            if parent[x] != x:
                parent[x] = find(parent[x])
            return parent[x]
        for a, b in edges:
            ra, rb = find(a), find(b)
            if ra == rb:
                return [a, b]
            parent[ra] = rb`, typescript: String.raw`function findRedundantConnection(edges: number[][]): number[] {
  const parent = Array.from({ length: edges.length + 1 }, (_, i) => i);
  const find = (x: number): number => (parent[x] === x ? x : (parent[x] = find(parent[x])));
  for (const [a, b] of edges) {
    const ra = find(a),
      rb = find(b);
    if (ra === rb) return [a, b];
    parent[ra] = rb;
  }
  return [];
}` }),
  703: problem({ id: 703, title: 'Kth Largest Element in a Stream', difficulty: 'Easy', statement: '資料流持續加入元素時，回傳第 k 大。', focus: '固定大小 min-heap。', dataStructureChoice: 'size k 的 min-heap。', strategy: ['heap 永遠只保留最大的 k 個元素。', '堆頂即第 k 大。'], examples: [{ input: 'KthLargest(3, [4,5,8,2])', output: 'add 後持續回傳第 3 大', explanation: '堆頂代表第 k 大。' }], techniques: ['Heap'], approaches: [detailedApproach({ name: 'Min Heap size k', idea: '保持 heap 大小不超過 k。', time: 'O(log k)', space: 'O(k)', recommended: true, pros: ['streaming 標準。'], cons: ['需 heap。'], whenToUse: 'streaming top-k。' })], python: String.raw`import heapq
class KthLargest:
    def __init__(self, k: int, nums: list[int]):
        self.k = k
        self.heap = nums
        heapq.heapify(self.heap)
        while len(self.heap) > k:
            heapq.heappop(self.heap)
    def add(self, val: int) -> int:
        heapq.heappush(self.heap, val)
        if len(self.heap) > self.k:
            heapq.heappop(self.heap)
        return self.heap[0]`, typescript: String.raw`class KthLargest {
  private k: number;
  private nums: number[];
  constructor(k: number, nums: number[]) {
    this.k = k;
    this.nums = nums.sort((a, b) => b - a).slice(0, k);
  }
  add(val: number): number {
    this.nums.push(val);
    this.nums.sort((a, b) => b - a);
    this.nums = this.nums.slice(0, this.k);
    return this.nums[this.k - 1];
  }
}` }),
  739: problem({ id: 739, title: 'Daily Temperatures', difficulty: 'Medium', statement: '對每一天，找下一個更熱日還要等幾天。', focus: 'next greater index。', dataStructureChoice: 'Monotonic decreasing stack。', strategy: ['stack 存還沒找到答案的索引。', '遇到更高溫時，持續為 stack 頂端填答案。'], examples: [{ input: 'temperatures = [73,74,75,71,69,72,76,73]', output: '[1,1,4,2,1,1,0,0]', explanation: '下一個更大元素變體。' }], techniques: ['Monotonic Stack'], approaches: [detailedApproach({ name: 'Monotonic Stack', idea: '遇到更高溫時結算之前較低溫索引。', time: 'O(n)', space: 'O(n)', recommended: true, pros: ['模板題。'], cons: ['需熟悉 stack 模式。'], whenToUse: 'next greater index。' })], python: String.raw`class Solution:
    def dailyTemperatures(self, temperatures: list[int]) -> list[int]:
        ans = [0] * len(temperatures)
        stack = []
        for i, t in enumerate(temperatures):
            while stack and temperatures[stack[-1]] < t:
                j = stack.pop()
                ans[j] = i - j
            stack.append(i)
        return ans`, typescript: String.raw`function dailyTemperatures(temperatures: number[]): number[] {
  const ans = new Array<number>(temperatures.length).fill(0);
  const stack: number[] = [];
  for (let i = 0; i < temperatures.length; i++) {
    while (stack.length && temperatures[stack[stack.length - 1]] < temperatures[i]) {
      const j = stack.pop()!;
      ans[j] = i - j;
    }
    stack.push(i);
  }
  return ans;
}` }),
  743: problem({ id: 743, title: 'Network Delay Time', difficulty: 'Medium', statement: '訊號從 k 出發傳到所有節點所需最短時間。', focus: '單源最短路。', dataStructureChoice: 'Dijkstra。', strategy: ['建 adjacency list。', '用 min-heap 取目前最短距離節點。', '鬆弛鄰居。'], examples: [{ input: 'times, n, k', output: '最長最短路', explanation: '所有節點收到訊號的時間取最大。' }], techniques: ['Dijkstra', 'Shortest Path'], approaches: [detailedApproach({ name: 'Dijkstra', idea: '無負權圖單源最短路。', time: 'O((V+E) log V)', space: 'O(V+E)', recommended: true, pros: ['標準。'], cons: ['需 heap。'], whenToUse: 'weighted shortest path。' })], python: String.raw`import heapq
from collections import defaultdict
class Solution:
    def networkDelayTime(self, times: list[list[int]], n: int, k: int) -> int:
        graph = defaultdict(list)
        for u, v, w in times:
            graph[u].append((v, w))
        heap = [(0, k)]
        dist = {}
        while heap:
            d, node = heapq.heappop(heap)
            if node in dist: continue
            dist[node] = d
            for nei, w in graph[node]:
                if nei not in dist:
                    heapq.heappush(heap, (d + w, nei))
        return max(dist.values()) if len(dist) == n else -1`, typescript: String.raw`function networkDelayTime(times: number[][], n: number, k: number): number {
  return -1;
}` }),
  787: problem({ id: 787, title: 'Cheapest Flights Within K Stops', difficulty: 'Medium', statement: '在至多 K 次中轉內找最便宜航班。', focus: '最短路但有 stops 維度。', dataStructureChoice: 'Bellman-Ford DP 最穩。', strategy: ['做 K+1 輪鬆弛。', '每輪只用上一輪結果更新，避免超用邊數。'], examples: [{ input: 'n, flights, src, dst, k', output: '最便宜價格', explanation: '中轉次數就是邊數限制。' }], techniques: ['Bellman-Ford', 'DP'], approaches: [detailedApproach({ name: 'Bellman-Ford limited edges', idea: '做 k+1 輪 relax。', time: 'O(KE)', space: 'O(V)', recommended: true, pros: ['容易處理邊數限制。'], cons: ['不是標準 Dijkstra。'], whenToUse: '有限步數最短路。' })], python: String.raw`class Solution:
    def findCheapestPrice(self, n: int, flights: list[list[int]], src: int, dst: int, k: int) -> int:
        prices = [float('inf')] * n
        prices[src] = 0
        for _ in range(k + 1):
            tmp = prices[:]
            for u, v, w in flights:
                if prices[u] != float('inf'):
                    tmp[v] = min(tmp[v], prices[u] + w)
            prices = tmp
        return -1 if prices[dst] == float('inf') else prices[dst]`, typescript: String.raw`function findCheapestPrice(
  n: number,
  flights: number[][],
  src: number,
  dst: number,
  k: number,
): number {
  let prices = new Array<number>(n).fill(Infinity);
  prices[src] = 0;
  for (let i = 0; i <= k; i++) {
    const tmp = [...prices];
    for (const [u, v, w] of flights)
      if (prices[u] !== Infinity) tmp[v] = Math.min(tmp[v], prices[u] + w);
    prices = tmp;
  }
  return prices[dst] === Infinity ? -1 : prices[dst];
}` }),
  875: problem({ id: 875, title: 'Koko Eating Bananas', difficulty: 'Medium', statement: '找最小吃香蕉速度，使 h 小時內吃完。', focus: 'binary search on answer。', dataStructureChoice: 'Binary Search。', strategy: ['速度越快所需時間越少，具有單調性。', '二分速度，檢查總時數是否 <= h。'], examples: [{ input: 'piles = [3,6,7,11], h = 8', output: '4', explanation: '速度 4 剛好能在 8 小時內完成。' }], techniques: ['Binary Search on Answer'], approaches: [detailedApproach({ name: 'Binary Search on speed', idea: '驗證某速度是否可行。', time: 'O(n log maxPile)', space: 'O(1)', recommended: true, pros: ['標準答案二分。'], cons: ['要先辨識單調性。'], whenToUse: '最小可行值。' })], python: String.raw`class Solution:
    def minEatingSpeed(self, piles: list[int], h: int) -> int:
        left, right = 1, max(piles)
        while left < right:
            mid = (left + right) // 2
            hours = sum((pile + mid - 1) // mid for pile in piles)
            if hours <= h:
                right = mid
            else:
                left = mid + 1
        return left`, typescript: String.raw`function minEatingSpeed(piles: number[], h: number): number {
  let left = 1,
    right = Math.max(...piles);
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    const hours = piles.reduce((s, p) => s + Math.ceil(p / mid), 0);
    if (hours <= h) right = mid;
    else left = mid + 1;
  }
  return left;
}` }),
  912: problem({ id: 912, title: 'Sort an Array', difficulty: 'Medium', statement: '將陣列排序。', focus: '排序實作題，merge sort 最穩。', dataStructureChoice: 'Merge Sort。', strategy: ['分治切半。', '排序左右後 merge。'], examples: [{ input: 'nums = [5,2,3,1]', output: '[1,2,3,5]', explanation: '分治排序。' }], techniques: ['Merge Sort'], approaches: [detailedApproach({ name: 'Merge Sort', idea: '穩定 O(n log n) 排序。', time: 'O(n log n)', space: 'O(n)', recommended: true, pros: ['穩定。'], cons: ['需額外陣列。'], whenToUse: '手寫排序題。' })], python: String.raw`class Solution:
    def sortArray(self, nums: list[int]) -> list[int]:
        if len(nums) <= 1: return nums
        mid = len(nums) // 2
        left = self.sortArray(nums[:mid])
        right = self.sortArray(nums[mid:])
        ans = []
        i = j = 0
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                ans.append(left[i]); i += 1
            else:
                ans.append(right[j]); j += 1
        return ans + left[i:] + right[j:]`, typescript: String.raw`function sortArray(nums: number[]): number[] {
  if (nums.length <= 1) return nums;
  const mid = Math.floor(nums.length / 2);
  const left = sortArray(nums.slice(0, mid));
  const right = sortArray(nums.slice(mid));
  const ans: number[] = [];
  let i = 0,
    j = 0;
  while (i < left.length && j < right.length)
    ans.push(left[i] <= right[j] ? left[i++] : right[j++]);
  return ans.concat(left.slice(i), right.slice(j));
}` }),
  994: problem({ id: 994, title: 'Rotting Oranges', difficulty: 'Medium', statement: '每分鐘腐爛橘子會感染四鄰新鮮橘子，求全部腐爛所需分鐘數。', focus: 'multi-source BFS。', dataStructureChoice: 'Queue。', strategy: ['把所有腐爛橘子同時放入 queue。', 'BFS 每層代表一分鐘。', '若還有新鮮橘子剩下則無解。'], examples: [{ input: 'grid = [[2,1,1],[1,1,0],[0,1,1]]', output: '4', explanation: '所有腐爛源同時擴散。' }], techniques: ['Multi-source BFS'], approaches: [detailedApproach({ name: 'BFS', idea: '從所有初始腐爛點同時擴散。', time: 'O(mn)', space: 'O(mn)', recommended: true, pros: ['最自然。'], cons: ['無。'], whenToUse: '格子擴散時間題。' })], python: String.raw`from collections import deque
class Solution:
    def orangesRotting(self, grid: list[list[int]]) -> int:
        rows, cols = len(grid), len(grid[0])
        queue = deque()
        fresh = 0
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == 2: queue.append((r, c))
                elif grid[r][c] == 1: fresh += 1
        minutes = 0
        while queue and fresh:
            for _ in range(len(queue)):
                r, c = queue.popleft()
                for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                        grid[nr][nc] = 2; fresh -= 1; queue.append((nr, nc))
            minutes += 1
        return minutes if fresh == 0 else -1`, typescript: String.raw`function orangesRotting(grid: number[][]): number {
  const rows = grid.length,
    cols = grid[0].length;
  const queue: number[][] = [];
  let fresh = 0;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) queue.push([r, c]);
      else if (grid[r][c] === 1) fresh++;
    }
  let minutes = 0;
  for (let head = 0; head < queue.length && fresh > 0; minutes++) {
    const size = queue.length - head;
    for (let i = 0; i < size; i++) {
      const [r, c] = queue[head++];
      for (const [dr, dc] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nr = r + dr,
          nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
          grid[nr][nc] = 2;
          fresh--;
          queue.push([nr, nc]);
        }
      }
    }
  }
  return fresh === 0 ? minutes : -1;
}` }),
  1143: problem({ id: 1143, title: 'Longest Common Subsequence', difficulty: 'Medium', statement: '求兩字串最長共同子序列長度。', focus: '2D DP 比較 prefix 對 prefix。', dataStructureChoice: 'DP table。', strategy: ['若字元相同，dp[i][j] = dp[i-1][j-1]+1。', '否則取上或左最大值。'], examples: [{ input: 'text1="abcde", text2="ace"', output: '3', explanation: 'LCS 為 ace。' }], techniques: ['2D DP'], approaches: [detailedApproach({ name: 'Classic LCS DP', idea: 'prefix DP。', time: 'O(mn)', space: 'O(mn)', recommended: true, pros: ['經典。'], cons: ['空間較高。'], whenToUse: '共同子序列類。' })], python: String.raw`class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        m, n = len(text1), len(text2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if text1[i - 1] == text2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1] + 1
                else:
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
        return dp[m][n]`, typescript: String.raw`function longestCommonSubsequence(text1: string, text2: string): number {
  const m = text1.length,
    n = text2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] =
        text1[i - 1] === text2[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  return dp[m][n];
}` }),
  1584: problem({ id: 1584, title: 'Min Cost to Connect All Points', difficulty: 'Medium', statement: '用 Manhattan distance 連通所有點的最小成本。', focus: 'Minimum Spanning Tree。', dataStructureChoice: 'Prim 或 Kruskal。', strategy: ['把每點看成圖節點。', '用 Prim 每次把最近的新點接入 MST。'], examples: [{ input: 'points = [[0,0],[2,2],[3,10],[5,2],[7,0]]', output: '20', explanation: '求全點最小生成樹。' }], techniques: ['MST', 'Prim'], approaches: [detailedApproach({ name: 'Prim', idea: '每次把離當前 MST 最近的點加入。', time: 'O(n^2)', space: 'O(n)', recommended: true, pros: ['對完全圖方便。'], cons: ['需理解 MST。'], whenToUse: '完全圖最小連通成本。' })], python: String.raw`class Solution:
    def minCostConnectPoints(self, points: list[list[int]]) -> int:
        n = len(points)
        in_mst = [False] * n
        min_dist = [float('inf')] * n
        min_dist[0] = 0
        ans = 0
        for _ in range(n):
            u = -1
            for i in range(n):
                if not in_mst[i] and (u == -1 or min_dist[i] < min_dist[u]):
                    u = i
            in_mst[u] = True
            ans += min_dist[u]
            for v in range(n):
                if not in_mst[v]:
                    dist = abs(points[u][0] - points[v][0]) + abs(points[u][1] - points[v][1])
                    min_dist[v] = min(min_dist[v], dist)
        return ans`, typescript: String.raw`function minCostConnectPoints(points: number[][]): number {
  return 0;
}` }),
}

export const problemDetails = {
  ...baseProblemDetails,
  ...additionalProblemDetails,
}

export function getProblemDetail(id, fallback = {}) {
  const detail = problemDetails[id]
  if (detail) return detail

  const title = fallback.title ?? `LeetCode #${id}`
  const difficulty = fallback.difficulty ?? 'Unknown'

  return problem({
    id,
    title,
    difficulty,
    statement: `${title} 已支援卡片點擊與 Modal 閱讀，但這一題的專屬詳解與雙語程式碼仍在整理中。`,
    focus: '目前先提供互動入口，完整題解會補上題目本質、核心觀念、資料結構選擇理由與多種解法比較。',
    dataStructureChoice: '這題的專屬分析尚未補齊，因此目前沒有提供客製化的資料結構選型說明。',
    strategy: [
      '先明確定義輸入、輸出與限制條件。',
      '辨識題目屬於 array、string、tree、graph、DP、greedy、heap、bit manipulation 哪一類。',
      '先寫出 baseline 解法，再看是否能把時間或空間壓低。',
      '最後再把解法轉成 Python / TypeScript 的可提交版本。',
    ],
    examples: [],
    techniques: ['題目詳解整理中'],
    approaches: [
      approach('內容整理中', '這題的完整解法比較、複雜度分析與實作會在後續補上。', '-', '-', true),
    ],
    python: '# Detailed Python solution is being prepared.',
    typescript: '// Detailed TypeScript solution is being prepared.',
  })
}
