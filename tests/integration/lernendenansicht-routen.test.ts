import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();

const MODUL_PAGE = read('app/[locale]/campus/topic/[themaId]/modul/page.tsx');
const CONTENT_QUERIES = read('app/[locale]/campus/topic/_lib/content-queries.ts');
const LERNEN_INDEX = read('app/[locale]/campus/lernen/page.tsx');
const LERNEN_THEMA = read('app/[locale]/campus/lernen/thema/[themaId]/page.tsx');
const BOTTOM_NAV = read('components/shell/bottom-nav.tsx');
const MESSAGES = read('messages/de.json');

/**
 * Liest eine Projektdatei als UTF-8.
 */
function read(path: string): string {
  return readFileSync(join(ROOT, path), 'utf8');
}

describe('Lernendenansicht Routen', () => {
  it('laedt Content serverseitig mit dem RLS-Client und ohne Service-Role', () => {
    assert.match(MODUL_PAGE, /createServerSupabase/);
    assert.match(CONTENT_QUERIES, /from\('v_content_elemente_sichtbar'\)/);
    assert.doesNotMatch(MODUL_PAGE + CONTENT_QUERIES, /service_role|SUPABASE_SERVICE_ROLE/i);
  });

  it('verwendet die bestehende Fragenstruktur und verlinkt auf den Uebungsmodus', () => {
    assert.match(CONTENT_QUERIES, /from\('fragen'\)/);
    assert.match(CONTENT_QUERIES, /antwortoptionen/);
    assert.match(MODUL_PAGE, /campus\/lernen\/thema/);
    assert.doesNotMatch(MODUL_PAGE, /beantworteMc|fragen_mastery\.insert|from\('fragen_mastery'\)\.insert/);
  });

  it('filtert Teilnehmerinhalte nicht doppelt an RLS vorbei nach Freigabestatus', () => {
    assert.doesNotMatch(LERNEN_INDEX, /\.eq\('status', 'freigegeben'\)/);
    assert.doesNotMatch(LERNEN_THEMA, /\.eq\('status', 'freigegeben'\)/);
    assert.doesNotMatch(CONTENT_QUERIES, /\.eq\('status', 'freigegeben'\)/);
  });

  it('enthaelt Leerzustaende und Content-Reihenfolge in der Lernmodul-Seite', () => {
    for (const key of [
      'abschnitte.einfuehrung',
      'abschnitte.erklaerung',
      'abschnitte.lernkarten',
      'abschnitte.uebungen',
      'abschnitte.praxisfaelle',
      'abschnitte.rechenaufgaben',
      'abschnitte.quiz',
      'abschnitte.zusammenfassung',
    ]) {
      assert.match(MODUL_PAGE, new RegExp(key.replace('.', '\\.')));
    }
    assert.match(MODUL_PAGE, /LeerZustand/);
  });

  it('fuehrt Fachkunde in der mobilen Hauptnavigation unter Lernen', () => {
    assert.match(BOTTOM_NAV, /aktivPfade: \['\/campus\/topic'\]/);
  });

  it('legt neue UI-Texte im bestehenden i18n-Namespace ab', () => {
    const json = JSON.parse(MESSAGES) as { topic?: { content?: unknown } };
    assert.ok(json.topic?.content, 'topic.content fehlt');
  });
});
