import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import { WISSENS_DOKUMENTE_PRO_SEITE, wissensdokumentFilterSchema, type WissensdokumentFilter } from './schemas';
import type { PaginierteWissensdokumentListe, WissensdokumentDetail, WissensdokumentZeile } from './types';

/**
 * Validiert URL-SearchParams fuer die Wissensdatenbank-Liste.
 */
export function parseWissensdokumentFilter(rohdaten: Record<string, string | string[] | undefined>): WissensdokumentFilter {
  const normalisiert = Object.fromEntries(
    Object.entries(rohdaten).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
  );
  return wissensdokumentFilterSchema.parse(normalisiert);
}

/**
 * Laedt die Dokumentliste ueber RLS-geschuetzte Quelldokumente.
 */
export async function ladeWissensdokumentListe(
  supabase: SupabaseClient,
  filter: WissensdokumentFilter,
): Promise<PaginierteWissensdokumentListe> {
  let query = supabase
    .from('quelldokumente')
    .select(
      'id, traeger_id, titel, beschreibung, dateiname, storage_pfad, quelle_typ, dokument_status, index_status, aktiv, mime_type, dateigroesse_bytes, chunk_anzahl, embedding_mock, verarbeitet_am, created_at, updated_at',
      { count: 'exact' },
    )
    .neq('dokument_status', 'geloescht');

  if (filter.q) {
    const suche = filter.q.replace(/[%_,()]/g, '').trim();
    if (suche) query = query.or(`titel.ilike.%${suche}%,dateiname.ilike.%${suche}%,beschreibung.ilike.%${suche}%`);
  }
  if (filter.status === 'aktiv') query = query.eq('aktiv', true);
  if (filter.status === 'fehler') query = query.eq('dokument_status', 'fehler');
  if (filter.status === 'deaktiviert') query = query.eq('aktiv', false);

  const von = (filter.seite - 1) * WISSENS_DOKUMENTE_PRO_SEITE;
  const bis = von + WISSENS_DOKUMENTE_PRO_SEITE - 1;
  const { data, error, count } = await query.order('created_at', { ascending: false }).range(von, bis);
  if (error) throw new Error(`Wissensdokumente konnten nicht geladen werden: ${error.message}`);

  const gesamt = count ?? 0;
  return {
    eintraege: (data ?? []) as WissensdokumentZeile[],
    gesamt,
    seite: filter.seite,
    proSeite: WISSENS_DOKUMENTE_PRO_SEITE,
    seiten: Math.max(1, Math.ceil(gesamt / WISSENS_DOKUMENTE_PRO_SEITE)),
  };
}

/**
 * Laedt ein Wissensdokument mit Chunks und Fehlerhistorie.
 */
export async function ladeWissensdokumentDetail(
  supabase: SupabaseClient,
  id: string,
): Promise<WissensdokumentDetail | null> {
  const { data, error } = await supabase
    .from('quelldokumente')
    .select(
      'id, traeger_id, titel, beschreibung, dateiname, storage_pfad, quelle_typ, dokument_status, index_status, aktiv, mime_type, dateigroesse_bytes, chunk_anzahl, embedding_mock, verarbeitet_am, created_at, updated_at, rohtext, bereinigter_text, verarbeitungsmetadaten',
    )
    .eq('id', id)
    .neq('dokument_status', 'geloescht')
    .maybeSingle();
  if (error) throw new Error(`Wissensdokument konnte nicht geladen werden: ${error.message}`);
  if (!data) return null;

  const [{ data: chunks }, { data: fehler }] = await Promise.all([
    supabase
      .from('wissens_chunks')
      .select('id, quelldokument_id, chunk_index, inhalt, token_schaetzung, text_hash, embedding_metadaten, quellenreferenz, aktiv, created_at')
      .eq('quelldokument_id', id)
      .order('chunk_index', { ascending: true }),
    supabase
      .from('wissens_verarbeitungsfehler')
      .select('id, quelldokument_id, phase, fehlercode, meldung, details, created_at')
      .eq('quelldokument_id', id)
      .order('created_at', { ascending: false }),
  ]);

  return {
    ...(data as WissensdokumentZeile & {
      rohtext: string | null;
      bereinigter_text: string | null;
      verarbeitungsmetadaten: Record<string, unknown>;
    }),
    chunks: (chunks ?? []) as WissensdokumentDetail['chunks'],
    fehler: (fehler ?? []) as WissensdokumentDetail['fehler'],
  };
}
