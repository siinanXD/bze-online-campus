import { createServerSupabase } from '@bze/db/server';
import {
  findeWochenLuecken,
  type NachweisArt,
  type NachweisInhalt,
  type NachweisKurz,
  type NachweisStatus,
  type WochenLuecke,
} from '@bze/core/nachweis';

export interface NachweisVoll {
  id: string;
  userId: string;
  art: NachweisArt;
  zeitraumVon: string | null;
  zeitraumBis: string | null;
  ausbildungsjahr: number | null;
  inhalt: NachweisInhalt;
  rahmenplanPositionen: string[];
  kiFormuliert: boolean;
  status: NachweisStatus;
  createdAt: string;
  updatedAt: string;
}

export interface NachweisKorrektur {
  id: string;
  begruendung: string;
  createdAt: string;
}

function alsInhalt(roh: unknown): NachweisInhalt {
  if (roh && typeof roh === 'object') {
    const o = roh as Record<string, unknown>;
    return {
      taetigkeiten: typeof o.taetigkeiten === 'string' ? o.taetigkeiten : '',
      unterweisungen: typeof o.unterweisungen === 'string' ? o.unterweisungen : '',
      berufsschulthemen: typeof o.berufsschulthemen === 'string' ? o.berufsschulthemen : '',
    };
  }
  return { taetigkeiten: '', unterweisungen: '', berufsschulthemen: '' };
}

/** Liste der eigenen Nachweise (RLS: user_id = auth.uid()). */
export async function ladeNachweise(): Promise<NachweisKurz[]> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from('nachweise')
    .select('id, art, zeitraum_von, zeitraum_bis, ausbildungsjahr, status, ki_formuliert')
    .order('zeitraum_von', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

  return (data ?? []).map((n: any) => ({
    id: n.id,
    art: n.art,
    zeitraumVon: n.zeitraum_von,
    zeitraumBis: n.zeitraum_bis,
    ausbildungsjahr: n.ausbildungsjahr,
    status: n.status,
    kiFormuliert: Boolean(n.ki_formuliert),
  }));
}

/** Ein Nachweis (RLS begrenzt auf eigene bzw. betreute). */
export async function ladeNachweis(id: string): Promise<NachweisVoll | null> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from('nachweise')
    .select('id, user_id, art, zeitraum_von, zeitraum_bis, ausbildungsjahr, inhalt, rahmenplan_positionen, ki_formuliert, status, created_at, updated_at')
    .eq('id', id)
    .maybeSingle();
  if (!data) return null;
  return {
    id: data.id,
    userId: data.user_id,
    art: data.art,
    zeitraumVon: data.zeitraum_von,
    zeitraumBis: data.zeitraum_bis,
    ausbildungsjahr: data.ausbildungsjahr,
    inhalt: alsInhalt(data.inhalt),
    rahmenplanPositionen: Array.isArray(data.rahmenplan_positionen) ? data.rahmenplan_positionen : [],
    kiFormuliert: Boolean(data.ki_formuliert),
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

/** Letzte Beanstandung/Korrektur-Begründung eines Nachweises (falls vorhanden). */
export async function ladeLetzteKorrektur(nachweisId: string): Promise<NachweisKorrektur | null> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from('nachweis_korrekturen')
    .select('id, begruendung, created_at')
    .eq('nachweis_id', nachweisId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!data) return null;
  return { id: data.id, begruendung: data.begruendung, createdAt: data.created_at };
}

/**
 * Katalog der Ausbildungsrahmenplan-Positionen für Vorschläge. Speist sich aus den
 * Prüfungsbereichen und Themen des Berufs (sichtbar per RLS). Fällt auf [] zurück.
 */
export async function ladeRahmenplanKatalog(): Promise<string[]> {
  const supabase = await createServerSupabase();
  const katalog = new Set<string>();
  try {
    const [{ data: bereiche }, { data: themen }] = await Promise.all([
      supabase.from('pruefungsbereiche').select('bezeichnung'),
      supabase.from('themen').select('bezeichnung'),
    ]);
    for (const b of bereiche ?? []) if (b?.bezeichnung) katalog.add(String(b.bezeichnung));
    for (const t of themen ?? []) if (t?.bezeichnung) katalog.add(String(t.bezeichnung));
  } catch {
    /* Katalog ist optional. */
  }
  return [...katalog].sort((a, b) => a.localeCompare(b, 'de'));
}

/**
 * Fehlende Kalenderwochen der letzten `wochen` Wochen bis heute (Wochen-Nachweise).
 * Grundlage der Lückenanzeige (Spec §6.2.14).
 */
export function berechneLuecken(
  nachweise: NachweisKurz[],
  wochen = 12,
): WochenLuecke[] {
  const heute = new Date();
  const bis = heute.toISOString().slice(0, 10);
  const start = new Date(heute.getTime() - wochen * 7 * 86_400_000);
  const von = start.toISOString().slice(0, 10);
  const wochenNachweise = nachweise
    .filter((n) => n.art === 'woche' && n.zeitraumVon)
    .map((n) => ({ von: n.zeitraumVon, bis: n.zeitraumBis }));
  return findeWochenLuecken(wochenNachweise, von, bis);
}
