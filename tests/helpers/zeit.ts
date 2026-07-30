/**
 * Feste Zeitpunkte für Tests.
 *
 * Kein Test darf `new Date()` ohne Argument benutzen. Jede Domainfunktion nimmt
 * `jetzt` als Parameter, genau damit Tests reproduzierbar bleiben — auch am
 * 29. Februar, auch um 23:59 Uhr und auch in der Nacht der Zeitumstellung.
 */

/** Baut einen Zeitpunkt aus einer UTC-Angabe. */
export function utc(iso: string): Date {
  const zeitpunkt = new Date(iso.endsWith('Z') ? iso : `${iso}Z`);
  if (Number.isNaN(zeitpunkt.getTime())) {
    throw new Error(`Ungültiger Testzeitpunkt: ${iso}`);
  }
  return zeitpunkt;
}

/**
 * Zeitpunkte an den Rändern, die in der Praxis Fehler auslösen.
 *
 * Alle Werte sind UTC. Die Kommentare nennen die zugehörige Zeit in
 * Europe/Berlin, weil dort die fachlichen Grenzen liegen.
 */
export const ZEITPUNKTE = {
  /** Winterzeit (UTC+1): 12:00 Berlin. */
  winterMittag: utc('2026-01-14T11:00:00'),
  /** Winterzeit: 22:00 Berlin — stille Zeit. */
  winterNacht: utc('2026-01-14T21:00:00'),
  /** Winterzeit: 19:30 Berlin — Abendfenster bei stillVon 21. */
  winterAbend: utc('2026-01-14T18:30:00'),
  /** Winterzeit: 00:30 Berlin, aber noch 23:30 UTC am Vortag. */
  winterNachMitternacht: utc('2026-01-14T23:30:00'),
  /** Sommerzeit (UTC+2): 12:00 Berlin. */
  sommerMittag: utc('2026-07-14T10:00:00'),
  /** Sommerzeit: 19:30 Berlin — Abendfenster. */
  sommerAbend: utc('2026-07-14T17:30:00'),
  /**
   * Nacht der Umstellung auf Sommerzeit: 29.03.2026 gegen 03:00 Berlin.
   * Dieser Tag hat in Berlin nur 23 Stunden.
   */
  sommerzeitBeginn: utc('2026-03-29T01:30:00'),
  /**
   * Nacht der Umstellung auf Winterzeit: 25.10.2026 gegen 02:30 Berlin.
   * Diese Stunde gibt es zweimal.
   */
  winterzeitBeginn: utc('2026-10-25T00:30:00'),
  /** Silvester 23:30 Berlin — Jahres- und ISO-Wochenwechsel treffen zusammen. */
  silvesterAbend: utc('2026-12-31T22:30:00'),
  /** Schalttag. */
  schalttag: utc('2028-02-29T11:00:00'),
} as const;
