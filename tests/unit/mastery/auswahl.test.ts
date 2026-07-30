/**
 * Lernqueue — die Reihenfolge im Lernmodus.
 *
 * Das Herzstück der Plattform und bis hierher ohne einen einzigen Test. Die
 * Priorität aus Spec §4.1 ist: erst frühere Fehler, dann neue Fragen, dann
 * fällige Wiederholungen. Abgeschlossene und noch nicht fällige Fragen
 * erscheinen nicht.
 */

import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { lernqueue, themaFortschritt } from '@bze/core/mastery';
import type { FrageMitStand, LernFrage, MasteryState } from '@bze/core/mastery';
import { utc } from '../../helpers/zeit';

const JETZT = utc('2026-01-14T12:00:00');

function frage(id: string, abweichung: Partial<LernFrage> = {}): LernFrage {
  return {
    id,
    typ: 'mc',
    aufgabenstellung: `Frage ${id}`,
    bild_url: null,
    schwierigkeit: null,
    kern: true,
    tabellenbuch_fundstelle: null,
    optionen: [],
    ...abweichung,
  };
}

function stand(
  id: string,
  mastery: Partial<MasteryState> | null,
  frageAbweichung: Partial<LernFrage> = {},
): FrageMitStand {
  return {
    frage: frage(id, frageAbweichung),
    mastery: mastery
      ? { status: 'neu', streak: 0, fehler_gesamt: 0, naechste_faelligkeit: null, ...mastery }
      : null,
  };
}

describe('lernqueue — Reihenfolge', () => {
  it('setzt frühere Fehler vor neue Fragen und Wiederholungen', () => {
    const items = [
      stand('wiederholung', { status: 'einmal_richtig', naechste_faelligkeit: null }),
      stand('neu', { status: 'neu' }),
      stand('falsch', { status: 'falsch' }),
    ];
    assert.deepEqual(lernqueue(items, JETZT).map((f) => f.id), ['falsch', 'neu', 'wiederholung']);
  });

  it('behandelt einen fehlenden Mastery-Eintrag wie eine neue Frage', () => {
    const items = [stand('ohne', null), stand('falsch', { status: 'falsch' })];
    assert.deepEqual(lernqueue(items, JETZT).map((f) => f.id), ['falsch', 'ohne']);
  });

  it('ist bei leerer Eingabe leer', () => {
    assert.deepEqual(lernqueue([], JETZT), []);
  });
});

describe('lernqueue — was nicht erscheint', () => {
  it('lässt abgeschlossene Fragen weg', () => {
    const items = [stand('fertig', { status: 'abgeschlossen' })];
    assert.deepEqual(lernqueue(items, JETZT), []);
  });

  it('lässt noch nicht fällige Wiederholungen weg', () => {
    const items = [
      stand('spaeter', { status: 'einmal_richtig', naechste_faelligkeit: '2026-02-01T00:00:00Z' }),
    ];
    assert.deepEqual(lernqueue(items, JETZT), []);
  });

  it('lässt Freitextfragen weg — die werden in der Wochenprüfung geübt', () => {
    const items = [
      stand('freitext', { status: 'neu' }, { typ: 'freitext' }),
      stand('mc', { status: 'neu' }),
    ];
    assert.deepEqual(lernqueue(items, JETZT).map((f) => f.id), ['mc']);
  });

  it('lässt auch falsch beantwortete Freitextfragen weg', () => {
    const items = [stand('freitext', { status: 'falsch' }, { typ: 'freitext' })];
    assert.deepEqual(lernqueue(items, JETZT), []);
  });
});

describe('lernqueue — Fälligkeit von Wiederholungen', () => {
  it('nimmt Wiederholungen ohne Fälligkeitsdatum auf', () => {
    const items = [stand('a', { status: 'einmal_richtig', naechste_faelligkeit: null })];
    assert.equal(lernqueue(items, JETZT).length, 1);
  });

  it('nimmt sie genau zum Fälligkeitszeitpunkt auf', () => {
    const genau = [
      stand('a', { status: 'einmal_richtig', naechste_faelligkeit: '2026-01-14T12:00:00Z' }),
    ];
    assert.equal(lernqueue(genau, JETZT).length, 1, 'die Grenze zählt als fällig');
  });

  it('lässt sie eine Sekunde davor noch aus', () => {
    const knappDavor = [
      stand('a', { status: 'einmal_richtig', naechste_faelligkeit: '2026-01-14T12:00:01Z' }),
    ];
    assert.equal(lernqueue(knappDavor, JETZT).length, 0);
  });
});

describe('themaFortschritt', () => {
  it('rechnet nur mit Kernfragen', () => {
    const items = [
      stand('k1', { status: 'abgeschlossen' }),
      stand('k2', { status: 'neu' }),
      stand('rand', { status: 'neu' }, { kern: false }),
    ];
    assert.deepEqual(themaFortschritt(items), { fertig: 1, gesamt: 2, anteil: 0.5 });
  });

  it('teilt ohne Kernfragen nicht durch Null', () => {
    const nurRand = [stand('rand', { status: 'neu' }, { kern: false })];
    assert.deepEqual(themaFortschritt(nurRand), { fertig: 0, gesamt: 0, anteil: 0 });
    assert.deepEqual(themaFortschritt([]), { fertig: 0, gesamt: 0, anteil: 0 });
  });

  it('meldet ein vollständig bearbeitetes Thema als 1', () => {
    const items = [stand('k1', { status: 'abgeschlossen' }), stand('k2', { status: 'abgeschlossen' })];
    assert.equal(themaFortschritt(items).anteil, 1);
  });

  it('zählt nur abgeschlossen als fertig, nicht einmal_richtig', () => {
    // Einmal richtig ist noch nicht beherrscht — Spec §4.1 verlangt die Kaskade.
    const items = [stand('k1', { status: 'einmal_richtig' })];
    assert.equal(themaFortschritt(items).fertig, 0);
  });

  it('zählt Kernfragen ohne Mastery-Eintrag als offen mit', () => {
    const items = [stand('k1', null), stand('k2', { status: 'abgeschlossen' })];
    assert.deepEqual(themaFortschritt(items), { fertig: 1, gesamt: 2, anteil: 0.5 });
  });
});
