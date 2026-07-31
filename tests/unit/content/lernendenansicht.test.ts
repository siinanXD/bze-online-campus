import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import {
  ermittleNaechstenLernschritt,
  extrahiereRechenaufgabe,
  gruppiereContentElemente,
  istUngepruefterDemoInhalt,
  sortiereContentElemente,
  type ContentElementView,
} from '../../../app/[locale]/campus/topic/_lib/content-view-model';

const BASIS: Omit<ContentElementView, 'id' | 'titel' | 'content_typ' | 'inhalt'> = {
  lerneinheit_id: null,
  frage_id: null,
  ist_demo: true,
  demo_label: 'KI-generierter Beispielinhalt - nicht fachlich verifiziert',
  fachlich_verifiziert: false,
};

/**
 * Baut ein minimales Content-Element fuer View-Model-Tests.
 */
function element(id: string, typ: ContentElementView['content_typ'], titel: string, inhalt: unknown = {}): ContentElementView {
  return { ...BASIS, id, content_typ: typ, titel, inhalt };
}

describe('Lernendenansicht View-Model', () => {
  it('sortiert Content in der erwarteten Lernreihenfolge', () => {
    const sortiert = sortiereContentElemente([
      element('1', 'zusammenfassung', 'Zusammenfassung'),
      element('2', 'single_choice', 'Frage'),
      element('3', 'erklaerung', 'Erklaerung'),
      element('4', 'lernkarte', 'Karte'),
    ]);
    assert.deepEqual(sortiert.map((eintrag) => eintrag.content_typ), [
      'erklaerung',
      'lernkarte',
      'single_choice',
      'zusammenfassung',
    ]);
  });

  it('gruppiert Fragen in Uebungen und trennt Praxis sowie Rechenaufgaben', () => {
    const gruppen = gruppiereContentElemente([
      element('1', 'single_choice', 'SC'),
      element('2', 'multiple_choice', 'MC'),
      element('3', 'praxisfall', 'Praxis'),
      element('4', 'rechenaufgabe', 'Rechnen'),
    ]);
    assert.equal(gruppen.uebungen.length, 2);
    assert.equal(gruppen.praxisfaelle.length, 1);
    assert.equal(gruppen.rechenaufgaben.length, 1);
  });

  it('erkennt ungeprueften Demo-Content fuer den Warnhinweis', () => {
    assert.equal(istUngepruefterDemoInhalt({ ist_demo: true, fachlich_verifiziert: false }), true);
    assert.equal(istUngepruefterDemoInhalt({ ist_demo: true, fachlich_verifiziert: true }), false);
    assert.equal(istUngepruefterDemoInhalt({ ist_demo: false, fachlich_verifiziert: false }), false);
  });

  it('normalisiert Rechenaufgaben aus strukturierter und alter Seed-Form', () => {
    const strukturiert = extrahiereRechenaufgabe({
      aufgabe: 'Berechne die Flaeche.',
      gegebene_werte: ['l = 10 mm', 'b = 5 mm'],
      gesuchte_groesse: 'Flaeche',
      formel: 'A = l x b',
      loesungsweg: 'A = 10 mm x 5 mm',
      ergebnis: '50 mm2',
      erklaerung: 'Beispielwerte.',
    });
    assert.deepEqual(strukturiert.gegebeneWerte, ['l = 10 mm', 'b = 5 mm']);
    assert.equal(strukturiert.ergebnis, '50 mm2');

    const alt = extrahiereRechenaufgabe({
      aufgabe: 'Ein Beispielkoerper hat 780 g Masse und 100 cm3 Volumen.',
      loesung: 'rho = m / V = 780 g / 100 cm3 = 7,8 g/cm3.',
      hinweis: 'Beispielwerte.',
    });
    assert.equal(alt.ergebnis, '7,8 g/cm3.');
    assert.match(alt.loesungsweg, /rho = m/);
  });

  it('verweist erst auf das naechste Unterthema und danach auf den bestehenden Uebungsmodus', () => {
    const naechstes = ermittleNaechstenLernschritt('de', 'u1', [
      { id: 'u1', bezeichnung: 'Stahl', reihenfolge: 1 },
      { id: 'u2', bezeichnung: 'Edelstahl', reihenfolge: 2 },
    ]);
    assert.equal(naechstes.href, '/de/campus/topic/u2/modul');

    const quiz = ermittleNaechstenLernschritt('de', 'u2', [
      { id: 'u1', bezeichnung: 'Stahl', reihenfolge: 1 },
      { id: 'u2', bezeichnung: 'Edelstahl', reihenfolge: 2 },
    ]);
    assert.equal(quiz.href, '/de/campus/lernen/thema/u2');
  });
});
