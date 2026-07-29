'use server';

import { createHash } from 'node:crypto';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createServerSupabase } from '@bze/db/server';
import {
  NACHWEIS_ART,
  signaturKlartext,
  teilnehmerKannBearbeiten,
  type NachweisStatus,
} from '@bze/core/nachweis';

export type AktionsErgebnis =
  | { ok: true; id?: string }
  | { ok: false; fehler: string };

function supabaseOrigin(url: string | undefined): string {
  if (!url) return '';
  try {
    return new URL(url).origin;
  } catch {
    return url.replace(/\/rest\/v1\/?$/i, '').replace(/\/$/, '');
  }
}

async function requireTeilnehmer() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('nicht_angemeldet');
  return { supabase, user };
}

const inhaltSchema = z.object({
  taetigkeiten: z.string().max(4000).optional().default(''),
  unterweisungen: z.string().max(4000).optional().default(''),
  berufsschulthemen: z.string().max(4000).optional().default(''),
});

const datum = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .optional()
  .nullable();

const erstellenSchema = z.object({
  art: z.enum(NACHWEIS_ART),
  zeitraumVon: datum,
  zeitraumBis: datum,
  ausbildungsjahr: z.number().int().min(1).max(4).nullable().optional(),
  inhalt: inhaltSchema,
  rahmenplanPositionen: z.array(z.string().max(200)).max(20).optional().default([]),
  kiFormuliert: z.boolean().optional().default(false),
});

const aktualisierenSchema = erstellenSchema.extend({ id: z.string().uuid() });

export async function erstelleNachweis(input: unknown): Promise<AktionsErgebnis> {
  const daten = erstellenSchema.parse(input);
  const { supabase, user } = await requireTeilnehmer();

  const { data, error } = await supabase
    .from('nachweise')
    .insert({
      user_id: user.id,
      art: daten.art,
      zeitraum_von: daten.zeitraumVon ?? null,
      zeitraum_bis: daten.zeitraumBis ?? null,
      ausbildungsjahr: daten.ausbildungsjahr ?? null,
      inhalt: daten.inhalt,
      rahmenplan_positionen: daten.rahmenplanPositionen,
      ki_formuliert: daten.kiFormuliert,
      status: 'entwurf',
    })
    .select('id')
    .single();

  if (error || !data) return { ok: false, fehler: error?.message ?? 'speichern_fehlgeschlagen' };
  revalidatePath('/[locale]/campus/berichtsheft', 'page');
  return { ok: true, id: data.id };
}

export async function aktualisiereNachweis(input: unknown): Promise<AktionsErgebnis> {
  const daten = aktualisierenSchema.parse(input);
  const { supabase, user } = await requireTeilnehmer();

  const { data: vorhanden } = await supabase
    .from('nachweise')
    .select('id, user_id, status')
    .eq('id', daten.id)
    .maybeSingle();
  if (!vorhanden || vorhanden.user_id !== user.id) return { ok: false, fehler: 'nicht_gefunden' };
  if (!teilnehmerKannBearbeiten(vorhanden.status as NachweisStatus)) {
    return { ok: false, fehler: 'gesperrt' };
  }

  const { error } = await supabase
    .from('nachweise')
    .update({
      art: daten.art,
      zeitraum_von: daten.zeitraumVon ?? null,
      zeitraum_bis: daten.zeitraumBis ?? null,
      ausbildungsjahr: daten.ausbildungsjahr ?? null,
      inhalt: daten.inhalt,
      rahmenplan_positionen: daten.rahmenplanPositionen,
      ki_formuliert: daten.kiFormuliert,
      updated_at: new Date().toISOString(),
    })
    .eq('id', daten.id);

  if (error) return { ok: false, fehler: error.message };
  revalidatePath(`/[locale]/campus/berichtsheft/[id]`, 'page');
  return { ok: true, id: daten.id };
}

const idSchema = z.object({ id: z.string().uuid() });

export async function reicheEin(input: unknown): Promise<AktionsErgebnis> {
  const { id } = idSchema.parse(input);
  const { supabase } = await requireTeilnehmer();
  const { error } = await supabase.rpc('nachweis_einreichen', { p_nachweis_id: id });
  if (error) return { ok: false, fehler: error.message };
  revalidatePath(`/[locale]/campus/berichtsheft/[id]`, 'page');
  return { ok: true, id };
}

export async function signiereNachweis(input: unknown): Promise<AktionsErgebnis> {
  const { id } = idSchema.parse(input);
  const { supabase } = await requireTeilnehmer();

  const { data: n } = await supabase
    .from('nachweise')
    .select('id, status, inhalt, rahmenplan_positionen')
    .eq('id', id)
    .maybeSingle();
  if (!n) return { ok: false, fehler: 'nicht_gefunden' };

  const klartext = signaturKlartext({
    nachweisId: n.id,
    status: 'signiert_teilnehmer',
    inhalt: n.inhalt as any,
    rahmenplanPositionen: n.rahmenplan_positionen as string[] | null,
  });
  const hash = createHash('sha256').update(klartext).digest('hex');

  const { error } = await supabase.rpc('nachweis_signieren_teilnehmer', {
    p_nachweis_id: id,
    p_hash: hash,
  });
  if (error) return { ok: false, fehler: error.message };
  revalidatePath(`/[locale]/campus/berichtsheft/[id]`, 'page');
  return { ok: true, id };
}

const exportSchema = z.object({ nachweisId: z.string().uuid().optional() });

/**
 * Holt das druckfertige HTML des Ausbildungsnachweises von der Edge Function
 * `berichtsheft-pdf`. Rückgabe als String, den der Client als Blob öffnet.
 */
export async function holeBerichtsheftHtml(
  input: unknown,
): Promise<{ ok: true; html: string; dateiname: string } | { ok: false; fehler: string }> {
  const daten = exportSchema.parse(input ?? {});
  const supabase = await createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) return { ok: false, fehler: 'nicht_angemeldet' };

  const basis = supabaseOrigin(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!basis || !anonKey) return { ok: false, fehler: 'edge_konfiguration_fehlt' };

  try {
    const antwort = await fetch(`${basis}/functions/v1/berichtsheft-pdf`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        apikey: anonKey,
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(daten.nachweisId ? { nachweis_id: daten.nachweisId } : {}),
      cache: 'no-store',
    });
    if (!antwort.ok) return { ok: false, fehler: `edge_status_${antwort.status}` };
    const html = await antwort.text();
    return { ok: true, html, dateiname: 'ausbildungsnachweis.html' };
  } catch (e) {
    return { ok: false, fehler: e instanceof Error ? e.message : 'edge_unerreichbar' };
  }
}

const kiSchema = z.object({
  art: z.enum(NACHWEIS_ART),
  zeitraumVon: datum,
  zeitraumBis: datum,
  inhalt: inhaltSchema,
  rahmenplanKatalog: z.array(z.string()).max(60).optional().default([]),
});

export type KiFormulierung = {
  taetigkeiten: string;
  unterweisungen: string;
  berufsschulthemen: string;
  rahmenplan_positionen: string[];
};

/** Ruft die Edge Function `formuliere-nachweis` (KI-Formulierungshilfe). */
export async function formuliereMitKi(
  input: unknown,
): Promise<
  | { ok: true; formulierung: KiFormulierung; hinweis: string }
  | { ok: false; fehler: string }
> {
  const daten = kiSchema.parse(input);
  const supabase = await createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) return { ok: false, fehler: 'nicht_angemeldet' };

  const basis = supabaseOrigin(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!basis || !anonKey) return { ok: false, fehler: 'edge_konfiguration_fehlt' };

  try {
    const antwort = await fetch(`${basis}/functions/v1/formuliere-nachweis`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        apikey: anonKey,
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        art: daten.art,
        zeitraum_von: daten.zeitraumVon,
        zeitraum_bis: daten.zeitraumBis,
        taetigkeiten: daten.inhalt.taetigkeiten,
        unterweisungen: daten.inhalt.unterweisungen,
        berufsschulthemen: daten.inhalt.berufsschulthemen,
        rahmenplan_katalog: daten.rahmenplanKatalog,
      }),
      cache: 'no-store',
    });
    const json = await antwort.json().catch(() => ({}));
    if (!antwort.ok) {
      return {
        ok: false,
        fehler:
          typeof json === 'object' && json && 'fehler' in json
            ? String((json as { fehler: string }).fehler)
            : `edge_status_${antwort.status}`,
      };
    }
    return {
      ok: true,
      formulierung: json.formulierung as KiFormulierung,
      hinweis: String(json.hinweis_ki_formulierungshilfe ?? 'KI-Formulierungshilfe — Inhalte stammen von dir.'),
    };
  } catch (e) {
    return { ok: false, fehler: e instanceof Error ? e.message : 'edge_unerreichbar' };
  }
}
