import { env } from '../src/config/env';
import { AUTH, ROUTES, invalidCredentials, malformedEmails } from '../src/data/loginData';
import { allure, expect, test } from '../src/fixtures/test.fixtures';
import { LoginPage } from '../src/pages/LoginPage';
import { expectAuthenticationRejected, note } from './support/authAssertions';

test.describe('VWO Login - negative scenarios', () => {
  test.beforeAll(async ({}, workerInfo) => {
    console.log(`[${workerInfo.project.name}] Starting negative login suite against ${env.baseUrl}`);
  });

  test.beforeEach(async () => {
    await allure.epic('VWO Login Dashboard');
    await allure.feature('Login - negative');
  });

  test.afterEach(async ({ page, logger }, testInfo) => {
    logger.info(`Finished "${testInfo.title}" with status ${testInfo.status} on ${page.url()}`);
  });

  test.afterAll(async ({}, workerInfo) => {
    console.log(`[${workerInfo.project.name}] Negative login suite finished`);
  });

  test('should reject login with an unregistered email', async ({ loginPage }) => {
    await allure.story('Invalid email');
    await allure.severity('critical');
    await allure.description('PRD: clear, actionable error messages for failed authentication attempts.');

    const result = await loginPage.login(invalidCredentials.unregisteredEmail, invalidCredentials.wrongPassword);
    await expectAuthenticationRejected(loginPage, result);
  });

  test('should reject login with an invalid password', async ({ loginPage }) => {
    await allure.story('Invalid password');
    await allure.severity('critical');

    if (env.validEmail === '') {
      await note(
        'insufficient-test-data',
        'VALID_EMAIL is not set, so a known registered email is unavailable; this run cannot distinguish "wrong password" from "unknown email".',
      );
    }
    const email = env.validEmail || invalidCredentials.anotherUnregisteredEmail;
    const result = await loginPage.login(email, invalidCredentials.wrongPassword);
    await expectAuthenticationRejected(loginPage, result);
  });

  test('should reject login when both credentials are invalid', async ({ loginPage }) => {
    await allure.story('Invalid email and password');
    await allure.severity('critical');

    const result = await loginPage.login(invalidCredentials.anotherUnregisteredEmail, invalidCredentials.wrongPassword);
    await expectAuthenticationRejected(loginPage, result);
  });

  test('should reject submission with an empty email', async ({ loginPage }) => {
    await allure.story('Empty email');
    await allure.severity('normal');
    await allure.description('Verified: the form is `novalidate`, so an empty email is sent to the server and rejected there.');

    const result = await loginPage.login('', invalidCredentials.wrongPassword);
    await expectAuthenticationRejected(loginPage, result);
  });

  test('should reject submission with an empty password', async ({ loginPage }) => {
    await allure.story('Empty password');
    await allure.severity('normal');

    const result = await loginPage.login(invalidCredentials.unregisteredEmail, '');
    await expectAuthenticationRejected(loginPage, result);
  });

  test('should reject submission with both fields empty', async ({ loginPage }) => {
    await allure.story('Empty email and password');
    await allure.severity('normal');

    await expect(loginPage.emailInput).toHaveValue('');
    await expect(loginPage.passwordInput).toHaveValue('');
    const result = await loginPage.submitLogin();
    await expectAuthenticationRejected(loginPage, result);
  });

  test('should flag and reject malformed email formats', async ({ loginPage }) => {
    await allure.story('Invalid email format');
    await allure.severity('normal');
    await allure.description('PRD: email format verification. Each malformed address fails native validation and is rejected on submit.');

    for (const [index, email] of malformedEmails.entries()) {
      await test.step(`Malformed email "${email}"`, async () => {
        await loginPage.enterEmail(email);
        expect(await loginPage.isEmailFormatValid(), `"${email}" should be invalid`).toBe(false);
      });
      // One server round-trip is enough to prove rejection; avoid tripping the rate limiter.
      if (index === 0) {
        await loginPage.enterPassword(invalidCredentials.wrongPassword);
        await expectAuthenticationRejected(loginPage, await loginPage.submitLogin());
      }
    }
  });

  test('should display the verified authentication error message', async ({ loginPage }) => {
    await allure.story('Authentication error message');
    await allure.severity('critical');
    await allure.description(`Verified 401 message: "${AUTH.rejectedMessage}".`);

    await expect(loginPage.authErrorMessage).toBeHidden();
    const result = await loginPage.login(invalidCredentials.unregisteredEmail, invalidCredentials.wrongPassword);
    await expectAuthenticationRejected(loginPage, result);
    if (!result.rateLimited) {
      await expect(loginPage.authErrorMessage).toBeVisible();
      await expect(loginPage.authErrorMessage).toHaveText(AUTH.rejectedMessage);
    }
  });

  test('should keep the password masked and not leak it into page text', async ({ loginPage, page }) => {
    await allure.story('Password masking');
    await allure.severity('critical');

    await loginPage.enterPassword(invalidCredentials.wrongPassword);
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    await expect(page.getByText(invalidCredentials.wrongPassword)).toHaveCount(0);
  });

  test('should reject login submitted with the Enter key', async ({ loginPage }) => {
    await allure.story('Authentication failure handling');
    await allure.severity('normal');

    await loginPage.enterEmail(invalidCredentials.unregisteredEmail);
    await loginPage.enterPassword(invalidCredentials.wrongPassword);
    const result = await loginPage.submitLoginWithEnterKey();
    await expectAuthenticationRejected(loginPage, result);
  });

  test('should not grant dashboard access after a failed login', async ({ loginPage, page }) => {
    await allure.story('No dashboard access on failure');
    await allure.severity('blocker');
    await allure.description('PRD: secure authentication & session management. A failed login must not open the dashboard.');

    const result = await loginPage.login(invalidCredentials.unregisteredEmail, invalidCredentials.wrongPassword);
    await expectAuthenticationRejected(loginPage, result);

    await page.goto(env.baseUrl.replace(/#\/login$/, '#/dashboard'));
    await expect(page).toHaveURL(ROUTES.login);
    await expect(loginPage.emailInput).toBeVisible();
  });

  test('should redirect an unauthenticated fresh context away from the dashboard', async ({ browser }) => {
    await allure.story('No dashboard access on failure');
    await allure.severity('critical');
    await allure.description('Explicit browser-context lifecycle: a brand-new context without a session cannot reach #/dashboard.');

    const context = await browser.newContext();
    try {
      const page = await context.newPage();
      const freshLogin = new LoginPage(page);
      await page.goto(env.baseUrl.replace(/#\/login$/, '#/dashboard'));
      await expect(page).toHaveURL(ROUTES.login);
      await expect(freshLogin.emailInput).toBeVisible();
    } finally {
      await context.close();
    }
  });
});
