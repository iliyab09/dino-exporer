import { describe, expect, it } from 'vitest';
import { DINOS } from '../../data/dinos';
import type { Dino } from '../../data/types';
import { buildSortRounds } from '../dino-sounds/rounds';
import { buildDeck } from '../memory-match/deck';
import { buildRounds } from '../name-quiz/rounds';
import { dinosForLevel, type Level } from './pickDinos';

// Every game, at every level, on the real dataset.
const maxTier = (ds: Dino[]) => Math.max(...ds.map((d) => d.tier));
const LEVELS: Level[] = [1, 2, 3];

describe.each(LEVELS)('games at level %i with the real dinos', (level) => {
  const allowed = (ds: Dino[]) => (level === 3 ? true : maxTier(ds) <= level);
  const hasTier2 = (ds: Dino[]) => level !== 2 || ds.some((d) => d.tier === 2);

  it('Name Quiz: 5 full rounds within the level', () => {
    for (let i = 0; i < 50; i++) {
      const rounds = buildRounds(DINOS, level);
      expect(rounds).toHaveLength(5);
      const used = rounds.flatMap((r) => r.options);
      expect(allowed(used)).toBe(true);
      expect(hasTier2(rounds.map((r) => r.target))).toBe(true);
    }
  });

  it('Memory Match: 6 pairs within the level', () => {
    for (let i = 0; i < 50; i++) {
      const dinos = buildDeck(DINOS, level).map((c) => c.dino);
      expect(dinos).toHaveLength(12);
      expect(allowed(dinos)).toBe(true);
      expect(hasTier2(dinos)).toBe(true);
    }
  });

  it('Dino Snacks: 3 plant-eaters + 3 meat-eaters within the level', () => {
    for (let i = 0; i < 50; i++) {
      const rounds = buildSortRounds(DINOS, level);
      expect(rounds.filter((d) => d.diet === 'herbivore')).toHaveLength(3);
      expect(rounds.filter((d) => d.diet === 'carnivore')).toHaveLength(3);
      expect(allowed(rounds)).toBe(true);
      expect(hasTier2(rounds)).toBe(true);
    }
  });

  it('Egg Hatch: eggs hold only dinos for the level', () => {
    const pool = dinosForLevel(DINOS, level);
    expect(pool.length).toBe(DINOS.filter((d) => d.tier <= level).length);
    expect(allowed(pool)).toBe(true);
  });
});
