// Sticker book rules: every 3 lifetime stars unlocks the next dino sticker,
// in dataset order (Rex sorts DINOS easiest first, so T. rex comes first).

import type { Dino } from '../data/types';

export const STARS_PER_STICKER = 3;

/** How many stickers a kid with `totalStars` has unlocked (capped at the dino count). */
export function stickersUnlocked(totalStars: number, dinoCount: number): number {
  return Math.max(0, Math.min(dinoCount, Math.floor(totalStars / STARS_PER_STICKER)));
}

/** Stars collected toward the next sticker (0..2). */
export function starsTowardNext(totalStars: number): number {
  return Math.max(0, totalStars) % STARS_PER_STICKER;
}

/** Dinos whose sticker was newly unlocked by going from `before` to `after` stars. */
export function newlyUnlocked(dinos: Dino[], before: number, after: number): Dino[] {
  return dinos.slice(stickersUnlocked(before, dinos.length), stickersUnlocked(after, dinos.length));
}
