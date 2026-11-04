import { test } from '@playwright/test';
import { AUTH, ROUTES } from '../../src/data/loginData';
import { allure, expect } from '../../src/fixtures/test.fixtures';
import { AuthResult, LoginPage } from '../../src/pages/LoginPage';

/** Records an observation in both the Playwright report and Allure. */
export async function note(type: string, description: string): Promise<void> {
  test.info().annotations.push({ type, description });
  await allure.attachment(type, description, 'text/plain');
}

/**
 * Verified rejection contract of POST /login:
 *  - 401 -> the form stays on #/login and shows the verified error message;
 *  - 429 -> the endpoint is rate limiting (PRD "Rate Limiting"); the message for this
 *           case is not asserted because its UI text has not been verified.
 * In both cases the user must remain unauthenticated on the login page.
 */
export async function expectAuthenticationRejected(loginPage: LoginPage, result: AuthResult): Promise<void> {
  expect([AUTH.rejectedStatus, AUTH.rateLimitedStatus], `Unexpected POST /login status ${result.status}`).toContain(
    result.status,
  );
  await expect(loginPage.page).toHaveURL(ROUTES.login);
  await expect(loginPage.emailInput).toBeVisible();
  await expect(loginPage.signInButton).toBeVisible();

  if (result.rateLimited) {
    await note('rate-limited', 'POST /login returned HTTP 429; error message assertion skipped for this attempt.');
    return;
  }
  expect(await loginPage.getValidationMessage()).toBe(AUTH.rejectedMessage);
}
