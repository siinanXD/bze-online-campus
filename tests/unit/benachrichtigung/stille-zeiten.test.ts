/**
 * Stille Zeiten.
 *
 * Der Fall über Mitternacht (21 Uhr bis 7 Uhr) ist der Standard und gleichzeitig
 * der, an dem naive Bereichsprüfungen (`stunde >= von && stunde < bis`)
 * scheitern. Deshalb steht er hier im Mittelpunkt.
 */

import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import {
  istAbendfenster,
  istStilleZeit,
  normalisiereStunde,
  STANDARD_STILL_BIS,
  STANDARD_STILL_VON,
  stundeIstStill,
} from '@bze/core/benachrichtigung';
import { einstellungen } from '../../helpers/fabriken';
import { utc, ZEITPUNKTE } from '../../helpers/zeit';

describe('stundeIstStill — über Mitternacht (21 bis 7)', () => {
  it('ist still am späten Abend', () => {
    assert.equal(stundeIstStill(21, 21, 7), true, 'die Grenze zählt als still');
    assert.equal(stundeIstStill(23, 21, 7), true);
  });

  it('ist still in der Nacht und am frühen Morgen', () => {
    assert.equal(stundeIstStill(0, 21, 7), true, 'Mitternacht muss still sein');
    assert.equal(stundeIstStill(3, 21, 7), true);
    assert.equal(stundeIstStill(6, 21, 7), true);
  });

  it('ist wach ab der Endstunde', () => {
    assert.equal(stundeIstStill(7, 21, 7), false, 'das Ende ist ausschließlich');
    assert.equal(stundeIstStill(12, 21, 7), false);
    assert.equal(stundeIstStill(20, 21, 7), false);
  });
});

describe('stundeIstStill — innerhalb eines Tages (13 bis 15)', () => {
  it('gilt nur im Fenster', () => {
    assert.equal(stundeIstStill(13, 13, 15), true);
    assert.equal(stundeIstStill(14, 13, 15), true);
    assert.equal(stundeIstStill(15, 13, 15), false);
    assert.equal(stundeIstStill(12, 13, 15), false);
    assert.equal(stundeIstStill(0, 13, 15), false);
  });
});

describe('stundeIstStill — Sonderfälle', () => {
  it('bedeutet bei gleichem Von und Bis: keine stille Zeit', () => {
    // Bewusst nicht „rund um die Uhr still": ein versehentlich gleicher Wert
    // darf Benachrichtigungen nicht vollständig abschalten.
    for (const stunde of [0, 7, 12, 21, 23]) {
      assert.equal(stundeIstStill(stunde, 12, 12), false);
    }
  });

  it('deckt bei 0 bis 23 alles außer 23 Uhr ab', () => {
    assert.equal(stundeIstStill(0, 0, 23), true);
    assert.equal(stundeIstStill(22, 0, 23), true);
    assert.equal(stundeIstStill(23, 0, 23), false);
  });
});

describe('normalisiereStunde', () => {
  it('lässt gültige Stunden durch', () => {
    assert.equal(normalisiereStunde(0, 9), 0);
    assert.equal(normalisiereStunde(23, 9), 23);
  });

  it('ersetzt Werte außerhalb 0..23', () => {
    assert.equal(normalisiereStunde(24, 9), 9);
    assert.equal(normalisiereStunde(-1, 9), 9);
    assert.equal(normalisiereStunde(100, 9), 9);
  });

  it('ersetzt unbrauchbare Werte', () => {
    for (const wert of [null, undefined, NaN, Infinity, 'abend', {}]) {
      assert.equal(normalisiereStunde(wert, 9), 9, `nicht ersetzt: ${String(wert)}`);
    }
  });

  it('schneidet Kommastunden ab', () => {
    assert.equal(normalisiereStunde(21.9, 9), 21);
  });
});

describe('istStilleZeit', () => {
  it('rechnet in der Zeitzone der Person, nicht auf dem Server', () => {
    // 21:00 UTC ist 22:00 in Berlin (still) und 21:00 in London (auch still),
    // aber 16:00 in New York (wach).
    const zeitpunkt = ZEITPUNKTE.winterNacht;
    assert.equal(istStilleZeit(einstellungen({ zeitzone: 'Europe/Berlin' }), zeitpunkt), true);
    assert.equal(istStilleZeit(einstellungen({ zeitzone: 'America/New_York' }), zeitpunkt), false);
  });

  it('verschiebt die Grenze mit der Sommerzeit', () => {
    // 19:30 UTC ist im Winter 20:30 Berlin (wach) und im Sommer 21:30 (still).
    const winter = utc('2026-01-14T19:30:00');
    const sommer = utc('2026-07-14T19:30:00');
    assert.equal(istStilleZeit(einstellungen(), winter), false);
    assert.equal(istStilleZeit(einstellungen(), sommer), true);
  });

  it('fällt bei kaputten Grenzen auf den Standard zurück', () => {
    const kaputt = einstellungen({ stillVon: 99, stillBis: -3 });
    // Standard ist 21 bis 7 — 22:00 Berlin muss still sein.
    assert.equal(istStilleZeit(kaputt, ZEITPUNKTE.winterNacht), true);
    assert.equal(istStilleZeit(kaputt, ZEITPUNKTE.winterMittag), false);
  });

  it('achtet auf eigene Grenzen von Schichtarbeitenden', () => {
    // Nachtschicht: still von 6 bis 14 Uhr. 12:00 Berlin liegt darin.
    const nachtschicht = einstellungen({ stillVon: 6, stillBis: 14 });
    assert.equal(istStilleZeit(nachtschicht, ZEITPUNKTE.winterMittag), true);
    assert.equal(istStilleZeit(nachtschicht, ZEITPUNKTE.winterNacht), false);
  });

  it('bleibt in der Umstellungsnacht entscheidbar', () => {
    // 01:30 UTC am 29.03. ist in Berlin 03:30 (nach dem Sprung) — still.
    assert.equal(istStilleZeit(einstellungen(), ZEITPUNKTE.sommerzeitBeginn), true);
    // 00:30 UTC am 25.10. ist in Berlin 02:30 — still, egal welche der beiden.
    assert.equal(istStilleZeit(einstellungen(), ZEITPUNKTE.winterzeitBeginn), true);
  });

  it('nutzt Standardgrenzen, die zueinander passen', () => {
    assert.equal(stundeIstStill(22, STANDARD_STILL_VON, STANDARD_STILL_BIS), true);
    assert.equal(stundeIstStill(9, STANDARD_STILL_VON, STANDARD_STILL_BIS), false);
  });
});

describe('istAbendfenster', () => {
  it('umfasst die zwei Stunden vor der stillen Zeit', () => {
    // Standard stillVon 21 → Fenster 19:00 bis 20:59 Berlin.
    assert.equal(istAbendfenster(einstellungen(), ZEITPUNKTE.winterAbend), true);
    assert.equal(istAbendfenster(einstellungen(), ZEITPUNKTE.sommerAbend), true);
  });

  it('umfasst nicht den Nachmittag und nicht die stille Zeit selbst', () => {
    assert.equal(istAbendfenster(einstellungen(), ZEITPUNKTE.winterMittag), false);
    assert.equal(istAbendfenster(einstellungen(), ZEITPUNKTE.winterNacht), false);
  });

  it('läuft über Mitternacht, wenn die stille Zeit um 1 Uhr beginnt', () => {
    // stillVon 1 → Fenster 23:00 bis 00:59.
    const spaet = einstellungen({ stillVon: 1, stillBis: 8 });
    // 23:30 UTC ist 00:30 Berlin.
    assert.equal(istAbendfenster(spaet, ZEITPUNKTE.winterNachMitternacht), true);
    assert.equal(istAbendfenster(spaet, ZEITPUNKTE.winterMittag), false);
  });
});
