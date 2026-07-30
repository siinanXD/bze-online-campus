/**
 * Zahlen aus unbekannten Eingaben.
 *
 * Dieses Modul entstand aus drei echten Fehlern derselben Ursache:
 * `Number(null)`, `Number('')` und `Number([])` ergeben alle 0. Die Tests hier
 * halten genau das fest, damit der Fehler nicht ein viertes Mal auftritt.
 */

import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { beschnitteneZahl, endlicheZahl, ganzeZahlImBereich } from '@bze/core/werte';

describe('endlicheZahl', () => {
  it('nimmt echte Zahlen an', () => {
    assert.equal(endlicheZahl(42), 42);
    assert.equal(endlicheZahl(0), 0);
    assert.equal(endlicheZahl(-7), -7);
    assert.equal(endlicheZahl(3.5), 3.5);
  });

  it('nimmt Zahlen als Text an, weil Formulare Text liefern', () => {
    assert.equal(endlicheZahl('42'), 42);
    assert.equal(endlicheZahl(' 42 '), 42);
    assert.equal(endlicheZahl('-7.5'), -7.5);
    assert.equal(endlicheZahl('0'), 0);
  });

  it('lehnt die drei Fallen ab, die als 0 durchgehen würden', () => {
    assert.equal(endlicheZahl(null), null, 'Number(null) ist 0');
    assert.equal(endlicheZahl(''), null, "Number('') ist 0");
    assert.equal(endlicheZahl([]), null, 'Number([]) ist 0');
  });

  it('lehnt Leerraum-Text ab', () => {
    assert.equal(endlicheZahl('   '), null);
    assert.equal(endlicheZahl('\t\n'), null);
  });

  it('lehnt nicht endliche Zahlen ab', () => {
    assert.equal(endlicheZahl(NaN), null);
    assert.equal(endlicheZahl(Infinity), null);
    assert.equal(endlicheZahl(-Infinity), null);
  });

  it('lehnt alles andere ab', () => {
    for (const wert of [undefined, {}, [1, 2], 'zehn', true, false, () => 1]) {
      assert.equal(endlicheZahl(wert), null, `unerwartet angenommen: ${String(wert)}`);
    }
  });
});

describe('ganzeZahlImBereich', () => {
  it('nimmt Werte im Bereich an, Grenzen eingeschlossen', () => {
    assert.equal(ganzeZahlImBereich(0, 0, 23), 0);
    assert.equal(ganzeZahlImBereich(23, 0, 23), 23);
    assert.equal(ganzeZahlImBereich(12, 0, 23), 12);
  });

  it('lehnt Werte außerhalb ab statt sie zu beschneiden', () => {
    assert.equal(ganzeZahlImBereich(24, 0, 23), null);
    assert.equal(ganzeZahlImBereich(-1, 0, 23), null);
  });

  it('schneidet Kommazahlen ab', () => {
    assert.equal(ganzeZahlImBereich(21.9, 0, 23), 21);
    assert.equal(ganzeZahlImBereich('7.99', 0, 23), 7);
  });

  it('lehnt unbrauchbare Eingaben ab', () => {
    for (const wert of [null, undefined, '', NaN, {}]) {
      assert.equal(ganzeZahlImBereich(wert, 0, 23), null);
    }
  });

  it('verträgt einen Bereich aus einem einzigen Wert', () => {
    assert.equal(ganzeZahlImBereich(5, 5, 5), 5);
    assert.equal(ganzeZahlImBereich(6, 5, 5), null);
  });
});

describe('beschnitteneZahl', () => {
  it('lässt Werte im Bereich unverändert', () => {
    assert.equal(beschnitteneZahl(10, 3, 100), 10);
  });

  it('zieht Werte außerhalb auf die nächste Grenze', () => {
    assert.equal(beschnitteneZahl(500, 3, 100), 100);
    assert.equal(beschnitteneZahl(-20, 3, 100), 3);
  });

  it('rundet, statt abzuschneiden', () => {
    // Anders als ganzeZahlImBereich: hier ist der Wert eine Absicht, kein Code.
    assert.equal(beschnitteneZahl(10.6, 3, 100), 11);
  });

  it('lehnt unbrauchbare Eingaben ab', () => {
    assert.equal(beschnitteneZahl(null, 3, 100), null);
    assert.equal(beschnitteneZahl('', 3, 100), null);
  });
});
