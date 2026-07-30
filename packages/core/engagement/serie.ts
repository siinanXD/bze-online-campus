/**
 * Lernserie: an wie vielen Kalendertagen in Folge gelernt wurde.
 *
 * Bewusste Entscheidung gegen die verbreitete harte Regel „heute nichts gelernt,
 * Serie weg". Solange der heutige Tag noch läuft, gilt eine gestern bestätigte
 * Serie als `gefaehrdet`, nicht als gerissen. Genau dieser Zustand ist der
 * Anlass für die Erinnerung am Abend (siehe `benachrichtigung/anlaesse`).
 */

import { tageDazwischen, vortag } from './kalender';
import type { Kalendertag, Serie, SerienStatus } from './types';

/**
 * Entfernt Duplikate und sortiert absteigend (jüngster Tag zuerst).
 *
 * Aufrufer liefern Aktivitätstage oft mehrfach (eine Zeile je beantworteter
 * Frage), deshalb wird hier verdichtet statt beim Aufrufer.
 */
function absteigendEindeutig(tage: readonly Kalendertag[]): Kalendertag[] {
  return [...new Set(tage)].sort().reverse();
}

/**
 * Zählt Tage in Folge ab `start` rückwärts.
 *
 * `start` selbst muss in `vorhanden` enthalten sein, sonst ist das Ergebnis 0.
 */
function serieAb(vorhanden: ReadonlySet<Kalendertag>, start: Kalendertag): number {
  let laenge = 0;
  let tag = start;
  while (vorhanden.has(tag)) {
    laenge += 1;
    tag = vortag(tag);
  }
  return laenge;
}

/**
 * Längste Serie über den gesamten Verlauf — die Bestmarke.
 *
 * Läuft die absteigend sortierte Liste einmal durch und zählt Abschnitte
 * lückenlos aufeinanderfolgender Tage.
 */
export function bestmarke(tage: readonly Kalendertag[]): number {
  const sortiert = absteigendEindeutig(tage);
  if (sortiert.length === 0) return 0;

  let beste = 1;
  let laufend = 1;
  for (let i = 1; i < sortiert.length; i += 1) {
    // Absteigend sortiert: der Vorgänger liegt einen Tag später.
    const lueckenlos = tageDazwischen(sortiert[i]!, sortiert[i - 1]!) === 1;
    laufend = lueckenlos ? laufend + 1 : 1;
    if (laufend > beste) beste = laufend;
  }
  return beste;
}

/**
 * Bewertet die Serie einer lernenden Person zum Stichtag `heute`.
 *
 * - Heute gelernt → `aktiv`, Serie zählt ab heute.
 * - Gestern gelernt, heute noch nicht → `gefaehrdet`, Serie zählt ab gestern.
 * - Länger nichts → `gerissen`, Länge 0. Die Bestmarke bleibt erhalten.
 *
 * Tage in der Zukunft werden ignoriert; sie können nur aus falsch gesetzten
 * Uhren oder Zeitzonenfehlern stammen und dürfen keine Serie vortäuschen.
 */
export function bewerteSerie(
  aktivitaetstage: readonly Kalendertag[],
  heute: Kalendertag,
): Serie {
  const vergangen = aktivitaetstage.filter((tag) => tag <= heute);
  const vorhanden = new Set(vergangen);
  const letzterTag = absteigendEindeutig(vergangen)[0] ?? null;
  const marke = bestmarke(vergangen);

  if (vorhanden.has(heute)) {
    return { laenge: serieAb(vorhanden, heute), bestmarke: marke, status: 'aktiv', letzterTag };
  }

  const gestern = vortag(heute);
  if (vorhanden.has(gestern)) {
    const laenge = serieAb(vorhanden, gestern);
    return { laenge, bestmarke: marke, status: 'gefaehrdet', letzterTag };
  }

  const status: SerienStatus = 'gerissen';
  return { laenge: 0, bestmarke: marke, status, letzterTag };
}

/**
 * Setzt die Serie eine Bestmarke, wenn heute gelernt wird?
 *
 * Trennt bewusst „gleichauf" von „neuer Rekord": ein Hinweis lohnt schon beim
 * Einholen der Bestmarke, das Feiern erst beim Überbieten.
 */
export function schlaegtBestmarke(serie: Serie): boolean {
  return serie.status === 'aktiv' && serie.laenge > 0 && serie.laenge >= serie.bestmarke;
}
