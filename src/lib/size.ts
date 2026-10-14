// Turns a dino's size in meters into something a 5-year-old can picture:
// a row of cars (or beds for small dinos), plus a sentence to speak.

import type { Dino } from '../data/types';

const CAR_METERS = 4.5;
const BED_METERS = 2;
const MAX_ICONS = 6;

export interface SizeComparison {
  emoji: string;
  count: number;
  sentence: string;
}

export function sizeComparison(dino: Pick<Dino, 'lengthMeters' | 'sizeKind'>): SizeComparison {
  const m = dino.lengthMeters;
  const small = m < 3;
  const emoji = small ? '🛏️' : '🚗';
  const unit = small ? 'bed' : 'car';
  const count = Math.min(MAX_ICONS, Math.max(1, Math.round(m / (small ? BED_METERS : CAR_METERS))));
  const things = count === 1 ? `one ${unit}` : `${count} ${unit}s`;
  const sentence =
    dino.sizeKind === 'wingspan'
      ? `Its wings were as wide as ${things}!`
      : `It was about as long as ${things}!`;
  return { emoji, count, sentence };
}
