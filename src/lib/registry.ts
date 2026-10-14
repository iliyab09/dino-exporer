// Loads the shared dataset and games registry owned by other streams.
// import.meta.glob lets the shell build even before those files land:
// a missing file yields an empty match and we fall back to a stub.

import type { ComponentType } from 'react';
import type { Dino, GameProps } from '../data/types';

/** Mirrors `GameEntry` exported by src/games/index.ts (owned by Nova). */
export interface GameEntry {
  id: string;
  title: string;
  emoji: string;
  component: ComponentType<GameProps>;
  minDinos: number;
}

const STUB_DINOS: Dino[] = [
  {
    id: 'tyrannosaurus-rex',
    name: 'Tyrannosaurus rex',
    pronunciation: 'tie-RAN-oh-SORE-us rex',
    syllables: ['Ty', 'ran', 'no', 'saur', 'us', 'rex'],
    meaning: 'tyrant lizard king',
    diet: 'carnivore',
    period: 'Cretaceous',
    lengthMeters: 12,
    funFact: 'T. rex had teeth as big as bananas!',
    color: '#e4572e',
    tier: 1,
  },
  {
    id: 'triceratops',
    name: 'Triceratops',
    pronunciation: 'try-SAIR-uh-tops',
    syllables: ['Tri', 'cer', 'a', 'tops'],
    meaning: 'three-horned face',
    diet: 'herbivore',
    period: 'Cretaceous',
    lengthMeters: 9,
    funFact: 'Triceratops had three horns and a big bony frill.',
    color: '#4cc3f5',
    tier: 1,
  },
];

const dinoModules = import.meta.glob<{ DINOS?: Dino[] }>('../data/dinos.ts', { eager: true });
const gameModules = import.meta.glob<{ GAMES?: GameEntry[] }>('../games/index.ts', { eager: true });

const loadedDinos = Object.values(dinoModules)[0]?.DINOS;
export const DINOS: Dino[] = loadedDinos && loadedDinos.length > 0 ? loadedDinos : STUB_DINOS;

export const GAMES: GameEntry[] = Object.values(gameModules)[0]?.GAMES ?? [];

export function dinoArt(id: string): string {
  return `${import.meta.env.BASE_URL}dinos/${id}.svg`;
}

export const PLACEHOLDER_ART = `${import.meta.env.BASE_URL}dinos/_placeholder.svg`;
