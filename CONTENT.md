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
7. Spinosaurus: ~14 m (estimates 12-15), Cretaceous North Africa; tall back sail, fish eater (Ibrahim et al. 2014, 2020; Wikipedia).
8. Ankylosaurus: ~6-8 m, Late Cretaceous; bony armor plates (osteoderms) and tail club (Arbour & Mallon 2017; NHM).
9. Diplodocus: ~24-26 m, Late Jurassic; very long whip-like tail; a school bus is ~12 m (Wikipedia; Carnegie Museum).
10. Parasaurolophus: ~9.5 m, Late Cretaceous; hollow tube crest likely made low honking sounds (Weishampel 1981; Wikipedia).
11. Allosaurus: ~8.5-9.7 m, Late Jurassic (~150 Mya), ~80 million years before T. rex; apex predator of the Morrison Formation (Wikipedia; NHM).
12. Pachycephalosaurus: ~4.5 m, Late Cretaceous; thick domed skull roof up to ~25 cm (Wikipedia; NHM).
13. Iguanodon: ~10 m, Early Cretaceous Europe; conical thumb spike (NHM Dino Directory; Wikipedia).
14. Dilophosaurus: ~7 m, Early Jurassic; pair of thin head crests; real animal had no neck frill and was larger than the movie version (Marsh & Rowe 2020).
15. Archaeopteryx: ~0.5 m, Late Jurassic Germany; feathered wings plus teeth, claws and bony tail (NHM London specimen; Wikipedia).
16. Gallimimus: ~6 m, Late Cretaceous Mongolia; ostrich-like ornithomimid built for running, likely omnivore (Wikipedia; AMNH).
17. Oviraptor: ~1.6-2 m, Late Cretaceous Mongolia; named "egg thief" in 1924 because the fossil lay on a nest; the eggs proved to be its own kind's, and close relatives were found brooding nests (Norell et al. 1994, 1995; AMNH).
18. Coelophysis: ~3 m, Late Triassic; a Coelophysis skull from Carnegie Museum flew on Space Shuttle Endeavour (STS-89, 1998) (Carnegie Museum; Wikipedia).
19. Plateosaurus: ~5-10 m (typical ~8 m), Late Triassic Europe; walked on two legs, grasping hands (Mallison 2010; Wikipedia).
20. Eoraptor: ~1 m, ~10 kg, Late Triassic Argentina (~231 Mya), one of the earliest known dinosaurs; mixed teeth suggest omnivore (Sereno et al. 1993; Wikipedia).
