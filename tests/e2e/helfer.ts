/**
 * Helfer für die E2E-Tests.
 *
 * Die E2E-Tests brauchen eine **laufende App** (Next.js + Supabase). Weil das
 * in einer reinen Unit-Umgebung nicht immer verfügbar ist, überspringen sich
 * die Tests selbst, wenn `E2E_BASE_URL` nicht gesetzt ist — statt fehlzuschlagen
 * oder eine Grünmeldung vorzutäuschen, die nichts geprüft hat.
 *
 * Aktivieren:
 *   pnpm build && pnpm start        # in einem Terminal, mit Supabase-Env
 *   E2E_BASE_URL=http://localhost:3000 pnpm test:e2e
 *
 * Der Browser (Chromium) ist in der Zielumgebung unter PLAYWRIGHT_BROWSERS_PATH
 * vorinstalliert; es wird nichts nachgeladen.
 */

import { chromium, type Browser, type Page } from 'playwright';

/** Basis-URL der laufenden App, oder null wenn keine gesetzt ist. */
export const BASIS_URL = process.env.E2E_BASE_URL ?? null;

/** Standardsprache im Pfad — die App leitet `/` ohnehin auf `/de` um. */
export const LOCALE = process.env.E2E_LOCALE ?? 'de';

/**
 * Meldet, ob E2E laufen kann. Wird am Anfang jeder Suite geprüft; ohne laufende
 * App werden die einzelnen Tests übersprungen (siehe `beschreibeE2E`).
 */
export function e2eBereit(): boolean {
  return Boolean(BASIS_URL);
}

/** Baut eine vollständige URL aus einem Pfad ohne Sprachpräfix. */
export function url(pfad: string): string {
  const basis = BASIS_URL ?? 'http://localhost:3000';
  const sauber = pfad.startsWith('/') ? pfad : `/${pfad}`;
  return `${basis}/${LOCALE}${sauber === '/' ? '' : sauber}`;
}

/**
 * Startet einen Browser und gibt Aufräumfunktion und Seite zurück.
 *
 * Headless und ohne Sandbox — Letzteres ist in Containern nötig, in denen der
 * Prozess als root läuft.
 */
export async function starteBrowser(): Promise<{ browser: Browser; page: Page }> {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  return { browser, page };
}
