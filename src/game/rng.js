// Générateur de hasard « à graine » : la même graine donne toujours les mêmes nombres.
// C'est ce qui permet à un ami de rejouer exactement les mêmes 5 sons.
export function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const newSeed = () => Math.floor(Math.random() * 1e9)
