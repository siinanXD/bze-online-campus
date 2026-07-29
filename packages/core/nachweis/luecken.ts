/**
 * Lückenanzeige für den Wochen-Ausbildungsnachweis (Spec §6.2.14: „Kalenderansicht
 * mit Lückenanzeige"). Reine Funktionen ohne DB — testbar über node:test.
 *
 * Kalenderwochen nach ISO 8601 (Woche beginnt Montag, Woche 1 enthält den ersten
 * Donnerstag des Jahres). Deutsche Konvention (Spec §8).
 */

import type { WochenLuecke, Zeitraum } from './types';

const TAG_MS = 86_400_000;

function alsUtcDatum(iso: string): Date {
  // Erwartet YYYY-MM-DD; als UTC-Mitternacht interpretieren (zeitzonensicher).
  const [j, m, t] = iso.slice(0, 10).split('-').map(Number);
  return new Date(Date.UTC(j ?? 1970, (m ?? 1) - 1, t ?? 1));
}

function isoDatum(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** ISO-Kalenderwoche und zugehöriges ISO-Wochenjahr eines Datums. */
export function isoKalenderwoche(datum: Date): { jahr: number; woche: number } {
  const d = new Date(Date.UTC(datum.getUTCFullYear(), datum.getUTCMonth(), datum.getUTCDate()));
  // Donnerstag der aktuellen Woche bestimmt das ISO-Wochenjahr.
  const wochentag = (d.getUTCDay() + 6) % 7; // Mo=0 … So=6
  d.setUTCDate(d.getUTCDate() - wochentag + 3);
  const erstesJahr = d.getUTCFullYear();
  const ersterDonnerstag = new Date(Date.UTC(erstesJahr, 0, 4));
  const ersterWochentag = (ersterDonnerstag.getUTCDay() + 6) % 7;
  ersterDonnerstag.setUTCDate(ersterDonnerstag.getUTCDate() - ersterWochentag + 3);
  const woche = 1 + Math.round((d.getTime() - ersterDonnerstag.getTime()) / (7 * TAG_MS));
  return { jahr: erstesJahr, woche };
}

/** Montag (von) und Sonntag (bis) einer ISO-Kalenderwoche. */
export function wochenBereich(jahr: number, woche: number): Zeitraum {
  const ersterDonnerstag = new Date(Date.UTC(jahr, 0, 4));
  const ersterWochentag = (ersterDonnerstag.getUTCDay() + 6) % 7;
  const montagW1 = new Date(ersterDonnerstag);
  montagW1.setUTCDate(ersterDonnerstag.getUTCDate() - ersterWochentag);
  const montag = new Date(montagW1.getTime() + (woche - 1) * 7 * TAG_MS);
  const sonntag = new Date(montag.getTime() + 6 * TAG_MS);
  return { von: isoDatum(montag), bis: isoDatum(sonntag) };
}

function wochenSchluessel(jahr: number, woche: number): string {
  return `${jahr}-${String(woche).padStart(2, '0')}`;
}

/**
 * Ermittelt fehlende Kalenderwochen zwischen `von` und `bis` (beide inklusive),
 * gemessen an den bereits vorhandenen Wochen-Zeiträumen. Eine vorhandene Woche
 * gilt als abgedeckt, wenn ihr Von-Datum in die jeweilige Kalenderwoche fällt.
 */
export function findeWochenLuecken(
  vorhandene: Array<{ von: string | null; bis?: string | null }>,
  von: string,
  bis: string,
): WochenLuecke[] {
  const abgedeckt = new Set<string>();
  for (const eintrag of vorhandene) {
    if (!eintrag.von) continue;
    const w = isoKalenderwoche(alsUtcDatum(eintrag.von));
    abgedeckt.add(wochenSchluessel(w.jahr, w.woche));
  }

  const startWoche = isoKalenderwoche(alsUtcDatum(von));
  const endWoche = isoKalenderwoche(alsUtcDatum(bis));

  const luecken: WochenLuecke[] = [];
  const gesehen = new Set<string>();
  // Iteriere Woche für Woche über Montage, um Jahreswechsel korrekt zu erfassen.
  let cursor = alsUtcDatum(wochenBereich(startWoche.jahr, startWoche.woche).von);
  const ende = alsUtcDatum(wochenBereich(endWoche.jahr, endWoche.woche).von);
  let schutz = 0;
  while (cursor.getTime() <= ende.getTime() && schutz < 520) {
    schutz += 1;
    const w = isoKalenderwoche(cursor);
    const key = wochenSchluessel(w.jahr, w.woche);
    if (!gesehen.has(key)) {
      gesehen.add(key);
      if (!abgedeckt.has(key)) {
        const bereich = wochenBereich(w.jahr, w.woche);
        luecken.push({ jahr: w.jahr, kalenderwoche: w.woche, von: bereich.von, bis: bereich.bis });
      }
    }
    cursor = new Date(cursor.getTime() + 7 * TAG_MS);
  }
  return luecken;
}
