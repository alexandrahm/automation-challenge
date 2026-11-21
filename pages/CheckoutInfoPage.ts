import { Page } from '@playwright/test';

// checkout-step-one.html: "Checkout: Your Information"
export class CheckoutInfoPage {
  constructor(private readonly page: Page) {}

  readonly firstName = () => this.page.locator('[data-test="firstName"]');
  readonly lastName = () => this.page.locator('[data-test="lastName"]');
  readonly postalCode = () => this.page.locator('[data-test="postalCode"]');
  readonly continueButton = () => this.page.locator('[data-test="continue"]');
  readonly error = () => this.page.locator('[data-test="error"]');

  async fillInfo(firstName: string, lastName: string, postalCode: string) {
    await this.firstName().fill(firstName);
    await this.lastName().fill(lastName);
    await this.postalCode().fill(postalCode);
  }

  async continueToOverview() {
    await this.continueButton().click();
  }
}
