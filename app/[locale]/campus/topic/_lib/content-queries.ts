import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  contentElementZeileSchema,
  fachbereichSchema,
  fachbereichZeileSchema,
  frageZeileSchema,
  lernkarteZeileSchema,
  lernzielZeileSchema,
  themaEinordnungSchema,
  type ContentElementZeile,
  type Fachbereich,
  type FachbereichZeile,
  type FrageZeile,
  type LernkarteZeile,
  type LernzielZeile,
  type ThemaEinordnung,
} from './content-types';

export type LernmodulDaten = {
  fachbereich: Fachbereich | null;
  thema: ThemaEinordnung | null;
  unterthema: ThemaEinordnung;
  geschwister: ThemaEinordnung[];
  lernziele: LernzielZeile[];
  contentElemente: ContentElementZeile[];
  lernkarten: LernkarteZeile[];
  fragen: FrageZeile[];
};

/**
 * Laedt alle fachlichen Bereiche fuer den Einstieg. RLS und Grants der Basistabellen bleiben aktiv.
 */
export async function ladeFachbereiche(supabase: SupabaseClient): Promise<FachbereichZeile[]> {
  const { data, error } = await supabase
    .from('pruefungsbereiche')
    .select('id, bezeichnung, code, beschreibung, reihenfolge')
    .order('reihenfolge', { ascending: true })
    .order('bezeichnung', { ascending: true });
  if (error) throw new Error(`Fachbereiche konnten nicht geladen werden: ${error.message}`);

  const fachbereiche = fachbereichSchema.array().parse(data ?? []);
  const { data: themenDaten, error: themenFehler } = await supabase
    .from('themen')
    .select('id, pruefungsbereich_id')
    .is('parent_id', null);
  if (themenFehler) throw new Error(`Themenzaehlung konnte nicht geladen werden: ${themenFehler.message}`);

  const zaehler = new Map<string, number>();
  for (const thema of (themenDaten ?? []) as { pruefungsbereich_id: string }[]) {
    zaehler.set(thema.pruefungsbereich_id, (zaehler.get(thema.pruefungsbereich_id) ?? 0) + 1);
  }

  return fachbereichZeileSchema.array().parse(
    fachbereiche.map((fachbereich) => ({
      ...fachbereich,
      themenAnzahl: zaehler.get(fachbereich.id) ?? 0,
    })),
  );
}

/**
 * Laedt einen Fachbereich fuer die Fachkunde-Navigation.
 */
export async function ladeFachbereich(supabase: SupabaseClient, fachbereichId: string): Promise<Fachbereich | null> {
  const { data, error } = await supabase
    .from('pruefungsbereiche')
    .select('id, bezeichnung, code, beschreibung, reihenfolge')
    .eq('id', fachbereichId)
    .maybeSingle();
  if (error) throw new Error(`Fachbereich konnte nicht geladen werden: ${error.message}`);
  return data ? fachbereichSchema.parse(data) : null;
}

/**
 * Laedt die obersten Themen eines Fachbereichs.
 */
export async function ladeThemenFuerFachbereich(
  supabase: SupabaseClient,
  fachbereichId: string,
): Promise<ThemaEinordnung[]> {
  const { data, error } = await supabase
    .from('themen')
    .select('id, pruefungsbereich_id, parent_id, bezeichnung, code, beschreibung, reihenfolge')
    .eq('pruefungsbereich_id', fachbereichId)
    .is('parent_id', null)
    .order('reihenfolge', { ascending: true })
    .order('bezeichnung', { ascending: true });
  if (error) throw new Error(`Themen konnten nicht geladen werden: ${error.message}`);
  return themaEinordnungSchema.array().parse(data ?? []);
}

/**
 * Laedt ein Thema inklusive Parent- und Fachbereichsbezug.
 */
export async function ladeThemaEinordnung(
  supabase: SupabaseClient,
  themaId: string,
): Promise<ThemaEinordnung | null> {
  const { data, error } = await supabase
    .from('themen')
    .select('id, pruefungsbereich_id, parent_id, bezeichnung, code, beschreibung, reihenfolge')
    .eq('id', themaId)
    .maybeSingle();
  if (error) throw new Error(`Thema konnte nicht geladen werden: ${error.message}`);
  return data ? themaEinordnungSchema.parse(data) : null;
}

/**
 * Laedt direkte Unterthemen zu einem Thema.
 */
export async function ladeUnterthemen(supabase: SupabaseClient, themaId: string): Promise<ThemaEinordnung[]> {
  const { data, error } = await supabase
    .from('themen')
    .select('id, pruefungsbereich_id, parent_id, bezeichnung, code, beschreibung, reihenfolge')
    .eq('parent_id', themaId)
    .order('reihenfolge', { ascending: true })
    .order('bezeichnung', { ascending: true });
  if (error) throw new Error(`Unterthemen konnten nicht geladen werden: ${error.message}`);
  return themaEinordnungSchema.array().parse(data ?? []);
}

/**
 * Laedt alle Daten fuer ein Unterthema-Lernmodul mit RLS-geschuetztem Supabase-Client.
 */
export async function ladeLernmodulDaten(
  supabase: SupabaseClient,
  unterthemaId: string,
): Promise<LernmodulDaten | null> {
  const unterthema = await ladeThemaEinordnung(supabase, unterthemaId);
  if (!unterthema) return null;

  const [fachbereich, thema, geschwister, lernziele, contentElemente] = await Promise.all([
    ladeFachbereich(supabase, unterthema.pruefungsbereich_id),
    unterthema.parent_id ? ladeThemaEinordnung(supabase, unterthema.parent_id) : Promise.resolve(null),
    unterthema.parent_id ? ladeUnterthemen(supabase, unterthema.parent_id) : Promise.resolve([unterthema]),
    ladeLernziele(supabase, unterthema.id),
    ladeContentElemente(supabase, unterthema.id),
  ]);

  const lernkarten = await ladeLernkarten(
    supabase,
    contentElemente.filter((element) => element.content_typ === 'lernkarte').map((element) => element.id),
  );
  const fragen = await ladeFragen(
    supabase,
    contentElemente
      .map((element) => element.frage_id)
      .filter((frageId): frageId is string => typeof frageId === 'string'),
  );

  return { fachbereich, thema, unterthema, geschwister, lernziele, contentElemente, lernkarten, fragen };
}

/**
 * Laedt sichtbare Lernziele fuer ein Unterthema.
 */
async function ladeLernziele(supabase: SupabaseClient, unterthemaId: string): Promise<LernzielZeile[]> {
  const { data, error } = await supabase
    .from('lernziele')
    .select('id, titel, beschreibung, schwierigkeitsgrad, ist_demo, demo_label, fachlich_verifiziert')
    .eq('unterthema_id', unterthemaId)
    .order('titel', { ascending: true });
  if (error) throw new Error(`Lernziele konnten nicht geladen werden: ${error.message}`);
  return lernzielZeileSchema.array().parse(data ?? []);
}

/**
 * Laedt sichtbare Content-Elemente fuer ein Unterthema ueber die security-invoker-View.
 */
async function ladeContentElemente(
  supabase: SupabaseClient,
  unterthemaId: string,
): Promise<ContentElementZeile[]> {
  const { data, error } = await supabase
    .from('v_content_elemente_sichtbar')
    .select(
      'id, titel, beschreibung, content_typ, inhalt, schwierigkeitsgrad, status, ist_demo, demo_sichtbar, demo_label, fachlich_verifiziert, ki_anbieter, ki_modell, qualitaetswert, created_at, updated_at, lerneinheit_id, frage_id',
    )
    .eq('unterthema_id', unterthemaId);
  if (error) throw new Error(`Content-Elemente konnten nicht geladen werden: ${error.message}`);
  return contentElementZeileSchema.array().parse(data ?? []);
}

/**
 * Laedt die Rueckseiten der sichtbaren Lernkarten.
 */
async function ladeLernkarten(supabase: SupabaseClient, contentElementIds: string[]): Promise<LernkarteZeile[]> {
  if (contentElementIds.length === 0) return [];
  const { data, error } = await supabase
    .from('lernkarten')
    .select('id, content_element_id, vorderseite, rueckseite, merksatz')
    .in('content_element_id', contentElementIds);
  if (error) throw new Error(`Lernkarten konnten nicht geladen werden: ${error.message}`);
  return lernkarteZeileSchema.array().parse(data ?? []);
}

/**
 * Laedt Fragen und Antwortoptionen aus der bestehenden Fragenstruktur.
 */
async function ladeFragen(supabase: SupabaseClient, frageIds: string[]): Promise<FrageZeile[]> {
  if (frageIds.length === 0) return [];
  const { data, error } = await supabase
    .from('fragen')
    .select('id, typ, aufgabenstellung, schwierigkeit, kern, antwortoptionen(id, text, ist_korrekt, erklaerung, reihenfolge)')
    .in('id', frageIds);
  if (error) throw new Error(`Fragen konnten nicht geladen werden: ${error.message}`);
  return frageZeileSchema.array().parse(data ?? []);
}
