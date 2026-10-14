// Small helpers shared by the mini games.

/** Fisher-Yates shuffle, returns a new array. */
export function shuffle<T>(items: readonly T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Map a 0..1 score to 1..3 stars. Every finished game earns at least one star. */
export function starsFor(ratio: number): 1 | 2 | 3 {
  if (ratio >= 0.8) return 3;
  if (ratio >= 0.5) return 2;
  return 1;
}

export function dinoImageUrl(id: string): string {
  return `${import.meta.env.BASE_URL}dinos/${id}.svg`;
}

export const PLACEHOLDER_URL = `${import.meta.env.BASE_URL}dinos/_placeholder.svg`;
