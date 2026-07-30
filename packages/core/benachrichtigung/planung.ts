/**
 * Planung: die eine Funktion, die der Versender aufruft.
 *
 * Führt die vier Filterstufen in fester Reihenfolge zusammen. Die Reihenfolge
 * ist wichtig — der Grundschalter kommt vor allem anderen, das Budget zuletzt,
 * damit ein knappes Budget an die wichtigsten Anlässe geht und nicht an den
 * ersten, der zufällig geprüft wurde.
 */

import { anlassErlaubt, pauseAbgelaufen, verbleibendesBudget } from './deckel';
import { begruendeteAnlaesse } from './anlaesse';
import { baueNutzlast } from './nutzlast';
import { istStilleZeit } from './stille-zeiten';
import type { GeplanteBenachrichtigung, PlanungsEingabe } from './types';

/**
 * Plant die jetzt zu sendenden Benachrichtigungen für eine Person.
 *
 * Gibt eine leere Liste zurück, wenn nichts zu senden ist — der Normalfall.
 * Ein leeres Ergebnis ist niemals ein Fehler.
 *
 * Stufen:
 *  1. Grundschalter aus — nichts senden.
 *  2. Stille Zeit — nichts senden (nicht aufschieben, siehe `stille-zeiten`).
 *  3. Je Anlass: abgewählt? Mindestpause noch offen?
 *  4. Auf das verbleibende Tagesbudget kürzen, in Rangfolge.
 */
export function planeBenachrichtigungen(
  eingabe: PlanungsEingabe,
  jetzt: Date = new Date(),
): GeplanteBenachrichtigung[] {
  const { einstellungen } = eingabe;

  if (!einstellungen.aktiv) return [];

  const budget = verbleibendesBudget(eingabe.protokoll, einstellungen, jetzt);
  if (budget <= 0) return [];

  // Ausbilder-Entscheidungen sind Ereignisse und dürfen auch nachts zugestellt
  // werden — alles andere wartet auf ein waches Zeitfenster.
  const still = istStilleZeit(einstellungen, jetzt);

  const zulaessig = begruendeteAnlaesse(eingabe, jetzt).filter((anlass) => {
    if (still && anlass !== 'nachweis_entschieden') return false;
    if (!anlassErlaubt(anlass, einstellungen)) return false;
    return pauseAbgelaufen(anlass, eingabe.protokoll, jetzt);
  });

  return zulaessig.slice(0, budget).map((anlass) => baueNutzlast(anlass, eingabe));
}

/**
 * Bequemer Einzelfall: die eine wichtigste Benachrichtigung oder `null`.
 *
 * Für Aufrufer, die pro Durchlauf höchstens eine Meldung senden wollen.
 */
export function wichtigsteBenachrichtigung(
  eingabe: PlanungsEingabe,
  jetzt: Date = new Date(),
): GeplanteBenachrichtigung | null {
  return planeBenachrichtigungen(eingabe, jetzt)[0] ?? null;
}
