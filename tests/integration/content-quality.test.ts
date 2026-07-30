import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const MIGRATION = read('supabase/migrations/20260730215542_content_quality_review.sql');
const QUALITY = read('packages/core/content/quality.ts');
const VERSIONING = read('packages/core/content/versioning.ts');
const ACTIONS = read('app/[locale]/admin/content/qualitaetspruefung/actions.ts');
const PAGE = read('app/[locale]/admin/content/qualitaetspruefung/page.tsx');
const CLIENT = read('app/[locale]/admin/content/qualitaetspruefung/qualitaets-uebersicht-client.tsx');
const DETAIL = read('app/[locale]/admin/content/inhalte/[id]/content-detail-client.tsx');

/**
 * Liest eine Projektdatei als UTF-8.
 */
function read(path: string): string {
  return readFileSync(join(ROOT, path), 'utf8');
}

describe('Content-Qualitaetspruefung', () => {
  it('legt additive Tabellen mit RLS und Data-API-Grants an', () => {
    assert.match(MIGRATION, /create table if not exists content_qualitaetspruefungen/);
    assert.match(MIGRATION, /create table if not exists content_versionen/);
    assert.match(MIGRATION, /alter table content_qualitaetspruefungen enable row level security/);
    assert.match(MIGRATION, /alter table content_versionen enable row level security/);
    assert.match(MIGRATION, /grant select, insert, update, delete on content_qualitaetspruefungen to authenticated/);
    assert.match(MIGRATION, /grant select, insert, update, delete on content_versionen to authenticated/);
    assert.match(MIGRATION, /kein fachlicher Freigabeentscheid|kein fachlicher Freigabe/i);
  });

  it('trennt Qualitaetspruefung von Content-Generierung', () => {
    assert.match(QUALITY, /pruefeContentQualitaet/);
    assert.match(QUALITY, /QUALITAETS_KRITERIEN/);
    assert.match(VERSIONING, /regeneriereContentVariante/);
    assert.doesNotMatch(QUALITY, /AIContentProvider|generiereContent|chat\/completions/);
    assert.doesNotMatch(ACTIONS, /LLM_API_KEY|Authorization:|chat\/completions/);
  });

  it('bildet Scorelogik, Duplikate und problematische Aussagen ab', () => {
    for (const muster of [
      /fachliche_plausibilitaet/,
      /eindeutige_fragestellung/,
      /offizielle_pruefungsfrage/,
      /normwerte/,
      /findeDuplikate/,
      /einfacherHash/,
      /textAehnlichkeit/,
      /qualitaetsBewertung/,
    ]) {
      assert.match(QUALITY, muster);
    }
  });

  it('integriert Uebersicht, Detail, Regenerierung und Historie in die Admin-UI', () => {
    assert.match(PAGE, /QualitaetsUebersichtClient/);
    assert.match(CLIENT, /qualitaetsPruefungStartenAction/);
    assert.match(DETAIL, /contentMitHistorieRegenerierenAction/);
    assert.match(DETAIL, /Versionshistorie/);
    assert.match(DETAIL, /Verbesserungsvorschlaege/);
    assert.match(ACTIONS, /content_versionen/);
    assert.match(ACTIONS, /content_qualitaetspruefungen/);
  });
});
