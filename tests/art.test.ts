import { describe, expect, it } from 'vitest';

// Every SVG in public/dinos must follow the art rules in DESIGN.md.
const svgs = import.meta.glob<string>('../public/dinos/*.svg', { eager: true, query: '?raw', import: 'default' });
const art = Object.entries(svgs)
  .map(([path, src]) => [path.split('/').pop()!.replace('.svg', ''), src] as const)
  .filter(([id]) => !id.startsWith('_'));

describe.skipIf(art.length === 0)('dino art (public/dinos/*.svg)', () => {
  it.each(art)('%s: square 200x200 viewBox', (_id, src) => {
    expect(src).toMatch(/viewBox="0 0 200 200"/);
  });

  it.each(art)('%s: no text, gradients, filters or external refs', (_id, src) => {
    expect(src).not.toMatch(/<text|Gradient|<filter|<image|href=/);
  });

  it.each(art)('%s: under 6 KB', (_id, src) => {
    expect(src.length).toBeLessThan(6 * 1024);
  });
});
