# AI-assisted QA workflow

Goal: use AI to go faster at exploring and drafting, while a human owns the decisions and the review.

## Tools in this template
- `.mcp.json`: registers Playwright MCP (pinned version, isolated browser) so an AI client can drive a real browser.
- `npm run scan -- <url>`: deterministic scan (no LLM). Saves an accessibility tree, interactive elements with suggested locators, the fetch/XHR calls the page makes, console errors and a screenshot into `scans/`.
- `ai/agents/*.md`: reusable agent prompts, one job each.
- `CLAUDE.md`: conventions the AI must follow when it writes code here.

## Flow for the live exercise
1. Scan the target: `npm run scan -- https://their-app.com` (or ask the AI to use Playwright MCP snapshot).
2. Give SUMMARY.md to `page-explorer` to get a locator map and a test case list.
3. Pick the cases YOU think matter. Give them to `test-generator` for the code.
4. Run `npm test`. Failing test: read the real error, fix, do not blindly regenerate.
5. Run `test-reviewer` on the result, then review the diff yourself.
6. For the API exercise: scan to discover the calls the UI makes, then use `api-test-designer`.
7. Suspected bug: `bug-verifier` mindset, reproduce twice, then write the report.

## Agent roles
| File | Job | Output |
|---|---|---|
| page-explorer.md | Turn a scan into locators and test ideas | Locator map + prioritized cases |
| test-generator.md | Write Playwright code from approved cases | Page Object + spec file |
| api-test-designer.md | Design API cases from endpoints/spec | Case table + spec file |
| test-reviewer.md | Review AI-written tests | Findings list |
| bug-verifier.md | Independently confirm a suspected bug | Verdict + evidence |

## How to talk about it in the interview
- "AI is an accelerator for exploration and drafting. I keep the decisions: what to test, risk, and the review."
- Snapshot-first: the agent reads the real page state and never guesses selectors.
- Isolation: one browser per agent so sessions never mix.
- Guardrails: agents never log in, never touch production data, never file bugs without a verification step.
- Risks of AI tests: hallucinated assertions, tests that pass for the wrong reason, over-mocking, flaky locators. Mitigation: run the test, break it on purpose to see it fail, review every assertion.
- Do not paste secrets or proprietary data into prompts.

## Using it in the interview
Ask first if using AI tools is allowed. If yes, share your screen and narrate. If no, the same method works manually: scan, list cases, code, review.

## Using this from VS Code
Run `bash setup-ai.sh` once. It installs the config where each tool expects it.

Option A: Claude Code extension (recommended, uses the agents)
1. Install the "Claude Code" extension, open this folder, open the Claude panel.
2. It reads CLAUDE.md, .mcp.json and .claude/agents automatically. Approve the playwright MCP server when asked.
3. Type /agents to see the 5 agents. Use them by name: "Use the page-explorer agent on <url>" or "@page-explorer".
4. Your own skills in ~/.claude/skills are also available in the extension.

Option B: GitHub Copilot Chat (agent mode)
1. .vscode/mcp.json registers Playwright MCP. Open it and click Start above the server.
2. In Chat choose Agent mode and enable the playwright tools.
3. Copilot reads .github/copilot-instructions.md. Paste an agent prompt from ai/agents when needed.

Quick check: ask "open https://www.saucedemo.com with playwright and list the interactive elements".
