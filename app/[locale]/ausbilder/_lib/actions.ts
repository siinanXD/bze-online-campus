'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createServerSupabase } from '@bze/db/server';

const schema = z.object({
  pruefungsreifeId: z.string().uuid(),
  teilnehmerId: z.string().uuid(),
  kommentar: z.string().max(2000).optional(),
  locale: z.string().min(2).max(8),
});

export async function bestaetigePruefungsreife(input: z.infer<typeof schema>) {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false as const, fehler: 'validation' };

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, fehler: 'auth' };

  const { data: profil } = await supabase.from('profiles').select('rolle').eq('id', user.id).maybeSingle();
  if (!profil || !['ausbilder', 'verwaltung', 'admin'].includes(profil.rolle)) {
    return { ok: false as const, fehler: 'rolle' };
  }

  // Nur zugewiesene Teilnehmer (RLS + explizite Prüfung)
  const { data: zuw } = await supabase
    .from('ausbilder_zuweisungen')
    .select('teilnehmer_id')
    .eq('teilnehmer_id', parsed.data.teilnehmerId)
    .maybeSingle();
  if (!zuw && profil.rolle === 'ausbilder') {
    return { ok: false as const, fehler: 'zuweisung' };
  }

  const { error } = await supabase
    .from('pruefungsreife')
    .update({
      ausbilder_bestaetigt_von: user.id,
      ausbilder_bestaetigt_am: new Date().toISOString(),
      kommentar: parsed.data.kommentar?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', parsed.data.pruefungsreifeId)
    .eq('user_id', parsed.data.teilnehmerId)
    .is('ausbilder_bestaetigt_am', null);

  if (error) return { ok: false as const, fehler: 'db' };

  revalidatePath(`/${parsed.data.locale}/ausbilder/teilnehmer/${parsed.data.teilnehmerId}`);
  revalidatePath(`/${parsed.data.locale}/ausbilder`);
  return { ok: true as const };
}
