# Hertz of Gold

Écoute un son, puis retrouve-le de mémoire en glissant le doigt sur l'écran. 5 sons par partie, score sur 50.
Copie mobile du jeu de sons de GuessTheSound / Dialed, pour jouer entre amis, sans pubs.

## Lancer le projet sur le PC

```bash
npm install
npm run dev
```

- Ouvre l'adresse `Local` affichée (ex. `http://localhost:5173`) dans ton navigateur.
- Pour tester sur ton téléphone : il doit être sur le même Wi-Fi que le PC. Ouvre l'adresse `Network` affichée
  (ex. `http://192.168.1.20:5173`).
- En mode dev, une case « Show Hz while tuning » apparaît sur l'accueil pour voir les Hz pendant le réglage.
  Elle disparaît dans la version en ligne.

## Mettre en ligne sur Vercel (gratuit)

1. Crée un dépôt GitHub `hertz-of-gold` et envoie le projet :
   ```bash
   git init
   git add .
   git commit -m "Hertz of Gold V1"
   git branch -M main
   git remote add origin https://github.com/MathieuMassot/hertz-of-gold.git
   git push -u origin main
   ```
2. Va sur vercel.com, connecte-toi avec ton compte GitHub.
3. **Add New → Project**, choisis le dépôt `hertz-of-gold`. Vercel reconnaît Vite tout seul : clique sur **Deploy**.
4. Dans **Settings → Domains**, mets `hertz-of-gold.vercel.app` (ou un nom proche s'il est pris).
5. Ensuite, chaque `git push` met le site à jour automatiquement.

Sur le téléphone, ouvre le site puis « Ajouter à l'écran d'accueil » : il s'ouvre comme une vraie appli.

## Où changer les réglages

| Quoi | Fichier |
|---|---|
| Plage de fréquences, durées, nombre de sons, volume | `src/game/config.js` |
| Calcul du score (courbes ERB) | `src/game/pitch.js` |
| Sensibilité du glissé (lent = fin, rapide = grand) | `gainFor` dans `src/screens/Tune.jsx` |
| Petites phrases des résultats | `src/game/phrases.js` |
| Couleurs et mise en page | `src/styles.css` |
| Animation de l'onde | `src/components/Wave.jsx` |

## Lien de défi

`https://hertz-of-gold.vercel.app/?c=e-4-123456789-3864`
= mode Easy (`e`) ou Hard (`h`), durée 1 ou 4 s, graine des 5 sons, score de l'ami × 100.
