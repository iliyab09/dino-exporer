import { describe, expect, it } from 'vitest';
import type { Dino } from '../../data/types';
import { STUB_DINOS } from '../shared/stubDinos';
import { MAX_ROUNDS, buildSortRounds } from './rounds';

const make = (id: string, diet: Dino['diet']): Dino => ({ ...STUB_DINOS[0], id, name: id, diet });
const many = [
  ...Array.from({ length: 9 }, (_, i) => make(`h${i}`, 'herbivore')),
  ...Array.from({ length: 8 }, (_, i) => make(`c${i}`, 'carnivore')),
  ...Array.from({ length: 3 }, (_, i) => make(`o${i}`, 'omnivore')),
];

describe('buildSortRounds', () => {
  it('gives 6 unique dinos, 3 plant-eaters and 3 meat-eaters, never omnivores', () => {
    for (let i = 0; i < 100; i++) {
      const rounds = buildSortRounds(many);
      expect(rounds).toHaveLength(MAX_ROUNDS);
      expect(new Set(rounds.map((d) => d.id)).size).toBe(MAX_ROUNDS);
      expect(rounds.filter((d) => d.diet === 'herbivore')).toHaveLength(3);
      expect(rounds.filter((d) => d.diet === 'carnivore')).toHaveLength(3);
    }
  });

  it('fills from the bigger side when one side is short', () => {
    const rounds = buildSortRounds([...many.slice(0, 9), make('c0', 'carnivore')]);
    expect(rounds).toHaveLength(MAX_ROUNDS);
    expect(rounds.filter((d) => d.diet === 'carnivore')).toHaveLength(1);
  });

  it('returns what it can for tiny datasets', () => {
    expect(buildSortRounds([make('h', 'herbivore'), make('c', 'carnivore'), make('o', 'omnivore')])).toHaveLength(2);
    expect(buildSortRounds([make('o', 'omnivore')])).toEqual([]);
  });
});
