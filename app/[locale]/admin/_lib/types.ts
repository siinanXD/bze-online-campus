import type { Rolle } from '@bze/db';

/** Lokale Typen für AP-07 (Administration). Keine generierten DB-Typen vorhanden,
 *  daher hier bewusst schlank an docs/SPEC.md §3 orientiert nachgebildet. */

export type { Rolle };

export interface AdminProfil {
  id: string;
  traeger_id: string;
  benutzername: string;
  rolle: Rolle;
  vorname: string | null;
  nachname: string | null;
  sprache: string;
  muss_passwort_aendern: boolean;
  aktiv: boolean;
  letzter_login: string | null;
  created_at: string;
}

export interface Kohorte {
  id: string;
  traeger_id: string;
  beruf_id: string;
  bezeichnung: string;
  start_datum: string | null;
  end_datum: string | null;
  beitrittscode: string | null;
}

export interface AusbilderZuweisung {
  ausbilder_id: string;
  teilnehmer_id: string;
  zugewiesen_am: string;
}

export interface AuditLogEintrag {
  id: string;
  akteur_id: string | null;
  aktion: string;
  ziel_typ: string | null;
  ziel_id: string | null;
  details: Record<string, unknown> | null;
  ip: string | null;
  created_at: string;
}

/** Ergebnis der Nutzer-Anlage bzw. eines Passwort-Resets — nur EINMALIG anzeigen, nie speichern. */
export interface Zugangsdaten {
  id: string;
  benutzername: string;
  initialPasswort: string;
}
