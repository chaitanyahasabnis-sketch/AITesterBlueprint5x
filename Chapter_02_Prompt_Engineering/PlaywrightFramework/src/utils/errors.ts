import { errors } from '@playwright/test';

export type FailureCategory =
  | 'LOCATOR_TIMEOUT'
  | 'NAVIGATION_FAILURE'
  | 'AUTHENTICATION_FAILURE'
  | 'BROWSER_FAILURE'
  | 'UNEXPECTED_BEHAVIOUR';

/** Typed framework error that keeps the failing action, a category and the original cause. */
export class FrameworkError extends Error {
  constructor(
    readonly action: string,
    readonly category: FailureCategory,
    message: string,
    options?: { cause?: unknown },
  ) {
    super(`[${category}] ${action}: ${message}`, options);
    this.name = 'FrameworkError';
  }
}

export class LoginPageError extends FrameworkError {
  constructor(action: string, category: FailureCategory, message: string, options?: { cause?: unknown }) {
    super(action, category, message, options);
    this.name = 'LoginPageError';
  }
}

const BROWSER_FAILURE_PATTERN = /Target (page, context or browser )?(has been )?closed|Browser has been closed|browser has disconnected/i;
const NAVIGATION_FAILURE_PATTERN = /net::ERR_|NS_ERROR_|page\.goto|Navigation|frame was detached/i;

/** Maps a raw Playwright/runtime error onto a framework failure category. */
export function classifyError(error: unknown): FailureCategory {
  if (error instanceof FrameworkError) return error.category;
  if (error instanceof errors.TimeoutError) return 'LOCATOR_TIMEOUT';
  const message = error instanceof Error ? error.message : String(error);
  if (BROWSER_FAILURE_PATTERN.test(message)) return 'BROWSER_FAILURE';
  if (NAVIGATION_FAILURE_PATTERN.test(message)) return 'NAVIGATION_FAILURE';
  return 'UNEXPECTED_BEHAVIOUR';
}

export function describeError(error: unknown): string {
  return error instanceof Error ? error.message.split('\n')[0] : String(error);
}
