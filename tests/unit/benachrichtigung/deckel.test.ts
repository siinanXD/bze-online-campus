/**
 * Frequenzdeckel und Mindestpause.
 *
 * Die Tests halten fest, dass der Tagesdeckel in der Zeitzone der Person
 * gemessen wird und nicht in UTC — sonst bekäme jemand um 23:30 Uhr deutscher
 * Zeit ein zweites Tagesbudget, weil es in UTC noch derselbe Tag ist.
 */

import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import {
  ABSOLUTES_MAX_PRO_TAG,
  anlassErlaubt,
  heuteGesendet,
  MINDESTPAUSE_STUNDEN,
  normalisiereMaxProTag,
  pauseAbgelaufen,
  STANDARD_MAX_PRO_TAG,
  verbleibendesBudget,
} from '@bze/core/benachrichtigung';
import type { Anlass } from '@bze/core/benachrichtigung';
import { einstellungen, protokoll } from '../../helpers/fabriken';
import { utc, ZEITPUNKTE } from '../../helpers/zeit';

const HEUTE = '2026-01-14';

describe('normalisiereMaxProTag', () => {
  it('lässt gültige Werte durch', () => {
    assert.equal(normalisiereMaxProTag(1), 1);
    assert.equal(normalisiereMaxProTag(3), 3);
  });

  it('erlaubt 0 als vollständige Ruhe', () => {
    assert.equal(normalisiereMaxProTag(0), 0);
    assert.equal(normalisiereMaxProTag(-7), 0);
  });

  it('deckelt hart bei der absoluten Obergrenze', () => {
    // Auch wenn jemand 50 einträgt: mehr als fünf am Tag ist kein Lernwerkzeug.
    assert.equal(normalisiereMaxProTag(50), ABSOLUTES_MAX_PRO_TAG);
  });

  it('fällt bei unbrauchbaren Werten auf den Standard', () => {
    for (const wert of [null, undefined, NaN, 'viele', {}]) {
      assert.equal(normalisiereMaxProTag(wert), STANDARD_MAX_PRO_TAG);
    }
  });
});

describe('heuteGesendet', () => {
  it('zählt nur Einträge des heutigen Kalendertags', () => {
    const eintraege = [
      protokoll('faellige_wiederholung', '2026-01-14T08:00:00Z', HEUTE),
      protokoll('serie_gefaehrdet', '2026-01-14T18:00:00Z', HEUTE),
      protokoll('faellige_wiederholung', '2026-01-13T08:00:00Z', '2026-01-13'),
    ];
    assert.equal(heuteGesendet(eintraege, einstellungen(), ZEITPUNKTE.winterMittag), 2);
  });

  it('bestimmt den Tag in der Zeitzone der Person', () => {
    // 23:30 UTC ist in Berlin schon der 15.01. — der Eintrag vom 14. zählt nicht
    // mehr, das Tagesbudget beginnt neu.
    const eintraege = [protokoll('faellige_wiederholung', '2026-01-14T20:00:00Z', HEUTE)];
    assert.equal(
      heuteGesendet(eintraege, einstellungen(), ZEITPUNKTE.winterNachMitternacht),
      0,
      'in Berlin ist es bereits der Folgetag',
    );
    assert.equal(
      heuteGesendet(eintraege, einstellungen({ zeitzone: 'UTC' }), ZEITPUNKTE.winterNachMitternacht),
      1,
      'in UTC ist es noch derselbe Tag',
    );
  });

  it('ist 0 bei leerem Protokoll', () => {
    assert.equal(heuteGesendet([], einstellungen(), ZEITPUNKTE.winterMittag), 0);
  });
});

describe('verbleibendesBudget', () => {
  it('rechnet den Deckel gegen das Gesendete', () => {
    const eins = [protokoll('faellige_wiederholung', '2026-01-14T08:00:00Z', HEUTE)];
    assert.equal(verbleibendesBudget(eins, einstellungen({ maxProTag: 2 }), ZEITPUNKTE.winterMittag), 1);
  });

  it('ist 0, wenn der Deckel erreicht ist', () => {
    const zwei = [
      protokoll('faellige_wiederholung', '2026-01-14T08:00:00Z', HEUTE),
      protokoll('serie_gefaehrdet', '2026-01-14T09:00:00Z', HEUTE),
    ];
    assert.equal(verbleibendesBudget(zwei, einstellungen({ maxProTag: 2 }), ZEITPUNKTE.winterMittag), 0);
  });

  it('wird nie negativ, auch wenn mehr gesendet wurde als erlaubt', () => {
    // Kann bei nachträglich gesenktem Deckel vorkommen.
    const drei = [
      protokoll('faellige_wiederholung', '2026-01-14T08:00:00Z', HEUTE),
      protokoll('serie_gefaehrdet', '2026-01-14T09:00:00Z', HEUTE),
      protokoll('tagesziel_offen', '2026-01-14T10:00:00Z', HEUTE),
    ];
    assert.equal(verbleibendesBudget(drei, einstellungen({ maxProTag: 1 }), ZEITPUNKTE.winterMittag), 0);
  });

  it('ist bei Deckel 0 immer 0', () => {
    assert.equal(verbleibendesBudget([], einstellungen({ maxProTag: 0 }), ZEITPUNKTE.winterMittag), 0);
  });
});

describe('pauseAbgelaufen', () => {
  it('ist ohne früheren Eintrag immer abgelaufen', () => {
    assert.equal(pauseAbgelaufen('faellige_wiederholung', [], ZEITPUNKTE.winterMittag), true);
  });

  it('sperrt innerhalb der Mindestpause', () => {
    // Pause 20 Stunden, letzter Versand vor 2 Stunden.
    const jetzt = utc('2026-01-14T12:00:00');
    const kuerzlich = [protokoll('faellige_wiederholung', '2026-01-14T10:00:00Z', HEUTE)];
    assert.equal(pauseAbgelaufen('faellige_wiederholung', kuerzlich, jetzt), false);
  });

  it('gibt nach Ablauf der Mindestpause wieder frei', () => {
    const jetzt = utc('2026-01-14T12:00:00');
    const alt = [protokoll('faellige_wiederholung', '2026-01-13T15:00:00Z', '2026-01-13')];
    assert.equal(pauseAbgelaufen('faellige_wiederholung', alt, jetzt), true);
  });

  it('gilt genau auf die Grenze', () => {
    const jetzt = utc('2026-01-14T12:00:00');
    // Genau 20 Stunden zuvor.
    const grenze = [protokoll('faellige_wiederholung', '2026-01-13T16:00:00Z', '2026-01-13')];
    assert.equal(pauseAbgelaufen('faellige_wiederholung', grenze, jetzt), true);
  });

  it('betrachtet je Anlass nur den eigenen Verlauf', () => {
    const jetzt = utc('2026-01-14T12:00:00');
    const fremd = [protokoll('serie_gefaehrdet', '2026-01-14T11:00:00Z', HEUTE)];
    assert.equal(pauseAbgelaufen('faellige_wiederholung', fremd, jetzt), true);
    assert.equal(pauseAbgelaufen('serie_gefaehrdet', fremd, jetzt), false);
  });

  it('nimmt den jüngsten Eintrag, nicht den ersten', () => {
    const jetzt = utc('2026-01-14T12:00:00');
    const gemischt = [
      protokoll('faellige_wiederholung', '2026-01-01T00:00:00Z', '2026-01-01'),
      protokoll('faellige_wiederholung', '2026-01-14T11:00:00Z', HEUTE),
      protokoll('faellige_wiederholung', '2026-01-05T00:00:00Z', '2026-01-05'),
    ];
    assert.equal(pauseAbgelaufen('faellige_wiederholung', gemischt, jetzt), false);
  });

  it('kennt für Ausbilder-Entscheidungen keine Pause', () => {
    // Zwei Freigaben sind zwei Nachrichten wert.
    const jetzt = utc('2026-01-14T12:00:00');
    const geradeEben = [protokoll('nachweis_entschieden', '2026-01-14T11:59:00Z', HEUTE)];
    assert.equal(pauseAbgelaufen('nachweis_entschieden', geradeEben, jetzt), true);
  });

  it('übergeht unlesbare Zeitstempel statt zu blockieren', () => {
    const jetzt = utc('2026-01-14T12:00:00');
    const kaputt = [protokoll('faellige_wiederholung', 'kein-datum', HEUTE)];
    assert.equal(
      pauseAbgelaufen('faellige_wiederholung', kaputt, jetzt),
      true,
      'ein defekter Eintrag darf den Anlass nicht für immer sperren',
    );
  });

  it('hat für jeden Anlass eine Pause hinterlegt', () => {
    const anlaesse: Anlass[] = [
      'faellige_wiederholung',
      'serie_gefaehrdet',
      'tagesziel_offen',
      'wochenpruefung_offen',
      'nachweis_luecke',
      'nachweis_entschieden',
      'wochenbericht_bereit',
    ];
    for (const anlass of anlaesse) {
      assert.equal(typeof MINDESTPAUSE_STUNDEN[anlass], 'number', `${anlass} fehlt`);
    }
  });
});

describe('anlassErlaubt', () => {
  it('erlaubt ohne Abwahl alles', () => {
    assert.equal(anlassErlaubt('faellige_wiederholung', einstellungen()), true);
  });

  it('sperrt abgewählte Anlässe', () => {
    const ohneSerie = einstellungen({ abgewaehlt: ['serie_gefaehrdet'] });
    assert.equal(anlassErlaubt('serie_gefaehrdet', ohneSerie), false);
    assert.equal(anlassErlaubt('faellige_wiederholung', ohneSerie), true);
  });
});
