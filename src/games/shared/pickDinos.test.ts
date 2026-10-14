import { describe, expect, it } from 'vitest';
import type { Dino } from '../../data/types';
import { STUB_DINOS } from './stubDinos';
import { dinosForLevel, pickDinos } from './pickDinos';

const make = (id: string, tier: Dino['tier']): Dino => ({ ...STUB_DINOS[0], id, name: id, tier });
// Same shape as the real dataset: 8 tier 1, 7 tier 2, 5 tier 3.
const all = [
  ...Array.from({ length: 8 }, (_, i) => make(`a${i}`, 1)),
  ...Array.from({ length: 7 }, (_, i) => make(`b${i}`, 2)),
  ...Array.from({ length: 5 }, (_, i) => make(`c${i}`, 3)),
];
const tiers = (ds: Dino[]) => ds.map((d) => d.tier);
const unique = (ds: Dino[]) => new Set(ds.map((d) => d.id)).size === ds.length;

describe('pickDinos', () => {
  it('level 1 picks only tier 1', () => {
    for (let i = 0; i < 100; i++) {
      const ds = pickDinos(all, 1, 6);
      expect(ds).toHaveLength(6);
      expect(unique(ds)).toBe(true);
      expect(tiers(ds).every((t) => t === 1)).toBe(true);
    }
  });

  it('level 2 picks tiers 1-2 and always at least one tier 2', () => {
    for (let i = 0; i < 200; i++) {
      for (const n of [1, 3, 5, 6]) {
        const ds = pickDinos(all, 2, n);
        expect(ds).toHaveLength(n);
        expect(unique(ds)).toBe(true);
        expect(tiers(ds).every((t) => t <= 2)).toBe(true);
        expect(tiers(ds)).toContain(2);
      }
    }
  });

  it('level 3 can pick any tier and reaches tier 3', () => {
    const seen = new Set<number>();
    for (let i = 0; i < 100; i++) pickDinos(all, 3, 5).forEach((d) => seen.add(d.tier));
    expect([...seen].sort()).toEqual([1, 2, 3]);
  });

  it('defaults to level 3 and all dinos', () => {
    expect(pickDinos(all)).toHaveLength(all.length);
  });

  it('tops up from the next tier when the level runs short, lowest tier first', () => {
    const ds = pickDinos(all, 1, 12);
    expect(ds).toHaveLength(12);
    expect(tiers(ds).filter((t) => t === 1)).toHaveLength(8);
    expect(tiers(ds).filter((t) => t === 2)).toHaveLength(4);
    expect(tiers(ds)).not.toContain(3);
  });

  it('never returns more than exist and handles empty input', () => {
    expect(pickDinos(all.slice(0, 2), 1, 6)).toHaveLength(2);
    expect(pickDinos([], 2, 3)).toEqual([]);
  });

  it('level 2 with no tier 2 dinos still fills from other tiers', () => {
    const ds = pickDinos([...all.slice(0, 2), ...all.slice(15)], 2, 4);
    expect(ds).toHaveLength(4);
    expect(tiers(ds).filter((t) => t === 1)).toHaveLength(2);
  });
});

describe('dinosForLevel', () => {
  it('returns every dino allowed at the level', () => {
    expect(dinosForLevel(all, 1)).toHaveLength(8);
    expect(dinosForLevel(all, 2)).toHaveLength(15);
    expect(dinosForLevel(all, 3)).toHaveLength(20);
  });

  it('tops up to minCount', () => {
    const ds = dinosForLevel(all, 1, 10);
    expect(ds).toHaveLength(10);
    expect(tiers(ds).filter((t) => t === 2)).toHaveLength(2);
  });
});
