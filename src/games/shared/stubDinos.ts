// Dev-only stub for testing games before the real dataset lands.
// Games never import this; the shell passes real dinos via props.
import type { Dino } from '../../data/types';

const base = { meaning: '', lengthMeters: 1, funFact: '', period: 'Cretaceous', diet: 'herbivore', tier: 1 } as const;

export const STUB_DINOS: Dino[] = [
  { ...base, id: 'tyrannosaurus-rex', name: 'T. rex', pronunciation: 'tie-RAN-oh-SORE-us rex', syllables: ['T', 'rex'], diet: 'carnivore', color: '#e4572e' },
  { ...base, id: 'triceratops', name: 'Triceratops', pronunciation: 'try-SAIR-uh-tops', syllables: ['Tri', 'cer', 'a', 'tops'], color: '#f3a712' },
  { ...base, id: 'stegosaurus', name: 'Stegosaurus', pronunciation: 'STEG-oh-SORE-us', syllables: ['Steg', 'o', 'saur', 'us'], period: 'Jurassic', color: '#29bf12' },
  { ...base, id: 'brachiosaurus', name: 'Brachiosaurus', pronunciation: 'BRAK-ee-oh-SORE-us', syllables: ['Brach', 'i', 'o', 'saur', 'us'], period: 'Jurassic', color: '#4ea5d9' },
  { ...base, id: 'velociraptor', name: 'Velociraptor', pronunciation: 'veh-LOSS-ih-rap-tor', syllables: ['Ve', 'lo', 'ci', 'rap', 'tor'], diet: 'carnivore', color: '#a05195' },
  { ...base, id: 'pteranodon', name: 'Pteranodon', pronunciation: 'teh-RAN-oh-don', syllables: ['Pter', 'an', 'o', 'don'], diet: 'carnivore', color: '#ff7f50' },
];
