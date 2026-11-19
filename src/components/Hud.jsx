// Affichage du haut : « 1/5 » à gauche, gros nombre et petit texte à droite
export function BigNumber({ value }) {
  const [int, dec] = value.toFixed(2).split('.')
  return (
    <div className="big">
      {int}
      <span className="dec">.{dec}</span>
    </div>
  )
}

export default function Hud({ round, value, sub, phrase }) {
  return (
    <>
      {round && <div className="round">{round}</div>}
      {value != null && <BigNumber value={value} />}
      {sub && <div className={phrase ? 'bigSub phrase' : 'bigSub'}>{sub}</div>}
    </>
  )
}
