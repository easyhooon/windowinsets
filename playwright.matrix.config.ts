import { defineConfig } from '@playwright/test';
import base from './playwright.config';

export default defineConfig({
  ...base,
  testMatch: ['**/annotation-matrix.spec.ts', '**/bar-annotation-matrix.spec.ts'],
  use: { ...base.use, channel: undefined },
  // Serve the prerendered route files directly; no HMR during frame sampling.
  webServer: process.env.PLAYWRIGHT_BASE_URL ? undefined : {
    command: 'pnpm build && node scripts/serve-test-build.mjs',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: (['chromium', 'firefox', 'webkit'] as const).flatMap(browserName => [
    { name: `${browserName}-desktop`, use: { browserName, channel: browserName === 'chromium' ? 'chrome' : undefined, viewport: { width: 1440, height: 900 } } },
    { name: `${browserName}-mobile`, use: { browserName, channel: browserName === 'chromium' ? 'chrome' : undefined, viewport: { width: 390, height: 844 } } },
  ]),
});
