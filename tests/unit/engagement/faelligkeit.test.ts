/**
 * Fälligkeiten.
 *
 * Der wichtigste Grundsatz in diesen Tests: eine Frage darf nie unsichtbar
 * hängen bleiben. Fehlende oder kaputte Fälligkeitsdaten führen deshalb dazu,
 * dass die Frage als fällig gilt — zu früh zeigen ist harmloser als verlieren.
 */

import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import {
  faelligkeitsUebersicht,
  fehlerFrageIds,
  istWiederholungFaellig,
  naechsteFaelligkeit,
} from '@bze/core/engagement';
import { faellig } from '../../helpers/fabriken';
import { utc } from '../../helpers/zeit';

const JETZT = utc('2026-01-14T12:00:00');

describe('istWiederholungFaellig', () => {
  it('gilt nur für einmal_richtig', () => {
    for (const status of ['neu', 'falsch', 'abgeschlossen'] as const) {
      assert.equal(istWiederholungFaellig(faellig({ status }), JETZT), false);
    }
  });

  it('ist fällig, wenn die Wartezeit abgelaufen ist', () => {
    const eintrag = faellig({
      status: 'einmal_richtig',
      naechsteFaelligkeit: '2026-01-14T11:59:59Z',
    });
    assert.equal(istWiederholungFaellig(eintrag, JETZT), true);
  });

  it('ist genau auf die Sekunde fällig', () => {
    const eintrag = faellig({
      status: 'einmal_richtig',
      naechsteFaelligkeit: '2026-01-14T12:00:00Z',
    });
    assert.equal(istWiederholungFaellig(eintrag, JETZT), true, 'die Grenze zählt als fällig');
  });

  it('ist noch nicht fällig, wenn die Wartezeit läuft', () => {
    const eintrag = faellig({
      status: 'einmal_richtig',
      naechsteFaelligkeit: '2026-01-14T12:00:01Z',
    });
    assert.equal(istWiederholungFaellig(eintrag, JETZT), false);
  });

  it('gilt ohne Datum als sofort fällig', () => {
    const eintrag = faellig({ status: 'einmal_richtig', naechsteFaelligkeit: null });
    assert.equal(istWiederholungFaellig(eintrag, JETZT), true);
  });

  it('gilt bei unlesbarem Datum als fällig statt für immer zu warten', () => {
    const eintrag = faellig({ status: 'einmal_richtig', naechsteFaelligkeit: 'kaputt' });
    assert.equal(istWiederholungFaellig(eintrag, JETZT), true);
  });
});

describe('faelligkeitsUebersicht', () => {
  it('trennt Fehler, neue Fragen und Wiederholungen', () => {
    const uebersicht = faelligkeitsUebersicht(
      [
        faellig({ frageId: 'a', status: 'falsch' }),
        faellig({ frageId: 'b', status: 'falsch' }),
        faellig({ frageId: 'c', status: 'neu' }),
        faellig({ frageId: 'd', status: 'einmal_richtig', naechsteFaelligkeit: '2026-01-13T00:00:00Z' }),
        faellig({ frageId: 'e', status: 'einmal_richtig', naechsteFaelligkeit: '2026-02-01T00:00:00Z' }),
        faellig({ frageId: 'f', status: 'abgeschlossen' }),
      ],
      JETZT,
    );
    assert.deepEqual(uebersicht, { falsch: 2, neu: 1, wiederholung: 1, gesamt: 4 });
  });

  it('ist bei leerer Eingabe überall 0', () => {
    assert.deepEqual(faelligkeitsUebersicht([], JETZT), {
      falsch: 0,
      neu: 0,
      wiederholung: 0,
      gesamt: 0,
    });
  });

  it('zählt abgeschlossene Fragen nie mit', () => {
    const nurFertig = [faellig({ status: 'abgeschlossen' }), faellig({ status: 'abgeschlossen' })];
    assert.equal(faelligkeitsUebersicht(nurFertig, JETZT).gesamt, 0);
  });

  it('gibt bei jedem Aufruf ein eigenes Objekt zurück', () => {
    // Sonst würde ein Aufrufer, der das Ergebnis verändert, alle anderen
    // Aufrufer mit verändern.
    const a = faelligkeitsUebersicht([], JETZT);
    a.gesamt = 99;
    assert.equal(faelligkeitsUebersicht([], JETZT).gesamt, 0);
  });
});

describe('fehlerFrageIds', () => {
  it('liefert nur die Fehler, in Eingabereihenfolge', () => {
    const ids = fehlerFrageIds([
      faellig({ frageId: 'a', status: 'falsch' }),
      faellig({ frageId: 'b', status: 'neu' }),
      faellig({ frageId: 'c', status: 'falsch' }),
    ]);
    assert.deepEqual(ids, ['a', 'c']);
  });

  it('ist leer, wenn es keine Fehler gibt', () => {
    assert.deepEqual(fehlerFrageIds([faellig({ status: 'neu' })]), []);
    assert.deepEqual(fehlerFrageIds([]), []);
  });
});

describe('naechsteFaelligkeit', () => {
  it('ist null, solange etwas fällig ist', () => {
    const mitFaelligem = [faellig({ status: 'falsch' })];
    assert.equal(naechsteFaelligkeit(mitFaelligem, JETZT), null);
  });

  it('liefert den frühesten kommenden Zeitpunkt', () => {
    const eintraege = [
      faellig({ frageId: 'a', status: 'einmal_richtig', naechsteFaelligkeit: '2026-02-01T00:00:00Z' }),
      faellig({ frageId: 'b', status: 'einmal_richtig', naechsteFaelligkeit: '2026-01-16T08:00:00Z' }),
      faellig({ frageId: 'c', status: 'abgeschlossen' }),
    ];
    const naechste = naechsteFaelligkeit(eintraege, JETZT);
    assert.equal(naechste?.toISOString(), '2026-01-16T08:00:00.000Z');
  });

  it('ist null, wenn nur abgeschlossene Fragen vorliegen', () => {
    assert.equal(naechsteFaelligkeit([faellig({ status: 'abgeschlossen' })], JETZT), null);
    assert.equal(naechsteFaelligkeit([], JETZT), null);
  });

  it('übergeht unlesbare Zeitstempel', () => {
    const eintraege = [
      faellig({ frageId: 'a', status: 'einmal_richtig', naechsteFaelligkeit: 'kaputt' }),
      faellig({ frageId: 'b', status: 'einmal_richtig', naechsteFaelligkeit: '2026-01-20T00:00:00Z' }),
    ];
    // Der kaputte Eintrag gilt als fällig — damit steht schon etwas an.
    assert.equal(naechsteFaelligkeit(eintraege, JETZT), null);
  });
});
