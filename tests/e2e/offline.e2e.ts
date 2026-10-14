import { expect, test } from '@playwright/test';
import { setup } from './helpers';

// After one online visit the service worker must make the whole app work offline.
test('Offline after one visit: Home, Learn art and Egg Hatch eggs all load from the SW cache', async ({ page, context }) => {
  const { errors } = await setup(page);
  await page.goto('/');
  await page.evaluate(async () => {
    const reg = await navigator.serviceWorker.ready;
    // Wait until the posted precache list (art, ui, icons) has landed in the cache.
    for (let i = 0; i < 50; i++) {
      const keys = await caches.keys();
      const cache = keys.length ? await caches.open(keys[0]) : null;
      if (cache && (await cache.match(new URL('ui/egg-crack-2.svg', reg.scope).href))) return;
      await new Promise((r) => setTimeout(r, 100));
    }
  });

  await context.setOffline(true);
  await page.reload();

  const broken = () =>
    page.evaluate(() =>
      [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src.split('/').pop()),
    );
  await expect(page.getByRole('button', { name: 'Learn', exact: true })).toBeVisible();
  await expect.poll(broken).toEqual([]);

  await page.getByRole('button', { name: 'Learn', exact: true }).click();
  await expect(page.locator('.dino-card__main')).toHaveCount(20);
  await expect.poll(broken).toEqual([]);

  await page.goBack();
  await page.getByRole('button', { name: 'Play', exact: true }).click();
  await page.getByRole('button', { name: 'Egg Hatch' }).click();
  await expect(page.locator('.eh-egg')).toBeVisible();
  await expect.poll(broken).toEqual([]);

  await context.setOffline(false);
  expect(errors).toEqual([]);
});
