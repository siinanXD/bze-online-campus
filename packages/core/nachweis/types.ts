/**
 * Typen des Ausbildungsnachweises (Berichtsheft), Spec §3 / §6.2.14 (AP-18).
 *
 * Statuswerte und Berichtsarten spiegeln die Postgres-Enums
 * `nachweis_status_t` und `nachweis_art_t` aus `0001_datenmodell.sql`.
 */

export const NACHWEIS_STATUS = [
  'entwurf',
  'eingereicht',
  'signiert_teilnehmer',
  'signiert_ausbilder',
  'beanstandet',
] as const;
export type NachweisStatus = (typeof NACHWEIS_STATUS)[number];

export const NACHWEIS_ART = ['tag', 'woche', 'monat', 'fach'] as const;
export type NachweisArt = (typeof NACHWEIS_ART)[number];

/** Wer eine Aktion auslöst. Verwaltung/Admin handeln wie ein Ausbilder. */
export type NachweisRolle = 'teilnehmer' | 'ausbilder';

export type NachweisAktion =
  | 'einreichen'
  | 'signieren_teilnehmer'
  | 'signieren_ausbilder'
  | 'beanstanden'
  | 'korrektur';

/**
 * Freitextinhalt eines Nachweises. Die KI-Formulierungshilfe darf ausschließlich
 * aus diesen Eingaben formulieren und nichts ergänzen (Spec Grundregel 14).
 */
export interface NachweisInhalt {
  taetigkeiten?: string;
  unterweisungen?: string;
  berufsschulthemen?: string;
}

export interface Zeitraum {
  von: string; // ISO-Datum YYYY-MM-DD
  bis: string; // ISO-Datum YYYY-MM-DD
}

export interface NachweisKurz {
  id: string;
  art: NachweisArt;
  zeitraumVon: string | null;
  zeitraumBis: string | null;
  ausbildungsjahr: number | null;
  status: NachweisStatus;
  kiFormuliert: boolean;
}

/** Eine erkannte Lücke im Berichtszeitraum (fehlende Kalenderwoche). */
export interface WochenLuecke {
  jahr: number;
  kalenderwoche: number;
  von: string;
  bis: string;
}
