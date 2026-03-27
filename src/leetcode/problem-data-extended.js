import { detailedApproach, problem } from './problem-helpers.js'

const example = (input, output, explanation) => ({ input, output, explanation })

function buildApproaches({ baseline, optimized }) {
  return [
    detailedApproach({
      name: baseline.name ?? 'Baseline',
      idea: baseline.idea,
      time: baseline.time,
      space: baseline.space,
      pros: baseline.pros ?? ['思路直接，容易先確認題意與正確性。'],
      cons: baseline.cons ?? ['會做不少重複工作，資料一大就容易超時。'],
      whenToUse: baseline.whenToUse ?? '適合先建立初始解法，再往更有效率的版本優化。',
    }),
    detailedApproach({
      name: optimized.name,
      idea: optimized.idea,
      time: optimized.time,
      space: optimized.space,
      recommended: true,
      pros: optimized.pros ?? ['能抓住題目真正的不變式，是面試與實戰常見標準解。'],
      cons: optimized.cons ?? ['實作時要仔細處理邊界條件與狀態更新順序。'],
      whenToUse: optimized.whenToUse ?? '當輸入規模偏大，或題目明顯在考特定 pattern 時應優先使用。',
    }),
  ]
}

function buildProblem({
  id,
  title,
  difficulty,
  statement,
  focus,
  dataStructureChoice,
  strategy,
  example: sample,
  techniques,
  baseline,
  optimized,
  python,
  typescript,
}) {
  return problem({
    id,
    title,
    difficulty,
    statement,
    focus,
    dataStructureChoice,
    strategy,
    examples: [sample],
    techniques,
    approaches: buildApproaches({ baseline, optimized }),
    python,
    typescript,
  })
}

export const additionalProblemDetails = Object.fromEntries([
  buildProblem({
    id: 53,
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    statement: '給定整數陣列 nums，請找出總和最大的連續子陣列，並回傳它的總和。',
    focus: '這題考的是你能不能把「所有子陣列」壓縮成「以當前位置結尾的最佳答案」。一旦你發現負貢獻前綴不值得保留，Kadane 的狀態轉移就很自然。',
    dataStructureChoice: '不需要額外資料結構，只要用常數變數記錄目前延伸中的最佳和全域最佳值即可。這類題的重點不是存資料，而是如何定義 DP 狀態。',
    strategy: [
      '定義 curr 表示以目前位置結尾的最大子陣列和。',
      '每加入一個 nums[i]，決定要接在前一段後面，還是直接從 nums[i] 重新開始。',
      '每一步同步更新 best，代表掃描到目前為止看過的最大答案。',
    ],
    example: example('nums = [-2,1,-3,4,-1,2,1,-5,4]', '6', '最佳連續子陣列是 [4,-1,2,1]，總和為 6。'),
    techniques: ['Kadane', '1D DP', '狀態壓縮'],
    baseline: {
      name: 'Enumerate All Subarrays',
      idea: '固定每個起點後往右累加，枚舉所有連續子陣列的總和後取最大值。',
      time: 'O(n^2)',
      space: 'O(1)',
    },
    optimized: {
      name: "Kadane's Algorithm",
      idea: 'curr = max(nums[i], curr + nums[i])，只保留對未來還有幫助的前綴和。',
      time: 'O(n)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def maxSubArray(self, nums: list[int]) -> int:
        curr = best = nums[0]

        for num in nums[1:]:
            curr = max(num, curr + num)
            best = max(best, curr)

        return best`,
    typescript: String.raw`function maxSubArray(nums: number[]): number {
  let curr = nums[0]
  let best = nums[0]

  for (let i = 1; i < nums.length; i++) {
    curr = Math.max(nums[i], curr + nums[i])
    best = Math.max(best, curr)
  }

  return best
}`,
  }),
  buildProblem({
    id: 121,
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    statement: '給定股價陣列 prices，最多只能買一次與賣一次，請回傳可以得到的最大利潤；若無法獲利則回傳 0。',
    focus: '這題在考單次掃描時如何同時維護「歷史最低買入價」與「當前可得到的最佳利潤」。本質上是 prefix minimum 搭配即時比較。',
    dataStructureChoice: '只需要兩個變數：目前為止最低價格與最佳利潤。因為每一天的賣出選擇，只依賴之前最便宜的買點。',
    strategy: [
      '從左到右掃描價格，把 minPrice 視為目前能買到的最低成本。',
      '在每一天都計算如果今天賣出，可得到的利潤 prices[i] - minPrice。',
      '持續更新答案，最後得到整段資料的最大利潤。',
    ],
    example: example('prices = [7,1,5,3,6,4]', '5', '在價格 1 買入、價格 6 賣出，最大利潤為 5。'),
    techniques: ['Single Pass', 'Prefix Minimum', 'Greedy Scan'],
    baseline: {
      name: 'Check Every Buy-Sell Pair',
      idea: '對每一個買入日枚舉所有之後的賣出日，計算最大差值。',
      time: 'O(n^2)',
      space: 'O(1)',
    },
    optimized: {
      name: 'Track Minimum Price',
      idea: '掃描時維護歷史最低價，再用目前價格去更新最大獲利。',
      time: 'O(n)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        min_price = float('inf')
        best = 0

        for price in prices:
            min_price = min(min_price, price)
            best = max(best, price - min_price)

        return best`,
    typescript: String.raw`function maxProfit(prices: number[]): number {
  let minPrice = Infinity
  let best = 0

  for (const price of prices) {
    minPrice = Math.min(minPrice, price)
    best = Math.max(best, price - minPrice)
  }

  return best
}`,
  }),
  buildProblem({
    id: 152,
    title: 'Maximum Product Subarray',
    difficulty: 'Medium',
    statement: '給定整數陣列 nums，請找出乘積最大的連續子陣列，並回傳該乘積。',
    focus: '這題與最大子陣列和不同，因為負數乘負數會翻正，所以除了最大值，還要同步追蹤最小值。狀態定義是否完整是關鍵。',
    dataStructureChoice: '仍然只需要常數空間，但要維護 maxEnding 與 minEnding 兩個狀態，因為符號翻轉會讓最小值瞬間變最大值。',
    strategy: [
      '掃描每個數字 num 時，先保留上一輪的 maxEnding 與 minEnding。',
      '新的最大值來自 num、num * prevMax、num * prevMin 三者的最大值。',
      '同步更新全域最佳乘積 best。',
    ],
    example: example('nums = [2,3,-2,4]', '6', '子陣列 [2,3] 的乘積為 6，是最大答案。'),
    techniques: ['DP', '狀態雙追蹤', '符號翻轉'],
    baseline: {
      name: 'Enumerate Products',
      idea: '固定每個起點後往右乘過去，枚舉所有連續子陣列乘積後取最大值。',
      time: 'O(n^2)',
      space: 'O(1)',
    },
    optimized: {
      name: 'Track Max and Min Product',
      idea: '同時維護當前最大與最小乘積，讓負數翻轉時仍能保留最佳候選。',
      time: 'O(n)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def maxProduct(self, nums: list[int]) -> int:
        max_ending = min_ending = best = nums[0]

        for num in nums[1:]:
            candidates = (num, num * max_ending, num * min_ending)
            max_ending = max(candidates)
            min_ending = min(candidates)
            best = max(best, max_ending)

        return best`,
    typescript: String.raw`function maxProduct(nums: number[]): number {
  let maxEnding = nums[0]
  let minEnding = nums[0]
  let best = nums[0]

  for (let i = 1; i < nums.length; i++) {
    const num = nums[i]
    const candidates = [num, num * maxEnding, num * minEnding]
    maxEnding = Math.max(...candidates)
    minEnding = Math.min(...candidates)
    best = Math.max(best, maxEnding)
  }

  return best
}`,
  }),
  buildProblem({
    id: 169,
    title: 'Majority Element',
    difficulty: 'Easy',
    statement: '給定大小為 n 的整數陣列 nums，請找出出現次數大於 n / 2 的元素。',
    focus: '這題重點是理解「多數元素會抵消掉所有非多數元素後仍然存活」。如果你能說出投票法的不變式，就表示不只是背答案。',
    dataStructureChoice: 'Hash Map 可以直接計次；若追求更佳空間，Boyer-Moore Voting 只需要一個 candidate 與一個 counter。',
    strategy: [
      '把不同元素之間的配對視為互相抵消。',
      '當 counter 歸零時，就把目前元素設為新的 candidate。',
      '最後留下的 candidate 就是多數元素。',
    ],
    example: example('nums = [2,2,1,1,1,2,2]', '2', '元素 2 出現 4 次，大於 n / 2 = 3。'),
    techniques: ['Boyer-Moore Voting', 'Hash Counting', '抵消思維'],
    baseline: {
      name: 'Hash Count',
      idea: '用 Hash Map 計算每個數字出現次數，找到超過一半的元素。',
      time: 'O(n)',
      space: 'O(n)',
    },
    optimized: {
      name: 'Boyer-Moore Voting',
      idea: '用 candidate 與 count 模擬相異元素互相抵消，最後留下多數元素。',
      time: 'O(n)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def majorityElement(self, nums: list[int]) -> int:
        candidate = 0
        count = 0

        for num in nums:
            if count == 0:
                candidate = num
            count += 1 if num == candidate else -1

        return candidate`,
    typescript: String.raw`function majorityElement(nums: number[]): number {
  let candidate = 0
  let count = 0

  for (const num of nums) {
    if (count === 0) {
      candidate = num
    }
    count += num === candidate ? 1 : -1
  }

  return candidate
}`,
  }),
  buildProblem({
    id: 189,
    title: 'Rotate Array',
    difficulty: 'Medium',
    statement: '給定整數陣列 nums，將陣列向右輪轉 k 步，並且盡量在原地完成。',
    focus: '這題考的是你能不能把輪轉拆成區段反轉，而不是直接想到建立新陣列。面試中常用來看你對 in-place 轉換是否熟悉。',
    dataStructureChoice: '若不在乎額外空間，開新陣列最直觀；若要求原地，reverse 三次是最經典的做法，只需要 O(1) 額外空間。',
    strategy: [
      '先把 k 對陣列長度取模，避免多轉一整圈。',
      '先反轉整個陣列，讓尾段移到前面。',
      '再分別反轉前 k 個與後 n-k 個元素，恢復各自的相對順序。',
    ],
    example: example('nums = [1,2,3,4,5,6,7], k = 3', '[5,6,7,1,2,3,4]', '右移 3 步後，尾端三個元素會被搬到最前面。'),
    techniques: ['Array Reverse', 'In-place Transform', 'Index Mapping'],
    baseline: {
      name: 'Extra Array',
      idea: '建立新陣列，把 nums[i] 放到 (i + k) % n 的位置，再覆寫回原陣列。',
      time: 'O(n)',
      space: 'O(n)',
    },
    optimized: {
      name: 'Reverse Three Times',
      idea: '先反轉整體，再反轉前後兩段，完成原地輪轉。',
      time: 'O(n)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def rotate(self, nums: list[int], k: int) -> None:
        n = len(nums)
        k %= n

        def reverse(left: int, right: int) -> None:
            while left < right:
                nums[left], nums[right] = nums[right], nums[left]
                left += 1
                right -= 1

        reverse(0, n - 1)
        reverse(0, k - 1)
        reverse(k, n - 1)`,
    typescript: String.raw`function rotate(nums: number[], k: number): void {
  const n = nums.length
  k %= n

  const reverse = (left: number, right: number) => {
    while (left < right) {
      ;[nums[left], nums[right]] = [nums[right], nums[left]]
      left++
      right--
    }
  }

  reverse(0, n - 1)
  reverse(0, k - 1)
  reverse(k, n - 1)
}`,
  }),
  buildProblem({
    id: 2,
    title: 'Add Two Numbers',
    difficulty: 'Medium',
    statement: '給定兩個反向儲存數字的 linked list，請將兩數相加並以相同格式回傳結果 linked list。',
    focus: '這題核心不是大數加法，而是能不能把「逐位相加 + 進位」穩定地落在 linked list 指標操作上。dummy node 與 carry 是關鍵。',
    dataStructureChoice: 'Linked List 已經決定了輸入輸出的結構，實作時最重要的是使用 dummy head 來簡化節點串接，避免處理第一個節點時分支太多。',
    strategy: [
      '用兩個指標同步走訪 l1 與 l2，不存在的節點視為 0。',
      '每一位把 val1、val2 與 carry 相加，建立新節點 sum % 10。',
      '把 carry 更新成 sum // 10，最後若 carry 仍存在就再補一個節點。',
    ],
    example: example('l1 = [2,4,3], l2 = [5,6,4]', '[7,0,8]', '342 + 465 = 807，因此答案是 [7,0,8]。'),
    techniques: ['Linked List', 'Carry Handling', 'Dummy Node'],
    baseline: {
      name: 'Convert to Arrays First',
      idea: '先把 linked list 轉成陣列或字串後再模擬加法，最後重新建表。',
      time: 'O(n + m)',
      space: 'O(n + m)',
    },
    optimized: {
      name: 'Direct List Simulation',
      idea: '邊走訪邊處理進位，直接建立結果 linked list，不需要額外保存所有位數。',
      time: 'O(n + m)',
      space: 'O(1) extra',
    },
    python: String.raw`class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode(0)
        tail = dummy
        carry = 0

        while l1 or l2 or carry:
            val1 = l1.val if l1 else 0
            val2 = l2.val if l2 else 0
            total = val1 + val2 + carry
            carry = total // 10

            tail.next = ListNode(total % 10)
            tail = tail.next

            l1 = l1.next if l1 else None
            l2 = l2.next if l2 else None

        return dummy.next`,
    typescript: String.raw`function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy = new ListNode(0)
  let tail = dummy
  let carry = 0

  while (l1 || l2 || carry) {
    const val1 = l1 ? l1.val : 0
    const val2 = l2 ? l2.val : 0
    const total = val1 + val2 + carry
    carry = Math.floor(total / 10)

    tail.next = new ListNode(total % 10)
    tail = tail.next

    l1 = l1 ? l1.next : null
    l2 = l2 ? l2.next : null
  }

  return dummy.next
}`,
  }),
  buildProblem({
    id: 24,
    title: 'Swap Nodes in Pairs',
    difficulty: 'Medium',
    statement: '給定 linked list，請每兩個節點交換一次並回傳新的 head，不能只交換值。',
    focus: '這題測的是局部指標重接的能力。你要清楚知道一組兩個節點交換時，前後指標的連接順序，否則很容易斷鏈。',
    dataStructureChoice: 'Dummy node 可以統一處理 head 被交換的情況，讓每一輪都只專注在 prev、first、second、nextPair 這四個連結。',
    strategy: [
      '建立 dummy 並讓 prev 指向每一組 pair 前面的節點。',
      '抓出 first、second、nextPair，先讓 second 指向 first，再補上前後連結。',
      '完成一組後，把 prev 移到 first，繼續處理下一組。',
    ],
    example: example('head = [1,2,3,4]', '[2,1,4,3]', '每一對節點各自交換，節點值本身不改變。'),
    techniques: ['Linked List', 'Pointer Rewiring', 'Dummy Node'],
    baseline: {
      name: 'Recursive Pair Swap',
      idea: '先交換前兩個節點，再遞迴處理剩下的 linked list。',
      time: 'O(n)',
      space: 'O(n)',
    },
    optimized: {
      name: 'Iterative Dummy Node',
      idea: '用 dummy node 逐組交換，避免遞迴 stack 並能清楚控制連結順序。',
      time: 'O(n)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def swapPairs(self, head: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        prev = dummy

        while prev.next and prev.next.next:
            first = prev.next
            second = first.next

            first.next = second.next
            second.next = first
            prev.next = second

            prev = first

        return dummy.next`,
    typescript: String.raw`function swapPairs(head: ListNode | null): ListNode | null {
  const dummy = new ListNode(0, head)
  let prev: ListNode = dummy

  while (prev.next && prev.next.next) {
    const first = prev.next
    const second = first.next!

    first.next = second.next
    second.next = first
    prev.next = second

    prev = first
  }

  return dummy.next
}`,
  }),
  buildProblem({
    id: 61,
    title: 'Rotate List',
    difficulty: 'Medium',
    statement: '給定 linked list head 與整數 k，請把 linked list 向右旋轉 k 次。',
    focus: '這題考的是把 list 先看成環，再決定新的切點。若你一直從頭模擬每次旋轉，代表還沒有抓到結構上的等價轉換。',
    dataStructureChoice: 'Linked List 只要多走一次就能拿到長度與尾端節點。把尾巴接回 head 形成環後，再在正確位置斷開即可。',
    strategy: [
      '先走訪整條 list，取得長度 n 與 tail。',
      '把 k 對 n 取模，等價於只旋轉 k % n 次。',
      '把 tail 連回 head 形成環，再走到新的尾節點並斷開。',
    ],
    example: example('head = [1,2,3,4,5], k = 2', '[4,5,1,2,3]', '右旋 2 次等價於把最後兩個節點搬到最前面。'),
    techniques: ['Linked List', 'Cycle Trick', 'Length Counting'],
    baseline: {
      name: 'Rotate One Step Repeatedly',
      idea: '每次都把尾節點搬到最前面，重複做 k 次。',
      time: 'O(nk)',
      space: 'O(1)',
    },
    optimized: {
      name: 'Make a Cycle Then Cut',
      idea: '先把 list 變成環，再找到新的尾節點一次斷開。',
      time: 'O(n)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def rotateRight(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        if not head or not head.next or k == 0:
            return head

        length = 1
        tail = head
        while tail.next:
            tail = tail.next
            length += 1

        k %= length
        if k == 0:
            return head

        tail.next = head
        steps = length - k - 1
        new_tail = head
        for _ in range(steps):
            new_tail = new_tail.next

        new_head = new_tail.next
        new_tail.next = None
        return new_head`,
    typescript: String.raw`function rotateRight(head: ListNode | null, k: number): ListNode | null {
  if (!head || !head.next || k === 0) return head

  let length = 1
  let tail = head
  while (tail.next) {
    tail = tail.next
    length++
  }

  k %= length
  if (k === 0) return head

  tail.next = head
  let steps = length - k - 1
  let newTail = head
  while (steps-- > 0) {
    newTail = newTail.next!
  }

  const newHead = newTail.next
  newTail.next = null
  return newHead
}`,
  }),
  buildProblem({
    id: 83,
    title: 'Remove Duplicates from Sorted List',
    difficulty: 'Easy',
    statement: '給定已排序的 linked list，請刪除所有重複節點，只保留每個值的第一個節點。',
    focus: '因為 linked list 已經排序，所以重複元素一定相鄰。這題重點是把排序性質轉成單向掃描，而不是額外用 Hash 去記錄看過的值。',
    dataStructureChoice: '只需要一個 current 指標沿著 list 走即可。當 current.val 與 current.next.val 相同時，直接跳過 next。',
    strategy: [
      '從 head 開始掃描，當前節點是 current。',
      '若 current 與 next 值相同，代表 next 是重複節點，直接把 current.next 指到 next.next。',
      '若不同，current 才往前移動。',
    ],
    example: example('head = [1,1,2,3,3]', '[1,2,3]', '排序保證相同值相鄰，因此只要把重複節點跳過即可。'),
    techniques: ['Sorted Linked List', 'Single Pass', 'Pointer Update'],
    baseline: {
      name: 'Copy Unique Values',
      idea: '先走訪 list 收集不重複值，再重建一條新的 linked list。',
      time: 'O(n)',
      space: 'O(n)',
    },
    optimized: {
      name: 'In-place Single Pass',
      idea: '直接在原 linked list 上跳過重複節點，不需要建立新串列。',
      time: 'O(n)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def deleteDuplicates(self, head: Optional[ListNode]) -> Optional[ListNode]:
        current = head

        while current and current.next:
            if current.val == current.next.val:
                current.next = current.next.next
            else:
                current = current.next

        return head`,
    typescript: String.raw`function deleteDuplicates(head: ListNode | null): ListNode | null {
  let current = head

  while (current && current.next) {
    if (current.val === current.next.val) {
      current.next = current.next.next
    } else {
      current = current.next
    }
  }

  return head
}`,
  }),
  buildProblem({
    id: 92,
    title: 'Reverse Linked List II',
    difficulty: 'Medium',
    statement: '給定 linked list head 與 left、right，請只反轉第 left 到第 right 個節點。',
    focus: '這題在考局部反轉。你要清楚分辨「反轉區間前一個節點」、「反轉區間第一個節點」與插入節點的順序。',
    dataStructureChoice: 'Dummy node 很重要，因為 left 可能等於 1。反轉時使用 head insertion 技巧，可以在 O(1) 額外空間內完成。',
    strategy: [
      '先讓 prev 走到 left 前一個節點，curr 指向反轉區間的第一個節點。',
      '每一輪把 curr.next 抽出來，插到 prev 後面。',
      '重複 right - left 次後，區間就會被原地反轉。',
    ],
    example: example('head = [1,2,3,4,5], left = 2, right = 4', '[1,4,3,2,5]', '只反轉位置 2 到 4 的節點，其餘位置保持不變。'),
    techniques: ['Linked List', 'Head Insertion', 'Local Reversal'],
    baseline: {
      name: 'Store Then Rewrite',
      idea: '先把區間節點值存到陣列後反向寫回，雖然可行但不符合只動節點結構的精神。',
      time: 'O(n)',
      space: 'O(right-left)',
    },
    optimized: {
      name: 'In-place Head Insertion',
      idea: '固定 prev 與 curr，把後續節點一個一個插到前面，完成局部反轉。',
      time: 'O(n)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def reverseBetween(self, head: Optional[ListNode], left: int, right: int) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        prev = dummy

        for _ in range(left - 1):
            prev = prev.next

        curr = prev.next
        for _ in range(right - left):
            nxt = curr.next
            curr.next = nxt.next
            nxt.next = prev.next
            prev.next = nxt

        return dummy.next`,
    typescript: String.raw`function reverseBetween(head: ListNode | null, left: number, right: number): ListNode | null {
  const dummy = new ListNode(0, head)
  let prev: ListNode = dummy

  for (let i = 0; i < left - 1; i++) {
    prev = prev.next!
  }

  let curr = prev.next!
  for (let i = 0; i < right - left; i++) {
    const next = curr.next!
    curr.next = next.next
    next.next = prev.next
    prev.next = next
  }

  return dummy.next
}`,
  }),
  buildProblem({
    id: 150,
    title: 'Evaluate Reverse Polish Notation',
    difficulty: 'Medium',
    statement: '給定一個 Reverse Polish Notation（後序表達式）陣列 tokens，請計算它的值。',
    focus: '這題要你把運算子延後求值的順序翻成 stack 行為。遇到數字就入棧，遇到運算子就取出最近兩個操作數。',
    dataStructureChoice: 'Stack 是最自然的結構，因為每一個運算子都會消耗最後壓入的兩個運算元，完全符合 LIFO。',
    strategy: [
      '掃描每個 token，若是數字就轉成整數後 push。',
      '若是運算子就 pop 出右操作數與左操作數，計算後再 push 回去。',
      '最後 stack 裡剩下的唯一元素就是答案。',
    ],
    example: example('tokens = ["2","1","+","3","*"]', '9', '先算 2 + 1 = 3，再算 3 * 3 = 9。'),
    techniques: ['Stack', 'Expression Evaluation', 'Postfix'],
    baseline: {
      name: 'Recursive Expression Tree',
      idea: '把後序表達式先轉成樹或遞迴結構再計算，實作較重。',
      time: 'O(n)',
      space: 'O(n)',
    },
    optimized: {
      name: 'Stack Evaluation',
      idea: '直接用 stack 模擬 RPN 的求值流程，每個 token 只處理一次。',
      time: 'O(n)',
      space: 'O(n)',
    },
    python: String.raw`class Solution:
    def evalRPN(self, tokens: list[str]) -> int:
        stack = []

        for token in tokens:
            if token in '+-*/':
                b = stack.pop()
                a = stack.pop()
                if token == '+':
                    stack.append(a + b)
                elif token == '-':
                    stack.append(a - b)
                elif token == '*':
                    stack.append(a * b)
                else:
                    stack.append(int(a / b))
            else:
                stack.append(int(token))

        return stack[-1]`,
    typescript: String.raw`function evalRPN(tokens: string[]): number {
  const stack: number[] = []

  for (const token of tokens) {
    if ('+-*/'.includes(token)) {
      const b = stack.pop()!
      const a = stack.pop()!
      if (token === '+') stack.push(a + b)
      else if (token === '-') stack.push(a - b)
      else if (token === '*') stack.push(a * b)
      else stack.push(Math.trunc(a / b))
    } else {
      stack.push(Number(token))
    }
  }

  return stack[stack.length - 1]
}`,
  }),
  buildProblem({
    id: 225,
    title: 'Implement Stack using Queues',
    difficulty: 'Easy',
    statement: '只使用 queue 的基本操作，實作一個 stack，支援 push、pop、top、empty。',
    focus: '這題不是在考資料結構 API，而是看你能不能把 LIFO 行為用 FIFO 結構模擬出來。關鍵在於每次 push 後重排元素順序。',
    dataStructureChoice: '可以用兩個 queue 直接搬移，也可以用一個 queue 在 push 後做輪轉。單一 queue 版本更精簡。',
    strategy: [
      'push 新元素後，先把它放進 queue 尾端。',
      '把前面原本的元素依序 dequeue 再 enqueue 回尾端，讓新元素轉到最前面。',
      '之後 pop 與 top 直接看 queue front 即可模擬 stack top。',
    ],
    example: example('操作: ["MyStack","push","push","top","pop","empty"]', '[null,null,null,2,2,false]', '輪轉後 queue front 就對應到 stack top。'),
    techniques: ['Queue Simulation', 'Data Structure Design', 'Rotation'],
    baseline: {
      name: 'Two Queues',
      idea: 'push 時把舊 queue 元素全部搬到新 queue，再交換角色。',
      time: 'Push O(n), 其他 O(1)',
      space: 'O(n)',
    },
    optimized: {
      name: 'Single Queue Rotation',
      idea: '每次 push 後把先前元素輪轉到尾端，維持 front 永遠是 stack top。',
      time: 'Push O(n), Pop O(1)',
      space: 'O(n)',
    },
    python: String.raw`from collections import deque

class MyStack:
    def __init__(self):
        self.q = deque()

    def push(self, x: int) -> None:
        self.q.append(x)
        for _ in range(len(self.q) - 1):
            self.q.append(self.q.popleft())

    def pop(self) -> int:
        return self.q.popleft()

    def top(self) -> int:
        return self.q[0]

    def empty(self) -> bool:
        return not self.q`,
    typescript: String.raw`class MyStack {
  private q: number[] = []

  push(x: number): void {
    this.q.push(x)
    for (let i = 0; i < this.q.length - 1; i++) {
      this.q.push(this.q.shift()!)
    }
  }

  pop(): number {
    return this.q.shift()!
  }

  top(): number {
    return this.q[0]
  }

  empty(): boolean {
    return this.q.length === 0
  }
}`,
  }),
  buildProblem({
    id: 394,
    title: 'Decode String',
    difficulty: 'Medium',
    statement: '給定編碼字串 s，格式為 k[encoded_string]，請回傳解碼後的結果。',
    focus: '這題考的是巢狀結構的解析。當你看到 `數字 + []` 且可能多層嵌套時，通常要想到 stack 或 recursive descent。',
    dataStructureChoice: 'Stack 很適合處理巢狀括號，因為每遇到 `]` 都需要回到最近一層尚未完成的字串與倍數。',
    strategy: [
      '掃描字串時，數字要累積成完整倍數 multi。',
      '遇到 `[` 就把目前字串與倍數壓入 stack，並重置狀態。',
      '遇到 `]` 就把當前片段重複 multi 次，接回上一層字串。',
    ],
    example: example('s = "3[a2[c]]"', '"accaccacc"', '內層先解出 "acc"，再被外層重複 3 次。'),
    techniques: ['Stack', 'String Parsing', 'Nested Structure'],
    baseline: {
      name: 'Recursive Parser',
      idea: '使用遞迴在每個 `[` 進入子問題，碰到 `]` 時回傳結果。',
      time: 'O(n + output)',
      space: 'O(depth)',
    },
    optimized: {
      name: 'Iterative Stack Parser',
      idea: '用 stack 保存每一層的前綴字串與倍數，迭代完成整個解碼流程。',
      time: 'O(n + output)',
      space: 'O(n)',
    },
    python: String.raw`from collections import Counter

class Solution:
    def decodeString(self, s: str) -> str:
        stack = []
        current = []
        number = 0

        for ch in s:
            if ch.isdigit():
                number = number * 10 + int(ch)
            elif ch == '[':
                stack.append((''.join(current), number))
                current = []
                number = 0
            elif ch == ']':
                prev, repeat = stack.pop()
                current = [prev + ''.join(current) * repeat]
            else:
                current.append(ch)

        return ''.join(current)`,
    typescript: String.raw`function decodeString(s: string): string {
  const stack: Array<[string, number]> = []
  let current = ''
  let number = 0

  for (const ch of s) {
    if (/\d/.test(ch)) {
      number = number * 10 + Number(ch)
    } else if (ch === '[') {
      stack.push([current, number])
      current = ''
      number = 0
    } else if (ch === ']') {
      const [prev, repeat] = stack.pop()!
      current = prev + current.repeat(repeat)
    } else {
      current += ch
    }
  }

  return current
}`,
  }),
  buildProblem({
    id: 402,
    title: 'Remove K Digits',
    difficulty: 'Medium',
    statement: '給定非負整數字串 num 與整數 k，請移除 k 個數字，使剩下的數字最小。',
    focus: '這題典型在考 monotonic stack。只要前一位比後一位大，就應該優先刪掉前一位，因為高位數字越小越有利。',
    dataStructureChoice: 'Monotonic increasing stack 最適合，因為它能在掃描過程中維持字串前綴儘量小，並即時處理刪除決策。',
    strategy: [
      '從左到右掃描數字，若 stack 頂端比目前數字大且仍可刪除，就持續 pop。',
      '把目前數字壓入 stack，代表暫時保留在答案中。',
      '掃描結束後若 k 尚未用完，就從尾端再刪掉 k 個，再去掉前導零。',
    ],
    example: example('num = "1432219", k = 3', '"1219"', '刪掉 4、3、2 可以得到最小結果 1219。'),
    techniques: ['Monotonic Stack', 'Greedy', 'Digit Removal'],
    baseline: {
      name: 'Try Removing Each Position Repeatedly',
      idea: '每次都枚舉刪掉哪一位最划算，重複 k 次。',
      time: 'O(kn)',
      space: 'O(n)',
    },
    optimized: {
      name: 'Monotonic Increasing Stack',
      idea: '只要前一位比當前位大，就把前一位刪掉，優先讓高位數字變小。',
      time: 'O(n)',
      space: 'O(n)',
    },
    python: String.raw`from collections import defaultdict

class Solution:
    def removeKdigits(self, num: str, k: int) -> str:
        stack = []

        for ch in num:
            while k and stack and stack[-1] > ch:
                stack.pop()
                k -= 1
            stack.append(ch)

        while k:
            stack.pop()
            k -= 1

        result = ''.join(stack).lstrip('0')
        return result or '0'`,
    typescript: String.raw`function removeKdigits(num: string, k: number): string {
  const stack: string[] = []

  for (const ch of num) {
    while (k > 0 && stack.length && stack[stack.length - 1] > ch) {
      stack.pop()
      k--
    }
    stack.push(ch)
  }

  while (k-- > 0) {
    stack.pop()
  }

  const result = stack.join('').replace(/^0+/, '')
  return result === '' ? '0' : result
}`,
  }),
  buildProblem({
    id: 503,
    title: 'Next Greater Element II',
    difficulty: 'Medium',
    statement: '給定一個循環陣列 nums，請回傳每個元素下一個比它大的元素；若不存在則填 -1。',
    focus: '這題是 monotonic stack 加上 circular array。關鍵是理解「繞一圈」可以透過掃兩倍長度的索引來模擬，而不是真的複製陣列。',
    dataStructureChoice: 'Monotonic decreasing stack 用來保存尚未找到 next greater 的索引。因為一旦新數字比棧頂大，就能替那個位置結案。',
    strategy: [
      '答案陣列先全部設成 -1，stack 裡放索引而不是值。',
      '用 i 從 0 掃到 2n - 1，實際數值用 nums[i % n] 取得。',
      '當前數字若比 stack 對應值大，就替那些索引填上答案並 pop。',
    ],
    example: example('nums = [1,2,1]', '[2,-1,2]', '最後一個 1 要繞回前面，下一個更大值是 2。'),
    techniques: ['Monotonic Stack', 'Circular Array', 'Index Stack'],
    baseline: {
      name: 'For Each Index Scan Forward',
      idea: '對每個位置往後掃一整圈，找到第一個更大的元素。',
      time: 'O(n^2)',
      space: 'O(1)',
    },
    optimized: {
      name: 'Double Pass Monotonic Stack',
      idea: '掃兩輪索引來模擬 circular array，利用單調棧一次解掉所有 next greater 查詢。',
      time: 'O(n)',
      space: 'O(n)',
    },
    python: String.raw`class Solution:
    def nextGreaterElements(self, nums: list[int]) -> list[int]:
        n = len(nums)
        ans = [-1] * n
        stack = []

        for i in range(2 * n):
            num = nums[i % n]
            while stack and nums[stack[-1]] < num:
                ans[stack.pop()] = num
            if i < n:
                stack.append(i)

        return ans`,
    typescript: String.raw`function nextGreaterElements(nums: number[]): number[] {
  const n = nums.length
  const ans = new Array(n).fill(-1)
  const stack: number[] = []

  for (let i = 0; i < 2 * n; i++) {
    const num = nums[i % n]
    while (stack.length && nums[stack[stack.length - 1]] < num) {
      ans[stack.pop()!] = num
    }
    if (i < n) {
      stack.push(i)
    }
  }

  return ans
}`,
  }),
  buildProblem({
    id: 946,
    title: 'Validate Stack Sequences',
    difficulty: 'Medium',
    statement: '給定 pushed 與 popped 兩個序列，判斷是否可能來自同一個 stack 的 push / pop 操作。',
    focus: '這題重點是模擬，而不是猜規則。只要忠實地依 pushed 壓棧，並在棧頂等於 popped[j] 時盡可能 pop，就能驗證合法性。',
    dataStructureChoice: '直接用 stack 模擬最自然，因為題目本身就是在問 stack 是否可能產生某個 pop 序列。',
    strategy: [
      '依 pushed 順序逐一 push 進 stack。',
      '每 push 一個元素後，就檢查棧頂是否等於當前想 pop 的 popped[j]；若是就持續 pop。',
      '最後若 stack 清空，代表這組序列合法。',
    ],
    example: example('pushed = [1,2,3,4,5], popped = [4,5,3,2,1]', 'true', '可以先壓 1,2,3,4，再彈出 4,5,3,2,1。'),
    techniques: ['Stack Simulation', 'Greedy Pop', 'Sequence Validation'],
    baseline: {
      name: 'Search All Operation Paths',
      idea: '回溯列舉所有可能的 push / pop 操作，再比對 popped。',
      time: 'Exponential',
      space: 'O(n)',
    },
    optimized: {
      name: 'Direct Stack Simulation',
      idea: '只要當棧頂等於下一個待彈元素就立刻 pop，這就是唯一必要的模擬方式。',
      time: 'O(n)',
      space: 'O(n)',
    },
    python: String.raw`class Solution:
    def validateStackSequences(self, pushed: list[int], popped: list[int]) -> bool:
        stack = []
        j = 0

        for num in pushed:
            stack.append(num)
            while stack and j < len(popped) and stack[-1] == popped[j]:
                stack.pop()
                j += 1

        return not stack`,
    typescript: String.raw`function validateStackSequences(pushed: number[], popped: number[]): boolean {
  const stack: number[] = []
  let j = 0

  for (const num of pushed) {
    stack.push(num)
    while (stack.length && j < popped.length && stack[stack.length - 1] === popped[j]) {
      stack.pop()
      j++
    }
  }

  return stack.length === 0
}`,
  }),
  buildProblem({
    id: 36,
    title: 'Valid Sudoku',
    difficulty: 'Medium',
    statement: '給定一個 9x9 Sudoku board，判斷目前已填入的數字是否有效，不需要檢查是否可解。',
    focus: '這題考的是你能不能把限制拆成 row、column、box 三個獨立約束，並在掃描過程中同步驗證。',
    dataStructureChoice: '最直接的做法是使用三組 Hash Set，分別記錄每列、每欄與每個 3x3 box 已經出現過的數字。',
    strategy: [
      '逐格掃描 board，遇到 `.` 就略過。',
      '對每個數字同時檢查 row、col、box 是否已出現過。',
      '若任一集合已存在相同數字就回傳 false，否則加入對應集合。',
    ],
    example: example('board = [["5","3",".",...],["6",".",".",...],...]', 'true', '目前盤面沒有任何列、行或 3x3 區塊出現重複數字。'),
    techniques: ['Hash Set', 'Constraint Checking', 'Matrix Scan'],
    baseline: {
      name: 'Recheck Row/Col/Box Each Time',
      idea: '每填一格都重新掃描整列、整欄與整個 box 判斷是否合法。',
      time: 'O(9^3)',
      space: 'O(1)',
    },
    optimized: {
      name: 'Three Hash Set Families',
      idea: '掃描每個格子時同步更新 row、col、box 三組集合，一次完成驗證。',
      time: 'O(81)',
      space: 'O(81)',
    },
    python: String.raw`class Solution:
    def isValidSudoku(self, board: list[list[str]]) -> bool:
        rows = [set() for _ in range(9)]
        cols = [set() for _ in range(9)]
        boxes = [set() for _ in range(9)]

        for r in range(9):
            for c in range(9):
                val = board[r][c]
                if val == '.':
                    continue
                box = (r // 3) * 3 + (c // 3)
                if val in rows[r] or val in cols[c] or val in boxes[box]:
                    return False
                rows[r].add(val)
                cols[c].add(val)
                boxes[box].add(val)

        return True`,
    typescript: String.raw`function isValidSudoku(board: string[][]): boolean {
  const rows = Array.from({ length: 9 }, () => new Set<string>())
  const cols = Array.from({ length: 9 }, () => new Set<string>())
  const boxes = Array.from({ length: 9 }, () => new Set<string>())

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = board[r][c]
      if (val === '.') continue

      const box = Math.floor(r / 3) * 3 + Math.floor(c / 3)
      if (rows[r].has(val) || cols[c].has(val) || boxes[box].has(val)) {
        return false
      }

      rows[r].add(val)
      cols[c].add(val)
      boxes[box].add(val)
    }
  }

  return true
}`,
  }),
  buildProblem({
    id: 205,
    title: 'Isomorphic Strings',
    difficulty: 'Easy',
    statement: '給定字串 s 與 t，判斷 s 是否能透過字元一對一映射轉成 t。',
    focus: '這題重點是雙向一致性。只驗證 s -> t 不夠，還要確保沒有兩個不同字元映到同一個目標字元。',
    dataStructureChoice: '兩個 Hash Map 或一個 map 搭配一個 used set 都可以。雙向 map 最直觀，能明確表達雙射關係。',
    strategy: [
      '同步掃描 s 與 t 的每一個位置。',
      '若當前字元已出現，就檢查既有映射是否一致。',
      '若還沒出現，則同時建立 s -> t 與 t -> s 的映射。',
    ],
    example: example('s = "egg", t = "add"', 'true', 'e -> a、g -> d 可以形成一致的一對一映射。'),
    techniques: ['Hash Map', 'Bijective Mapping', 'String Scan'],
    baseline: {
      name: 'Rebuild Pattern Strings',
      idea: '對每個字串建立首次出現位置模式，再比較兩個模式是否相同。',
      time: 'O(n)',
      space: 'O(n)',
    },
    optimized: {
      name: 'Two-Way Hash Mapping',
      idea: '同步維護雙向映射，任何一方衝突都立刻判定失敗。',
      time: 'O(n)',
      space: 'O(k)',
    },
    python: String.raw`class Solution:
    def isIsomorphic(self, s: str, t: str) -> bool:
        s_to_t = {}
        t_to_s = {}

        for a, b in zip(s, t):
            if a in s_to_t and s_to_t[a] != b:
                return False
            if b in t_to_s and t_to_s[b] != a:
                return False
            s_to_t[a] = b
            t_to_s[b] = a

        return True`,
    typescript: String.raw`function isIsomorphic(s: string, t: string): boolean {
  const sToT = new Map<string, string>()
  const tToS = new Map<string, string>()

  for (let i = 0; i < s.length; i++) {
    const a = s[i]
    const b = t[i]
    if (sToT.has(a) && sToT.get(a) !== b) return false
    if (tToS.has(b) && tToS.get(b) !== a) return false
    sToT.set(a, b)
    tToS.set(b, a)
  }

  return true
}`,
  }),
  buildProblem({
    id: 217,
    title: 'Contains Duplicate',
    difficulty: 'Easy',
    statement: '給定整數陣列 nums，若任一值出現至少兩次回傳 true，否則回傳 false。',
    focus: '這題很單純，但它是在確認你看到「是否看過」這種需求時，能不能立刻想到 Set。',
    dataStructureChoice: 'Hash Set 最適合，因為只需要查詢與插入是否出現過，平均都能在 O(1) 完成。',
    strategy: [
      '建立一個空 set 存已看過的數字。',
      '掃描每個 num，若已存在 set 中就直接回傳 true。',
      '若整趟都沒有重複，最後回傳 false。',
    ],
    example: example('nums = [1,2,3,1]', 'true', '數字 1 出現了兩次。'),
    techniques: ['Hash Set', 'Seen Tracking', 'Single Pass'],
    baseline: {
      name: 'Sort Then Compare Neighbors',
      idea: '先排序，再檢查相鄰元素是否有重複。',
      time: 'O(n log n)',
      space: 'O(1) or O(n)',
    },
    optimized: {
      name: 'Hash Set Scan',
      idea: '掃描時把元素放進 set，只要再次看到相同值就立即結束。',
      time: 'O(n)',
      space: 'O(n)',
    },
    python: String.raw`class Solution:
    def containsDuplicate(self, nums: list[int]) -> bool:
        seen = set()

        for num in nums:
            if num in seen:
                return True
            seen.add(num)

        return False`,
    typescript: String.raw`function containsDuplicate(nums: number[]): boolean {
  const seen = new Set<number>()

  for (const num of nums) {
    if (seen.has(num)) return true
    seen.add(num)
  }

  return false
}`,
  }),
  buildProblem({
    id: 219,
    title: 'Contains Duplicate II',
    difficulty: 'Easy',
    statement: '給定整數陣列 nums 與整數 k，若存在兩個相同元素且索引差絕對值 <= k，回傳 true。',
    focus: '這題在考「最近一次出現位置」或固定大小窗口的維護。關鍵是題目不是問有沒有重複，而是重複是否夠近。',
    dataStructureChoice: '用 Hash Map 記錄每個數字最後一次出現的索引最直接，因為只需要比較最近的相同值即可。',
    strategy: [
      '掃描 nums 時，檢查目前 num 是否曾出現過。',
      '若出現過，就比較目前索引與最後出現索引的差是否 <= k。',
      '無論是否成功，都更新 num 的最後出現位置。',
    ],
    example: example('nums = [1,2,3,1], k = 3', 'true', '相同的 1 出現在索引 0 與 3，差為 3。'),
    techniques: ['Hash Map', 'Last Seen Index', 'Sliding Constraint'],
    baseline: {
      name: 'Check All Nearby Pairs',
      idea: '對每個位置往後最多檢查 k 個元素是否有相同值。',
      time: 'O(nk)',
      space: 'O(1)',
    },
    optimized: {
      name: 'Track Last Seen Index',
      idea: '只記錄每個值最近一次出現的位置，就能立刻判斷是否在距離 k 內重複。',
      time: 'O(n)',
      space: 'O(n)',
    },
    python: String.raw`class Solution:
    def containsNearbyDuplicate(self, nums: list[int], k: int) -> bool:
        last_seen = {}

        for i, num in enumerate(nums):
            if num in last_seen and i - last_seen[num] <= k:
                return True
            last_seen[num] = i

        return False`,
    typescript: String.raw`function containsNearbyDuplicate(nums: number[], k: number): boolean {
  const lastSeen = new Map<number, number>()

  for (let i = 0; i < nums.length; i++) {
    if (lastSeen.has(nums[i]) && i - lastSeen.get(nums[i])! <= k) {
      return true
    }
    lastSeen.set(nums[i], i)
  }

  return false
}`,
  }),
  buildProblem({
    id: 242,
    title: 'Valid Anagram',
    difficulty: 'Easy',
    statement: '給定兩個字串 s 與 t，判斷 t 是否為 s 的 anagram。',
    focus: '題目本質是比較兩個字串的字元 multiset 是否相同。若你能把字串問題轉成頻率分布，就會很快。',
    dataStructureChoice: 'Hash Map 或固定長度計數陣列都可以。若字元集固定為小寫英文字母，計數陣列是最省常數的做法。',
    strategy: [
      '先檢查兩字串長度是否相同，不同就直接 false。',
      '統計 s 每個字元的出現次數，再用 t 抵消。',
      '最後所有計數都歸零代表是 anagram。',
    ],
    example: example('s = "anagram", t = "nagaram"', 'true', '兩字串的每個字元出現次數完全相同。'),
    techniques: ['Counting Array', 'Hash Map', 'Frequency Balance'],
    baseline: {
      name: 'Sort Both Strings',
      idea: '把兩個字串排序後直接比較是否完全相同。',
      time: 'O(n log n)',
      space: 'O(n)',
    },
    optimized: {
      name: 'Frequency Counting',
      idea: '利用字元頻率做增減統計，避免排序成本。',
      time: 'O(n)',
      space: 'O(1) to O(k)',
    },
    python: String.raw`class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        if len(s) != len(t):
            return False

        counts = [0] * 26
        for ch in s:
            counts[ord(ch) - ord('a')] += 1
        for ch in t:
            idx = ord(ch) - ord('a')
            counts[idx] -= 1
            if counts[idx] < 0:
                return False

        return True`,
    typescript: String.raw`function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false

  const counts = new Array(26).fill(0)
  for (const ch of s) counts[ch.charCodeAt(0) - 97]++
  for (const ch of t) {
    const idx = ch.charCodeAt(0) - 97
    counts[idx]--
    if (counts[idx] < 0) return false
  }

  return true
}`,
  }),
  buildProblem({
    id: 380,
    title: 'Insert Delete GetRandom O(1)',
    difficulty: 'Medium',
    statement: '設計 RandomizedSet，支援 insert、remove、getRandom，且平均時間複雜度皆為 O(1)。',
    focus: '這題的關鍵不是 Hash Map 本身，而是「刪除陣列中任意元素如何維持 O(1)」。答案是把尾元素搬來補洞。',
    dataStructureChoice: '需要陣列來支援 O(1) 隨機取樣，也需要 Hash Map 紀錄每個值在陣列中的索引，兩者缺一不可。',
    strategy: [
      'insert 時若值不存在，就把它 append 到陣列尾端，並在 map 中記錄索引。',
      'remove 時把要刪的位置和尾元素交換，再更新尾元素索引後 pop。',
      'getRandom 時直接從陣列中等機率抽一個索引。',
    ],
    example: example('操作: ["RandomizedSet","insert","remove","insert","getRandom"]', '[null,true,false,true,2]', '刪除與隨機取樣都建立在 array + map 的同步維護上。'),
    techniques: ['Hash Map', 'Dynamic Array', 'Swap With Tail'],
    baseline: {
      name: 'Plain Array',
      idea: '用陣列存值，insert 與 getRandom 簡單，但 remove 任意值需要線性搜尋。',
      time: 'Remove O(n)',
      space: 'O(n)',
    },
    optimized: {
      name: 'Array + Index Map',
      idea: '用 map 記住值的位置，刪除時把尾元素搬來填洞，維持所有操作平均 O(1)。',
      time: 'O(1) average',
      space: 'O(n)',
    },
    python: String.raw`import random

class RandomizedSet:
    def __init__(self):
        self.values = []
        self.index = {}

    def insert(self, val: int) -> bool:
        if val in self.index:
            return False
        self.index[val] = len(self.values)
        self.values.append(val)
        return True

    def remove(self, val: int) -> bool:
        if val not in self.index:
            return False

        idx = self.index[val]
        last = self.values[-1]
        self.values[idx] = last
        self.index[last] = idx

        self.values.pop()
        del self.index[val]
        return True

    def getRandom(self) -> int:
        return random.choice(self.values)`,
    typescript: String.raw`class RandomizedSet {
  private values: number[] = []
  private index = new Map<number, number>()

  insert(val: number): boolean {
    if (this.index.has(val)) return false
    this.index.set(val, this.values.length)
    this.values.push(val)
    return true
  }

  remove(val: number): boolean {
    if (!this.index.has(val)) return false

    const idx = this.index.get(val)!
    const last = this.values[this.values.length - 1]
    this.values[idx] = last
    this.index.set(last, idx)

    this.values.pop()
    this.index.delete(val)
    return true
  }

  getRandom(): number {
    const idx = Math.floor(Math.random() * this.values.length)
    return this.values[idx]
  }
}`,
  }),
  buildProblem({
    id: 100,
    title: 'Same Tree',
    difficulty: 'Easy',
    statement: '給定兩棵二元樹 p 與 q，判斷它們是否完全相同。',
    focus: '這題在考遞迴比較的基本功。只要任一節點值不同，或某一邊缺節點，兩棵樹就不可能相同。',
    dataStructureChoice: '遞迴 DFS 最自然，因為每個節點都要同步比較左子樹與右子樹。',
    strategy: [
      '若兩個節點都為 null，代表這一對位置相同。',
      '若只有一邊為 null，或值不同，直接回傳 false。',
      '否則遞迴比較左右子樹。',
    ],
    example: example('p = [1,2,3], q = [1,2,3]', 'true', '每一個對應位置的節點值與結構都相同。'),
    techniques: ['Tree DFS', 'Recursive Comparison', 'Base Case'],
    baseline: {
      name: 'Serialize Then Compare',
      idea: '先把兩棵樹序列化成字串再比較。',
      time: 'O(n)',
      space: 'O(n)',
    },
    optimized: {
      name: 'Recursive Node Comparison',
      idea: '直接在節點層級同步比較兩棵樹，不需要額外序列化。',
      time: 'O(n)',
      space: 'O(h)',
    },
    python: String.raw`class Solution:
    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
        if not p and not q:
            return True
        if not p or not q or p.val != q.val:
            return False
        return self.isSameTree(p.left, q.left) and self.isSameTree(p.right, q.right)`,
    typescript: String.raw`function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
  if (!p && !q) return true
  if (!p || !q || p.val !== q.val) return false
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right)
}`,
  }),
  buildProblem({
    id: 101,
    title: 'Symmetric Tree',
    difficulty: 'Easy',
    statement: '給定一棵二元樹，判斷它是否為鏡像對稱。',
    focus: '這題不是單純比較左右子樹是否相同，而是比較左的左對右的右、左的右對右的左。鏡像關係要講清楚。',
    dataStructureChoice: '遞迴或 queue 都能做；遞迴最直接，因為鏡像關係本身就是一個雙節點遞迴函式。',
    strategy: [
      '定義 mirror(left, right) 判斷兩棵子樹是否互為鏡像。',
      '若兩者皆為 null，回傳 true；若只有一邊為 null 或值不同，回傳 false。',
      '繼續比較 left.left 對 right.right、left.right 對 right.left。',
    ],
    example: example('root = [1,2,2,3,4,4,3]', 'true', '左右子樹互為鏡像，因此整棵樹對稱。'),
    techniques: ['Tree DFS', 'Mirror Comparison', 'Recursion'],
    baseline: {
      name: 'Level Order Check',
      idea: '逐層取出節點值與 null 位置，檢查每層是否回文。',
      time: 'O(n)',
      space: 'O(n)',
    },
    optimized: {
      name: 'Mirror Recursion',
      idea: '直接定義鏡像遞迴，逐對比較對稱位置的節點。',
      time: 'O(n)',
      space: 'O(h)',
    },
    python: String.raw`class Solution:
    def isSymmetric(self, root: Optional[TreeNode]) -> bool:
        def mirror(a: Optional[TreeNode], b: Optional[TreeNode]) -> bool:
            if not a and not b:
                return True
            if not a or not b or a.val != b.val:
                return False
            return mirror(a.left, b.right) and mirror(a.right, b.left)

        return mirror(root.left, root.right) if root else True`,
    typescript: String.raw`function isSymmetric(root: TreeNode | null): boolean {
  const mirror = (a: TreeNode | null, b: TreeNode | null): boolean => {
    if (!a && !b) return true
    if (!a || !b || a.val !== b.val) return false
    return mirror(a.left, b.right) && mirror(a.right, b.left)
  }

  return root ? mirror(root.left, root.right) : true
}`,
  }),
  buildProblem({
    id: 112,
    title: 'Path Sum',
    difficulty: 'Easy',
    statement: '給定二元樹 root 與 targetSum，判斷是否存在一條從 root 到 leaf 的路徑，使得節點值總和等於 targetSum。',
    focus: '這題重點是分清楚「任何節點結束」和「一定要走到 leaf 才算」的差別。很多錯誤都來自 base case 判斷太早。',
    dataStructureChoice: 'DFS 很適合，因為每往下一層就把剩餘目標值扣掉，直到葉節點時再檢查是否剛好為 0。',
    strategy: [
      '遞迴時把 targetSum 減去目前節點值。',
      '若走到 leaf，就檢查剩餘值是否恰好等於當前節點值。',
      '否則往左或右子樹遞迴，只要任一邊成功就回傳 true。',
    ],
    example: example('root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22', 'true', '路徑 5 -> 4 -> 11 -> 2 的總和為 22。'),
    techniques: ['Tree DFS', 'Root-to-Leaf', 'Remaining Sum'],
    baseline: {
      name: 'Collect All Path Sums',
      idea: '先列舉所有 root-to-leaf 路徑總和，再檢查 target 是否存在。',
      time: 'O(n)',
      space: 'O(n)',
    },
    optimized: {
      name: 'DFS With Remaining Sum',
      idea: '遞迴時直接扣除剩餘目標值，不需要保存整條路徑。',
      time: 'O(n)',
      space: 'O(h)',
    },
    python: String.raw`class Solution:
    def hasPathSum(self, root: Optional[TreeNode], targetSum: int) -> bool:
        if not root:
            return False
        if not root.left and not root.right:
            return targetSum == root.val
        remain = targetSum - root.val
        return self.hasPathSum(root.left, remain) or self.hasPathSum(root.right, remain)`,
    typescript: String.raw`function hasPathSum(root: TreeNode | null, targetSum: number): boolean {
  if (!root) return false
  if (!root.left && !root.right) return targetSum === root.val
  const remain = targetSum - root.val
  return hasPathSum(root.left, remain) || hasPathSum(root.right, remain)
}`,
  }),
  buildProblem({
    id: 199,
    title: 'Binary Tree Right Side View',
    difficulty: 'Medium',
    statement: '回傳從二元樹右側看過去時，每一層能看到的節點值。',
    focus: '這題在考你是否把「每層最右邊」轉成 BFS 的最後一個節點，或 DFS 的優先走右子樹。',
    dataStructureChoice: 'Level-order BFS 很直觀，因為題目要的就是每一層的最後一個節點。',
    strategy: [
      '使用 queue 做 level-order traversal。',
      '每一層處理完時，把最後被取出的節點值加入答案。',
      '繼續把左右子節點加入 queue，直到樹走完。',
    ],
    example: example('root = [1,2,3,null,5,null,4]', '[1,3,4]', '每一層從右邊看到的節點依序是 1、3、4。'),
    techniques: ['BFS', 'Level Order', 'Tree View'],
    baseline: {
      name: 'DFS Collect Every Depth',
      idea: '遍歷整棵樹，對每個深度記錄最後看到的節點值。',
      time: 'O(n)',
      space: 'O(h)',
    },
    optimized: {
      name: 'Level Order Last Node',
      idea: '每層 BFS 的最後一個節點就是右視圖答案。',
      time: 'O(n)',
      space: 'O(w)',
    },
    python: String.raw`from collections import deque

class Solution:
    def rightSideView(self, root: Optional[TreeNode]) -> list[int]:
        if not root:
            return []

        result = []
        queue = deque([root])

        while queue:
            level_size = len(queue)
            for i in range(level_size):
                node = queue.popleft()
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
                if i == level_size - 1:
                    result.append(node.val)

        return result`,
    typescript: String.raw`function rightSideView(root: TreeNode | null): number[] {
  if (!root) return []

  const result: number[] = []
  const queue: TreeNode[] = [root]

  while (queue.length) {
    const levelSize = queue.length
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!
      if (node.left) queue.push(node.left)
      if (node.right) queue.push(node.right)
      if (i === levelSize - 1) result.push(node.val)
    }
  }

  return result
}`,
  }),
  buildProblem({
    id: 235,
    title: 'Lowest Common Ancestor of a Binary Search Tree',
    difficulty: 'Medium',
    statement: '在 BST 中找出節點 p 與 q 的最低共同祖先。',
    focus: 'BST 題最重要的是用排序性質剪枝。若 p 和 q 都比目前節點小，就不該再往右找。',
    dataStructureChoice: '因為 BST 保證左 < root < 右，所以只要根據 p、q 與 root 的大小關係決定往哪一側走，不必遍歷整棵樹。',
    strategy: [
      '令 small = min(p.val, q.val)，large = max(p.val, q.val)。',
      '若 root.val > large，代表兩節點都在左子樹；若 root.val < small，代表都在右子樹。',
      '否則 root 正好把兩者分開，或其中一個就是 root，答案即為 root。',
    ],
    example: example('root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8', '6', '2 在左、8 在右，因此最低共同祖先是 6。'),
    techniques: ['BST Property', 'Tree Search', 'Pruning'],
    baseline: {
      name: 'General Binary Tree Search',
      idea: '忽略 BST 性質，用一般二元樹 LCA 遞迴求解。',
      time: 'O(n)',
      space: 'O(h)',
    },
    optimized: {
      name: 'BST Guided Walk',
      idea: '利用 BST 排序性質一路往正確方向走，直到找到分岔點。',
      time: 'O(h)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        small, large = sorted((p.val, q.val))

        while root:
            if root.val > large:
                root = root.left
            elif root.val < small:
                root = root.right
            else:
                return root`,
    typescript: String.raw`function lowestCommonAncestor(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
  const small = Math.min(p.val, q.val)
  const large = Math.max(p.val, q.val)

  while (root) {
    if (root.val > large) root = root.left
    else if (root.val < small) root = root.right
    else return root
  }

  return null
}`,
  }),
  buildProblem({
    id: 236,
    title: 'Lowest Common Ancestor of a Binary Tree',
    difficulty: 'Medium',
    statement: '在一般二元樹中找出節點 p 與 q 的最低共同祖先。',
    focus: '和 BST 不同，這題不能靠大小剪枝。重點在於遞迴回傳「在這棵子樹裡有沒有找到 p 或 q」。',
    dataStructureChoice: 'DFS 遞迴最自然，因為每個節點都可以根據左右子樹回傳結果來判斷自己是否為 LCA。',
    strategy: [
      '若當前節點為 null、p 或 q，就直接回傳自己。',
      '遞迴詢問 left 與 right 是否找到目標節點。',
      '若左右都非空，表示 p、q 分別落在兩側，當前節點就是 LCA。',
    ],
    example: example('root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1', '3', '5 在左子樹、1 在右子樹，所以共同祖先是 3。'),
    techniques: ['Tree DFS', 'Postorder Thinking', 'Lowest Common Ancestor'],
    baseline: {
      name: 'Store Parent Pointers',
      idea: '先 DFS 建立每個節點的 parent，再從 p 往上走並用 set 記錄祖先。',
      time: 'O(n)',
      space: 'O(n)',
    },
    optimized: {
      name: 'Recursive Postorder',
      idea: '讓遞迴回傳子樹是否找到 p 或 q，當左右都命中時就鎖定 LCA。',
      time: 'O(n)',
      space: 'O(h)',
    },
    python: String.raw`class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        if not root or root == p or root == q:
            return root

        left = self.lowestCommonAncestor(root.left, p, q)
        right = self.lowestCommonAncestor(root.right, p, q)

        if left and right:
            return root
        return left or right`,
    typescript: String.raw`function lowestCommonAncestor(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
  if (!root || root === p || root === q) return root

  const left = lowestCommonAncestor(root.left, p, q)
  const right = lowestCommonAncestor(root.right, p, q)

  if (left && right) return root
  return left ?? right
}`,
  }),
  buildProblem({
    id: 14,
    title: 'Longest Common Prefix',
    difficulty: 'Easy',
    statement: '給定字串陣列 strs，找出它們最長的共同前綴。',
    focus: '這題重點是把「共同前綴」轉成逐字比較，只要某一個位置出現不一致，答案就到此為止。',
    dataStructureChoice: '直接用字串掃描即可；若要延伸到大量 prefix 查詢或多次插入，Trie 才會顯著更合適。',
    strategy: [
      '先把第一個字串視為候選前綴。',
      '對每個位置逐字檢查其他字串是否也有相同字元。',
      '一旦超界或字元不同，就回傳目前累積的前綴。',
    ],
    example: example('strs = ["flower","flow","flight"]', '"fl"', '三個字串共同的最長前綴是 "fl"。'),
    techniques: ['String Scan', 'Prefix Matching', 'Vertical Scan'],
    baseline: {
      name: 'Shrink Prefix Repeatedly',
      idea: '從第一個字串開始，逐步縮短前綴直到每個字串都以它開頭。',
      time: 'O(S)',
      space: 'O(1)',
    },
    optimized: {
      name: 'Vertical Character Scan',
      idea: '逐欄比較所有字串的同一個位置，第一個衝突點之前就是答案。',
      time: 'O(S)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def longestCommonPrefix(self, strs: list[str]) -> str:
        for i, ch in enumerate(strs[0]):
            for word in strs[1:]:
                if i == len(word) or word[i] != ch:
                    return strs[0][:i]
        return strs[0]`,
    typescript: String.raw`function longestCommonPrefix(strs: string[]): string {
  for (let i = 0; i < strs[0].length; i++) {
    const ch = strs[0][i]
    for (let j = 1; j < strs.length; j++) {
      if (i === strs[j].length || strs[j][i] !== ch) {
        return strs[0].slice(0, i)
      }
    }
  }

  return strs[0]
}`,
  }),
  buildProblem({
    id: 648,
    title: 'Replace Words',
    difficulty: 'Medium',
    statement: '給定字根字典 dictionary 與句子 sentence，請把句子中每個單字替換成能匹配到的最短字根。',
    focus: '這題考的是 prefix search。當你需要對每個單字快速找到最短前綴時，Trie 的提早停下特性很有價值。',
    dataStructureChoice: 'Trie 適合字根查找，因為每個字都能逐字往下走，一旦遇到 end-of-word 就能立刻得到最短可替換字根。',
    strategy: [
      '先把 dictionary 中所有字根插入 Trie。',
      '對 sentence 每個單字沿 Trie 逐字走訪。',
      '若途中遇到 end-of-word 就回傳該字根；若走不下去就保留原字。',
    ],
    example: example('dictionary = ["cat","bat","rat"], sentence = "the cattle was rattled by the battery"', '"the cat was rat by the bat"', '每個單字都會替換成能匹配到的最短字根。'),
    techniques: ['Trie', 'Prefix Search', 'String Replace'],
    baseline: {
      name: 'Check Every Root',
      idea: '對每個單字枚舉所有字根並測試是否為前綴。',
      time: 'O(words * roots * L)',
      space: 'O(1)',
    },
    optimized: {
      name: 'Trie Prefix Search',
      idea: '把所有字根放進 Trie，查詢每個單字時遇到第一個結尾就停止。',
      time: 'O(total chars)',
      space: 'O(total root chars)',
    },
    python: String.raw`class TrieNode:
    def __init__(self):
        self.children = {}
        self.word = None

class Solution:
    def replaceWords(self, dictionary: list[str], sentence: str) -> str:
        root = TrieNode()

        for word in dictionary:
            node = root
            for ch in word:
                node = node.children.setdefault(ch, TrieNode())
            node.word = word

        def find_root(word: str) -> str:
            node = root
            for ch in word:
                if ch not in node.children:
                    return word
                node = node.children[ch]
                if node.word:
                    return node.word
            return word

        return ' '.join(find_root(word) for word in sentence.split())`,
    typescript: String.raw`class TrieNode {
  children = new Map<string, TrieNode>()
  word: string | null = null
}

function replaceWords(dictionary: string[], sentence: string): string {
  const root = new TrieNode()

  for (const word of dictionary) {
    let node = root
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode())
      node = node.children.get(ch)!
    }
    node.word = word
  }

  const findRoot = (word: string): string => {
    let node = root
    for (const ch of word) {
      if (!node.children.has(ch)) return word
      node = node.children.get(ch)!
      if (node.word) return node.word
    }
    return word
  }

  return sentence.split(' ').map(findRoot).join(' ')
}`,
  }),
  buildProblem({
    id: 720,
    title: 'Longest Word in Dictionary',
    difficulty: 'Medium',
    statement: '給定字典 words，找出其中最長且能由其他單字逐字增加一個字母建構而成的單字；若長度相同取字典序較小者。',
    focus: '這題其實是在驗證每個前綴是否都存在。雖然放在 Trie 章節，但用排序加 Hash Set 也能很好地解。',
    dataStructureChoice: 'Hash Set 足夠，因為只要能快速判斷 `word[:-1]` 是否存在即可；排序可以確保較短單字先被處理。',
    strategy: [
      '先將 words 依長度、字典序排序，讓可當基礎的短字先出現。',
      '若單字長度為 1 或其去掉最後一個字元後的前綴已在 built 集合中，就可納入答案。',
      '掃描過程持續更新最長且字典序最小的合法單字。',
    ],
    example: example('words = ["w","wo","wor","worl","world"]', '"world"', '因為每個前綴都存在，所以 "world" 合法且最長。'),
    techniques: ['Sorting', 'Hash Set', 'Prefix Validation'],
    baseline: {
      name: 'Check Every Prefix Every Time',
      idea: '對每個單字重新檢查所有前綴是否存在於原始陣列。',
      time: 'O(n * L^2)',
      space: 'O(n)',
    },
    optimized: {
      name: 'Sort + Buildable Set',
      idea: '排序後用 set 記錄已可建構的字，只需檢查去掉最後一個字元的前綴。',
      time: 'O(n log n + nL)',
      space: 'O(n)',
    },
    python: String.raw`class Solution:
    def longestWord(self, words: list[str]) -> str:
        words.sort()
        words.sort(key=len)

        built = set()
        best = ''

        for word in words:
            if len(word) == 1 or word[:-1] in built:
                built.add(word)
                if len(word) > len(best) or (len(word) == len(best) and word < best):
                    best = word

        return best`,
    typescript: String.raw`function longestWord(words: string[]): string {
  words.sort()
  words.sort((a, b) => a.length - b.length)

  const built = new Set<string>()
  let best = ''

  for (const word of words) {
    if (word.length === 1 || built.has(word.slice(0, -1))) {
      built.add(word)
      if (word.length > best.length || (word.length === best.length && word < best)) {
        best = word
      }
    }
  }

  return best
}`,
  }),
  buildProblem({
    id: 1268,
    title: 'Search Suggestions System',
    difficulty: 'Medium',
    statement: '給定 products 與 searchWord，對 searchWord 每個前綴回傳字典序最小的最多三個建議字串。',
    focus: '這題考 prefix search，但不一定非 Trie 不可。若先排序 products，每個前綴都能用二分找到起點後順推最多三個。',
    dataStructureChoice: '排序陣列加 binary search 已足夠，因為只要快速定位 prefix 的第一個可能位置，再檢查接下來少量候選。',
    strategy: [
      '先把 products 字典序排序。',
      '從 searchWord 的第一個字元開始逐步擴充 prefix。',
      '每次用 lower bound 找到 prefix 的起始位置，再往後收集最多三個同樣以前綴開頭的單字。',
    ],
    example: example('products = ["mobile","mouse","moneypot","monitor","mousepad"], searchWord = "mouse"', '[["mobile","moneypot","monitor"],["mobile","moneypot","monitor"],["mouse","mousepad"],["mouse","mousepad"],["mouse","mousepad"]]', '每增加一個前綴字元，就重新產生最多三個建議。'),
    techniques: ['Sorting', 'Binary Search', 'Prefix Suggestions'],
    baseline: {
      name: 'Filter All Products Per Prefix',
      idea: '對每個 prefix 都重新掃描所有 products，挑出前三個符合者。',
      time: 'O(mnL)',
      space: 'O(1)',
    },
    optimized: {
      name: 'Sorted Array + Lower Bound',
      idea: '先排序，再對每個 prefix 找 lower bound，只檢查後面少數候選。',
      time: 'O(n log n + m log n)',
      space: 'O(n)',
    },
    python: String.raw`from bisect import bisect_left

class Solution:
    def suggestedProducts(self, products: list[str], searchWord: str) -> list[list[str]]:
        products.sort()
        result = []
        prefix = ''

        for ch in searchWord:
            prefix += ch
            start = bisect_left(products, prefix)
            suggestions = []
            for i in range(start, min(start + 3, len(products))):
                if products[i].startswith(prefix):
                    suggestions.append(products[i])
            result.append(suggestions)

        return result`,
    typescript: String.raw`function suggestedProducts(products: string[], searchWord: string): string[][] {
  products.sort()

  const lowerBound = (target: string): number => {
    let left = 0
    let right = products.length
    while (left < right) {
      const mid = Math.floor((left + right) / 2)
      if (products[mid] < target) left = mid + 1
      else right = mid
    }
    return left
  }

  const result: string[][] = []
  let prefix = ''

  for (const ch of searchWord) {
    prefix += ch
    const start = lowerBound(prefix)
    const suggestions: string[] = []
    for (let i = start; i < Math.min(start + 3, products.length); i++) {
      if (products[i].startsWith(prefix)) suggestions.push(products[i])
    }
    result.push(suggestions)
  }

  return result
}`,
  }),
  buildProblem({
    id: 1804,
    title: 'Implement Trie II (Prefix Tree)',
    difficulty: 'Medium',
    statement: '實作 Trie，支援 insert、countWordsEqualTo、countWordsStartingWith、erase。',
    focus: '這題比基本 Trie 多了「計數」與「刪除」，重點是每個節點都要知道有多少單字經過、多少單字在此結束。',
    dataStructureChoice: 'Trie 是唯一自然的結構，因為 prefix 計數和整字計數都可以沿著字元路徑逐層累積。',
    strategy: [
      '每個 Trie 節點維護 prefixCount 與 wordCount。',
      'insert 時沿路把 prefixCount 加一，結尾節點 wordCount 加一。',
      'erase 時再沿路扣回去，查詢時分別回傳結尾與前綴計數。',
    ],
    example: example('操作: insert("apple"), insert("apple"), countWordsEqualTo("apple"), erase("apple")', '2 -> 1', '同一單字可重複插入，因此需要用計數而不是單純布林值。'),
    techniques: ['Trie', 'Prefix Count', 'Data Structure Design'],
    baseline: {
      name: 'Hash Map of Full Words',
      idea: '只記整字出現次數，prefix 查詢時每次遍歷所有鍵比對。',
      time: 'Prefix query O(nL)',
      space: 'O(nL)',
    },
    optimized: {
      name: 'Counted Trie',
      idea: '在 Trie 節點維護經過與結尾次數，讓整字與前綴查詢都維持 O(L)。',
      time: 'O(L)',
      space: 'O(total chars)',
    },
    python: String.raw`class TrieNode:
    def __init__(self):
        self.children = {}
        self.prefix_count = 0
        self.word_count = 0

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        node = self.root
        for ch in word:
            node = node.children.setdefault(ch, TrieNode())
            node.prefix_count += 1
        node.word_count += 1

    def countWordsEqualTo(self, word: str) -> int:
        node = self.root
        for ch in word:
            if ch not in node.children:
                return 0
            node = node.children[ch]
        return node.word_count

    def countWordsStartingWith(self, prefix: str) -> int:
        node = self.root
        for ch in prefix:
            if ch not in node.children:
                return 0
            node = node.children[ch]
        return node.prefix_count

    def erase(self, word: str) -> None:
        node = self.root
        path = []
        for ch in word:
            node = node.children[ch]
            path.append(node)
        for item in path:
            item.prefix_count -= 1
        path[-1].word_count -= 1`,
    typescript: String.raw`class TrieNode {
  children = new Map<string, TrieNode>()
  prefixCount = 0
  wordCount = 0
}

class Trie {
  private root = new TrieNode()

  insert(word: string): void {
    let node = this.root
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode())
      node = node.children.get(ch)!
      node.prefixCount++
    }
    node.wordCount++
  }

  countWordsEqualTo(word: string): number {
    let node = this.root
    for (const ch of word) {
      if (!node.children.has(ch)) return 0
      node = node.children.get(ch)!
    }
    return node.wordCount
  }

  countWordsStartingWith(prefix: string): number {
    let node = this.root
    for (const ch of prefix) {
      if (!node.children.has(ch)) return 0
      node = node.children.get(ch)!
    }
    return node.prefixCount
  }

  erase(word: string): void {
    let node = this.root
    const path: TrieNode[] = []
    for (const ch of word) {
      node = node.children.get(ch)!
      path.push(node)
    }
    for (const item of path) item.prefixCount--
    path[path.length - 1].wordCount--
  }
}`,
  }),
  buildProblem({
    id: 695,
    title: 'Max Area of Island',
    difficulty: 'Medium',
    statement: '給定 0/1 grid，請回傳最大島嶼面積；島嶼由上下左右相連的 1 組成。',
    focus: '這題是標準 grid DFS/BFS。真正要練的是把 matrix 轉成圖，再用 flood fill 把同一塊連通區一次走完。',
    dataStructureChoice: 'DFS 或 BFS 都可以。若直接在原 grid 上把訪問過的陸地改成 0，可以省去額外 visited 陣列。',
    strategy: [
      '遍歷整個 grid，遇到 1 就啟動一次 DFS/BFS。',
      '在搜尋過程中把連到的所有 1 標記為已訪問，並累加面積。',
      '每塊島嶼搜尋結束後更新最大值。',
    ],
    example: example('grid = [[0,0,1,0],[1,1,1,0],[0,1,0,0]]', '5', '中間那塊相連的陸地共有 5 格。'),
    techniques: ['Grid DFS', 'Flood Fill', 'Connected Component'],
    baseline: {
      name: 'Recount Component Repeatedly',
      idea: '每個陸地格子都重新展開搜尋且不標記 visited，會重複計算同一塊島。',
      time: 'O((mn)^2)',
      space: 'O(mn)',
    },
    optimized: {
      name: 'DFS Flood Fill',
      idea: '每塊島嶼只搜尋一次，搜尋過就原地標記避免重複。',
      time: 'O(mn)',
      space: 'O(mn)',
    },
    python: String.raw`class Solution:
    def maxAreaOfIsland(self, grid: list[list[int]]) -> int:
        rows, cols = len(grid), len(grid[0])

        def dfs(r: int, c: int) -> int:
            if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == 0:
                return 0
            grid[r][c] = 0
            return 1 + dfs(r + 1, c) + dfs(r - 1, c) + dfs(r, c + 1) + dfs(r, c - 1)

        best = 0
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == 1:
                    best = max(best, dfs(r, c))
        return best`,
    typescript: String.raw`function maxAreaOfIsland(grid: number[][]): number {
  const rows = grid.length
  const cols = grid[0].length

  const dfs = (r: number, c: number): number => {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === 0) return 0
    grid[r][c] = 0
    return 1 + dfs(r + 1, c) + dfs(r - 1, c) + dfs(r, c + 1) + dfs(r, c - 1)
  }

  let best = 0
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) best = Math.max(best, dfs(r, c))
    }
  }

  return best
}`,
  }),
  buildProblem({
    id: 733,
    title: 'Flood Fill',
    difficulty: 'Easy',
    statement: '給定 image、起點 sr/sc 與新顏色 color，請把與起點連通且顏色相同的區域全部染成新顏色。',
    focus: '這題是最純粹的 flood fill。關鍵不是遍歷本身，而是先處理「新顏色和舊顏色相同」的陷阱，避免無限遞迴。',
    dataStructureChoice: 'DFS/BFS 都行；因為是連通區塊染色，直接在原 image 上修改即可，不需額外 visited。',
    strategy: [
      '先記住起點原本的顏色 original，若 original == color 直接回傳原圖。',
      '從起點開始 DFS/BFS，只要顏色仍是 original 就染成 color。',
      '往四個方向展開，直到整塊連通區塊都被更新。',
    ],
    example: example('image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2', '[[2,2,2],[2,2,0],[2,0,1]]', '只有和起點連通且原色相同的區域會被染色。'),
    techniques: ['Flood Fill', 'DFS/BFS', 'Connected Region'],
    baseline: {
      name: 'Recursive Fill Without Guard',
      idea: '直接 DFS 染色但沒有先處理 original == color，容易重複走訪。',
      time: 'O(mn)',
      space: 'O(mn)',
    },
    optimized: {
      name: 'Guarded DFS Fill',
      idea: '先檢查原色與新色，再對相同原色的連通區做一次 DFS。',
      time: 'O(mn)',
      space: 'O(mn)',
    },
    python: String.raw`class Solution:
    def floodFill(self, image: list[list[int]], sr: int, sc: int, color: int) -> list[list[int]]:
        rows, cols = len(image), len(image[0])
        original = image[sr][sc]
        if original == color:
            return image

        def dfs(r: int, c: int) -> None:
            if r < 0 or r >= rows or c < 0 or c >= cols or image[r][c] != original:
                return
            image[r][c] = color
            dfs(r + 1, c)
            dfs(r - 1, c)
            dfs(r, c + 1)
            dfs(r, c - 1)

        dfs(sr, sc)
        return image`,
    typescript: String.raw`function floodFill(image: number[][], sr: number, sc: number, color: number): number[][] {
  const rows = image.length
  const cols = image[0].length
  const original = image[sr][sc]
  if (original === color) return image

  const dfs = (r: number, c: number): void => {
    if (r < 0 || r >= rows || c < 0 || c >= cols || image[r][c] !== original) return
    image[r][c] = color
    dfs(r + 1, c)
    dfs(r - 1, c)
    dfs(r, c + 1)
    dfs(r, c - 1)
  }

  dfs(sr, sc)
  return image
}`,
  }),
  buildProblem({
    id: 785,
    title: 'Is Graph Bipartite?',
    difficulty: 'Medium',
    statement: '給定一張無向圖 graph，判斷是否能把所有節點分成兩組，且每條邊都跨組。',
    focus: '這題本質是 2-coloring。只要圖中出現奇環，就不可能二分。面試中要能說出「相鄰節點顏色必須相反」。',
    dataStructureChoice: '用陣列或 Hash Map 記錄顏色即可，搭配 BFS/DFS 進行圖遍歷並傳播顏色。',
    strategy: [
      '建立 colors 陣列，0 表示未染色，1 / -1 表示兩組。',
      '從每個尚未染色的節點出發做 BFS/DFS，將相鄰節點染成相反顏色。',
      '若遇到相鄰節點已染成相同顏色，立刻回傳 false。',
    ],
    example: example('graph = [[1,3],[0,2],[1,3],[0,2]]', 'true', '可分成 {0,2} 與 {1,3} 兩組。'),
    techniques: ['Graph Coloring', 'BFS/DFS', 'Bipartite Check'],
    baseline: {
      name: 'Try All Group Assignments',
      idea: '回溯枚舉每個節點放哪一組，再驗證所有邊。',
      time: 'Exponential',
      space: 'O(n)',
    },
    optimized: {
      name: 'Two-Color Traversal',
      idea: '用 BFS/DFS 傳遞顏色約束，任何衝突都代表不是二分圖。',
      time: 'O(V + E)',
      space: 'O(V)',
    },
    python: String.raw`from collections import deque

class Solution:
    def isBipartite(self, graph: list[list[int]]) -> bool:
        n = len(graph)
        color = [0] * n

        for start in range(n):
            if color[start] != 0:
                continue
            queue = deque([start])
            color[start] = 1

            while queue:
                node = queue.popleft()
                for nei in graph[node]:
                    if color[nei] == 0:
                        color[nei] = -color[node]
                        queue.append(nei)
                    elif color[nei] == color[node]:
                        return False

        return True`,
    typescript: String.raw`function isBipartite(graph: number[][]): boolean {
  const color = new Array(graph.length).fill(0)

  for (let start = 0; start < graph.length; start++) {
    if (color[start] !== 0) continue
    const queue = [start]
    color[start] = 1

    while (queue.length) {
      const node = queue.shift()!
      for (const nei of graph[node]) {
        if (color[nei] === 0) {
          color[nei] = -color[node]
          queue.push(nei)
        } else if (color[nei] === color[node]) {
          return false
        }
      }
    }
  }

  return true
}`,
  }),
  buildProblem({
    id: 797,
    title: 'All Paths From Source to Target',
    difficulty: 'Medium',
    statement: '給定 DAG graph，請列出所有從 0 到 n-1 的路徑。',
    focus: '這題考的是 DFS backtracking 的典型路徑列舉。因為圖是 DAG，不需要額外處理 cycle。',
    dataStructureChoice: 'DFS 最適合列舉所有路徑，並用 path 陣列保存當前走過的節點，遞迴返回時回溯。',
    strategy: [
      '從節點 0 開始 DFS，path 初始為 [0]。',
      '當走到目標節點 n-1 時，把當前 path 複製進答案。',
      '對每個鄰居遞迴探索，結束後把鄰居從 path 移除。',
    ],
    example: example('graph = [[1,2],[3],[3],[]]', '[[0,1,3],[0,2,3]]', '從 0 到 3 一共有兩條路徑。'),
    techniques: ['DFS', 'Backtracking', 'Path Enumeration'],
    baseline: {
      name: 'Build All Partial Paths Iteratively',
      idea: '用佇列保存所有部分路徑，逐步展開到終點。',
      time: 'O(total paths * path length)',
      space: 'O(total paths * path length)',
    },
    optimized: {
      name: 'DFS Backtracking',
      idea: '用遞迴只保留單一路徑狀態，走到終點時再複製到答案。',
      time: 'O(total paths * path length)',
      space: 'O(path length)',
    },
    python: String.raw`class Solution:
    def allPathsSourceTarget(self, graph: list[list[int]]) -> list[list[int]]:
        target = len(graph) - 1
        result = []
        path = [0]

        def dfs(node: int) -> None:
            if node == target:
                result.append(path[:])
                return
            for nei in graph[node]:
                path.append(nei)
                dfs(nei)
                path.pop()

        dfs(0)
        return result`,
    typescript: String.raw`function allPathsSourceTarget(graph: number[][]): number[][] {
  const target = graph.length - 1
  const result: number[][] = []
  const path = [0]

  const dfs = (node: number) => {
    if (node === target) {
      result.push([...path])
      return
    }
    for (const nei of graph[node]) {
      path.push(nei)
      dfs(nei)
      path.pop()
    }
  }

  dfs(0)
  return result
}`,
  }),
  buildProblem({
    id: 841,
    title: 'Keys and Rooms',
    difficulty: 'Medium',
    statement: '有 n 個房間，0 號房間初始開著；每個房間裡有一些鑰匙。請判斷是否能進入所有房間。',
    focus: '這題就是圖的 reachability。房間是節點，鑰匙代表有向邊，問題等價於從 0 是否能遍歷所有節點。',
    dataStructureChoice: 'DFS 或 BFS 都行，只要有一個 visited 集合記錄已進過的房間即可。',
    strategy: [
      '從房間 0 開始，把它放進 stack 或 queue。',
      '每進入一個房間，就把裡面的鑰匙對應房間加入待處理集合。',
      '最後檢查 visited 的房間數是否等於 rooms 長度。',
    ],
    example: example('rooms = [[1],[2],[3],[]]', 'true', '從 0 依序拿到 1、2、3 的鑰匙，可以進入所有房間。'),
    techniques: ['Graph Reachability', 'DFS/BFS', 'Visited Set'],
    baseline: {
      name: 'Repeated Scan Until Stable',
      idea: '反覆掃描所有房間，若有已開房間持有新鑰匙就再開新房間，直到不再變化。',
      time: 'O(n^2)',
      space: 'O(n)',
    },
    optimized: {
      name: 'Graph Traversal from Room 0',
      idea: '把房間與鑰匙直接視為圖，從 0 做一次 DFS/BFS 即可。',
      time: 'O(V + E)',
      space: 'O(V)',
    },
    python: String.raw`class Solution:
    def canVisitAllRooms(self, rooms: list[list[int]]) -> bool:
        visited = set([0])
        stack = [0]

        while stack:
            room = stack.pop()
            for key in rooms[room]:
                if key not in visited:
                    visited.add(key)
                    stack.append(key)

        return len(visited) == len(rooms)`,
    typescript: String.raw`function canVisitAllRooms(rooms: number[][]): boolean {
  const visited = new Set<number>([0])
  const stack = [0]

  while (stack.length) {
    const room = stack.pop()!
    for (const key of rooms[room]) {
      if (!visited.has(key)) {
        visited.add(key)
        stack.push(key)
      }
    }
  }

  return visited.size === rooms.length
}`,
  }),
  buildProblem({
    id: 34,
    title: 'Find First and Last Position of Element in Sorted Array',
    difficulty: 'Medium',
    statement: '給定排序陣列 nums 與 target，回傳 target 的起始與結束索引；若不存在則回傳 [-1, -1]。',
    focus: '這題不是普通 binary search，而是 lower bound / upper bound 的經典變體。你要找的是邊界，不只是任意一個命中位置。',
    dataStructureChoice: '排序陣列搭配 binary search 就夠了，因為目標是快速鎖定 target 出現區間的左右邊界。',
    strategy: [
      '先找第一個 >= target 的位置 left。',
      '再找第一個 > target 的位置 rightExclusive。',
      '若 left 越界或 nums[left] 不是 target，答案不存在；否則回傳 [left, rightExclusive - 1]。',
    ],
    example: example('nums = [5,7,7,8,8,10], target = 8', '[3,4]', '數字 8 的最左與最右索引分別是 3 與 4。'),
    techniques: ['Binary Search', 'Lower Bound', 'Upper Bound'],
    baseline: {
      name: 'Linear Scan Both Directions',
      idea: '先找一個 target，再向左右擴張或直接整段掃描。',
      time: 'O(n)',
      space: 'O(1)',
    },
    optimized: {
      name: 'Two Boundary Searches',
      idea: '分別找出 target 的左右邊界，維持整體 O(log n)。',
      time: 'O(log n)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def searchRange(self, nums: list[int], target: int) -> list[int]:
        def lower_bound(x: int) -> int:
            left, right = 0, len(nums)
            while left < right:
                mid = (left + right) // 2
                if nums[mid] < x:
                    left = mid + 1
                else:
                    right = mid
            return left

        left = lower_bound(target)
        right = lower_bound(target + 1) - 1
        if left == len(nums) or nums[left] != target:
            return [-1, -1]
        return [left, right]`,
    typescript: String.raw`function searchRange(nums: number[], target: number): number[] {
  const lowerBound = (x: number): number => {
    let left = 0
    let right = nums.length
    while (left < right) {
      const mid = Math.floor((left + right) / 2)
      if (nums[mid] < x) left = mid + 1
      else right = mid
    }
    return left
  }

  const left = lowerBound(target)
  const right = lowerBound(target + 1) - 1
  if (left === nums.length || nums[left] !== target) return [-1, -1]
  return [left, right]
}`,
  }),
  buildProblem({
    id: 35,
    title: 'Search Insert Position',
    difficulty: 'Easy',
    statement: '給定排序陣列 nums 與 target，若 target 存在回傳索引；否則回傳它應插入的位置。',
    focus: '這題其實就是 lower bound 的最基本版本。面試常用它來確認你對 binary search 邊界是否真的熟。',
    dataStructureChoice: '排序陣列搭配 binary search 最直接，因為要找的是第一個大於等於 target 的位置。',
    strategy: [
      '維持搜尋區間 [left, right)。',
      '若 nums[mid] < target，答案只可能在右半邊；否則保留左半邊。',
      '迴圈結束時 left 就是插入位置。',
    ],
    example: example('nums = [1,3,5,6], target = 2', '1', '2 應插在索引 1，使陣列仍保持排序。'),
    techniques: ['Binary Search', 'Lower Bound', 'Sorted Array'],
    baseline: {
      name: 'Linear Scan',
      idea: '從頭掃到第一個大於等於 target 的位置。',
      time: 'O(n)',
      space: 'O(1)',
    },
    optimized: {
      name: 'Lower Bound Binary Search',
      idea: '用 binary search 找到第一個 >= target 的索引。',
      time: 'O(log n)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def searchInsert(self, nums: list[int], target: int) -> int:
        left, right = 0, len(nums)
        while left < right:
            mid = (left + right) // 2
            if nums[mid] < target:
                left = mid + 1
            else:
                right = mid
        return left`,
    typescript: String.raw`function searchInsert(nums: number[], target: number): number {
  let left = 0
  let right = nums.length

  while (left < right) {
    const mid = Math.floor((left + right) / 2)
    if (nums[mid] < target) left = mid + 1
    else right = mid
  }

  return left
}`,
  }),
  buildProblem({
    id: 69,
    title: 'Sqrt(x)',
    difficulty: 'Easy',
    statement: '給定非負整數 x，回傳其平方根的整數部分，不能使用內建次方函式。',
    focus: '這題是典型 search on answer。答案本身單調，只要判斷 mid^2 是否超過 x，就能二分縮小範圍。',
    dataStructureChoice: '不需要額外資料結構，binary search 在數值區間 [0, x] 上搜尋答案即可。',
    strategy: [
      '把答案範圍設在 0 到 x。',
      '若 mid * mid <= x，代表 mid 還合法，可以嘗試更大的值。',
      '否則把右界縮小，直到找到最大的合法 mid。',
    ],
    example: example('x = 8', '2', '8 的平方根約為 2.828，因此整數部分是 2。'),
    techniques: ['Binary Search on Answer', 'Monotonic Predicate', 'Math'],
    baseline: {
      name: 'Incremental Trial',
      idea: '從 0 開始一路試到平方超過 x。',
      time: 'O(sqrt(x))',
      space: 'O(1)',
    },
    optimized: {
      name: 'Binary Search',
      idea: '利用平方結果的單調性，在數值區間上二分搜尋最大的合法整數。',
      time: 'O(log x)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def mySqrt(self, x: int) -> int:
        left, right = 0, x
        ans = 0

        while left <= right:
            mid = (left + right) // 2
            if mid * mid <= x:
                ans = mid
                left = mid + 1
            else:
                right = mid - 1

        return ans`,
    typescript: String.raw`function mySqrt(x: number): number {
  let left = 0
  let right = x
  let ans = 0

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    if (mid * mid <= x) {
      ans = mid
      left = mid + 1
    } else {
      right = mid - 1
    }
  }

  return ans
}`,
  }),
  buildProblem({
    id: 81,
    title: 'Search in Rotated Sorted Array II',
    difficulty: 'Medium',
    statement: '給定可能包含重複值的旋轉排序陣列 nums 與 target，判斷 target 是否存在。',
    focus: '和無重複版最大的差異是 `nums[left] == nums[mid] == nums[right]` 時無法判斷哪半邊有序，必須縮邊界避開歧義。',
    dataStructureChoice: '仍然是 binary search，但要在判斷有序半邊前先處理重複值造成的模糊狀況。',
    strategy: [
      '若 nums[mid] 命中 target 就回傳 true。',
      '若 left、mid、right 三者相同，無法判斷時就 left++、right--。',
      '否則找出哪一半有序，再判斷 target 是否落在該區間中。',
    ],
    example: example('nums = [2,5,6,0,0,1,2], target = 0', 'true', 'target 存在於旋轉後的陣列中。'),
    techniques: ['Binary Search', 'Rotated Array', 'Duplicate Handling'],
    baseline: {
      name: 'Linear Search',
      idea: '直接掃描所有元素確認 target 是否存在。',
      time: 'O(n)',
      space: 'O(1)',
    },
    optimized: {
      name: 'Binary Search with Duplicate Shrink',
      idea: '保留旋轉陣列的判斷邏輯，但在模糊情況先縮小邊界。',
      time: 'Average O(log n), Worst O(n)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def search(self, nums: list[int], target: int) -> bool:
        left, right = 0, len(nums) - 1

        while left <= right:
            mid = (left + right) // 2
            if nums[mid] == target:
                return True

            if nums[left] == nums[mid] == nums[right]:
                left += 1
                right -= 1
            elif nums[left] <= nums[mid]:
                if nums[left] <= target < nums[mid]:
                    right = mid - 1
                else:
                    left = mid + 1
            else:
                if nums[mid] < target <= nums[right]:
                    left = mid + 1
                else:
                    right = mid - 1

        return False`,
    typescript: String.raw`function search(nums: number[], target: number): boolean {
  let left = 0
  let right = nums.length - 1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    if (nums[mid] === target) return true

    if (nums[left] === nums[mid] && nums[mid] === nums[right]) {
      left++
      right--
    } else if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) right = mid - 1
      else left = mid + 1
    } else {
      if (nums[mid] < target && target <= nums[right]) left = mid + 1
      else right = mid - 1
    }
  }

  return false
}`,
  }),
  buildProblem({
    id: 162,
    title: 'Find Peak Element',
    difficulty: 'Medium',
    statement: '給定陣列 nums，找出任一個 peak element 的索引；peak 定義為比左右鄰居都大。',
    focus: '這題要抓住的是斜率思維。若 nums[mid] < nums[mid + 1]，代表右側一定存在 peak，因此可以安全丟掉左半部。',
    dataStructureChoice: '只需要 binary search，因為相鄰大小關係可以提供單調方向，保證某一側一定含有峰值。',
    strategy: [
      '比較 nums[mid] 與 nums[mid + 1]。',
      '若往右上升，peak 一定在右側；若往右下降，peak 一定在左側含 mid。',
      '縮到 left == right 時，該位置就是某個合法峰值。',
    ],
    example: example('nums = [1,2,3,1]', '2', '索引 2 的值 3 比左右鄰居都大。'),
    techniques: ['Binary Search', 'Slope Analysis', 'Local Peak'],
    baseline: {
      name: 'Scan All Indices',
      idea: '逐一檢查每個位置是否為 peak。',
      time: 'O(n)',
      space: 'O(1)',
    },
    optimized: {
      name: 'Binary Search on Slope',
      idea: '利用上升/下降斜率判斷哪一側一定存在峰值。',
      time: 'O(log n)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def findPeakElement(self, nums: list[int]) -> int:
        left, right = 0, len(nums) - 1

        while left < right:
            mid = (left + right) // 2
            if nums[mid] < nums[mid + 1]:
                left = mid + 1
            else:
                right = mid

        return left`,
    typescript: String.raw`function findPeakElement(nums: number[]): number {
  let left = 0
  let right = nums.length - 1

  while (left < right) {
    const mid = Math.floor((left + right) / 2)
    if (nums[mid] < nums[mid + 1]) left = mid + 1
    else right = mid
  }

  return left
}`,
  }),
  buildProblem({
    id: 540,
    title: 'Single Element in a Sorted Array',
    difficulty: 'Medium',
    statement: '給定排序陣列 nums，其中每個元素都出現兩次，只有一個元素出現一次，請以 O(log n) 找出它。',
    focus: '這題考的是 pair 對齊性。單一元素出現前，成對元素的第一個索引會是偶數；出現後，對齊性會整體偏移。',
    dataStructureChoice: '排序陣列與 binary search 足夠，因為 pair 的結構提供了可二分的單調資訊。',
    strategy: [
      '令 mid 調整成偶數索引，方便與 mid + 1 配對比較。',
      '若 nums[mid] == nums[mid + 1]，代表單一元素在右半邊。',
      '否則單一元素在左半邊含 mid。',
    ],
    example: example('nums = [1,1,2,3,3,4,4,8,8]', '2', '數字 2 是唯一只出現一次的元素。'),
    techniques: ['Binary Search', 'Index Parity', 'Sorted Pair Pattern'],
    baseline: {
      name: 'XOR All Values',
      idea: '把所有數字 XOR 起來可以得到唯一值，但沒用到排序性質。',
      time: 'O(n)',
      space: 'O(1)',
    },
    optimized: {
      name: 'Parity-based Binary Search',
      idea: '利用成對元素索引奇偶性在單一元素前後會改變，二分找到斷點。',
      time: 'O(log n)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def singleNonDuplicate(self, nums: list[int]) -> int:
        left, right = 0, len(nums) - 1

        while left < right:
            mid = (left + right) // 2
            if mid % 2 == 1:
                mid -= 1
            if nums[mid] == nums[mid + 1]:
                left = mid + 2
            else:
                right = mid

        return nums[left]`,
    typescript: String.raw`function singleNonDuplicate(nums: number[]): number {
  let left = 0
  let right = nums.length - 1

  while (left < right) {
    let mid = Math.floor((left + right) / 2)
    if (mid % 2 === 1) mid--
    if (nums[mid] === nums[mid + 1]) left = mid + 2
    else right = mid
  }

  return nums[left]
}`,
  }),
  buildProblem({
    id: 26,
    title: 'Remove Duplicates from Sorted Array',
    difficulty: 'Easy',
    statement: '給定排序陣列 nums，請原地移除重複元素，使每個值只出現一次，回傳新長度。',
    focus: '這題是雙指標最標準的模板。關鍵在於快指標負責掃描，慢指標負責維持合法答案區間。',
    dataStructureChoice: '因為陣列已排序，相同元素會連在一起，所以只需用 two pointers 原地覆寫即可。',
    strategy: [
      'slow 指向目前答案尾端，fast 從第二個元素開始掃描。',
      '若 nums[fast] 與 nums[slow] 不同，代表出現新值，把它寫到 slow + 1。',
      '最後回傳 slow + 1 作為新長度。',
    ],
    example: example('nums = [0,0,1,1,1,2,2,3,3,4]', '5', '原地修改後前 5 個位置會是 [0,1,2,3,4]。'),
    techniques: ['Two Pointers', 'In-place Update', 'Sorted Array'],
    baseline: {
      name: 'Use Extra Array',
      idea: '建立新陣列收集不重複元素，再覆寫回原陣列。',
      time: 'O(n)',
      space: 'O(n)',
    },
    optimized: {
      name: 'Slow/Fast Pointers',
      idea: '用 slow 維持結果區間尾端，遇到新值就原地往前寫。',
      time: 'O(n)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def removeDuplicates(self, nums: list[int]) -> int:
        if not nums:
            return 0

        slow = 0
        for fast in range(1, len(nums)):
            if nums[fast] != nums[slow]:
                slow += 1
                nums[slow] = nums[fast]

        return slow + 1`,
    typescript: String.raw`function removeDuplicates(nums: number[]): number {
  if (nums.length === 0) return 0

  let slow = 0
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++
      nums[slow] = nums[fast]
    }
  }

  return slow + 1
}`,
  }),
  buildProblem({
    id: 27,
    title: 'Remove Element',
    difficulty: 'Easy',
    statement: '給定陣列 nums 與 val，原地移除所有等於 val 的元素並回傳新長度。',
    focus: '和移除重複元素類似，但這題的合法條件改成「不等於 val」。核心仍然是用寫入指標維持保留區間。',
    dataStructureChoice: '單向雙指標就足夠；讀指標掃描原陣列，寫指標把需要保留的值往前覆寫。',
    strategy: [
      '用 write 指向下一個可寫入的位置。',
      '逐一掃描每個 num，只要 num != val 就寫到 nums[write] 並讓 write 前進。',
      '最後 write 就是新長度。',
    ],
    example: example('nums = [3,2,2,3], val = 3', '2', '前兩個位置保留為 [2,2]，其餘內容不重要。'),
    techniques: ['Two Pointers', 'Filter In-place', 'Overwrite'],
    baseline: {
      name: 'Create Filtered Copy',
      idea: '先建立不含 val 的新陣列，再複製回原陣列。',
      time: 'O(n)',
      space: 'O(n)',
    },
    optimized: {
      name: 'Write Pointer',
      idea: '掃描時只把要保留的元素往前寫，省掉額外空間。',
      time: 'O(n)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def removeElement(self, nums: list[int], val: int) -> int:
        write = 0
        for num in nums:
            if num != val:
                nums[write] = num
                write += 1
        return write`,
    typescript: String.raw`function removeElement(nums: number[], val: number): number {
  let write = 0
  for (const num of nums) {
    if (num !== val) nums[write++] = num
  }
  return write
}`,
  }),
  buildProblem({
    id: 125,
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    statement: '忽略大小寫與非英數字元，判斷字串 s 是否為 palindrome。',
    focus: '這題是對向雙指標的基本題。重點不是反轉字串，而是能否在掃描過程中跳過無效字元。',
    dataStructureChoice: 'Two pointers 最合適，因為每次只需比較最左與最右的有效字元。',
    strategy: [
      'left 從頭、right 從尾開始。',
      '若遇到非英數字元就跳過，直到兩側都停在有效字元上。',
      '比較兩者的小寫字元，若不同就 false；否則繼續往中間逼近。',
    ],
    example: example('s = "A man, a plan, a canal: Panama"', 'true', '過濾非英數與大小寫後是 "amanaplanacanalpanama"。'),
    techniques: ['Two Pointers', 'String Sanitization', 'Palindrome'],
    baseline: {
      name: 'Build Clean String Then Compare',
      idea: '先過濾出所有英數字元並轉小寫，再和反轉字串比較。',
      time: 'O(n)',
      space: 'O(n)',
    },
    optimized: {
      name: 'Two Pointers In-place',
      idea: '直接用雙指標從兩端往中間走，跳過不必要字元。',
      time: 'O(n)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def isPalindrome(self, s: str) -> bool:
        left, right = 0, len(s) - 1

        while left < right:
            while left < right and not s[left].isalnum():
                left += 1
            while left < right and not s[right].isalnum():
                right -= 1
            if s[left].lower() != s[right].lower():
                return False
            left += 1
            right -= 1

        return True`,
    typescript: String.raw`function isPalindrome(s: string): boolean {
  let left = 0
  let right = s.length - 1

  const isAlphaNum = (ch: string) => /[a-z0-9]/i.test(ch)

  while (left < right) {
    while (left < right && !isAlphaNum(s[left])) left++
    while (left < right && !isAlphaNum(s[right])) right--
    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false
    left++
    right--
  }

  return true
}`,
  }),
  buildProblem({
    id: 283,
    title: 'Move Zeroes',
    difficulty: 'Easy',
    statement: '把陣列中的所有 0 移到尾端，並保持非零元素原本相對順序。',
    focus: '這題本質是 stable compaction。你要在不打亂非零元素順序的前提下，原地把有效元素往前推。',
    dataStructureChoice: 'Two pointers 足夠，write 負責下一個非零值要放的位置，read 負責掃描原陣列。',
    strategy: [
      '用 write 指標記錄下一個非零值要寫入的位置。',
      '掃描每個數字，若非零就寫到 nums[write] 並讓 write 前進。',
      '最後把 write 之後的位置全部補成 0。',
    ],
    example: example('nums = [0,1,0,3,12]', '[1,3,12,0,0]', '非零元素相對順序維持為 1、3、12。'),
    techniques: ['Two Pointers', 'In-place Stable Move', 'Array Rewrite'],
    baseline: {
      name: 'Build New Array',
      idea: '先收集所有非零元素，再把剩下的位置補零。',
      time: 'O(n)',
      space: 'O(n)',
    },
    optimized: {
      name: 'Write Pointer',
      idea: '用一個寫入指標把非零值往前壓縮，最後補零。',
      time: 'O(n)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def moveZeroes(self, nums: list[int]) -> None:
        write = 0
        for num in nums:
            if num != 0:
                nums[write] = num
                write += 1
        while write < len(nums):
            nums[write] = 0
            write += 1`,
    typescript: String.raw`function moveZeroes(nums: number[]): void {
  let write = 0
  for (const num of nums) {
    if (num !== 0) nums[write++] = num
  }
  while (write < nums.length) {
    nums[write++] = 0
  }
}`,
  }),
  buildProblem({
    id: 344,
    title: 'Reverse String',
    difficulty: 'Easy',
    statement: '給定字元陣列 s，請原地反轉它。',
    focus: '這題是對向雙指標最基礎的形式。核心只有一件事：從兩端往中間交換。',
    dataStructureChoice: '不需要額外資料結構，left/right 雙指標原地 swap 即可。',
    strategy: [
      'left 指向開頭、right 指向結尾。',
      '交換 s[left] 與 s[right]。',
      'left++, right--，直到兩指標交錯。',
    ],
    example: example('s = ["h","e","l","l","o"]', '["o","l","l","e","h"]', '兩端字元逐步交換直到中間。'),
    techniques: ['Two Pointers', 'In-place Swap', 'String Array'],
    baseline: {
      name: 'Make Reversed Copy',
      idea: '建立一份倒序陣列再覆寫回原陣列。',
      time: 'O(n)',
      space: 'O(n)',
    },
    optimized: {
      name: 'Two-end Swap',
      idea: '用左右指標從兩端交換到中間，原地完成。',
      time: 'O(n)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def reverseString(self, s: list[str]) -> None:
        left, right = 0, len(s) - 1
        while left < right:
            s[left], s[right] = s[right], s[left]
            left += 1
            right -= 1`,
    typescript: String.raw`function reverseString(s: string[]): void {
  let left = 0
  let right = s.length - 1

  while (left < right) {
    ;[s[left], s[right]] = [s[right], s[left]]
    left++
    right--
  }
}`,
  }),
  buildProblem({
    id: 392,
    title: 'Is Subsequence',
    difficulty: 'Easy',
    statement: '判斷字串 s 是否為字串 t 的 subsequence。',
    focus: 'subsequence 的關鍵是順序必須保留但不要求連續，所以只要用一個指標在 t 中找 s 的下一個字元即可。',
    dataStructureChoice: 'Two pointers 就夠了，一個掃 s，一個掃 t。',
    strategy: [
      '用 i 指向 s、j 指向 t。',
      '若 s[i] == t[j]，代表找到一個匹配字元，i 前進。',
      'j 每次都前進，最後若 i 走完整個 s 就成功。',
    ],
    example: example('s = "abc", t = "ahbgdc"', 'true', 'a、b、c 都能依序在 t 中找到。'),
    techniques: ['Two Pointers', 'Subsequence', 'Greedy Match'],
    baseline: {
      name: 'Recursive Match',
      idea: '遞迴嘗試每個字元是否匹配，概念直觀但不如雙指標精簡。',
      time: 'O(n + m)',
      space: 'O(n)',
    },
    optimized: {
      name: 'Greedy Two Pointers',
      idea: '每次在 t 中找 s 的下一個所需字元，能配上就往前推進。',
      time: 'O(n + m)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def isSubsequence(self, s: str, t: str) -> bool:
        i = 0
        for ch in t:
            if i < len(s) and s[i] == ch:
                i += 1
        return i == len(s)`,
    typescript: String.raw`function isSubsequence(s: string, t: string): boolean {
  let i = 0
  for (const ch of t) {
    if (i < s.length && s[i] === ch) i++
  }
  return i === s.length
}`,
  }),
  buildProblem({
    id: 209,
    title: 'Minimum Size Subarray Sum',
    difficulty: 'Medium',
    statement: '給定正整數陣列 nums 與 target，找出和至少為 target 的最短連續子陣列長度。',
    focus: '因為所有數字都為正，窗口和只會隨右邊擴張增加、隨左邊收縮減少，所以 sliding window 可以成立。',
    dataStructureChoice: 'Sliding window 是最佳選擇；正數條件保證窗口收縮後不會漏掉更短且更大的合法解。',
    strategy: [
      '右指標持續擴張並累加 window sum。',
      '當 sum >= target 時，嘗試移動左指標收縮窗口並更新最短長度。',
      '掃描結束後，若從未達標則回傳 0。',
    ],
    example: example('target = 7, nums = [2,3,1,2,4,3]', '2', '子陣列 [4,3] 長度為 2，是最短答案。'),
    techniques: ['Sliding Window', 'Positive Numbers', 'Shrink to Valid'],
    baseline: {
      name: 'Enumerate All Subarrays',
      idea: '枚舉每個起點往右加總，找到最短達標區間。',
      time: 'O(n^2)',
      space: 'O(1)',
    },
    optimized: {
      name: 'Shrinkable Sliding Window',
      idea: '利用正數條件，在達標後立刻收縮左邊界以找更短解。',
      time: 'O(n)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def minSubArrayLen(self, target: int, nums: list[int]) -> int:
        left = 0
        total = 0
        best = float('inf')

        for right, num in enumerate(nums):
            total += num
            while total >= target:
                best = min(best, right - left + 1)
                total -= nums[left]
                left += 1

        return 0 if best == float('inf') else best`,
    typescript: String.raw`function minSubArrayLen(target: number, nums: number[]): number {
  let left = 0
  let total = 0
  let best = Infinity

  for (let right = 0; right < nums.length; right++) {
    total += nums[right]
    while (total >= target) {
      best = Math.min(best, right - left + 1)
      total -= nums[left++]
    }
  }

  return best === Infinity ? 0 : best
}`,
  }),
  buildProblem({
    id: 438,
    title: 'Find All Anagrams in a String',
    difficulty: 'Medium',
    statement: '給定字串 s 與 p，找出 s 中所有是 p 的 anagram 的起始索引。',
    focus: '這題是固定長度 sliding window。關鍵在於如何在窗口滑動時只做 O(1) 更新，而不是每次重新排序或重計數。',
    dataStructureChoice: '固定長度的 frequency counting 最合適，因為每次只會移出一個字元、移入一個字元。',
    strategy: [
      '先統計 p 的字元頻率 need。',
      '用長度為 len(p) 的窗口掃描 s，窗口移動時同步更新 count。',
      '每次若窗口頻率與 need 相同，就把左邊界索引加入答案。',
    ],
    example: example('s = "cbaebabacd", p = "abc"', '[0,6]', '索引 0 的 "cba" 與索引 6 的 "bac" 都是 anagram。'),
    techniques: ['Sliding Window', 'Frequency Array', 'Fixed-size Window'],
    baseline: {
      name: 'Sort Every Window',
      idea: '對 s 的每個長度為 len(p) 的子字串排序後與 p 比較。',
      time: 'O(nk log k)',
      space: 'O(k)',
    },
    optimized: {
      name: 'Rolling Frequency Window',
      idea: '維護固定長度窗口的頻率計數，窗口移動時只更新兩個字元。',
      time: 'O(n)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def findAnagrams(self, s: str, p: str) -> list[int]:
        if len(p) > len(s):
            return []

        need = [0] * 26
        window = [0] * 26
        for ch in p:
            need[ord(ch) - 97] += 1

        result = []
        k = len(p)
        for i, ch in enumerate(s):
            window[ord(ch) - 97] += 1
            if i >= k:
                window[ord(s[i - k]) - 97] -= 1
            if window == need:
                result.append(i - k + 1)

        return result`,
    typescript: String.raw`function findAnagrams(s: string, p: string): number[] {
  if (p.length > s.length) return []

  const need = new Array(26).fill(0)
  const window = new Array(26).fill(0)
  for (const ch of p) need[ch.charCodeAt(0) - 97]++

  const result: number[] = []
  const k = p.length

  for (let i = 0; i < s.length; i++) {
    window[s.charCodeAt(i) - 97]++
    if (i >= k) window[s.charCodeAt(i - k) - 97]--
    if (window.every((count, idx) => count === need[idx])) {
      result.push(i - k + 1)
    }
  }

  return result
}`,
  }),
  buildProblem({
    id: 643,
    title: 'Maximum Average Subarray I',
    difficulty: 'Easy',
    statement: '給定整數陣列 nums 與整數 k，找出長度恰為 k 的連續子陣列的最大平均值。',
    focus: '固定長度窗口是這題最明顯的 pattern。平均值最大等價於總和最大，因此只要維護長度 k 的最大和。',
    dataStructureChoice: 'Sliding window 就足夠，因為每移動一步只會多一個元素、少一個元素。',
    strategy: [
      '先計算前 k 個元素的總和作為初始窗口。',
      '右指標每往右一步，就加上新值並減去離開窗口的舊值。',
      '持續更新最大窗口和，最後除以 k。',
    ],
    example: example('nums = [1,12,-5,-6,50,3], k = 4', '12.75', '子陣列 [12,-5,-6,50] 的平均值最大。'),
    techniques: ['Fixed Window', 'Rolling Sum', 'Average -> Sum'],
    baseline: {
      name: 'Recalculate Every Window',
      idea: '對每個長度 k 的區間重新計算總和。',
      time: 'O(nk)',
      space: 'O(1)',
    },
    optimized: {
      name: 'Rolling Window Sum',
      idea: '維護固定長度窗口總和，移動時只更新進出元素。',
      time: 'O(n)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def findMaxAverage(self, nums: list[int], k: int) -> float:
        window = sum(nums[:k])
        best = window

        for i in range(k, len(nums)):
            window += nums[i] - nums[i - k]
            best = max(best, window)

        return best / k`,
    typescript: String.raw`function findMaxAverage(nums: number[], k: number): number {
  let window = 0
  for (let i = 0; i < k; i++) window += nums[i]
  let best = window

  for (let i = k; i < nums.length; i++) {
    window += nums[i] - nums[i - k]
    best = Math.max(best, window)
  }

  return best / k
}`,
  }),
  buildProblem({
    id: 1004,
    title: 'Max Consecutive Ones III',
    difficulty: 'Medium',
    statement: '給定二元陣列 nums 與整數 k，最多可把 k 個 0 翻成 1，求最長連續 1 的長度。',
    focus: '這題是帶限制條件的可收縮窗口。窗口內允許的違規數量是 0 的個數，超過 k 就必須縮小。',
    dataStructureChoice: 'Sliding window 很適合，因為合法性可以用窗口中的 zeroCount 是否 <= k 來維持。',
    strategy: [
      '右指標擴張時，若新元素是 0 就讓 zeroCount++。',
      '當 zeroCount > k 時，移動左指標直到窗口重新合法。',
      '每一步更新最長合法窗口長度。',
    ],
    example: example('nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2', '6', '最多翻兩個 0，最長可得到長度 6 的連續 1。'),
    techniques: ['Sliding Window', 'Constraint Count', 'Longest Valid Window'],
    baseline: {
      name: 'Start from Every Index',
      idea: '對每個起點往右延伸，統計最多用了幾次翻轉。',
      time: 'O(n^2)',
      space: 'O(1)',
    },
    optimized: {
      name: 'Shrinkable Window with Zero Count',
      idea: '窗口內只要 0 的數量超過 k 就收縮左邊界。',
      time: 'O(n)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def longestOnes(self, nums: list[int], k: int) -> int:
        left = 0
        zeros = 0
        best = 0

        for right, num in enumerate(nums):
            if num == 0:
                zeros += 1
            while zeros > k:
                if nums[left] == 0:
                    zeros -= 1
                left += 1
            best = max(best, right - left + 1)

        return best`,
    typescript: String.raw`function longestOnes(nums: number[], k: number): number {
  let left = 0
  let zeros = 0
  let best = 0

  for (let right = 0; right < nums.length; right++) {
    if (nums[right] === 0) zeros++
    while (zeros > k) {
      if (nums[left] === 0) zeros--
      left++
    }
    best = Math.max(best, right - left + 1)
  }

  return best
}`,
  }),
  buildProblem({
    id: 1456,
    title: 'Maximum Number of Vowels in a Substring of Given Length',
    difficulty: 'Medium',
    statement: '給定字串 s 與整數 k，回傳任一長度為 k 的子字串中最多有多少個母音字元。',
    focus: '這題是固定長度窗口的標準題。因為只在乎窗口內母音數量，所以每次更新只需看進出的兩個字元。',
    dataStructureChoice: 'Sliding window 搭配母音判斷即可，不需要更重的資料結構。',
    strategy: [
      '先統計前 k 個字元中的母音數作為初始值。',
      '窗口每往右一步，若新進字元是母音就加一，離開字元是母音就減一。',
      '持續更新最大母音數量。',
    ],
    example: example('s = "abciiidef", k = 3', '3', '子字串 "iii" 含有 3 個母音，是最大值。'),
    techniques: ['Fixed Window', 'Rolling Count', 'String Window'],
    baseline: {
      name: 'Count Vowels Per Window',
      idea: '對每個長度為 k 的子字串重新掃描並計算母音數。',
      time: 'O(nk)',
      space: 'O(1)',
    },
    optimized: {
      name: 'Rolling Vowel Count',
      idea: '窗口右移時只更新進出兩個字元的影響。',
      time: 'O(n)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def maxVowels(self, s: str, k: int) -> int:
        vowels = set('aeiou')
        count = sum(ch in vowels for ch in s[:k])
        best = count

        for i in range(k, len(s)):
            count += s[i] in vowels
            count -= s[i - k] in vowels
            best = max(best, count)

        return best`,
    typescript: String.raw`function maxVowels(s: string, k: number): number {
  const vowels = new Set(['a', 'e', 'i', 'o', 'u'])
  let count = 0

  for (let i = 0; i < k; i++) {
    if (vowels.has(s[i])) count++
  }

  let best = count
  for (let i = k; i < s.length; i++) {
    if (vowels.has(s[i])) count++
    if (vowels.has(s[i - k])) count--
    best = Math.max(best, count)
  }

  return best
}`,
  }),
  buildProblem({
    id: 17,
    title: 'Letter Combinations of a Phone Number',
    difficulty: 'Medium',
    statement: '給定數字字串 digits，回傳它對應的所有電話鍵盤字母組合。',
    focus: '這題是典型 decision tree。每一位數字都會展開多個分支，最後要收集所有完整路徑。',
    dataStructureChoice: 'Backtracking 最自然，因為要依序選每一位對應的字母，走到底時產生一組答案。',
    strategy: [
      '準備數字到字母的映射表。',
      '從第 0 位開始，對每個可能字母做選擇並遞迴到下一位。',
      '當 path 長度等於 digits 長度時，把組合加入答案。',
    ],
    example: example('digits = "23"', '["ad","ae","af","bd","be","bf","cd","ce","cf"]', '每一位數字都會和下一位的所有可能字母做組合。'),
    techniques: ['Backtracking', 'Decision Tree', 'String Builder'],
    baseline: {
      name: 'Iterative Cross Product',
      idea: '從空字串開始，逐位把所有現有組合和新字母做笛卡兒積。',
      time: 'O(4^n * n)',
      space: 'O(4^n * n)',
    },
    optimized: {
      name: 'Backtracking DFS',
      idea: '用 path 表示目前已選字母，走到葉節點時收集答案。',
      time: 'O(4^n * n)',
      space: 'O(n)',
    },
    python: String.raw`class Solution:
    def letterCombinations(self, digits: str) -> list[str]:
        if not digits:
            return []

        phone = {
            '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
            '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
        }
        result = []
        path = []

        def dfs(index: int) -> None:
            if index == len(digits):
                result.append(''.join(path))
                return
            for ch in phone[digits[index]]:
                path.append(ch)
                dfs(index + 1)
                path.pop()

        dfs(0)
        return result`,
    typescript: String.raw`function letterCombinations(digits: string): string[] {
  if (!digits) return []

  const phone: Record<string, string> = {
    '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
    '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz',
  }

  const result: string[] = []
  const path: string[] = []

  const dfs = (index: number) => {
    if (index === digits.length) {
      result.push(path.join(''))
      return
    }
    for (const ch of phone[digits[index]]) {
      path.push(ch)
      dfs(index + 1)
      path.pop()
    }
  }

  dfs(0)
  return result
}`,
  }),
  buildProblem({
    id: 22,
    title: 'Generate Parentheses',
    difficulty: 'Medium',
    statement: '給定 n，產生所有由 n 對括號組成的合法括號字串。',
    focus: '這題關鍵是回溯時維護合法性不變式：左括號數不能超過 n，右括號數不能超過左括號數。',
    dataStructureChoice: 'Backtracking 最適合，因為每一步都在嘗試放 `(` 或 `)`，並且要根據當前狀態剪枝。',
    strategy: [
      '追蹤目前已放入的 left 與 right 數量。',
      '若 left < n，可以放左括號；若 right < left，可以放右括號。',
      '當字串長度達到 2n 時，把結果收進答案。',
    ],
    example: example('n = 3', '["((()))","(()())","(())()","()(())","()()()"]', '所有答案都滿足任意前綴中左括號數量不小於右括號。'),
    techniques: ['Backtracking', 'Pruning', 'Constraint Generation'],
    baseline: {
      name: 'Generate All 2^(2n) Strings',
      idea: '枚舉所有長度 2n 的括號字串，再過濾合法者。',
      time: 'O(4^n)',
      space: 'O(4^n)',
    },
    optimized: {
      name: 'Constraint-aware Backtracking',
      idea: '在生成過程中就維護合法性，提早剪掉不可能的分支。',
      time: 'O(Catalan(n))',
      space: 'O(n)',
    },
    python: String.raw`class Solution:
    def generateParenthesis(self, n: int) -> list[str]:
        result = []
        path = []

        def dfs(left: int, right: int) -> None:
            if len(path) == 2 * n:
                result.append(''.join(path))
                return
            if left < n:
                path.append('(')
                dfs(left + 1, right)
                path.pop()
            if right < left:
                path.append(')')
                dfs(left, right + 1)
                path.pop()

        dfs(0, 0)
        return result`,
    typescript: String.raw`function generateParenthesis(n: number): string[] {
  const result: string[] = []
  const path: string[] = []

  const dfs = (left: number, right: number) => {
    if (path.length === 2 * n) {
      result.push(path.join(''))
      return
    }
    if (left < n) {
      path.push('(')
      dfs(left + 1, right)
      path.pop()
    }
    if (right < left) {
      path.push(')')
      dfs(left, right + 1)
      path.pop()
    }
  }

  dfs(0, 0)
  return result
}`,
  }),
  buildProblem({
    id: 77,
    title: 'Combinations',
    difficulty: 'Medium',
    statement: '給定 n 與 k，回傳從 1..n 中選出 k 個數的所有組合。',
    focus: '這題在訓練組合型 backtracking。順序不重要，所以遞迴時要透過 start 控制只往後選，避免重複。',
    dataStructureChoice: 'Backtracking 搭配 start index 最直接，能自然表達「下一層只能從剩下的候選中選」。',
    strategy: [
      'path 保存目前已選數字。',
      '遞迴函式接受 start，表示下一個可以選的最小數字。',
      '當 path 長度等於 k 時，把組合加入答案。',
    ],
    example: example('n = 4, k = 2', '[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]', '組合只看選了哪些數字，不看順序。'),
    techniques: ['Backtracking', 'Combination', 'Start Index'],
    baseline: {
      name: 'Generate All Subsets Then Filter',
      idea: '先列舉 1..n 的所有子集合，再篩出大小為 k 的結果。',
      time: 'O(2^n)',
      space: 'O(n)',
    },
    optimized: {
      name: 'Combination Backtracking',
      idea: '直接生成大小為 k 的組合，避免無關的子集合。',
      time: 'O(C(n,k) * k)',
      space: 'O(k)',
    },
    python: String.raw`class Solution:
    def combine(self, n: int, k: int) -> list[list[int]]:
        result = []
        path = []

        def dfs(start: int) -> None:
            if len(path) == k:
                result.append(path[:])
                return
            for num in range(start, n + 1):
                path.append(num)
                dfs(num + 1)
                path.pop()

        dfs(1)
        return result`,
    typescript: String.raw`function combine(n: number, k: number): number[][] {
  const result: number[][] = []
  const path: number[] = []

  const dfs = (start: number) => {
    if (path.length === k) {
      result.push([...path])
      return
    }
    for (let num = start; num <= n; num++) {
      path.push(num)
      dfs(num + 1)
      path.pop()
    }
  }

  dfs(1)
  return result
}`,
  }),
  buildProblem({
    id: 90,
    title: 'Subsets II',
    difficulty: 'Medium',
    statement: '給定可能含重複元素的陣列 nums，回傳所有不重複的子集合。',
    focus: '這題的核心是去重。排序後，相同元素要在同一層遞迴中跳過，避免產生重複子集合。',
    dataStructureChoice: 'Backtracking 仍是主體，但排序是去重的前提，讓你能判斷相鄰相同元素是否應略過。',
    strategy: [
      '先將 nums 排序，讓相同值相鄰。',
      '每次遞迴都先把目前 path 加進答案。',
      '在同一層 for 迴圈中，若 nums[i] == nums[i-1] 且 i > start，就跳過這個分支。',
    ],
    example: example('nums = [1,2,2]', '[[],[1],[1,2],[1,2,2],[2],[2,2]]', '排序後在同層跳過重複的 2，就能避免重複子集合。'),
    techniques: ['Backtracking', 'Sorting', 'Duplicate Skip'],
    baseline: {
      name: 'Generate All Then Deduplicate',
      idea: '先列舉所有子集合，再用 set 去重。',
      time: 'O(2^n * n)',
      space: 'O(2^n * n)',
    },
    optimized: {
      name: 'Sorted Backtracking with Skip',
      idea: '在生成過程中就跳過同層重複元素，避免產生重複結果。',
      time: 'O(2^n)',
      space: 'O(n)',
    },
    python: String.raw`class Solution:
    def subsetsWithDup(self, nums: list[int]) -> list[list[int]]:
        nums.sort()
        result = []
        path = []

        def dfs(start: int) -> None:
            result.append(path[:])
            for i in range(start, len(nums)):
                if i > start and nums[i] == nums[i - 1]:
                    continue
                path.append(nums[i])
                dfs(i + 1)
                path.pop()

        dfs(0)
        return result`,
    typescript: String.raw`function subsetsWithDup(nums: number[]): number[][] {
  nums.sort((a, b) => a - b)
  const result: number[][] = []
  const path: number[] = []

  const dfs = (start: number) => {
    result.push([...path])
    for (let i = start; i < nums.length; i++) {
      if (i > start && nums[i] === nums[i - 1]) continue
      path.push(nums[i])
      dfs(i + 1)
      path.pop()
    }
  }

  dfs(0)
  return result
}`,
  }),
  buildProblem({
    id: 216,
    title: 'Combination Sum III',
    difficulty: 'Medium',
    statement: '從 1 到 9 中選出 k 個互不重複的數字，使其總和為 n，回傳所有可能組合。',
    focus: '這題同時有「選幾個」與「總和」兩個限制，因此很適合練習 backtracking 剪枝。',
    dataStructureChoice: 'Backtracking 足以處理，因為候選集合固定且很小，透過 start 可以避免重複使用同一數字。',
    strategy: [
      '遞迴狀態包含 start、剩餘個數 k 與剩餘總和 remain。',
      '若 path 長度等於 k 且 remain == 0，就收集答案。',
      '若 remain < 0 或 path 已太長，就提早返回。',
    ],
    example: example('k = 3, n = 7', '[[1,2,4]]', '只能用 1 到 9 的互不重複數字，因此答案唯一。'),
    techniques: ['Backtracking', 'Pruning', 'Combination Sum'],
    baseline: {
      name: 'Enumerate All Subsets of 1..9',
      idea: '先列出所有子集合，再篩選大小為 k 且總和為 n 的結果。',
      time: 'O(2^9)',
      space: 'O(9)',
    },
    optimized: {
      name: 'Pruned Backtracking',
      idea: '在遞迴過程中同步追蹤元素個數與剩餘總和，提早剪枝。',
      time: 'O(C(9,k))',
      space: 'O(k)',
    },
    python: String.raw`class Solution:
    def combinationSum3(self, k: int, n: int) -> list[list[int]]:
        result = []
        path = []

        def dfs(start: int, remain: int) -> None:
            if len(path) == k:
                if remain == 0:
                    result.append(path[:])
                return
            for num in range(start, 10):
                if num > remain:
                    break
                path.append(num)
                dfs(num + 1, remain - num)
                path.pop()

        dfs(1, n)
        return result`,
    typescript: String.raw`function combinationSum3(k: number, n: number): number[][] {
  const result: number[][] = []
  const path: number[] = []

  const dfs = (start: number, remain: number) => {
    if (path.length === k) {
      if (remain === 0) result.push([...path])
      return
    }
    for (let num = start; num <= 9; num++) {
      if (num > remain) break
      path.push(num)
      dfs(num + 1, remain - num)
      path.pop()
    }
  }

  dfs(1, n)
  return result
}`,
  }),
  buildProblem({
    id: 784,
    title: 'Letter Case Permutation',
    difficulty: 'Medium',
    statement: '給定字串 s，回傳把每個英文字母改成大小寫後可形成的所有字串。',
    focus: '這題是每個字元做 1 或 2 個選擇的回溯樹。數字沒有分支，字母則有大小寫兩條路。',
    dataStructureChoice: 'Backtracking 最簡潔，因為只要沿著字串位置逐步決定每個字元的表現形式。',
    strategy: [
      '從索引 0 開始處理每個字元。',
      '若是字母，就分別放入小寫與大寫遞迴；若是數字就只有一條分支。',
      '處理完所有字元後，把 path 組成字串加入答案。',
    ],
    example: example('s = "a1b2"', '["a1b2","a1B2","A1b2","A1B2"]', '只有字母會產生大小寫分支。'),
    techniques: ['Backtracking', 'Branching Factor', 'String Generation'],
    baseline: {
      name: 'Bitmask Over Letters',
      idea: '先找出所有字母位置，再用 bitmask 枚舉大小寫組合。',
      time: 'O(2^L * n)',
      space: 'O(2^L * n)',
    },
    optimized: {
      name: 'DFS on Characters',
      idea: '逐字元遞迴，字母分兩支、數字分一支。',
      time: 'O(2^L * n)',
      space: 'O(n)',
    },
    python: String.raw`class Solution:
    def letterCasePermutation(self, s: str) -> list[str]:
        result = []
        path = []

        def dfs(index: int) -> None:
            if index == len(s):
                result.append(''.join(path))
                return
            ch = s[index]
            if ch.isalpha():
                path.append(ch.lower())
                dfs(index + 1)
                path.pop()
                path.append(ch.upper())
                dfs(index + 1)
                path.pop()
            else:
                path.append(ch)
                dfs(index + 1)
                path.pop()

        dfs(0)
        return result`,
    typescript: String.raw`function letterCasePermutation(s: string): string[] {
  const result: string[] = []
  const path: string[] = []

  const dfs = (index: number) => {
    if (index === s.length) {
      result.push(path.join(''))
      return
    }
    const ch = s[index]
    if (/[a-z]/i.test(ch)) {
      path.push(ch.toLowerCase())
      dfs(index + 1)
      path.pop()
      path.push(ch.toUpperCase())
      dfs(index + 1)
      path.pop()
    } else {
      path.push(ch)
      dfs(index + 1)
      path.pop()
    }
  }

  dfs(0)
  return result
}`,
  }),
  buildProblem({
    id: 62,
    title: 'Unique Paths',
    difficulty: 'Medium',
    statement: '機器人位於 m x n 網格左上角，只能往右或往下走，請問共有多少條不同路徑到右下角。',
    focus: '這題是最基礎的 grid DP。每個格子的答案只來自上方與左方，因此狀態轉移非常明確。',
    dataStructureChoice: '2D DP 最直觀，也可壓成 1D。因為每個位置只依賴同列左方與上一列同欄。',
    strategy: [
      '定義 dp[r][c] 為走到該格的方法數。',
      '第一列與第一欄都只有一種走法。',
      '其餘格子的答案是 dp[r-1][c] + dp[r][c-1]。',
    ],
    example: example('m = 3, n = 7', '28', '從左上走到右下共有 28 種不同路徑。'),
    techniques: ['Dynamic Programming', 'Grid DP', 'State Transition'],
    baseline: {
      name: 'Recursive Enumeration',
      idea: '遞迴列舉每次往右或往下的所有走法。',
      time: 'Exponential',
      space: 'O(m+n)',
    },
    optimized: {
      name: 'Tabulation DP',
      idea: '自左上往右下建表，每格只依賴上方與左方。',
      time: 'O(mn)',
      space: 'O(mn)',
    },
    python: String.raw`class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        dp = [[1] * n for _ in range(m)]
        for r in range(1, m):
            for c in range(1, n):
                dp[r][c] = dp[r - 1][c] + dp[r][c - 1]
        return dp[-1][-1]`,
    typescript: String.raw`function uniquePaths(m: number, n: number): number {
  const dp = Array.from({ length: m }, () => new Array(n).fill(1))
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      dp[r][c] = dp[r - 1][c] + dp[r][c - 1]
    }
  }
  return dp[m - 1][n - 1]
}`,
  }),
  buildProblem({
    id: 63,
    title: 'Unique Paths II',
    difficulty: 'Medium',
    statement: '在 Unique Paths 的基礎上，grid 中有障礙物，不能經過障礙格，求不同路徑數。',
    focus: '這題是在基礎 grid DP 上多一個「障礙格直接歸零」的條件，重點是初始化和轉移時要處理障礙物。',
    dataStructureChoice: '2D DP 仍然適用，只要把障礙格的 dp 值設為 0 即可。',
    strategy: [
      '若起點就是障礙物，直接回傳 0。',
      'dp[r][c] 表示到該格的走法；障礙格 dp[r][c] = 0。',
      '非障礙格的值來自上方與左方走法之和。',
    ],
    example: example('obstacleGrid = [[0,0,0],[0,1,0],[0,0,0]]', '2', '中間障礙物擋住部分路徑，因此只剩 2 種走法。'),
    techniques: ['Dynamic Programming', 'Grid DP', 'Obstacle Handling'],
    baseline: {
      name: 'Recursive Search with Obstacles',
      idea: '遞迴嘗試往右或往下，碰到障礙就停止。',
      time: 'Exponential',
      space: 'O(m+n)',
    },
    optimized: {
      name: 'Obstacle-aware DP',
      idea: '建表時把障礙格視為 0，其餘格子照標準 grid DP 累加。',
      time: 'O(mn)',
      space: 'O(mn)',
    },
    python: String.raw`class Solution:
    def uniquePathsWithObstacles(self, obstacleGrid: list[list[int]]) -> int:
        rows, cols = len(obstacleGrid), len(obstacleGrid[0])
        dp = [[0] * cols for _ in range(rows)]
        if obstacleGrid[0][0] == 1:
            return 0
        dp[0][0] = 1

        for r in range(rows):
            for c in range(cols):
                if obstacleGrid[r][c] == 1:
                    dp[r][c] = 0
                else:
                    if r > 0:
                        dp[r][c] += dp[r - 1][c]
                    if c > 0:
                        dp[r][c] += dp[r][c - 1]
        return dp[-1][-1]`,
    typescript: String.raw`function uniquePathsWithObstacles(obstacleGrid: number[][]): number {
  const rows = obstacleGrid.length
  const cols = obstacleGrid[0].length
  const dp = Array.from({ length: rows }, () => new Array(cols).fill(0))
  if (obstacleGrid[0][0] === 1) return 0
  dp[0][0] = 1

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (obstacleGrid[r][c] === 1) {
        dp[r][c] = 0
      } else {
        if (r > 0) dp[r][c] += dp[r - 1][c]
        if (c > 0) dp[r][c] += dp[r][c - 1]
      }
    }
  }

  return dp[rows - 1][cols - 1]
}`,
  }),
  buildProblem({
    id: 64,
    title: 'Minimum Path Sum',
    difficulty: 'Medium',
    statement: '給定非負整數 grid，只能往右或往下走，求從左上到右下的最小路徑總和。',
    focus: '和 Unique Paths 很像，但這題的狀態不再是「方法數」，而是「到達這格的最小成本」。',
    dataStructureChoice: 'Grid DP 依然適用，因為每個格子的最佳成本只取決於上方與左方的最佳成本。',
    strategy: [
      'dp[r][c] 表示到該格的最小路徑和。',
      '第一列與第一欄只能從單一方向走過來，要先正確初始化。',
      '其餘格子取 min(dp[r-1][c], dp[r][c-1]) + grid[r][c]。',
    ],
    example: example('grid = [[1,3,1],[1,5,1],[4,2,1]]', '7', '最小路徑為 1 -> 3 -> 1 -> 1 -> 1，總和 7。'),
    techniques: ['Dynamic Programming', 'Grid Cost DP', 'Min Transition'],
    baseline: {
      name: 'DFS Explore All Paths',
      idea: '遞迴列舉所有合法路徑並取最小總和。',
      time: 'Exponential',
      space: 'O(m+n)',
    },
    optimized: {
      name: 'Minimum Cost DP',
      idea: '用 dp 紀錄到每一格的最小成本，避免重複計算子路徑。',
      time: 'O(mn)',
      space: 'O(mn)',
    },
    python: String.raw`class Solution:
    def minPathSum(self, grid: list[list[int]]) -> int:
        rows, cols = len(grid), len(grid[0])
        dp = [[0] * cols for _ in range(rows)]
        dp[0][0] = grid[0][0]

        for r in range(rows):
            for c in range(cols):
                if r == 0 and c == 0:
                    continue
                up = dp[r - 1][c] if r > 0 else float('inf')
                left = dp[r][c - 1] if c > 0 else float('inf')
                dp[r][c] = min(up, left) + grid[r][c]

        return dp[-1][-1]`,
    typescript: String.raw`function minPathSum(grid: number[][]): number {
  const rows = grid.length
  const cols = grid[0].length
  const dp = Array.from({ length: rows }, () => new Array(cols).fill(0))
  dp[0][0] = grid[0][0]

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (r === 0 && c === 0) continue
      const up = r > 0 ? dp[r - 1][c] : Infinity
      const left = c > 0 ? dp[r][c - 1] : Infinity
      dp[r][c] = Math.min(up, left) + grid[r][c]
    }
  }

  return dp[rows - 1][cols - 1]
}`,
  }),
  buildProblem({
    id: 91,
    title: 'Decode Ways',
    difficulty: 'Medium',
    statement: '字串 s 由數字組成，1 -> A 到 26 -> Z，請問共有多少種解碼方式。',
    focus: '這題的重點在於狀態轉移依賴單字元與雙字元是否合法。尤其遇到 0 時要格外小心。',
    dataStructureChoice: '1D DP 足夠，dp[i] 表示前 i 個字元的解碼方式數量。',
    strategy: [
      '若 s[0] 是 0，直接沒有解。',
      '每個位置可以從單字元解碼延伸，也可能從前兩字元的合法編碼延伸。',
      '把所有合法轉移加總到 dp[i]。',
    ],
    example: example('s = "226"', '3', '可以解成 "BZ"、"VF"、"BBF" 共 3 種。'),
    techniques: ['Dynamic Programming', 'String DP', 'State Validation'],
    baseline: {
      name: 'Pure Recursion',
      idea: '每一步嘗試取 1 位或 2 位字元遞迴解碼。',
      time: 'Exponential',
      space: 'O(n)',
    },
    optimized: {
      name: '1D DP',
      idea: '用 dp 累積前綴解碼方式，檢查 1 位與 2 位的合法性。',
      time: 'O(n)',
      space: 'O(n)',
    },
    python: String.raw`class Solution:
    def numDecodings(self, s: str) -> int:
        if not s or s[0] == '0':
            return 0

        dp = [0] * (len(s) + 1)
        dp[0] = dp[1] = 1

        for i in range(2, len(s) + 1):
            if s[i - 1] != '0':
                dp[i] += dp[i - 1]
            two = int(s[i - 2:i])
            if 10 <= two <= 26:
                dp[i] += dp[i - 2]

        return dp[-1]`,
    typescript: String.raw`function numDecodings(s: string): number {
  if (!s || s[0] === '0') return 0

  const dp = new Array(s.length + 1).fill(0)
  dp[0] = 1
  dp[1] = 1

  for (let i = 2; i <= s.length; i++) {
    if (s[i - 1] !== '0') dp[i] += dp[i - 1]
    const two = Number(s.slice(i - 2, i))
    if (two >= 10 && two <= 26) dp[i] += dp[i - 2]
  }

  return dp[s.length]
}`,
  }),
  buildProblem({
    id: 139,
    title: 'Word Break',
    difficulty: 'Medium',
    statement: '給定字串 s 與字典 wordDict，判斷 s 是否能被切成一連串字典中的單字。',
    focus: '這題關鍵在於把字串切分轉成 prefix DP。dp[i] 代表前 i 個字元是否可被合法切分。',
    dataStructureChoice: 'Hash Set 讓字典查詢 O(1)，搭配 1D DP 檢查所有切分點。',
    strategy: [
      '把 wordDict 放進 set。',
      'dp[0] = true，代表空字串可被切分。',
      '對每個 i，嘗試所有 j < i，只要 dp[j] 為真且 s[j:i] 在字典中，dp[i] 就為真。',
    ],
    example: example('s = "leetcode", wordDict = ["leet","code"]', 'true', '"leetcode" 可以切成 "leet" + "code"。'),
    techniques: ['Dynamic Programming', 'String Segmentation', 'Hash Set'],
    baseline: {
      name: 'Backtracking All Splits',
      idea: '對每個位置嘗試切或不切，遞迴搜索所有分割方式。',
      time: 'Exponential',
      space: 'O(n)',
    },
    optimized: {
      name: 'Prefix DP',
      idea: 'dp[i] 只需知道前面哪些位置可達，再檢查新的切片是否在字典中。',
      time: 'O(n^2)',
      space: 'O(n)',
    },
    python: String.raw`class Solution:
    def wordBreak(self, s: str, wordDict: list[str]) -> bool:
        words = set(wordDict)
        dp = [False] * (len(s) + 1)
        dp[0] = True

        for i in range(1, len(s) + 1):
            for j in range(i):
                if dp[j] and s[j:i] in words:
                    dp[i] = True
                    break

        return dp[-1]`,
    typescript: String.raw`function wordBreak(s: string, wordDict: string[]): boolean {
  const words = new Set(wordDict)
  const dp = new Array(s.length + 1).fill(false)
  dp[0] = true

  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && words.has(s.slice(j, i))) {
        dp[i] = true
        break
      }
    }
  }

  return dp[s.length]
}`,
  }),
  buildProblem({
    id: 279,
    title: 'Perfect Squares',
    difficulty: 'Medium',
    statement: '給定整數 n，找出最少需要幾個完全平方數相加才能得到 n。',
    focus: '這題是 unbounded knapsack / coin change 的變形。完全平方數就像硬幣面額，每個都可以重複使用。',
    dataStructureChoice: '1D DP 很自然，dp[i] 表示組成 i 所需的最少平方數數量。',
    strategy: [
      '先列出所有 <= n 的平方數。',
      '初始化 dp[0] = 0，其餘為無限大。',
      '對每個 i，嘗試所有平方數 square，更新 dp[i] = min(dp[i], dp[i - square] + 1)。',
    ],
    example: example('n = 12', '3', '12 = 4 + 4 + 4，因此最少需要 3 個完全平方數。'),
    techniques: ['Dynamic Programming', 'Coin Change Variant', '1D DP'],
    baseline: {
      name: 'Recursive Try All Squares',
      idea: '對每個 n 遞迴嘗試減去所有平方數。',
      time: 'Exponential',
      space: 'O(n)',
    },
    optimized: {
      name: 'Bottom-up DP',
      idea: '把平方數視為可重複使用的選項，自小到大建立最少步數。',
      time: 'O(n * sqrt(n))',
      space: 'O(n)',
    },
    python: String.raw`class Solution:
    def numSquares(self, n: int) -> int:
        squares = [i * i for i in range(1, int(n ** 0.5) + 1)]
        dp = [0] + [float('inf')] * n

        for total in range(1, n + 1):
            for square in squares:
                if square > total:
                    break
                dp[total] = min(dp[total], dp[total - square] + 1)

        return dp[n]`,
    typescript: String.raw`function numSquares(n: number): number {
  const squares: number[] = []
  for (let i = 1; i * i <= n; i++) squares.push(i * i)

  const dp = new Array(n + 1).fill(Infinity)
  dp[0] = 0

  for (let total = 1; total <= n; total++) {
    for (const square of squares) {
      if (square > total) break
      dp[total] = Math.min(dp[total], dp[total - square] + 1)
    }
  }

  return dp[n]
}`,
  }),
  buildProblem({
    id: 122,
    title: 'Best Time to Buy and Sell Stock II',
    difficulty: 'Medium',
    statement: '給定股價陣列 prices，你可以進行多次交易，但同一時間最多持有一股，求最大利潤。',
    focus: '這題的關鍵是看出所有上升區間都可以被拆成相鄰正差值累加，沒必要特意找完整峰谷。',
    dataStructureChoice: '只需要線性掃描累加正向價差，不需要額外資料結構。',
    strategy: [
      '掃描相鄰兩天的價格差。',
      '只要今天比昨天高，就把這段上升差值加入答案。',
      '所有正差值加總後，就是最大可實現利潤。',
    ],
    example: example('prices = [7,1,5,3,6,4]', '7', '可在 1->5 獲利 4，再在 3->6 獲利 3，總利潤 7。'),
    techniques: ['Greedy', 'Positive Delta Sum', 'Single Pass'],
    baseline: {
      name: 'DP State Machine',
      idea: '用持有/未持有兩個狀態做 DP，能解但比必要更重。',
      time: 'O(n)',
      space: 'O(1)',
    },
    optimized: {
      name: 'Accumulate Every Rise',
      idea: '把每段上升拆成相鄰正差值相加，總和就是最佳答案。',
      time: 'O(n)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        profit = 0
        for i in range(1, len(prices)):
            if prices[i] > prices[i - 1]:
                profit += prices[i] - prices[i - 1]
        return profit`,
    typescript: String.raw`function maxProfit(prices: number[]): number {
  let profit = 0
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i - 1]) {
      profit += prices[i] - prices[i - 1]
    }
  }
  return profit
}`,
  }),
  buildProblem({
    id: 135,
    title: 'Candy',
    difficulty: 'Hard',
    statement: '有 n 個小孩排成一列，每個人有評分。每人至少一顆糖，且評分較高者必須比相鄰評分較低者拿更多糖。求最少糖果數。',
    focus: '這題考貪心的雙向約束。只做單向掃描不夠，因為左邊與右邊的限制都要滿足。',
    dataStructureChoice: '陣列即可，因為每個位置只需記錄最少糖果數，再透過左右兩次掃描更新。',
    strategy: [
      '初始化每個小孩 1 顆糖。',
      '從左到右處理「比左邊高就多一顆」的限制。',
      '再從右到左處理「比右邊高就至少比右邊多一顆」，取兩者最大值。',
    ],
    example: example('ratings = [1,0,2]', '5', '糖果分配可為 [2,1,2]，總數 5。'),
    techniques: ['Greedy', 'Two Pass', 'Local Constraints'],
    baseline: {
      name: 'Repeated Relaxation',
      idea: '反覆掃描陣列直到所有相鄰限制都滿足。',
      time: 'O(n^2)',
      space: 'O(n)',
    },
    optimized: {
      name: 'Left-right Greedy Passes',
      idea: '分別處理左側與右側約束，最後每個位置取較大值。',
      time: 'O(n)',
      space: 'O(n)',
    },
    python: String.raw`class Solution:
    def candy(self, ratings: list[int]) -> int:
        n = len(ratings)
        candies = [1] * n

        for i in range(1, n):
            if ratings[i] > ratings[i - 1]:
                candies[i] = candies[i - 1] + 1

        for i in range(n - 2, -1, -1):
            if ratings[i] > ratings[i + 1]:
                candies[i] = max(candies[i], candies[i + 1] + 1)

        return sum(candies)`,
    typescript: String.raw`function candy(ratings: number[]): number {
  const candies = new Array(ratings.length).fill(1)

  for (let i = 1; i < ratings.length; i++) {
    if (ratings[i] > ratings[i - 1]) candies[i] = candies[i - 1] + 1
  }

  for (let i = ratings.length - 2; i >= 0; i--) {
    if (ratings[i] > ratings[i + 1]) {
      candies[i] = Math.max(candies[i], candies[i + 1] + 1)
    }
  }

  return candies.reduce((sum, value) => sum + value, 0)
}`,
  }),
  buildProblem({
    id: 376,
    title: 'Wiggle Subsequence',
    difficulty: 'Medium',
    statement: '找出最長 wiggle subsequence 的長度，相鄰差值需正負交替。',
    focus: '這題的重點在於保留有效轉折點。當斜率方向沒有改變時，中間點其實不重要。',
    dataStructureChoice: '只要用兩個狀態 up/down 記錄目前以正差或負差結尾的最長長度即可。',
    strategy: [
      'up 表示最後一段是上升的最長 wiggle 長度，down 表示最後一段是下降。',
      '若 nums[i] > nums[i-1]，就能把 down 延伸成 up。',
      '若 nums[i] < nums[i-1]，就能把 up 延伸成 down。',
    ],
    example: example('nums = [1,7,4,9,2,5]', '6', '整段本身就是合法的 wiggle sequence。'),
    techniques: ['Greedy', 'State Compression', 'Alternating Pattern'],
    baseline: {
      name: 'DP on All Prefixes',
      idea: '對每個位置枚舉前一個選擇，找最佳 wiggle 長度。',
      time: 'O(n^2)',
      space: 'O(n)',
    },
    optimized: {
      name: 'Greedy Two-state Update',
      idea: '只保留 up/down 兩種狀態，遇到方向改變就更新。',
      time: 'O(n)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def wiggleMaxLength(self, nums: list[int]) -> int:
        if not nums:
            return 0
        up = down = 1
        for i in range(1, len(nums)):
            if nums[i] > nums[i - 1]:
                up = down + 1
            elif nums[i] < nums[i - 1]:
                down = up + 1
        return max(up, down)`,
    typescript: String.raw`function wiggleMaxLength(nums: number[]): number {
  if (nums.length === 0) return 0
  let up = 1
  let down = 1

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > nums[i - 1]) up = down + 1
    else if (nums[i] < nums[i - 1]) down = up + 1
  }

  return Math.max(up, down)
}`,
  }),
  buildProblem({
    id: 763,
    title: 'Partition Labels',
    difficulty: 'Medium',
    statement: '把字串 s 切成盡量多段，使每個字元最多只出現在其中一段，回傳每段長度。',
    focus: '這題的關鍵是先知道每個字元最後出現在哪，然後掃描時維護當前分段必須覆蓋到的最遠右界。',
    dataStructureChoice: 'Hash Map 記錄每個字元最後位置最直接，再用一次線性掃描切段。',
    strategy: [
      '先記錄每個字元在字串中的最後索引。',
      '從左到右掃描時，用 end 維護目前分段必須延伸到的最遠位置。',
      '當索引走到 end，就代表這段可以安全切開。',
    ],
    example: example('s = "ababcbacadefegdehijhklij"', '[9,7,8]', '每段都完整包住其內所有字元的最後出現位置。'),
    techniques: ['Greedy', 'Last Occurrence', 'Interval Expansion'],
    baseline: {
      name: 'Try Every Cut Position',
      idea: '枚舉切點後檢查左右段是否違反字元跨段條件。',
      time: 'O(n^2)',
      space: 'O(1)',
    },
    optimized: {
      name: 'Expand to Last Occurrence',
      idea: '每段都擴張到當前字元群的最遠最後位置，走到那裡就切開。',
      time: 'O(n)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def partitionLabels(self, s: str) -> list[int]:
        last = {ch: i for i, ch in enumerate(s)}
        result = []
        start = end = 0

        for i, ch in enumerate(s):
            end = max(end, last[ch])
            if i == end:
                result.append(end - start + 1)
                start = i + 1

        return result`,
    typescript: String.raw`function partitionLabels(s: string): number[] {
  const last = new Map<string, number>()
  for (let i = 0; i < s.length; i++) last.set(s[i], i)

  const result: number[] = []
  let start = 0
  let end = 0

  for (let i = 0; i < s.length; i++) {
    end = Math.max(end, last.get(s[i])!)
    if (i === end) {
      result.push(end - start + 1)
      start = i + 1
    }
  }

  return result
}`,
  }),
  buildProblem({
    id: 1029,
    title: 'Two City Scheduling',
    difficulty: 'Medium',
    statement: '有 2n 人要飛去 A、B 兩座城市，每城恰好 n 人，costs[i] = [aCost, bCost]，求最小總成本。',
    focus: '這題要抓住「送去 A 相對於送去 B 的差值」。排序差值後，最划算送 A 的前 n 個人去 A，其餘去 B。',
    dataStructureChoice: '排序陣列即可，不需要更重的結構。',
    strategy: [
      '把每個人的差值定義為 aCost - bCost。',
      '依差值從小到大排序，差值越小代表送 A 越划算。',
      '前 n 個送 A，後 n 個送 B，總成本最小。',
    ],
    example: example('costs = [[10,20],[30,200],[400,50],[30,20]]', '110', '最佳分配是前兩人去 A、後兩人去 B，總成本 110。'),
    techniques: ['Greedy', 'Sorting by Delta', 'Exchange Argument'],
    baseline: {
      name: 'Backtracking Assign Cities',
      idea: '逐人決定去 A 或 B，並維持每城人數限制。',
      time: 'Exponential',
      space: 'O(n)',
    },
    optimized: {
      name: 'Sort by Cost Difference',
      idea: '以 aCost - bCost 排序後，前半送 A、後半送 B。',
      time: 'O(n log n)',
      space: 'O(1) to O(n)',
    },
    python: String.raw`class Solution:
    def twoCitySchedCost(self, costs: list[list[int]]) -> int:
        costs.sort(key=lambda pair: pair[0] - pair[1])
        n = len(costs) // 2
        total = 0
        for i in range(n):
            total += costs[i][0]
        for i in range(n, len(costs)):
            total += costs[i][1]
        return total`,
    typescript: String.raw`function twoCitySchedCost(costs: number[][]): number {
  costs.sort((a, b) => (a[0] - a[1]) - (b[0] - b[1]))
  const n = costs.length / 2
  let total = 0

  for (let i = 0; i < n; i++) total += costs[i][0]
  for (let i = n; i < costs.length; i++) total += costs[i][1]

  return total
}`,
  }),
  buildProblem({
    id: 190,
    title: 'Reverse Bits',
    difficulty: 'Easy',
    statement: '給定 32 位元無號整數 n，請回傳其位元反轉後的值。',
    focus: '這題在練位元運算的移位直覺。每讀一個最低位元，就把答案左移一格再補上它。',
    dataStructureChoice: '不需要額外結構，只要位元運算與整數累積即可。',
    strategy: [
      '初始化 result = 0。',
      '重複 32 次：把 result 左移一位，再把 n 的最低位元加進來。',
      '每輪把 n 右移一位，直到 32 位處理完。',
    ],
    example: example('n = 00000010100101000001111010011100', '964176192', '位元順序完全反轉後得到新數值。'),
    techniques: ['Bit Manipulation', 'Shift', 'Mask'],
    baseline: {
      name: 'Convert to Binary String',
      idea: '把數字轉成 32 位字串後反轉，再轉回整數。',
      time: 'O(32)',
      space: 'O(32)',
    },
    optimized: {
      name: 'Bit-by-bit Reverse',
      idea: '逐位讀取 n 的最低位元並搬到 result 的相反方向。',
      time: 'O(32)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def reverseBits(self, n: int) -> int:
        result = 0
        for _ in range(32):
            result = (result << 1) | (n & 1)
            n >>= 1
        return result`,
    typescript: String.raw`function reverseBits(n: number): number {
  let result = 0
  for (let i = 0; i < 32; i++) {
    result = (result << 1) | (n & 1)
    n >>>= 1
  }
  return result >>> 0
}`,
  }),
  buildProblem({
    id: 231,
    title: 'Power of Two',
    difficulty: 'Easy',
    statement: '判斷整數 n 是否為 2 的冪次。',
    focus: '2 的冪在二進位中只有一個 1。這題在考你是否知道 `n & (n - 1)` 會消掉最右邊那個 1。',
    dataStructureChoice: '位元運算最精簡，不需要其他資料結構。',
    strategy: [
      '先排除 n <= 0 的情況。',
      '若 n 是 2 的冪，二進位只有一個 1。',
      '因此檢查 `n & (n - 1)` 是否為 0 即可。',
    ],
    example: example('n = 16', 'true', '16 的二進位是 10000，只含一個 1。'),
    techniques: ['Bit Manipulation', 'Power of Two', 'n & (n-1)'],
    baseline: {
      name: 'Repeated Division',
      idea: '持續除以 2，看最後能否剛好變成 1。',
      time: 'O(log n)',
      space: 'O(1)',
    },
    optimized: {
      name: 'Single-bit Check',
      idea: '正整數若只有一個 bit 為 1，就必定是 2 的冪。',
      time: 'O(1)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def isPowerOfTwo(self, n: int) -> bool:
        return n > 0 and (n & (n - 1)) == 0`,
    typescript: String.raw`function isPowerOfTwo(n: number): boolean {
  return n > 0 && (n & (n - 1)) === 0
}`,
  }),
  buildProblem({
    id: 260,
    title: 'Single Number III',
    difficulty: 'Medium',
    statement: '陣列中恰有兩個數只出現一次，其餘都出現兩次，請找出這兩個數。',
    focus: '這題核心是用 XOR 先得到兩個單獨數的差異位元，再依該位元把陣列分成兩群，各自 XOR。',
    dataStructureChoice: '位元運算最合適，因為重複兩次的元素會在 XOR 中互相抵消。',
    strategy: [
      '先把所有數字 XOR 起來，得到 xorAll = a ^ b。',
      '找出 xorAll 中任一個為 1 的位元，用它區分 a 與 b。',
      '依該位元把所有數字分兩組，各自 XOR 後就能得到兩個答案。',
    ],
    example: example('nums = [1,2,1,3,2,5]', '[3,5]', '3 與 5 是兩個只出現一次的數。'),
    techniques: ['Bit Manipulation', 'XOR Partition', 'Rightmost Set Bit'],
    baseline: {
      name: 'Hash Count',
      idea: '用 Hash Map 計數後找出出現一次的兩個數。',
      time: 'O(n)',
      space: 'O(n)',
    },
    optimized: {
      name: 'XOR + Group Split',
      idea: '用 XOR 找到兩數差異位元，再把陣列分群後分別抵消。',
      time: 'O(n)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def singleNumber(self, nums: list[int]) -> list[int]:
        xor_all = 0
        for num in nums:
            xor_all ^= num

        diff = xor_all & -xor_all
        a = b = 0
        for num in nums:
            if num & diff:
                a ^= num
            else:
                b ^= num

        return [a, b]`,
    typescript: String.raw`function singleNumber(nums: number[]): number[] {
  let xorAll = 0
  for (const num of nums) xorAll ^= num

  const diff = xorAll & -xorAll
  let a = 0
  let b = 0

  for (const num of nums) {
    if (num & diff) a ^= num
    else b ^= num
  }

  return [a, b]
}`,
  }),
  buildProblem({
    id: 389,
    title: 'Find the Difference',
    difficulty: 'Easy',
    statement: '字串 t 由字串 s 隨機重排後再多加一個字元組成，請找出那個多出來的字元。',
    focus: '這題是 XOR 抵消的超經典小題。相同字元兩兩抵消後，留下的就是額外字元。',
    dataStructureChoice: '位元/XOR 或計數都能做；XOR 最精簡。',
    strategy: [
      '把 s 與 t 中所有字元的 charCode 全部 XOR 在一起。',
      '成對出現的字元會互相抵消。',
      '最後剩下的數值轉回字元即為答案。',
    ],
    example: example('s = "abcd", t = "abcde"', '"e"', '只有 e 沒有成對抵消。'),
    techniques: ['Bit Manipulation', 'XOR', 'Character Code'],
    baseline: {
      name: 'Frequency Count',
      idea: '統計 s 與 t 的字元數量差異。',
      time: 'O(n)',
      space: 'O(k)',
    },
    optimized: {
      name: 'XOR Cancellation',
      idea: '把兩字串字元全部 XOR，成對字元會被抵消。',
      time: 'O(n)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def findTheDifference(self, s: str, t: str) -> str:
        value = 0
        for ch in s + t:
            value ^= ord(ch)
        return chr(value)`,
    typescript: String.raw`function findTheDifference(s: string, t: string): string {
  let value = 0
  for (const ch of s + t) value ^= ch.charCodeAt(0)
  return String.fromCharCode(value)
}`,
  }),
  buildProblem({
    id: 461,
    title: 'Hamming Distance',
    difficulty: 'Easy',
    statement: '給定整數 x 與 y，回傳它們二進位表示中對應位元不同的數量。',
    focus: '這題本質是先 XOR，再數 1。XOR 會把不同的位元標成 1。',
    dataStructureChoice: '位元運算即可，若想更快可用 Brian Kernighan 技巧每次消掉一個 1。',
    strategy: [
      '先計算 diff = x ^ y。',
      '重複執行 diff &= diff - 1，每次消掉最右邊的一個 1。',
      '執行次數就是 Hamming distance。',
    ],
    example: example('x = 1, y = 4', '2', '1 = 001, 4 = 100，兩者有兩個位元不同。'),
    techniques: ['Bit Manipulation', 'XOR', "Brian Kernighan"],
    baseline: {
      name: 'Shift and Count',
      idea: '逐位檢查 diff 的最低位是否為 1。',
      time: 'O(number of bits)',
      space: 'O(1)',
    },
    optimized: {
      name: 'Remove Lowest Set Bit',
      idea: '每次把一個 1 消掉，迴圈次數等於 1 的個數。',
      time: 'O(number of set bits)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def hammingDistance(self, x: int, y: int) -> int:
        diff = x ^ y
        count = 0
        while diff:
            diff &= diff - 1
            count += 1
        return count`,
    typescript: String.raw`function hammingDistance(x: number, y: number): number {
  let diff = x ^ y
  let count = 0
  while (diff !== 0) {
    diff &= diff - 1
    count++
  }
  return count
}`,
  }),
  buildProblem({
    id: 148,
    title: 'Sort List',
    difficulty: 'Medium',
    statement: '給定 linked list，請在 O(n log n) 時間內將其排序。',
    focus: 'linked list 不適合 random access，因此 merge sort 是天然選擇。關鍵是用快慢指標切半，再原地 merge。',
    dataStructureChoice: 'Linked List + Merge Sort 最合適，因為 merge 可在指標層完成，不需要額外陣列搬移。',
    strategy: [
      '用快慢指標找到 linked list 中點並切成左右兩半。',
      '遞迴排序左右子串列。',
      '把兩條已排序 linked list 做 merge，回傳新的 head。',
    ],
    example: example('head = [4,2,1,3]', '[1,2,3,4]', 'merge sort 會把 list 分治後再合併成排序結果。'),
    techniques: ['Merge Sort', 'Linked List', 'Fast/Slow Pointer'],
    baseline: {
      name: 'Copy to Array and Sort',
      idea: '先把 linked list 轉成陣列排序，再重建 linked list。',
      time: 'O(n log n)',
      space: 'O(n)',
    },
    optimized: {
      name: 'Linked-list Merge Sort',
      idea: '直接在 linked list 上分治與合併，符合題目時空要求。',
      time: 'O(n log n)',
      space: 'O(log n)',
    },
    python: String.raw`class Solution:
    def sortList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        if not head or not head.next:
            return head

        slow, fast = head, head.next
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next

        mid = slow.next
        slow.next = None

        left = self.sortList(head)
        right = self.sortList(mid)
        return self.merge(left, right)

    def merge(self, a: Optional[ListNode], b: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode(0)
        tail = dummy
        while a and b:
            if a.val < b.val:
                tail.next, a = a, a.next
            else:
                tail.next, b = b, b.next
            tail = tail.next
        tail.next = a or b
        return dummy.next`,
    typescript: String.raw`function sortList(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return head

  let slow = head
  let fast = head.next
  while (fast && fast.next) {
    slow = slow.next!
    fast = fast.next.next
  }

  const mid = slow.next
  slow.next = null

  return merge(sortList(head), sortList(mid))
}

function merge(a: ListNode | null, b: ListNode | null): ListNode | null {
  const dummy = new ListNode(0)
  let tail = dummy

  while (a && b) {
    if (a.val < b.val) {
      tail.next = a
      a = a.next
    } else {
      tail.next = b
      b = b.next
    }
    tail = tail.next
  }

  tail.next = a ?? b
  return dummy.next
}`,
  }),
  buildProblem({
    id: 274,
    title: 'H-Index',
    difficulty: 'Medium',
    statement: '給定 citations，求研究者的 h-index。',
    focus: '排序後你只需要判斷「有多少篇論文的引用數至少大於等於目前候選 h」。',
    dataStructureChoice: '排序是最直接的做法，從高引用往低看即可快速判斷最大 h。',
    strategy: [
      '把 citations 由大到小排序。',
      '依序檢查第 i 篇論文的引用數是否仍 >= i + 1。',
      '能維持多久，h 就是多少。',
    ],
    example: example('citations = [3,0,6,1,5]', '3', '至少有 3 篇論文引用數 >= 3。'),
    techniques: ['Sorting', 'Greedy Check', 'Index Interpretation'],
    baseline: {
      name: 'Try Every h',
      idea: '從 0 到 n 枚舉每個 h，計算有多少論文引用數至少為 h。',
      time: 'O(n^2)',
      space: 'O(1)',
    },
    optimized: {
      name: 'Sort Descending',
      idea: '排序後第 i 個位置自然對應候選 h = i + 1。',
      time: 'O(n log n)',
      space: 'O(1) to O(n)',
    },
    python: String.raw`class Solution:
    def hIndex(self, citations: list[int]) -> int:
        citations.sort(reverse=True)
        h = 0
        for i, citation in enumerate(citations, start=1):
            if citation >= i:
                h = i
            else:
                break
        return h`,
    typescript: String.raw`function hIndex(citations: number[]): number {
  citations.sort((a, b) => b - a)
  let h = 0
  for (let i = 0; i < citations.length; i++) {
    if (citations[i] >= i + 1) h = i + 1
    else break
  }
  return h
}`,
  }),
  buildProblem({
    id: 451,
    title: 'Sort Characters By Frequency',
    difficulty: 'Medium',
    statement: '把字串 s 中的字元依出現頻率由高到低排序後回傳。',
    focus: '這題是 hash counting 搭配排序。先算頻率，再依頻率重建字串。',
    dataStructureChoice: 'Hash Map 用來計數，之後排序 map entries 或用 bucket 都可以。',
    strategy: [
      '先統計每個字元出現次數。',
      '依頻率由高到低排序所有字元。',
      '把每個字元重複 count 次串接進答案。',
    ],
    example: example('s = "tree"', '"eert"', 'e 出現 2 次，因此會排在最前面。'),
    techniques: ['Hash Map', 'Sorting', 'Frequency Count'],
    baseline: {
      name: 'Repeatedly Pick Highest Frequency',
      idea: '每次重新掃描 map 找最高頻字元後拼接到答案。',
      time: 'O(k^2)',
      space: 'O(k)',
    },
    optimized: {
      name: 'Count then Sort Entries',
      idea: '先做一次計數，再依頻率排序條目重建字串。',
      time: 'O(n + k log k)',
      space: 'O(k)',
    },
    python: String.raw`class Solution:
    def frequencySort(self, s: str) -> str:
        counts = Counter(s)
        return ''.join(ch * freq for ch, freq in sorted(counts.items(), key=lambda item: item[1], reverse=True))`,
    typescript: String.raw`function frequencySort(s: string): string {
  const counts = new Map<string, number>()
  for (const ch of s) counts.set(ch, (counts.get(ch) ?? 0) + 1)

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([ch, freq]) => ch.repeat(freq))
    .join('')
}`,
  }),
  buildProblem({
    id: 905,
    title: 'Sort Array By Parity',
    difficulty: 'Easy',
    statement: '把陣列中的偶數放到前面、奇數放到後面，回傳任一符合條件的結果。',
    focus: '這題是對向雙指標分區的基本題。只要左邊遇到奇數、右邊遇到偶數，就交換。',
    dataStructureChoice: 'Two pointers in-place partition 最省空間，也最接近 quicksort partition 的思路。',
    strategy: [
      'left 從前、right 從後開始。',
      '若左邊已是偶數就 left++，若右邊已是奇數就 right--。',
      '當左奇右偶時交換兩者。',
    ],
    example: example('nums = [3,1,2,4]', '[4,2,1,3]', '只要求偶數在前、奇數在後，不要求穩定順序。'),
    techniques: ['Two Pointers', 'Partition', 'Parity'],
    baseline: {
      name: 'Build Two Arrays',
      idea: '先收集所有偶數，再收集所有奇數。',
      time: 'O(n)',
      space: 'O(n)',
    },
    optimized: {
      name: 'In-place Partition',
      idea: '左右指標往中間逼近，遇到錯位的奇偶元素就交換。',
      time: 'O(n)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def sortArrayByParity(self, nums: list[int]) -> list[int]:
        left, right = 0, len(nums) - 1
        while left < right:
            if nums[left] % 2 == 0:
                left += 1
            elif nums[right] % 2 == 1:
                right -= 1
            else:
                nums[left], nums[right] = nums[right], nums[left]
        return nums`,
    typescript: String.raw`function sortArrayByParity(nums: number[]): number[] {
  let left = 0
  let right = nums.length - 1

  while (left < right) {
    if (nums[left] % 2 === 0) left++
    else if (nums[right] % 2 === 1) right--
    else [nums[left], nums[right]] = [nums[right], nums[left]]
  }

  return nums
}`,
  }),
  buildProblem({
    id: 1122,
    title: 'Relative Sort Array',
    difficulty: 'Easy',
    statement: '依 arr2 中元素的相對順序排序 arr1，其餘未出現在 arr2 的元素則依升序放在後面。',
    focus: '這題關鍵在於自訂排序規則。要先知道 arr2 中元素的優先順序，再處理沒出現過的尾段。',
    dataStructureChoice: 'Hash Map 可以記錄 arr2 中每個值的排序優先權，再搭配自訂 comparator。',
    strategy: [
      '先建立 value -> rank 的映射。',
      '排序 arr1 時，若兩個值都在 arr2 中，依 rank 比較。',
      '若其中有值不在 arr2 中，就把它們放到尾段並以自然大小排序。',
    ],
    example: example('arr1 = [2,3,1,3,2,4,6,7,9,2,19], arr2 = [2,1,4,3,9,6]', '[2,2,2,1,4,3,3,9,6,7,19]', 'arr2 中有定義順序的值必須先依照該順序排列。'),
    techniques: ['Custom Sort', 'Hash Map', 'Comparator'],
    baseline: {
      name: 'Repeated Count by arr2 Order',
      idea: '先對 arr2 中的每個值在 arr1 內反覆搜尋並收集，最後再排序剩餘元素。',
      time: 'O(n * m)',
      space: 'O(n)',
    },
    optimized: {
      name: 'Rank Map + Custom Comparator',
      idea: '為 arr2 建立順序映射，直接對 arr1 做一次自訂排序。',
      time: 'O(n log n)',
      space: 'O(m)',
    },
    python: String.raw`class Solution:
    def relativeSortArray(self, arr1: list[int], arr2: list[int]) -> list[int]:
        rank = {num: i for i, num in enumerate(arr2)}
        return sorted(arr1, key=lambda x: (rank.get(x, len(arr2)), x))`,
    typescript: String.raw`function relativeSortArray(arr1: number[], arr2: number[]): number[] {
  const rank = new Map<number, number>()
  arr2.forEach((num, index) => rank.set(num, index))

  return arr1.sort((a, b) => {
    const rankA = rank.has(a) ? rank.get(a)! : arr2.length
    const rankB = rank.has(b) ? rank.get(b)! : arr2.length
    if (rankA !== rankB) return rankA - rankB
    return a - b
  })
}`,
  }),
  buildProblem({
    id: 1046,
    title: 'Last Stone Weight',
    difficulty: 'Easy',
    statement: '每回合取出最重的兩顆石頭互撞，若重量不同則留下差值，最後回傳剩餘石頭重量。',
    focus: '這題是 max-heap 的入門題。每次都要取出目前最大的兩個元素，priority queue 的需求非常明確。',
    dataStructureChoice: 'Max-heap 最適合，因為要重複執行「取最大兩個、再放回差值」的操作。',
    strategy: [
      '先把所有石頭放進 max-heap。',
      '每回合取出兩顆最重石頭 y >= x。',
      '若 y != x，就把 y - x 放回 heap，直到 heap 大小 <= 1。',
    ],
    example: example('stones = [2,7,4,1,8,1]', '1', '8 和 7 撞成 1，持續重複後最後剩 1。'),
    techniques: ['Heap', 'Priority Queue', 'Repeated Maximum'],
    baseline: {
      name: 'Sort Every Round',
      idea: '每輪都重新排序並取出最大的兩顆石頭。',
      time: 'O(n^2 log n)',
      space: 'O(1)',
    },
    optimized: {
      name: 'Max Heap Simulation',
      idea: '用 max-heap 反覆取最大兩顆石頭並放回差值。',
      time: 'O(n log n)',
      space: 'O(n)',
    },
    python: String.raw`import heapq

class Solution:
    def lastStoneWeight(self, stones: list[int]) -> int:
        heap = [-stone for stone in stones]
        heapq.heapify(heap)

        while len(heap) > 1:
            y = -heapq.heappop(heap)
            x = -heapq.heappop(heap)
            if y != x:
                heapq.heappush(heap, -(y - x))

        return -heap[0] if heap else 0`,
    typescript: String.raw`function lastStoneWeight(stones: number[]): number {
  const pq = new MaxPriorityQueue<number>()
  for (const stone of stones) pq.enqueue(stone)

  while (pq.size() > 1) {
    const y = pq.dequeue().element
    const x = pq.dequeue().element
    if (y !== x) pq.enqueue(y - x)
  }

  return pq.isEmpty() ? 0 : pq.front().element
}`,
  }),
  buildProblem({
    id: 973,
    title: 'K Closest Points to Origin',
    difficulty: 'Medium',
    statement: '給定 points 與整數 k，回傳距離原點最近的 k 個點。',
    focus: '這題核心是 Top-K。若只要前 k 個最近點，不必完整排序所有資料，max-heap 大小維持在 k 即可。',
    dataStructureChoice: '大小為 k 的 max-heap 很適合，因為當 heap 超過 k 時，只要踢掉目前最遠的點。',
    strategy: [
      '逐點計算平方距離 dist = x*x + y*y。',
      '把點與距離放進 max-heap，heap 大小超過 k 就移除最遠點。',
      '最後 heap 中留下的就是答案。',
    ],
    example: example('points = [[1,3],[-2,2]], k = 1', '[[-2,2]]', '[-2,2] 距離原點平方為 8，比 [1,3] 的 10 更近。'),
    techniques: ['Heap', 'Top-K', 'Distance Square'],
    baseline: {
      name: 'Sort All Points',
      idea: '計算每個點到原點距離後完整排序，再取前 k 個。',
      time: 'O(n log n)',
      space: 'O(n)',
    },
    optimized: {
      name: 'Size-k Max Heap',
      idea: '只維護目前最接近的 k 個點，超過時移除最遠者。',
      time: 'O(n log k)',
      space: 'O(k)',
    },
    python: String.raw`import heapq

class Solution:
    def kClosest(self, points: list[list[int]], k: int) -> list[list[int]]:
        heap = []
        for x, y in points:
            dist = x * x + y * y
            heapq.heappush(heap, (-dist, [x, y]))
            if len(heap) > k:
                heapq.heappop(heap)
        return [point for _, point in heap]`,
    typescript: String.raw`function kClosest(points: number[][], k: number): number[][] {
  const pq = new MaxPriorityQueue<{ point: number[]; dist: number }>({
    priority: item => item.dist,
  })

  for (const point of points) {
    const dist = point[0] * point[0] + point[1] * point[1]
    pq.enqueue({ point, dist })
    if (pq.size() > k) pq.dequeue()
  }

  const result: number[][] = []
  while (!pq.isEmpty()) result.push(pq.dequeue().element.point)
  return result
}`,
  }),
  buildProblem({
    id: 1167,
    title: 'Minimum Cost to Connect Sticks',
    difficulty: 'Medium',
    statement: '每次可把兩根木棍合併，成本是兩者長度和；請回傳把所有木棍連成一根的最小總成本。',
    focus: '這題和 Huffman coding 同型。每次優先合併最短的兩根，才能避免大成本被重複累加。',
    dataStructureChoice: 'Min-heap 是標準解，因為要反覆取出最短兩根木棍做合併。',
    strategy: [
      '把所有木棍放進 min-heap。',
      '每次取出最小的兩根 a、b，成本加上 a + b。',
      '把新木棍 a + b 放回 heap，直到只剩一根。',
    ],
    example: example('sticks = [2,4,3]', '14', '先合 2 和 3 成 5，再合 4 和 5 成 9，總成本 14。'),
    techniques: ['Heap', 'Greedy', 'Huffman Pattern'],
    baseline: {
      name: 'Sort Every Merge',
      idea: '每輪排序後取最短兩根合併。',
      time: 'O(n^2 log n)',
      space: 'O(1)',
    },
    optimized: {
      name: 'Min Heap Merge',
      idea: '用 min-heap 反覆取最短兩根，維持總成本最小。',
      time: 'O(n log n)',
      space: 'O(n)',
    },
    python: String.raw`import heapq

class Solution:
    def connectSticks(self, sticks: list[int]) -> int:
        heapq.heapify(sticks)
        cost = 0

        while len(sticks) > 1:
            merged = heapq.heappop(sticks) + heapq.heappop(sticks)
            cost += merged
            heapq.heappush(sticks, merged)

        return cost`,
    typescript: String.raw`function connectSticks(sticks: number[]): number {
  const pq = new MinPriorityQueue<number>()
  for (const stick of sticks) pq.enqueue(stick)

  let cost = 0
  while (pq.size() > 1) {
    const merged = pq.dequeue().element + pq.dequeue().element
    cost += merged
    pq.enqueue(merged)
  }

  return cost
}`,
  }),
  buildProblem({
    id: 1962,
    title: 'Remove Stones to Minimize the Total',
    difficulty: 'Medium',
    statement: '有 piles 堆石頭，可執行 k 次操作，每次選一堆移除 floor(pile / 2) 顆，求操作後最小總數。',
    focus: '每次減少最多石頭的做法，就是永遠對目前最大的堆操作。這是典型 max-heap greedy。',
    dataStructureChoice: 'Max-heap 可快速取得目前最大 pile，並在更新後重新放回。',
    strategy: [
      '把所有 piles 放進 max-heap。',
      '重複 k 次：取出最大 pile，減少 floor(pile / 2) 後再放回。',
      '最後把 heap 中所有值加總。',
    ],
    example: example('piles = [5,4,9], k = 2', '12', '先處理 9 變成 5，再處理 5 變成 3，總和為 12。'),
    techniques: ['Heap', 'Greedy', 'Repeated Max Update'],
    baseline: {
      name: 'Resort After Every Operation',
      idea: '每輪都重新排序找最大堆。',
      time: 'O(k n log n)',
      space: 'O(1)',
    },
    optimized: {
      name: 'Max Heap Reduction',
      idea: '用 max-heap 持續對最大堆做操作，維持每輪最佳選擇。',
      time: 'O((n + k) log n)',
      space: 'O(n)',
    },
    python: String.raw`import heapq

class Solution:
    def minStoneSum(self, piles: list[int], k: int) -> int:
        heap = [-pile for pile in piles]
        heapq.heapify(heap)

        for _ in range(k):
            pile = -heapq.heappop(heap)
            pile -= pile // 2
            heapq.heappush(heap, -pile)

        return -sum(heap)`,
    typescript: String.raw`function minStoneSum(piles: number[], k: number): number {
  const pq = new MaxPriorityQueue<number>()
  for (const pile of piles) pq.enqueue(pile)

  for (let i = 0; i < k; i++) {
    const pile = pq.dequeue().element
    pq.enqueue(pile - Math.floor(pile / 2))
  }

  let total = 0
  while (!pq.isEmpty()) total += pq.dequeue().element
  return total
}`,
  }),
  buildProblem({
    id: 2530,
    title: 'Maximal Score After Applying K Operations',
    difficulty: 'Medium',
    statement: '有整數陣列 nums，可執行 k 次：每次取最大值加到分數中，並把該值替換為 ceil(value / 3)。求最大總分。',
    focus: '每次都應選目前最大值，因為分數是立即累加。替換後的新值仍可能繼續有價值，因此需要重複插回。',
    dataStructureChoice: 'Max-heap 最自然，因為每步都要拿最大值並更新後再放回。',
    strategy: [
      '把所有 nums 放入 max-heap。',
      '重複 k 次：取出最大值 value，把它加到答案。',
      '把 ceil(value / 3) 放回 heap 供後續操作。',
    ],
    example: example('nums = [10,10,10,10,10], k = 5', '50', '每次都取 10，總分可達 50。'),
    techniques: ['Heap', 'Greedy', 'Repeated Best Choice'],
    baseline: {
      name: 'Scan for Max Each Round',
      idea: '每輪線性掃描找到最大值並更新。',
      time: 'O(kn)',
      space: 'O(1)',
    },
    optimized: {
      name: 'Max Heap',
      idea: '用 max-heap 快速重複取得最大值並回填更新後的值。',
      time: 'O((n + k) log n)',
      space: 'O(n)',
    },
    python: String.raw`import heapq
import math

class Solution:
    def maxKelements(self, nums: list[int], k: int) -> int:
        heap = [-num for num in nums]
        heapq.heapify(heap)
        score = 0

        for _ in range(k):
            value = -heapq.heappop(heap)
            score += value
            heapq.heappush(heap, -math.ceil(value / 3))

        return score`,
    typescript: String.raw`function maxKelements(nums: number[], k: number): number {
  const pq = new MaxPriorityQueue<number>()
  for (const num of nums) pq.enqueue(num)

  let score = 0
  for (let i = 0; i < k; i++) {
    const value = pq.dequeue().element
    score += value
    pq.enqueue(Math.ceil(value / 3))
  }

  return score
}`,
  }),
  buildProblem({
    id: 261,
    title: 'Graph Valid Tree',
    difficulty: 'Medium',
    statement: '給定 n 個節點與無向邊 edges，判斷這張圖是否為一棵合法樹。',
    focus: '一張無向圖是樹需要同時滿足兩件事：無環且連通。Union-Find 很適合檢查環，而邊數也可快速幫你排除不可能情況。',
    dataStructureChoice: 'Union-Find 可在線性時間內檢查是否出現 cycle；再搭配邊數必須等於 n - 1 的必要條件，就能判定是否為樹。',
    strategy: [
      '若邊數不是 n - 1，直接不可能是樹。',
      '依序 union 每條邊，若兩端已在同一集合中，代表形成 cycle。',
      '若沒有 cycle 且邊數正好為 n - 1，就一定連通並形成樹。',
    ],
    example: example('n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]', 'true', '邊數為 4 = n - 1，且 union 過程中沒有環。'),
    techniques: ['Union-Find', 'Cycle Detection', 'Tree Property'],
    baseline: {
      name: 'DFS Connectivity + Cycle Check',
      idea: '用 DFS 檢查是否連通並同時追蹤父節點避免假環。',
      time: 'O(V + E)',
      space: 'O(V)',
    },
    optimized: {
      name: 'Union-Find with Edge Count',
      idea: '先用邊數過濾，再用 Union-Find 檢查是否有 cycle。',
      time: 'O(E α(V))',
      space: 'O(V)',
    },
    python: String.raw`class Solution:
    def validTree(self, n: int, edges: list[list[int]]) -> bool:
        if len(edges) != n - 1:
            return False

        parent = list(range(n))

        def find(x: int) -> int:
            if parent[x] != x:
                parent[x] = find(parent[x])
            return parent[x]

        for a, b in edges:
            pa, pb = find(a), find(b)
            if pa == pb:
                return False
            parent[pa] = pb

        return True`,
    typescript: String.raw`function validTree(n: number, edges: number[][]): boolean {
  if (edges.length !== n - 1) return false

  const parent = Array.from({ length: n }, (_, i) => i)

  const find = (x: number): number => {
    if (parent[x] !== x) parent[x] = find(parent[x])
    return parent[x]
  }

  for (const [a, b] of edges) {
    const pa = find(a)
    const pb = find(b)
    if (pa === pb) return false
    parent[pa] = pb
  }

  return true
}`,
  }),
  buildProblem({
    id: 323,
    title: 'Number of Connected Components in an Undirected Graph',
    difficulty: 'Medium',
    statement: '給定 n 個節點與無向邊 edges，求圖中有幾個連通元件。',
    focus: 'Union-Find 的典型題。每成功合併兩個不同集合，連通元件數就減一。',
    dataStructureChoice: 'Union-Find 很自然，因為題目本質是在動態合併連通塊並計數。',
    strategy: [
      '初始每個節點都是獨立元件，components = n。',
      '對每條邊做 union，若兩端原本屬於不同集合，components--。',
      '最後 components 就是答案。',
    ],
    example: example('n = 5, edges = [[0,1],[1,2],[3,4]]', '2', '節點 {0,1,2} 與 {3,4} 形成兩個連通元件。'),
    techniques: ['Union-Find', 'Connected Components', 'Disjoint Set'],
    baseline: {
      name: 'Build Graph and DFS',
      idea: '先建 adjacency list，再從每個未訪問節點啟動 DFS。',
      time: 'O(V + E)',
      space: 'O(V + E)',
    },
    optimized: {
      name: 'Union-Find Counting',
      idea: '每次成功合併不同集合就減少一個元件。',
      time: 'O(E α(V))',
      space: 'O(V)',
    },
    python: String.raw`class Solution:
    def countComponents(self, n: int, edges: list[list[int]]) -> int:
        parent = list(range(n))
        components = n

        def find(x: int) -> int:
            if parent[x] != x:
                parent[x] = find(parent[x])
            return parent[x]

        for a, b in edges:
            pa, pb = find(a), find(b)
            if pa != pb:
                parent[pa] = pb
                components -= 1

        return components`,
    typescript: String.raw`function countComponents(n: number, edges: number[][]): number {
  const parent = Array.from({ length: n }, (_, i) => i)
  let components = n

  const find = (x: number): number => {
    if (parent[x] !== x) parent[x] = find(parent[x])
    return parent[x]
  }

  for (const [a, b] of edges) {
    const pa = find(a)
    const pb = find(b)
    if (pa !== pb) {
      parent[pa] = pb
      components--
    }
  }

  return components
}`,
  }),
  buildProblem({
    id: 721,
    title: 'Accounts Merge',
    difficulty: 'Medium',
    statement: '每個帳戶包含名字與多個 email，若兩帳戶有共用 email 就屬於同一人，請合併所有帳戶。',
    focus: '這題的核心不是字串處理，而是把共用 email 視為連通關係。Union-Find 專門解這種合併同群問題。',
    dataStructureChoice: 'Union-Find 把帳戶索引合併起來，Hash Map 負責 email -> 首次出現帳戶索引的映射。',
    strategy: [
      '掃描每個帳戶的 email，若某 email 已看過，就 union 兩個帳戶索引。',
      '再依 root 收集每個群組底下的所有 email。',
      '每組 email 排序後，加上名稱輸出。',
    ],
    example: example('accounts = [["John","a@mail.com","b@mail.com"],["John","b@mail.com","c@mail.com"]]', '[["John","a@mail.com","b@mail.com","c@mail.com"]]', '兩個帳戶共用 b@mail.com，因此必須合併。'),
    techniques: ['Union-Find', 'Hash Map', 'Group Aggregation'],
    baseline: {
      name: 'Graph on Emails',
      idea: '把 email 當節點建圖，再做 DFS 找連通元件。',
      time: 'O(total emails)',
      space: 'O(total emails)',
    },
    optimized: {
      name: 'Union-Find on Account Indices',
      idea: '用 email 映射串起帳戶索引，最後按 root 聚合 email。',
      time: 'O(total emails α(n))',
      space: 'O(total emails)',
    },
    python: String.raw`class Solution:
    def accountsMerge(self, accounts: list[list[str]]) -> list[list[str]]:
        parent = list(range(len(accounts)))
        email_owner = {}

        def find(x: int) -> int:
            if parent[x] != x:
                parent[x] = find(parent[x])
            return parent[x]

        def union(a: int, b: int) -> None:
            parent[find(a)] = find(b)

        for i, account in enumerate(accounts):
            for email in account[1:]:
                if email in email_owner:
                    union(i, email_owner[email])
                else:
                    email_owner[email] = i

        groups = defaultdict(list)
        for email, owner in email_owner.items():
            groups[find(owner)].append(email)

        result = []
        for root, emails in groups.items():
            result.append([accounts[root][0]] + sorted(emails))
        return result`,
    typescript: String.raw`function accountsMerge(accounts: string[][]): string[][] {
  const parent = Array.from({ length: accounts.length }, (_, i) => i)
  const emailOwner = new Map<string, number>()

  const find = (x: number): number => {
    if (parent[x] !== x) parent[x] = find(parent[x])
    return parent[x]
  }

  const union = (a: number, b: number) => {
    parent[find(a)] = find(b)
  }

  accounts.forEach((account, index) => {
    for (let i = 1; i < account.length; i++) {
      const email = account[i]
      if (emailOwner.has(email)) union(index, emailOwner.get(email)!)
      else emailOwner.set(email, index)
    }
  })

  const groups = new Map<number, string[]>()
  for (const [email, owner] of emailOwner.entries()) {
    const root = find(owner)
    if (!groups.has(root)) groups.set(root, [])
    groups.get(root)!.push(email)
  }

  return [...groups.entries()].map(([root, emails]) => [accounts[root][0], ...emails.sort()])
}`,
  }),
  buildProblem({
    id: 947,
    title: 'Most Stones Removed with Same Row or Column',
    difficulty: 'Medium',
    statement: '平面上有一些石頭，若兩石頭同列或同行，則可移除其中一顆。求最多能移除多少顆。',
    focus: '這題真正要數的是連通元件數。每個連通塊至少要留一顆石頭，所以答案是總石頭數減去元件數。',
    dataStructureChoice: 'Union-Find 可把同列或同行的石頭合併為同一個群組，最後計算群組數即可。',
    strategy: [
      '把石頭視為節點，若同行或同列就 union。',
      '遍歷所有石頭 pair，將可互連的石頭合併。',
      '答案是 stone 數量減去不同 root 的數量。',
    ],
    example: example('stones = [[0,0],[0,1],[1,0],[1,2],[2,1],[2,2]]', '5', '整體只剩一個連通塊，因此最多可移除 6 - 1 = 5 顆。'),
    techniques: ['Union-Find', 'Connected Components', 'Graph Interpretation'],
    baseline: {
      name: 'Repeated DFS Removal Search',
      idea: '每次模擬移除操作並重新找可移除石頭，實作複雜且低效。',
      time: 'High',
      space: 'O(n)',
    },
    optimized: {
      name: 'Union-Find Components',
      idea: '把同行同列石頭視為同群，答案等於 n - components。',
      time: 'O(n^2 α(n))',
      space: 'O(n)',
    },
    python: String.raw`class Solution:
    def removeStones(self, stones: list[list[int]]) -> int:
        n = len(stones)
        parent = list(range(n))

        def find(x: int) -> int:
            if parent[x] != x:
                parent[x] = find(parent[x])
            return parent[x]

        def union(a: int, b: int) -> None:
            parent[find(a)] = find(b)

        for i in range(n):
            for j in range(i + 1, n):
                if stones[i][0] == stones[j][0] or stones[i][1] == stones[j][1]:
                    union(i, j)

        roots = {find(i) for i in range(n)}
        return n - len(roots)`,
    typescript: String.raw`function removeStones(stones: number[][]): number {
  const parent = Array.from({ length: stones.length }, (_, i) => i)

  const find = (x: number): number => {
    if (parent[x] !== x) parent[x] = find(parent[x])
    return parent[x]
  }

  const union = (a: number, b: number) => {
    parent[find(a)] = find(b)
  }

  for (let i = 0; i < stones.length; i++) {
    for (let j = i + 1; j < stones.length; j++) {
      if (stones[i][0] === stones[j][0] || stones[i][1] === stones[j][1]) {
        union(i, j)
      }
    }
  }

  const roots = new Set<number>()
  for (let i = 0; i < stones.length; i++) roots.add(find(i))
  return stones.length - roots.size
}`,
  }),
  buildProblem({
    id: 240,
    title: 'Search a 2D Matrix II',
    difficulty: 'Medium',
    statement: '給定每列遞增、每欄遞增的 matrix，判斷 target 是否存在。',
    focus: '這題常被歸到 divide and conquer，但最實用的是從右上角開始的縮減法。每一步都能排除一整列或一整欄。',
    dataStructureChoice: '不需要額外資料結構，只要利用排序矩陣的單調性做雙維度剪枝。',
    strategy: [
      '從右上角開始觀察目前值。',
      '若目前值大於 target，整欄往下都更大，因此往左移。',
      '若目前值小於 target，整列往左都更小，因此往下移。',
    ],
    example: example('matrix = [[1,4,7],[2,5,8],[3,6,9]], target = 5', 'true', '從右上往左或往下移動即可快速鎖定 target。'),
    techniques: ['Matrix Search', 'Monotonic Grid', 'Pruning'],
    baseline: {
      name: 'Scan Every Cell',
      idea: '逐格檢查是否等於 target。',
      time: 'O(mn)',
      space: 'O(1)',
    },
    optimized: {
      name: 'Top-right Elimination',
      idea: '從右上角出發，每次排除一整列或一整欄。',
      time: 'O(m + n)',
      space: 'O(1)',
    },
    python: String.raw`class Solution:
    def searchMatrix(self, matrix: list[list[int]], target: int) -> bool:
        rows, cols = len(matrix), len(matrix[0])
        r, c = 0, cols - 1

        while r < rows and c >= 0:
            if matrix[r][c] == target:
                return True
            if matrix[r][c] > target:
                c -= 1
            else:
                r += 1

        return False`,
    typescript: String.raw`function searchMatrix(matrix: number[][], target: number): boolean {
  let r = 0
  let c = matrix[0].length - 1

  while (r < matrix.length && c >= 0) {
    if (matrix[r][c] === target) return true
    if (matrix[r][c] > target) c--
    else r++
  }

  return false
}`,
  }),
  buildProblem({
    id: 241,
    title: 'Different Ways to Add Parentheses',
    difficulty: 'Medium',
    statement: '給定只含數字與 + - * 的字串 expression，回傳所有可能加括號後的計算結果。',
    focus: '這題是標準 divide and conquer。每遇到一個運算子，就把它當作最後計算的根，把左右子表達式分治求解。',
    dataStructureChoice: '遞迴分治最自然，搭配 memoization 可以避免重複計算相同子字串。',
    strategy: [
      '掃描 expression，遇到運算子就切成左、右兩個子字串。',
      '遞迴求出左右所有可能結果，再做笛卡兒積組合。',
      '若整段沒有運算子，代表它本身就是一個數字。',
    ],
    example: example('expression = "2-1-1"', '[0,2]', '(2-(1-1)) = 2，((2-1)-1) = 0。'),
    techniques: ['Divide and Conquer', 'Memoization', 'Expression Parsing'],
    baseline: {
      name: 'Recompute Every Subexpression',
      idea: '純遞迴分治，不快取任何子問題。',
      time: 'Exponential',
      space: 'O(n)',
    },
    optimized: {
      name: 'Divide and Conquer + Memo',
      idea: '對每個子字串結果做快取，避免重複分解同一段表達式。',
      time: 'Reduced exponential',
      space: 'O(number of substrings)',
    },
    python: String.raw`class Solution:
    def diffWaysToCompute(self, expression: str) -> list[int]:
        memo = {}

        def solve(expr: str) -> list[int]:
            if expr in memo:
                return memo[expr]
            result = []
            for i, ch in enumerate(expr):
                if ch in '+-*':
                    for left in solve(expr[:i]):
                        for right in solve(expr[i + 1:]):
                            if ch == '+':
                                result.append(left + right)
                            elif ch == '-':
                                result.append(left - right)
                            else:
                                result.append(left * right)
            if not result:
                result.append(int(expr))
            memo[expr] = result
            return result

        return solve(expression)`,
    typescript: String.raw`function diffWaysToCompute(expression: string): number[] {
  const memo = new Map<string, number[]>()

  const solve = (expr: string): number[] => {
    if (memo.has(expr)) return memo.get(expr)!
    const result: number[] = []

    for (let i = 0; i < expr.length; i++) {
      const ch = expr[i]
      if ('+-*'.includes(ch)) {
        for (const left of solve(expr.slice(0, i))) {
          for (const right of solve(expr.slice(i + 1))) {
            if (ch === '+') result.push(left + right)
            else if (ch === '-') result.push(left - right)
            else result.push(left * right)
          }
        }
      }
    }

    if (result.length === 0) result.push(Number(expr))
    memo.set(expr, result)
    return result
  }

  return solve(expression)
}`,
  }),
  buildProblem({
    id: 395,
    title: 'Longest Substring with At Least K Repeating Characters',
    difficulty: 'Medium',
    statement: '給定字串 s 與整數 k，找出最長子字串，使其中每個字元都至少出現 k 次。',
    focus: '分治的觀察在於：若某字元在整段中出現次數 < k，它不可能出現在任何合法答案裡，因此可作為切割點。',
    dataStructureChoice: 'Divide and conquer 很適合，先統計整段字元頻率，再依不合法字元切開成獨立子問題。',
    strategy: [
      '統計當前字串每個字元出現次數。',
      '找到任一個頻率 < k 的字元，因它不能出現在合法答案中，所以用它切分字串。',
      '遞迴求各段最大值；若沒有壞字元，整段就是合法答案。',
    ],
    example: example('s = "aaabb", k = 3', '3', '字串 "aaa" 中每個字元都至少出現 3 次，長度為 3。'),
    techniques: ['Divide and Conquer', 'Frequency Count', 'Split by Invalid Char'],
    baseline: {
      name: 'Check Every Substring',
      idea: '枚舉所有子字串後統計每個子字串字元次數。',
      time: 'O(n^3)',
      space: 'O(k)',
    },
    optimized: {
      name: 'Split on Bad Characters',
      idea: '出現次數小於 k 的字元不可能屬於答案，用它切割遞迴。',
      time: 'Usually O(n log n), worst O(n^2)',
      space: 'O(n)',
    },
    python: String.raw`from collections import Counter

class Solution:
    def longestSubstring(self, s: str, k: int) -> int:
        if len(s) < k:
            return 0

        counts = Counter(s)
        for ch, freq in counts.items():
            if freq < k:
                return max(self.longestSubstring(part, k) for part in s.split(ch))

        return len(s)`,
    typescript: String.raw`function longestSubstring(s: string, k: number): number {
  if (s.length < k) return 0

  const counts = new Map<string, number>()
  for (const ch of s) counts.set(ch, (counts.get(ch) ?? 0) + 1)

  for (const [ch, freq] of counts.entries()) {
    if (freq < k) {
      return Math.max(...s.split(ch).map(part => longestSubstring(part, k)), 0)
    }
  }

  return s.length
}`,
  }),
  buildProblem({
    id: 889,
    title: 'Construct Binary Tree from Preorder and Postorder Traversal',
    difficulty: 'Medium',
    statement: '給定 preorder 與 postorder，建出任一棵符合這兩種遍歷結果的二元樹。',
    focus: '這題的分治核心是：preorder 的下一個值一定是左子樹 root，可在 postorder 中找到左子樹大小，進而切分左右區間。',
    dataStructureChoice: '遞迴分治最適合，搭配 postorder 值到索引的映射可 O(1) 找切點。',
    strategy: [
      '目前區間的 preorder 首元素就是 root。',
      '若區間長度 > 1，preorder 的下一個元素是左子樹 root，在 postorder 中找到它的位置。',
      '依左子樹大小切分 preorder 與 postorder 區間，遞迴建樹。',
    ],
    example: example('preorder = [1,2,4,5,3,6,7], postorder = [4,5,2,6,7,3,1]', 'root = [1,2,3,4,5,6,7]', '可重建出一棵滿足兩種遍歷的二元樹。'),
    techniques: ['Divide and Conquer', 'Tree Construction', 'Traversal Indexing'],
    baseline: {
      name: 'Recursive Search for Subtree Boundaries',
      idea: '每次在 postorder 線性搜尋左子樹邊界。',
      time: 'O(n^2)',
      space: 'O(n)',
    },
    optimized: {
      name: 'Index-assisted Divide and Conquer',
      idea: '預先建立 postorder 索引表，遞迴切分區間建樹。',
      time: 'O(n)',
      space: 'O(n)',
    },
    python: String.raw`class Solution:
    def constructFromPrePost(self, preorder: list[int], postorder: list[int]) -> Optional[TreeNode]:
        index = {value: i for i, value in enumerate(postorder)}

        def build(pre_l: int, pre_r: int, post_l: int, post_r: int) -> Optional[TreeNode]:
            if pre_l > pre_r:
                return None
            root = TreeNode(preorder[pre_l])
            if pre_l == pre_r:
                return root

            left_root = preorder[pre_l + 1]
            left_size = index[left_root] - post_l + 1
            root.left = build(pre_l + 1, pre_l + left_size, post_l, post_l + left_size - 1)
            root.right = build(pre_l + left_size + 1, pre_r, post_l + left_size, post_r - 1)
            return root

        return build(0, len(preorder) - 1, 0, len(postorder) - 1)`,
    typescript: String.raw`function constructFromPrePost(preorder: number[], postorder: number[]): TreeNode | null {
  const index = new Map<number, number>()
  postorder.forEach((value, i) => index.set(value, i))

  const build = (preL: number, preR: number, postL: number, postR: number): TreeNode | null => {
    if (preL > preR) return null
    const root = new TreeNode(preorder[preL])
    if (preL === preR) return root

    const leftRoot = preorder[preL + 1]
    const leftSize = index.get(leftRoot)! - postL + 1
    root.left = build(preL + 1, preL + leftSize, postL, postL + leftSize - 1)
    root.right = build(preL + leftSize + 1, preR, postL + leftSize, postR - 1)
    return root
  }

  return build(0, preorder.length - 1, 0, postorder.length - 1)
}`,
  }),
  buildProblem({
    id: 332,
    title: 'Reconstruct Itinerary',
    difficulty: 'Hard',
    statement: '給定機票 tickets = [from, to]，從 "JFK" 出發，找出字典序最小的合法 itinerary，需使用所有機票一次。',
    focus: '這題本質是 Eulerian path。因為每張機票都要剛好用一次，標準解是 Hierholzer 演算法加上字典序處理。',
    dataStructureChoice: 'Adjacency list 搭配 min-heap 或排序後反向 pop 都可。重點是能在每個機場優先取字典序最小的下一站。',
    strategy: [
      '先建立圖，對每個出發點的目的地排序。',
      '用 DFS 反覆走到不能再走為止，再把節點加入路徑尾端。',
      '最後把反向得到的路徑翻轉，就是完整 itinerary。',
    ],
    example: example('tickets = [["MUC","LHR"],["JFK","MUC"],["SFO","SJC"],["LHR","SFO"]]', '["JFK","MUC","LHR","SFO","SJC"]', '需要把所有機票各用一次，因此是 Eulerian path 問題。'),
    techniques: ['Graph', 'Eulerian Path', 'Hierholzer'],
    baseline: {
      name: 'Backtracking All Routes',
      idea: '嘗試所有可行路徑並取字典序最小者。',
      time: 'Exponential',
      space: 'O(E)',
    },
    optimized: {
      name: 'Hierholzer with Lexical Order',
      idea: '按字典序取邊並做 Eulerian path，最後反轉得到答案。',
      time: 'O(E log E)',
      space: 'O(E)',
    },
    python: String.raw`from collections import defaultdict

class Solution:
    def findItinerary(self, tickets: list[list[str]]) -> list[str]:
        graph = defaultdict(list)
        for src, dst in sorted(tickets, reverse=True):
            graph[src].append(dst)

        route = []

        def dfs(airport: str) -> None:
            while graph[airport]:
                dfs(graph[airport].pop())
            route.append(airport)

        dfs('JFK')
        return route[::-1]`,
    typescript: String.raw`function findItinerary(tickets: string[][]): string[] {
  const graph = new Map<string, string[]>()

  tickets.sort((a, b) => (a[0] === b[0] ? b[1].localeCompare(a[1]) : b[0].localeCompare(a[0])))
  for (const [src, dst] of tickets) {
    if (!graph.has(src)) graph.set(src, [])
    graph.get(src)!.push(dst)
  }

  const route: string[] = []
  const dfs = (airport: string) => {
    const next = graph.get(airport) ?? []
    while (next.length) dfs(next.pop()!)
    route.push(airport)
  }

  dfs('JFK')
  return route.reverse()
}`,
  }),
  buildProblem({
    id: 802,
    title: 'Find Eventual Safe States',
    difficulty: 'Medium',
    statement: '給定有向圖 graph，找出所有最終一定會走到終點、而不會進入 cycle 的節點。',
    focus: '這題可從反圖角度思考：所有終點節點先是安全的，若某節點所有出邊都指向安全節點，它也會變安全。',
    dataStructureChoice: '反向圖 + topological BFS 很適合，因為可從 outdegree = 0 的終點往回推導安全節點。',
    strategy: [
      '建立反向圖 reverseGraph，並記錄每個節點的 outdegree。',
      '先把 outdegree 為 0 的節點放進 queue。',
      '從 queue 反向消除邊，當某節點 outdegree 變成 0，就代表它也安全。',
    ],
    example: example('graph = [[1,2],[2,3],[5],[0],[5],[],[]]', '[2,4,5,6]', '2、4、5、6 最終都不會進入環。'),
    techniques: ['Graph', 'Topological Sort', 'Reverse Graph'],
    baseline: {
      name: 'DFS with Cycle Detection Per Node',
      idea: '對每個節點單獨做 DFS 檢查是否會進入 cycle。',
      time: 'O(V(V+E))',
      space: 'O(V)',
    },
    optimized: {
      name: 'Reverse Topological Elimination',
      idea: '從終點節點往回推，刪掉所有通往安全區的邊。',
      time: 'O(V + E)',
      space: 'O(V + E)',
    },
    python: String.raw`from collections import deque

class Solution:
    def eventualSafeNodes(self, graph: list[list[int]]) -> list[int]:
        n = len(graph)
        reverse_graph = [[] for _ in range(n)]
        outdegree = [0] * n

        for node, neighbors in enumerate(graph):
            outdegree[node] = len(neighbors)
            for nei in neighbors:
                reverse_graph[nei].append(node)

        queue = deque(i for i in range(n) if outdegree[i] == 0)
        safe = [False] * n

        while queue:
            node = queue.popleft()
            safe[node] = True
            for prev in reverse_graph[node]:
                outdegree[prev] -= 1
                if outdegree[prev] == 0:
                    queue.append(prev)

        return [i for i, ok in enumerate(safe) if ok]`,
    typescript: String.raw`function eventualSafeNodes(graph: number[][]): number[] {
  const n = graph.length
  const reverseGraph = Array.from({ length: n }, () => [] as number[])
  const outdegree = new Array(n).fill(0)

  for (let node = 0; node < n; node++) {
    outdegree[node] = graph[node].length
    for (const nei of graph[node]) reverseGraph[nei].push(node)
  }

  const queue: number[] = []
  for (let i = 0; i < n; i++) if (outdegree[i] === 0) queue.push(i)

  const safe = new Array(n).fill(false)
  while (queue.length) {
    const node = queue.shift()!
    safe[node] = true
    for (const prev of reverseGraph[node]) {
      outdegree[prev]--
      if (outdegree[prev] === 0) queue.push(prev)
    }
  }

  return safe.map((ok, index) => (ok ? index : -1)).filter(index => index !== -1)
}`,
  }),
  buildProblem({
    id: 1514,
    title: 'Path with Maximum Probability',
    difficulty: 'Medium',
    statement: '無向圖每條邊都有成功機率，求從 start 到 end 的最大成功機率路徑。',
    focus: '這題是 Dijkstra 的變形，只是加法改成乘法、最短路改成最大機率路。關鍵是路徑最佳性仍然滿足貪心擴張。',
    dataStructureChoice: 'Max-heap 搭配 adjacency list 最合適，因為每次都要優先擴張目前機率最高的節點。',
    strategy: [
      '建立 adjacency list，邊權為成功機率。',
      '用 max-heap 保存目前到各節點的最佳已知機率。',
      '每次取出機率最高的節點做 relax，若到鄰居的機率更高就更新。',
    ],
    example: example('n = 3, edges = [[0,1],[1,2],[0,2]], succProb = [0.5,0.5,0.2], start = 0, end = 2', '0.25', '走 0 -> 1 -> 2 的機率 0.5 * 0.5 = 0.25，比直接走 0.2 更高。'),
    techniques: ['Dijkstra', 'Max Heap', 'Probability Graph'],
    baseline: {
      name: 'DFS All Paths',
      idea: '列舉所有路徑並計算每條的成功機率。',
      time: 'Exponential',
      space: 'O(V)',
    },
    optimized: {
      name: 'Max-probability Dijkstra',
      idea: '每次擴張目前機率最高的節點，像 Dijkstra 一樣做最佳值鬆弛。',
      time: 'O((V + E) log V)',
      space: 'O(V + E)',
    },
    python: String.raw`import heapq
from collections import defaultdict

class Solution:
    def maxProbability(self, n: int, edges: list[list[int]], succProb: list[float], start: int, end: int) -> float:
        graph = defaultdict(list)
        for (a, b), prob in zip(edges, succProb):
            graph[a].append((b, prob))
            graph[b].append((a, prob))

        best = [0.0] * n
        best[start] = 1.0
        heap = [(-1.0, start)]

        while heap:
            prob, node = heapq.heappop(heap)
            prob = -prob
            if node == end:
                return prob
            if prob < best[node]:
                continue
            for nei, edge_prob in graph[node]:
                next_prob = prob * edge_prob
                if next_prob > best[nei]:
                    best[nei] = next_prob
                    heapq.heappush(heap, (-next_prob, nei))

        return 0.0`,
    typescript: String.raw`function maxProbability(
  n: number,
  edges: number[][],
  succProb: number[],
  start: number,
  end: number,
): number {
  const graph = Array.from({ length: n }, () => [] as Array<[number, number]>)
  for (let i = 0; i < edges.length; i++) {
    const [a, b] = edges[i]
    const prob = succProb[i]
    graph[a].push([b, prob])
    graph[b].push([a, prob])
  }

  const pq = new MaxPriorityQueue<{ node: number; prob: number }>({
    priority: item => item.prob,
  })
  const best = new Array(n).fill(0)
  best[start] = 1
  pq.enqueue({ node: start, prob: 1 })

  while (!pq.isEmpty()) {
    const { node, prob } = pq.dequeue().element
    if (node === end) return prob
    if (prob < best[node]) continue
    for (const [nei, edgeProb] of graph[node]) {
      const nextProb = prob * edgeProb
      if (nextProb > best[nei]) {
        best[nei] = nextProb
        pq.enqueue({ node: nei, prob: nextProb })
      }
    }
  }

  return 0
}`,
  }),
  buildProblem({
    id: 1631,
    title: 'Path With Minimum Effort',
    difficulty: 'Medium',
    statement: '給定 heights 矩陣，路徑的 effort 定義為路上相鄰格子高度差絕對值的最大值，求從左上到右下的最小 effort。',
    focus: '這題是 minimax path。Dijkstra 仍可用，但路徑成本改成沿途最大邊權，而不是總和。',
    dataStructureChoice: 'Min-heap Dijkstra 很適合，因為每次都想先處理目前 effort 最小的狀態，並用 max(currentEffort, edgeCost) 做鬆弛。',
    strategy: [
      'dist[r][c] 表示到該格的最小可能 effort。',
      '用 min-heap 取出目前 effort 最小的格子。',
      '對四個鄰居做 relax，新的 effort 是 max(目前 effort, 高度差)。',
    ],
    example: example('heights = [[1,2,2],[3,8,2],[5,3,5]]', '2', '最佳路徑可把最大高度差壓在 2。'),
    techniques: ['Dijkstra', 'Minimax Path', 'Grid Graph'],
    baseline: {
      name: 'Binary Search + BFS',
      idea: '對答案 effort 二分，再檢查是否存在只用 <= effort 邊的路徑。',
      time: 'O(mn log C)',
      space: 'O(mn)',
    },
    optimized: {
      name: 'Dijkstra on Maximum Edge Cost',
      idea: '把路徑成本定義成沿途最大邊權，使用 Dijkstra 鬆弛即可。',
      time: 'O(mn log(mn))',
      space: 'O(mn)',
    },
    python: String.raw`import heapq

class Solution:
    def minimumEffortPath(self, heights: list[list[int]]) -> int:
        rows, cols = len(heights), len(heights[0])
        dist = [[float('inf')] * cols for _ in range(rows)]
        dist[0][0] = 0
        heap = [(0, 0, 0)]
        directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

        while heap:
            effort, r, c = heapq.heappop(heap)
            if (r, c) == (rows - 1, cols - 1):
                return effort
            if effort > dist[r][c]:
                continue
            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols:
                    next_effort = max(effort, abs(heights[r][c] - heights[nr][nc]))
                    if next_effort < dist[nr][nc]:
                        dist[nr][nc] = next_effort
                        heapq.heappush(heap, (next_effort, nr, nc))

        return 0`,
    typescript: String.raw`function minimumEffortPath(heights: number[][]): number {
  const rows = heights.length
  const cols = heights[0].length
  const dist = Array.from({ length: rows }, () => new Array(cols).fill(Infinity))
  dist[0][0] = 0

  const pq = new MinPriorityQueue<{ r: number; c: number; effort: number }>({
    priority: item => item.effort,
  })
  pq.enqueue({ r: 0, c: 0, effort: 0 })

  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]]

  while (!pq.isEmpty()) {
    const { r, c, effort } = pq.dequeue().element
    if (r === rows - 1 && c === cols - 1) return effort
    if (effort > dist[r][c]) continue

    for (const [dr, dc] of dirs) {
      const nr = r + dr
      const nc = c + dc
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue
      const nextEffort = Math.max(effort, Math.abs(heights[r][c] - heights[nr][nc]))
      if (nextEffort < dist[nr][nc]) {
        dist[nr][nc] = nextEffort
        pq.enqueue({ r: nr, c: nc, effort: nextEffort })
      }
    }
  }

  return 0
}`,
  }),
].map(item => [item.id, item]))
