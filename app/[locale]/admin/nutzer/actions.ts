'use server';

import { ladeAdminSitzung } from '../_lib/auth';
import { rufeEdgeFunctionAuf } from '../_lib/edge';
import { protokolliere } from '../_lib/audit';
import { nutzerAnlegenSchema, nutzerIdSchema, zuweisungSchema, type NutzerAnlegenEingabe } from '../_lib/schemas';
import type { Zugangsdaten } from '../_lib/types';

type AktionsErgebnis<T = undefined> = { ok: true; daten: T } | { ok: false; fehler: string };

/** RLS-Verweigerung (Postgres 42501) freundlich abbilden statt eine rohe DB-Fehlermeldung zu zeigen. */
function deuteFehler(code: string | undefined, meldung: string): string {
  if (code === '42501') return 'nur_admin';
  return meldung || 'fehler';
}

/**
 * Legt einen Nutzer über die Edge Function `nutzer-anlegen` (AP-03) an.
 * Annahme zum Antwortformat: `{ id, benutzername, initialPasswort }` — siehe
 * supabase/functions/admin-passwort-ruecksetzen/README.md für die Begründung.
 */
export async function erstelleNutzerAction(
  eingabe: NutzerAnlegenEingabe,
): Promise<AktionsErgebnis<Zugangsdaten>> {
  const sitzung = await ladeAdminSitzung();
  if (!sitzung) return { ok: false, fehler: 'kein_zugriff' };

  const geprueft = nutzerAnlegenSchema.safeParse(eingabe);
  if (!geprueft.success) return { ok: false, fehler: 'ungueltige_eingabe' };
  const wert = geprueft.data;

  // Verwaltung darf keine Admin- oder Verwaltungs-Konten anlegen (Privilegieneskalation).
  if (sitzung.profil.rolle === 'verwaltung' && (wert.rolle === 'admin' || wert.rolle === 'verwaltung')) {
    return { ok: false, fehler: 'rolle_nicht_erlaubt' };
  }

  const antwort = await rufeEdgeFunctionAuf<{ id?: string; benutzername?: string; initialPasswort?: string }>(
    'nutzer-anlegen',
    sitzung.accessToken,
    {
      benutzername: wert.benutzername,
      vorname: wert.vorname,
      nachname: wert.nachname,
      rolle: wert.rolle,
      kohorte_id: wert.kohorte_id || undefined,
    },
  );

  if (!antwort.ok) return { ok: false, fehler: antwort.fehler };
  const { id, benutzername, initialPasswort } = antwort.daten;
  if (!id || !benutzername || !initialPasswort) return { ok: false, fehler: 'unerwartete_antwort' };

  return { ok: true, daten: { id, benutzername, initialPasswort } };
}

/** Aktivieren/Deaktivieren wirkt direkt auf `profiles` und ist über RLS Admin vorbehalten. */
export async function setzeAktivStatusAction(nutzerId: string, aktiv: boolean): Promise<AktionsErgebnis> {
  const sitzung = await ladeAdminSitzung();
  if (!sitzung) return { ok: false, fehler: 'kein_zugriff' };
  if (!nutzerIdSchema.safeParse(nutzerId).success) return { ok: false, fehler: 'ungueltige_id' };

  const { error } = await sitzung.supabase.from('profiles').update({ aktiv }).eq('id', nutzerId);
  if (error) return { ok: false, fehler: deuteFehler(error.code, error.message) };

  await protokolliere(sitzung.supabase, {
    akteurId: sitzung.profil.id,
    aktion: aktiv ? 'nutzer_aktiviert' : 'nutzer_deaktiviert',
    zielTyp: 'profile',
    zielId: nutzerId,
  });
  return { ok: true, daten: undefined };
}

/** Ruft die Edge Function `admin-passwort-ruecksetzen` auf (Teil dieses Pakets). */
export async function setzePasswortZurueckAction(nutzerId: string): Promise<AktionsErgebnis<Zugangsdaten>> {
  const sitzung = await ladeAdminSitzung();
  if (!sitzung) return { ok: false, fehler: 'kein_zugriff' };
  if (!nutzerIdSchema.safeParse(nutzerId).success) return { ok: false, fehler: 'ungueltige_id' };

  const antwort = await rufeEdgeFunctionAuf<{ benutzername?: string; initialPasswort?: string }>(
    'admin-passwort-ruecksetzen',
    sitzung.accessToken,
    { user_id: nutzerId },
  );
  if (!antwort.ok) return { ok: false, fehler: antwort.fehler };
  const { benutzername, initialPasswort } = antwort.daten;
  if (!benutzername || !initialPasswort) return { ok: false, fehler: 'unerwartete_antwort' };

  return { ok: true, daten: { id: nutzerId, benutzername, initialPasswort } };
}

export async function weiseZuAction(ausbilderId: string, teilnehmerId: string): Promise<AktionsErgebnis> {
  const sitzung = await ladeAdminSitzung();
  if (!sitzung) return { ok: false, fehler: 'kein_zugriff' };
  const geprueft = zuweisungSchema.safeParse({ ausbilderId, teilnehmerId });
  if (!geprueft.success) return { ok: false, fehler: 'ungueltige_id' };

  const { error } = await sitzung.supabase
    .from('ausbilder_zuweisungen')
    .insert({ ausbilder_id: ausbilderId, teilnehmer_id: teilnehmerId });
  if (error) return { ok: false, fehler: deuteFehler(error.code, error.message) };

  await protokolliere(sitzung.supabase, {
    akteurId: sitzung.profil.id,
    aktion: 'zuweisung_erstellt',
    zielTyp: 'ausbilder_zuweisung',
    zielId: teilnehmerId,
    details: { ausbilder_id: ausbilderId, teilnehmer_id: teilnehmerId },
  });
  return { ok: true, daten: undefined };
}

export async function entferneZuweisungAction(ausbilderId: string, teilnehmerId: string): Promise<AktionsErgebnis> {
  const sitzung = await ladeAdminSitzung();
  if (!sitzung) return { ok: false, fehler: 'kein_zugriff' };
  const geprueft = zuweisungSchema.safeParse({ ausbilderId, teilnehmerId });
  if (!geprueft.success) return { ok: false, fehler: 'ungueltige_id' };

  const { error } = await sitzung.supabase
    .from('ausbilder_zuweisungen')
    .delete()
    .eq('ausbilder_id', ausbilderId)
    .eq('teilnehmer_id', teilnehmerId);
  if (error) return { ok: false, fehler: deuteFehler(error.code, error.message) };

  await protokolliere(sitzung.supabase, {
    akteurId: sitzung.profil.id,
    aktion: 'zuweisung_entfernt',
    zielTyp: 'ausbilder_zuweisung',
    zielId: teilnehmerId,
    details: { ausbilder_id: ausbilderId, teilnehmer_id: teilnehmerId },
  });
  return { ok: true, daten: undefined };
}

/** Verschiebt einen Teilnehmer in eine andere Kohorte (ersetzt bestehende Mitgliedschaft). */
export async function setzeKohorteAction(teilnehmerId: string, kohorteId: string): Promise<AktionsErgebnis> {
  const sitzung = await ladeAdminSitzung();
  if (!sitzung) return { ok: false, fehler: 'kein_zugriff' };
  if (!nutzerIdSchema.safeParse(teilnehmerId).success || !nutzerIdSchema.safeParse(kohorteId).success) {
    return { ok: false, fehler: 'ungueltige_id' };
  }

  const { error: loeschFehler } = await sitzung.supabase
    .from('kohorten_mitglieder')
    .delete()
    .eq('user_id', teilnehmerId);
  if (loeschFehler) return { ok: false, fehler: deuteFehler(loeschFehler.code, loeschFehler.message) };

  const { error: einfuegeFehler } = await sitzung.supabase
    .from('kohorten_mitglieder')
    .insert({ kohorte_id: kohorteId, user_id: teilnehmerId });
  if (einfuegeFehler) return { ok: false, fehler: deuteFehler(einfuegeFehler.code, einfuegeFehler.message) };

  await protokolliere(sitzung.supabase, {
    akteurId: sitzung.profil.id,
    aktion: 'kohorte_geaendert',
    zielTyp: 'profile',
    zielId: teilnehmerId,
    details: { kohorte_id: kohorteId },
  });
  return { ok: true, daten: undefined };
}
