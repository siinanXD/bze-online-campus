import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import { contentFilterSchema, qualitaetsFilterSchema, type ContentFilter, type QualitaetsFilter } from './schemas';
import type {
  ContentDetail,
  ContentZeile,
  DashboardKennzahlen,
  FachbereichOption,
  LernzielAnsicht,
  LernzielOption,
  PaginierteContentListe,
  PaginierteQualitaetsListe,
  QualitaetsPruefungAnsicht,
  TaxonomieOption,
} from './types';

export const CONTENT_PRO_SEITE = 25;

/**
 * Validiert URL-SearchParams fuer die Content-Liste.
 */
export function parseContentFilter(rohdaten: Record<string, string | string[] | undefined>): ContentFilter {
  const normalisiert = Object.fromEntries(
    Object.entries(rohdaten).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
  );
  return contentFilterSchema.parse(normalisiert);
}

/**
 * Validiert URL-SearchParams fuer die Qualitaetsuebersicht.
 */
export function parseQualitaetsFilter(rohdaten: Record<string, string | string[] | undefined>): QualitaetsFilter {
  const normalisiert = Object.fromEntries(
    Object.entries(rohdaten).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
  );
  return qualitaetsFilterSchema.parse(normalisiert);
}

/**
 * Laedt die Optionen fuer Filter und Formulare.
 */
export async function ladeContentOptionen(supabase: SupabaseClient): Promise<{
  fachbereiche: FachbereichOption[];
  themen: TaxonomieOption[];
}> {
  const [{ data: fachbereiche, error: fachFehler }, { data: themen, error: themenFehler }] = await Promise.all([
    supabase.from('pruefungsbereiche').select('id, bezeichnung').order('reihenfolge', { ascending: true }),
    supabase
      .from('themen')
      .select('id, bezeichnung, parent_id, pruefungsbereich_id')
      .order('reihenfolge', { ascending: true })
      .order('bezeichnung', { ascending: true }),
  ]);
  if (fachFehler) throw new Error(`Fachbereiche konnten nicht geladen werden: ${fachFehler.message}`);
  if (themenFehler) throw new Error(`Themen konnten nicht geladen werden: ${themenFehler.message}`);
  return {
    fachbereiche: (fachbereiche ?? []) as FachbereichOption[],
    themen: (themen ?? []) as TaxonomieOption[],
  };
}

/**
 * Laedt die Auswahlwerte fuer den Mock-Content-Generator.
 */
export async function ladeGeneratorOptionen(supabase: SupabaseClient): Promise<{
  fachbereiche: FachbereichOption[];
  themen: TaxonomieOption[];
  lernziele: LernzielOption[];
}> {
  const [optionen, { data: lernziele, error }] = await Promise.all([
    ladeContentOptionen(supabase),
    supabase
      .from('lernziele')
      .select('id, titel, beschreibung, pruefungsbereich_id, thema_id, unterthema_id, schwierigkeitsgrad')
      .order('titel', { ascending: true }),
  ]);
  if (error) throw new Error(`Lernziele konnten nicht geladen werden: ${error.message}`);
  return {
    ...optionen,
    lernziele: (lernziele ?? []) as LernzielOption[],
  };
}

/**
 * Laedt Dashboard-Kennzahlen ueber RLS-geschuetzte Tabellen.
 */
export async function ladeContentDashboard(supabase: SupabaseClient): Promise<DashboardKennzahlen> {
  const [
    fachbereiche,
    themen,
    unterthemen,
    lernziele,
    quizze,
    erklaerungen,
    fragen,
    lernkarten,
    praxisfaelle,
    rechenaufgaben,
    demoInhalte,
    entwuerfe,
    freigegeben,
    kiGeneriert,
    manuell,
  ] = await Promise.all([
    zaehle(supabase, 'pruefungsbereiche'),
    zaehle(supabase, 'themen', (q) => q.is('parent_id', null)),
    zaehle(supabase, 'themen', (q) => q.not('parent_id', 'is', null)),
    zaehle(supabase, 'lernziele'),
    zaehle(supabase, 'content_quizze'),
    zaehleContent(supabase, (q) => q.eq('content_typ', 'erklaerung')),
    zaehleContent(supabase, (q) => q.in('content_typ', ['single_choice', 'multiple_choice', 'freitext', 'pruefungsnahe_uebungsfrage'])),
    zaehleContent(supabase, (q) => q.eq('content_typ', 'lernkarte')),
    zaehleContent(supabase, (q) => q.eq('content_typ', 'praxisfall')),
    zaehleContent(supabase, (q) => q.eq('content_typ', 'rechenaufgabe')),
    zaehleContent(supabase, (q) => q.eq('ist_demo', true)),
    zaehleContent(supabase, (q) => q.eq('status', 'entwurf')),
    zaehleContent(supabase, (q) => q.eq('status', 'freigegeben')),
    zaehleContent(supabase, (q) => q.not('ki_anbieter', 'is', null)),
    zaehleContent(supabase, (q) => q.or('ki_anbieter.is.null,quellenart.eq.manuell')),
  ]);
  return {
    fachbereiche,
    themen,
    unterthemen,
    lernziele,
    erklaerungen,
    fragen,
    lernkarten,
    praxisfaelle,
    rechenaufgaben,
    quizze,
    demoInhalte,
    entwuerfe,
    freigegeben,
    kiGeneriert,
    manuell,
  };
}

/**
 * Laedt eine paginierte Content-Liste inklusive Anzeigenamen fuer Taxonomie und Lernzielanzahl.
 */
export async function ladeContentListe(
  supabase: SupabaseClient,
  filter: ContentFilter,
): Promise<PaginierteContentListe> {
  let query = supabase
    .from('v_content_elemente_sichtbar')
    .select(
      'id, titel, beschreibung, content_typ, pruefungsbereich_id, thema_id, unterthema_id, lerneinheit_id, frage_id, schwierigkeitsgrad, status, ist_demo, demo_sichtbar, demo_label, fachlich_verifiziert, quellenart, ki_anbieter, ki_modell, qualitaetswert, created_at, updated_at',
      { count: 'exact' },
    );
  query = wendeFilterAn(query, filter);
  query = query.order(filter.sort, { ascending: filter.richtung === 'asc', nullsFirst: false });
  const von = (filter.seite - 1) * CONTENT_PRO_SEITE;
  const bis = von + CONTENT_PRO_SEITE - 1;
  const { data, error, count } = await query.range(von, bis);
  if (error) throw new Error(`Content konnte nicht geladen werden: ${error.message}`);

  const roheEintraege = (data ?? []) as ContentZeile[];
  const [namen, lernzielAnzahl] = await Promise.all([
    ladeTaxonomieNamen(supabase, roheEintraege),
    ladeLernzielAnzahl(supabase, roheEintraege.map((e) => e.id)),
  ]);
  const eintraege = roheEintraege.map((eintrag) => ({
    ...eintrag,
    fachbereich: eintrag.pruefungsbereich_id ? namen.get(eintrag.pruefungsbereich_id) : undefined,
    thema: eintrag.thema_id ? namen.get(eintrag.thema_id) : undefined,
    unterthema: eintrag.unterthema_id ? namen.get(eintrag.unterthema_id) : undefined,
    lernzielAnzahl: lernzielAnzahl.get(eintrag.id) ?? 0,
  }));
  const gesamt = count ?? 0;
  return {
    eintraege,
    gesamt,
    seite: filter.seite,
    proSeite: CONTENT_PRO_SEITE,
    seiten: Math.max(1, Math.ceil(gesamt / CONTENT_PRO_SEITE)),
  };
}

/**
 * Laedt ein Content-Element fuer die Detail-/Bearbeitungsansicht.
 */
export async function ladeContentDetail(supabase: SupabaseClient, id: string): Promise<ContentDetail | null> {
  const { data, error } = await supabase
    .from('v_content_elemente_sichtbar')
    .select(
      'id, titel, beschreibung, content_typ, pruefungsbereich_id, thema_id, unterthema_id, lerneinheit_id, frage_id, inhalt, schwierigkeitsgrad, status, ist_demo, demo_sichtbar, demo_label, fachlich_verifiziert, quellenart, ki_anbieter, ki_modell, qualitaetswert, source_mode, rag_chunk_ids, rag_context_metadaten, created_at, updated_at',
    )
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(`Content-Detail konnte nicht geladen werden: ${error.message}`);
  if (!data) return null;

  const basis = data as ContentDetail;
  const [namen, lernziele, lernkarte, frage, qualitaetspruefungen, versionen, quellen] = await Promise.all([
    ladeTaxonomieNamen(supabase, [basis]),
    ladeLernzieleFuerContent(supabase, id),
    basis.content_typ === 'lernkarte' ? ladeLernkarte(supabase, id) : Promise.resolve(null),
    basis.frage_id ? ladeFrageKurz(supabase, basis.frage_id) : Promise.resolve(null),
    ladeQualitaetspruefungen(supabase, id),
    ladeVersionen(supabase, id),
    ladeContentQuellen(supabase, id),
  ]);
  return {
    ...basis,
    fachbereich: basis.pruefungsbereich_id ? namen.get(basis.pruefungsbereich_id) : undefined,
    thema: basis.thema_id ? namen.get(basis.thema_id) : undefined,
    unterthema: basis.unterthema_id ? namen.get(basis.unterthema_id) : undefined,
    lernziele,
    lernkarte,
    frage,
    qualitaetspruefungen,
    versionen,
    quellen,
  };
}

/**
 * Laedt die Qualitaetsuebersicht mit letztem Pruefergebnis je Content.
 */
export async function ladeQualitaetsUebersicht(
  supabase: SupabaseClient,
  filter: QualitaetsFilter,
): Promise<PaginierteQualitaetsListe> {
  let query = supabase
    .from('v_content_elemente_sichtbar')
    .select(
      'id, titel, beschreibung, content_typ, pruefungsbereich_id, thema_id, unterthema_id, lerneinheit_id, frage_id, schwierigkeitsgrad, status, ist_demo, demo_sichtbar, demo_label, fachlich_verifiziert, quellenart, ki_anbieter, ki_modell, qualitaetswert, created_at, updated_at',
      { count: 'exact' },
    );
  if (filter.q) {
    const suche = filter.q.replace(/[%_,()]/g, '').trim();
    if (suche) query = query.or(`titel.ilike.%${suche}%,beschreibung.ilike.%${suche}%`);
  }
  if (filter.score === 'ohne') query = query.is('qualitaetswert', null);
  if (filter.score === 'problematisch') query = query.lt('qualitaetswert', 0.6);
  if (filter.score === 'pruefen') query = query.gte('qualitaetswert', 0.6).lt('qualitaetswert', 0.8);
  if (filter.score === 'gut') query = query.gte('qualitaetswert', 0.8);
  query = query.order('updated_at', { ascending: false });
  const von = (filter.seite - 1) * CONTENT_PRO_SEITE;
  const bis = von + CONTENT_PRO_SEITE - 1;
  const { data, error, count } = await query.range(von, bis);
  if (error) throw new Error(`Qualitaetsuebersicht konnte nicht geladen werden: ${error.message}`);

  const eintraege = (data ?? []) as ContentZeile[];
  const letzte = await ladeLetztePruefungen(supabase, eintraege);
  const gesamt = count ?? 0;
  return {
    eintraege: eintraege.map((eintrag) => ({ ...eintrag, letztePruefung: letzte.get(eintrag.id) ?? null })),
    gesamt,
    seite: filter.seite,
    proSeite: CONTENT_PRO_SEITE,
    seiten: Math.max(1, Math.ceil(gesamt / CONTENT_PRO_SEITE)),
  };
}

/**
 * Zaehlt eine Tabelle mit optionalem Filter.
 */
async function zaehle(supabase: SupabaseClient, tabelle: string, filter?: (query: any) => any): Promise<number> {
  let query = supabase.from(tabelle).select('id', { count: 'exact', head: true });
  if (filter) query = filter(query);
  const { count, error } = await query;
  if (error) throw new Error(`Zaehlen fehlgeschlagen (${tabelle}): ${error.message}`);
  return count ?? 0;
}

/**
 * Zaehlt Content-Elemente ueber die RLS-geschuetzte View.
 */
async function zaehleContent(supabase: SupabaseClient, filter?: (query: any) => any): Promise<number> {
  return zaehle(supabase, 'v_content_elemente_sichtbar', filter);
}

/**
 * Wendet alle Listenfilter auf eine Supabase-Abfrage an.
 */
function wendeFilterAn(query: any, filter: ContentFilter): any {
  let q = query;
  if (filter.q) {
    const suche = filter.q.replace(/[%_,()]/g, '').trim();
    if (suche) q = q.or(`titel.ilike.%${suche}%,beschreibung.ilike.%${suche}%`);
  }
  if (filter.typ) q = q.eq('content_typ', filter.typ);
  if (filter.fachbereich) q = q.eq('pruefungsbereich_id', filter.fachbereich);
  if (filter.thema) q = q.or(`thema_id.eq.${filter.thema},unterthema_id.eq.${filter.thema}`);
  if (filter.schwierigkeit) q = q.eq('schwierigkeitsgrad', filter.schwierigkeit);
  if (filter.status) q = q.eq('status', filter.status);
  if (filter.quelle) q = q.eq('quellenart', filter.quelle);
  if (filter.demo === 'ja') q = q.eq('ist_demo', true);
  if (filter.demo === 'nein') q = q.eq('ist_demo', false);
  if (filter.qualitaet === 'ohne') q = q.is('qualitaetswert', null);
  if (filter.qualitaet === 'niedrig') q = q.lt('qualitaetswert', 0.5);
  if (filter.qualitaet === 'mittel') q = q.gte('qualitaetswert', 0.5).lt('qualitaetswert', 0.8);
  if (filter.qualitaet === 'hoch') q = q.gte('qualitaetswert', 0.8);
  if (filter.von) q = q.gte('created_at', filter.von);
  if (filter.bis) q = q.lte('created_at', `${filter.bis}T23:59:59.999Z`);
  return q;
}

/**
 * Laedt Anzeigenamen fuer Pruefungsbereiche und Themen.
 */
async function ladeTaxonomieNamen(supabase: SupabaseClient, eintraege: Array<Partial<ContentZeile>>): Promise<Map<string, string>> {
  const fachbereichIds = eindeutige(eintraege.map((e) => e.pruefungsbereich_id));
  const themaIds = eindeutige([...eintraege.map((e) => e.thema_id), ...eintraege.map((e) => e.unterthema_id)]);
  const namen = new Map<string, string>();
  const [{ data: fachbereiche }, { data: themen }] = await Promise.all([
    fachbereichIds.length ? supabase.from('pruefungsbereiche').select('id, bezeichnung').in('id', fachbereichIds) : Promise.resolve({ data: [] }),
    themaIds.length ? supabase.from('themen').select('id, bezeichnung').in('id', themaIds) : Promise.resolve({ data: [] }),
  ]);
  for (const eintrag of (fachbereiche ?? []) as { id: string; bezeichnung: string }[]) namen.set(eintrag.id, eintrag.bezeichnung);
  for (const eintrag of (themen ?? []) as { id: string; bezeichnung: string }[]) namen.set(eintrag.id, eintrag.bezeichnung);
  return namen;
}

/**
 * Zaehlt verknuepfte Lernziele pro Content-Element.
 */
async function ladeLernzielAnzahl(supabase: SupabaseClient, contentIds: string[]): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  if (contentIds.length === 0) return map;
  const { data } = await supabase.from('content_element_lernziele').select('content_element_id').in('content_element_id', contentIds);
  for (const row of (data ?? []) as { content_element_id: string }[]) {
    map.set(row.content_element_id, (map.get(row.content_element_id) ?? 0) + 1);
  }
  return map;
}

/**
 * Laedt Lernziele fuer ein Detail.
 */
async function ladeLernzieleFuerContent(supabase: SupabaseClient, contentId: string): Promise<LernzielAnsicht[]> {
  const { data } = await supabase
    .from('content_element_lernziele')
    .select('lernziele(id, titel, beschreibung)')
    .eq('content_element_id', contentId);
  return ((data ?? []) as { lernziele: LernzielAnsicht | LernzielAnsicht[] | null }[])
    .flatMap((row) => (Array.isArray(row.lernziele) ? row.lernziele : row.lernziele ? [row.lernziele] : []));
}

/**
 * Laedt eine Lernkarte fuer ein Content-Element.
 */
async function ladeLernkarte(supabase: SupabaseClient, contentId: string): Promise<ContentDetail['lernkarte']> {
  const { data } = await supabase
    .from('lernkarten')
    .select('id, vorderseite, rueckseite, merksatz')
    .eq('content_element_id', contentId)
    .maybeSingle();
  return (data as ContentDetail['lernkarte']) ?? null;
}

/**
 * Laedt eine verknuepfte Frage als Kontext, ohne die Fragenverwaltung zu ersetzen.
 */
async function ladeFrageKurz(supabase: SupabaseClient, frageId: string): Promise<ContentDetail['frage']> {
  const { data } = await supabase.from('fragen').select('id, typ, aufgabenstellung, status').eq('id', frageId).maybeSingle();
  return (data as ContentDetail['frage']) ?? null;
}

/**
 * Laedt die letzten Qualitaetspruefungen fuer eine Liste von Content-Elementen.
 */
async function ladeLetztePruefungen(supabase: SupabaseClient, eintraege: ContentZeile[]): Promise<Map<string, QualitaetsPruefungAnsicht>> {
  const map = new Map<string, QualitaetsPruefungAnsicht>();
  const ids = eintraege.map((eintrag) => eintrag.id);
  if (ids.length === 0) return map;
  const { data } = await supabase
    .from('content_qualitaetspruefungen')
    .select('id, content_element_id, gesamt_score, bewertung, kriterien, hinweise, verbesserungsvorschlaege, duplikate, text_hash, pruefmethode, modell, ist_fachliche_freigabe, geprueft_am')
    .in('content_element_id', ids)
    .order('geprueft_am', { ascending: false });
  for (const row of (data ?? []) as QualitaetsPruefungAnsicht[]) {
    if (!map.has(row.content_element_id)) map.set(row.content_element_id, row);
  }
  return map;
}

/**
 * Laedt die Pruefhistorie fuer ein Content-Element.
 */
async function ladeQualitaetspruefungen(supabase: SupabaseClient, contentId: string): Promise<QualitaetsPruefungAnsicht[]> {
  const { data } = await supabase
    .from('content_qualitaetspruefungen')
    .select('id, content_element_id, gesamt_score, bewertung, kriterien, hinweise, verbesserungsvorschlaege, duplikate, text_hash, pruefmethode, modell, ist_fachliche_freigabe, geprueft_am')
    .eq('content_element_id', contentId)
    .order('geprueft_am', { ascending: false })
    .limit(10);
  return (data ?? []) as QualitaetsPruefungAnsicht[];
}

/**
 * Laedt die Versionshistorie fuer ein Content-Element.
 */
async function ladeVersionen(supabase: SupabaseClient, contentId: string): Promise<ContentDetail['versionen']> {
  const { data } = await supabase
    .from('content_versionen')
    .select('id, content_element_id, version_nr, titel, beschreibung, inhalt, schwierigkeitsgrad, status, qualitaetswert, aenderungsart, begruendung, created_at')
    .eq('content_element_id', contentId)
    .order('version_nr', { ascending: false })
    .limit(20);
  return (data ?? []) as ContentDetail['versionen'];
}

/**
 * Laedt gespeicherte Quellen und verwendete RAG-Chunks fuer ein Content-Element.
 */
async function ladeContentQuellen(supabase: SupabaseClient, contentId: string): Promise<ContentDetail['quellen']> {
  const { data } = await supabase
    .from('content_element_quellen')
    .select('quelle_id, fundstelle, content_quellen(id, titel, quellenart, quelldokument_id)')
    .eq('content_element_id', contentId);
  const rows = (data ?? []) as Array<{
    quelle_id: string;
    fundstelle: Record<string, unknown>;
    content_quellen:
      | { id: string; titel: string; quellenart: string; quelldokument_id: string | null }
      | { id: string; titel: string; quellenart: string; quelldokument_id: string | null }[]
      | null;
  }>;
  const chunkIds = eindeutige(rows.flatMap((row) => extrahiereChunkIds(row.fundstelle)));
  const chunks = new Map<string, {
    id: string;
    chunk_index: number;
    inhalt: string;
    similarity: number | null;
    dokument_titel: string | null;
  }>();
  if (chunkIds.length > 0) {
    const { data: chunkRows } = await supabase
      .from('wissens_chunks')
      .select('id, chunk_index, inhalt, quellenreferenz, quelldokumente(titel)')
      .in('id', chunkIds);
    for (const chunk of (chunkRows ?? []) as Array<{
      id: string;
      chunk_index: number;
      inhalt: string;
      quellenreferenz: Record<string, unknown> | null;
      quelldokumente: { titel: string } | { titel: string }[] | null;
    }>) {
      const dokument = Array.isArray(chunk.quelldokumente) ? chunk.quelldokumente[0] : chunk.quelldokumente;
      chunks.set(chunk.id, {
        id: chunk.id,
        chunk_index: chunk.chunk_index,
        inhalt: chunk.inhalt,
        similarity: typeof chunk.quellenreferenz?.similarity === 'number' ? chunk.quellenreferenz.similarity : null,
        dokument_titel: dokument?.titel ?? null,
      });
    }
  }
  return rows.map((row) => {
    const quelle = Array.isArray(row.content_quellen) ? row.content_quellen[0] : row.content_quellen;
    const ids = extrahiereChunkIds(row.fundstelle);
    return {
      quelle_id: row.quelle_id,
      titel: quelle?.titel ?? 'Quelle',
      quellenart: quelle?.quellenart ?? 'unbekannt',
      quelldokument_id: quelle?.quelldokument_id ?? null,
      fundstelle: row.fundstelle ?? {},
      chunks: ids.flatMap((id) => {
        const chunk = chunks.get(id);
        return chunk ? [chunk] : [];
      }),
    };
  });
}

/**
 * Extrahiert Chunk-IDs aus gespeicherten Fundstellen.
 */
function extrahiereChunkIds(fundstelle: Record<string, unknown> | null | undefined): string[] {
  if (!fundstelle) return [];
  const direkteIds = Array.isArray(fundstelle.rag_chunk_ids) ? fundstelle.rag_chunk_ids : [];
  const chunkRefs = Array.isArray(fundstelle.chunks) ? fundstelle.chunks : [];
  return [
    ...direkteIds.filter((wert): wert is string => typeof wert === 'string'),
    ...chunkRefs.flatMap((wert) => {
      if (wert && typeof wert === 'object' && 'chunk_id' in wert && typeof wert.chunk_id === 'string') {
        return [wert.chunk_id];
      }
      return [];
    }),
  ];
}

/**
 * Entfernt Duplikate und Nullwerte.
 */
function eindeutige(werte: Array<string | null | undefined>): string[] {
  return [...new Set(werte.filter((wert): wert is string => typeof wert === 'string'))];
}
