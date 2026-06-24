import { useState, useEffect } from 'react'
import MapView from './components/MapView'
import QuestionCard from './components/QuestionCard'
import ScoreDisplay from './components/ScoreDisplay'
import RoundSummary from './components/RoundSummary'
import StreakBanner from './components/StreakBanner'
import { getDailyQuestions } from './utils/seed'
import { calcScore } from './utils/scoring'
import { loadStats, saveRound } from './utils/storage'

export default function App() {
  const questions = getDailyQuestions()
  const [questionIndex, setQuestionIndex] = useState(0)
  const [guesses, setGuesses] = useState([]) // { lat, lng, score, distance }
  const [pendingGuess, setPendingGuess] = useState(null) // lat/lng before confirm
  const [phase, setPhase] = useState('guessing') // 'guessing' | 'revealed' | 'summary'
  const [stats, setStats] = useState(loadStats())

  const current = questions[questionIndex]
  const isLastQuestion = questionIndex === questions.length - 1

  function handleMapClick(latlng) {
    if (phase !== 'guessing') return
    setPendingGuess(latlng)
  }

  function handleConfirmGuess() {
    if (!pendingGuess) return
    const { score, distance } = calcScore(pendingGuess, { lat: current.lat, lng: current.lng })
    setGuesses(prev => [...prev, { ...pendingGuess, score, distance }])
    setPhase('revealed')
  }

  function handleNext() {
    if (isLastQuestion) {
      const totalScore = [...guesses].reduce((sum, g) => sum + g.score, 0)
      const updated = saveRound(totalScore)
      setStats(updated)
      setPhase('summary')
    } else {
      setQuestionIndex(i => i + 1)
      setPendingGuess(null)
      setPhase('guessing')
    }
  }

  const currentGuess = phase === 'revealed' ? guesses[guesses.length - 1] : null

  return (
    <div className="h-screen bg-parchment text-ink font-sans flex flex-col overflow-hidden">
      <header className="px-6 py-4 border-b border-ink/10 flex items-center justify-between">
        <h1 className="text-xl font-serif tracking-wide text-burgundy">GeoVogue</h1>
        <StreakBanner stats={stats} />
      </header>

      {phase === 'summary' ? (
        <RoundSummary questions={questions} guesses={guesses} stats={stats} />
      ) : (
        <main className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="shrink-0"><QuestionCard
            question={current}
            questionIndex={questionIndex}
            total={questions.length}
            phase={phase}
          /></div>
          <div className="flex-1 min-h-0 relative" style={{ cursor: "url('/miffy.svg') 20 48, crosshair" }}>
            <MapView
              phase={phase}
              pendingGuess={pendingGuess}
              confirmedGuess={currentGuess}
              answer={phase === 'revealed' ? { lat: current.lat, lng: current.lng, label: current.answer_label } : null}
              onMapClick={handleMapClick}
            />
          </div>
          <div className="shrink-0"><ScoreDisplay
            phase={phase}
            pendingGuess={pendingGuess}
            confirmedGuess={currentGuess}
            question={current}
            isLastQuestion={isLastQuestion}
            onConfirm={handleConfirmGuess}
            onNext={handleNext}
          /></div>
        </main>
      )}
    </div>
  )
}
