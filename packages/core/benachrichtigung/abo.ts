/**
 * Abo-Pflege: welche Push-Abos sind noch brauchbar?
 *
 * Push-Endpunkte verfallen ständig — beim Deinstallieren der PWA, beim Löschen
 * der Browserdaten, bei Wechsel des Geräts. Wer sie nicht aufräumt, sendet
 * dauerhaft an toten Adressen und riskiert, vom Push-Dienst gebremst zu werden.
 */

import type { PushAbo } from './types';

/** Nach so vielen Fehlversuchen in Folge gilt ein Abo als tot. */
export const MAX_FEHLVERSUCHE = 3;

/**
 * HTTP-Status-Codes, bei denen der Endpunkt endgültig weg ist.
 *
 * 404 und 410 sind die im Web-Push-Protokoll vorgesehenen Antworten für einen
 * abgelaufenen Endpunkt. Sie führen sofort zum Löschen, ohne Zählung.
 */
export const ENTFERNEN_BEI_STATUS: readonly number[] = [404, 410];

/**
 * Soll das Abo nach dieser Antwort gelöscht werden?
 *
 * Nur 4xx zählt gegen das Abo, denn dort liegt der Fehler bei Anfrage oder
 * Endpunkt. 5xx ist eine Störung beim Push-Dienst und darf kein aktives Gerät
 * kosten — sonst räumt ein einstündiger Ausfall bei Google oder Mozilla die
 * halbe Abo-Tabelle ab. 429 ist Drosselung und heißt „später wieder".
 */
export function aboEntfernen(status: number, fehlversuche: number): boolean {
  if (ENTFERNEN_BEI_STATUS.includes(status)) return true;
  const dauerhafterAnfragefehler = status >= 400 && status < 500 && status !== 429;
  return dauerhafterAnfragefehler && fehlversuche + 1 >= MAX_FEHLVERSUCHE;
}

/** Gilt eine Antwort als erfolgreicher Versand? */
export function versandErfolgreich(status: number): boolean {
  return status >= 200 && status < 300;
}

/**
 * Abos, an die gesendet werden soll.
 *
 * Sortiert das zuletzt erfolgreich bediente Gerät nach vorn: es ist mit hoher
 * Wahrscheinlichkeit das aktive. Abos ohne Endpunkt oder über der Fehlergrenze
 * fallen heraus.
 */
export function sendbareAbos(abos: readonly PushAbo[]): PushAbo[] {
  return abos
    .filter((abo) => Boolean(abo.endpoint) && abo.fehlversuche < MAX_FEHLVERSUCHE)
    .sort((a, b) => {
      const zeit = (abo: PushAbo): number => {
        if (!abo.zuletztGesendetAm) return 0;
        const wert = new Date(abo.zuletztGesendetAm).getTime();
        return Number.isNaN(wert) ? 0 : wert;
      };
      return zeit(b) - zeit(a);
    });
}
