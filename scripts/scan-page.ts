/**
 * Deterministic page scan (no LLM needed).
 * Usage: npx tsx scripts/scan-page.ts <url>
 * Produces in scans/<host>/<timestamp>/:
 *   aria.yml       accessibility tree (same idea Playwright MCP snapshots use)
 *   elements.json  interactive elements with a suggested locator each
 *   network.json   fetch/XHR calls seen while loading (great for finding the API under the UI)
 *   console.json   console errors and page errors
 *   page.png       full page screenshot
 *   SUMMARY.md     human/LLM readable summary: feed this to the agents in ai/agents
 */
import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

type El = {
  tag: string; role: string | null; type: string | null; text: string;
  id: string | null; name: string | null; placeholder: string | null;
  testId: string | null; ariaLabel: string | null; href: string | null;
};

const suggest = (e: El): string => {
  if (e.testId) return `page.locator('[data-test="${e.testId}"]')`;
  const label = e.ariaLabel || e.text;
  if ((e.tag === 'button' || e.role === 'button') && label) return `page.getByRole('button', { name: '${label}' })`;
  if (e.tag === 'a' && label) return `page.getByRole('link', { name: '${label}' })`;
  if (e.placeholder) return `page.getByPlaceholder('${e.placeholder}')`;
  if (e.ariaLabel) return `page.getByLabel('${e.ariaLabel}')`;
  if (e.id) return `page.locator('#${e.id}')`;
  if (e.name) return `page.locator('[name="${e.name}"]')`;
  return `/* no stable locator, ask devs for a data-testid */ page.locator('${e.tag}')`;
};

async function main() {
  const url = process.argv[2];
  if (!url) { console.error('Usage: npx tsx scripts/scan-page.ts <url>'); process.exit(1); }

  const host = new URL(url).host.replace(/[^a-z0-9.-]/gi, '_');
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const out = path.join('scans', host, stamp);
  fs.mkdirSync(out, { recursive: true });

  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  const page = await browser.newPage();

  const network: { method: string; url: string; status: number; type: string }[] = [];
  const consoleLog: { kind: string; text: string }[] = [];
  page.on('response', (r) => {
    const t = r.request().resourceType();
    if (t === 'fetch' || t === 'xhr') network.push({ method: r.request().method(), url: r.url(), status: r.status(), type: t });
  });
  page.on('console', (m) => { if (m.type() === 'error') consoleLog.push({ kind: 'console.error', text: m.text() }); });
  page.on('pageerror', (e) => consoleLog.push({ kind: 'pageerror', text: e.message }));

  await page.goto(url, { waitUntil: 'networkidle' });

  const aria = await page.locator('body').ariaSnapshot();
  const elements: El[] = await page.evaluate(() => {
    const sel = 'a, button, input, select, textarea, [role="button"], [role="link"], [role="tab"], [role="checkbox"]';
    return Array.from(document.querySelectorAll(sel)).map((el) => {
      const h = el as HTMLElement & { type?: string; name?: string; placeholder?: string; href?: string };
      return {
        tag: el.tagName.toLowerCase(), role: el.getAttribute('role'), type: h.type ?? null,
        text: (h.innerText || (h as HTMLInputElement).value || '').trim().slice(0, 60),
        id: el.id || null, name: h.name || null, placeholder: h.placeholder || null,
        testId: el.getAttribute('data-test') || el.getAttribute('data-testid'),
        ariaLabel: el.getAttribute('aria-label'), href: h.href || null,
      };
    });
  });

  fs.writeFileSync(path.join(out, 'aria.yml'), aria);
  fs.writeFileSync(path.join(out, 'elements.json'), JSON.stringify(elements.map((e) => ({ ...e, suggestedLocator: suggest(e) })), null, 2));
  fs.writeFileSync(path.join(out, 'network.json'), JSON.stringify(network, null, 2));
  fs.writeFileSync(path.join(out, 'console.json'), JSON.stringify(consoleLog, null, 2));
  await page.screenshot({ path: path.join(out, 'page.png'), fullPage: true });

  const summary = [
    `# Scan: ${url}`, `Title: ${await page.title()}`, `Date: ${new Date().toISOString()}`, '',
    `## Interactive elements (${elements.length})`,
    ...elements.map((e) => `- ${e.tag}${e.type ? `[${e.type}]` : ''} "${e.text}" -> ${suggest(e)}`), '',
    `## API calls seen (${network.length})`,
    ...network.map((n) => `- ${n.method} ${n.url} -> ${n.status}`), '',
    `## Console/page errors (${consoleLog.length})`,
    ...consoleLog.map((c) => `- ${c.kind}: ${c.text}`), '',
    '## Accessibility tree', '```yaml', aria, '```', '',
  ].join('\n');
  fs.writeFileSync(path.join(out, 'SUMMARY.md'), summary);

  await browser.close();
  console.log(`Scan saved to ${out}`);
  console.log(`${elements.length} elements, ${network.length} API calls, ${consoleLog.length} errors`);
}

main().catch((e) => { console.error(e); process.exit(1); });
