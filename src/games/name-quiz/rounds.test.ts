import { describe, expect, it } from 'vitest';
import { STUB_DINOS } from '../shared/stubDinos';
import { starsFor } from '../shared/util';
import { MAX_ROUNDS, OPTIONS_PER_ROUND, buildRounds } from './rounds';

describe('buildRounds', () => {
  it('builds 5 rounds with distinct targets and 3 distinct options including the target', () => {
    for (let i = 0; i < 200; i++) {
      const rounds = buildRounds(STUB_DINOS);
      expect(rounds).toHaveLength(MAX_ROUNDS);
      expect(new Set(rounds.map((r) => r.target.id)).size).toBe(MAX_ROUNDS);
      for (const r of rounds) {
        const ids = r.options.map((d) => d.id);
        expect(ids).toHaveLength(OPTIONS_PER_ROUND);
        expect(new Set(ids).size).toBe(OPTIONS_PER_ROUND);
        expect(ids).toContain(r.target.id);
      }
    }
  });

  it('uses fewer rounds when there are fewer dinos than rounds', () => {
    const rounds = buildRounds(STUB_DINOS.slice(0, 3));
    expect(rounds).toHaveLength(3);
    for (const r of rounds) expect(new Set(r.options.map((d) => d.id)).size).toBe(3);
  });

  it('returns no rounds when there are not enough dinos for 3 options', () => {
    expect(buildRounds(STUB_DINOS.slice(0, 2))).toEqual([]);
  });
});

describe('starsFor', () => {
  it.each([
    [5, 3], [4, 3], [3, 2], [2, 1], [1, 1], [0, 1],
  ])('%i of 5 first-try answers gives %i stars', (correct, stars) => {
    expect(starsFor(correct / 5)).toBe(stars);
  });
});
