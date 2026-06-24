function formatDistance(km) {
  if (km < 1) return '<1 km'
  if (km < 1000) return `${Math.round(km)} km`
  return `${(km / 1000).toFixed(1)}k km`
}

export default function RoundSummary({ questions, guesses, stats }) {
  const total = guesses.reduce((sum, g) => sum + g.score, 0)
  const maxPossible = questions.length * 5000

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 max-w-xl mx-auto w-full">
      <h2 className="font-serif text-3xl text-ink mb-1">Today's Round</h2>
      <p className="text-ink/50 font-sans text-sm mb-6">Come back tomorrow for a new set.</p>

      <div className="flex items-baseline gap-3 mb-8">
        <span className="font-serif text-5xl text-burgundy">{total.toLocaleString()}</span>
        <span className="text-ink/40 font-sans text-sm">/ {maxPossible.toLocaleString()} pts</span>
      </div>

      <div className="space-y-4 mb-10">
        {questions.map((q, i) => {
          const g = guesses[i]
          return (
            <div key={q.id} className="border-b border-ink/10 pb-4">
              <p className="font-serif text-sm text-ink leading-snug mb-1">{q.clue}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink/50 font-sans">{q.answer_label}</span>
                <span className="text-sm font-sans">
                  <span className="text-burgundy font-medium">{g?.score.toLocaleString() ?? '–'} pts</span>
                  {g && (
                    <span className="text-ink/40 ml-2">{formatDistance(g.distance)}</span>
                  )}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {stats && (
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="font-serif text-2xl text-burgundy">{stats.streak}</p>
            <p className="text-xs text-ink/50 font-sans uppercase tracking-widest mt-0.5">Streak</p>
          </div>
          <div>
            <p className="font-serif text-2xl text-burgundy">{stats.gamesPlayed}</p>
            <p className="text-xs text-ink/50 font-sans uppercase tracking-widest mt-0.5">Played</p>
          </div>
          <div>
            <p className="font-serif text-2xl text-burgundy">{stats.bestScore?.toLocaleString() ?? '–'}</p>
            <p className="text-xs text-ink/50 font-sans uppercase tracking-widest mt-0.5">Best</p>
          </div>
        </div>
      )}
    </div>
  )
}
