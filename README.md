# Dino Exporer

**▶ [Play it: iliyab09.github.io/dino-exporer](https://iliyab09.github.io/dino-exporer/)** (works on phones and tablets, and can be installed to the home screen)

Dino Explorer is a colorful web app that teaches children aged 4 to 8 the names of 20 prehistoric animals, from Tyrannosaurus rex to Eoraptor. Kids don't need to read: every name, syllable and fun fact is spoken aloud, and big buttons plus short games (Name Quiz, Memory Match, Egg Hatch) turn listening into play. It runs in any phone or tablet browser with no accounts, ads or tracking, and saves progress only on the device.

## Screenshots (375px phone)

| Home | Learn | Dino detail | Play |
|---|---|---|---|
| ![Home](docs/screenshots/home.png) | ![Learn](docs/screenshots/learn.png) | ![Dino detail](docs/screenshots/detail.png) | ![Play](docs/screenshots/play.png) |

| Name Quiz | Memory Match | Egg Hatch | Dino Snacks |
|---|---|---|---|
| ![Name Quiz](docs/screenshots/game-name-quiz.png) | ![Memory Match, two cards turned over](docs/screenshots/game-memory-match-mid.png) | ![Egg Hatch, first crack](docs/screenshots/game-egg-hatch-mid.png) | ![Dino Snacks](docs/screenshots/game-dino-snacks.png) |

| Sticker book |
|---|
| ![Sticker book](docs/screenshots/stickers.png) |

To regenerate: `npm run build && npx vite preview --port 4179`, then in another shell `npm install --no-save playwright-core && node docs/screenshots/capture.mjs` (uses the system Chrome; set `CHROME=/path/to/chrome` if needed).
