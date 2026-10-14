import type { Dino } from '../../data/types';

export const TAPS_TO_HATCH = 3;
const STORAGE_KEY = 'eggHatched';

/**
 * Next dino to hatch: a random one the kid has not hatched yet. Once every dino
 * has hatched, any dino except the one just hatched.
 */
export function pickNextDino(
  dinos: Dino[],
  hatched: readonly string[],
  lastId?: string,
  random: () => number = Math.random,
): Dino | undefined {
  const fresh = dinos.filter((d) => !hatched.includes(d.id));
  const pool = fresh.length > 0 ? fresh : dinos.filter((d) => d.id !== lastId);
  const list = pool.length > 0 ? pool : dinos;
  return list[Math.floor(random() * list.length) % list.length];
}

export function loadHatched(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

/** Add an id to the hatched list and return the new list. */
export function saveHatched(hatched: readonly string[], id: string): string[] {
  const next = hatched.includes(id) ? [...hatched] : [...hatched, id];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private mode or storage full: the list just won't persist.
  }
  return next;
}
