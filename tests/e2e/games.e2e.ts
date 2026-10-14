import { expect, test } from '@playwright/test';
import { expectReward, expectSpoken, lastSpoken, openGame, playNameQuiz, setup, spoken } from './helpers';

test('Name Quiz: 5 right answers reach Reward with 3 stars and a sticker', async ({ page }) => {
  const { errors } = await setup(page);
  await openGame(page, 'Name Quiz');
  await playNameQuiz(page);
  await expectReward(page);
  await expectSpoken(page, 'Three stars');
  // Sticker book: every 3 lifetime stars unlocks a sticker, so a fresh kid's first 3-star round unlocks one.
  await expectSpoken(page, /New sticker! You got the .+!/);
  await page.locator('.reward__book button').click();
  await expect(page.locator('main.stickers')).toBeVisible();
  await expect(page.locator('.stickers__sticker--owned')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('Memory Match: all pairs found reaches Reward', async ({ page }) => {
  const { errors } = await setup(page);
  await openGame(page, 'Memory Match');
  const cards = page.locator('.mm-card');
  await expect(cards).toHaveCount(12);
  const label = async (i: number) => (await cards.nth(i).getAttribute('aria-label')) ?? '';
  const flip = async (i: number) => {
    await cards.nth(i).click();
    await expect(cards.nth(i)).not.toHaveAttribute('aria-label', 'Face-down card');
    return label(i);
  };

  // Flip each card once to learn the deck (each flip shows its name), then match every pair.
  const names: string[] = [];
  for (let i = 0; i < 12; i += 2) {
    names[i] = await flip(i);
    names[i + 1] = await flip(i + 1);
    if (names[i] !== names[i + 1]) await expect(cards.nth(i)).toHaveAttribute('aria-label', 'Face-down card');
  }
  for (const name of new Set(names)) {
    const [a, b] = names.flatMap((n, i) => (n === name ? [i] : []));
    if ((await label(a)) === name) continue; // matched while learning
    await cards.nth(a).click();
    await cards.nth(b).click();
    await expect(cards.nth(b)).toHaveAttribute('aria-label', name);
  }
  await expectSpoken(page, 'You found them all!');
  await expectReward(page);
  expect(errors).toEqual([]);
});

test('Egg Hatch: hatch, hear the dino, then Back reaches Reward with the hatch message', async ({ page }) => {
  const { errors } = await setup(page);
  await openGame(page, 'Egg Hatch');
  await expectSpoken(page, 'Tap the egg to help it hatch!');
  for (let i = 0; i < 3; i++) await page.locator('.eh-egg').click();
  await expectSpoken(page, /It's a baby .+!/);
  await page.locator('.eh-dino').click();
  await page.locator('.game-back').click();
  await expectReward(page);
  await expectSpoken(page, 'You hatched a baby dinosaur!');
  expect(errors).toEqual([]);
});

test('Dino Snacks: sorting 6 dinos reaches Reward', async ({ page }) => {
  const { errors } = await setup(page);
  await openGame(page, 'Dino Snacks');
  for (let round = 0; round < 6; round++) {
    await expect(page.locator('.ds-dino:not([disabled])')).toBeVisible();
    await page.getByRole('button', { name: 'Plants', exact: true }).click();
    if ((await lastSpoken(page)).startsWith('Hmm')) await page.getByRole('button', { name: 'Meat', exact: true }).click();
    await expect.poll(async () => (await spoken(page)).at(-1)).toMatch(/^It ate (plants|meat)/);
    if (round < 5) await expect(page.locator('.ds-dino[disabled]')).toHaveCount(0, { timeout: 4000 });
  }
  await expectReward(page);
  expect(errors).toEqual([]);
});
