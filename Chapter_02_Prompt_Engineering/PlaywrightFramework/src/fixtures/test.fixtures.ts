import { test as base, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { LoginPage } from '../pages/LoginPage';
import { classifyError, describeError } from '../utils/errors';
import { Logger } from '../utils/logger';

interface Fixtures {
  logger: Logger;
  loginPage: LoginPage;
  forgotPasswordPage: ForgotPasswordPage;
  diagnostics: void;
}

export const test = base.extend<Fixtures>({
  logger: async ({}, use, testInfo) => {
    await use(new Logger(`${testInfo.project.name}:${testInfo.title}`));
  },

  /** Opens the login page before handing the Page Object to the test. */
  loginPage: async ({ page, logger }, use) => {
    const loginPage = new LoginPage(page, logger);
    await loginPage.open();
    await use(loginPage);
  },

  forgotPasswordPage: async ({ page, logger }, use) => {
    await use(new ForgotPasswordPage(page, logger));
  },

  /**
   * Auto fixture: records browser console, page errors and authentication traffic for
   * every test, attaches them as logs and, on failure, adds a full-page screenshot and
   * the classified failure reason to the Allure result.
   */
  diagnostics: [
    async ({ page, logger }, use, testInfo) => {
      const browserEvents: string[] = [];
      page.on('console', (msg) => browserEvents.push(`[console.${msg.type()}] ${msg.text()}`));
      page.on('pageerror', (err) => browserEvents.push(`[pageerror] ${err.message}`));
      page.on('response', (res) => {
        if (res.request().method() === 'POST' && new URL(res.url()).pathname === '/login') {
          browserEvents.push(`[network] POST ${res.url()} -> ${res.status()}`);
        }
      });
      page.on('crash', () => browserEvents.push('[crash] page crashed'));

      await use();

      const failed = testInfo.status !== testInfo.expectedStatus;
      try {
        if (failed && !page.isClosed()) {
          await testInfo.attach('failure-screenshot', {
            body: await page.screenshot({ fullPage: true }),
            contentType: 'image/png',
          });
          await testInfo.attach('failure-url', { body: page.url(), contentType: 'text/plain' });
        }
        if (failed && testInfo.error) {
          await testInfo.attach('failure-category', {
            body: `${classifyError(testInfo.error)}\n${testInfo.error.message ?? ''}`,
            contentType: 'text/plain',
          });
        }
      } catch (error) {
        // The browser may already be gone (browser execution failure); never mask the real test error.
        logger.warn(`Could not capture failure diagnostics: ${describeError(error)}`);
      }
      await testInfo.attach('framework-log', { body: logger.dump() || '(empty)', contentType: 'text/plain' });
      await testInfo.attach('browser-log', { body: browserEvents.join('\n') || '(empty)', contentType: 'text/plain' });
    },
    { auto: true },
  ],
});

export { allure, expect };
