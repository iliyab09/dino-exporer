import type { Diet, Dino } from '../../data/types';
import { shuffle } from '../shared/util';

export const MAX_ROUNDS = 6;

/** The two bins. Omnivores are left out: "plants or meat?" has no single answer for them. */
export type Snack = Extract<Diet, 'herbivore' | 'carnivore'>;

/**
 * Up to MAX_ROUNDS dinos, as close to half plant-eaters and half meat-eaters as the
 * data allows, so tapping one bin over and over doesn't win.
 */
export function buildSortRounds(dinos: Dino[], rounds = MAX_ROUNDS): Dino[] {
  const plants = shuffle(dinos.filter((d) => d.diet === 'herbivore'));
  const meat = shuffle(dinos.filter((d) => d.diet === 'carnivore'));
  const half = Math.floor(rounds / 2);
  let nPlants = Math.min(plants.length, half);
  let nMeat = Math.min(meat.length, rounds - nPlants);
  nPlants = Math.min(plants.length, rounds - nMeat);
  nMeat = Math.min(meat.length, rounds - nPlants);
  return shuffle([...plants.slice(0, nPlants), ...meat.slice(0, nMeat)]);
}
