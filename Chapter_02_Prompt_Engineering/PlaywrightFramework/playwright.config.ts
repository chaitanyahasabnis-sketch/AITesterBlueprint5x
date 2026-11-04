import os from 'node:os';
import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/env';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: env.expectTimeout },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // The login endpoint is rate limited (verified HTTP 429); keep concurrency modest.
  workers: env.workers,
  outputDir: 'test-results/artifacts',

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    [
      'allure-playwright',
      {
        resultsDir: 'allure-results',
        detail: true,
        suiteTitle: true,
        environmentInfo: {
          'Application URL': env.baseUrl,
          'Node.js': process.version,
          OS: `${os.type()} ${os.release()}`,
          'Valid credentials supplied': String(env.validEmail !== '' && env.validPassword !== ''),
        },
      },
    ],
  ],

  use: {
    baseURL: env.baseUrl,
    headless: env.headless,
    actionTimeout: env.actionTimeout,
    navigationTimeout: env.navigationTimeout,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    locale: 'en-US',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
