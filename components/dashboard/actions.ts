'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createServerSupabase } from '@bze/db/server';

const Eingabe = z.object({
  berichtId: z.string().uuid(),
  locale: z.string().min(2).max(5),
});

/**
 * Markiert den Wochenbericht des aufrufenden Teilnehmers als gelesen.
 * Die RLS-sichere RPC `wochenbericht_gelesen` (Migration 0010) stellt sicher,
 * dass nur der Eigentümer seinen eigenen Bericht ändern kann.
 */
export async function markiereWochenberichtGelesen(input: unknown): Promise<{ ok: boolean }> {
  const { berichtId, locale } = Eingabe.parse(input);
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.rpc('wochenbericht_gelesen', { p_bericht_id: berichtId });
  if (error) throw new Error('Wochenbericht konnte nicht als gelesen markiert werden.');
  revalidatePath(`/${locale}/campus`);
  return { ok: Boolean(data) };
}
