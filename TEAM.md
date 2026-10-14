# TEAM.md - Dino Explorer

## Goal
A colorful web app for kids (ages 4 to 8) that teaches dinosaur names, with mini games.
Must run in a phone or tablet browser, work offline-ish (static site, no backend), and be fun in the first 10 seconds.
Kids this age mostly cannot read: every name must be spoken aloud (Web Speech API), buttons are big, and feedback is visual and sound-based.

## Milestones
1. **M1 - Walking skeleton (first):** app opens, shows a gallery of dinos with art, tap a dino to hear its name and see a fact. One game (Name Quiz) playable end to end. Builds clean (`npm run build`).
2. **M2 - Full content:** 20 dinos with art, facts, pronunciation. Memory Match game. Star rewards and a sticker book.
3. **M3 - Polish:** animations, sounds, PWA manifest, QA pass on phone sizes, deploy preview (client approves deploy).

## Stack (decided, do not change)
- Vite + React 19 + TypeScript. Plain CSS (CSS modules or one file per component). No UI framework.
- No backend. Static build in `dist/`. Progress saved in `localStorage`.
- Dino art = hand-made SVG files, one per dino, in `public/dinos/<id>.svg`. No downloaded images (licensing).
- Speech = `window.speechSynthesis` wrapped in `src/lib/speech.ts`. Sound effects = tiny WebAudio beeps in `src/lib/sfx.ts` (no audio files).
- `npm run dev` to run, `npm run build` must pass before any PR.

## Roles and ownership
| Agent | Role | Owns (files) |
|---|---|---|
| Rex | Content Lead (paleontology + kids copy) | `src/data/dinos.ts` (the dataset), `src/data/phrases.ts` (spoken UI copy), `CONTENT.md` |
| Pixel | Designer (SVG dino art + visual theme) | `public/dinos/*.svg`, `src/styles/theme.css`, `DESIGN.md` |
| Sam | Frontend Dev - app shell, Learn screen, speech, rewards | `src/App.tsx`, `src/main.tsx`, `src/screens/*`, `src/components/*`, `src/lib/*`, `index.html` |
| Nova | Frontend Dev - mini games | `src/games/*` |
| Quinn | QA + Code Reviewer | `tests/*`, `.github/workflows/*`, reviews every PR |
| Director | Coordination | `TEAM.md`, `src/data/types.ts` (contract; change only via PR reviewed by Quinn) |

If you need to touch a file you do not own, message the owner or the Director; do not just edit it. Shared contract: `src/data/types.ts`.

## Interfaces between streams
- **Dataset:** `src/data/dinos.ts` exports `export const DINOS: Dino[]` using the `Dino` type in `src/data/types.ts`. Rex ships 6 dinos first (for M1), then grows to 20.
- **Art:** each dino has `public/dinos/<id>.svg`, square viewBox `0 0 200 200`, transparent background, flat bold colors, friendly cartoon style, facing right. Pixel and Rex agree on the id list in `CONTENT.md` before drawing. Until art exists, the app shows `public/dinos/_placeholder.svg`.
- **Games:** every game is a React component `export default function <Name>Game(props: GameProps)` in `src/games/<name>/`, registered in `src/games/index.ts` as `{ id, title, emoji, component, minDinos }`. Sam's shell renders whatever is in that registry. Games never import from `src/screens` or `src/components` except `src/components/BigButton` and `src/components/DinoCard` once Sam publishes them.
- **Speech:** `speak(text)` from `src/lib/speech.ts` (Sam). Games get it via props, do not call speechSynthesis directly.
- **Theme:** CSS variables in `src/styles/theme.css` (Pixel): `--color-bg`, `--color-primary`, `--color-accent`, `--radius`, `--font-display`, and one `--dino-<id>` color per dino is NOT needed (use `dino.color` from data).

## M1 starting ids (Rex may adjust in CONTENT.md within 1 turn)
`tyrannosaurus-rex`, `triceratops`, `stegosaurus`, `brachiosaurus`, `velociraptor`, `pteranodon`

## Git workflow
- Work in your own worktree `.work/<name>` on branch `<name>/work`. Small topic branches off it are fine: `<name>/<topic>`.
- Commit often. `git push -u origin <branch>`. Open a PR into `main` with `gh pr create --base main`.
- Send the PR number to **Quinn** (reviewer). Quinn comments "APPROVED" or "CHANGES REQUESTED" via `gh pr review <n> --comment -b "..."`.
- After APPROVED, the PR owner merges: `gh pr merge <n> --squash --delete-branch`, then everyone runs `git fetch origin && git merge origin/main`.
- `npm run build` must pass before you open a PR. Never commit `node_modules` or `dist`.
- Never force-push. Never commit directly to main.

## Review gates
- Code (logic, games, lib, service worker, end-to-end): Quinn reviews for build, types, kid-UX (big tap targets, no reading required, speech on every name), accessibility, and runs it on a 375px wide viewport.
- Art, copy, docs (Pixel's SVGs, CONTENT.md, phrases, README, docs/): Rex reviews; renders SVGs and eyeballs them, checks copy at kid reading level.
- Data PRs by Rex (`dinos.ts`, `phrases.ts`): Quinn reviews, since tests depend on them.
- Docs-only or CSS-only trivial PRs: the Director may approve and merge directly.
- Merge: owner merges after APPROVED with `gh pr merge <n> --squash` (the repo auto-deletes merged branches; never use `--delete-branch`).

## Handoffs and reporting
- When you finish a task or get blocked, message the Director in 2 to 4 lines: what is done, PR link, what is next or what blocks you.
- Deadlines are in turns. If you will miss one, say so early.
