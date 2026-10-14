# DESIGN.md - Dino Exporer

Owner: Pixel (Designer). Variables live in `src/styles/theme.css`. Use the variables, never raw hex in components.

## Feel
Bright, flat, friendly. Like a picture book on a sunny day. Chunky shapes, thick dark outlines, big round eyes, no gradients. Every screen should feel tappable and safe; mistakes are met with a wobble and a soft color, never red alarm.

## Palette
| Token | Hex | Use |
|---|---|---|
| `--color-bg` | `#e6f6fd` | App background (pale picture-book sky) |
| `--color-surface` | `#ffffff` | Cards, panels |
| `--color-primary` | `#2bb673` | Main buttons, active state |
| `--color-primary-dark` | `#1d8a55` | Button bottom edge / pressed |
| `--color-accent` | `#ff8a3d` | Highlights, "next", selected card ring |
| `--color-accent-dark` | `#d9661c` | Accent pressed / bottom edge, white text OK |
| `--color-sky` | `#4cc3f5` | Secondary buttons (back, replay sound) |
| `--color-sky-dark` | `#2a9bd0` | Sky pressed / bottom edge, white text OK |
| `--color-sun` | `#ffd23f` | Stars and rewards |
| `--color-berry` | `#ef5da8` | Sticker book, fun pops |
| `--color-ink` | `#2d2a3e` | Text and outlines (also used in SVG art) |
| `--color-ink-soft` | `#6b6880` | Secondary text |
| `--color-oops` / `-bg` | `#ff6b6b` / `#ffe3e3` | Gentle "try again" |
| `--color-success-bg` | `#d8f5e5` | Correct answer flash |

Per-dino card color comes from `dino.color` in the data (Rex), a mid/saturated hue. The card's art panel uses a light tint of it so the outlined art pops: `background: color-mix(in srgb, var(--dino-color) 22%, white)` with `--dino-color` set inline from `dino.color`. Text on cards is always `--color-ink`. Each dino's art body uses the same hue family as its `dino.color`, so card and art read as one.

Contrast: white text only on `--color-primary-dark`, `--color-sky-dark`, `--color-accent-dark` or `--color-ink`. On `--color-primary`, `--color-accent`, `--color-sun` use `--color-ink` text.

## Typography
- Display (`--font-display`): rounded system fonts (Baloo 2 / Fredoka if installed, else Comic Sans MS / Chalkboard SE / Arial Rounded, else system-ui). Weight 800. No web font downloads.
- Body (`--font-body`): ui-rounded / system-ui.
- Sizes (rem = 16px, never change `html` font-size): `--text-sm` 16, `--text-md` 20, `--text-lg` 28 (button labels), `--text-card` 18-24 fluid (gallery card names), `--text-xl` 28-40 fluid (dino name on detail), `--text-xxl` 36-56 fluid (screen titles). Body text is 18px, set on `body`.
- Kids mostly can't read: text is a bonus, never the only cue. Every label sits next to an icon/emoji, and every dino name has a speaker button.

## Spacing
8px grid: `--space-1` 4, `--space-2` 8, `--space-3` 16, `--space-4` 24, `--space-5` 32, `--space-6` 48. Screen padding `--space-3` on phones (<600px), `--space-5` on tablets. Gap between cards `--space-3`.

## Shape and depth
- `--radius` 24px for cards and big buttons, `--radius-sm` 14px for small chips, `--radius-pill` for the speaker button and star counter.
- Outline: `--border-width` 4px in `--color-ink` on cards and buttons, matching the art's outlines.
- Depth is a solid offset shadow, no blur: `--shadow-card` (0 6px 0). Buttons use their dark shade as the bottom edge.

## Buttons
- Every tap target is at least **64 x 64px** (`--tap-min`). Primary actions (Play, Speak, quiz answers) are **88px** tall (`--tap-big`).
- At least `--space-2` (8px) between neighbouring tap targets; 16px preferred.
- Shape: rounded rect `--radius`, 4px ink border, solid fill, label `--font-display` `--text-lg`, emoji/icon on the left.
- Pressed: `transform: translateY(4px)` and shadow shrinks to 2px, over `--duration-fast`. Feels like a squishy physical button.
- Variants: primary (green), secondary (sky), accent (orange), icon-only round (64px circle, sky, speaker 🔊).
- Wrong answer: button turns `--color-oops-bg` and wobbles (rotate +-4deg x3). Right answer: `--color-success-bg`, scale to 1.08 with `--ease-bounce`, stars pop.

## Dino card (gallery + learn screen)
In words, top to bottom:
1. Card: white surface, 4px ink border, `--radius`, `--shadow-card`. Square-ish; phone gallery = 2 columns, tablet = 3-4 columns (`grid-template-columns: repeat(auto-fill, minmax(150px, 1fr))`).
2. Art panel: top ~70% of the card, background = `dino.color`, the SVG centered with ~8% padding, `object-fit: contain`. Rounded top corners only.
3. Name strip: bottom ~30%, dino name in `--font-display` at `--text-card` on gallery cards (`--text-xl` on the detail screen), centered. Allow up to 2 lines (`overflow-wrap: anywhere; line-height: 1.1`), no ellipsis: kids match the whole word shape. Must fit "Pachycephalosaurus" at 375px.
4. No speaker button on gallery cards: tapping the card says the name and opens the detail screen. (Every dino faces right with its head top-right, so an overlaid button would cover a face; QA #3.) The detail screen has the big 🔊 next to the name.
5. Detail screen: art large (up to 320px), name + pronunciation chips (one chip per syllable, each tappable, 64px tall), fun fact in a speech bubble with its own speaker button.

## Dino art rules (public/dinos/<id>.svg)
- `viewBox="0 0 200 200"`, transparent background, facing right, fills ~160px of the 200 box, feet near y=180.
- 4-6 flat colors: body, belly/lighter tone, accent (spots, plates, horns), eye white, ink `#2d2a3e` outline (stroke 4-5, round joins), optional cheek blush.
- Big round eye (white with ink pupil + small white glint), small smile. Friendly, never scary; T. rex shows a few teeth at most.
- Silhouette must read alone: horns + frill, back plates + tail spikes, long neck, wings + head crest, sickle claw + feathers, etc.
- No text, no gradients, no filters, no external references. Under ~6 KB each.
- Art body colors pair with the card's `dino.color`: art uses a mid/saturated tone, card uses a light tint, so the dino pops.

## Motion
- Card tap: quick squish (scale 0.95 then back with `--ease-bounce`).
- New screen: slide/fade `--duration-med`.
- Honour `prefers-reduced-motion` (durations drop to 0 in theme.css).
