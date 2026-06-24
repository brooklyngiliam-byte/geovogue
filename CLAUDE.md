# Where It Happened — Claude Code Instructions

## What This Project Is
A daily geography guessing game focused on fashion and art. Players read a short clue about a real fashion or art event/location and click where they think it happened on an interactive world map. 5 questions per session, scored by distance. Think GeoSports but for people who care about Comme des Garçons more than the Champions League.

## Tech Stack
- **Framework**: React (single-page app, no Next.js)
- **Map**: Leaflet + OpenStreetMap tiles (no API key required)
- **Styling**: Tailwind CSS utility classes only
- **State**: React state + localStorage (no backend, no auth)
- **Deployment**: Static site (Vercel or Netlify)

## Project Structure
```
where-it-happened/
├── CLAUDE.md
├── public/
├── src/
│   ├── App.jsx              # Root component, manages game state
│   ├── components/
│   │   ├── MapView.jsx      # Leaflet map, handles click-to-guess
│   │   ├── QuestionCard.jsx # Displays the current clue
│   │   ├── ScoreDisplay.jsx # Per-question score + distance feedback
│   │   ├── RoundSummary.jsx # End of round: total score, all pins revealed
│   │   └── StreakBanner.jsx # Streak + stats from localStorage
│   ├── data/
│   │   └── questions.json   # The full question bank (source of truth)
│   ├── utils/
│   │   ├── scoring.js       # Distance-to-score calculation
│   │   ├── seed.js          # Date-seeded question selection logic
│   │   └── storage.js       # localStorage read/write helpers
│   └── main.jsx
```

## Question Bank Format
Each entry in `src/data/questions.json` follows this schema:
```json
{
  "id": "001",
  "category": "fashion_house | runway_show | museum | artist_birthplace | design_movement | atelier",
  "clue": "Short clue text shown to the player — should be evocative, not too easy",
  "lat": 48.8566,
  "lng": 2.3522,
  "answer_label": "Paris, France",
  "source_note": "Fun fact shown after the player guesses (optional)"
}
```
**Do not change the schema without asking first.** Adding fields is fine; removing or renaming existing fields will break the game loop.

## Scoring Logic
- Max 5,000 points per question
- Score decays with distance: `score = Math.round(5000 * Math.exp(-distance_km / 2000))`
- Do not change the scoring formula without explicit instruction — it's been calibrated to feel fair at a global scale

## Daily Seed Logic
- 5 questions are selected per session using the current date as a seed
- Same date = same 5 questions, so it feels like a daily puzzle without needing a backend
- Seed logic lives in `src/utils/seed.js` — do not make question selection random or user-controllable

## localStorage Keys
| Key | Value |
|---|---|
| `wih_streak` | Current streak (integer) |
| `wih_last_played` | ISO date string of last completed round |
| `wih_stats` | JSON object with games played, avg score, best score |
| `wih_seen` | Array of question IDs played in last 30 days (to avoid repeats) |

Do not add new localStorage keys without documenting them here first.

## Design Direction
- Color palette: `#FAF6F1` (background), `#7D2640` (burgundy accent), `#1A1A1A` (text)
- Tone: dry, editorial, a little arch — not cutesy. Think Vogue caption, not BuzzFeed quiz
- No images of actual artworks or garments (copyright) — text clues only
- Typography should feel magazine-adjacent: a serif for question text, clean sans for UI

## What Not to Touch Without Asking
- `src/utils/scoring.js` — scoring formula is final
- `src/utils/seed.js` — daily seed logic is final
- The schema of `questions.json` — additive changes only
- localStorage key names — changing these breaks returning users' streaks

## Common Tasks Claude Code Should Handle Autonomously
- Adding new questions to `questions.json`
- Fixing map rendering bugs
- Adjusting Tailwind styles
- Adding new UI components
- Writing/updating tests

## Deployment
Static build — `npm run build` outputs to `/dist`. Deploy to Vercel by connecting the GitHub repo. No environment variables needed.
