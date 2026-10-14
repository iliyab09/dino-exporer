// Regenerates the README screenshots at a 375px phone viewport.
// Usage (from the repo root):
//   npm run build && npx vite preview --port 4179 &
//   npm install --no-save playwright-core
//   CHROME=/usr/bin/google-chrome node docs/screenshots/capture.mjs
import { chromium } from 'playwright-core';

const BASE = process.env.BASE_URL ?? 'http://localhost:4179/';
const OUT = new URL('./', import.meta.url).pathname;

const SHOTS = [
  { name: 'home', steps: [] },
  { name: 'learn', steps: ['Learn'] },
  { name: 'detail', steps: ['Learn', 'first-dino'] },
  { name: 'play', steps: ['Play'] },
  { name: 'game-name-quiz', steps: ['Play', /Name Quiz/] },
  { name: 'game-dino-snacks', steps: ['Play', /Dino Snacks/] },
  // 21 stars = 7 stickers unlocked, so the book isn't empty.
  { name: 'stickers', seedStars: 21, steps: [/dino stickers/] },
  // Mid-game: two cards turned over, and an egg after its first tap.
  { name: 'game-memory-match-mid', steps: ['Play', /Memory Match/, 'Face-down card', 'Face-down card'] },
  { name: 'game-egg-hatch-mid', steps: ['Play', /Egg Hatch/, /^Egg\./] },
];

const browser = await chromium.launch({ executablePath: process.env.CHROME ?? '/usr/bin/google-chrome' });
const context = await browser.newContext({
  viewport: { width: 375, height: 740 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  reducedMotion: 'reduce',
});

for (const shot of SHOTS) {
  const page = await context.newPage();
  if (shot.seedStars) {
    await page.addInitScript((stars) => {
      localStorage.setItem('dino-explorer:progress:v1', JSON.stringify({ best: {}, totalStars: stars }));
    }, shot.seedStars);
  }
  await page.goto(BASE);
  await page.waitForLoadState('networkidle');
  for (const step of shot.steps) {
    if (step === 'first-dino') await page.locator('.learn__grid button').first().click();
    else await page.getByRole('button', { name: step, exact: typeof step === 'string' }).first().click();
    await page.waitForTimeout(400);
  }
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}${shot.name}.png` });
  console.log('saved', shot.name);
  await page.close();
}
await browser.close();
