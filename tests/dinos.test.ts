import { describe, expect, it } from 'vitest';
import type { Dino } from '../src/data/types';

// Loaded via glob so this suite skips (instead of failing) until Rex's dataset lands on main.
const modules = import.meta.glob<{ DINOS: Dino[] }>('../src/data/dinos.ts', { eager: true });
const DINOS: Dino[] = Object.values(modules)[0]?.DINOS ?? [];

const normalize = (s: string) => s.toLowerCase().replace(/[\s-]/g, '');

describe.skipIf(DINOS.length === 0)('dataset smoke test (src/data/dinos.ts)', () => {
  it('has at least one dino', () => {
    expect(DINOS.length).toBeGreaterThan(0);
  });

  it('every dino has a unique id', () => {
    const ids = DINOS.map((d) => d.id);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(dupes).toEqual([]);
  });

  it.each(DINOS.map((d) => [d.id, d] as const))('%s: syllables join to name', (_id, d) => {
    expect(normalize(d.syllables.join(''))).toBe(normalize(d.name));
  });

  it.each(DINOS.map((d) => [d.id, d] as const))('%s: color is a hex color', (_id, d) => {
    expect(d.color).toMatch(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  });

  it.each(DINOS.map((d) => [d.id, d] as const))('%s: funFact is 100 chars or less', (_id, d) => {
    expect(d.funFact.length).toBeLessThanOrEqual(100);
  });
});
