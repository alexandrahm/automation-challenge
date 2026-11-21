import { test, expect } from '../../fixtures/TestFixture';

test.describe('Login', () => {
  test('valid user lands on the inventory page', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/inventory/);
    await expect(inventoryPage.title()).toHaveText('Products');
  });

  test('invalid credentials show an error and stay on the login page (negative)', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'wrong_password');

    await expect(loginPage.error()).toContainText('Username and password do not match');
    await expect(page).toHaveURL('/');
  });
});
