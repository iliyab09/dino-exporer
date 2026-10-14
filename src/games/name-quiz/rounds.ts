import type { Dino } from '../../data/types';
import { pickDinos, type Level } from '../shared/pickDinos';
import { shuffle } from '../shared/util';

export const MAX_ROUNDS = 5;
export const OPTIONS_PER_ROUND = 3;

export interface Round {
  target: Dino;
  options: Dino[];
}

/**
 * Up to MAX_ROUNDS rounds, each with a different target and OPTIONS_PER_ROUND distinct options.
 * Targets and wrong options all come from one level-appropriate set (see pickDinos).
 */
export function buildRounds(dinos: Dino[], level: Level = 3): Round[] {
  const pool = pickDinos(dinos, level, Math.max(MAX_ROUNDS, OPTIONS_PER_ROUND));
  if (pool.length < OPTIONS_PER_ROUND) return [];
  return pool.slice(0, MAX_ROUNDS).map((target) => {
    const others = shuffle(pool.filter((d) => d.id !== target.id)).slice(0, OPTIONS_PER_ROUND - 1);
    return { target, options: shuffle([target, ...others]) };
  });
}
