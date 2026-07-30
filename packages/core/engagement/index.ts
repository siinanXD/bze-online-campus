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

export * from './types';
export * from './kalender';
export * from './serie';
export * from './tagesziel';
export * from './faelligkeit';
export * from './abzeichen';
