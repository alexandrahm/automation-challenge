import { Page } from '@playwright/test';

// checkout-step-two.html: order summary + totals, before the final "Finish".
export class CheckoutOverviewPage {
  constructor(private readonly page: Page) {}

  readonly items = () => this.page.locator('[data-test="inventory-item"]');
  readonly subtotal = () => this.page.locator('[data-test="subtotal-label"]');
  readonly tax = () => this.page.locator('[data-test="tax-label"]');
  readonly total = () => this.page.locator('[data-test="total-label"]');
  readonly finishButton = () => this.page.locator('[data-test="finish"]');

  async itemNames(): Promise<string[]> {
    await this.items().first().waitFor();
    return this.items().locator('[data-test="inventory-item-name"]').allInnerTexts();
  }

  async finish() {
    await this.finishButton().click();
  }
}
