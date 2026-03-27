import { getProblemDetail } from './problem-data.js'

export const chapterProblemMap = {
  3: [1, 238, 48, 54, 128, 41, 53, 121, 152, 169, 189],
  4: [206, 21, 141, 19, 143, 146, 25, 2, 24, 61, 83, 92],
  5: [20, 155, 232, 739, 239, 84, 496, 150, 225, 394, 402, 503, 946],
  6: [1, 49, 560, 128, 146, 76, 36, 205, 217, 219, 242, 380],
  7: [104, 226, 102, 98, 230, 105, 297, 124, 543, 100, 101, 112, 199, 235, 236],
  8: [215, 347, 23, 295, 703, 373, 1046, 973, 1167, 1962, 2530],
  9: [208, 212, 211, 14, 648, 720, 1268, 1804],
  10: [200, 133, 207, 417, 994, 127, 695, 733, 785, 797, 841],
  11: [547, 684, 128, 305, 261, 323, 721, 947],
  12: [912, 56, 315, 75, 179, 148, 274, 451, 905, 1122],
  13: [704, 33, 153, 875, 74, 4, 34, 35, 69, 81, 162, 540],
  14: [167, 15, 11, 42, 75, 26, 27, 125, 283, 344, 392],
  15: [3, 424, 76, 239, 567, 209, 438, 643, 1004, 1456],
  16: [46, 78, 39, 40, 51, 131, 79, 17, 22, 77, 90, 216, 784],
  17: [70, 198, 322, 1143, 300, 416, 72, 312, 132, 188, 62, 63, 64, 91, 139, 279],
  18: [455, 55, 435, 134, 621, 45, 122, 135, 376, 763, 1029],
  19: [215, 23, 4, 315, 240, 241, 395, 889],
  20: [207, 210, 743, 787, 1584, 332, 802, 1514, 1631],
  21: [136, 191, 338, 268, 137, 371, 190, 231, 260, 389, 461],
}

export function getChapterProblemIds(chapterId) {
  return chapterProblemMap[chapterId] ?? []
}

export function getAllProblemIds() {
  return [...new Set(Object.values(chapterProblemMap).flat())]
}

export function getProblemMeta(id) {
  const detail = getProblemDetail(id)
  return {
    id: detail.id,
    title: detail.title,
    difficulty: detail.difficulty,
  }
}

export function renderProblemList(problemIds, className = 'problem-list') {
  const items = problemIds.map(id => {
    const detail = getProblemMeta(id)
    return `
      <li class="problem-item">
        <span class="problem-id">#${detail.id}</span>
        <span class="problem-name">${detail.title}</span>
        <span class="diff diff-${String(detail.difficulty).toLowerCase()}">${detail.difficulty}</span>
      </li>
    `
  }).join('')

  return `<ul class="${className}">${items}</ul>`
}
