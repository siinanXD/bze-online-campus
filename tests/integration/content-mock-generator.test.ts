import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const MIGRATION = read('supabase/migrations/20260730212225_content_mock_generator.sql');
const CORE_TYPES = read('packages/core/content/types.ts');
const PAGE = read('app/[locale]/admin/content/ki-generator/page.tsx');
const CLIENT = read('app/[locale]/admin/content/ki-generator/mock-generator-client.tsx');
const ACTIONS = read('app/[locale]/admin/content/ki-generator/actions.ts');
const PROVIDER = read('app/[locale]/admin/content/ki-generator/_lib/provider.ts');
const CONFIG = read('app/[locale]/admin/content/ki-generator/_lib/config.ts');
const ENV_EXAMPLE = read('.env.example');
const README = read('README.md');
const LOKAL = read('docs/LOKAL-EINRICHTEN.md');
const DE = read('messages/de.json');

/**
 * Liest eine Projektdatei als UTF-8.
 */
function read(path: string): string {
  return readFileSync(join(ROOT, path), 'utf8');
}

describe('Content-Mock-Generator Integration', () => {
  it('legt Job-Tabelle, Quellenart, RLS und Data-API-Grants additiv an', () => {
    assert.match(MIGRATION, /alter type content_quellenart_t add value if not exists 'mock_ai'/);
    assert.match(MIGRATION, /create table if not exists content_generation_jobs/);
    assert.match(MIGRATION, /alter table content_generation_jobs enable row level security/);
    assert.match(MIGRATION, /create policy content_generation_jobs_read/);
    assert.match(MIGRATION, /create policy content_generation_jobs_manage/);
    assert.match(MIGRATION, /grant select, insert, update, delete on content_generation_jobs to authenticated/);
    assert.match(CORE_TYPES, /'mock_ai'/);
  });

  it('haelt Generatorlogik ausserhalb von React und nutzt Provider-Abstraktion plus Zod', () => {
    assert.match(PROVIDER, /interface AIContentProvider/);
    assert.match(PROVIDER, /class MockAIContentProvider/);
    assert.match(PROVIDER, /class LLMContentProvider/);
    assert.match(PROVIDER, /response_format: \{ type: 'json_object' \}/);
    assert.match(PROVIDER, /AbortController/);
    assert.match(PROVIDER, /LLM_MAX_RETRIES/);
    assert.match(PROVIDER, /generatorPreviewSchema\.parse/);
    assert.match(ACTIONS, /generatorRequestSchema\.safeParse/);
    assert.doesNotMatch(CLIENT, /new MockAIContentProvider|generiereContent\(request/);
  });

  it('sichert Jobs serverseitig, protokolliert KI-Aufrufe und speichert in bestehende Content-Strukturen', () => {
    for (const muster of [
      /ladeAdminSitzung/,
      /content_generation_jobs/,
      /ki_aufrufe/,
      /provider\.anbieter/,
      /previewMitJob\.usage/,
      /from\('content_elemente'\)/,
      /from\('fragen'\)/,
      /from\('antwortoptionen'\)/,
      /from\('freitext_loesungen'\)/,
      /from\('lernkarten'\)/,
      /content_element_lernziele/,
      /rate_limit_erreicht/,
    ]) {
      assert.match(ACTIONS, muster);
    }
    assert.doesNotMatch(ACTIONS + PROVIDER + CLIENT, /OPENAI_API_KEY|SUPABASE_SERVICE_ROLE|service_role/i);
  });

  it('bildet den vollstaendigen Admin-Preview-Ablauf in der UI ab', () => {
    for (const muster of [
      /ContentNav/,
      /data-testid="mock-generator"/,
      /data-testid="generator-preview"/,
      /lernzieleAutomatischGenerierenAction/,
      /contentPreviewGenerierenAction/,
      /contentPreviewRegenerierenAction/,
      /contentPreviewSpeichernAction/,
      /contentGenerationJobVerwerfenAction/,
      /campus\/topic\/\$\{unterthemaId\}\/modul/,
    ]) {
      assert.match(PAGE + CLIENT, muster);
    }
  });

  it('dokumentiert die drei noetigen Env-Variablen und i18n-Texte', () => {
    assert.match(CONFIG, /AI_MOCK_MODE/);
    assert.match(CONFIG, /CONTENT_SOURCE_MODE/);
    assert.match(CONFIG, /RAG_ENABLED/);
    assert.match(CONFIG, /LLM_API_KEY/);
    assert.match(ENV_EXAMPLE, /AI_MOCK_MODE=true/);
    assert.match(ENV_EXAMPLE, /CONTENT_SOURCE_MODE=generated/);
    assert.match(ENV_EXAMPLE, /RAG_ENABLED=false/);
    assert.match(ENV_EXAMPLE, /LLM_API_KEY=/);
    assert.match(README + LOKAL, /AI_MOCK_MODE=false/);
    assert.match(README + LOKAL, /keinen stillen Wechsel auf einen kostenpflichtigen Provider/);
    const messages = JSON.parse(DE) as { admin: { content: { generator?: unknown; quellen: Record<string, string> } } };
    assert.ok(messages.admin.content.generator);
    assert.equal(messages.admin.content.quellen.mock_ai, 'Mock-KI');
  });
});
