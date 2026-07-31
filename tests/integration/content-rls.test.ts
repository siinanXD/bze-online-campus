import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const MIGRATION = readFileSync(
  join(process.cwd(), 'supabase', 'migrations', '20260730200551_content_grundmodell.sql'),
  'utf8',
);

const NEUE_TABELLEN = [
  'lernziele',
  'content_elemente',
  'content_element_lernziele',
  'lernkarten',
  'content_quellen',
  'content_element_quellen',
  'content_quizze',
  'content_quiz_fragen',
];

describe('Content-RLS-Migration', () => {
  it('aktiviert RLS fuer alle neuen Tabellen', () => {
    for (const tabelle of NEUE_TABELLEN) {
      assert.match(
        MIGRATION,
        new RegExp(`alter table ${tabelle} enable row level security;`),
        `${tabelle} ohne RLS`,
      );
    }
  });

  it('legt Lese- und Schreibpolicies fuer die neuen Tabellen an', () => {
    const policies = [
      'lernziele_read',
      'lernziele_manage',
      'content_elemente_read',
      'content_elemente_manage',
      'lernkarten_read',
      'lernkarten_manage',
      'content_quellen_read',
      'content_quellen_manage',
      'content_quizze_read',
      'content_quizze_manage',
    ];
    for (const policy of policies) {
      assert.match(MIGRATION, new RegExp(`create policy ${policy}`), `${policy} fehlt`);
    }
  });

  it('steuert Demo-Sichtbarkeit ueber Tenant-Flag statt Client-Logik', () => {
    assert.match(MIGRATION, /create or replace function app_demo_content_aktiv/);
    assert.match(MIGRATION, /flag_demo_content/);
    assert.match(MIGRATION, /ist_demo and demo_sichtbar and app_demo_content_aktiv/);
  });

  it('erweitert bestehende Fragen- und Lerneinheiten-RLS statt Parallelzugriffe zu bauen', () => {
    assert.match(MIGRATION, /drop policy if exists le_read on lerneinheiten;/);
    assert.match(MIGRATION, /drop policy if exists fragen_read on fragen;/);
    assert.match(MIGRATION, /drop policy if exists ao_read on antwortoptionen;/);
    assert.match(MIGRATION, /alter table fragen\s+add column if not exists beschreibung text,/);
    assert.match(MIGRATION, /alter table lerneinheiten\s+add column if not exists beschreibung text,/);
  });
});
