# Project rules for AI assistants

Stack: Playwright + TypeScript. API tests in tests/api (*.api.spec.ts), UI tests in tests/ui (*.ui.spec.ts).

## Conventions
- UI: Page Objects in pages/. Locators and actions live there, assertions live in the tests.
- Locator priority: data-test/data-testid, then getByRole with name, then getByPlaceholder/getByLabel. Never XPath, never fixed sleeps.
- API: use the `request` fixture. Assert status, content-type, body shape and at least one negative case per endpoint.
- Test data comes from helpers/data.ts. No hardcoded payloads inline.
- Every test is independent and creates its own data with a unique name.
- Base URLs come from API_URL / UI_URL env vars, never hardcoded in tests.

## AI workflow (see ai/README.md)
1. Scan first (`npm run scan -- <url>` or Playwright MCP snapshot). Never invent selectors.
2. Propose test cases before writing code and wait for approval.
3. Generate code following the conventions above, run it, fix failures from real output.
4. Every generated assertion must be understood and reviewed by the human.
