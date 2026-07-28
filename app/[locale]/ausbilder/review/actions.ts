'use server';

import { z } from 'zod';
import { createServerSupabase } from '@bze/db/server';

function supabaseOrigin(url: string | undefined): string {
  if (!url) return '';
  try {
    return new URL(url).origin;
  } catch {
    return url.replace(/\/rest\/v1\/?$/i, '').replace(/\/$/, '');
  }
}

async function requireAusbilder() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('nicht_angemeldet');

  const { data: profil } = await supabase
    .from('profiles')
    .select('id, rolle, traeger_id')
    .eq('id', user.id)
    .maybeSingle();

  if (!profil || !['ausbilder', 'verwaltung', 'admin'].includes(profil.rolle)) {
    throw new Error('keine_berechtigung');
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('nicht_angemeldet');

  return { supabase, user, profil, accessToken: session.access_token };
}

const VersuchId = z.object({ versuchId: z.string().uuid() });
const ReviewAktion = z.object({
  reviewId: z.string().uuid(),
  korrigiertePunkte: z.number().min(0).max(20).optional(),
  kommentar: z.string().max(2000).optional(),
  status: z.enum(['bestaetigt', 'korrigiert', 'abgelehnt']),
});

export async function starteKiBewertung(input: unknown) {
  const { versuchId } = VersuchId.parse(input);
  const { accessToken } = await requireAusbilder();

  const basis = supabaseOrigin(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!basis || !anonKey) throw new Error('edge_konfiguration_fehlt');

  const antwort = await fetch(`${basis}/functions/v1/bewerte-freitext`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      apikey: anonKey,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ versuch_id: versuchId }),
    cache: 'no-store',
  });

  const json = await antwort.json().catch(() => ({}));
  if (!antwort.ok) {
    throw new Error(
      typeof json === 'object' && json && 'fehler' in json
        ? String((json as { fehler: string }).fehler)
        : `edge_status_${antwort.status}`,
    );
  }
  return json;
}

export async function schliesseReviewAb(input: unknown) {
  const daten = ReviewAktion.parse(input);
  const { supabase, user } = await requireAusbilder();

  const { data: eintrag, error } = await supabase
    .from('review_queue')
    .select('id, versuch_id, status')
    .eq('id', daten.reviewId)
    .maybeSingle();
  if (error || !eintrag) throw new Error('review_unbekannt');
  if (eintrag.status !== 'offen') throw new Error('review_schon_bearbeitet');

  const { error: updErr } = await supabase
    .from('review_queue')
    .update({
      status: daten.status,
      ausbilder_id: user.id,
      korrigierte_punkte: daten.korrigiertePunkte ?? null,
      kommentar: daten.kommentar ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', daten.reviewId);
  if (updErr) throw new Error('review_speichern_fehlgeschlagen');

  if (daten.status === 'korrigiert' && daten.korrigiertePunkte != null && eintrag.versuch_id) {
    const { data: versuch } = await supabase
      .from('versuche')
      .select('id, pruefung_ergebnis_id, ki_bewertung')
      .eq('id', eintrag.versuch_id)
      .maybeSingle();

    if (versuch) {
      const max =
        typeof versuch.ki_bewertung === 'object' &&
        versuch.ki_bewertung &&
        'max_punkte' in versuch.ki_bewertung
          ? Number((versuch.ki_bewertung as { max_punkte: number }).max_punkte)
          : 4;
      const schwellwert = 0.75;
      await supabase
        .from('versuche')
        .update({
          erzielte_punkte: daten.korrigiertePunkte,
          ist_korrekt: max > 0 ? daten.korrigiertePunkte / max >= schwellwert : false,
        })
        .eq('id', versuch.id);

      if (versuch.pruefung_ergebnis_id) {
        await supabase.rpc('pruefung_freitext_abschliessen', {
          p_ergebnis_id: versuch.pruefung_ergebnis_id,
        });
      }
    }
  }

  return { ok: true };
}
