/**
 * Planung — das Zusammenspiel aller Filterstufen.
 *
 * Hier wird geprüft, was der Versender am Ende tatsächlich sendet. Der wichtigste
 * Test ist der letzte Abschnitt: bei knappem Budget muss die Rangfolge gewinnen,
 * nicht die Prüfreihenfolge.
 */

import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import {
  ANLASS_RANG,
  begruendeteAnlaesse,
  planeBenachrichtigungen,
  wichtigsteBenachrichtigung,
} from '@bze/core/benachrichtigung';
import { einstellungen, planungsEingabe, protokoll } from '../../helpers/fabriken';
import { ZEITPUNKTE } from '../../helpers/zeit';

const ABEND = ZEITPUNKTE.winterAbend;
const MITTAG = ZEITPUNKTE.winterMittag;
const NACHT = ZEITPUNKTE.winterNacht;

describe('planeBenachrichtigungen — Grundschalter', () => {
  it('sendet nichts, wenn Push abgeschaltet ist', () => {
    const eingabe = planungsEingabe({
      einstellungen: einstellungen({ aktiv: false }),
      faelligGesamt: 20,
      offeneEntscheidungen: 3,
    });
    assert.deepEqual(planeBenachrichtigungen(eingabe, ABEND), []);
  });

  it('sendet nichts, wenn es nichts zu melden gibt', () => {
    assert.deepEqual(planeBenachrichtigungen(planungsEingabe(), ABEND), []);
  });
});

describe('planeBenachrichtigungen — stille Zeit', () => {
  it('hält Lernerinnerungen nachts zurück', () => {
    const eingabe = planungsEingabe({ faelligGesamt: 12, faelligFalsch: 4 });
    assert.deepEqual(planeBenachrichtigungen(eingabe, NACHT), []);
  });

  it('lässt Ausbilder-Entscheidungen auch nachts durch', () => {
    // Eine Zurückweisung mit Frist ist ein Ereignis, keine Erinnerung.
    const eingabe = planungsEingabe({ offeneEntscheidungen: 1 });
    const geplant = planeBenachrichtigungen(eingabe, NACHT);
    assert.equal(geplant.length, 1);
    assert.equal(geplant[0]!.anlass, 'nachweis_entschieden');
  });
});

describe('planeBenachrichtigungen — Abwahl und Pause', () => {
  it('achtet auf abgewählte Anlässe', () => {
    const eingabe = planungsEingabe({
      einstellungen: einstellungen({ abgewaehlt: ['faellige_wiederholung'] }),
      faelligGesamt: 12,
    });
    assert.deepEqual(planeBenachrichtigungen(eingabe, ABEND), []);
  });

  it('achtet auf die Mindestpause', () => {
    const eingabe = planungsEingabe({
      faelligGesamt: 12,
      protokoll: [protokoll('faellige_wiederholung', '2026-01-14T14:00:00Z', '2026-01-14')],
    });
    assert.deepEqual(planeBenachrichtigungen(eingabe, ABEND), []);
  });

  it('achtet auf das Tagesbudget', () => {
    const eingabe = planungsEingabe({
      faelligGesamt: 12,
      einstellungen: einstellungen({ maxProTag: 1 }),
      protokoll: [protokoll('serie_gefaehrdet', '2026-01-14T08:00:00Z', '2026-01-14')],
    });
    assert.deepEqual(planeBenachrichtigungen(eingabe, ABEND), []);
  });
});

describe('planeBenachrichtigungen — Rangfolge bei knappem Budget', () => {
  it('gibt das einzige Budget an den wichtigsten Anlass', () => {
    // Alle drei Anlässe treffen zu, aber nur eine Nachricht ist erlaubt.
    const eingabe = planungsEingabe({
      einstellungen: einstellungen({ maxProTag: 1 }),
      offeneEntscheidungen: 1,
      serienStatus: 'gefaehrdet',
      serienLaenge: 6,
      faelligGesamt: 20,
      faelligFalsch: 5,
    });
    const geplant = planeBenachrichtigungen(eingabe, ABEND);
    assert.equal(geplant.length, 1);
    assert.equal(geplant[0]!.anlass, 'nachweis_entschieden', 'die Entscheidung schlägt alles');
  });

  it('füllt zwei Plätze in Rangfolge', () => {
    const eingabe = planungsEingabe({
      einstellungen: einstellungen({ maxProTag: 2 }),
      serienStatus: 'gefaehrdet',
      serienLaenge: 6,
      faelligGesamt: 20,
      wochenpruefungOffen: true,
      nachweisLuecken: 2,
    });
    const anlaesse = planeBenachrichtigungen(eingabe, ABEND).map((b) => b.anlass);
    assert.deepEqual(anlaesse, ['serie_gefaehrdet', 'faellige_wiederholung']);
  });

  it('hält sich an die absolute Obergrenze', () => {
    const eingabe = planungsEingabe({
      einstellungen: einstellungen({ maxProTag: 99 }),
      offeneEntscheidungen: 1,
      serienStatus: 'gefaehrdet',
      serienLaenge: 6,
      faelligGesamt: 20,
      wochenpruefungOffen: true,
      nachweisLuecken: 2,
      wochenberichtBereit: true,
    });
    assert.ok(planeBenachrichtigungen(eingabe, ABEND).length <= 5);
  });
});

describe('planeBenachrichtigungen — Nutzlast', () => {
  it('liefert Schlüssel und Werte, nie fertige Sätze', () => {
    const eingabe = planungsEingabe({ faelligGesamt: 12, faelligFalsch: 4 });
    const [erste] = planeBenachrichtigungen(eingabe, ABEND);
    assert.ok(erste);
    assert.equal(erste.titelKey, 'push.faellige_wiederholung_fehler.titel');
    assert.deepEqual(erste.werte, { anzahl: 12, fehler: 4 });
    assert.equal(erste.pfad, '/campus/lernen');
    assert.equal(erste.tag, 'bze-faellige_wiederholung');
    assert.equal(erste.userId, 'nutzer-1');
  });

  it('wählt ohne frühere Fehler den neutralen Text', () => {
    const eingabe = planungsEingabe({ faelligGesamt: 12, faelligFalsch: 0 });
    const [erste] = planeBenachrichtigungen(eingabe, ABEND);
    assert.equal(erste!.titelKey, 'push.faellige_wiederholung.titel');
  });

  it('vergibt Ausbilder-Entscheidungen die hohe Dringlichkeit', () => {
    const eingabe = planungsEingabe({ offeneEntscheidungen: 1 });
    assert.equal(planeBenachrichtigungen(eingabe, ABEND)[0]!.dringlichkeit, 'high');
  });
});

describe('begruendeteAnlaesse — Schwellen', () => {
  it('meldet fällige Fragen erst ab drei', () => {
    assert.deepEqual(begruendeteAnlaesse(planungsEingabe({ faelligGesamt: 2 }), ABEND), []);
    assert.deepEqual(
      begruendeteAnlaesse(planungsEingabe({ faelligGesamt: 3 }), ABEND),
      ['faellige_wiederholung'],
    );
  });

  it('meldet die Serie nur am Abend', () => {
    const gefaehrdet = planungsEingabe({ serienStatus: 'gefaehrdet', serienLaenge: 4 });
    assert.deepEqual(begruendeteAnlaesse(gefaehrdet, MITTAG), [], 'mittags ist der Hinweis verfrüht');
    assert.deepEqual(begruendeteAnlaesse(gefaehrdet, ABEND), ['serie_gefaehrdet']);
  });

  it('meldet die Serie nicht bei Länge unter zwei', () => {
    // Ein einzelner Tag ist noch keine Serie, die man verlieren könnte.
    const kurz = planungsEingabe({ serienStatus: 'gefaehrdet', serienLaenge: 1 });
    assert.deepEqual(begruendeteAnlaesse(kurz, ABEND), []);
  });

  it('meldet die Serie nicht, wenn sie ohnehin gerissen ist', () => {
    const gerissen = planungsEingabe({ serienStatus: 'gerissen', serienLaenge: 0 });
    assert.deepEqual(begruendeteAnlaesse(gerissen, ABEND), []);
  });

  it('meldet das Tagesziel nur bei aktiver Serie und kleinem Rest', () => {
    const aktiv = (offen: number) =>
      planungsEingabe({ serienStatus: 'aktiv', tageszielOffen: offen });
    assert.deepEqual(begruendeteAnlaesse(aktiv(3), ABEND), ['tagesziel_offen']);
    assert.deepEqual(begruendeteAnlaesse(aktiv(9), ABEND), [], 'zu weit weg zum Anstoßen');
    assert.deepEqual(begruendeteAnlaesse(aktiv(0), ABEND), [], 'schon erreicht');
    const ohneAktivitaet = planungsEingabe({ serienStatus: 'gefaehrdet', tageszielOffen: 3 });
    assert.deepEqual(
      begruendeteAnlaesse(ohneAktivitaet, ABEND).includes('tagesziel_offen'),
      false,
      'wer heute noch nichts getat hat, bekommt den Serien-Hinweis',
    );
  });

  it('gibt die Anlässe in der Rangfolge zurück', () => {
    const alles = planungsEingabe({
      offeneEntscheidungen: 1,
      serienStatus: 'gefaehrdet',
      serienLaenge: 5,
      faelligGesamt: 9,
      wochenpruefungOffen: true,
      nachweisLuecken: 1,
      wochenberichtBereit: true,
    });
    const anlaesse = begruendeteAnlaesse(alles, ABEND);
    const raenge = anlaesse.map((a) => ANLASS_RANG.indexOf(a));
    assert.deepEqual([...raenge].sort((a, b) => a - b), raenge, 'nicht nach Rang sortiert');
  });
});

describe('wichtigsteBenachrichtigung', () => {
  it('liefert die erste geplante Nachricht', () => {
    const eingabe = planungsEingabe({ faelligGesamt: 12 });
    assert.equal(wichtigsteBenachrichtigung(eingabe, ABEND)?.anlass, 'faellige_wiederholung');
  });

  it('liefert null, wenn nichts ansteht', () => {
    assert.equal(wichtigsteBenachrichtigung(planungsEingabe(), ABEND), null);
  });
});
