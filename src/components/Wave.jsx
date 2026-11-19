import { useEffect, useRef } from 'react'

// Onde lumineuse animée au centre de l'écran.
// waveRef.current = { pos: 0..1 (hauteur du son), visible: true/false }
// On lit le ref à chaque image : pas de re-rendu React pendant le glissé.
const STRANDS = 16

export default function Wave({ waveRef }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const cv = canvasRef.current
    const g = cv.getContext('2d')
    let W = 0, H = 0, raf = 0, shown = 0

    const strands = Array.from({ length: STRANDS }, (_, i) => ({
      ph: Math.random() * 6.28,
      ph2: Math.random() * 6.28,
      amp: 0.6 + Math.random() * 0.6,
      hue: [265, 230, 168][i % 3] + (Math.random() * 16 - 8),
    }))

    function resize() {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      W = window.innerWidth
      H = window.innerHeight
      cv.width = W * dpr
      cv.height = H * dpr
      g.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function draw(time) {
      const t = time / 1000
      const { pos, visible } = waveRef.current
      shown += ((visible ? 1 : 0) - shown) * 0.08

      g.globalCompositeOperation = 'source-over'
      g.fillStyle = '#000'
      g.fillRect(0, 0, W, H)

      if (shown > 0.01) {
        const cx = W / 2
        const glow = g.createLinearGradient(cx - 90, 0, cx + 90, 0)
        glow.addColorStop(0, 'rgba(0,0,0,0)')
        glow.addColorStop(0.5, `rgba(60,90,255,${0.16 * shown})`)
        glow.addColorStop(1, 'rgba(0,0,0,0)')
        g.fillStyle = glow
        g.fillRect(cx - 90, 0, 180, H)

        g.globalCompositeOperation = 'lighter'
        const wavelength = 300 - pos * 250 // grave = larges vagues, aigu = vagues serrées
        const k = (Math.PI * 2) / wavelength
        const speed = 1.2 + pos * 4
        const baseA = Math.min(70, W * 0.12)

        for (const s of strands) {
          g.beginPath()
          for (let y = -10; y <= H + 10; y += 6) {
            const env = 0.55 + 0.45 * Math.sin(y * 0.006 + t * 0.7 + s.ph2)
            const x = cx
              + baseA * s.amp * env * Math.sin(y * k - t * speed + s.ph)
              + 12 * Math.sin(y * k * 0.37 + t * 0.9 + s.ph2)
            if (y === -10) g.moveTo(x, y)
            else g.lineTo(x, y)
          }
          g.strokeStyle = `hsla(${s.hue}, 85%, 62%, ${0.35 * shown})`
          g.lineWidth = 1.2
          g.stroke()
        }
      }
      raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [waveRef])

  return <canvas ref={canvasRef} className="wave" />
}
