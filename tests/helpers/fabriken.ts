/**
 * Fabriken für Testdaten.
 *
 * Jede Fabrik liefert einen gültigen Standardfall und nimmt Abweichungen als
 * Teilobjekt. Ein Test soll nur das nennen, worum es ihm geht — alles andere
 * kommt aus dem Standard. Das hält die Tests kurz und macht die Absicht jedes
 * Tests an seinen Abweichungen ablesbar.
 */

import type {
  FaelligkeitsEintrag,
  Kennzahlen,
} from '@bze/core/engagement';
import type {
  Anlass,
  PlanungsEingabe,
  ProtokollEintrag,
  PushAbo,
  PushEinstellungen,
} from '@bze/core/benachrichtigung';

/** Push-Einstellungen: aktiv, Berlin, still 21–7 Uhr, zwei pro Tag. */
export function einstellungen(
  abweichung: Partial<PushEinstellungen> = {},
): PushEinstellungen {
  return {
    aktiv: true,
    zeitzone: 'Europe/Berlin',
    stillVon: 21,
    stillBis: 7,
    maxProTag: 2,
    abgewaehlt: [],
    ...abweichung,
  };
}

/** Planungseingabe ohne jeden Anlass — der ruhige Normalfall. */
export function planungsEingabe(
  abweichung: Partial<PlanungsEingabe> = {},
): PlanungsEingabe {
  return {
    userId: 'nutzer-1',
    einstellungen: einstellungen(abweichung.einstellungen),
    protokoll: [],
    faelligGesamt: 0,
    faelligFalsch: 0,
    serienStatus: 'aktiv',
    serienLaenge: 0,
    tageszielOffen: 0,
    wochenpruefungOffen: false,
    nachweisLuecken: 0,
    offeneEntscheidungen: 0,
    wochenberichtBereit: false,
    ...abweichung,
  };
}

/** Ein Protokolleintrag für Deckel- und Pausentests. */
export function protokoll(
  anlass: Anlass,
  gesendetAm: string,
  tag: string,
): ProtokollEintrag {
  return { anlass, gesendetAm, tag };
}

/** Ein Push-Abo mit sprechender Kennung. */
export function abo(abweichung: Partial<PushAbo> = {}): PushAbo {
  return {
    id: 'abo-1',
    userId: 'nutzer-1',
    endpoint: 'https://push.example/abo-1',
    zuletztGesendetAm: null,
    fehlversuche: 0,
    ...abweichung,
  };
}

/** Ein Mastery-Stand für die Fälligkeitsrechnung. */
export function faellig(
  abweichung: Partial<FaelligkeitsEintrag> = {},
): FaelligkeitsEintrag {
  return {
    frageId: 'frage-1',
    status: 'neu',
    naechsteFaelligkeit: null,
    ...abweichung,
  };
}

/** Kennzahlen mit allen Werten auf 0. */
export function kennzahlen(abweichung: Partial<Kennzahlen> = {}): Kennzahlen {
  return {
    serie: 0,
    kernfragen: 0,
    wochenpruefungen: 0,
    nachweise: 0,
    themen: 0,
    ...abweichung,
  };
}

/**
 * Baut eine Folge zusammenhängender Kalendertage, jüngster zuerst.
 *
 * `tageFolge('2026-01-14', 3)` liefert 14., 13. und 12. Januar.
 */
export function tageFolge(letzterTag: string, anzahl: number): string[] {
  const [jahr, monat, tag] = letzterTag.split('-').map(Number);
  const tage: string[] = [];
  for (let i = 0; i < anzahl; i += 1) {
    const d = new Date(Date.UTC(jahr!, monat! - 1, tag! - i));
    tage.push(d.toISOString().slice(0, 10));
  }
  return tage;
}
