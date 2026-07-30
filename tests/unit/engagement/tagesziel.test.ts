/**
 * Tagesziel.
 *
 * Schwerpunkt der Tests: kaputte Werte aus den Einstellungen dürfen das
 * Dashboard nicht lahmlegen, und der Fortschrittsring darf bei Übererfüllung
 * nicht überlaufen.
 */

import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import {
  empfohlenesTagesziel,
  MAX_TAGESZIEL,
  MIN_TAGESZIEL,
  normalisiereTagesziel,
  STANDARD_TAGESZIEL,
  tageszielStand,
} from '@bze/core/engagement';

describe('normalisiereTagesziel', () => {
  it('lässt gültige Werte unverändert', () => {
    assert.equal(normalisiereTagesziel(10), 10);
    assert.equal(normalisiereTagesziel(MIN_TAGESZIEL), MIN_TAGESZIEL);
    assert.equal(normalisiereTagesziel(MAX_TAGESZIEL), MAX_TAGESZIEL);
  });

  it('begrenzt nach unten und oben', () => {
    assert.equal(normalisiereTagesziel(1), MIN_TAGESZIEL);
    assert.equal(normalisiereTagesziel(0), MIN_TAGESZIEL);
    assert.equal(normalisiereTagesziel(-50), MIN_TAGESZIEL);
    assert.equal(normalisiereTagesziel(5000), MAX_TAGESZIEL);
  });

  it('rundet Kommazahlen', () => {
    assert.equal(normalisiereTagesziel(10.4), 10);
    assert.equal(normalisiereTagesziel(10.6), 11);
  });

  it('fällt bei unbrauchbaren Werten auf den Standard zurück', () => {
    for (const wert of [null, undefined, NaN, Infinity, -Infinity, 'zehn', {}, []]) {
      assert.equal(
        normalisiereTagesziel(wert),
        STANDARD_TAGESZIEL,
        `unerwartet nicht auf Standard: ${String(wert)}`,
      );
    }
  });

  it('nimmt Zahlen als Text an, weil Formulare Text liefern', () => {
    assert.equal(normalisiereTagesziel('15'), 15);
  });
});

describe('tageszielStand', () => {
  it('rechnet den Normalfall', () => {
    const stand = tageszielStand(4, 10);
    assert.deepEqual(stand, { erledigt: 4, ziel: 10, offen: 6, anteil: 0.4, erreicht: false });
  });

  it('meldet das Ziel als erreicht bei genau der Zielzahl', () => {
    const stand = tageszielStand(10, 10);
    assert.equal(stand.erreicht, true);
    assert.equal(stand.offen, 0);
    assert.equal(stand.anteil, 1);
  });

  it('deckelt den Anteil bei Übererfüllung, behält aber die echte Zahl', () => {
    const stand = tageszielStand(37, 10);
    assert.equal(stand.erledigt, 37, 'die echte Leistung bleibt sichtbar');
    assert.equal(stand.anteil, 1, 'der Ring darf nicht überlaufen');
    assert.equal(stand.offen, 0);
  });

  it('behandelt den leeren Tag', () => {
    const stand = tageszielStand(0, 10);
    assert.equal(stand.anteil, 0);
    assert.equal(stand.offen, 10);
    assert.equal(stand.erreicht, false);
  });

  it('verträgt kaputte Eingaben ohne Division durch Null', () => {
    const stand = tageszielStand(NaN, 0);
    assert.equal(stand.erledigt, 0);
    assert.equal(stand.ziel, MIN_TAGESZIEL, 'Ziel 0 würde durch Null teilen');
    assert.ok(Number.isFinite(stand.anteil));
  });

  it('wertet negative Erledigt-Zahlen als 0', () => {
    assert.equal(tageszielStand(-5, 10).erledigt, 0);
  });

  it('schneidet Kommazahlen bei erledigt ab statt zu runden', () => {
    // Halbe beantwortete Fragen gibt es nicht; aufrunden würde Leistung erfinden.
    assert.equal(tageszielStand(4.9, 10).erledigt, 4);
  });
});

describe('empfohlenesTagesziel', () => {
  it('rundet den Mittelwert aktiver Tage auf ein Vielfaches von 5', () => {
    assert.equal(empfohlenesTagesziel([12, 13, 14]), 15);
    assert.equal(empfohlenesTagesziel([10, 10, 10]), 10);
  });

  it('lässt Tage ohne Aktivität außen vor', () => {
    // Eine Krankheitswoche darf das Ziel nicht dauerhaft senken.
    assert.equal(empfohlenesTagesziel([20, 0, 0, 0, 20]), 20);
  });

  it('fällt ohne aktive Tage auf den Standard zurück', () => {
    assert.equal(empfohlenesTagesziel([]), STANDARD_TAGESZIEL);
    assert.equal(empfohlenesTagesziel([0, 0, 0]), STANDARD_TAGESZIEL);
  });

  it('bleibt in den Grenzen', () => {
    assert.equal(empfohlenesTagesziel([1]), MIN_TAGESZIEL);
    assert.equal(empfohlenesTagesziel([9999]), MAX_TAGESZIEL);
  });

  it('ignoriert unbrauchbare Werte in der Reihe', () => {
    assert.equal(empfohlenesTagesziel([10, NaN, Infinity, 10]), 10);
  });
});
