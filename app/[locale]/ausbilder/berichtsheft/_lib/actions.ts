'use server';

import { createHash } from 'node:crypto';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createServerSupabase } from '@bze/db/server';
import { signaturKlartext } from '@bze/core/nachweis';

export type AktionsErgebnis = { ok: true } | { ok: false; fehler: string };

async function requireAusbilder() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('nicht_angemeldet');
  const { data: profil } = await supabase
    .from('profiles')
    .select('id, rolle')
    .eq('id', user.id)
    .maybeSingle();
  if (!profil || !['ausbilder', 'verwaltung', 'admin'].includes(profil.rolle)) {
    throw new Error('keine_berechtigung');
  }
  return { supabase, user };
}

const idSchema = z.object({ id: z.string().uuid() });

export async function signiereAlsAusbilder(input: unknown): Promise<AktionsErgebnis> {
  const { id } = idSchema.parse(input);
  const { supabase } = await requireAusbilder();

  const { data: n } = await supabase
    .from('nachweise')
    .select('id, inhalt, rahmenplan_positionen')
    .eq('id', id)
    .maybeSingle();
  if (!n) return { ok: false, fehler: 'nicht_gefunden' };

  const klartext = signaturKlartext({
    nachweisId: n.id,
    status: 'signiert_ausbilder',
    inhalt: n.inhalt as any,
    rahmenplanPositionen: n.rahmenplan_positionen as string[] | null,
  });
  const hash = createHash('sha256').update(klartext).digest('hex');

  const { error } = await supabase.rpc('nachweis_signieren_ausbilder', {
    p_nachweis_id: id,
    p_hash: hash,
  });
  if (error) return { ok: false, fehler: error.message };
  revalidatePath('/[locale]/ausbilder/berichtsheft/[id]', 'page');
  return { ok: true };
}

const beanstandenSchema = z.object({
  id: z.string().uuid(),
  begruendung: z.string().trim().min(3).max(2000),
});

export async function beanstandeNachweis(input: unknown): Promise<AktionsErgebnis> {
  const daten = beanstandenSchema.parse(input);
  const { supabase } = await requireAusbilder();
  const { error } = await supabase.rpc('nachweis_beanstanden', {
    p_nachweis_id: daten.id,
    p_begruendung: daten.begruendung,
  });
  if (error) return { ok: false, fehler: error.message };
  revalidatePath('/[locale]/ausbilder/berichtsheft/[id]', 'page');
  return { ok: true };
}

const korrekturSchema = z.object({
  id: z.string().uuid(),
  inhalt: z.object({
    taetigkeiten: z.string().max(4000).optional().default(''),
    unterweisungen: z.string().max(4000).optional().default(''),
    berufsschulthemen: z.string().max(4000).optional().default(''),
  }),
  begruendung: z.string().trim().min(3).max(2000),
});

/** Korrektur eines signierten Nachweises (Spec §3 Regel 15): dokumentiert. */
export async function korrigiereNachweis(input: unknown): Promise<AktionsErgebnis> {
  const daten = korrekturSchema.parse(input);
  const { supabase } = await requireAusbilder();
  const { error } = await supabase.rpc('nachweis_korrektur', {
    p_nachweis_id: daten.id,
    p_nachher: daten.inhalt,
    p_begruendung: daten.begruendung,
  });
  if (error) return { ok: false, fehler: error.message };
  revalidatePath('/[locale]/ausbilder/berichtsheft/[id]', 'page');
  return { ok: true };
}
