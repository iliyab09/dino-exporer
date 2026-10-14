import { describe, expect, it } from 'vitest';
import type { Dino } from '../data/types';
import { hyphenateName, syllableSounds } from './syllables';

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

describe('hyphenateName', () => {
  const show = (s: string) => s.replaceAll('­', '·');

  it('puts soft hyphens between syllables', () => {
    expect(show(hyphenateName({ name: 'Pachycephalosaurus', syllables: ['Pach', 'y', 'ceph', 'a', 'lo', 'saur', 'us'] }))).toBe(
      'Pach·y·ceph·a·lo·saur·us',
    );
  });

  it('keeps spaces and skips a hyphen before them', () => {
    expect(show(hyphenateName({ name: 'Tyrannosaurus rex', syllables: ['Ty', 'ran', 'no', 'saur', 'us', 'rex'] }))).toBe(
      'Ty·ran·no·saur·us rex',
    );
  });

  it('returns the plain name when syllables do not spell it', () => {
    expect(hyphenateName({ name: 'Triceratops', syllables: ['Tri', 'tops'] })).toBe('Triceratops');
  });
});
