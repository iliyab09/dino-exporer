import { describe, expect, it } from 'vitest';
import { buildId } from './pwa';

describe('buildId', () => {
  it('takes the content hash from the bundle file name', () => {
    expect(buildId('https://dinos.example/assets/index-DmjRUJp5.js')).toBe('DmjRUJp5');
  });

  it('falls back to "dev" for unhashed module URLs', () => {
    expect(buildId('http://localhost:5173/src/lib/pwa.ts')).toBe('dev');
  });
});
