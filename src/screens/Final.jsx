import { useState } from 'react'
import { finalPhrase } from '../game/phrases.js'

export default function Final({ scores, challenge, onChallenge, onClose, onAgain }) {
  const [message, setMessage] = useState('')
  const total = scores.reduce((a, b) => a + b, 0)
  const [int, dec] = total.toFixed(2).split('.')

  let vs = ''
  if (challenge) {
    const theirs = challenge.score.toFixed(2)
    vs = total > challenge.score ? `You beat your friend (${theirs}) 🏆`
      : total < challenge.score ? `Your friend wins with ${theirs}. Revenge?`
      : 'Perfect tie!'
  }

  async function challengeFriend() {
    setMessage(await onChallenge(total))
  }

  return (
    <div className="panel final">
      <button className="close" onClick={onClose} aria-label="Close">✕</button>
      <div className="title" style={{ marginTop: 6 }}>results</div>
      <div className="tag">{finalPhrase(total)}</div>

      <div className="total">
        <span className="i">{int}</span>
        <span className="d">.{dec}</span>
        <span className="of">/50</span>
      </div>

      <div className="rounds">
        {scores.map((s, i) => (
          <div key={i}>
            <span>R{i + 1}</span>
            <b>{s.toFixed(2)}</b>
          </div>
        ))}
      </div>

      {vs && <div className="vs">{vs}</div>}

      <button className="wide" onClick={challengeFriend}>Challenge a Friend</button>
      <div className="copied">{message}</div>

      <div className="spacer" />
      <button className="wide ghost" onClick={onAgain}>Play again</button>
    </div>
  )
}
