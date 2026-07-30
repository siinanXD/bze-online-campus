/**
 * Fälligkeiten: welche Fragen jetzt zur Wiederholung anstehen.
 *
 * Bislang wusste nur die Lernqueue davon (`mastery/auswahl`). Die Zahlen werden
 * aber an zwei weiteren Stellen gebraucht: auf der Startseite („8 Fehler
 * wiederholen") und im Push-Versender („heute sind 12 Fragen fällig"). Diese
 * Auswertung liegt deshalb hier, unabhängig von der Reihenfolge im Lernmodus.
 */

import type { FaelligkeitsEintrag, FaelligkeitsUebersicht } from './types.ts';

const LEER: FaelligkeitsUebersicht = { falsch: 0, neu: 0, wiederholung: 0, gesamt: 0 };

/**
 * Ist ein `einmal_richtig`-Eintrag wieder fällig?
 *
 * Ohne gesetzte Fälligkeit gilt der Eintrag als sofort fällig — das entspricht
 * dem Verhalten der Lernqueue und verhindert, dass Fragen ohne Spacing-Datum
 * unsichtbar hängen bleiben. Ein unlesbares Datum wird ebenso als fällig
 * behandelt: eine Frage zu früh zu zeigen ist harmloser, als sie zu verlieren.
 */
export function istWiederholungFaellig(
  eintrag: FaelligkeitsEintrag,
  jetzt: Date = new Date(),
): boolean {
  if (eintrag.status !== 'einmal_richtig') return false;
  if (!eintrag.naechsteFaelligkeit) return true;
  const faellig = new Date(eintrag.naechsteFaelligkeit).getTime();
  if (Number.isNaN(faellig)) return true;
  return faellig <= jetzt.getTime();
}

/**
 * Zählt fällige Fragen nach Anlass getrennt.
 *
 * Die Trennung ist wichtig für die Ansprache: „4 Fehler von letzter Woche"
 * wiegt schwerer als „4 neue Fragen" und verdient einen anderen Text.
 */
export function faelligkeitsUebersicht(
  eintraege: readonly FaelligkeitsEintrag[],
  jetzt: Date = new Date(),
): FaelligkeitsUebersicht {
  if (eintraege.length === 0) return { ...LEER };

  let falsch = 0;
  let neu = 0;
  let wiederholung = 0;

  for (const eintrag of eintraege) {
    if (eintrag.status === 'falsch') falsch += 1;
    else if (eintrag.status === 'neu') neu += 1;
    else if (istWiederholungFaellig(eintrag, jetzt)) wiederholung += 1;
  }

  return { falsch, neu, wiederholung, gesamt: falsch + neu + wiederholung };
}

/**
 * Ids der Fragen, die als Fehler-Wiedervorlage angeboten werden.
 *
 * Nur der Status `falsch` — bewusst ohne neue Fragen, damit der Einstieg
 * „Fehler wiederholen" hält, was er verspricht.
 */
export function fehlerFrageIds(eintraege: readonly FaelligkeitsEintrag[]): string[] {
  return eintraege.filter((e) => e.status === 'falsch').map((e) => e.frageId);
}

/**
 * Wann ist die nächste Wiederholung fällig, wenn gerade keine ansteht?
 *
 * Gibt `null` zurück, sobald schon etwas fällig ist (dann gibt es nichts zu
 * warten) oder wenn überhaupt keine Wiederholung geplant ist.
 */
export function naechsteFaelligkeit(
  eintraege: readonly FaelligkeitsEintrag[],
  jetzt: Date = new Date(),
): Date | null {
  if (faelligkeitsUebersicht(eintraege, jetzt).gesamt > 0) return null;

  const kommende = eintraege
    .filter((e) => e.status === 'einmal_richtig' && e.naechsteFaelligkeit)
    .map((e) => new Date(e.naechsteFaelligkeit!).getTime())
    .filter((zeit) => !Number.isNaN(zeit) && zeit > jetzt.getTime())
    .sort((a, b) => a - b);

  return kommende.length > 0 ? new Date(kommende[0]!) : null;
}
