function toDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function updateStreak(lastActiveDate: string | null, currentStreak: number): {
  streak: number
  lastActive: string
} {
  const today = new Date()
  const todayStr = toDateStr(today)

  if (!lastActiveDate) {
    return { streak: 1, lastActive: todayStr }
  }

  const [ly, lm, ld] = lastActiveDate.split('-').map(Number)
  const [ty, tm, td] = todayStr.split('-').map(Number)
  const lastMs = Date.UTC(ly, lm - 1, ld)
  const todayMs = Date.UTC(ty, tm - 1, td)
  const diffDays = Math.round((todayMs - lastMs) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return { streak: currentStreak, lastActive: lastActiveDate }
  if (diffDays === 1) return { streak: currentStreak + 1, lastActive: todayStr }
  return { streak: 1, lastActive: todayStr }
}
