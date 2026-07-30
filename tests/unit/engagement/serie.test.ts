/**
 * Lernserie.
 *
 * Wichtigster Fall ist `gefaehrdet`: gestern gelernt, heute noch nicht. Genau
 * dieser Zustand löst später die Abenderinnerung aus, und genau hier ist die
 * verbreitete Umsetzung falsch — sie setzt die Serie schon um Mitternacht auf 0.
 */

import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { bestmarke, bewerteSerie, schlaegtBestmarke } from '@bze/core/engagement';
import { tageFolge } from '../../helpers/fabriken';

describe('bewerteSerie — Status', () => {
  it('heute gelernt heißt aktiv', () => {
    const serie = bewerteSerie(tageFolge('2026-01-14', 3), '2026-01-14');
    assert.equal(serie.status, 'aktiv');
    assert.equal(serie.laenge, 3);
    assert.equal(serie.letzterTag, '2026-01-14');
  });

  it('gestern gelernt, heute noch nicht heißt gefährdet — Serie bleibt stehen', () => {
    const serie = bewerteSerie(tageFolge('2026-01-13', 5), '2026-01-14');
    assert.equal(serie.status, 'gefaehrdet');
    assert.equal(serie.laenge, 5, 'die Serie darf am laufenden Tag nicht schon verloren sein');
  });

  it('zwei Tage Pause heißt gerissen', () => {
    const serie = bewerteSerie(tageFolge('2026-01-12', 9), '2026-01-14');
    assert.equal(serie.status, 'gerissen');
    assert.equal(serie.laenge, 0);
    assert.equal(serie.bestmarke, 9, 'die Bestmarke bleibt trotz Riss erhalten');
  });

  it('ohne jede Aktivität ist alles null', () => {
    const serie = bewerteSerie([], '2026-01-14');
    assert.deepEqual(serie, { laenge: 0, bestmarke: 0, status: 'gerissen', letzterTag: null });
  });
});

describe('bewerteSerie — Länge', () => {
  it('zählt nur bis zur ersten Lücke', () => {
    const tage = ['2026-01-14', '2026-01-13', '2026-01-11', '2026-01-10'];
    assert.equal(bewerteSerie(tage, '2026-01-14').laenge, 2);
  });

  it('behandelt einen einzelnen Tag als Serie von 1', () => {
    assert.equal(bewerteSerie(['2026-01-14'], '2026-01-14').laenge, 1);
  });

  it('zählt doppelte Tage nur einmal', () => {
    const tage = ['2026-01-14', '2026-01-14', '2026-01-14', '2026-01-13'];
    assert.equal(bewerteSerie(tage, '2026-01-14').laenge, 2);
  });

  it('ist unabhängig von der Reihenfolge der Eingabe', () => {
    const tage = ['2026-01-12', '2026-01-14', '2026-01-13'];
    assert.equal(bewerteSerie(tage, '2026-01-14').laenge, 3);
  });

  it('läuft über Monats- und Jahresgrenzen', () => {
    const ueberJahr = ['2027-01-01', '2026-12-31', '2026-12-30'];
    assert.equal(bewerteSerie(ueberJahr, '2027-01-01').laenge, 3);
    const ueberMonat = ['2026-03-01', '2026-02-28', '2026-02-27'];
    assert.equal(bewerteSerie(ueberMonat, '2026-03-01').laenge, 3);
  });

  it('läuft über den Schalttag', () => {
    const tage = ['2028-03-01', '2028-02-29', '2028-02-28'];
    assert.equal(bewerteSerie(tage, '2028-03-01').laenge, 3);
  });

  it('läuft über den Sommerzeitwechsel', () => {
    // Der 29.03.2026 hat in Berlin nur 23 Stunden — die Serie darf nicht reißen.
    const tage = ['2026-03-30', '2026-03-29', '2026-03-28'];
    assert.equal(bewerteSerie(tage, '2026-03-30').laenge, 3);
  });
});

describe('bewerteSerie — Zukunftstage', () => {
  it('ignoriert Tage nach heute', () => {
    // Kann durch falsch gestellte Geräteuhr oder Zeitzonenfehler entstehen und
    // darf keine Serie vortäuschen.
    const tage = ['2026-01-20', '2026-01-19', '2026-01-14', '2026-01-13'];
    const serie = bewerteSerie(tage, '2026-01-14');
    assert.equal(serie.status, 'aktiv');
    assert.equal(serie.laenge, 2);
    assert.equal(serie.letzterTag, '2026-01-14');
  });

  it('meldet gerissen, wenn nur Zukunftstage vorliegen', () => {
    const serie = bewerteSerie(['2026-02-01'], '2026-01-14');
    assert.equal(serie.status, 'gerissen');
    assert.equal(serie.letzterTag, null);
  });
});

describe('bestmarke', () => {
  it('findet den längsten Abschnitt, auch wenn er in der Vergangenheit liegt', () => {
    const tage = [
      // Abschnitt von 4 Tagen im Dezember
      '2025-12-01', '2025-12-02', '2025-12-03', '2025-12-04',
      // Abschnitt von 2 Tagen im Januar
      '2026-01-13', '2026-01-14',
    ];
    assert.equal(bestmarke(tage), 4);
  });

  it('ist 0 ohne Tage und 1 bei einem Tag', () => {
    assert.equal(bestmarke([]), 0);
    assert.equal(bestmarke(['2026-01-14']), 1);
  });

  it('lässt sich von Duplikaten nicht erhöhen', () => {
    assert.equal(bestmarke(['2026-01-14', '2026-01-14', '2026-01-14']), 1);
  });

  it('erkennt einen einzigen langen Abschnitt', () => {
    assert.equal(bestmarke(tageFolge('2026-03-31', 40)), 40);
  });
});

describe('schlaegtBestmarke', () => {
  it('gilt beim Einholen und beim Überbieten', () => {
    assert.equal(schlaegtBestmarke({ laenge: 5, bestmarke: 5, status: 'aktiv', letzterTag: 'x' }), true);
    assert.equal(schlaegtBestmarke({ laenge: 6, bestmarke: 5, status: 'aktiv', letzterTag: 'x' }), true);
  });

  it('gilt nicht darunter und nicht bei ruhender Serie', () => {
    assert.equal(schlaegtBestmarke({ laenge: 4, bestmarke: 5, status: 'aktiv', letzterTag: 'x' }), false);
    assert.equal(schlaegtBestmarke({ laenge: 9, bestmarke: 5, status: 'gefaehrdet', letzterTag: 'x' }), false);
    assert.equal(schlaegtBestmarke({ laenge: 0, bestmarke: 0, status: 'gerissen', letzterTag: null }), false);
  });
});
