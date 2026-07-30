import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  themaSchema,
  lerneinheitListeSchema,
  lerneinheitDetailSchema,
  fortschrittZeileSchema,
  type Thema,
  type LerneinheitListe,
  type LerneinheitDetail,
  type FortschrittZeile,
} from './types';

/**
 * Lesender Datenzugriff für die Topic- und Lerneinheit-Lesen-Seiten (SPEC §6.2.5, §6.2.6).
 * RLS regelt den Zugriff (SPEC §3): Teilnehmer sehen nur `lerneinheiten` mit Status
 * `freigegeben`, `lerneinheit_fortschritt` ist auf die eigene Zeile beschränkt. Diese Funktionen
 * verlassen sich bewusst nicht zusätzlich auf Anwendungscode für den Zugriffsschutz
 * (CONTRIBUTING.md §2), sie filtern nur, was ohnehin über RLS sichtbar ist.
 */

export async function holeThema(supabase: SupabaseClient, themaId: string): Promise<Thema | null> {
  const { data, error } = await supabase
    .from('themen')
    .select('id, bezeichnung, code')
    .eq('id', themaId)
    .maybeSingle();
  if (error || !data) return null;
  const geprueft = themaSchema.safeParse(data);
  return geprueft.success ? geprueft.data : null;
}

export async function holeLerneinheitenFuerThema(
  supabase: SupabaseClient,
  themaId: string,
): Promise<LerneinheitListe[]> {
  const { data, error } = await supabase
    .from('lerneinheiten')
    .select('id, titel, lesedauer_minuten, reihenfolge, inhalt_mdx')
    .eq('thema_id', themaId)
    .eq('status', 'freigegeben')
    .order('reihenfolge', { ascending: true });
  if (error || !data) return [];
  const geprueft = lerneinheitListeSchema.array().safeParse(data);
  return geprueft.success ? geprueft.data : [];
}

export async function holeLerneinheit(
  supabase: SupabaseClient,
  lerneinheitId: string,
): Promise<LerneinheitDetail | null> {
  const { data, error } = await supabase
    .from('lerneinheiten')
    .select('id, thema_id, titel, inhalt_mdx, lesedauer_minuten, quellenangaben, reihenfolge')
    .eq('id', lerneinheitId)
    .eq('status', 'freigegeben')
    .maybeSingle();
  if (error || !data) return null;
  const geprueft = lerneinheitDetailSchema.safeParse(data);
  return geprueft.success ? geprueft.data : null;
}

export async function holeFortschritt(
  supabase: SupabaseClient,
  userId: string,
  lerneinheitId: string,
): Promise<FortschrittZeile[]> {
  const { data, error } = await supabase
    .from('lerneinheit_fortschritt')
    .select('abschnitt_index, gelesen_am, lesezeit_sekunden, bewertung')
    .eq('user_id', userId)
    .eq('lerneinheit_id', lerneinheitId);
  if (error || !data) return [];
  const geprueft = fortschrittZeileSchema.array().safeParse(data);
  return geprueft.success ? geprueft.data : [];
}

/**
 * Für die Topic-Übersicht: je Lerneinheit die Menge bereits gelesener `abschnitt_index`-Werte
 * des angemeldeten Nutzers (für die Fortschrittsanzeige "3 von 5 Kapiteln gelesen").
 */
export async function holeFortschrittFuerLerneinheiten(
  supabase: SupabaseClient,
  userId: string | null,
  lerneinheitIds: string[],
): Promise<Map<string, Set<number>>> {
  const ergebnis = new Map<string, Set<number>>();
  if (!userId || lerneinheitIds.length === 0) return ergebnis;
  const { data, error } = await supabase
    .from('lerneinheit_fortschritt')
    .select('lerneinheit_id, abschnitt_index, gelesen_am')
    .eq('user_id', userId)
    .in('lerneinheit_id', lerneinheitIds);
  if (error || !data) return ergebnis;
  for (const zeile of data as { lerneinheit_id: string; abschnitt_index: number; gelesen_am: string | null }[]) {
    if (!zeile.gelesen_am) continue;
    const menge = ergebnis.get(zeile.lerneinheit_id) ?? new Set<number>();
    menge.add(zeile.abschnitt_index);
    ergebnis.set(zeile.lerneinheit_id, menge);
  }
  return ergebnis;
}

/** Angemeldeten Nutzer holen — Seiten bleiben ohne Sitzung nutzbar (nur ohne Fortschrittsanzeige). */
export async function holeAktuellenNutzerId(supabase: SupabaseClient): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

/**
 * `flag_video` steuert die Sichtbarkeit des Abschnitts "Unterricht" (SPEC §6.2.5, §2 Regel 12).
 * Der Träger des angemeldeten Nutzers wird über `profiles.traeger_id` aufgelöst.
 */
export async function holeFlagVideo(supabase: SupabaseClient, userId: string | null): Promise<boolean> {
  if (!userId) return false;
  const { data: profil } = await supabase.from('profiles').select('traeger_id').eq('id', userId).maybeSingle();
  const traegerId = (profil as { traeger_id?: string } | null)?.traeger_id;
  if (!traegerId) return false;
  const { data: traeger } = await supabase.from('traeger').select('einstellungen').eq('id', traegerId).maybeSingle();
  const einstellungen = (traeger as { einstellungen?: Record<string, unknown> } | null)?.einstellungen;
  return einstellungen?.flag_video === true;
}
