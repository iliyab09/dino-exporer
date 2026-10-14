import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';

// E2E smoke suite: the built app (vite preview) on a 375x667 phone screen.
// Run: npm run build && npm run e2e. Locally you can point at an installed Chrome
// with PW_CHROMIUM_PATH=/usr/bin/google-chrome instead of `npx playwright install chromium`.
const PORT = 4173;
const ci = !!process.env.CI;

export default defineConfig({
  testDir: '.',
  testMatch: '**/*.e2e.ts',
  outputDir: './.results',
  fullyParallel: true,
  workers: ci ? 2 : 4,
  retries: ci ? 1 : 0,
  timeout: 45_000,
  reporter: ci ? [['github'], ['list']] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    viewport: { width: 375, height: 667 },
    hasTouch: true,
    trace: 'retain-on-failure',
    launchOptions: process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {},
  },
  projects: [{ name: 'phone-375', use: { browserName: 'chromium' } }],
  webServer: {
    command: `npx vite preview --port ${PORT} --strictPort`,
    cwd: fileURLToPath(new URL('../..', import.meta.url)),
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !ci,
  },
});
