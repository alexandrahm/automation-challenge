import { test, expect } from '../../fixtures/TestFixture';
import { buildCheckoutInfo } from '../../helpers/data';

test.describe('Checkout flow', () => {
  test('standard_user adds two distinct items and completes checkout', async ({
    page,
    loginPage,
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    checkoutCompletePage,
  }) => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory/);

    const firstItemName = 'Sauce Labs Backpack';
    const secondItemName = 'Sauce Labs Bike Light';
    await inventoryPage.addToCartByName(firstItemName);
    await inventoryPage.addToCartByName(secondItemName);
    await expect(inventoryPage.cartBadge()).toHaveText('2');

    await cartPage.goto();
    expect((await cartPage.itemNames()).sort()).toEqual([firstItemName, secondItemName].sort());

    await cartPage.checkout();
    const checkoutInfo = buildCheckoutInfo();
    await checkoutInfoPage.fillInfo(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.postalCode);
    await checkoutInfoPage.continueToOverview();
    expect((await checkoutOverviewPage.itemNames()).sort()).toEqual([firstItemName, secondItemName].sort());

    await checkoutOverviewPage.finish();
    await expect(checkoutCompletePage.header()).toHaveText('Thank you for your order!');
  });
});
