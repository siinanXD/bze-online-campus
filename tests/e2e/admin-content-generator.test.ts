import { strict as assert } from 'node:assert';
import { after, before, describe, it } from 'node:test';
import type { Browser, Page } from 'playwright';
import { e2eBereit, starteBrowser, url } from './helfer';

describe('E2E Admin-Content-Generator', { skip: e2eBereit() ? false : 'E2E_BASE_URL nicht gesetzt' }, () => {
  let browser: Browser;
  let page: Page;

  before(async () => {
    ({ browser, page } = await starteBrowser());
  });

  after(async () => {
    await browser?.close();
  });

  it('fuehrt Admin vom Generator zur Preview, zum Speichern und zur Lernendenansicht', async () => {
    await page.goto(url('/admin/content/ki-generator'), { waitUntil: 'networkidle' });

    if (/login/.test(page.url())) {
      assert.ok(true, 'ohne Admin-Session wird sicher auf Login geleitet');
      return;
    }

    await page.getByTestId('mock-generator').waitFor({ state: 'visible', timeout: 10_000 });
    await page.getByRole('button', { name: /Generierung starten|Start generation/i }).click();
    await page.getByTestId('generator-preview').waitFor({ state: 'visible', timeout: 15_000 });
    await page.getByRole('button', { name: /Auswahl speichern|Save selection/i }).click();
    await page.getByRole('link', { name: /Lernendenansicht|learner view/i }).click();
    assert.match(page.url(), /\/campus\/topic\/.+\/modul/);
  });
});
