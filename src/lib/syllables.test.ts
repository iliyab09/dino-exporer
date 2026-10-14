import { describe, expect, it } from 'vitest';
import type { Dino } from '../data/types';
import { syllableSounds } from './syllables';

const base = { syllables: ['Tri', 'cer', 'a', 'tops'] } as Pick<Dino, 'syllables'>;

describe('syllableSounds', () => {
  it('maps chips to lowercased phonetic chunks', () => {
    expect(syllableSounds({ ...base, pronunciation: 'try-SAIR-uh-tops' } as Dino)).toEqual([
      'try',
      'sair',
      'uh',
      'tops',
    ]);
  });

  it('falls back to the written syllables when counts differ', () => {
    expect(syllableSounds({ ...base, pronunciation: 'try-SAIR-tops' } as Dino)).toEqual(base.syllables);
  });
});
