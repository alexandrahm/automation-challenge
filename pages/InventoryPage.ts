import { Page } from '@playwright/test';

export class InventoryPage {
  constructor(private readonly page: Page) {}

  readonly title = () => this.page.locator('[data-test="title"]');
  readonly items = () => this.page.locator('[data-test="inventory-item"]');
  readonly cartBadge = () => this.page.locator('[data-test="shopping-cart-badge"]');

  async addToCartByName(name: string) {
    const item = this.items().filter({ hasText: name });
    await item.getByRole('button', { name: /add to cart/i }).click();
  }
}
