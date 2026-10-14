import { expect, test } from '@playwright/test';
import { expectSpoken, setup } from './helpers';

test('Home renders with Learn and Play', async ({ page }) => {
  const { errors } = await setup(page);
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Learn', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Play', exact: true })).toBeVisible();
  await expect(page.locator('.home__hero')).toBeVisible();
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(width).toBeLessThanOrEqual(375);
  expect(errors).toEqual([]);
});

test('Learn: opening a dino speaks its name, and the fun fact is spoken on tap', async ({ page }) => {
  const { errors } = await setup(page);
  await page.goto('/');
  await page.getByRole('button', { name: 'Learn', exact: true }).click();
  const cards = page.locator('.dino-card__main');
  await expect(cards).toHaveCount(20);
  await cards.first().click();

  const name = (await page.locator('.dino__name').textContent())?.trim() ?? '';
  expect(name).not.toBe('');
  await expectSpoken(page, name);

  const fact = (await page.locator('.dino__bubble').textContent())?.trim() ?? '';
  await page.getByRole('button', { name: 'Hear a fun fact' }).click();
  await expectSpoken(page, fact);
  expect(errors).toEqual([]);
});
