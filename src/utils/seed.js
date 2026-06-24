import questions from '../data/questions.json'

function dateToSeed(dateStr) {
  // e.g. "2026-06-23" → deterministic integer
  return dateStr.split('-').reduce((acc, part) => acc * 100 + parseInt(part, 10), 0)
}

function seededRandom(seed) {
  // Mulberry32 — fast, good distribution for small arrays
  let s = seed >>> 0
  return function () {
    s += 0x6d2b79f5
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle(arr, rand) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function getDailyQuestions(count = 5) {
  const today = new Date().toISOString().slice(0, 10)
  const seed = dateToSeed(today)
  const rand = seededRandom(seed)
  return shuffle(questions, rand).slice(0, count)
}
