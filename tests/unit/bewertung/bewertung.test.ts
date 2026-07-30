/**
 * Bewertung — Notenstufen und Prüfungsuhr.
 *
 * Die Notengrenzen kommen aus dem IHK-100-Punkte-Schlüssel (Spec §4.4). Ein
 * Fehler an einer Stufengrenze verschiebt eine echte Prüfungsnote, deshalb wird
 * hier jede Grenze einzeln geprüft.
 */

import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { formatMMSS, noteBezeichnung, restSekunden } from '@bze/core/bewertung';
import type { NotenStufe } from '@bze/core/bewertung';
import { utc } from '../../helpers/zeit';

/** Der IHK-100-Punkte-Schlüssel aus dem Seed. */
const IHK100: NotenStufe[] = [
  { von: 92, bis: 100, note: 1, bezeichnung: 'sehr gut' },
  { von: 81, bis: 91, note: 2, bezeichnung: 'gut' },
  { von: 67, bis: 80, note: 3, bezeichnung: 'befriedigend' },
  { von: 50, bis: 66, note: 4, bezeichnung: 'ausreichend' },
  { von: 30, bis: 49, note: 5, bezeichnung: 'mangelhaft' },
  { von: 0, bis: 29, note: 6, bezeichnung: 'ungenügend' },
];

describe('noteBezeichnung — Stufengrenzen', () => {
  it('trifft jede untere Grenze', () => {
    assert.equal(noteBezeichnung(IHK100, 92)?.note, 1);
    assert.equal(noteBezeichnung(IHK100, 81)?.note, 2);
    assert.equal(noteBezeichnung(IHK100, 67)?.note, 3);
    assert.equal(noteBezeichnung(IHK100, 50)?.note, 4);
    assert.equal(noteBezeichnung(IHK100, 30)?.note, 5);
    assert.equal(noteBezeichnung(IHK100, 0)?.note, 6);
  });

  it('trifft jede obere Grenze', () => {
    assert.equal(noteBezeichnung(IHK100, 100)?.note, 1);
    assert.equal(noteBezeichnung(IHK100, 91)?.note, 2);
    assert.equal(noteBezeichnung(IHK100, 80)?.note, 3);
    assert.equal(noteBezeichnung(IHK100, 66)?.note, 4);
    assert.equal(noteBezeichnung(IHK100, 49)?.note, 5);
    assert.equal(noteBezeichnung(IHK100, 29)?.note, 6);
  });

  it('setzt die Bestehensgrenze bei 50 Punkten', () => {
    // 49 ist mangelhaft und damit nicht bestanden, 50 ist ausreichend.
    assert.equal(noteBezeichnung(IHK100, 49)?.note, 5);
    assert.equal(noteBezeichnung(IHK100, 50)?.note, 4);
  });

  it('deckt den ganzen Bereich 0 bis 100 lückenlos ab', () => {
    for (let punkte = 0; punkte <= 100; punkte += 1) {
      assert.ok(noteBezeichnung(IHK100, punkte), `keine Note für ${punkte} Punkte`);
    }
  });

  it('liefert null außerhalb des Bereichs', () => {
    assert.equal(noteBezeichnung(IHK100, 101), null);
    assert.equal(noteBezeichnung(IHK100, -1), null);
  });

  it('liefert null bei leerem Schlüssel', () => {
    assert.equal(noteBezeichnung([], 75), null);
  });

  it('nimmt die erste passende Stufe bei überlappenden Bereichen', () => {
    // Ein fehlerhaft gepflegter Schlüssel darf nicht abstürzen.
    const ueberlappend: NotenStufe[] = [
      { von: 50, bis: 100, note: 2, bezeichnung: 'gut' },
      { von: 0, bis: 100, note: 6, bezeichnung: 'ungenügend' },
    ];
    assert.equal(noteBezeichnung(ueberlappend, 75)?.note, 2);
  });
});

describe('restSekunden', () => {
  const START = '2026-01-14T10:00:00Z';

  it('rechnet die verbleibende Zeit', () => {
    // 90 Minuten Prüfung, 30 Minuten vergangen.
    assert.equal(restSekunden(START, 90, utc('2026-01-14T10:30:00')), 60 * 60);
  });

  it('gibt am Start die volle Dauer zurück', () => {
    assert.equal(restSekunden(START, 90, utc('2026-01-14T10:00:00')), 90 * 60);
  });

  it('ist bei Ablauf genau 0', () => {
    assert.equal(restSekunden(START, 90, utc('2026-01-14T11:30:00')), 0);
  });

  it('wird nach Ablauf nicht negativ', () => {
    // Sonst würde die Uhr rückwärts weiterlaufen, wenn ein Tab lange offen bleibt.
    assert.equal(restSekunden(START, 90, utc('2026-01-14T18:00:00')), 0);
  });

  it('verträgt eine Dauer von 0', () => {
    assert.equal(restSekunden(START, 0, utc('2026-01-14T10:00:00')), 0);
  });

  it('rundet auf ganze Sekunden', () => {
    assert.equal(restSekunden(START, 1, utc('2026-01-14T10:00:00.400')), 60);
  });

  it('bleibt über einen Sommerzeitwechsel richtig', () => {
    // Prüfung beginnt 01:30 UTC am Umstellungstag; die Uhr zählt echte Sekunden,
    // nicht Wandzeit, und darf deshalb nicht um eine Stunde springen.
    assert.equal(
      restSekunden('2026-03-29T01:00:00Z', 120, utc('2026-03-29T02:00:00')),
      60 * 60,
    );
  });
});

describe('formatMMSS', () => {
  it('formatiert den Normalfall', () => {
    assert.equal(formatMMSS(90), '1:30');
    assert.equal(formatMMSS(0), '0:00');
  });

  it('füllt die Sekunden zweistellig auf', () => {
    assert.equal(formatMMSS(65), '1:05');
    assert.equal(formatMMSS(9), '0:09');
  });

  it('lässt die Minuten über 59 hinauslaufen', () => {
    // Eine 90-Minuten-Prüfung soll „90:00" zeigen, nicht „1:30:00".
    assert.equal(formatMMSS(90 * 60), '90:00');
    assert.equal(formatMMSS(3661), '61:01');
  });
});
