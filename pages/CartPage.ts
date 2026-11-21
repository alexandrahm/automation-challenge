import { Page } from '@playwright/test';

export class CartPage {
  constructor(private readonly page: Page) {}

  readonly items = () => this.page.locator('[data-test="inventory-item"]');
  readonly checkoutButton = () => this.page.locator('[data-test="checkout"]');

  async goto() {
    await this.page.goto('/cart.html');
  }

  async itemNames(): Promise<string[]> {
    await this.items().first().waitFor();
    return this.items().locator('[data-test="inventory-item-name"]').allInnerTexts();
  }

  async checkout() {
    await this.checkoutButton().click();
  }
}
