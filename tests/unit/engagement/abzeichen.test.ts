/**
 * Abzeichen.
 *
 * `neueAbzeichen` ist die fachlich wichtigste Funktion: sie entscheidet, was im
 * Fragen-Runner gefeiert wird. Ein Fehler dort zeigt entweder nichts an oder
 * feiert bei jeder Antwort alles erneut.
 */

import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import {
  ABZEICHEN_REGELN,
  abzeichenPunkte,
  bewerteAbzeichen,
  bewerteAlleAbzeichen,
  neueAbzeichen,
  vollstaendigeKennzahlen,
} from '@bze/core/engagement';
import type { AbzeichenRegel } from '@bze/core/engagement';
import { kennzahlen } from '../../helpers/fabriken';

const SERIE3: AbzeichenRegel = { code: 'serie3', kennzahl: 'serie', schwelle: 3, punkte: 10 };

describe('bewerteAbzeichen', () => {
  it('ist bei genau der Schwelle erreicht', () => {
    const stand = bewerteAbzeichen(SERIE3, kennzahlen({ serie: 3 }));
    assert.equal(stand.erreicht, true);
    assert.equal(stand.anteil, 1);
    assert.equal(stand.rest, 0);
  });

  it('rechnet den Fortschritt darunter', () => {
    const stand = bewerteAbzeichen(SERIE3, kennzahlen({ serie: 2 }));
    assert.equal(stand.erreicht, false);
    assert.ok(Math.abs(stand.anteil - 2 / 3) < 1e-9);
    assert.equal(stand.rest, 1);
  });

  it('deckelt den Anteil bei Übererfüllung', () => {
    const stand = bewerteAbzeichen(SERIE3, kennzahlen({ serie: 99 }));
    assert.equal(stand.anteil, 1);
    assert.equal(stand.rest, 0);
  });

  it('behandelt fehlende Kennzahlen als 0', () => {
    const stand = bewerteAbzeichen(SERIE3, {});
    assert.equal(stand.erreicht, false);
    assert.equal(stand.anteil, 0);
    assert.equal(stand.rest, 3);
  });

  it('behandelt negative und unbrauchbare Kennzahlen als 0', () => {
    assert.equal(bewerteAbzeichen(SERIE3, { serie: -5 }).anteil, 0);
    assert.equal(bewerteAbzeichen(SERIE3, { serie: NaN }).anteil, 0);
    assert.equal(bewerteAbzeichen(SERIE3, { serie: Infinity }).anteil, 0);
  });

  it('liest eine Schwelle von 0 als 1, statt durch Null zu teilen', () => {
    const kaputt: AbzeichenRegel = { ...SERIE3, schwelle: 0 };
    const ohne = bewerteAbzeichen(kaputt, kennzahlen({ serie: 0 }));
    assert.equal(ohne.erreicht, false, 'ein Abzeichen für nichts wäre sinnlos');
    assert.ok(Number.isFinite(ohne.anteil));
    assert.equal(bewerteAbzeichen(kaputt, kennzahlen({ serie: 1 })).erreicht, true);
  });
});

describe('bewerteAlleAbzeichen', () => {
  it('sortiert erreichte nach vorn, dann die nächstliegenden', () => {
    const staende = bewerteAlleAbzeichen(kennzahlen({ serie: 7, kernfragen: 40 }));
    const erreicht = staende.filter((s) => s.erreicht).map((s) => s.code);
    assert.deepEqual(erreicht.slice(0, 2), ['serie3', 'serie7']);

    const offen = staende.filter((s) => !s.erreicht);
    for (let i = 1; i < offen.length; i += 1) {
      assert.ok(
        offen[i - 1]!.anteil >= offen[i]!.anteil,
        'offene Abzeichen müssen nach Nähe zum Ziel sortiert sein',
      );
    }
  });

  it('bewertet ohne Kennzahlen alle als offen', () => {
    const staende = bewerteAlleAbzeichen({});
    assert.equal(staende.length, ABZEICHEN_REGELN.length);
    assert.equal(staende.every((s) => !s.erreicht), true);
  });

  it('nimmt ein eigenes Regelwerk an', () => {
    const staende = bewerteAlleAbzeichen(kennzahlen({ serie: 3 }), [SERIE3]);
    assert.equal(staende.length, 1);
    assert.equal(staende[0]!.erreicht, true);
  });

  it('verträgt ein leeres Regelwerk', () => {
    assert.deepEqual(bewerteAlleAbzeichen(kennzahlen({ serie: 3 }), []), []);
  });
});

describe('abzeichenPunkte', () => {
  it('summiert nur erreichte Abzeichen', () => {
    const staende = bewerteAlleAbzeichen(kennzahlen({ serie: 3 }));
    assert.equal(abzeichenPunkte(staende), 10);
  });

  it('ist 0 ohne erreichte Abzeichen', () => {
    assert.equal(abzeichenPunkte(bewerteAlleAbzeichen({})), 0);
    assert.equal(abzeichenPunkte([]), 0);
  });

  it('summiert über mehrere Kennzahlen hinweg', () => {
    // serie3 (10) + serie7 (25) + thema1 (15) + pruefung1 (15) = 65
    const staende = bewerteAlleAbzeichen(
      kennzahlen({ serie: 7, themen: 1, wochenpruefungen: 1 }),
    );
    assert.equal(abzeichenPunkte(staende), 65);
  });
});

describe('neueAbzeichen', () => {
  it('meldet nur das, was durch den letzten Schritt gekippt ist', () => {
    const neu = neueAbzeichen(kennzahlen({ serie: 2 }), kennzahlen({ serie: 3 }));
    assert.deepEqual(neu.map((s) => s.code), ['serie3']);
  });

  it('meldet nichts, wenn sich nichts geändert hat', () => {
    assert.deepEqual(neueAbzeichen(kennzahlen({ serie: 3 }), kennzahlen({ serie: 3 })), []);
  });

  it('meldet ein vorher schon erreichtes Abzeichen nicht erneut', () => {
    // serie3 war bei 3 Tagen schon erreicht; bei 9 Tagen ist nur serie7 neu.
    // Ohne diese Regel würde bei jeder weiteren Antwort erneut gefeiert.
    const neu = neueAbzeichen(kennzahlen({ serie: 3 }), kennzahlen({ serie: 9 }));
    assert.deepEqual(neu.map((s) => s.code), ['serie7']);
  });

  it('meldet mehrere Abzeichen, wenn ein Schritt zwei Schwellen reißt', () => {
    const neu = neueAbzeichen(kennzahlen({ serie: 0 }), kennzahlen({ serie: 7 }));
    assert.deepEqual(neu.map((s) => s.code).sort(), ['serie3', 'serie7']);
  });

  it('meldet nichts bei einem Rückschritt', () => {
    // Eine gerissene Serie nimmt das Abzeichen nicht weg, feiert es aber auch nicht.
    assert.deepEqual(neueAbzeichen(kennzahlen({ serie: 7 }), kennzahlen({ serie: 0 })), []);
  });

  it('meldet über verschiedene Kennzahlen hinweg', () => {
    const neu = neueAbzeichen(
      kennzahlen({ serie: 3, themen: 0 }),
      kennzahlen({ serie: 3, themen: 1 }),
    );
    assert.deepEqual(neu.map((s) => s.code), ['thema1']);
  });
});

describe('vollstaendigeKennzahlen', () => {
  it('füllt fehlende Felder mit 0 auf', () => {
    assert.deepEqual(vollstaendigeKennzahlen({ serie: 4 }), {
      serie: 4,
      kernfragen: 0,
      wochenpruefungen: 0,
      nachweise: 0,
      themen: 0,
    });
  });
});

describe('ABZEICHEN_REGELN', () => {
  it('hat eindeutige Codes', () => {
    const codes = ABZEICHEN_REGELN.map((r) => r.code);
    assert.equal(new Set(codes).size, codes.length);
  });

  it('hat durchweg sinnvolle Schwellen und Punkte', () => {
    for (const regel of ABZEICHEN_REGELN) {
      assert.ok(regel.schwelle >= 1, `${regel.code}: Schwelle muss mindestens 1 sein`);
      assert.ok(regel.punkte > 0, `${regel.code}: Punkte müssen positiv sein`);
    }
  });
});
