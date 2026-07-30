/**
 * E2E-Smoke-Tests der kritischen Pfade.
 *
 * Prüft, dass die App überhaupt läuft und die wichtigsten öffentlichen Seiten
 * rendern. Anmeldepflichtige Pfade (Lernen, Prüfung, Berichtsheft) sind hier
 * bewusst nur als Weiterleitung auf den Login geprüft — ein echter Login
 * bräuchte einen Testnutzer in der angebundenen Supabase-Instanz und gehört in
 * einen CI-Lauf mit Seed, nicht in einen Smoke-Test.
 *
 * Ohne `E2E_BASE_URL` überspringt sich die Suite vollständig (siehe helfer.ts).
 */

import { strict as assert } from 'node:assert';
import { after, before, describe, it } from 'node:test';
import type { Browser, Page } from 'playwright';
import { BASIS_URL, e2eBereit, starteBrowser, url } from './helfer';

describe('E2E-Smoke', { skip: e2eBereit() ? false : 'E2E_BASE_URL nicht gesetzt' }, () => {
  let browser: Browser;
  let page: Page;

  before(async () => {
    ({ browser, page } = await starteBrowser());
  });

  after(async () => {
    await browser?.close();
  });

  it('lädt die Login-Seite und zeigt ein Passwortfeld', async () => {
    await page.goto(url('/login'), { waitUntil: 'networkidle' });
    const passwort = page.locator('input[type="password"]');
    await passwort.waitFor({ state: 'visible', timeout: 10_000 });
    assert.ok(await passwort.isVisible());
  });

  it('leitet geschützte Campus-Seiten auf den Login um', async () => {
    await page.goto(url('/campus'), { waitUntil: 'networkidle' });
    // Ohne Sitzung erwartet die Middleware eine Weiterleitung zur Anmeldung.
    assert.match(page.url(), /login|anmeld/i, `unerwartete URL: ${page.url()}`);
  });

  it('zeigt das Impressum als öffentliche Seite', async () => {
    const antwort = await page.goto(url('/impressum'), { waitUntil: 'domcontentloaded' });
    assert.ok(antwort, 'keine Antwort erhalten');
    assert.ok(antwort.status() < 400, `Impressum antwortete mit ${antwort.status()}`);
  });

  it('liefert das PWA-Manifest aus', async () => {
    const antwort = await page.goto(`${BASIS_URL}/manifest.webmanifest`, {
      waitUntil: 'domcontentloaded',
    });
    assert.ok(antwort && antwort.status() === 200, 'Manifest fehlt');
    const inhalt = await antwort.json();
    assert.ok(inhalt.name || inhalt.short_name, 'Manifest ohne Namen');
  });
});
