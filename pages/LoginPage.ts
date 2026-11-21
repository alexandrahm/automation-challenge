import { Page, expect } from '@playwright/test';

// Page Object: locators live here, assertions about intent live in the tests.
export class LoginPage {
  constructor(private readonly page: Page) {}

  readonly username = () => this.page.getByPlaceholder('Username');
  readonly password = () => this.page.getByPlaceholder('Password');
  readonly submit = () => this.page.getByRole('button', { name: 'Login' });
  readonly error = () => this.page.locator('[data-test="error"]');

  async goto() {
    await this.page.goto('/');
    await expect(this.submit()).toBeVisible();
  }

  async login(user: string, pass: string) {
    await this.username().fill(user);
    await this.password().fill(pass);
    await this.submit().click();
  }
}
