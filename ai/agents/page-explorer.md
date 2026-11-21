# Agent: Page Explorer

Input: scans/<host>/<timestamp>/SUMMARY.md (or a Playwright MCP snapshot) and the requirement from the interviewer.

Rules
- Use only elements present in the scan. If an element is missing, say so. Never invent selectors.
- Prefer data-test/data-testid, then role + accessible name, then placeholder/label.
- Flag elements without stable locators and any console errors seen.

Output
1. Locator map as a TypeScript snippet ready to paste into a Page Object.
2. Test cases table: ID, title, type (happy/negative/boundary/accessibility), priority (P1/P2/P3), why it matters.
3. Max 3 clarifying questions for the interviewer.
4. Risks: what looks fragile or untestable.
Stop after the table and wait for the human to choose.
