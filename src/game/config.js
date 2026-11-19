// Réglages du jeu (voir le cahier des charges)
export const FMIN = 100        // fréquence la plus grave, en Hz
export const FMAX = 1400       // fréquence la plus aiguë, en Hz
export const ROUNDS = 5        // nombre de sons par partie
export const DURATIONS = { short: 1, long: 4 }   // durée d'écoute, en secondes
export const PAUSE_MS = 1000   // pause entre deux sons en mode Hard
export const VOLUME = 0.25     // volume des sons (0 à 1)
export const FADE = 0.025      // fondu en secondes, évite les « clics »
