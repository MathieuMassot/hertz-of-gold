import { useEffect, useRef, useState } from 'react'
import Hud from '../components/Hud.jsx'
import { startTone } from '../game/audio.js'
import { posToFreq } from '../game/pitch.js'
import { ROUNDS } from '../game/config.js'

// Accélération : doigt lent = réglage fin, doigt rapide = grands sauts
// v = vitesse du doigt en pixels par milliseconde
const gainFor = (v) => 0.08 + 1.6 * (1 - Math.exp(-Math.pow(v / 0.9, 1.5)))

// Réglage : le son tourne en continu jusqu'à « Lock In ».
// On glisse le doigt n'importe où sur l'écran : vers le haut = plus aigu.
export default function Tune({ index, waveRef, debug, onLock }) {
  const posRef = useRef(0.5)
  const toneRef = useRef(null)
  const drag = useRef({ y: null, t: 0, speed: 0 })
  const [hz, setHz] = useState(Math.round(posToFreq(0.5)))

  useEffect(() => {
    posRef.current = 0.5
    waveRef.current = { pos: 0.5, visible: true }
    toneRef.current = startTone(posToFreq(0.5))
    return () => toneRef.current?.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  function onPointerDown(e) {
    if (e.target.closest('button')) return
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { y: e.clientY, t: e.timeStamp, speed: 0 }
  }

  function onPointerMove(e) {
    const d = drag.current
    if (d.y === null) return
    const dy = d.y - e.clientY
    const dt = Math.max(1, e.timeStamp - d.t)
    d.speed = d.speed * 0.6 + (Math.abs(dy) / dt) * 0.4 // vitesse lissée
    d.y = e.clientY
    d.t = e.timeStamp

    const pos = Math.min(1, Math.max(0, posRef.current + (dy / window.innerHeight) * gainFor(d.speed)))
    posRef.current = pos
    waveRef.current = { pos, visible: true }
    toneRef.current?.set(posToFreq(pos))
    if (debug) setHz(Math.round(posToFreq(pos)))
  }

  function onPointerUp() {
    drag.current.y = null
  }

  function lock() {
    toneRef.current?.stop()
    onLock(posToFreq(posRef.current))
  }

  return (
    <div
      className="layer tune"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <Hud round={`${index + 1}/${ROUNDS}`} />
      {debug && <div className="hzDebug">{hz} Hz</div>}
      <button className="pill" onClick={lock}>
        <span className="dot" />
        Lock In
      </button>
    </div>
  )
}
