/**
 * Abo-Pflege.
 *
 * Abgelaufene Endpunkte müssen verschwinden, aber ein einzelner Netzwerkfehler
 * darf kein aktives Gerät kosten. Diese Grenze prüfen die Tests hier.
 */

import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import {
  aboEntfernen,
  ENTFERNEN_BEI_STATUS,
  MAX_FEHLVERSUCHE,
  sendbareAbos,
  versandErfolgreich,
} from '@bze/core/benachrichtigung';
import { abo } from '../../helpers/fabriken';

describe('versandErfolgreich', () => {
  it('gilt für den 2xx-Bereich', () => {
    assert.equal(versandErfolgreich(200), true);
    assert.equal(versandErfolgreich(201), true);
    assert.equal(versandErfolgreich(299), true);
  });

  it('gilt nicht darunter und darüber', () => {
    for (const status of [199, 300, 400, 410, 429, 500]) {
      assert.equal(versandErfolgreich(status), false);
    }
  });
});

describe('aboEntfernen', () => {
  it('entfernt sofort bei abgelaufenem Endpunkt', () => {
    // 404 und 410 sind die im Web-Push-Protokoll vorgesehenen Antworten.
    for (const status of ENTFERNEN_BEI_STATUS) {
      assert.equal(aboEntfernen(status, 0), true, `Status ${status} muss sofort entfernen`);
    }
  });

  it('behält das Abo bei Serverfehlern', () => {
    // 500 liegt beim Push-Dienst, nicht beim Endpunkt.
    assert.equal(aboEntfernen(500, 0), false);
    assert.equal(aboEntfernen(503, MAX_FEHLVERSUCHE), false);
  });

  it('behält das Abo bei Drosselung', () => {
    // 429 heißt „später wieder", nicht „nie wieder".
    assert.equal(aboEntfernen(429, MAX_FEHLVERSUCHE), false);
  });

  it('entfernt dauerhafte Anfragefehler erst nach der Zählung', () => {
    assert.equal(aboEntfernen(400, 0), false);
    assert.equal(aboEntfernen(400, MAX_FEHLVERSUCHE - 2), false);
    assert.equal(aboEntfernen(400, MAX_FEHLVERSUCHE - 1), true);
  });

  it('behält das Abo bei erfolgreichem Versand', () => {
    assert.equal(aboEntfernen(201, 0), false);
  });
});

describe('sendbareAbos', () => {
  it('sortiert das zuletzt bediente Gerät nach vorn', () => {
    const abos = [
      abo({ id: 'alt', zuletztGesendetAm: '2026-01-01T00:00:00Z' }),
      abo({ id: 'neu', zuletztGesendetAm: '2026-01-14T00:00:00Z' }),
      abo({ id: 'nie', zuletztGesendetAm: null }),
    ];
    assert.deepEqual(sendbareAbos(abos).map((a) => a.id), ['neu', 'alt', 'nie']);
  });

  it('lässt Abos über der Fehlergrenze weg', () => {
    const abos = [
      abo({ id: 'gut', fehlversuche: MAX_FEHLVERSUCHE - 1 }),
      abo({ id: 'tot', fehlversuche: MAX_FEHLVERSUCHE }),
    ];
    assert.deepEqual(sendbareAbos(abos).map((a) => a.id), ['gut']);
  });

  it('lässt Abos ohne Endpunkt weg', () => {
    assert.deepEqual(sendbareAbos([abo({ endpoint: '' })]), []);
  });

  it('verträgt unlesbare Zeitstempel', () => {
    const abos = [abo({ id: 'kaputt', zuletztGesendetAm: 'kein-datum' }), abo({ id: 'ok' })];
    assert.equal(sendbareAbos(abos).length, 2);
  });

  it('ist bei leerer Eingabe leer', () => {
    assert.deepEqual(sendbareAbos([]), []);
  });

  it('verändert die übergebene Liste nicht', () => {
    const abos = [
      abo({ id: 'a', zuletztGesendetAm: '2026-01-01T00:00:00Z' }),
      abo({ id: 'b', zuletztGesendetAm: '2026-01-14T00:00:00Z' }),
    ];
    sendbareAbos(abos);
    assert.deepEqual(abos.map((a) => a.id), ['a', 'b'], 'die Eingabe wurde umsortiert');
  });
});
