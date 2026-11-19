export const roundPhrase = (s) =>
  s >= 9.8 ? 'Perfect pitch. Respect.'
  : s >= 9 ? 'Dialed in.'
  : s >= 7 ? 'So close.'
  : s >= 4 ? 'In the neighbourhood.'
  : s >= 1.5 ? 'Not quite. Keep listening.'
  : 'Were your headphones on?'

export const finalPhrase = (t) =>
  t >= 49 ? 'Fifty out of fifty? Your ears are made of gold.'
  : t >= 42 ? 'Golden ears. Seriously good.'
  : t >= 32 ? 'Solid. Your ears are warming up.'
  : t >= 20 ? 'Not bad. Practice makes pitch.'
  : 'Rough one. Try again with headphones.'
