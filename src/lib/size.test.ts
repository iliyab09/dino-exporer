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

  it('uses beds for mid-size dinos', () => {
    expect(sizeComparison({ lengthMeters: 6 })).toMatchObject({ emoji: '🛏️', count: 3 });
    expect(sizeComparison({ lengthMeters: 2 }).sentence).toBe('It was about as long as one bed!');
  });

  it('uses cats for tiny dinos', () => {
    expect(sizeComparison({ lengthMeters: 0.5 }).sentence).toBe('It was about as long as one cat!');
    expect(sizeComparison({ lengthMeters: 1 })).toMatchObject({ emoji: '🐈', count: 2 });
  });

  it('talks about wings for wingspan', () => {
    expect(sizeComparison({ lengthMeters: 6, sizeKind: 'wingspan' }).sentence).toBe(
      'Its wings were as wide as 3 beds!',
    );
  });

  it('caps the icon row', () => {
    expect(sizeComparison({ lengthMeters: 40 }).count).toBe(6);
  });
});
