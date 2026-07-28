import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import {
  berufFortschrittProzent,
  fachkundeFertig,
  fortsetzenEmpfehlung,
  phaseFertig,
  topicFertig,
} from './kaskade';
import type { BereichMeta, KernStand, LerneinheitStand, ThemaMeta } from './types';

function kern(themaId: string, gesamt: number, fertig: number): KernStand {
  return { themaId, kernGesamt: gesamt, kernFertig: fertig };
}

describe('topicFertig', () => {
  it('braucht alle Kernfragen und gelesene Fachkunde', () => {
    const les: LerneinheitStand[] = [
      { themaId: 't1', lerneinheitId: 'l1', abschnitteGesamt: 2, abschnitteGelesen: 2 },
    ];
    assert.equal(topicFertig(kern('t1', 3, 3), les), true);
    assert.equal(topicFertig(kern('t1', 3, 2), les), false);
    assert.equal(
      topicFertig(kern('t1', 3, 3), [
        { themaId: 't1', lerneinheitId: 'l1', abschnitteGesamt: 2, abschnitteGelesen: 1 },
      ]),
      false,
    );
  });

  it('ohne Lerneinheiten zählt Fachkunde als erledigt', () => {
    assert.equal(fachkundeFertig([]), true);
    assert.equal(topicFertig(kern('t1', 1, 1), []), true);
  });
});

describe('phaseFertig', () => {
  const themen: ThemaMeta[] = [
    { id: 't1', bezeichnung: 'A', bereichId: 'b1', reihenfolge: 1 },
  ];
  const bereiche: BereichMeta[] = [
    { id: 'b1', bezeichnung: 'B', phaseId: 'p1', reihenfolge: 1 },
  ];
  const themenJe = new Map([['b1', themen]]);
  const kernJe = new Map([['t1', kern('t1', 2, 2)]]);
  const lesJe = new Map<string, LerneinheitStand[]>([['t1', []]]);

  it('erfordert Mindest-Wochenprüfungen mit ≥ 50 Punkten', () => {
    assert.equal(
      phaseFertig(bereiche, themenJe, kernJe, lesJe, [{ gesamtpunkte: 60, bestanden: true }], 1),
      true,
    );
    assert.equal(
      phaseFertig(bereiche, themenJe, kernJe, lesJe, [{ gesamtpunkte: 40, bestanden: false }], 1),
      false,
    );
    assert.equal(
      phaseFertig(bereiche, themenJe, kernJe, lesJe, [{ gesamtpunkte: 60, bestanden: true }], 2),
      false,
    );
  });
});

describe('fortsetzenEmpfehlung', () => {
  const themen: ThemaMeta[] = [
    { id: 't1', bezeichnung: 'Eins', bereichId: 'b1', reihenfolge: 1 },
    { id: 't2', bezeichnung: 'Zwei', bereichId: 'b1', reihenfolge: 2 },
  ];

  it('liefert genau ein Topic mit offenen Kernfragen', () => {
    const kernJe = new Map([
      ['t1', kern('t1', 4, 4)],
      ['t2', kern('t2', 4, 1)],
    ]);
    const emp = fortsetzenEmpfehlung(themen, kernJe, new Map());
    assert.ok(emp);
    assert.equal(emp!.themaId, 't2');
    assert.equal(emp!.grund, 'kernfragen');
    assert.equal(emp!.kernOffen, 3);
  });

  it('bevorzugt ungelesene Fachkunde wenn Kern fertig', () => {
    const kernJe = new Map([
      ['t1', kern('t1', 2, 2)],
      ['t2', kern('t2', 2, 2)],
    ]);
    const lesJe = new Map<string, LerneinheitStand[]>([
      ['t1', [{ themaId: 't1', lerneinheitId: 'l1', abschnitteGesamt: 1, abschnitteGelesen: 1 }]],
      ['t2', [{ themaId: 't2', lerneinheitId: 'l2', abschnitteGesamt: 1, abschnitteGelesen: 0 }]],
    ]);
    const emp = fortsetzenEmpfehlung(themen, kernJe, lesJe);
    assert.equal(emp?.themaId, 't2');
    assert.equal(emp?.grund, 'fachkunde');
  });
});

describe('berufFortschrittProzent', () => {
  it('rechnet nur über Kernfragen', () => {
    const m = new Map([
      ['t1', kern('t1', 2, 1)],
      ['t2', kern('t2', 2, 2)],
    ]);
    assert.equal(berufFortschrittProzent(m), 75);
  });
});
