import { VOLUME, FADE } from './config.js'

let ctx = null

// À appeler pendant un appui (sinon les navigateurs mobiles bloquent le son)
export function unlockAudio() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

// Joue un son pur. Renvoie { set(freq), stop() }.
export function startTone(freq) {
  const c = unlockAudio()
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0, c.currentTime)
  gain.gain.linearRampToValueAtTime(VOLUME, c.currentTime + FADE)
  osc.connect(gain).connect(c.destination)
  osc.start()

  let stopped = false
  return {
    set(f) {
      if (!stopped) osc.frequency.setTargetAtTime(f, c.currentTime, 0.01)
    },
    stop() {
      if (stopped) return
      stopped = true
      const t = c.currentTime
      gain.gain.cancelScheduledValues(t)
      gain.gain.setValueAtTime(gain.gain.value, t)
      gain.gain.linearRampToValueAtTime(0, t + FADE)
      osc.stop(t + FADE + 0.02)
    },
  }
}
