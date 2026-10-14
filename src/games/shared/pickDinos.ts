import type { Dino } from '../../data/types';
import { shuffle } from './util';

export type Level = 1 | 2 | 3;

/**
 * Exactly `count` dinos for one play (or all of them if there are fewer), chosen by level:
 * - level 1: tier 1 only
 * - level 2: tiers 1-2, always including at least one tier 2
 * - level 3: any tier
 * If the allowed tiers run short, it tops up from the next tier up, so a game always gets
 * enough dinos for its minDinos. The result is shuffled.
 */
export function pickDinos(dinos: readonly Dino[], level: Level = 3, count = dinos.length): Dino[] {
  const n = Math.min(count, dinos.length);
  const picked: Dino[] = [];
  const take = (pool: Dino[]) => {
    for (const d of pool) {
      if (picked.length >= n) return;
      if (!picked.includes(d)) picked.push(d);
    }
  };
  const ofTier = (tier: number) => shuffle(dinos.filter((d) => d.tier === tier));

  if (level === 2) take(ofTier(2).slice(0, 1));
  take(shuffle(dinos.filter((d) => d.tier <= level)));
  for (let tier = level + 1; tier <= 3; tier++) take(ofTier(tier));
  return shuffle(picked);
}

/** Every dino allowed at this level (at least `minCount`), for open-ended games like Egg Hatch. */
export function dinosForLevel(dinos: readonly Dino[], level: Level = 3, minCount = 1): Dino[] {
  const allowed = dinos.filter((d) => d.tier <= level).length;
  return pickDinos(dinos, level, Math.max(allowed, minCount));
}
