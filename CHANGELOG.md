# Changelog

## v1.0 (2026-10-15)

First release of Dino Explorer: a web app that teaches children aged 4 to 8 the names of 20 prehistoric animals, with no reading needed.

**Play it:** https://iliyab09.github.io/dino-exporer/

### Learn
- **20 animals**: 19 dinosaurs plus Pteranodon (a flying reptile). They span the Triassic, Jurassic and Cretaceous, with plant-eaters, meat-eaters and omnivores, in 3 difficulty tiers.
- Every dino has a hand-drawn SVG picture, a kid-friendly pronunciation, what its name means, diet, period, size compared with cats, beds or cars, and **two fun facts**. Every fact is checked against museum and science sources (see `CONTENT.md`).
- **Tap to hear**: names, fun facts, diet, period and meaning are all spoken aloud. Syllable buttons say a name one piece at a time, using sounds that every voice can say.
- Long names wrap between syllables, never cut off with "…".

### Play
- **4 games**, each ending on a 1 to 3 star reward screen:
  - **Name Quiz**: "Which one is the ...?" Pick the right dino from the pictures.
  - **Memory Match**: flip cards to find pairs, and each name is spoken on the flip.
  - **Egg Hatch**: tap an egg 3 times to hatch a baby dino.
  - **Dino Snacks**: did it eat plants or meat?
- **Sticker book**: every 3 stars unlocks a new dino sticker, which flies into the book on the reward screen.
- Stars and progress are saved on the device (`localStorage`). No accounts, no ads, no tracking.

### Install and offline
- Installable to the home screen (PWA) with the T. rex icon, and works offline after the first visit.

### Look and feel
- Bright flat art for all 20 dinos, a T. rex app icon and favicon, and a social preview image.
- Built for phones and tablets: big tap targets and native-feeling touch and motion.

### Accessibility
- No reading required: every name, question and cheer is spoken (Web Speech API).
- Large buttons with spoken labels and screen-reader labels, and one heading per screen.
- Respects "reduce motion".
- Gentle feedback: wrong answers say "Try again!", never "Wrong!".

### Under the hood
- Vite + React 19 + TypeScript static site, with no backend.
- CI runs lint, build and 200+ tests on every PR, covering data rules, art rules and game logic, and fails on leftover merge conflict markers.
- Manual GitHub Pages deploy workflow (runs only when started by hand).

### Not in this build yet
- The "For grown-ups" screen: its copy is ready (`src/data/about.ts`) but the screen isn't built yet.
- Levels (Dino Hatchling → Explorer → Expert): spoken lines are ready, but the level logic isn't built yet.
- Voice check on real phones: see `docs/DEVICE-CHECK.md`.
