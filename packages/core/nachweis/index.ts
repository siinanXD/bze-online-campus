/**
 * Kernlogik des Ausbildungsnachweises (AP-18). Reine, DB-freie Funktionen:
 * Statusübergänge, Sperrlogik signierter Blätter und Lückenanzeige der Wochen.
 */

export type {
  NachweisStatus,
  NachweisArt,
  NachweisRolle,
  NachweisAktion,
  NachweisInhalt,
  NachweisKurz,
  Zeitraum,
  WochenLuecke,
} from './types';
export { NACHWEIS_STATUS, NACHWEIS_ART } from './types';

export {
  pruefeTransition,
  istGesperrtFuerTeilnehmer,
  teilnehmerKannBearbeiten,
  verfuegbareAktionen,
  type TransitionErgebnis,
} from './status';

export { isoKalenderwoche, wochenBereich, findeWochenLuecken } from './luecken';

import type { NachweisInhalt } from './types';

/** Ist der Inhalt vollständig leer? (Alle Felder fehlen oder sind Whitespace.) */
export function inhaltIstLeer(inhalt: NachweisInhalt | null | undefined): boolean {
  if (!inhalt) return true;
  return !(
    (inhalt.taetigkeiten ?? '').trim() ||
    (inhalt.unterweisungen ?? '').trim() ||
    (inhalt.berufsschulthemen ?? '').trim()
  );
}

/**
 * Baut den zu signierenden Klartext eines Nachweises. Der Hash dieses Strings
 * wird als Signatur (`nachweis_signaturen.hash`) abgelegt und macht spätere,
 * nicht dokumentierte Änderungen erkennbar.
 */
export function signaturKlartext(felder: {
  nachweisId: string;
  status: string;
  inhalt: NachweisInhalt | null | undefined;
  rahmenplanPositionen?: string[] | null;
}): string {
  const inhalt = felder.inhalt ?? {};
  return JSON.stringify({
    id: felder.nachweisId,
    status: felder.status,
    taetigkeiten: (inhalt.taetigkeiten ?? '').trim(),
    unterweisungen: (inhalt.unterweisungen ?? '').trim(),
    berufsschulthemen: (inhalt.berufsschulthemen ?? '').trim(),
    rahmenplan: (felder.rahmenplanPositionen ?? []).map((p) => p.trim()).filter(Boolean).sort(),
  });
}
