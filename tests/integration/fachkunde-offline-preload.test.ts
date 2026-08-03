import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';

const LERNEINHEIT_PAGE = readFileSync(
  'app/[locale]/campus/topic/[themaId]/lerneinheit/[lerneinheitId]/page.tsx',
  'utf8',
);
const PRELOAD_COMPONENT = readFileSync('app/[locale]/campus/topic/_components/inhalte-vorladen.tsx', 'utf8');
const SERVICE_WORKER = readFileSync('public/sw.js', 'utf8');

describe('Fachkunde Offline-Vorladen', () => {
  it('nutzt den bestehenden Service-Worker-Precache fuer Lerneinheit und Topic', () => {
    assert.match(PRELOAD_COMPONENT, /ladeInhalteVor/);
    assert.match(PRELOAD_COMPONENT, /url\.startsWith\('\/'\)/);
    assert.match(LERNEINHEIT_PAGE, /<InhalteVorladen urls=\{vorladeUrls\} \/>/);
    assert.match(LERNEINHEIT_PAGE, /\/campus\/topic\/\$\{themaId\}/);
    assert.match(LERNEINHEIT_PAGE, /\/lerneinheit\/\$\{lerneinheitId\}/);
    assert.match(SERVICE_WORKER, /PRECACHE_URLS/);
    assert.match(SERVICE_WORKER, /CONTENT_CACHE/);
  });
});
