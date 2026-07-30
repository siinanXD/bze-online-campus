import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const MIGRATION = read('supabase/migrations/20260730222320_optional_rag_content_generation.sql');
const CONFIG = read('app/[locale]/admin/content/ki-generator/_lib/config.ts');
const RETRIEVAL = read('app/[locale]/admin/content/ki-generator/_lib/retrieval.ts');
const ACTIONS = read('app/[locale]/admin/content/ki-generator/actions.ts');
const PROVIDER = read('app/[locale]/admin/content/ki-generator/_lib/provider.ts');
const SCHEMAS = read('app/[locale]/admin/content/ki-generator/_lib/schemas.ts');
const DETAIL_QUERY = read('app/[locale]/admin/content/_lib/queries.ts');
const DETAIL_UI = read('app/[locale]/admin/content/inhalte/[id]/content-detail-client.tsx');
const ENV = read('.env.example');
const README = read('README.md');

/**
 * Liest eine Projektdatei als UTF-8.
 */
function read(path: string): string {
  return readFileSync(join(ROOT, path), 'utf8');
}

describe('Optionales RAG fuer Content-Generierung', () => {
  it('ergaenzt pgvector- und Text-Retrieval RLS-bewusst', () => {
    assert.match(MIGRATION, /create or replace function match_wissens_chunks/);
    assert.match(MIGRATION, /security invoker/);
    assert.match(MIGRATION, /c\.embedding <=> query_embedding/);
    assert.match(MIGRATION, /match_threshold/);
    assert.match(MIGRATION, /limit least\(greatest\(match_count, 1\), 12\)/);
    assert.match(MIGRATION, /create or replace function search_wissens_chunks_text/);
    assert.match(MIGRATION, /grant execute on function match_wissens_chunks/);
    assert.match(MIGRATION, /grant execute on function search_wissens_chunks_text/);
  });

  it('unterstuetzt RAG deaktiviert, Generated, Knowledge-Base und Hybrid per Konfiguration', () => {
    assert.match(CONFIG, /CONTENT_SOURCE_MODES/);
    assert.match(CONFIG, /RAG_ENABLED/);
    assert.match(CONFIG, /RAG_TOP_K/);
    assert.match(CONFIG, /RAG_MIN_SIMILARITY/);
    assert.match(CONFIG, /RAG_MOCK_RETRIEVAL/);
    assert.match(CONFIG, /knowledge_base/);
    assert.match(CONFIG, /hybrid/);
    assert.match(ENV, /CONTENT_SOURCE_MODE=generated/);
    assert.match(ENV, /RAG_ENABLED=false/);
    assert.match(README, /CONTENT_SOURCE_MODE=knowledge_base/);
    assert.match(README, /CONTENT_SOURCE_MODE=hybrid/);
  });

  it('haelt den Generated-Modus ohne Retrieval und ruft RAG nur optional auf', () => {
    assert.match(RETRIEVAL, /ragSollRetrievalNutzen/);
    assert.match(RETRIEVAL, /sourceMode: 'generated'/);
    assert.match(ACTIONS, /ladeRagKontext/);
    assert.match(ACTIONS, /provider\.generiereContent\(request, ragContext\)/);
    assert.match(ACTIONS, /rag_kontext_unzureichend/);
  });

  it('validiert strukturierte Ausgabe weiter mit Zod und gibt RAG-Regeln an den Provider', () => {
    assert.match(SCHEMAS, /ragKontextSchema/);
    assert.match(SCHEMAS, /contentSourceModeSchema/);
    assert.match(PROVIDER, /baueRagPromptDaten/);
    assert.match(PROVIDER, /Knowledge-Base-Modus darfst du keine unbelegten Fachbehauptungen/);
    assert.match(PROVIDER, /Erfinde keine Quellen/);
    assert.match(PROVIDER, /generatorPreviewSchema\.parse/);
  });

  it('speichert Quellenreferenzen, Chunk-IDs und RAG-Metadaten am Content', () => {
    assert.match(MIGRATION, /rag_chunk_ids uuid\[\]/);
    assert.match(MIGRATION, /rag_context_metadaten jsonb/);
    assert.match(ACTIONS, /rag_chunk_ids: preview\.ragContext\?\.verwendeteChunkIds/);
    assert.match(ACTIONS, /verknuepfeRagQuellen/);
    assert.match(ACTIONS, /content_element_quellen/);
    assert.match(ACTIONS, /art: 'wissensdatenbank'/);
  });

  it('zeigt Quellenmodus, Dokumente, verwendete Chunks, KI und Qualitaetsstatus im Detail', () => {
    assert.match(DETAIL_QUERY, /ladeContentQuellen/);
    assert.match(DETAIL_QUERY, /wissens_chunks/);
    assert.match(DETAIL_UI, /Quellenmodus/);
    assert.match(DETAIL_UI, /Verwendete Chunk-IDs/);
    assert.match(DETAIL_UI, /KI-Anbieter/);
    assert.match(DETAIL_UI, /Qualitaetsstatus/);
    assert.match(DETAIL_UI, /Keine gespeicherten Quellenreferenzen/);
  });
});
