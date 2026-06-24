const CATEGORY_LABELS = {
  fashion_house: 'Fashion House',
  runway_show: 'Runway Show',
  museum: 'Museum',
  artist_birthplace: 'Artist Birthplace',
  design_movement: 'Design Movement',
  atelier: 'Atelier',
}

export default function QuestionCard({ question, questionIndex, total, phase }) {
  return (
    <div className="px-6 py-4 border-b border-ink/10 bg-parchment">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-xs uppercase tracking-widest text-ink/40 font-sans">
          {CATEGORY_LABELS[question.category] ?? question.category}
        </span>
        <span className="text-xs text-ink/30 font-sans ml-auto">
          {questionIndex + 1} / {total}
        </span>
      </div>
      <p className="font-serif text-lg leading-snug text-ink">{question.clue}</p>
      {phase === 'revealed' && question.source_note && (
        <p className="mt-2 text-sm text-ink/60 font-sans italic">{question.source_note}</p>
      )}
    </div>
  )
}
