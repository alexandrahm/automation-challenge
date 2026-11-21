# QA Interview Starter (Playwright + TypeScript)

Automation for the BEON QA Automation Exercise:
- **API**: Restful-Booker booking lifecycle (auth -> create -> read -> update -> delete, chained).
- **UI**: SauceDemo checkout flow (login -> add two distinct items -> cart -> checkout -> confirmation).

> Note: this repo intentionally does not include any AI/agent tooling
> (agent prompts, MCP config, AI workflow docs, etc.). Those are my own
> personal tools and were removed on purpose before sharing this project.

## Prerequisites
- Node.js 18+
- npm

## Installation
    npm install
    npx playwright install chromium

## Execution commands
    npm test            # everything: api + ui
    npm run test:api    # API only (Restful-Booker)
    npm run test:ui     # UI only (SauceDemo), headless
    npm run test:headed # UI only, headed (watch the browser)
    npm run report       # open the last HTML report

Targets are env vars, never hardcoded in tests or Page Objects:
    API_URL=https://your-api.example.com UI_URL=https://your-app.example.com npm test

Defaults (see `playwright.config.ts`):
- `API_URL` -> `https://restful-booker.herokuapp.com`
- `UI_URL` -> `https://www.saucedemo.com`

## Framework architecture

```
fixtures/TestFixture.ts   custom Playwright `test`/`expect` that injects every
                          Page Object and the API client as fixtures, so a test
                          asks for what it needs instead of constructing it.
pages/                    Page Object Model: locators + actions only.
                          Assertions about intent stay in the tests.
                          LoginPage, InventoryPage, CartPage, CheckoutInfoPage,
                          CheckoutOverviewPage, CheckoutCompletePage.
api/BookingApiClient.ts   Action class for Restful-Booker: one method per
                          endpoint, returns the raw APIResponse so each test
                          decides what the response means (status, body, etc).
helpers/data.ts           Data factories (buildBooking, buildCheckoutInfo) so
                          no test hardcodes a payload inline, and every run
                          uses fresh, unique data.
tests/api/*.api.spec.ts   API tests, via the `bookingApi` fixture.
tests/ui/*.ui.spec.ts     UI tests, via the page-object fixtures.
```

Every test imports `test`/`expect` from `fixtures/TestFixture`, not directly
from `@playwright/test`, which is what makes the fixtures available:

```ts
import { test, expect } from '../../fixtures/TestFixture';

test('...', async ({ loginPage, inventoryPage }) => { ... });
```

Design choices:
- **Page Object Model**, extended with a thin fixture layer instead of
  `new LoginPage(page)` in every test. Adding a new page/flow means adding one
  class and one fixture entry, no test file needs to change.
- **Action class** (`BookingApiClient`) for the API, mirroring the same idea:
  the test chains `createToken -> createBooking -> getBooking -> updateBooking
  -> deleteBooking`, each step feeding the next with real extracted data
  (token, `bookingid`), never a hardcoded id.
- **Locator strategy**: `data-test` attributes first (both apps expose them),
  `getByRole`/`getByPlaceholder` where there's no data attribute. No XPath,
  no fixed sleeps.
- **Wait handling**: Playwright auto-waits for actions (`click`, `fill`,
  `expect(...)`), but `locator.allInnerTexts()` does **not** auto-wait for
  elements to exist — it reads whatever is in the DOM at that instant. That
  bit me once in `checkout.ui.spec.ts` (see Test Reporting note below), so
  every `itemNames()` helper does `await this.items().first().waitFor()`
  before reading the list.
- **Independent tests**: the UI checkout test adds two named items and
  verifies the same two names carry through cart and checkout overview. API
  tests build a unique booking payload per run (`helpers/data.ts`) so runs
  never collide.

## Test Reporting
Playwright's built-in HTML reporter is wired up in `playwright.config.ts`
(`reporter: [['list'], ['html', { open: 'never' }]]`). Run `npm run report`
after a run to open it.

## Manual QA Bug Report

**Title**: "Name (Z to A)" sort does nothing for `problem_user`

**Description**: On the inventory page, changing the sort dropdown to
"Name (Z to A)" does not reorder the product list. The list stays in its
original A-to-Z order regardless of the selected option, so the sort
feature is non-functional for this user.

**Steps to Reproduce**:
1. Go to https://www.saucedemo.com
2. Log in with `problem_user` / `secret_sauce`
3. On the inventory page, open the sort dropdown and select
   "Name (Z to A)"
4. Read the product names top to bottom

**Expected**: products reorder to Z-A — confirmed this works correctly for
`standard_user` (`Test.allTheThings() T-Shirt` first, `Sauce Labs Backpack`
last).
**Actual**: for `problem_user`, the order is unchanged — still
`Sauce Labs Backpack, Sauce Labs Bike Light, Sauce Labs Bolt T-Shirt, ...`
(A-to-Z), even though "Name (Z to A)" is selected.

**Severity**: Medium — a core product-browsing feature silently fails to do
what the UI says it does; no error is shown, so the user has no way to know
the sort didn't apply.

**Evidence**: https://jam.dev/c/f63ca697-deab-4766-ab74-5f3ce628fd7c
