import { Page, test } from '@playwright/test';
import { FailureCategory, LoginPageError, classifyError, describeError } from '../utils/errors';
import { Logger } from '../utils/logger';

export abstract class BasePage {
  protected readonly logger: Logger;

  protected constructor(readonly page: Page, logger?: Logger) {
    this.logger = logger ?? new Logger(this.constructor.name);
  }

  /**
   * Runs a page action as a reported step. Any failure is logged, classified
   * and rethrown as a typed LoginPageError that keeps the original cause.
   */
  protected async perform<T>(action: string, body: () => Promise<T>, category?: FailureCategory): Promise<T> {
    return test.step(action, async () => {
      this.logger.info(`START ${action}`);
      try {
        const result = await body();
        this.logger.info(`DONE  ${action}`);
        return result;
      } catch (error) {
        const resolved = category ?? classifyError(error);
        this.logger.error(`FAIL  ${action} (${resolved}): ${describeError(error)}`);
        if (error instanceof LoginPageError) throw error;
        throw new LoginPageError(action, resolved, describeError(error), { cause: error });
      }
    });
  }
}
