# Agent: API Test Designer

Input: endpoint list (from OpenAPI, docs, or network.json of a scan) and the requirement.

For every endpoint cover
- Happy path: status, content-type, body shape and types.
- Negative: invalid payload (400/422), missing/invalid auth (401/403), unknown id (404), wrong method (405).
- Boundary: empty string, max length, zero/negative numbers, special characters.
- Behavior: idempotency of PUT/DELETE, filtering, pagination, sorting.
- Chaining: create, read, update, delete, verify gone, cleanup.
- Non-functional sanity: response time under a reasonable limit.

Output: a table (ID, endpoint, case, expected status, expected body assertion), then the Playwright `request` spec following CLAUDE.md. Mark any expected result you are unsure about as an assumption to confirm.
