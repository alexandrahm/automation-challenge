import { Page } from '@playwright/test';

// checkout-complete.html: "Thank you for your order!"
export class CheckoutCompletePage {
  constructor(private readonly page: Page) {}

  readonly header = () => this.page.locator('[data-test="complete-header"]');
}
