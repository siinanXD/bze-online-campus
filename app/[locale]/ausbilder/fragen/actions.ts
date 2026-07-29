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

async function edgeFunktion(pfad: string, accessToken: string, body: unknown) {
  const basis = supabaseOrigin(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!basis || !anonKey) throw new Error('edge_konfiguration_fehlt');

  const antwort = await fetch(`${basis}/functions/v1/${pfad}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      apikey: anonKey,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
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

const GenerierenInput = z.object({
  themaId: z.string().uuid(),
  anzahl: z.number().int().min(1).max(50),
  typ: z.enum(['mc', 'freitext']),
  schwierigkeit: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  zielpool: z.enum(['kern', 'erweiterung']),
  quelldokumentId: z.string().uuid().optional(),
});

export async function generiereFragen(input: unknown) {
  const daten = GenerierenInput.parse(input);
  const { accessToken } = await requireAusbilder();
  return edgeFunktion('generiere-fragen', accessToken, {
    thema_id: daten.themaId,
    anzahl: daten.anzahl,
    typ: daten.typ,
    schwierigkeit: daten.schwierigkeit,
    zielpool: daten.zielpool,
    quelldokument_id: daten.quelldokumentId,
  });
}

const VerifizierenInput = z.object({ frageIds: z.array(z.string().uuid()).min(1).max(50) });

export async function verifiziereFragen(input: unknown) {
  const { frageIds } = VerifizierenInput.parse(input);
  const { accessToken } = await requireAusbilder();
  return edgeFunktion('verifiziere-frage', accessToken, { frage_ids: frageIds });
}

const FrageId = z.object({ frageId: z.string().uuid() });

export async function frageFreigeben(input: unknown) {
  const { frageId } = FrageId.parse(input);
  const { supabase } = await requireAusbilder();
  const { error } = await supabase.rpc('frage_freigeben', { p_frage_id: frageId });
  if (error) throw new Error(error.message || 'freigabe_fehlgeschlagen');
  return { ok: true };
}

const MassenInput = z.object({ frageIds: z.array(z.string().uuid()).min(1).max(200) });

export async function fragenMassenfreigabe(input: unknown) {
  const { frageIds } = MassenInput.parse(input);
  const { supabase } = await requireAusbilder();
  const { data, error } = await supabase.rpc('fragen_freigeben_viele', { p_ids: frageIds });
  if (error) throw new Error(error.message || 'freigabe_fehlgeschlagen');
  return { ok: true, freigegeben: Number(data ?? 0) };
}

const StatusInput = z.object({
  frageId: z.string().uuid(),
  status: z.enum(['entwurf', 'verifiziert', 'freigegeben', 'gesperrt', 'pruefung_noetig']),
});

export async function frageStatusSetzen(input: unknown) {
  const daten = StatusInput.parse(input);
  const { supabase } = await requireAusbilder();
  const { error } = await supabase.rpc('frage_status_setzen', {
    p_frage_id: daten.frageId,
    p_status: daten.status,
  });
  if (error) throw new Error(error.message || 'status_fehlgeschlagen');
  return { ok: true };
}

const OptionEdit = z.object({
  id: z.string().uuid(),
  text: z.string().min(1).max(1000),
  ist_korrekt: z.boolean(),
  erklaerung: z.string().max(2000).optional(),
});

const BearbeitenInput = z.object({
  frageId: z.string().uuid(),
  aufgabenstellung: z.string().min(5).max(4000),
  kern: z.boolean(),
  optionen: z.array(OptionEdit).max(8).optional(),
});

export async function frageBearbeiten(input: unknown) {
  const daten = BearbeitenInput.parse(input);
  const { supabase } = await requireAusbilder();

  // Genau eine korrekte Option ist Pflicht für MC (Spec §5).
  if (daten.optionen && daten.optionen.length > 0) {
    const korrekt = daten.optionen.filter((o) => o.ist_korrekt).length;
    if (daten.optionen.length !== 4 || korrekt !== 1) {
      throw new Error('mc_struktur_ungueltig');
    }
  }

  const { error: frErr } = await supabase
    .from('fragen')
    .update({
      aufgabenstellung: daten.aufgabenstellung,
      kern: daten.kern,
      updated_at: new Date().toISOString(),
    })
    .eq('id', daten.frageId);
  if (frErr) throw new Error(frErr.message || 'speichern_fehlgeschlagen');

  if (daten.optionen) {
    for (const o of daten.optionen) {
      const { error: oErr } = await supabase
        .from('antwortoptionen')
        .update({ text: o.text, ist_korrekt: o.ist_korrekt, erklaerung: o.erklaerung ?? null })
        .eq('id', o.id)
        .eq('frage_id', daten.frageId);
      if (oErr) throw new Error(oErr.message || 'option_speichern_fehlgeschlagen');
    }
  }

  return { ok: true };
}
