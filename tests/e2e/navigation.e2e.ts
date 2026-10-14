import { expect, test } from '@playwright/test';
import { openGame, setup, spoken } from './helpers';

for (const title of ['Name Quiz', 'Memory Match', 'Egg Hatch', 'Dino Snacks']) {
  test(`${title}: reload mid-game restores the game, and its back button returns to Play`, async ({ page }) => {
    const { errors } = await setup(page);
    await openGame(page, title);
    await page.locator('.game button:not(.game-back)').first().click();
    await page.reload();
    await expect(page.locator('main.game-host .game')).toBeVisible();
    await page.locator('.game-back').click();
    await expect(page.locator('main.play')).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test('Phone back mid-game returns to Play and the game goes quiet', async ({ page }) => {
  const { errors } = await setup(page);
  await openGame(page, 'Name Quiz');
  await page.goBack();
  await expect(page.locator('main.play')).toBeVisible();
  const before = (await spoken(page)).length;
  // Longer than the quiz's 6s idle re-prompt.
  await page.waitForTimeout(6500);
  expect((await spoken(page)).slice(before)).toEqual([]);
  expect(errors).toEqual([]);
});
