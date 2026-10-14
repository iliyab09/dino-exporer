// Loads the shared dataset and the games registry owned by other streams.
// The games registry is read via import.meta.glob so the shell builds even
// before src/games/index.ts lands (a missing file yields an empty list).

import type { ComponentType } from 'react';
import { DINOS } from '../data/dinos';
import type { GameProps } from '../data/types';

/** Mirrors `GameEntry` exported by src/games/index.ts (owned by Nova). */
export interface GameEntry {
  id: string;
  title: string;
  emoji: string;
  component: ComponentType<GameProps>;
  minDinos: number;
}

const gameModules = import.meta.glob<{ GAMES?: GameEntry[] }>('../games/index.ts', { eager: true });

export { DINOS };

export const GAMES: GameEntry[] = Object.values(gameModules)[0]?.GAMES ?? [];

export function dinoArt(id: string): string {
  return `${import.meta.env.BASE_URL}dinos/${id}.svg`;
}

export const PLACEHOLDER_ART = `${import.meta.env.BASE_URL}dinos/_placeholder.svg`;
