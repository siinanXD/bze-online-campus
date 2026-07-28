import type { createServerSupabase } from '@bze/db';

/**
 * Schreibt einen Eintrag in `audit_log` (Spec §3, §6.4 Nr. 27).
 * RLS erlaubt jeden authentifizierten Insert (`audit_insert ... with check (true)`),
 * das Lesen bleibt Admin vorbehalten (`audit_read`) — siehe supabase/migrations/0001_datenmodell.sql.
 * Diese Funktion wirft nie: eine fehlgeschlagene Protokollierung darf eine
 * bereits ausgeführte Administrationsaktion nicht rückgängig machen, wird aber
 * geloggt, damit sie nicht stillschweigend verschwindet.
 */
export async function protokolliere(
  supabase: Awaited<ReturnType<typeof createServerSupabase>>,
  eintrag: {
    akteurId: string;
    aktion: string;
    zielTyp?: string;
    zielId?: string;
    details?: Record<string, unknown>;
  },
): Promise<void> {
  const { error } = await supabase.from('audit_log').insert({
    akteur_id: eintrag.akteurId,
    aktion: eintrag.aktion,
    ziel_typ: eintrag.zielTyp ?? null,
    ziel_id: eintrag.zielId ?? null,
    details: eintrag.details ?? null,
  });
  if (error) {
    // eslint-disable-next-line no-console
    console.error('[admin] audit_log-Eintrag fehlgeschlagen', eintrag.aktion, error.message);
  }
}
