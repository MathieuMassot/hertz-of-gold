// Lien de défi : https://hertz-of-gold.vercel.app/?c=e-4-123456789-3864
//   e ou h  = Easy ou Hard
//   1 ou 4  = durée d'écoute en secondes
//   graine  = pour rejouer les mêmes 5 sons
//   score   = score de l'ami × 100 (3864 = 38.64)

export function buildChallengeUrl({ mode, duration, seed, total }) {
  const code = `${mode === 'hard' ? 'h' : 'e'}-${duration}-${seed}-${Math.round(total * 100)}`
  return `${window.location.origin}/?c=${code}`
}

export function readChallenge() {
  const code = new URLSearchParams(window.location.search).get('c')
  const m = code && /^(e|h)-(1|4)-(\d+)-(\d+)$/.exec(code)
  if (!m) return null
  return {
    mode: m[1] === 'h' ? 'hard' : 'easy',
    duration: Number(m[2]),
    seed: Number(m[3]),
    score: Number(m[4]) / 100,
  }
}

export function clearChallenge() {
  window.history.replaceState(null, '', window.location.pathname)
}
