import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const MIGRATION = read('supabase/migrations/20260730221042_wissensdatenbank_grundlage.sql');
const ACTIONS = read('app/[locale]/admin/content/wissensdatenbank/actions.ts');
const PAGE = read('app/[locale]/admin/content/wissensdatenbank/page.tsx');
const DETAIL = read('app/[locale]/admin/content/wissensdatenbank/[id]/page.tsx');
const CLIENT = read('app/[locale]/admin/content/wissensdatenbank/wissensdatenbank-client.tsx');
const KNOWLEDGE = read('packages/core/content/knowledge.ts');
const GENERATOR_CONFIG = read('app/[locale]/admin/content/ki-generator/_lib/config.ts');
const GENERATOR_ACTIONS = read('app/[locale]/admin/content/ki-generator/actions.ts');

/**
 * Liest eine Projektdatei als UTF-8.
 */
function read(path: string): string {
  return readFileSync(join(ROOT, path), 'utf8');
}

describe('Optionale Wissensdatenbank', () => {
  it('legt Wissensquelle, Dokument-Erweiterung, Chunks, Fehler und Storage additiv an', () => {
    assert.match(MIGRATION, /create table if not exists wissensquellen/);
    assert.match(MIGRATION, /alter table quelldokumente[\s\S]*add column if not exists dokument_status/);
    assert.match(MIGRATION, /create table if not exists wissens_chunks/);
    assert.match(MIGRATION, /embedding vector\(1536\)/);
    assert.match(MIGRATION, /create table if not exists wissens_verarbeitungsfehler/);
    assert.match(MIGRATION, /insert into storage\.buckets/);
    assert.match(MIGRATION, /'wissensdatenbank'/);
  });

  it('aktiviert RLS, Storage-Policies und Data-API-Grants', () => {
    for (const table of ['wissensquellen', 'wissens_chunks', 'wissens_verarbeitungsfehler']) {
      assert.match(MIGRATION, new RegExp(`alter table ${table} enable row level security`));
      assert.match(MIGRATION, new RegExp(`grant select, insert, update, delete on ${table} to authenticated`));
    }
    assert.match(MIGRATION, /drop policy if exists quelldokumente_read/);
    assert.match(MIGRATION, /app_rolle\(\) = 'verwaltung'/);
    assert.match(MIGRATION, /storage_wissensdatenbank_insert/);
    assert.match(MIGRATION, /\(storage\.foldername\(name\)\)\[1\] = app_traeger\(\)::text/);
  });

  it('unterstuetzt Textquelle, Upload, Chunking, Status, Fehler, Deaktivieren und Loeschen', () => {
    assert.match(ACTIONS, /wissensTextHinzufuegenAction/);
    assert.match(ACTIONS, /wissensDateiHochladenAction/);
    assert.match(ACTIONS, /validiereWissensdatei/);
    assert.match(ACTIONS, /erstelleWissensChunks/);
    assert.match(ACTIONS, /dokument_status: 'indexiert'/);
    assert.match(ACTIONS, /index_status: 'mock_indexiert'/);
    assert.match(ACTIONS, /wissens_verarbeitungsfehler/);
    assert.match(ACTIONS, /wissensdokumentDeaktivierenAction/);
    assert.match(ACTIONS, /wissensdokumentLoeschenAction/);
  });

  it('haelt Wissensdatenbank optional und laesst den Generated-Pfad ohne Retrieval', () => {
    assert.match(GENERATOR_CONFIG, /ragEnabled: process\.env\.RAG_ENABLED === 'true'/);
    assert.match(GENERATOR_CONFIG, /const rawSourceMode = process\.env\.CONTENT_SOURCE_MODE \?\? 'generated'/);
    assert.match(GENERATOR_CONFIG, /contentSourceMode !== 'generated' && !config\.ragEnabled/);
    assert.match(GENERATOR_ACTIONS, /ladeRagKontext/);
    assert.doesNotMatch(KNOWLEDGE, /LLM_API_KEY|chat\/completions|AIContentProvider/);
  });

  it('integriert Dokumentliste, Detailansicht, Fehleransicht und Chunk-Anzahl in die Admin-UI', () => {
    assert.match(PAGE, /WissensdatenbankClient/);
    assert.match(CLIENT, /wissensTextHinzufuegenAction/);
    assert.match(CLIENT, /wissensDateiHochladenAction/);
    assert.match(CLIENT, /chunk_anzahl/);
    assert.match(CLIENT, /index_status/);
    assert.match(DETAIL, /fehlerTitel/);
    assert.match(DETAIL, /chunksTitel/);
    assert.match(DETAIL, /WissensdokumentDetailAktionen/);
  });
});
