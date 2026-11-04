import { Locator, Page } from '@playwright/test';
import { Logger } from '../utils/logger';
import { BasePage } from './BasePage';

/**
 * Forgot-password view (#/forgot-password). It shares the DOM with the login and SSO
 * views, which both also contain a "Back" button, so locators are filtered to visible ones.
 */
export class ForgotPasswordPage extends BasePage {
  readonly emailInput: Locator;
  readonly resetPasswordButton: Locator;
  readonly backButton: Locator;

  constructor(page: Page, logger?: Logger) {
    super(page, logger);
    this.emailInput = page.getByRole('textbox', { name: 'Email address' }).filter({ visible: true });
    this.resetPasswordButton = page.getByRole('button', { name: 'Reset Password' });
    this.backButton = page.getByRole('button', { name: 'Back', exact: true }).filter({ visible: true });
  }

  async goBackToLogin(): Promise<void> {
    await this.perform('Go back to login from Forgot Password', () => this.backButton.click());
  }
}
