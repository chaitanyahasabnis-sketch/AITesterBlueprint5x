import { Locator, Page, Response, Route } from '@playwright/test';
import { env } from '../config/env';
import { AUTH } from '../data/loginData';
import { LoginPageError } from '../utils/errors';
import { Logger } from '../utils/logger';
import { BasePage } from './BasePage';

export interface AuthResult {
  status: number;
  rateLimited: boolean;
}

/**
 * Page Object for https://app.wingify.com/#/login.
 *
 * Locators were taken from the live page (2026-11-04). The page keeps the login,
 * forgot-password, SSO and reset-password views in the DOM at the same time and
 * they share labels/placeholders, so every login control is scoped to the login
 * form, which has no accessible name and is therefore located by its stable id (XPath).
 */
export class LoginPage extends BasePage {
  readonly loginForm: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly passwordVisibilityToggle: Locator;
  readonly forgotPasswordButton: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly rememberMeLabel: Locator;
  readonly signInButton: Locator;
  readonly signInLoader: Locator;
  readonly freeTrialLink: Locator;
  readonly authErrorMessage: Locator;

  constructor(page: Page, logger?: Logger) {
    super(page, logger);
    this.loginForm = page.locator('xpath=//form[@id="js-login-form"]');
    this.emailInput = this.loginForm.getByRole('textbox', { name: 'Email address' });
    this.passwordInput = this.loginForm.getByRole('textbox', { name: 'Password', exact: true });
    this.passwordVisibilityToggle = this.loginForm.getByRole('button', { name: 'Toggle password visibility' });
    this.forgotPasswordButton = this.loginForm.getByRole('button', { name: 'Forgot Password?' });
    // The native checkbox is visually hidden; its state is read through the label association
    // and it is toggled by clicking the visible label, exactly as a user does.
    this.rememberMeCheckbox = this.loginForm.getByLabel('Remember me');
    this.rememberMeLabel = this.loginForm.getByText('Remember me', { exact: true });
    this.signInButton = this.loginForm.getByRole('button', { name: 'Sign in', exact: true });
    // Spinner rendered inside the Sign in button while authentication is in progress (no role/label).
    this.signInLoader = this.signInButton.locator('xpath=.//span[contains(@class,"loader")]');
    this.freeTrialLink = page.getByRole('link', { name: 'Start a FREE TRIAL' });
    // Notification box has no role or accessible name; fall back to its stable id.
    this.authErrorMessage = page.locator('xpath=//*[@id="js-notification-box-msg"]');
  }

  async open(): Promise<void> {
    await this.perform(
      `Open login page ${env.baseUrl}`,
      async () => {
        const response = await this.page.goto(env.baseUrl, { waitUntil: 'domcontentloaded' });
        if (response && !response.ok()) {
          throw new Error(`Login page responded with HTTP ${response.status()}`);
        }
        await this.emailInput.waitFor({ state: 'visible' });
      },
      'NAVIGATION_FAILURE',
    );
  }

  async enterEmail(email: string): Promise<void> {
    await this.perform(`Enter email "${email}"`, () => this.emailInput.fill(email));
  }

  async enterPassword(password: string): Promise<void> {
    await this.perform('Enter password (masked)', () => this.passwordInput.fill(password));
  }

  async setRememberMe(checked: boolean): Promise<void> {
    await this.perform(`Set Remember me = ${checked}`, async () => {
      if ((await this.rememberMeCheckbox.isChecked()) === checked) return;
      await this.rememberMeLabel.click();
      if ((await this.rememberMeCheckbox.isChecked()) !== checked) {
        throw new LoginPageError('setRememberMe', 'UNEXPECTED_BEHAVIOUR', 'Checkbox state did not change after clicking its label');
      }
    });
  }

  async clickSignIn(): Promise<void> {
    await this.perform('Click Sign in', () => this.signInButton.click());
  }

  /** Clicks Sign in and waits for the authentication response from POST /login. */
  async submitLogin(): Promise<AuthResult> {
    return this.perform(
      'Submit login and wait for authentication response',
      async () => {
        const [response] = await Promise.all([this.waitForAuthResponse(), this.signInButton.click()]);
        return this.toAuthResult(response);
      },
      'AUTHENTICATION_FAILURE',
    );
  }

  /** Same as submitLogin(), but submits with the Enter key from the password field. */
  async submitLoginWithEnterKey(): Promise<AuthResult> {
    return this.perform(
      'Submit login with Enter key',
      async () => {
        const [response] = await Promise.all([this.waitForAuthResponse(), this.passwordInput.press('Enter')]);
        return this.toAuthResult(response);
      },
      'AUTHENTICATION_FAILURE',
    );
  }

  async login(email: string, password: string, options: { rememberMe?: boolean } = {}): Promise<AuthResult> {
    await this.enterEmail(email);
    await this.enterPassword(password);
    if (options.rememberMe !== undefined) await this.setRememberMe(options.rememberMe);
    return this.submitLogin();
  }

  /** Returns the authentication error text shown after a rejected login. */
  async getValidationMessage(): Promise<string> {
    return this.perform('Read authentication error message', async () => {
      await this.authErrorMessage.waitFor({ state: 'visible' });
      return (await this.authErrorMessage.innerText()).trim();
    });
  }

  async togglePasswordVisibility(): Promise<void> {
    await this.perform('Toggle password visibility', () => this.passwordVisibilityToggle.click());
  }

  /** Native HTML constraint validation of the email input (the form itself is `novalidate`). */
  async isEmailFormatValid(): Promise<boolean> {
    return this.perform('Read email field validity', () =>
      this.emailInput.evaluate((input) => (input as HTMLInputElement).checkValidity()),
    );
  }

  async blurEmailField(): Promise<void> {
    await this.perform('Move focus out of email field (Tab)', () => this.emailInput.press('Tab'));
  }

  async openForgotPassword(): Promise<void> {
    await this.perform('Open Forgot Password', () => this.forgotPasswordButton.click());
  }

  /** The Free Trial link opens in a new tab (target=_blank); returns that tab once it has loaded. */
  async openFreeTrial(): Promise<Page> {
    return this.perform(
      'Open Free Trial registration',
      async () => {
        const [popup] = await Promise.all([this.page.context().waitForEvent('page'), this.freeTrialLink.click()]);
        await popup.waitForLoadState('domcontentloaded');
        return popup;
      },
      'NAVIGATION_FAILURE',
    );
  }

  /**
   * Holds the next POST /login request until the returned `release` is called, so the
   * in-flight UI can be observed deterministically without fixed waits.
   */
  async holdNextAuthRequest(): Promise<{ release: () => Promise<void> }> {
    return this.perform('Hold next authentication request', async () => {
      let releaseRequest!: () => void;
      const gate = new Promise<void>((resolve) => (releaseRequest = resolve));
      const handler = async (route: Route): Promise<void> => {
        if (route.request().method() !== 'POST') return route.continue();
        await gate;
        await route.continue();
      };
      // `times: 1` removes the route by itself once the held request has been handled.
      await this.page.route(this.authEndpointPattern(), handler, { times: 1 });
      return {
        release: async () => {
          const response = this.waitForAuthResponse();
          releaseRequest();
          await response;
        },
      };
    });
  }

  private waitForAuthResponse(): Promise<Response> {
    return this.page.waitForResponse(
      (res) => res.request().method() === 'POST' && this.authEndpointPattern().test(res.url()),
    );
  }

  private authEndpointPattern(): RegExp {
    const origin = new URL(env.baseUrl).origin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`^${origin}${AUTH.loginEndpointPath}(\\?|$)`);
  }

  private toAuthResult(response: Response): AuthResult {
    const status = response.status();
    this.logger.info(`POST ${AUTH.loginEndpointPath} -> HTTP ${status}`);
    return { status, rateLimited: status === AUTH.rateLimitedStatus };
  }
}
