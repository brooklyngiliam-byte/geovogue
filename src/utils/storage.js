const KEYS = {
  streak: 'wih_streak',
  lastPlayed: 'wih_last_played',
  stats: 'wih_stats',
  seen: 'wih_seen',
}

export function loadStats() {
  try {
    const raw = localStorage.getItem(KEYS.stats)
    const streak = parseInt(localStorage.getItem(KEYS.streak) ?? '0', 10)
    const base = raw ? JSON.parse(raw) : { gamesPlayed: 0, totalScore: 0, bestScore: 0 }
    return { ...base, streak }
  } catch {
    return { gamesPlayed: 0, totalScore: 0, bestScore: 0, streak: 0 }
  }
}

export function saveRound(score) {
  const today = new Date().toISOString().slice(0, 10)
  const lastPlayed = localStorage.getItem(KEYS.lastPlayed)
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

  let streak = parseInt(localStorage.getItem(KEYS.streak) ?? '0', 10)
  if (lastPlayed === today) {
    // already saved today, no-op on streak
  } else if (lastPlayed === yesterday) {
    streak += 1
  } else {
    streak = 1
  }

  const prev = loadStats()
  const gamesPlayed = prev.gamesPlayed + (lastPlayed === today ? 0 : 1)
  const totalScore = prev.totalScore + score
  const bestScore = Math.max(prev.bestScore ?? 0, score)

  const updated = { gamesPlayed, totalScore, bestScore }

  localStorage.setItem(KEYS.streak, String(streak))
  localStorage.setItem(KEYS.lastPlayed, today)
  localStorage.setItem(KEYS.stats, JSON.stringify(updated))

  return { ...updated, streak }
}

export function loadSeen() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.seen) ?? '[]')
  } catch {
    return []
  }
}

export function saveSeen(ids) {
  localStorage.setItem(KEYS.seen, JSON.stringify(ids))
}
