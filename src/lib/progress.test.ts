import { beforeEach, describe, expect, it, vi } from 'vitest';
import { bestStars, loadProgress, recordStars, resetProgress } from './progress';

function memoryStorage() {
  const data = new Map<string, string>();
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
    clear: () => data.clear(),
  };
}

describe('progress', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', memoryStorage());
  });

  it('starts empty', () => {
    expect(loadProgress()).toEqual({ best: {}, totalStars: 0 });
    expect(bestStars('name-quiz')).toBe(0);
  });

  it('keeps the best score per game and adds to the total', () => {
    recordStars('name-quiz', 2);
    recordStars('name-quiz', 1);
    recordStars('memory', 3);
    expect(bestStars('name-quiz')).toBe(2);
    expect(bestStars('memory')).toBe(3);
    expect(loadProgress().totalStars).toBe(6);
  });

  it('clamps stars to 0..3', () => {
    recordStars('name-quiz', 9);
    expect(bestStars('name-quiz')).toBe(3);
    expect(loadProgress().totalStars).toBe(3);
  });

  it('survives corrupt storage', () => {
    localStorage.setItem('dino-explorer:progress:v1', '{not json');
    expect(loadProgress()).toEqual({ best: {}, totalStars: 0 });
    recordStars('name-quiz', 1);
    expect(bestStars('name-quiz')).toBe(1);
  });

  it('works when storage throws (private mode)', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('denied');
      },
      setItem: () => {
        throw new Error('denied');
      },
    });
    expect(() => recordStars('name-quiz', 2)).not.toThrow();
    expect(loadProgress().totalStars).toBe(0);
  });

  it('resets', () => {
    recordStars('name-quiz', 3);
    resetProgress();
    expect(loadProgress().totalStars).toBe(0);
  });
});
