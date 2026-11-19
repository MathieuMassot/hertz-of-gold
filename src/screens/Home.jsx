function Seg({ options, value, onChange }) {
  return (
    <div className="seg">
      {options.map((o) => (
        <button key={o.value} className={o.value === value ? 'on' : ''} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

export default function Home({ challenge, mode, duration, debug, onMode, onDuration, onDebug, onPlay }) {
  return (
    <div className="panel">
      <div>
        <div className="title">hertz<br />of gold</div>
        <div className="tag" style={{ marginTop: 10 }}>Listen. Remember. Find it again.</div>
      </div>

      {challenge ? (
        <div className="defi">
          <div className="lab">Challenge</div>
          <div>
            Your friend scored <b>{challenge.score.toFixed(2)}</b> <span className="muted">/50</span>
          </div>
          <div className="tag" style={{ marginTop: 4 }}>
            {challenge.mode === 'hard' ? 'Hard' : 'Easy'} · {challenge.duration === 1 ? 'Short 1s' : 'Long 4s'} · same 5 sounds
          </div>
        </div>
      ) : (
        <div>
          <div className="lab">Mode</div>
          <Seg
            value={mode}
            onChange={onMode}
            options={[{ value: 'easy', label: 'Easy' }, { value: 'hard', label: 'Hard' }]}
          />
          <div className="lab" style={{ marginTop: 18 }}>Listening time</div>
          <Seg
            value={duration}
            onChange={onDuration}
            options={[{ value: 1, label: 'Short · 1s' }, { value: 4, label: 'Long · 4s' }]}
          />
        </div>
      )}

      <div className="spacer" />
      <div className="tip">🎧 Headphones recommended. On iPhone, turn off silent mode.</div>
      {import.meta.env.DEV && (
        <label className="chk">
          <input type="checkbox" checked={debug} onChange={(e) => onDebug(e.target.checked)} /> Show Hz while tuning (dev only)
        </label>
      )}
      <button className="wide" onClick={onPlay}>
        {challenge ? 'Accept the challenge' : 'Play'}
      </button>
    </div>
  )
}
