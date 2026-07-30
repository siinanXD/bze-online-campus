import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import {
  contentBearbeitenSchema,
  contentFilterSchema,
  contentKonstanten,
  contentStatusAendernSchema,
} from '../../../app/[locale]/admin/content/_lib/schemas';

const ID = '11111111-1111-4111-8111-111111111111';

describe('Admin-Content-Schemas', () => {
  it('stellt die Content-Konstanten fuer Filter und Formulare bereit', () => {
    assert.ok(contentKonstanten.typen.includes('erklaerung'));
    assert.ok(contentKonstanten.typen.includes('lernkarte'));
    assert.ok(contentKonstanten.typen.includes('rechenaufgabe'));
    assert.ok(contentKonstanten.status.includes('archiviert'));
    assert.deepEqual([...contentKonstanten.schwierigkeitsgrade], ['einfach', 'mittel', 'schwer']);
  });

  it('normalisiert Listenfilter fuer Suche, Sortierung und Pagination', () => {
    const filter = contentFilterSchema.parse({
      q: '  Stahl  ',
      typ: 'erklaerung',
      status: 'generiert',
      schwierigkeit: 'mittel',
      quelle: 'demo',
      demo: 'ja',
      qualitaet: 'niedrig',
      sort: 'titel',
      richtung: 'asc',
      seite: '3',
    });

    assert.equal(filter.q, 'Stahl');
    assert.equal(filter.sort, 'titel');
    assert.equal(filter.richtung, 'asc');
    assert.equal(filter.seite, 3);
  });

  it('faellt bei ungueltigen Filtern auf sichere Defaults zurueck', () => {
    const filter = contentFilterSchema.parse({
      typ: 'video',
      status: 'fertig',
      sort: 'drop table',
      richtung: 'seitwaerts',
      seite: '-4',
    });

    assert.equal(filter.typ, undefined);
    assert.equal(filter.status, undefined);
    assert.equal(filter.sort, 'updated_at');
    assert.equal(filter.richtung, 'desc');
    assert.equal(filter.seite, 1);
  });

  it('validiert Content-Bearbeitung inklusive Demo- und Qualitaetsmetadaten', () => {
    const daten = contentBearbeitenSchema.parse({
      id: ID,
      titel: 'Thermoplaste erkennen',
      beschreibung: 'Praxisnaher Demo-Inhalt.',
      schwierigkeitsgrad: 'einfach',
      status: 'generiert',
      ist_demo: true,
      demo_sichtbar: true,
      demo_label: 'KI-generierter Beispielinhalt',
      fachlich_verifiziert: false,
      quellenart: 'demo',
      ki_anbieter: 'mock',
      ki_modell: 'mock-content-v1',
      qualitaetswert: '0.72',
      inhalt: '{"kurz":"Thermoplaste werden bei Waerme weich."}',
    });

    assert.equal(daten.qualitaetswert, 0.72);
    assert.equal(daten.ist_demo, true);
  });

  it('lehnt kaputte Content-Bearbeitung und Bulk-Status ohne IDs ab', () => {
    assert.equal(
      contentBearbeitenSchema.safeParse({
        id: ID,
        titel: '',
        schwierigkeitsgrad: 'leicht',
        status: 'freigeschaltet',
        ist_demo: true,
        demo_sichtbar: true,
        fachlich_verifiziert: false,
        quellenart: 'demo',
        qualitaetswert: 1.2,
        inhalt: '{}',
      }).success,
      false,
    );
    assert.equal(contentStatusAendernSchema.safeParse({ ids: [], status: 'archiviert' }).success, false);
  });
});
