import { expect, type Page } from '@playwright/test';

declare global {
  interface Window {
    __spoken: string[];
  }
}

/**
 * Replace speechSynthesis with a recorder before the app loads. Kids can't read, so
 * the tests assert what the app *says*, not just what it shows.
 */
export async function setup(page: Page): Promise<{ errors: string[] }> {
  await page.addInitScript(() => {
    window.__spoken = [];
    const fake = {
      speak: (u: { text: string }) => window.__spoken.push(u.text),
      cancel() {},
      pause() {},
      resume() {},
      getVoices: () => [],
      addEventListener() {},
      removeEventListener() {},
      speaking: false,
      pending: false,
      paused: false,
    };
    Object.defineProperty(window, 'speechSynthesis', { value: fake, configurable: true });
    (window as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance = function (
      this: { text: string },
      text: string,
    ) {
      this.text = text;
    };
  });
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  return { errors };
}

export const spoken = (page: Page) => page.evaluate(() => window.__spoken);
export const lastSpoken = async (page: Page) => (await spoken(page)).at(-1) ?? '';

/** Wait until some spoken line matches. */
export async function expectSpoken(page: Page, match: RegExp | string, timeout = 5000) {
  await expect
    .poll(async () => (await spoken(page)).some((t) => (typeof match === 'string' ? t.includes(match) : match.test(t))), {
      timeout,
      message: `expected speech matching ${match}`,
    })
    .toBe(true);
}

export async function openGame(page: Page, title: string) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Play', exact: true }).click();
  await page.getByRole('button', { name: title }).click();
  await expect(page.locator('.game')).toBeVisible();
}

export async function expectReward(page: Page) {
  await expect(page.locator('main.reward')).toBeVisible({ timeout: 10_000 });
}

/** Answer all Name Quiz rounds correctly, using the spoken question. */
export async function playNameQuiz(page: Page) {
  for (let round = 0; round < 5; round++) {
    let question = '';
    await expect
      .poll(async () => {
        question = (await spoken(page)).filter((t) => t.startsWith('Which one is the')).at(-1) ?? '';
        return question;
      })
      .not.toBe('');
    const name = question.replace(/^Which one is the /, '').replace(/\?$/, '');
    await page.locator(`.nq-option[aria-label="${name}"]`).click();
    await expectSpoken(page, `That's the ${name}!`);
    // Clear so the next round's question is the only one.
    await page.evaluate(() => (window.__spoken = []));
    if (round < 4) await expect(page.locator('.nq-option.right')).toHaveCount(0, { timeout: 4000 });
  }
}
