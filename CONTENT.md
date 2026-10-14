# CONTENT.md - Dino Exporer dataset

Owner: Rex (Content Lead). Data lives in `src/data/dinos.ts` (`DINOS: Dino[]`, type in `src/data/types.ts`).

## Final id list (20)

Order in `DINOS` follows this table. The first 6 are the M1 set. Art file = `public/dinos/<id>.svg`.

| # | id | Period | Diet | Tier | Color |
|---|---|---|---|---|---|
| 1 | `tyrannosaurus-rex` | Cretaceous | carnivore | 1 | `#E53935` red |
| 2 | `triceratops` | Cretaceous | herbivore | 1 | `#FB8C00` orange |
| 3 | `stegosaurus` | Jurassic | herbivore | 1 | `#43A047` green |
| 4 | `brachiosaurus` | Jurassic | herbivore | 1 | `#1E88E5` blue |
| 5 | `velociraptor` | Cretaceous | carnivore | 1 | `#8E24AA` purple |
| 6 | `pteranodon` | Cretaceous | carnivore | 1 | `#00ACC1` cyan |
| 7 | `spinosaurus` | Cretaceous | carnivore | 1 | `#D81B60` magenta |
| 8 | `ankylosaurus` | Cretaceous | herbivore | 1 | `#795548` brown |
| 9 | `diplodocus` | Jurassic | herbivore | 2 | `#3949AB` indigo |
| 10 | `parasaurolophus` | Cretaceous | herbivore | 2 | `#00897B` teal |
| 11 | `allosaurus` | Jurassic | carnivore | 2 | `#546E7A` slate |
| 12 | `pachycephalosaurus` | Cretaceous | herbivore | 2 | `#AEEA00` lime |
| 13 | `iguanodon` | Cretaceous | herbivore | 2 | `#9E9D24` olive |
| 14 | `dilophosaurus` | Jurassic | carnivore | 2 | `#F9A825` gold |
| 15 | `archaeopteryx` | Jurassic | carnivore | 2 | `#E040FB` violet |
| 16 | `gallimimus` | Cretaceous | omnivore | 3 | `#FF7043` coral |
| 17 | `oviraptor` | Cretaceous | omnivore | 3 | `#F48FB1` light pink |
| 18 | `coelophysis` | Triassic | carnivore | 3 | `#BF360C` rust |
| 19 | `plateosaurus` | Triassic | herbivore | 3 | `#1DE9B6` mint |
| 20 | `eoraptor` | Triassic | omnivore | 3 | `#B388FF` lavender |

Mix: Triassic 3, Jurassic 6, Cretaceous 11. Herbivore 9, carnivore 8, omnivore 3. Tier 1: 8, tier 2: 7, tier 3: 5.

## Data rules

- `syllables.join('')` equals `name` with spaces removed (case-sensitive). Example: `["Ty","ran","no","saur","us","rex"]` -> "Tyrannosaurus rex".
- `pronunciation`: hyphenated sounds, stressed syllable in CAPS ("try-SARE-uh-tops"). It is not shown on screen: each syllable chip speaks its matching chunk (lower-cased), so chunks are 1:1 with `syllables`, at least 2 letters with a vowel, and real words where possible ("key", "sore", "oh", "us") so no TTS voice spells them out letter by letter. Syllable splits follow the sounds (Bra-chi-o-saur-us = brack-key-oh-sore-us).
- `funFact`: one sentence, max 90 characters, simple words a 5 year old knows, true.
- `funFact2`: optional second fact, same rules, about a different thing than `funFact` (the detail screen may rotate them). All 20 dinos have one.
- `lengthMeters`: typical adult nose-to-tail length, rounded. Exception: `pteranodon` uses wingspan and sets `sizeKind: 'wingspan'`. Archaeopteryx keeps body length (its wingspan is about the same, ~0.5-0.7 m).
- `color`: bright and distinct from the other 19 (checked by CIE Lab distance). Cards render a light tint of it with dark ink text, so it does not need to be dark.
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

## Sources for funFact2 (one line each)

1. Tyrannosaurus rex: two functional fingers per hand (Wikipedia; NHM).
2. Triceratops: dental batteries of several hundred stacked teeth for slicing plants (Wikipedia; Smithsonian).
3. Stegosaurus: ~150 Mya vs T. rex ~68 Mya, more time apart than T. rex is from us (NHM; Smithsonian).
4. Brachiosaurus: forelimbs longer than hindlimbs, giraffe-like stance; name means "arm lizard" (Wikipedia; Field Museum).
5. Velociraptor: enlarged sickle claw on the second toe of each foot (AMNH; Wikipedia).
6. Pteranodon: long backward-pointing skull crest (AMNH; Wikipedia).
7. Spinosaurus: ~14 m, longer than T. rex (~12 m) in most estimates, among the longest carnivorous dinosaurs (Ibrahim et al. 2020; Wikipedia).
8. Ankylosaurus: ~4.8-8 t; an African elephant is ~4-7 t (Arbour & Mallon 2017; Wikipedia).
9. Diplodocus: peg-like teeth stripped leaves; sauropods swallowed without chewing (Wikipedia; NHM).
10. Parasaurolophus: hadrosaur ("duck-billed") with a toothless beak at the front of the jaws (Wikipedia; NHM).
11. Allosaurus: pair of small horns above and in front of the eyes (Wikipedia; NHM).
12. Pachycephalosaurus: knobs and short spikes ringing the dome (Wikipedia; NHM).
13. Iguanodon: named 1825 by Mantell, the second dinosaur ever named (NHM; Wikipedia).
14. Dilophosaurus: ~7 m, among the largest land predators of the Early Jurassic (Marsh & Rowe 2020; Wikipedia).
15. Archaeopteryx: roughly raven-sized (Wikipedia; NHM).
16. Gallimimus: toothless beak, like other ornithomimids (Wikipedia; AMNH).
17. Oviraptor: toothless, powerful beak (Wikipedia; AMNH).
18. Coelophysis: Ghost Ranch, New Mexico, bonebed with hundreds of individuals (Carnegie Museum; Wikipedia).
19. Plateosaurus: one of the first large dinosaurs, 5-10 m in the Late Triassic (Wikipedia; Mallison 2010).
20. Eoraptor: found in 1991 in Ischigualasto Provincial Park, Argentina, nicknamed the "Valley of the Moon" (Sereno et al. 1993; Wikipedia).

## Spoken UI copy

`src/data/phrases.ts` (`PHRASES`, `pickPraise()`) holds every line the app says besides dino data. Screens and games use it instead of hard-coded strings. Rules: short, cheerful, words a 4 year old knows, never scold ("Try again!", not "Wrong!"). Ask Rex to add or change a line.
