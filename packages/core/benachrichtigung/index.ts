/**
 * Benachrichtigungs-Domain — Web Push, aber nur wenn es hilft.
 *
 * Aufbau in Stufen, von außen nach innen:
 *  - `planung`       einziger Einstiegspunkt für den Versender
 *  - `anlaesse`      welche Meldung ist sachlich begründet, in welchem Rang
 *  - `stille-zeiten` wann darf überhaupt gesendet werden
 *  - `deckel`        Tagesbudget und Mindestpause je Anlass
 *  - `nutzlast`      Anlass zu Übersetzungsschlüsseln und Zielpfad
 *  - `abo`           Pflege abgelaufener Endpunkte
 *
 * Die gesamte Entscheidung findet ohne Netzwerk, ohne Datenbank und ohne Uhr aus
 * der Umgebung statt: jede Funktion nimmt `jetzt` als Parameter. Deshalb sind
 * auch stille Zeiten, Sommerzeit und Tagesgrenzen vollständig testbar.
 */

export * from './types.ts';
export * from './stille-zeiten.ts';
export * from './deckel.ts';
export * from './anlaesse.ts';
export * from './nutzlast.ts';
export * from './planung.ts';
export * from './abo.ts';
