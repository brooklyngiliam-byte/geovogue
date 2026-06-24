export default function StreakBanner({ stats }) {
  if (!stats || stats.streak === 0) return null

  return (
    <div className="flex items-center gap-1.5 text-sm font-sans text-ink/60">
      <span className="text-burgundy font-medium">{stats.streak}</span>
      <span className="text-xs uppercase tracking-widest">day streak</span>
    </div>
  )
}
