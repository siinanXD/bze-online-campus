import { createServerSupabase } from '@bze/db';
import type { AdminProfil } from './types';

export interface AdminSitzung {
  supabase: Awaited<ReturnType<typeof createServerSupabase>>;
  profil: AdminProfil;
  accessToken: string;
}

/**
 * Server-seitige Rollenprüfung für den gesamten Admin-Bereich (Spec §6.4).
 * RLS auf profiles/audit_log ist die eigentliche Schranke — diese Prüfung
 * verhindert zusätzlich, dass nicht-berechtigte Rollen die Admin-Oberfläche
 * überhaupt zu sehen bekommen (Defense in Depth, siehe AGENTS.md §2).
 *
 * Gibt `null` zurück, wenn nicht angemeldet oder ohne ausreichende Rolle —
 * die aufrufende Seite zeigt dann einen Zugriffsverweigert-Zustand statt
 * eines Redirects auf eine (in diesem Paket nicht vorhandene) Login-Route.
 */
export async function ladeAdminSitzung(): Promise<AdminSitzung | null> {
  const supabase = await createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) return null;

  const { data: profil, error } = await supabase
    .from('profiles')
    .select('id, traeger_id, benutzername, rolle, vorname, nachname, sprache, muss_passwort_aendern, aktiv, letzter_login, created_at')
    .eq('id', session.user.id)
    .maybeSingle();

  if (error || !profil) return null;
  const rolle = (profil as AdminProfil).rolle;
  if (rolle !== 'admin' && rolle !== 'verwaltung') return null;

  return { supabase, profil: profil as AdminProfil, accessToken: session.access_token };
}
