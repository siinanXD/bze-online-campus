/**
 * Anlässe: welche Benachrichtigung ist gerade überhaupt begründet?
 *
 * Jeder Anlass ist eine eigene kleine Funktion mit genau einer Frage. Das hält
 * die Regeln lesbar und erlaubt es, jede einzeln zu testen — auch die
 * Grenzfälle, in denen mehrere Anlässe gleichzeitig zutreffen.
 *
 * Die Reihenfolge in `ANLASS_RANG` entscheidet, welcher Anlass gewinnt, wenn das
 * Tagesbudget nur eine Nachricht zulässt.
 */

import { istAbendfenster } from './stille-zeiten';
import type { Anlass, Dringlichkeit, PlanungsEingabe } from './types';

/**
 * Rangfolge der Anlässe, wichtigster zuerst.
 *
 * Ein Ausbilder, der einen Nachweis zurückgewiesen hat, verlangt eine Handlung
 * mit Frist — das schlägt jede Lernerinnerung. Danach kommt, was heute
 * unwiederbringlich verloren geht (die Serie), dann der eigentliche Lernstoff,
 * zuletzt reine Hinweise.
 */
export const ANLASS_RANG: readonly Anlass[] = [
  'nachweis_entschieden',
  'serie_gefaehrdet',
  'faellige_wiederholung',
  'wochenpruefung_offen',
  'nachweis_luecke',
  'tagesziel_offen',
  'wochenbericht_bereit',
];

/** Dringlichkeit je Anlass für das Web-Push-Protokoll. */
export const ANLASS_DRINGLICHKEIT: Readonly<Record<Anlass, Dringlichkeit>> = {
  nachweis_entschieden: 'high',
  serie_gefaehrdet: 'normal',
  faellige_wiederholung: 'normal',
  wochenpruefung_offen: 'normal',
  nachweis_luecke: 'normal',
  tagesziel_offen: 'low',
  wochenbericht_bereit: 'low',
};

/** Ein Ausbilder hat entschieden — immer melden, unabhängig vom Zeitfenster. */
function entscheidungOffen(eingabe: PlanungsEingabe): boolean {
  return eingabe.offeneEntscheidungen > 0;
}

/**
 * Die Serie kann heute reißen.
 *
 * Nur im Abendfenster, denn morgens ist der Hinweis verfrüht: der Tag hat noch
 * zwölf Stunden, und eine Erinnerung an eine noch gar nicht bedrohte Serie
 * wirkt wie Gängelung.
 */
function serieZuRetten(eingabe: PlanungsEingabe, jetzt: Date): boolean {
  if (eingabe.serienStatus !== 'gefaehrdet') return false;
  if (eingabe.serienLaenge < 2) return false;
  return istAbendfenster(eingabe.einstellungen, jetzt);
}

/**
 * Es stehen Fragen zur Wiederholung an.
 *
 * Die Schwelle von drei Fragen ist Absicht: für eine einzige fällige Frage
 * lohnt keine Benachrichtigung, und wer sie doch bekäme, würde beim nächsten Mal
 * nicht mehr hinsehen.
 */
function wiederholungLohnt(eingabe: PlanungsEingabe): boolean {
  return eingabe.faelligGesamt >= 3;
}

/** Die Wochenprüfung der laufenden Woche fehlt noch. */
function wochenpruefungFehlt(eingabe: PlanungsEingabe): boolean {
  return eingabe.wochenpruefungOffen;
}

/** Mindestens ein Ausbildungsnachweis einer vergangenen Woche fehlt. */
function nachweisFehlt(eingabe: PlanungsEingabe): boolean {
  return eingabe.nachweisLuecken > 0;
}

/**
 * Das Tagesziel ist noch offen und heute war schon Aktivität.
 *
 * Bedingt bewusst eine aktive Serie: wer heute noch nichts getan hat, bekommt
 * den Serien-Hinweis, nicht zusätzlich den Tagesziel-Hinweis. Und wer nur noch
 * eine Frage vor dem Ziel steht, wird nicht mehr gestört.
 */
function tageszielFastGeschafft(eingabe: PlanungsEingabe, jetzt: Date): boolean {
  if (eingabe.serienStatus !== 'aktiv') return false;
  if (eingabe.tageszielOffen <= 0 || eingabe.tageszielOffen > 5) return false;
  return istAbendfenster(eingabe.einstellungen, jetzt);
}

/** Ein ungelesener Wochenbericht liegt vor. */
function wochenberichtUngelesen(eingabe: PlanungsEingabe): boolean {
  return eingabe.wochenberichtBereit;
}

/** Prüffunktion je Anlass — eine Stelle, an der neue Anlässe angemeldet werden. */
const PRUEFUNGEN: Readonly<Record<Anlass, (e: PlanungsEingabe, jetzt: Date) => boolean>> = {
  nachweis_entschieden: entscheidungOffen,
  serie_gefaehrdet: serieZuRetten,
  faellige_wiederholung: wiederholungLohnt,
  wochenpruefung_offen: wochenpruefungFehlt,
  nachweis_luecke: nachweisFehlt,
  tagesziel_offen: tageszielFastGeschafft,
  wochenbericht_bereit: wochenberichtUngelesen,
};

/**
 * Alle sachlich begründeten Anlässe, in Rangfolge.
 *
 * Berücksichtigt noch keine Einstellungen, keine stillen Zeiten und kein
 * Budget — das ist Aufgabe von `planung`. Diese Funktion beantwortet nur:
 * „Was wäre jetzt überhaupt zu melden?"
 */
export function begruendeteAnlaesse(
  eingabe: PlanungsEingabe,
  jetzt: Date = new Date(),
): Anlass[] {
  return ANLASS_RANG.filter((anlass) => PRUEFUNGEN[anlass](eingabe, jetzt));
}
