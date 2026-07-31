import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import {
  CONTENT_STATUS,
  CONTENT_TYPEN,
  SCHWIERIGKEITSGRADE,
  contentMetadatenSchema,
  demoHinweise,
  erlaubteNaechsteStatus,
  istContentSichtbar,
  lernkarteSchema,
  statuswechselErlaubt,
} from '@bze/core/content';

const ID = '11111111-1111-4111-8111-111111111111';
const ZEIT = '2026-07-30T12:00:00.000Z';

describe('Content-Typen', () => {
  it('deckt alle geforderten Content-Typen ab', () => {
    assert.deepEqual([...CONTENT_TYPEN], [
      'erklaerung',
      'lernkarte',
      'single_choice',
      'multiple_choice',
      'freitext',
      'rechenaufgabe',
      'praxisfall',
      'pruefungsnahe_uebungsfrage',
      'zusammenfassung',
    ]);
  });
});

describe('Content-Statuslogik', () => {
  it('deckt den geforderten Workflow ab', () => {
    assert.deepEqual([...CONTENT_STATUS], [
      'entwurf',
      'generiert',
      'in_pruefung',
      'freigegeben',
      'abgelehnt',
      'archiviert',
    ]);
  });

  it('erlaubt fachlich sinnvolle Statuswechsel', () => {
    assert.equal(statuswechselErlaubt('entwurf', 'generiert'), true);
    assert.equal(statuswechselErlaubt('generiert', 'in_pruefung'), true);
    assert.equal(statuswechselErlaubt('in_pruefung', 'freigegeben'), true);
    assert.equal(statuswechselErlaubt('in_pruefung', 'abgelehnt'), true);
    assert.equal(statuswechselErlaubt('freigegeben', 'archiviert'), true);
  });

  it('blockiert Rueckspruenge aus archiviert und direkte Freigabe aus Entwurf', () => {
    assert.equal(statuswechselErlaubt('archiviert', 'entwurf'), false);
    assert.equal(statuswechselErlaubt('entwurf', 'freigegeben'), false);
    assert.deepEqual(erlaubteNaechsteStatus('archiviert'), []);
  });
});

describe('Schwierigkeitsgrade', () => {
  it('bildet einfach, mittel und schwer ab', () => {
    assert.deepEqual([...SCHWIERIGKEITSGRADE], ['einfach', 'mittel', 'schwer']);
  });
});

describe('Demo-Sichtbarkeit', () => {
  it('zeigt freigegebenen Content im eigenen Traeger', () => {
    assert.equal(
      istContentSichtbar({
        rolle: 'teilnehmer',
        status: 'freigegeben',
        istDemo: false,
        demoSichtbar: false,
        demoModusAktiv: false,
        gleicherTraeger: true,
      }),
      true,
    );
  });

  it('zeigt Demo-Content nur bei aktivem Demo-Modus serverseitig', () => {
    const basis = {
      rolle: 'teilnehmer' as const,
      status: 'generiert' as const,
      istDemo: true,
      demoSichtbar: true,
      gleicherTraeger: true,
    };
    assert.equal(istContentSichtbar({ ...basis, demoModusAktiv: true }), true);
    assert.equal(istContentSichtbar({ ...basis, demoModusAktiv: false }), false);
  });

  it('zeigt fremden Traeger-Content Teilnehmenden nie', () => {
    assert.equal(
      istContentSichtbar({
        rolle: 'teilnehmer',
        status: 'freigegeben',
        istDemo: true,
        demoSichtbar: true,
        demoModusAktiv: true,
        gleicherTraeger: false,
      }),
      false,
    );
  });

  it('gibt Ausbildern und Verwaltung Zugriff im eigenen Traeger', () => {
    for (const rolle of ['ausbilder', 'verwaltung'] as const) {
      assert.equal(
        istContentSichtbar({
          rolle,
          status: 'entwurf',
          istDemo: false,
          demoSichtbar: false,
          demoModusAktiv: false,
          gleicherTraeger: true,
        }),
        true,
      );
    }
  });

  it('liefert verpflichtende Demo-Hinweise fuer nicht verifizierten Demo-Content', () => {
    assert.deepEqual(demoHinweise({ istDemo: true, fachlichVerifiziert: false }), [
      'KI-generierter Beispielinhalt',
      'nicht fachlich verifiziert',
    ]);
    assert.deepEqual(demoHinweise({ istDemo: true, fachlichVerifiziert: true }), []);
  });
});

describe('Zod-Validierung', () => {
  it('nimmt gueltige Content-Metadaten an', () => {
    const ergebnis = contentMetadatenSchema.parse({
      id: ID,
      titel: 'Werkstoffe erklaeren',
      beschreibung: 'Grundlagen zu Metallen und Kunststoffen.',
      contentTyp: 'erklaerung',
      fachbereichId: ID,
      themaId: ID,
      unterthemaId: null,
      lernzielIds: [ID],
      schwierigkeitsgrad: 'einfach',
      status: 'generiert',
      istDemo: true,
      demoSichtbar: true,
      demoLabel: 'KI-generierter Beispielinhalt',
      fachlichVerifiziert: false,
      quellenart: 'demo',
      kiAnbieter: 'mock',
      kiModell: 'mock-content-v1',
      qualitaetswert: 0.5,
      erstelltAm: ZEIT,
      geaendertAm: ZEIT,
    });
    assert.equal(ergebnis.contentTyp, 'erklaerung');
  });

  it('lehnt unbekannte Typen, Status und Qualitaetswerte ausserhalb 0..1 ab', () => {
    assert.equal(
      contentMetadatenSchema.safeParse({
        id: ID,
        titel: 'x',
        contentTyp: 'video',
        schwierigkeitsgrad: 'mittel',
        status: 'fertig',
        istDemo: false,
        demoSichtbar: false,
        fachlichVerifiziert: false,
        quellenart: 'demo',
        qualitaetswert: 1.5,
        erstelltAm: ZEIT,
        geaendertAm: ZEIT,
      }).success,
      false,
    );
  });

  it('validiert Lernkarten-Inhalte', () => {
    assert.equal(
      lernkarteSchema.safeParse({
        id: ID,
        contentElementId: ID,
        vorderseite: 'Was ist ein Thermoplast?',
        rueckseite: 'Ein Kunststoff, der beim Erwaermen weich wird.',
      }).success,
      true,
    );
    assert.equal(
      lernkarteSchema.safeParse({
        id: ID,
        contentElementId: ID,
        vorderseite: '',
        rueckseite: 'Antwort',
      }).success,
      false,
    );
  });
});
