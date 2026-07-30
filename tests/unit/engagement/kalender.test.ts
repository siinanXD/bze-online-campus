/**
 * Kalendertag- und Stundenrechnung.
 *
 * Die Tests hier sind der Grund, warum die Domain überhaupt in Kalendertagen
 * rechnet und nicht in Millisekunden: Zeitumstellung, Jahreswechsel und
 * Mitternacht in einer anderen Zeitzone brechen jede naive Rechnung.
 */

import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import {
  alsKalendertag,
  istKalendertag,
  lokaleStunde,
  STANDARD_ZEITZONE,
  tageDazwischen,
  verschiebeTag,
  vortag,
} from '@bze/core/engagement';
import { utc, ZEITPUNKTE } from '../../helpers/zeit';

describe('alsKalendertag', () => {
  it('nimmt die Zeitzone der lernenden Person, nicht UTC', () => {
    // 23:30 UTC am 14.01. ist in Berlin schon der 15.01. um 00:30.
    assert.equal(alsKalendertag(ZEITPUNKTE.winterNachMitternacht, 'Europe/Berlin'), '2026-01-15');
    assert.equal(alsKalendertag(ZEITPUNKTE.winterNachMitternacht, 'UTC'), '2026-01-14');
  });

  it('rechnet über die Datumsgrenze in beide Richtungen', () => {
    const mittag = utc('2026-05-10T12:00:00');
    assert.equal(alsKalendertag(mittag, 'Pacific/Auckland'), '2026-05-11');
    assert.equal(alsKalendertag(mittag, 'America/Los_Angeles'), '2026-05-10');
    // 01:00 UTC ist in Los Angeles noch der Vortag.
    assert.equal(alsKalendertag(utc('2026-05-10T01:00:00'), 'America/Los_Angeles'), '2026-05-09');
  });

  it('nutzt Europe/Berlin als Standard', () => {
    assert.equal(
      alsKalendertag(ZEITPUNKTE.winterNachMitternacht),
      alsKalendertag(ZEITPUNKTE.winterNachMitternacht, STANDARD_ZEITZONE),
    );
  });

  it('liefert immer zweistellige Monate und Tage', () => {
    assert.equal(alsKalendertag(utc('2026-03-05T12:00:00')), '2026-03-05');
  });
});

describe('lokaleStunde', () => {
  it('unterscheidet Sommer- und Winterzeit', () => {
    // Beide Zeitpunkte sind 12:00 in Berlin, aber 11:00 bzw. 10:00 UTC.
    assert.equal(lokaleStunde(ZEITPUNKTE.winterMittag, 'Europe/Berlin'), 12);
    assert.equal(lokaleStunde(ZEITPUNKTE.sommerMittag, 'Europe/Berlin'), 12);
  });

  it('gibt Mitternacht als 0 zurück, nicht als 24', () => {
    // Häufiger Fehler: hourCycle h24 liefert hier 24 und bricht jede
    // Bereichsprüfung auf stille Zeiten.
    assert.equal(lokaleStunde(utc('2026-01-14T23:00:00'), 'Europe/Berlin'), 0);
  });

  it('bleibt in der Umstellungsnacht in gültigem Bereich', () => {
    const stunde = lokaleStunde(ZEITPUNKTE.sommerzeitBeginn, 'Europe/Berlin');
    assert.ok(stunde >= 0 && stunde <= 23, `Stunde außerhalb 0..23: ${stunde}`);
  });

  it('berücksichtigt Zeitzonen mit halbstündigem Versatz', () => {
    // Asia/Kolkata liegt bei UTC+5:30 — die Stunde springt zur halben Stunde.
    assert.equal(lokaleStunde(utc('2026-01-14T10:00:00'), 'Asia/Kolkata'), 15);
    assert.equal(lokaleStunde(utc('2026-01-14T10:45:00'), 'Asia/Kolkata'), 16);
  });
});

describe('verschiebeTag', () => {
  it('läuft über Monatsgrenzen', () => {
    assert.equal(verschiebeTag('2026-01-31', 1), '2026-02-01');
    assert.equal(verschiebeTag('2026-03-01', -1), '2026-02-28');
  });

  it('kennt Schaltjahre', () => {
    assert.equal(verschiebeTag('2028-02-28', 1), '2028-02-29');
    assert.equal(verschiebeTag('2028-03-01', -1), '2028-02-29');
    // 2100 ist kein Schaltjahr (durch 100 teilbar, nicht durch 400).
    assert.equal(verschiebeTag('2100-02-28', 1), '2100-03-01');
  });

  it('läuft über Jahresgrenzen', () => {
    assert.equal(verschiebeTag('2026-12-31', 1), '2027-01-01');
    assert.equal(verschiebeTag('2027-01-01', -1), '2026-12-31');
  });

  it('bleibt über einen Sommerzeitwechsel exakt', () => {
    // Der 29.03.2026 hat in Berlin nur 23 Stunden. Eine Rechnung in
    // Millisekunden würde hier einen Tag verlieren.
    assert.equal(verschiebeTag('2026-03-28', 1), '2026-03-29');
    assert.equal(verschiebeTag('2026-03-29', 1), '2026-03-30');
    assert.equal(verschiebeTag('2026-10-25', 1), '2026-10-26');
  });

  it('ändert bei 0 nichts', () => {
    assert.equal(verschiebeTag('2026-06-15', 0), '2026-06-15');
  });

  it('verschiebt auch über größere Spannen', () => {
    assert.equal(verschiebeTag('2026-01-01', 365), '2027-01-01');
  });
});

describe('vortag', () => {
  it('ist die Verschiebung um minus eins', () => {
    assert.equal(vortag('2026-01-01'), '2025-12-31');
    assert.equal(vortag('2028-03-01'), '2028-02-29');
  });
});

describe('tageDazwischen', () => {
  it('zählt vorwärts und rückwärts', () => {
    assert.equal(tageDazwischen('2026-01-01', '2026-01-08'), 7);
    assert.equal(tageDazwischen('2026-01-08', '2026-01-01'), -7);
    assert.equal(tageDazwischen('2026-01-01', '2026-01-01'), 0);
  });

  it('zählt Sommerzeitwechsel als ganze Tage', () => {
    // 23-Stunden-Tag: eine Millisekundenrechnung ergäbe hier 0,958 → gerundet 1,
    // aber über eine ganze Woche mit Umstellung würde sich der Fehler summieren.
    assert.equal(tageDazwischen('2026-03-28', '2026-03-30'), 2);
    assert.equal(tageDazwischen('2026-10-24', '2026-10-26'), 2);
    assert.equal(tageDazwischen('2026-03-01', '2026-11-01'), 245);
  });
});

describe('istKalendertag', () => {
  it('erkennt gültige Tage', () => {
    assert.equal(istKalendertag('2026-01-14'), true);
  });

  it('lehnt alles andere ab', () => {
    for (const wert of ['14.01.2026', '2026-1-4', '2026-01-14T10:00:00Z', '', null, undefined, 42, {}]) {
      assert.equal(istKalendertag(wert), false, `unerwartet akzeptiert: ${String(wert)}`);
    }
  });
});
