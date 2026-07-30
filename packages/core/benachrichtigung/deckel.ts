/**
 * Frequenzdeckel und Wiederholungsschutz.
 *
 * Der wirksamste Push ist der, der selten kommt. Zwei Regeln greifen deshalb
 * unabhängig voneinander:
 *  1. Ein Tagesdeckel über alle Anlässe hinweg.
 *  2. Eine Mindestpause je Anlass, damit derselbe Hinweis nicht täglich kommt.
 */

import { alsKalendertag } from '../engagement/kalender.ts';
import { endlicheZahl } from '../werte/zahl.ts';
import type { Anlass, ProtokollEintrag, PushEinstellungen } from './types.ts';

/** Voreinstellung: höchstens zwei Benachrichtigungen pro Tag. */
export const STANDARD_MAX_PRO_TAG = 2;

/** Harte Obergrenze, unabhängig von den Einstellungen. */
export const ABSOLUTES_MAX_PRO_TAG = 5;

/**
 * Mindestpause je Anlass in Stunden.
 *
 * Fällige Wiederholungen dürfen einmal täglich erinnern, weil sie den Kern des
 * Lernens betreffen. Alles, was eher Hinweis als Aufgabe ist, wartet länger.
 * Ausbilder-Entscheidungen haben gar keine Pause — sie sind Ereignisse, keine
 * Erinnerungen, und mehrere Freigaben sind mehrere Nachrichten wert.
 */
export const MINDESTPAUSE_STUNDEN: Readonly<Record<Anlass, number>> = {
  faellige_wiederholung: 20,
  serie_gefaehrdet: 20,
  tagesziel_offen: 20,
  wochenpruefung_offen: 48,
  nachweis_luecke: 72,
  nachweis_entschieden: 0,
  wochenbericht_bereit: 120,
};

/**
 * Bringt den Tagesdeckel in einen sinnvollen Bereich.
 *
 * Beschneidet statt zu ersetzen: 0 heißt „gar nichts" und ist eine legitime
 * Wahl, 50 heißt „so viel wie möglich" und wird auf die harte Obergrenze
 * gezogen. Nur unbrauchbare Werte fallen auf den Standard zurück.
 */
export function normalisiereMaxProTag(wert: unknown): number {
  const zahl = endlicheZahl(wert);
  if (zahl === null) return STANDARD_MAX_PRO_TAG;
  return Math.min(Math.max(0, Math.floor(zahl)), ABSOLUTES_MAX_PRO_TAG);
}

/** Zählt die heute schon gesendeten Benachrichtigungen. */
export function heuteGesendet(
  protokoll: readonly ProtokollEintrag[],
  einstellungen: PushEinstellungen,
  jetzt: Date = new Date(),
): number {
  const heute = alsKalendertag(jetzt, einstellungen.zeitzone);
  return protokoll.filter((eintrag) => eintrag.tag === heute).length;
}

/** Wie viele Benachrichtigungen sind heute noch erlaubt? */
export function verbleibendesBudget(
  protokoll: readonly ProtokollEintrag[],
  einstellungen: PushEinstellungen,
  jetzt: Date = new Date(),
): number {
  const deckel = normalisiereMaxProTag(einstellungen.maxProTag);
  return Math.max(0, deckel - heuteGesendet(protokoll, einstellungen, jetzt));
}

/**
 * Ist die Mindestpause für diesen Anlass abgelaufen?
 *
 * Unlesbare Zeitstempel im Protokoll werden übersprungen statt als „gerade
 * gesendet" gelesen — sonst blockiert ein einzelner defekter Eintrag den Anlass
 * für immer.
 */
export function pauseAbgelaufen(
  anlass: Anlass,
  protokoll: readonly ProtokollEintrag[],
  jetzt: Date = new Date(),
): boolean {
  const pause = MINDESTPAUSE_STUNDEN[anlass] ?? 24;
  if (pause <= 0) return true;

  const letzter = protokoll
    .filter((eintrag) => eintrag.anlass === anlass)
    .map((eintrag) => new Date(eintrag.gesendetAm).getTime())
    .filter((zeit) => !Number.isNaN(zeit))
    .sort((a, b) => b - a)[0];

  if (letzter === undefined) return true;
  return jetzt.getTime() - letzter >= pause * 3_600_000;
}

/** Hat die Person diesen Anlass abgewählt? */
export function anlassErlaubt(anlass: Anlass, einstellungen: PushEinstellungen): boolean {
  return !einstellungen.abgewaehlt.includes(anlass);
}
