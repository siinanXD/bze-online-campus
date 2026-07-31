/**
 * Kalendertag-Hilfen für die Engagement-Domain.
 *
 * Alle Funktionen rechnen bewusst in Kalendertagen der Zeitzone der lernenden
 * Person, nicht in UTC-Millisekunden. Das ist der einzige Weg, der auch über
 * Sommerzeitwechsel hinweg richtig bleibt: der 30. März hat in Europa/Berlin nur
 * 23 Stunden, ist aber trotzdem genau ein Kalendertag.
 */

import type { Kalendertag } from './types.ts';

/** Standardzeitzone der Plattform (Erstpilot Euskirchen). */
export const STANDARD_ZEITZONE = 'Europe/Berlin';

const TAG_MUSTER = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Wandelt einen Zeitpunkt in den Kalendertag der angegebenen Zeitzone.
 *
 * Nutzt `en-CA`, weil dieses Gebietsschema `YYYY-MM-DD` liefert — damit
 * entfällt eigenes Zusammenbauen und Auffüllen von Monat und Tag.
 */
export function alsKalendertag(
  zeitpunkt: Date,
  zeitzone: string = STANDARD_ZEITZONE,
): Kalendertag {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: zeitzone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(zeitpunkt);
}

/** Prüft das Format `YYYY-MM-DD`, ohne die Gültigkeit des Datums zu bewerten. */
export function istKalendertag(wert: unknown): wert is Kalendertag {
  return typeof wert === 'string' && TAG_MUSTER.test(wert);
}

/**
 * Verschiebt einen Kalendertag um `tage` Tage.
 *
 * Rechnet über UTC-Mitternacht, weil ein Kalendertag hier ein reines
 * Datumslabel ohne Uhrzeit ist — Zeitzonen spielen bei der Verschiebung
 * deshalb keine Rolle mehr.
 */
export function verschiebeTag(tag: Kalendertag, tage: number): Kalendertag {
  const [jahr, monat, tagImMonat] = tag.split('-').map(Number);
  const d = new Date(Date.UTC(jahr!, monat! - 1, tagImMonat!));
  d.setUTCDate(d.getUTCDate() + tage);
  return d.toISOString().slice(0, 10);
}

/** Tag davor. */
export function vortag(tag: Kalendertag): Kalendertag {
  return verschiebeTag(tag, -1);
}

/**
 * Abstand zweier Kalendertage in Tagen (`bis` minus `von`).
 *
 * Negativ, wenn `bis` vor `von` liegt.
 */
export function tageDazwischen(von: Kalendertag, bis: Kalendertag): number {
  const alsZahl = (tag: Kalendertag): number => {
    const [j, m, t] = tag.split('-').map(Number);
    return Date.UTC(j!, m! - 1, t!);
  };
  return Math.round((alsZahl(bis) - alsZahl(von)) / 86_400_000);
}

/**
 * Lokale Stunde (0–23) eines Zeitpunkts in der angegebenen Zeitzone.
 *
 * `hourCycle: 'h23'` verhindert, dass Mitternacht als 24 herauskommt — sonst
 * fällt jede Prüfung auf stille Zeiten um 0 Uhr durch.
 */
export function lokaleStunde(
  zeitpunkt: Date,
  zeitzone: string = STANDARD_ZEITZONE,
): number {
  const teil = new Intl.DateTimeFormat('en-GB', {
    timeZone: zeitzone,
    hour: '2-digit',
    hourCycle: 'h23',
  }).format(zeitpunkt);
  return Number(teil);
}
