function formatDistance(km) {
  if (km < 1) return '<1 km'
  if (km < 1000) return `${Math.round(km)} km`
  return `${(km / 1000).toFixed(1)}k km`
}

export default function ScoreDisplay({ phase, pendingGuess, confirmedGuess, question, isLastQuestion, onConfirm, onNext }) {
  if (phase === 'guessing') {
    return (
      <div className="px-6 py-4 border-t border-ink/10 flex items-center justify-between gap-4 bg-parchment">
        <p className="text-sm text-ink/50 font-sans">
          {pendingGuess ? 'Confirm your pin, or click the map to move it.' : 'Click the map to place your guess.'}
        </p>
        <button
          disabled={!pendingGuess}
          onClick={onConfirm}
          className="px-5 py-2 bg-burgundy text-parchment text-sm font-sans tracking-wide disabled:opacity-30 disabled:cursor-not-allowed hover:bg-burgundy/90 transition-colors"
        >
          Confirm
        </button>
      </div>
    )
  }

  if (phase === 'revealed') {
    return (
      <div className="px-6 py-4 border-t border-ink/10 flex items-center justify-between gap-4 bg-parchment">
        <div>
          <p className="text-2xl font-serif text-burgundy">{confirmedGuess.score.toLocaleString()} pts</p>
          <p className="text-sm text-ink/50 font-sans mt-0.5">
            {formatDistance(confirmedGuess.distance)} from {question.answer_label}
          </p>
        </div>
        <button
          onClick={onNext}
          className="px-5 py-2 bg-burgundy text-parchment text-sm font-sans tracking-wide hover:bg-burgundy/90 transition-colors"
        >
          {isLastQuestion ? 'See Results' : 'Next →'}
        </button>
      </div>
    )
  }

  return null
}
