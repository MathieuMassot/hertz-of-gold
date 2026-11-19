import { useEffect, useState } from 'react'
import Hud from '../components/Hud.jsx'
import { startTone } from '../game/audio.js'
import { freqToPos } from '../game/pitch.js'
import { ROUNDS } from '../game/config.js'

// Écoute : le son joue pendant `duration` secondes avec un compte à rebours
export default function Listen({ index, freq, duration, waveRef, onDone }) {
  const [left, setLeft] = useState(duration)

  useEffect(() => {
    waveRef.current = { pos: freqToPos(freq), visible: true }
    const tone = startTone(freq)
    const t0 = performance.now()
    const ms = duration * 1000
    let raf = 0
    let finished = false

    const tick = () => {
      const remaining = Math.max(0, ms - (performance.now() - t0))
      setLeft(remaining / 1000)
      if (remaining > 0) {
        raf = requestAnimationFrame(tick)
      } else if (!finished) {
        finished = true
        tone.stop()
        onDone()
      }
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      tone.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, freq, duration])

  return <Hud round={`${index + 1}/${ROUNDS}`} value={left} sub="memorize" />
}
