// Turns a dino's size in meters into something a 5-year-old can picture:
// a row of cats, beds or cars, plus a sentence to speak.

import type { Dino } from '../data/types';

const UNITS = [
  { upTo: 1.2, meters: 0.5, emoji: '🐈', name: 'cat' },
  { upTo: 7, meters: 2, emoji: '🛏️', name: 'bed' },
  { upTo: Infinity, meters: 4.5, emoji: '🚗', name: 'car' },
] as const;
const MAX_ICONS = 6;

export interface SizeComparison {
  emoji: string;
  count: number;
  sentence: string;
}

export function sizeComparison(dino: Pick<Dino, 'lengthMeters' | 'sizeKind'>): SizeComparison {
  const m = dino.lengthMeters;
  const unit = UNITS.find((u) => m <= u.upTo) ?? UNITS[UNITS.length - 1];
  const emoji = unit.emoji;
  const count = Math.min(MAX_ICONS, Math.max(1, Math.round(m / unit.meters)));
  const things = count === 1 ? `one ${unit.name}` : `${count} ${unit.name}s`;
  const sentence =
    dino.sizeKind === 'wingspan'
      ? `Its wings were as wide as ${things}!`
      : `It was about as long as ${things}!`;
  return { emoji, count, sentence };
}
