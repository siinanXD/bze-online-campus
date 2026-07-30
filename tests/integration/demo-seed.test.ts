import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type DemoThema = {
  code: string;
  bezeichnung: string;
  unterthemen: string[];
};

type DemoSeed = {
  meta: {
    beruf_slug: string;
    fachbereich_code: string;
    demo_label: string;
    ki_anbieter: string;
    ki_modell: string;
  };
  themen: DemoThema[];
};

const DEMO_SEED = JSON.parse(
  readFileSync(join(process.cwd(), 'supabase', 'seed', 'MAF_DemoContent.json'), 'utf8'),
) as DemoSeed;

const GENERATED_SQL = readFileSync(
  join(process.cwd(), 'supabase', 'seed', '0001_maf_seed.sql'),
  'utf8',
);

const CONFIG = readFileSync(join(process.cwd(), 'supabase', 'config.toml'), 'utf8');
const GRANTS = readFileSync(
  join(process.cwd(), 'supabase', 'migrations', '20260730203549_content_grants.sql'),
  'utf8',
);

const ERWARTETE_THEMEN = [
  'Werkstoffkunde',
  'Fertigungstechnik',
  'Technische Mathematik',
  'Technisches Zeichnen',
  'Maschinen und Anlagen',
  'Arbeitssicherheit',
];

describe('MAF-Demo-Seed', () => {
  it('enthaelt die geforderte Themenstruktur', () => {
    assert.equal(DEMO_SEED.meta.beruf_slug, 'maf-metall');
    assert.equal(DEMO_SEED.meta.fachbereich_code, 'KI-DEMO-MAF');
    assert.deepEqual(
      DEMO_SEED.themen.map((thema) => thema.bezeichnung),
      ERWARTETE_THEMEN,
    );
    assert.equal(
      DEMO_SEED.themen.reduce((summe, thema) => summe + thema.unterthemen.length, 0),
      74,
    );
  });

  it('kennzeichnet Demo-Content fachlich eindeutig', () => {
    assert.equal(DEMO_SEED.meta.demo_label, 'KI-generierter Beispielinhalt - nicht fachlich verifiziert');
    assert.equal(DEMO_SEED.meta.ki_anbieter, 'mock');
    assert.equal(DEMO_SEED.meta.ki_modell, 'seed-demo-content-v1');
    assert.match(GENERATED_SQL, /'generiert',true,true,'KI-generierter Beispielinhalt - nicht fachlich verifiziert'/);
    assert.match(GENERATED_SQL, /false,'demo','mock','seed-demo-content-v1'/);
    assert.doesNotMatch(GENERATED_SQL, /angeblich original/i);
  });

  it('erzeugt den Seed ueber den Generator und aktiviert den Seed-Pfad fuer db reset', () => {
    assert.match(GENERATED_SQL, /AUTOGENERIERT von scripts\/generate_seed.py/);
    assert.match(GENERATED_SQL, /MAF_DemoContent\.json/);
    assert.match(CONFIG, /\[db\.seed\]/);
    assert.match(CONFIG, /sql_paths = \["\.\/seed\/\*\.sql"\]/);
  });

  it('enthaelt Data-API-Grants fuer RLS-geschuetzte Content-Tabellen', () => {
    for (const tabelle of [
      'lernziele',
      'content_elemente',
      'lernkarten',
      'content_quellen',
      'content_quizze',
      'fragen',
      'antwortoptionen',
      'lerneinheiten',
    ]) {
      assert.match(GRANTS, new RegExp(tabelle), `${tabelle} fehlt in Grant-Migration`);
    }
    assert.match(GRANTS, /to authenticated;/);
  });
});
