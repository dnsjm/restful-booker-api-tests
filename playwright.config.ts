import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Playwright configuration for the restful-booker API suite.
 *
 * No browser projects — pure HTTP via Playwright's request fixture.
 * Coverage is split into smoke (must-pass critical path) and regression
 * (field validation, contract, edge cases).
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  timeout: 20_000,
  expect: { timeout: 5_000 },

  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['github'],
  ],

  use: {
    baseURL: process.env.BASE_URL ?? 'https://restful-booker.herokuapp.com',
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'api',
      testMatch: /.*\.spec\.ts/,
    },
  ],
});
