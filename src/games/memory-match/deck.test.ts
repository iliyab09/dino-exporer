import { describe, expect, it } from 'vitest';
import { STUB_DINOS } from '../shared/stubDinos';
import { MAX_PAIRS, buildDeck, starsForMoves } from './deck';

describe('buildDeck', () => {
  it('has exactly two cards per dino, unique keys, 6 pairs', () => {
    for (let i = 0; i < 100; i++) {
      const deck = buildDeck(STUB_DINOS);
      expect(deck).toHaveLength(MAX_PAIRS * 2);
      expect(new Set(deck.map((c) => c.key)).size).toBe(deck.length);
      const counts = new Map<string, number>();
      for (const c of deck) counts.set(c.dino.id, (counts.get(c.dino.id) ?? 0) + 1);
      expect(counts.size).toBe(MAX_PAIRS);
      for (const n of counts.values()) expect(n).toBe(2);
    }
  });

  it('uses fewer pairs when there are fewer dinos', () => {
    expect(buildDeck(STUB_DINOS.slice(0, 4))).toHaveLength(8);
  });
});

describe('starsForMoves', () => {
  it.each([
    [6, 3], [12, 3], [13, 2], [18, 2], [19, 1], [40, 1],
  ])('%i moves for 6 pairs gives %i stars', (moves, stars) => {
    expect(starsForMoves(moves, 6)).toBe(stars);
  });
});
