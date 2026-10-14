import type { Dino } from '../../data/types';
import { shuffle } from '../shared/util';

export const MAX_PAIRS = 6;

export interface Card {
  /** Unique per card (two cards share a dino). */
  key: string;
  dino: Dino;
}

/** Shuffled deck with two cards for each of up to MAX_PAIRS random dinos. */
export function buildDeck(dinos: Dino[], pairs = MAX_PAIRS): Card[] {
  const picked = shuffle(dinos).slice(0, pairs);
  return shuffle(picked.flatMap((dino) => [{ key: `${dino.id}-a`, dino }, { key: `${dino.id}-b`, dino }]));
}

/**
 * Stars by moves (one move = flipping two cards). A perfect game takes `pairs` moves.
 * Generous on purpose for ages 4-8: up to `pairs` extra moves still earns 3 stars.
 */
export function starsForMoves(moves: number, pairs: number): 1 | 2 | 3 {
  const extra = moves - pairs;
  if (extra <= pairs) return 3;
  if (extra <= pairs * 2) return 2;
  return 1;
}
