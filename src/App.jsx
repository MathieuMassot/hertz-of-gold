import { useEffect, useRef, useState } from 'react'
import Wave from './components/Wave.jsx'
import Hud from './components/Hud.jsx'
import Home from './screens/Home.jsx'
import Listen from './screens/Listen.jsx'
import Tune from './screens/Tune.jsx'
import RoundResult from './screens/RoundResult.jsx'
import Final from './screens/Final.jsx'
import { unlockAudio } from './game/audio.js'
import { posToFreq, roundScore } from './game/pitch.js'
import { mulberry32, newSeed } from './game/rng.js'
import { ROUNDS, PAUSE_MS } from './game/config.js'
import { buildChallengeUrl, readChallenge, clearChallenge } from './game/challenge.js'

// Petite pause entre deux écrans (écran noir, onde cachée)
function Pause({ ms, round, waveRef, onDone }) {
  useEffect(() => {
    waveRef.current = { ...waveRef.current, visible: false }
    const id = setTimeout(onDone, ms)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ms, round])
  return round ? <Hud round={round} /> : null
}

/*
  Déroulé (phase.screen) :
  Easy : listen i → pause → tune i → roundResult i → listen i+1 … → final
  Hard : listen 0 → pause → listen 1 … listen 4 → pause → tune 0 → tune 1 … tune 4 → final
*/
export default function App() {
  const waveRef = useRef({ pos: 0.5, visible: false })
  const [challenge, setChallenge] = useState(() => readChallenge())
  const [mode, setMode] = useState(challenge?.mode ?? 'easy')
  const [duration, setDuration] = useState(challenge?.duration ?? 4)
  const [debug, setDebug] = useState(false)
  const [game, setGame] = useState(null)
  const [phase, setPhase] = useState({ screen: 'home' })

  // Les écrans appellent ces fonctions plus tard : on garde le jeu à jour dans un ref
  const gameRef = useRef(game)
  gameRef.current = game

  function play() {
    try {
      unlockAudio() // doit se faire pendant l'appui sur le bouton
    } catch {
      alert('Sound is not available on this browser.')
      return
    }
    const seed = challenge ? challenge.seed : newSeed()
    const rnd = mulberry32(seed)
    const g = {
      seed,
      mode: challenge ? challenge.mode : mode,
      duration: challenge ? challenge.duration : duration,
      targets: Array.from({ length: ROUNDS }, () => posToFreq(rnd())),
      guesses: [],
      scores: [],
    }
    setGame(g)
    setPhase({ screen: 'listen', i: 0 })
  }

  function afterListen(i) {
    const g = gameRef.current
    if (g.mode === 'easy') setPhase({ screen: 'pause', i, ms: 400, next: { screen: 'tune', i } })
    else if (i < ROUNDS - 1) setPhase({ screen: 'pause', i, ms: PAUSE_MS, next: { screen: 'listen', i: i + 1 } })
    else setPhase({ screen: 'pause', i, ms: PAUSE_MS, next: { screen: 'tune', i: 0 } })
  }

  function afterLock(i, guess) {
    const g = gameRef.current
    const guesses = [...g.guesses]
    const scores = [...g.scores]
    guesses[i] = guess
    scores[i] = roundScore(g.targets[i], guess)
    setGame({ ...g, guesses, scores })

    if (g.mode === 'easy') setPhase({ screen: 'roundResult', i })
    else if (i < ROUNDS - 1) setPhase({ screen: 'pause', i: null, ms: 250, next: { screen: 'tune', i: i + 1 } })
    else setPhase({ screen: 'final' })
  }

  function afterRoundResult(i) {
    if (i < ROUNDS - 1) setPhase({ screen: 'listen', i: i + 1 })
    else setPhase({ screen: 'final' })
  }

  function goHome() {
    clearChallenge()
    setChallenge(null)
    waveRef.current = { ...waveRef.current, visible: false }
    setPhase({ screen: 'home' })
  }

  // « Challenge a Friend » : partage natif sur mobile, sinon copie du lien
  async function shareChallenge(total) {
    const g = gameRef.current
    const url = buildChallengeUrl({ mode: g.mode, duration: g.duration, seed: g.seed, total })
    const text = `I scored ${total.toFixed(2)}/50 on Hertz of Gold. Can you beat me?`
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Hertz of Gold', text, url })
        return ''
      }
    } catch (e) {
      if (e?.name === 'AbortError') return '' // partage annulé
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`)
      return 'Link copied! Paste it to your friend.'
    } catch {
      return url
    }
  }

  // Écran d'accueil : on cache l'onde
  useEffect(() => {
    if (phase.screen === 'home' || phase.screen === 'final') {
      waveRef.current = { ...waveRef.current, visible: false }
    }
  }, [phase.screen])

  let screen = null
  switch (phase.screen) {
    case 'home':
      screen = (
        <Home
          challenge={challenge}
          mode={mode}
          duration={duration}
          debug={debug}
          onMode={setMode}
          onDuration={setDuration}
          onDebug={setDebug}
          onPlay={play}
        />
      )
      break
    case 'listen':
      screen = (
        <Listen
          key={`listen-${phase.i}`}
          index={phase.i}
          freq={game.targets[phase.i]}
          duration={game.duration}
          waveRef={waveRef}
          onDone={() => afterListen(phase.i)}
        />
      )
      break
    case 'pause':
      screen = (
        <Pause
          key={`pause-${phase.next.screen}-${phase.next.i}`}
          ms={phase.ms}
          round={phase.i != null ? `${phase.i + 1}/${ROUNDS}` : null}
          waveRef={waveRef}
          onDone={() => setPhase(phase.next)}
        />
      )
      break
    case 'tune':
      screen = (
        <Tune
          key={`tune-${phase.i}`}
          index={phase.i}
          waveRef={waveRef}
          debug={debug}
          onLock={(guess) => afterLock(phase.i, guess)}
        />
      )
      break
    case 'roundResult':
      screen = (
        <RoundResult
          key={`result-${phase.i}`}
          index={phase.i}
          target={game.targets[phase.i]}
          guess={game.guesses[phase.i]}
          score={game.scores[phase.i]}
          waveRef={waveRef}
          onNext={() => afterRoundResult(phase.i)}
        />
      )
      break
    case 'final':
      screen = (
        <Final
          scores={game.scores}
          challenge={challenge}
          onChallenge={shareChallenge}
          onClose={goHome}
          onAgain={goHome}
        />
      )
      break
    default:
      break
  }

  return (
    <>
      <Wave waveRef={waveRef} />
      {screen}
    </>
  )
}
