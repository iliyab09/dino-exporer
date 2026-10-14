# QA.md - Dino Explorer

Owner: Quinn (QA). One section per milestone, newest first. Severity: **High** = a kid or parent hits it in normal use and it breaks a product rule; **Medium** = visible quality problem or a rule bent; **Low** = polish.

## M1 end-to-end pass (2026-10-15, main @ 89fedc2)

### How it was tested
- Production build (`npm run build` + `vite preview`), headless Chromium via Playwright, touch emulation, at **375x667** (small phone) and **768x1024** (tablet). Spot checks at 375x812.
- `speechSynthesis` stubbed to record every utterance, so each screen's spoken lines are checked exactly. Real voice quality cannot be judged headless (see device checklist).
- Flow on both sizes: Home -> star chip / title -> Learn (all 20 cards) -> every one of the 20 Dino detail pages via the next arrow -> syllable chips, fun fact, diet/meaning/period, size -> phone back x2 -> Play -> Name Quiz (wrong + right answers, 5 rounds) -> Reward -> Play again -> Back -> Memory Match (full game) -> Reward -> Done -> reload. Egg Hatch (merged as #16 during the pass): hatch -> Back -> Reward.
- Each screen gets: horizontal/vertical overflow, every tap target measured (rule: 64px+), clipped text, broken/placeholder images, unnamed buttons, axe-core (WCAG 2.0/2.1/2.2 A+AA + best practice), console errors, failed requests.

### Summary
M1 works end to end at both sizes with **0 console errors, 0 failed requests, 0 horizontal overflow, 0 tap targets under 64px, 0 unnamed buttons, and 0 placeholder or broken images** across all 20 dinos. Speech fires on every action, and every dino name is spoken. Progress persists in localStorage across reloads (Home star chip shows the total). The phone back button walks Dino -> Learn -> Home correctly. Nothing needs reading to navigate, and no copy uses fail wording. JS bundle is 76 KB gzipped, `dist/` is 420 KB in total.

### Findings, ranked

| # | Sev | Finding | Where | Owner |
|---|---|---|---|---|
| 1 | **High** | **Egg Hatch ends on a "low score" reward.** Back after hatching shows 1 gold + 2 grey stars and says "Good try! You got one star!" in a game a kid cannot lose. The game's `message` ("You hatched 2 baby dinosaurs!") is ignored by RewardScreen. Repro: Play -> Egg Hatch -> tap egg 3x -> Back. | `src/screens/RewardScreen.tsx`, `src/games/egg-hatch/EggHatchGame.tsx` | Sam (show + speak `message`), Nova (`stars: 3`) |
| 2 | **Medium** | **Learn gallery truncates 6 of 20 names with an ellipsis** at both phone and tablet sizes: "Tyrannosau...", "Brachiosaur...", Parasaurolophus, Pachycephalosaurus, Dilophosaurus, Archaeopteryx. DESIGN.md requires a 2-line wrap with no ellipsis so kids see the whole word shape. | `src/components/DinoCard.css` (`.dino-card__name`), use `--text-card` + `overflow-wrap:anywhere` | Sam |
| 3 | **Medium** | **Speaker button covers the dino's face** on gallery cards at 375px (T. rex and Triceratops heads sit under the round 🔊). The face is what kids recognise. | `DinoCard.css` speaker anchor position, or art padding | Sam + Pixel |
| 4 | **Medium** | **Device-only speech risks are unverified.** Syllable chips speak lower-case phonetic chunks (`try / sair / uh / tops`, `ee`, `ih`, `ix`). Some voices may spell short chunks letter by letter or mispronounce "sair". iOS Safari also only allows speech after a user gesture; the first quiz question is spoken from an effect right after the tap. Needs a real iPhone + Android check (checklist below). | `src/lib/syllables.ts`, `src/lib/speech.ts`, `CONTENT.md` | Client test -> Rex (respell) / Sam |
| 5 | **Medium** | **Accessibility (axe):** Home title button has `aria-label="Dino Explorer"` but its visible text is letter spans (`label-content-name-mismatch`, rated serious). No `<h1>` on Home, Learn, Play, games, or Reward (moderate). The Dino detail page has 0 violations. | `HomeScreen.tsx` (add `aria-hidden` on letters), visually hidden `<h1>` per screen | Sam |
| 6 | Low | All game screens are 32px taller than the viewport (699 on 667, 1056 on 1024), so the page scrolls/bounces slightly while kids tap cards. Likely `.screen` padding + `.game { min-height: 100dvh }`. | `src/games/shared/game.css`, `App.css` | Nova + Sam |
| 7 | Low | Home star chip says "You have 0 stars!" on first launch. Rex's #20 adds a gentler 0-star line; switch the chip to `PHRASES.starCount`. | `HomeScreen.tsx` | Sam |
| 8 | Low | Learn cards repeat each name as img `alt` and visible text (axe `image-redundant-alt` x20); use `alt=""` inside the labelled button. | `DinoArt.tsx` / `DinoCard.tsx` | Sam |
| 9 | Low | `index.html` `theme-color` is still `#fff8e7`; the app background is now `#e6f6fd`. | `index.html` | Sam |
| 10 | Low | Dev-only: StrictMode makes the quiz say its first question twice. **Prod is correct** (spoken once, re-prompted after 6s idle). No action. | - | - |

### Verified OK (regression baseline)
- Speech per screen: title -> "Dino Explorer! Tap the book to learn. Tap the game to play."; Learn -> "Learn"; card tap and 🔊 -> name; chips -> phonetic chunks; 💬 -> fun fact; diet/meaning/period buttons -> PHRASES lines; size -> "It was about as long as 2 cars!" (wingspan wording for Pteranodon); next/prev -> the new dino's name; game tile -> game title; quiz -> "Which one is the X?" / "That's the X. Find the Y!" / "Yay! That's the X!"; Memory Match -> name on every flip, "You found two X!", "You found them all!"; reward -> PHRASES.stars line.
- localStorage after quiz + memory: `{"best":{"name-quiz":2,"memory-match":3},"totalStars":5}`; Egg Hatch uses `dino-explorer:eggs:v1`. Survives reload.
- Back: in-app ⬅️ and the browser/phone back both work, including after reload (route kept in `history.state`). "Play again" starts a fresh round.
- Reduced motion: confetti hidden, pops and wobbles disabled.
- Art: all 20 SVGs load on every detail page; none fall back to the placeholder.

### Device checklist for the client (cannot be tested headless)
1. iPhone Safari and an Android Chrome tablet: open the app, tap Learn, tap Triceratops, then tap each syllable chip. Does each chip sound like a syllable, or is any spelled out ("ee", "uh", "ih", "ix", "sair")? Tell Rex which ones.
2. On iPhone: Play -> Name Quiz. Is the first question spoken without an extra tap?
3. Sound effects play with the phone's silent switch off, and the volume is comfortable.
4. Rotate the tablet to landscape on the Learn and Memory Match screens.

### Next QA pass (M2/M3)
Sticker book, PWA/service worker (check that navigation is network-first or uses a versioned precache, so index.html is never served stale forever), offline load, and a repeat of this full pass.
