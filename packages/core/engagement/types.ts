/**
 * Typen der Engagement-Domain: Lernserie, Tagesziel, Fälligkeiten, Abzeichen.
 *
 * Die Domain ist bewusst frei von Datenbank- und Framework-Bezügen. Alle Daten
 * kommen als einfache Werte herein, alle Ergebnisse gehen als einfache Werte
 * hinaus. Dadurch ist jede Regel ohne Supabase und ohne React testbar.
 *
 * Kalendertage sind immer ISO-Datumsstrings `YYYY-MM-DD` in der Zeitzone der
 * lernenden Person — nie UTC-Zeitstempel. Wer um 23:30 deutscher Zeit lernt,
 * soll den Tag gutgeschrieben bekommen, an dem er sich befindet.
 */

/** Ein Kalendertag als `YYYY-MM-DD` in der Zeitzone der lernenden Person. */
export type Kalendertag = string;

/** Zustand einer Lernserie. */
export type SerienStatus =
  /** Heute wurde schon gelernt — die Serie ist gesichert. */
  | 'aktiv'
  /** Gestern wurde gelernt, heute noch nicht — die Serie kann heute reißen. */
  | 'gefaehrdet'
  /** Länger als einen Tag nichts gelernt — die Serie ist bei 0. */
  | 'gerissen';

export interface Serie {
  /** Länge der aktuellen Serie in Tagen (0 wenn gerissen). */
  laenge: number;
  /** Längste je erreichte Serie — bleibt als Bestmarke sichtbar. */
  bestmarke: number;
  status: SerienStatus;
  /** Letzter Tag mit Lernaktivität, `null` wenn noch nie gelernt wurde. */
  letzterTag: Kalendertag | null;
}

export interface TageszielStand {
  /** Wie viele Fragen heute schon beantwortet wurden. */
  erledigt: number;
  /** Wie viele Fragen das Ziel vorsieht (immer > 0). */
  ziel: number;
  /** Noch offene Fragen bis zum Ziel. */
  offen: number;
  /** Fortschritt 0..1, bei Übererfüllung auf 1 begrenzt. */
  anteil: number;
  erreicht: boolean;
}

/** Ein einzelner Mastery-Stand, wie ihn die Fälligkeitsrechnung braucht. */
export interface FaelligkeitsEintrag {
  frageId: string;
  status: 'neu' | 'einmal_richtig' | 'falsch' | 'abgeschlossen';
  /** ISO-Zeitstempel der nächsten Fälligkeit, `null` = sofort fällig. */
  naechsteFaelligkeit: string | null;
}

export interface FaelligkeitsUebersicht {
  /** Zuletzt falsch beantwortet — hat immer Vorrang. */
  falsch: number;
  /** Noch nie beantwortet. */
  neu: number;
  /** `einmal_richtig` und die Wartezeit ist abgelaufen. */
  wiederholung: number;
  /** Summe aus falsch, neu und Wiederholung. */
  gesamt: number;
}

/** Regel eines Abzeichens: erfüllt oder nicht, gemessen an einer Kennzahl. */
export interface AbzeichenRegel {
  code: string;
  /** Kennzahl, gegen die geprüft wird. */
  kennzahl: 'serie' | 'kernfragen' | 'wochenpruefungen' | 'nachweise' | 'themen';
  /** Ab diesem Wert (einschließlich) gilt das Abzeichen als erreicht. */
  schwelle: number;
  punkte: number;
}

export interface AbzeichenStand {
  code: string;
  punkte: number;
  erreicht: boolean;
  /** Fortschritt zur Schwelle, 0..1. */
  anteil: number;
  /** Wie viel noch fehlt (0 wenn erreicht). */
  rest: number;
}

/** Kennzahlen einer lernenden Person, gegen die Abzeichen geprüft werden. */
export interface Kennzahlen {
  serie: number;
  kernfragen: number;
  wochenpruefungen: number;
  nachweise: number;
  themen: number;
}
