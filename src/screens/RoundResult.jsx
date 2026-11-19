import { useEffect } from 'react'
import Hud from '../components/Hud.jsx'
import { freqToPos } from '../game/pitch.js'
import { roundPhrase } from '../game/phrases.js'
import { ROUNDS } from '../game/config.js'

// Résultat d'une manche (mode Easy uniquement)
export default function RoundResult({ index, target, guess, score, waveRef, onNext }) {
  useEffect(() => {
    waveRef.current = { pos: freqToPos(guess), visible: true }
  }, [guess, waveRef])

  return (
    <div className="layer">
      <Hud round={`${index + 1}/${ROUNDS}`} value={score} sub={roundPhrase(score)} phrase />
      <div className="hz hzTarget">
        <span>target</span>
        <b>{Math.round(target)}</b>
        <small>Hz</small>
      </div>
      <div className="hz hzYours">
        <span>yours</span>
        <b>{Math.round(guess)}</b>
        <small>Hz</small>
      </div>
      <button className="pill arrow" onClick={onNext}>→</button>
    </div>
  )
}
