import { describe, expect, it } from 'vitest';
import { UI_FILES, offlineUrls } from './pwa';

describe('offline precache list', () => {
  it('lists every file in public/ui (add new UI art to UI_FILES)', () => {
    // Keys only: the importers are never called, so nothing is loaded.
    const onDisk = Object.keys(import.meta.glob('/public/ui/*')).map((path) => path.replace('/public/ui/', ''));
    expect([...UI_FILES].sort()).toEqual(onDisk.sort());
  });

  it('builds URLs under the deploy base', () => {
    const urls = offlineUrls('/dino-exporer/', ['triceratops']);
    expect(urls).toContain('/dino-exporer/ui/egg.svg');
    expect(urls).toContain('/dino-exporer/manifest.webmanifest');
    expect(urls).toContain('/dino-exporer/dinos/triceratops.svg');
    expect(urls.every((u) => u.startsWith('/dino-exporer/'))).toBe(true);
  });
});
