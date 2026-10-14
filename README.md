# Dino Exporer

a clolrful kids app that teaches a dinozaur names and with mini games

## Screenshots (375px phone)

| Home | Learn | Dino detail | Play |
|---|---|---|---|
| ![Home](docs/screenshots/home.png) | ![Learn](docs/screenshots/learn.png) | ![Dino detail](docs/screenshots/detail.png) | ![Play](docs/screenshots/play.png) |

| Name Quiz | Memory Match | Egg Hatch |
|---|---|---|
| ![Name Quiz](docs/screenshots/game-name-quiz.png) | ![Memory Match](docs/screenshots/game-memory-match.png) | ![Egg Hatch](docs/screenshots/game-egg-hatch.png) |

To regenerate: `npm run build && npx vite preview --port 4179`, then in another shell `npm install --no-save playwright-core && node docs/screenshots/capture.mjs` (uses the system Chrome; set `CHROME=/path/to/chrome` if needed).
