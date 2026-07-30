import type { createServerSupabase } from '@bze/db/server';

/**
 * Schreibt einen Eintrag in `audit_log` (Spec 3, 6.4 Nr. 27).
 * RLS erlaubt authentifizierten Rollen nur eigene Audit-Inserts.
 * Das Lesen bleibt Admin vorbehalten (`audit_read`) - siehe die additiven Audit-Fix-Migrationen.
 * Diese Funktion wirft nie: eine fehlgeschlagene Protokollierung darf eine
 * bereits ausgefuehrte Administrationsaktion nicht rueckgaengig machen, wird aber
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
