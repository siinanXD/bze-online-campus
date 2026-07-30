/**
 * ISO-Kalenderwochen und Wochenlücken des Ausbildungsnachweises.
 *
 * Der Ausbildungsnachweis wird wochenweise geführt; eine falsch berechnete
 * Kalenderwoche ordnet einen Eintrag der falschen Woche zu oder meldet eine
 * Lücke, die keine ist. Die gefährlichen Fälle liegen alle am Jahreswechsel:
 *
 *  - Der 1. Januar kann noch zur letzten Woche des Vorjahres gehören.
 *  - Der 31. Dezember kann schon zur ersten Woche des Folgejahres gehören.
 *  - Manche Jahre haben 53 statt 52 Wochen (2020 und 2026).
 *
 * Alle Daten hier sind gegen einen ISO-8601-Rechner geprüft.
 */

import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { findeWochenLuecken, isoKalenderwoche, wochenBereich } from '@bze/core/nachweis';

/** Baut ein UTC-Datum aus einem Kalendertag. */
function tag(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

describe('isoKalenderwoche — Normalfälle', () => {
  it('bestimmt Wochen mitten im Jahr', () => {
    assert.deepEqual(isoKalenderwoche(tag('2026-07-14')), { jahr: 2026, woche: 29 });
    assert.deepEqual(isoKalenderwoche(tag('2026-01-05')), { jahr: 2026, woche: 2 });
  });

  it('zählt Montag und Sonntag zur selben Woche', () => {
    // KW29/2026 läuft Mo 13.07. bis So 19.07.
    assert.deepEqual(isoKalenderwoche(tag('2026-07-13')), { jahr: 2026, woche: 29 });
    assert.deepEqual(isoKalenderwoche(tag('2026-07-19')), { jahr: 2026, woche: 29 });
    // Der Folgemontag ist KW30.
    assert.deepEqual(isoKalenderwoche(tag('2026-07-20')), { jahr: 2026, woche: 30 });
  });
});

describe('isoKalenderwoche — Jahreswechsel', () => {
  it('rechnet den 1. Januar zur Vorjahreswoche, wenn er vor Donnerstag liegt', () => {
    // 2026-01-01 ist ein Donnerstag → gehört zu KW1/2026.
    assert.deepEqual(isoKalenderwoche(tag('2026-01-01')), { jahr: 2026, woche: 1 });
    // 2027-01-01 ist ein Freitag → gehört noch zu KW53/2026.
    assert.deepEqual(isoKalenderwoche(tag('2027-01-01')), { jahr: 2026, woche: 53 });
    // 2021-01-01 ist ein Freitag → gehört zu KW53/2020.
    assert.deepEqual(isoKalenderwoche(tag('2021-01-01')), { jahr: 2020, woche: 53 });
  });

  it('rechnet den 31. Dezember zur Folgejahreswoche, wenn er ab Montag liegt', () => {
    // 2025-12-29 (Mo) startet die Woche, die den 01.01.2026 (Do) enthält → KW1/2026.
    assert.deepEqual(isoKalenderwoche(tag('2025-12-29')), { jahr: 2026, woche: 1 });
    assert.deepEqual(isoKalenderwoche(tag('2025-12-31')), { jahr: 2026, woche: 1 });
  });

  it('kennt Jahre mit 53 Wochen', () => {
    // 2026 (1. Januar ist Donnerstag) und 2020 (Schaltjahr, 1. Januar Mittwoch).
    assert.deepEqual(isoKalenderwoche(tag('2026-12-31')), { jahr: 2026, woche: 53 });
    assert.deepEqual(isoKalenderwoche(tag('2020-12-31')), { jahr: 2020, woche: 53 });
  });

  it('beginnt normale Jahre wieder bei Woche 1', () => {
    // 2028-01-03 (Mo) → KW1/2028.
    assert.deepEqual(isoKalenderwoche(tag('2028-01-03')), { jahr: 2028, woche: 1 });
  });
});

describe('wochenBereich', () => {
  it('liefert Montag bis Sonntag', () => {
    assert.deepEqual(wochenBereich(2026, 29), { von: '2026-07-13', bis: '2026-07-19' });
  });

  it('umspannt bei KW1 den Jahreswechsel korrekt', () => {
    // KW1/2026 beginnt am 29.12.2025.
    assert.deepEqual(wochenBereich(2026, 1), { von: '2025-12-29', bis: '2026-01-04' });
  });

  it('liefert die 53. Woche, wo es sie gibt', () => {
    assert.deepEqual(wochenBereich(2026, 53), { von: '2026-12-28', bis: '2027-01-03' });
  });

  it('ist invers zu isoKalenderwoche', () => {
    // Jeder Montag eines Bereichs muss wieder dieselbe Woche ergeben.
    for (const [jahr, woche] of [[2026, 1], [2026, 29], [2026, 53], [2028, 1]] as const) {
      const bereich = wochenBereich(jahr, woche);
      assert.deepEqual(
        isoKalenderwoche(tag(bereich.von)),
        { jahr, woche },
        `Rückrechnung von ${jahr}-KW${woche} (${bereich.von}) stimmt nicht`,
      );
    }
  });
});

describe('findeWochenLuecken', () => {
  it('meldet nichts bei lückenlosem Zeitraum', () => {
    const vorhanden = [
      { von: '2026-07-13' },
      { von: '2026-07-20' },
    ];
    assert.deepEqual(findeWochenLuecken(vorhanden, '2026-07-13', '2026-07-26'), []);
  });

  it('meldet die fehlende Woche in der Mitte', () => {
    const vorhanden = [{ von: '2026-07-13' }, { von: '2026-07-27' }];
    const luecken = findeWochenLuecken(vorhanden, '2026-07-13', '2026-07-27');
    assert.deepEqual(
      luecken.map((l) => `${l.jahr}-${l.kalenderwoche}`),
      ['2026-30'],
    );
  });

  it('läuft über den Jahreswechsel und die 53. Woche', () => {
    // Kein Eintrag vorhanden; Zeitraum umfasst KW52/2026, KW53/2026, KW1/2027.
    const luecken = findeWochenLuecken([], '2026-12-21', '2027-01-04');
    assert.deepEqual(
      luecken.map((l) => `${l.jahr}-${l.kalenderwoche}`),
      ['2026-52', '2026-53', '2027-1'],
    );
  });

  it('behandelt einen Zeitraum aus einer einzigen Woche', () => {
    assert.deepEqual(findeWochenLuecken([{ von: '2026-07-13' }], '2026-07-13', '2026-07-19'), []);
    assert.deepEqual(
      findeWochenLuecken([], '2026-07-13', '2026-07-19').map((l) => l.kalenderwoche),
      [29],
    );
  });

  it('ignoriert Einträge ohne Von-Datum', () => {
    const vorhanden = [{ von: null }, { von: '2026-07-13' }];
    const luecken = findeWochenLuecken(vorhanden, '2026-07-13', '2026-07-19');
    assert.deepEqual(luecken, []);
  });

  it('meldet keine doppelten Wochen, wenn eine Woche mehrfach abgedeckt ist', () => {
    // Zwei Einträge in derselben Kalenderwoche dürfen die Nachbarwoche nicht
    // fälschlich als abgedeckt oder doppelt gemeldet erscheinen lassen.
    const vorhanden = [{ von: '2026-07-13' }, { von: '2026-07-15' }];
    const luecken = findeWochenLuecken(vorhanden, '2026-07-13', '2026-07-26');
    assert.deepEqual(luecken.map((l) => l.kalenderwoche), [30]);
  });
});
