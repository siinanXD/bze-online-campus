/**
 * Statuslogik des Ausbildungsnachweises (Spec §3 Regel 15, §6.2.14 / §6.3.23).
 *
 * Signierte Nachweise sind gesperrt; Änderungen laufen ausschließlich über einen
 * dokumentierten Korrektureintrag mit Begründung. Diese Regeln liegen bewusst in
 * der Logikschicht (und werden zusätzlich per RPC/RLS in der Datenbank erzwungen).
 */

import type { NachweisAktion, NachweisRolle, NachweisStatus } from './types';

interface Uebergang {
  rolle: NachweisRolle;
  von: NachweisStatus[];
  /** Zielstatus; null bedeutet: Status bleibt (z. B. Korrektur eines signierten Blatts). */
  nach: NachweisStatus | null;
}

const UEBERGAENGE: Record<NachweisAktion, Uebergang> = {
  einreichen: {
    rolle: 'teilnehmer',
    von: ['entwurf', 'beanstandet'],
    nach: 'eingereicht',
  },
  signieren_teilnehmer: {
    rolle: 'teilnehmer',
    von: ['eingereicht'],
    nach: 'signiert_teilnehmer',
  },
  signieren_ausbilder: {
    rolle: 'ausbilder',
    von: ['signiert_teilnehmer'],
    nach: 'signiert_ausbilder',
  },
  beanstanden: {
    rolle: 'ausbilder',
    von: ['eingereicht', 'signiert_teilnehmer'],
    nach: 'beanstandet',
  },
  korrektur: {
    // Korrektur eines bereits signierten Blatts: Status bleibt, Begründung Pflicht.
    rolle: 'ausbilder',
    von: ['signiert_teilnehmer', 'signiert_ausbilder'],
    nach: null,
  },
};

export interface TransitionErgebnis {
  erlaubt: boolean;
  /** Zielstatus bei Erfolg (kann gleich dem Ausgangsstatus sein). */
  nach?: NachweisStatus;
  grund?: 'falsche_rolle' | 'ungueltiger_status';
}

/** Prüft, ob eine Aktion aus dem aktuellen Status durch die Rolle erlaubt ist. */
export function pruefeTransition(
  aktion: NachweisAktion,
  aktuell: NachweisStatus,
  rolle: NachweisRolle,
): TransitionErgebnis {
  const u = UEBERGAENGE[aktion];
  if (u.rolle !== rolle) return { erlaubt: false, grund: 'falsche_rolle' };
  if (!u.von.includes(aktuell)) return { erlaubt: false, grund: 'ungueltiger_status' };
  return { erlaubt: true, nach: u.nach ?? aktuell };
}

/** Ist der Nachweis für die freie Bearbeitung durch den Teilnehmer gesperrt? */
export function istGesperrtFuerTeilnehmer(status: NachweisStatus): boolean {
  return status === 'signiert_teilnehmer' || status === 'signiert_ausbilder';
}

/** Kann der Teilnehmer den Inhalt frei bearbeiten (nur Entwurf oder Beanstandung)? */
export function teilnehmerKannBearbeiten(status: NachweisStatus): boolean {
  return status === 'entwurf' || status === 'beanstandet';
}

/** Alle Aktionen, die die Rolle aus dem aktuellen Status ausführen darf. */
export function verfuegbareAktionen(
  status: NachweisStatus,
  rolle: NachweisRolle,
): NachweisAktion[] {
  return (Object.keys(UEBERGAENGE) as NachweisAktion[]).filter(
    (a) => pruefeTransition(a, status, rolle).erlaubt,
  );
}
