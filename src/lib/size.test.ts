import { describe, expect, it } from 'vitest';
import { sizeComparison } from './size';

describe('sizeComparison', () => {
  it('uses cars for big dinos', () => {
    expect(sizeComparison({ lengthMeters: 12 })).toEqual({
      emoji: '🚗',
      count: 3,
      sentence: 'It was about as long as 3 cars!',
    });
  });

  it('uses beds for small dinos and says "one"', () => {
    const s = sizeComparison({ lengthMeters: 2 });
    expect(s.emoji).toBe('🛏️');
    expect(s.count).toBe(1);
    expect(s.sentence).toBe('It was about as long as one bed!');
  });

  it('talks about wings for wingspan', () => {
    expect(sizeComparison({ lengthMeters: 7, sizeKind: 'wingspan' }).sentence).toBe(
      'Its wings were as wide as 2 cars!',
    );
  });

  it('caps the icon row', () => {
    expect(sizeComparison({ lengthMeters: 40 }).count).toBe(6);
  });
});
