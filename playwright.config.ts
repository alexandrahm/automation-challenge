import { defineConfig } from '@playwright/test';

// Real exercise targets: Restful-Booker (API) and SauceDemo (UI).
const API_URL = process.env.API_URL ?? 'https://restful-booker.herokuapp.com';
const UI_URL = process.env.UI_URL ?? 'https://www.saucedemo.com';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { trace: 'on-first-retry', screenshot: 'only-on-failure' },
  projects: [
    {
      name: 'api',
      testMatch: /.*\.api\.spec\.ts/,
      use: {
        baseURL: API_URL,
        extraHTTPHeaders: {
          Accept: 'application/json',
          // Authorization: `Bearer ${process.env.API_TOKEN}`,
        },
      },
    },
    {
      name: 'ui',
      testMatch: /.*\.ui\.spec\.ts/,
      use: { baseURL: UI_URL, browserName: 'chromium', headless: true },
    },
  ],
});
