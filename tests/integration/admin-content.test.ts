import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();

const ADMIN_LAYOUT = read('app/[locale]/admin/layout.tsx');
const ADMIN_CONTENT_PAGE = read('app/[locale]/admin/content/page.tsx');
const ADMIN_CONTENT_NAV = read('app/[locale]/admin/content/_components/content-nav.tsx');
const ADMIN_CONTENT_QUERIES = read('app/[locale]/admin/content/_lib/queries.ts');
const ADMIN_CONTENT_ACTIONS = read('app/[locale]/admin/content/actions.ts');
const ADMIN_CONTENT_LISTE = read('app/[locale]/admin/content/inhalte/content-liste.tsx');
const ADMIN_CONTENT_DETAIL = read('app/[locale]/admin/content/inhalte/[id]/content-detail-client.tsx');
const ADMIN_CONTENT_MESSAGES = read('messages/de.json');

/**
 * Liest eine Projektdatei als UTF-8.
 */
function read(path: string): string {
  return readFileSync(join(ROOT, path), 'utf8');
}

describe('Admin-Content-Verwaltung', () => {
  it('haengt Content in die bestehende Admin-Shell und Subnavigation ein', () => {
    assert.match(ADMIN_LAYOUT, /\/admin\/content/);
    for (const ziel of [
      'themen',
      'lernziele',
      'inhalte',
      'quizze',
      'ki-generator',
      'qualitaetspruefung',
      'wissensdatenbank',
    ]) {
      assert.match(ADMIN_CONTENT_NAV, new RegExp(ziel));
    }
  });

  it('laedt Dashboard und Liste serverseitig mit RLS-Sicht und ohne Service-Role', () => {
    assert.match(ADMIN_CONTENT_PAGE, /ladeAdminSitzung/);
    assert.match(ADMIN_CONTENT_QUERIES, /from\('v_content_elemente_sichtbar'\)/);
    assert.match(ADMIN_CONTENT_QUERIES, /\.range\(von, bis\)/);
    assert.doesNotMatch(ADMIN_CONTENT_PAGE + ADMIN_CONTENT_QUERIES + ADMIN_CONTENT_ACTIONS, /service_role|SUPABASE_SERVICE_ROLE/i);
  });

  it('unterstuetzt Suche, Filter, Sortierung, Pagination und Bulk-Aktionen', () => {
    for (const muster of [
      /titel\.ilike/,
      /\.eq\('content_typ'/,
      /\.eq\('status'/,
      /\.eq\('quellenart'/,
      /\.order\(filter\.sort/,
      /CONTENT_PRO_SEITE/,
      /contentStatusAendernAction/,
      /contentBulkArchivierenAction/,
    ]) {
      assert.match(ADMIN_CONTENT_QUERIES + ADMIN_CONTENT_LISTE, muster);
    }
  });

  it('sichert Mutationen serverseitig mit Rollenpruefung, Zod und Audit-Log', () => {
    for (const muster of [
      /'use server'/,
      /ladeAdminSitzung/,
      /contentBearbeitenSchema\.safeParse/,
      /contentStatusAendernSchema\.safeParse/,
      /contentLoeschenSchema\.safeParse/,
      /protokolliere/,
      /from\('content_elemente'\)/,
    ]) {
      assert.match(ADMIN_CONTENT_ACTIONS, muster);
    }
  });

  it('zeigt Demo-, Quellen-, Schwierigkeits-, Lernziel- und Qualitaetsmetadaten an', () => {
    for (const muster of [
      /content\.ist_demo/,
      /content\.quellenart/,
      /content\.schwierigkeitsgrad/,
      /content\.lernziele/,
      /qualitaetText/,
      /fachlich_verifiziert/,
      /KI-generierter Beispielinhalt/,
      /nicht fachlich verifiziert/,
    ]) {
      assert.match(ADMIN_CONTENT_DETAIL + ADMIN_CONTENT_MESSAGES, muster);
    }
  });

  it('ersetzt die bestehende Fragenverwaltung und KI-Generierung nicht', () => {
    assert.match(ADMIN_CONTENT_DETAIL, /fragenHinweis/);
    assert.match(ADMIN_CONTENT_QUERIES, /from\('fragen'\)/);
    assert.doesNotMatch(
      ADMIN_CONTENT_ACTIONS + ADMIN_CONTENT_LISTE,
      /generiereFragen|contentPreviewGenerierenAction|erstelleAIContentProvider|invoke\(|openai|match_wissens_chunks|search_wissens_chunks_text|LLM_API_KEY/i,
    );
  });
});
