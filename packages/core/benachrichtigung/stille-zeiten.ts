/**
 * Stille Zeiten — keine Benachrichtigung nachts.
 *
 * Der Erstpilot richtet sich an Auszubildende, viele davon mit Schichtbetrieb im
 * Betrieb. Eine Lernerinnerung um 3 Uhr kostet dauerhaft die Erlaubnis, also
 * wird sie nicht gesendet, sondern verworfen. Bewusst kein Aufschieben auf
 * später: eine nachgeschobene Erinnerung von letzter Nacht hat morgens keinen
 * Wert mehr.
 */

import { lokaleStunde } from '../engagement/kalender';
import { ganzeZahlImBereich } from '../werte/zahl';
import type { PushEinstellungen } from './types';

/** Voreinstellung: 21 Uhr bis 7 Uhr ist still. */
export const STANDARD_STILL_VON = 21;
export const STANDARD_STILL_BIS = 7;

/**
 * Bringt eine Stundenangabe auf einen gültigen Wert 0–23.
 *
 * Ersetzt statt zu beschneiden: eine Stunde 99 ist ein Fehler, kein Wunsch nach
 * „so spät wie möglich". Bei 23 zu landen wäre geraten.
 */
export function normalisiereStunde(wert: unknown, ersatz: number): number {
  return ganzeZahlImBereich(wert, 0, 23) ?? ersatz;
}

/**
 * Liegt `stunde` in der stillen Zeit von `von` (einschließlich) bis `bis`
 * (ausschließlich)?
 *
 * Behandelt den Normalfall über Mitternacht (21→7) und den seltenen Fall
 * innerhalb eines Tages (13→15, etwa für Schichtarbeitende). `von === bis`
 * bedeutet: keine stille Zeit — nicht „rund um die Uhr still", denn ein
 * versehentlich gleicher Wert darf Benachrichtigungen nicht vollständig
 * abschalten. Wer nichts will, schaltet `aktiv` aus.
 */
export function stundeIstStill(stunde: number, von: number, bis: number): boolean {
  if (von === bis) return false;
  if (von < bis) return stunde >= von && stunde < bis;
  return stunde >= von || stunde < bis;
}

/**
 * Ist der Zeitpunkt in der stillen Zeit dieser Person?
 *
 * Rechnet in der Zeitzone aus den Einstellungen, damit die Grenze dort gilt, wo
 * das Gerät liegt — nicht auf dem Server.
 */
export function istStilleZeit(
  einstellungen: PushEinstellungen,
  jetzt: Date = new Date(),
): boolean {
  const von = normalisiereStunde(einstellungen.stillVon, STANDARD_STILL_VON);
  const bis = normalisiereStunde(einstellungen.stillBis, STANDARD_STILL_BIS);
  const stunde = lokaleStunde(jetzt, einstellungen.zeitzone);
  return stundeIstStill(stunde, von, bis);
}

/**
 * Gutes Zeitfenster für Lernerinnerungen: der Abend vor der stillen Zeit.
 *
 * Zwei Stunden vor Beginn der Ruhe ist der Moment, in dem eine Serie noch zu
 * retten ist und der Tag zugleich nicht mehr verplant wirkt.
 */
export function istAbendfenster(
  einstellungen: PushEinstellungen,
  jetzt: Date = new Date(),
): boolean {
  const von = normalisiereStunde(einstellungen.stillVon, STANDARD_STILL_VON);
  const stunde = lokaleStunde(jetzt, einstellungen.zeitzone);
  // Zwei Stunden vor der stillen Zeit, mit Umbruch über Mitternacht.
  const start = (von - 2 + 24) % 24;
  return stundeIstStill(stunde, start, von);
}
