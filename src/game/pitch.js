import { FMIN, FMAX } from './config.js'

// Échelle ERB : mesure la hauteur comme l'oreille la perçoit
export const erb = (f) => 21.4 * Math.log10(1 + 0.00437 * f)
const erbInv = (e) => (Math.pow(10, e / 21.4) - 1) / 0.00437

const E_MIN = erb(FMIN)
const E_MAX = erb(FMAX)

// pos : 0 = le plus grave, 1 = le plus aigu
export const posToFreq = (pos) => erbInv(E_MIN + pos * (E_MAX - E_MIN))
export const freqToPos = (f) => (erb(f) - E_MIN) / (E_MAX - E_MIN)

// Score d'une manche, de 0 à 10.
// Deux courbes en cloche : une étroite (récompense le presque parfait)
// et une large (points partiels). On garde la meilleure.
export function roundScore(target, guess) {
  const d = Math.abs(erb(target) - erb(guess)) / (E_MAX - E_MIN)
  const sharp = Math.exp(-Math.pow(d / 0.02, 2))
  const gentle = 0.7 * Math.exp(-Math.pow(d / 0.12, 2))
  return 10 * Math.max(sharp, gentle)
}
