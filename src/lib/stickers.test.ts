import { describe, expect, it } from 'vitest';
import type { Dino } from '../data/types';
import { newlyUnlocked, starsTowardNext, stickersUnlocked } from './stickers';

const dinos = ['a', 'b', 'c'].map((id) => ({ id }) as Dino);

describe('stickers', () => {
  it('unlocks one sticker per 3 stars, capped at the dino count', () => {
    expect(stickersUnlocked(0, 3)).toBe(0);
    expect(stickersUnlocked(2, 3)).toBe(0);
    expect(stickersUnlocked(3, 3)).toBe(1);
    expect(stickersUnlocked(8, 3)).toBe(2);
    expect(stickersUnlocked(99, 3)).toBe(3);
  });

  it('counts stars toward the next sticker', () => {
    expect(starsTowardNext(0)).toBe(0);
    expect(starsTowardNext(4)).toBe(1);
    expect(starsTowardNext(5)).toBe(2);
    expect(starsTowardNext(6)).toBe(0);
  });

  it('reports the stickers a round just unlocked', () => {
    expect(newlyUnlocked(dinos, 2, 3).map((d) => d.id)).toEqual(['a']);
    expect(newlyUnlocked(dinos, 3, 5)).toEqual([]);
    expect(newlyUnlocked(dinos, 5, 9).map((d) => d.id)).toEqual(['b', 'c']);
    expect(newlyUnlocked(dinos, 9, 12)).toEqual([]);
  });
});
