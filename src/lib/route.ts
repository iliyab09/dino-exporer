// Tiny state-based router: a discriminated union mirrored into history.state
// so the phone's back button / back gesture works. No router library.

export type Route =
  | { name: 'home' }
  | { name: 'learn' }
  | { name: 'dino'; id: string }
  | { name: 'play' }
  | { name: 'game'; id: string }
  | { name: 'reward'; gameId: string; stars: 1 | 2 | 3; correct: number; total: number };

export const HOME: Route = { name: 'home' };

/** What we store in history.state: the route plus how deep we are in the app. */
export interface HistoryEntry {
  route: Route;
  depth: number;
}

export function isHistoryEntry(value: unknown): value is HistoryEntry {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Partial<HistoryEntry>;
  return typeof v.depth === 'number' && typeof v.route?.name === 'string';
}

/** Where "back" goes when there is no app history to pop (e.g. after a reload). */
export function parentOf(route: Route): Route {
  switch (route.name) {
    case 'dino':
      return { name: 'learn' };
    case 'game':
    case 'reward':
      return { name: 'play' };
    default:
      return HOME;
  }
}
