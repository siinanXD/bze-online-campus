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

const MAF_AP_SEED = JSON.parse(
  readFileSync(join(process.cwd(), 'supabase', 'seed', 'MAF_Fragenpool_Charge3_AP.json'), 'utf8'),
) as {
  meta: { beruf_slug: string; anzahl_mc: number; anzahl_freitext: number };
  uebungspruefungen: Array<{ code: string; aufgaben: string[] }>;
  fragen: Array<{ id: string; typ: 'mc' | 'freitext'; status: string }>;
};

const GENERATED_SQL = readFileSync(
  join(process.cwd(), 'supabase', 'seed', '0001_maf_seed.sql'),
  'utf8',
);

const WISSENS_SEED_SQL = readFileSync(
  join(process.cwd(), 'supabase', 'seed', '0002_maf_wissensdatenbank_seed.sql'),
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

  it('seedet MAF-Abschlusspruefungsfragen und feste Uebungspruefungen', () => {
    assert.equal(MAF_AP_SEED.meta.beruf_slug, 'maf-metall');
    assert.equal(MAF_AP_SEED.fragen.filter((frage) => frage.typ === 'mc').length, 20);
    assert.equal(MAF_AP_SEED.fragen.filter((frage) => frage.typ === 'freitext').length, 5);
    assert.equal(MAF_AP_SEED.uebungspruefungen[0]?.code, 'AP-UE-01');
    assert.equal(MAF_AP_SEED.uebungspruefungen[0]?.aufgaben.length, 25);
    assert.match(GENERATED_SQL, /MAF_Fragenpool_Charge3_AP\.json/);
    assert.match(GENERATED_SQL, /Uebungs-Abschlusspruefung 01 - Metall- und Kunststofftechnik/);
    assert.match(GENERATED_SQL, /insert into pruefung_fragen/);
  });

  it('seedet belegte RAG-Grundlagen ohne Tabellenbuch- oder Originalaufgaben', () => {
    assert.match(WISSENS_SEED_SQL, /MAF 4171 - offizielle Grundlagen und Pruefungsstruktur/);
    assert.match(WISSENS_SEED_SQL, /BIBB\/Ausbildungsverordnung Maschinen- und Anlagenfuehrer\/-in/);
    assert.match(WISSENS_SEED_SQL, /IHK Aachen und PAL IHK Region Stuttgart/);
    assert.match(WISSENS_SEED_SQL, /on conflict \(quelldokument_id, chunk_index\)/);
    assert.doesNotMatch(WISSENS_SEED_SQL, /Originalaufgabe|Loesungsangaben|Tabellenbuchseite/);
  });
});
