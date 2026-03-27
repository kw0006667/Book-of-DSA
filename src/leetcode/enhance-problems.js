function parseProblemItem(item) {
  const idText = item.querySelector('.problem-id')?.textContent?.trim() ?? ''
  const title = item.querySelector('.problem-name')?.textContent?.trim() ?? ''
  const difficulty = item.querySelector('.diff')?.textContent?.trim() ?? 'Unknown'
  const id = Number(idText.replace('#', ''))

  if (!id || !title) return null
  return { id, title, difficulty }
}

function getModal() {
  let modal = document.querySelector('leetcode-problem-modal')
  if (!modal) {
    modal = document.createElement('leetcode-problem-modal')
    document.body.appendChild(modal)
  }
  return modal
}

export function enhanceProblemCards(container) {
  const modal = getModal()

  container.querySelectorAll('.problem-item').forEach(item => {
    if (item.dataset.problemEnhanced === 'true') return
    const meta = parseProblemItem(item)
    if (!meta) return

    item.dataset.problemEnhanced = 'true'
    item.tabIndex = 0
    item.setAttribute('role', 'button')
    item.setAttribute('aria-label', `查看 ${meta.title} 題解`)

    const open = () => modal.open(meta)
    item.addEventListener('click', open)
    item.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        open()
      }
    })
  })
}
