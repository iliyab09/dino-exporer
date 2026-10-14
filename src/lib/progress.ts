// Stars per game, saved in localStorage. Best score per game is kept,
// and every finished round adds to the lifetime star total (used by the sticker book).

const KEY = 'dino-explorer:progress:v1';

export interface Progress {
  /** Best stars (1..3) ever earned per game id. */
  best: Record<string, number>;
  /** Total stars earned across all rounds. */
  totalStars: number;
}

const EMPTY: Progress = { best: {}, totalStars: 0 };

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY, best: {} };
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      best: typeof parsed.best === 'object' && parsed.best ? parsed.best : {},
      totalStars: typeof parsed.totalStars === 'number' ? parsed.totalStars : 0,
    };
  } catch {
    return { ...EMPTY, best: {} };
  }
}

function save(p: Progress): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // Private mode or storage full: progress just will not persist.
  }
}

/** Record a finished round and return the updated progress. */
export function recordStars(gameId: string, stars: number): Progress {
  const p = loadProgress();
  const clamped = Math.max(0, Math.min(3, Math.round(stars)));
  p.best[gameId] = Math.max(p.best[gameId] ?? 0, clamped);
  p.totalStars += clamped;
  save(p);
  return p;
}

export function bestStars(gameId: string): number {
  return loadProgress().best[gameId] ?? 0;
}

export function resetProgress(): void {
  save({ ...EMPTY, best: {} });
}
