/**
 * Tagesziel: eine kleine, an einem Tag erreichbare Menge Fragen.
 *
 * Das Ziel ist absichtlich niedrig angesetzt. Ein Ziel, das an einem
 * Berufsschultag nicht zu schaffen ist, wird nicht zum Antrieb, sondern zum
 * Grund, die App gar nicht erst zu öffnen.
 */

import { endlicheZahl } from '../werte/zahl';
import type { TageszielStand } from './types';

/** Voreinstellung, wenn niemand ein eigenes Ziel gesetzt hat. */
export const STANDARD_TAGESZIEL = 10;

/** Unter- und Obergrenze für selbst gesetzte Ziele. */
export const MIN_TAGESZIEL = 3;
export const MAX_TAGESZIEL = 100;

/**
 * Bringt ein gewünschtes Tagesziel in den erlaubten Bereich.
 *
 * Ungültige Eingaben (null, NaN, leerer Text, Objekte) fallen auf den Standard
 * zurück statt einen Fehler zu werfen — ein kaputter Wert in den Einstellungen
 * darf das Dashboard nicht lahmlegen. Gültige Zahlen außerhalb der Grenzen
 * werden dagegen beschnitten, nicht verworfen: wer 500 einträgt, meint „viel".
 */
export function normalisiereTagesziel(wunsch: unknown): number {
  const zahl = endlicheZahl(wunsch);
  if (zahl === null) return STANDARD_TAGESZIEL;
  const ganz = Math.round(zahl);
  if (ganz < MIN_TAGESZIEL) return MIN_TAGESZIEL;
  if (ganz > MAX_TAGESZIEL) return MAX_TAGESZIEL;
  return ganz;
}

/**
 * Rechnet den Stand des Tagesziels aus.
 *
 * Übererfüllung wird nicht abgeschnitten (`erledigt` bleibt echt), aber der
 * Anteil deckelt bei 1, damit Fortschrittsringe nicht überlaufen.
 */
export function tageszielStand(erledigt: number, ziel: unknown): TageszielStand {
  const soll = normalisiereTagesziel(ziel);
  const ist = Number.isFinite(erledigt) ? Math.max(0, Math.floor(erledigt)) : 0;
  return {
    erledigt: ist,
    ziel: soll,
    offen: Math.max(0, soll - ist),
    anteil: Math.min(1, ist / soll),
    erreicht: ist >= soll,
  };
}

/**
 * Schlägt ein Tagesziel aus dem Verhalten der letzten Tage vor.
 *
 * Nimmt den Mittelwert der aktiven Tage und rundet auf ein Vielfaches von 5,
 * damit das Ziel wie eine runde Absicht wirkt und nicht wie eine Messung.
 * Tage ohne Aktivität zählen nicht mit — sonst zieht jede Krankheitswoche das
 * Ziel nach unten.
 */
export function empfohlenesTagesziel(letzteTage: readonly number[]): number {
  const aktive = letzteTage.filter((n) => Number.isFinite(n) && n > 0);
  if (aktive.length === 0) return STANDARD_TAGESZIEL;
  const mittel = aktive.reduce((summe, n) => summe + n, 0) / aktive.length;
  return normalisiereTagesziel(Math.round(mittel / 5) * 5);
}
