# CONTENT.md - Dino Exporer dataset

Owner: Rex (Content Lead). Data lives in `src/data/dinos.ts` (`DINOS: Dino[]`, type in `src/data/types.ts`).

## Final id list (20)

Order in `DINOS` follows this table. The first 6 are the M1 set. Art file = `public/dinos/<id>.svg`.

| # | id | Period | Diet | Tier | Color |
|---|---|---|---|---|---|
| 1 | `tyrannosaurus-rex` | Cretaceous | carnivore | 1 | `#E53935` red |
| 2 | `triceratops` | Cretaceous | herbivore | 1 | `#EF6C00` orange |
| 3 | `stegosaurus` | Jurassic | herbivore | 1 | `#43A047` green |
| 4 | `brachiosaurus` | Jurassic | herbivore | 1 | `#1E88E5` blue |
| 5 | `velociraptor` | Cretaceous | carnivore | 1 | `#8E24AA` purple |
| 6 | `pteranodon` | Cretaceous | carnivore | 1 | `#0097A7` cyan |
| 7 | `spinosaurus` | Cretaceous | carnivore | 1 | `#D81B60` magenta |
| 8 | `ankylosaurus` | Cretaceous | herbivore | 1 | `#795548` brown |
| 9 | `diplodocus` | Jurassic | herbivore | 2 | `#3949AB` indigo |
| 10 | `parasaurolophus` | Cretaceous | herbivore | 2 | `#00897B` teal |
| 11 | `allosaurus` | Jurassic | carnivore | 2 | `#546E7A` slate |
| 12 | `pachycephalosaurus` | Cretaceous | herbivore | 2 | `#880E4F` wine |
| 13 | `iguanodon` | Cretaceous | herbivore | 2 | `#827717` olive |
| 14 | `dilophosaurus` | Jurassic | carnivore | 2 | `#C77700` amber |
| 15 | `archaeopteryx` | Jurassic | carnivore | 2 | `#0277BD` ocean blue |
| 16 | `gallimimus` | Cretaceous | omnivore | 3 | `#F4511E` red-orange |
| 17 | `oviraptor` | Cretaceous | omnivore | 3 | `#EC407A` pink |
| 18 | `coelophysis` | Triassic | carnivore | 3 | `#BF360C` rust |
| 19 | `plateosaurus` | Triassic | herbivore | 3 | `#689F38` leaf green |
| 20 | `eoraptor` | Triassic | omnivore | 3 | `#AB47BC` orchid |

Mix: Triassic 3, Jurassic 6, Cretaceous 11. Herbivore 9, carnivore 8, omnivore 3. Tier 1: 8, tier 2: 7, tier 3: 5.

## Data rules

- `syllables.join('')` equals `name` with spaces removed (case-sensitive). Example: `["Ty","ran","no","saur","us","rex"]` -> "Tyrannosaurus rex".
- `pronunciation`: lower-case hyphenated sounds, stressed syllable in CAPS ("try-SAIR-uh-tops").
- `funFact`: one sentence, max 90 characters, simple words a 5 year old knows, true.
- `lengthMeters`: typical adult nose-to-tail length, rounded. Exception: `pteranodon` uses wingspan (it is a flying reptile).
- `color`: bright, distinct, at least 3:1 contrast on white (usable as card border/header with white text).
- Not-dinosaur note: Pteranodon is a pterosaur, a flying reptile cousin of dinosaurs, not a dinosaur. Its fact says so on purpose.

## Sources (one line each)

General: Natural History Museum London "Dino Directory" (nhm.ac.uk/discover/dino-directory), Wikipedia genus articles, Smithsonian NMNH Deep Time, AMNH dinosaur pages.

1. Tyrannosaurus rex: ~12 m, Late Cretaceous North America; largest teeth ~30 cm with root ("banana-sized"), strongest bite of any land animal (Wikipedia; Gignac & Erickson 2017).
2. Triceratops: ~9 m, Late Cretaceous; two brow horns + nose horn, bony frill (NHM Dino Directory).
3. Stegosaurus: ~9 m, Late Jurassic; back plates + tail spikes ("thagomizer") used in defense (NHM; Wikipedia).
4. Brachiosaurus: ~18-22 m, Late Jurassic; long neck held high to browse treetops (Wikipedia; Field Museum).
5. Velociraptor: ~1.5-2 m, turkey-sized, quill knobs show feathers (Turner et al. 2007; AMNH).
6. Pteranodon: wingspan ~6 m (males up to ~7 m), toothless, fish eater, pterosaur not dinosaur (Wikipedia; AMNH).
7-20: sources added with full entries in PR 2.

## Spoken UI copy

`src/data/phrases.ts` (`PHRASES`, `pickPraise()`) holds every line the app says besides dino data. Screens and games use it instead of hard-coded strings. Rules: short, cheerful, words a 4 year old knows, never scold ("Try again!", not "Wrong!"). Ask Rex to add or change a line.
