import type { Diet, Dino } from '../../data/types';
import { pickDinos, type Level } from '../shared/pickDinos';
import { shuffle } from '../shared/util';

export const MAX_ROUNDS = 6;

/** The two bins. Omnivores are left out: "plants or meat?" has no single answer for them. */
export type Snack = Extract<Diet, 'herbivore' | 'carnivore'>;

/**
 * Up to MAX_ROUNDS dinos, as close to half plant-eaters and half meat-eaters as the
 * data allows, so tapping one bin over and over doesn't win. Each side is picked by level.
 */
export function buildSortRounds(dinos: Dino[], level: Level = 3, rounds = MAX_ROUNDS): Dino[] {
  const plants = dinos.filter((d) => d.diet === 'herbivore');
  const meat = dinos.filter((d) => d.diet === 'carnivore');
  const nPlants = Math.min(plants.length, Math.max(Math.floor(rounds / 2), rounds - meat.length));
  const nMeat = Math.min(meat.length, rounds - nPlants);
  return shuffle([...pickDinos(plants, level, nPlants), ...pickDinos(meat, level, nMeat)]);
}
