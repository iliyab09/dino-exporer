import type { Dino } from '../../data/types';
import { shuffle } from '../shared/util';

export const MAX_ROUNDS = 5;
export const OPTIONS_PER_ROUND = 3;

export interface Round {
  target: Dino;
  options: Dino[];
}

/** Up to MAX_ROUNDS rounds, each with a different target and OPTIONS_PER_ROUND distinct options. */
export function buildRounds(dinos: Dino[]): Round[] {
  if (dinos.length < OPTIONS_PER_ROUND) return [];
  const targets = shuffle(dinos).slice(0, MAX_ROUNDS);
  return targets.map((target) => {
    const others = shuffle(dinos.filter((d) => d.id !== target.id)).slice(0, OPTIONS_PER_ROUND - 1);
    return { target, options: shuffle([target, ...others]) };
  });
}
