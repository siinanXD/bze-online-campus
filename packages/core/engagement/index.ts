/**
 * Engagement-Domain — hält den Fokus der Lernenden.
 *
 * Enthält vier Bausteine, die alle ohne Datenbank auskommen:
 *  - `serie`      Lernserie über Kalendertage, inklusive „heute noch zu retten"
 *  - `tagesziel`  kleines Tagesziel und dessen Stand
 *  - `faelligkeit` welche Fragen jetzt zur Wiederholung anstehen
 *  - `abzeichen`  Meilensteine ohne Wettbewerb
 *
 * `kalender` liefert die Tag- und Stundenrechnung, auf der alles davon aufsetzt.
 */

export * from './types.ts';
export * from './kalender.ts';
export * from './serie.ts';
export * from './tagesziel.ts';
export * from './faelligkeit.ts';
export * from './abzeichen.ts';
