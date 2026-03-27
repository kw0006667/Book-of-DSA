export const metadata = {
  id: 25, part: 7,
  slug: 'interview-strategy',
  title: '面試當天的策略與心態',
  tags: [],
  sections: [
    { slug: 'time-allocation', title: '45 分鐘時間分配' },
    { slug: 'communication', title: '溝通策略' },
    { slug: 'blockers', title: '卡關應對' },
    { slug: 'edge-cases', title: 'Edge Cases & Testing' },
    { slug: 'followup', title: 'Follow-up 處理' },
  ]
}

export const content = `
<div class="chapter-header">
  <div class="chapter-num">Chapter 25 · Part VII</div>
  <h1>面試當天的策略與心態</h1>
  <p>演算法面試不只是測試你的解題能力，更是觀察你如何思考、溝通、以及面對未知的方式。最後這章整理面試當天的實戰策略。</p>
</div>

<h2 id="time-allocation">45 分鐘時間分配</h2>
<table>
  <thead><tr><th>階段</th><th>時間</th><th>重點</th></tr></thead>
  <tbody>
    <tr><td>理解題目</td><td>3–5 分鐘</td><td>確認 input/output、詢問限制條件、邊界情況</td></tr>
    <tr><td>提出暴力解</td><td>2–3 分鐘</td><td>先說出 brute force，分析複雜度</td></tr>
    <tr><td>設計優化解</td><td>8–10 分鐘</td><td>口頭說明思路，獲得面試官確認再寫</td></tr>
    <tr><td>實作</td><td>15–20 分鐘</td><td>乾淨整潔的程式碼，邊寫邊說明</td></tr>
    <tr><td>測試 & 優化</td><td>5–7 分鐘</td><td>手動走例子、邊界、時間空間複雜度分析</td></tr>
  </tbody>
</table>

<div class="callout callout-warning">
  <div class="callout-title">不要一言不發開始寫程式</div>
  <p>在完全理解題目並和面試官確認解題方向之前，不要開始寫程式碼。花時間思考和溝通比衝動地寫出錯誤的解法更有價值。</p>
</div>

<h2 id="communication">溝通策略</h2>
<h3>開頭問對問題</h3>
<ul>
  <li>「input 的大小範圍是多少？n 最大多大？」</li>
  <li>「陣列是否已排序？是否有重複值？」</li>
  <li>「是否需要考慮負數 / 空輸入 / 溢位？」</li>
  <li>「需要 in-place 操作還是可以用額外空間？」</li>
</ul>

<h3>思考時大聲說出</h3>
<ul>
  <li>「我在想這是否是 sliding window 的問題，因為...」</li>
  <li>「暴力解是 O(n²)，我想看能不能用 hash map 降到 O(n)」</li>
  <li>「這裡需要一個 min-heap 來維護最小值」</li>
</ul>

<h3>寫程式碼時說明意圖</h3>
<ul>
  <li>說出每個變數的意義</li>
  <li>說出迴圈的不變量（loop invariant）</li>
  <li>遇到邊界判斷時說出為什麼</li>
</ul>

<h2 id="blockers">卡關應對</h2>
<p>卡關是正常的，關鍵是如何處理：</p>

<ol>
  <li><strong>誠實說明卡在哪裡</strong>：「我在想這個 edge case 怎麼處理...」</li>
  <li><strong>嘗試小例子</strong>：用紙筆畫出 3-5 個元素的例子手動追蹤</li>
  <li><strong>簡化問題</strong>：「如果 n 只有 1 或 2，怎麼做？」</li>
  <li><strong>主動尋求提示</strong>：「我想到了 X 方向，但還缺一個關鍵點，有沒有提示？」</li>
  <li><strong>接受提示後快速整合</strong>：拿到提示後應立刻說「對，所以我可以...」</li>
</ol>

<div class="callout callout-tip">
  <div class="callout-title">卡關不代表失敗</div>
  <p>許多公司在乎的是你卡關後的應對方式：你能否有條理地分析、清楚表達困惑、有效利用提示。「卡關但展現出優秀的思考過程」比「無聲無息獨自解出」更受歡迎。</p>
</div>

<h2 id="edge-cases">Edge Cases & Testing</h2>
<p>完成實作後，系統性地驗證：</p>

<table>
  <thead><tr><th>類型</th><th>範例</th></tr></thead>
  <tbody>
    <tr><td>空輸入</td><td><code>[]</code>, <code>""</code>, <code>null</code></td></tr>
    <tr><td>單一元素</td><td><code>[1]</code>, <code>"a"</code></td></tr>
    <tr><td>全相同元素</td><td><code>[2,2,2,2]</code></td></tr>
    <tr><td>已排序</td><td>升序 / 降序</td></tr>
    <tr><td>負數 / 零</td><td><code>[-1, 0, 1]</code></td></tr>
    <tr><td>溢位</td><td>整數最大值 / 最小值</td></tr>
    <tr><td>循環輸入</td><td>Linked List cycle, Graph cycle</td></tr>
  </tbody>
</table>

<h2 id="followup">Follow-up 處理</h2>
<p>面試官常在你解出題目後提出 follow-up，這是加分的機會：</p>

<h3>常見 Follow-up 類型</h3>
<ul>
  <li><strong>「如果 n 非常大怎麼辦？」</strong> → 討論 streaming / 分批處理</li>
  <li><strong>「能更省空間嗎？」</strong> → 討論 in-place 或 space 優化</li>
  <li><strong>「如果 input 是 stream 呢？」</strong> → 討論如何維護 running state</li>
  <li><strong>「如果要支援並發怎麼辦？」</strong> → 討論 thread safety、lock、atomic operation</li>
  <li><strong>「分散式環境下怎麼做？」</strong> → 見 Ch24 System Design</li>
</ul>

<div class="callout callout-info">
  <div class="callout-title">準備收尾問題</div>
  <p>面試最後留幾分鐘問面試官問題，展現你對職位的了解和熱情：「你們目前團隊最大的技術挑戰是什麼？」「這個 role 最需要的技能是什麼？」這些都是很好的問題。</p>
</div>

<h3>最後的心態建議</h3>
<ul>
  <li>把面試當作<strong>合作解題</strong>，不是對立考試</li>
  <li>面試官也希望你成功，他們想看你最好的狀態</li>
  <li>一次失敗的面試是免費的學習機會，記錄下來</li>
  <li>長期積累 > 短期衝刺。每天一題比考前刷 50 題有效</li>
</ul>

<div class="callout callout-tip">
  <div class="callout-title">Every expert was once a beginner</div>
  <p>每一位頂尖工程師都曾在面試中緊張、卡關、搞砸。重要的是持續練習、持續反思、持續進步。加油！</p>
</div>

<div class="chapter-footer">
  <a href="#ch24">
    <span class="footer-label">← 上一章</span>
    <span class="footer-title">System Design 中的 DSA</span>
  </a>
  <a class="next" href="#ch26">
    <span class="footer-label">下一章 →</span>
    <span class="footer-title">全站 LeetCode 題庫索引</span>
  </a>
</div>
`
