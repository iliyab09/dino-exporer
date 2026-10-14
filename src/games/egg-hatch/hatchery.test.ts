import { describe, expect, it } from 'vitest';
import { STUB_DINOS } from '../shared/stubDinos';
import { pickNextDino } from './hatchery';

const ids = STUB_DINOS.map((d) => d.id);

describe('pickNextDino', () => {
  it('only picks dinos that have not hatched yet', () => {
    const hatched = ids.slice(0, 5);
    for (let i = 0; i < 50; i++) {
      expect(pickNextDino(STUB_DINOS, hatched)?.id).toBe(ids[5]);
    }
  });

  it('covers every dino before repeating when fed its own picks', () => {
    let hatched: string[] = [];
    for (let i = 0; i < ids.length; i++) hatched = [...hatched, pickNextDino(STUB_DINOS, hatched)!.id];
    expect(new Set(hatched).size).toBe(ids.length);
  });

  it('after all are hatched, never repeats the last one back to back', () => {
    for (let i = 0; i < 50; i++) {
      expect(pickNextDino(STUB_DINOS, ids, 'triceratops')?.id).not.toBe('triceratops');
    }
  });

  it('handles one dino and no dinos', () => {
    expect(pickNextDino(STUB_DINOS.slice(0, 1), ids, ids[0])?.id).toBe(ids[0]);
    expect(pickNextDino([], [])).toBeUndefined();
  });

  it('uses the random source across the whole pool', () => {
    expect(pickNextDino(STUB_DINOS, [], undefined, () => 0)?.id).toBe(ids[0]);
    expect(pickNextDino(STUB_DINOS, [], undefined, () => 0.999)?.id).toBe(ids[ids.length - 1]);
  });
});
