import { env, hasValidCredentials } from '../src/config/env';
import { MOBILE_VIEWPORT, ROUTES, invalidCredentials } from '../src/data/loginData';
import { allure, expect, test } from '../src/fixtures/test.fixtures';
import { note } from './support/authAssertions';

const CREDENTIALS_REQUIRED =
  'Requires test data: set VALID_EMAIL and VALID_PASSWORD in .env for a verified test account. No credentials are invented.';

test.describe('VWO Login - positive and UI scenarios', () => {
  test.beforeAll(async ({}, workerInfo) => {
    console.log(`[${workerInfo.project.name}] Starting positive login suite against ${env.baseUrl}`);
  });

  test.beforeEach(async () => {
    await allure.epic('VWO Login Dashboard');
    await allure.feature('Login - positive & UI');
  });

  test.afterEach(async ({ logger }, testInfo) => {
    logger.info(`Finished "${testInfo.title}" with status ${testInfo.status}`);
  });

  test.afterAll(async ({}, workerInfo) => {
    console.log(`[${workerInfo.project.name}] Positive login suite finished`);
  });

  test('should navigate to the login page over HTTPS', async ({ loginPage, page }) => {
    await allure.story('Login page navigation');
    await allure.severity('critical');
    await allure.description('PRD: HTTPS enforcement. The login route loads over HTTPS and plain HTTP is redirected to HTTPS.');

    await expect(page).toHaveURL(ROUTES.login);
    expect(new URL(page.url()).protocol).toBe('https:');
    await expect(page).toHaveTitle('Login - Wingify');

    await page.goto(env.baseUrl.replace(/^https:/, 'http:'));
    await expect(page).toHaveURL(/^https:\/\//);
    await expect(loginPage.emailInput).toBeVisible();
  });

  test('should display all login page elements', async ({ loginPage }) => {
    await allure.story('Login page visibility');
    await allure.severity('critical');
    await allure.description('PRD "Existing Features": email, password, Remember Me, login, forgot password and free-trial link.');

    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.rememberMeLabel).toBeVisible();
    await expect(loginPage.signInButton).toBeVisible();
    await expect(loginPage.signInButton).toBeEnabled();
    await expect(loginPage.forgotPasswordButton).toBeVisible();
    await expect(loginPage.freeTrialLink).toBeVisible();
  });

  test('should auto-focus and accept input in the email field', async ({ loginPage }) => {
    await allure.story('Email field functionality');
    await allure.severity('normal');
    await allure.description('PRD: auto-focus on the first input, email-type input (mobile keyboard), editable value.');

    await expect(loginPage.emailInput).toBeFocused();
    await expect(loginPage.emailInput).toHaveAttribute('type', 'email');
    await expect(loginPage.emailInput).toHaveAttribute('placeholder', 'Enter email ID');

    await loginPage.enterEmail(invalidCredentials.unregisteredEmail);
    await expect(loginPage.emailInput).toHaveValue(invalidCredentials.unregisteredEmail);

    await loginPage.enterEmail('');
    await expect(loginPage.emailInput).toHaveValue('');
  });

  test('should mask the password and toggle its visibility', async ({ loginPage }) => {
    await allure.story('Password field functionality');
    await allure.severity('critical');
    await allure.description('PRD: password protection. Input is masked by default; the visibility toggle reveals and re-masks it.');

    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    await loginPage.enterPassword(invalidCredentials.wrongPassword);
    await expect(loginPage.passwordInput).toHaveValue(invalidCredentials.wrongPassword);

    await loginPage.togglePasswordVisibility();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');

    await loginPage.togglePasswordVisibility();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('should check and uncheck the Remember Me checkbox', async ({ loginPage }) => {
    await allure.story('Remember Me checkbox');
    await allure.severity('normal');
    await allure.description('PRD: Remember Me checkbox. Unchecked by default; clicking its label toggles it.');

    await expect(loginPage.rememberMeCheckbox).not.toBeChecked();
    await loginPage.setRememberMe(true);
    await expect(loginPage.rememberMeCheckbox).toBeChecked();
    await loginPage.setRememberMe(false);
    await expect(loginPage.rememberMeCheckbox).not.toBeChecked();
  });

  test('should keep the Remember Me selection while the form is filled', async ({ loginPage }) => {
    await allure.story('Remember Me selection behaviour');
    await allure.severity('normal');

    await loginPage.setRememberMe(true);
    await loginPage.enterEmail(invalidCredentials.unregisteredEmail);
    await loginPage.enterPassword(invalidCredentials.wrongPassword);
    await loginPage.togglePasswordVisibility();
    await expect(loginPage.rememberMeCheckbox).toBeChecked();
  });

  test('should log in with valid credentials and land on the dashboard', async ({ loginPage, page }) => {
    await allure.story('Successful login');
    await allure.severity('blocker');
    await allure.description('PRD: successful authentication redirects the user to the VWO dashboard.');
    test.skip(!hasValidCredentials(), CREDENTIALS_REQUIRED);

    const result = await loginPage.login(env.validEmail, env.validPassword);
    expect(result.status).toBeLessThan(400);
    await expect(page).toHaveURL(ROUTES.dashboard);
    await expect(loginPage.loginForm).toBeHidden();
  });

  test('should keep the session in a new tab when Remember Me is selected', async ({ loginPage, context }) => {
    await allure.story('Remember Me selection behaviour');
    await allure.severity('critical');
    await allure.description('PRD: session management / remembered credentials. A remembered session opens the dashboard in a new tab.');
    test.skip(!hasValidCredentials(), CREDENTIALS_REQUIRED);

    await loginPage.login(env.validEmail, env.validPassword, { rememberMe: true });
    await expect(loginPage.page).toHaveURL(ROUTES.dashboard);

    const secondTab = await context.newPage();
    try {
      await secondTab.goto(env.baseUrl.replace(/#\/login$/, '#/dashboard'));
      await expect(secondTab).toHaveURL(ROUTES.dashboard);
    } finally {
      await secondTab.close();
    }
  });

  test('should support keyboard navigation through the login form', async ({ loginPage, page }) => {
    await allure.story('Keyboard navigation');
    await allure.severity('normal');
    await allure.description('PRD: full keyboard accessibility. Verified tab order of the login form controls.');

    await loginPage.emailInput.focus();
    const expectedOrder = [
      loginPage.passwordInput,
      loginPage.passwordVisibilityToggle,
      loginPage.forgotPasswordButton,
      loginPage.signInButton,
    ];
    for (const control of expectedOrder) {
      await page.keyboard.press('Tab');
      await expect(control).toBeFocused();
    }
    await note(
      'accessibility-gap',
      'Observed: the Remember Me checkbox is not part of the tab sequence (Forgot Password? -> Sign in). PRD requires keyboard access to all interactive elements.',
    );
  });

  test('should open Forgot Password and return to login', async ({ loginPage, forgotPasswordPage, page }) => {
    await allure.story('Forgot password navigation');
    await allure.severity('critical');
    await allure.description('PRD: Forgot Password flow.');

    await loginPage.enterEmail(invalidCredentials.unregisteredEmail);
    await loginPage.openForgotPassword();
    await expect(page).toHaveURL(ROUTES.forgotPassword);
    await expect(forgotPasswordPage.resetPasswordButton).toBeVisible();
    // Verified behaviour: the email typed on the login form is carried over.
    await expect(forgotPasswordPage.emailInput).toHaveValue(invalidCredentials.unregisteredEmail);

    await forgotPasswordPage.goBackToLogin();
    await expect(page).toHaveURL(ROUTES.login);
    await expect(loginPage.signInButton).toBeVisible();
  });

  test('should open free trial registration in a new tab', async ({ loginPage }) => {
    await allure.story('Free trial registration navigation');
    await allure.severity('normal');
    await allure.description('PRD: account registration link to free-trial signup.');

    await expect(loginPage.freeTrialLink).toHaveAttribute('href', ROUTES.freeTrialLink);
    await expect(loginPage.freeTrialLink).toHaveAttribute('target', '_blank');

    const trialPage = await loginPage.openFreeTrial();
    try {
      await expect(trialPage).toHaveURL(ROUTES.freeTrialLanding);
    } finally {
      await trialPage.close();
    }
  });

  test('should flag a malformed email when the field loses focus', async ({ loginPage }) => {
    await allure.story('Field validation on blur');
    await allure.severity('normal');
    await allure.description('PRD: real-time validation on blur. Verified native email validation state on blur.');

    await loginPage.enterEmail('plainaddress');
    await loginPage.blurEmailField();
    await expect(loginPage.passwordInput).toBeFocused();
    expect(await loginPage.isEmailFormatValid()).toBe(false);
    await expect(loginPage.authErrorMessage).toBeHidden();

    await loginPage.enterEmail(invalidCredentials.unregisteredEmail);
    await loginPage.blurEmailField();
    expect(await loginPage.isEmailFormatValid()).toBe(true);

    await note('prd-gap', 'Observed: no visible inline validation message is rendered on blur; only the native validity state changes.');
  });

  test('should show a loading indicator while authenticating', async ({ loginPage }) => {
    await allure.story('Loading state during authentication');
    await allure.severity('normal');
    await allure.description('PRD: clear feedback during authentication processing.');

    await expect(loginPage.signInLoader).toBeHidden();
    await loginPage.enterEmail(invalidCredentials.unregisteredEmail);
    await loginPage.enterPassword(invalidCredentials.wrongPassword);

    const authRequest = await loginPage.holdNextAuthRequest();
    try {
      await loginPage.clickSignIn();
      await expect(loginPage.signInLoader).toBeVisible();
      await expect(loginPage.signInButton).toHaveClass(/is-in-action/);
    } finally {
      await authRequest.release();
    }
    await expect(loginPage.signInLoader).toBeHidden();
  });

  test('should keep the login form usable on a mobile viewport', async ({ loginPage, page }) => {
    await allure.story('Responsive login page');
    await allure.severity('minor');
    await allure.description('PRD: responsive design. Key controls stay visible and inside a 390px-wide viewport.');

    await page.setViewportSize(MOBILE_VIEWPORT);
    await loginPage.open();
    for (const control of [loginPage.emailInput, loginPage.passwordInput, loginPage.signInButton]) {
      await expect(control).toBeVisible();
      const box = await control.boundingBox();
      expect(box, 'control should have a layout box').not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(MOBILE_VIEWPORT.width);
    }
  });

  test('should offer Light and Dark mode options if available', async ({ page }) => {
    await allure.story('Light / Dark mode');
    await allure.severity('trivial');
    await allure.description('PRD mentions Light/Dark mode announcements. Verified only if a theme control exists on the login page.');

    const themeControl = page.getByRole('button', { name: /dark mode|light mode|theme/i });
    test.skip((await themeControl.count()) === 0, 'Not implemented on the live login page: no Light/Dark mode control is present.');
    await expect(themeControl.first()).toBeVisible();
  });
});
