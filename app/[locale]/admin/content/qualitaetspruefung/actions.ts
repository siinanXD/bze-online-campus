'use server';

import { revalidatePath } from 'next/cache';
import { pruefeContentQualitaet, regeneriereContentVariante, type ContentSnapshot } from '@bze/core/content';
import type { SupabaseClient } from '@supabase/supabase-js';
import { ladeAdminSitzung } from '../../_lib/auth';
import { protokolliere } from '../../_lib/audit';
import { contentRegenerierenSchema, qualitaetsPruefungStartenSchema } from '../_lib/schemas';

type AktionsErgebnis<T = undefined> = T extends undefined ? { ok: true } | { ok: false; fehler: string } : { ok: true; daten: T } | { ok: false; fehler: string };

/**
 * Startet eine deterministische Qualitaetspruefung fuer ein Content-Element.
 */
export async function qualitaetsPruefungStartenAction(input: unknown): Promise<AktionsErgebnis<{ score: number }>> {
  const sitzung = await ladeAdminSitzung();
  if (!sitzung) return { ok: false, fehler: 'kein_zugriff' };
  const geprueft = qualitaetsPruefungStartenSchema.safeParse(input);
  if (!geprueft.success) return { ok: false, fehler: 'ungueltige_eingabe' };

  const kontext = await ladePruefKontext(sitzung.supabase, geprueft.data.contentId);
  if (!kontext.ok) return kontext;
  const ergebnis = pruefeContentQualitaet({
    id: kontext.daten.content.id,
    titel: kontext.daten.content.titel,
    beschreibung: kontext.daten.content.beschreibung,
    contentTyp: kontext.daten.content.content_typ,
    schwierigkeitsgrad: kontext.daten.content.schwierigkeitsgrad,
    inhalt: kontext.daten.content.inhalt,
    lernziele: kontext.daten.lernziele,
    bestehendeInhalte: kontext.daten.bestehendeInhalte,
    pruefmethode: 'mock_regelpruefung',
    modell: null,
  });

  const { error } = await sitzung.supabase.from('content_qualitaetspruefungen').insert({
    content_element_id: kontext.daten.content.id,
    traeger_id: kontext.daten.content.traeger_id,
    gesamt_score: ergebnis.gesamtScore,
    bewertung: ergebnis.bewertung,
    kriterien: ergebnis.kriterien,
    hinweise: ergebnis.hinweise,
    verbesserungsvorschlaege: ergebnis.verbesserungsvorschlaege,
    duplikate: ergebnis.duplikate,
    text_hash: ergebnis.textHash,
    pruefmethode: ergebnis.pruefmethode,
    modell: ergebnis.modell,
    ist_fachliche_freigabe: ergebnis.istFachlicheFreigabe,
    geprueft_von: sitzung.profil.id,
    geprueft_am: ergebnis.geprueftAm,
  });
  if (error) return { ok: false, fehler: deuteFehler(error.code, error.message) };

  const { error: updateFehler } = await sitzung.supabase
    .from('content_elemente')
    .update({
      qualitaetswert: ergebnis.gesamtScore / 100,
      qualitaetsmetadaten: {
        score: ergebnis.gesamtScore,
        bewertung: ergebnis.bewertung,
        pruefmethode: ergebnis.pruefmethode,
        geprueft_am: ergebnis.geprueftAm,
        fachliche_freigabe: false,
      },
    })
    .eq('id', kontext.daten.content.id);
  if (updateFehler) return { ok: false, fehler: deuteFehler(updateFehler.code, updateFehler.message) };

  await protokolliere(sitzung.supabase, {
    akteurId: sitzung.profil.id,
    aktion: 'content_qualitaet_geprueft',
    zielTyp: 'content_elemente',
    zielId: kontext.daten.content.id,
    details: { score: ergebnis.gesamtScore, bewertung: ergebnis.bewertung },
  });
  revalidatePath('/admin/content');
  return { ok: true, daten: { score: ergebnis.gesamtScore } };
}

/**
 * Regeneriert ein Content-Element deterministisch und speichert vorher eine Version.
 */
export async function contentMitHistorieRegenerierenAction(input: unknown): Promise<AktionsErgebnis<{ versionNr: number }>> {
  const sitzung = await ladeAdminSitzung();
  if (!sitzung) return { ok: false, fehler: 'kein_zugriff' };
  const geprueft = contentRegenerierenSchema.safeParse(input);
  if (!geprueft.success) return { ok: false, fehler: 'ungueltige_eingabe' };

  const { data, error } = await sitzung.supabase
    .from('content_elemente')
    .select('id, traeger_id, titel, beschreibung, content_typ, inhalt, schwierigkeitsgrad, status, qualitaetswert')
    .eq('id', geprueft.data.contentId)
    .maybeSingle();
  if (error) return { ok: false, fehler: deuteFehler(error.code, error.message) };
  if (!data) return { ok: false, fehler: 'content_nicht_gefunden' };

  const content = data as ContentSnapshot & {
    id: string;
    traeger_id: string;
    content_typ: ContentSnapshot['contentTyp'];
    schwierigkeitsgrad: ContentSnapshot['schwierigkeitsgrad'];
    qualitaetswert: number | null;
  };
  const snapshot: ContentSnapshot = {
    titel: content.titel,
    beschreibung: content.beschreibung,
    contentTyp: content.content_typ,
    inhalt: content.inhalt,
    schwierigkeitsgrad: content.schwierigkeitsgrad,
    status: content.status,
    qualitaetswert: content.qualitaetswert,
  };
  const versionNr = await naechsteVersionNr(sitzung.supabase, content.id);
  const version = {
    content_element_id: content.id,
    traeger_id: content.traeger_id,
    version_nr: versionNr,
    titel: snapshot.titel,
    beschreibung: snapshot.beschreibung,
    inhalt: snapshot.inhalt,
    schwierigkeitsgrad: snapshot.schwierigkeitsgrad,
    status: snapshot.status,
    qualitaetswert: snapshot.qualitaetswert,
    aenderungsart: `regenerierung_${geprueft.data.variante}`,
    begruendung: 'Vorherige Fassung vor Regenerierung gesichert.',
    erstellt_von: sitzung.profil.id,
  };
  const { error: versionFehler } = await sitzung.supabase.from('content_versionen').insert(version);
  if (versionFehler) return { ok: false, fehler: deuteFehler(versionFehler.code, versionFehler.message) };

  const neu = regeneriereContentVariante(snapshot, geprueft.data.variante);
  const { error: updateFehler } = await sitzung.supabase
    .from('content_elemente')
    .update({
      titel: neu.titel,
      beschreibung: neu.beschreibung,
      inhalt: neu.inhalt,
      schwierigkeitsgrad: neu.schwierigkeitsgrad,
      status: 'generiert',
      qualitaetswert: null,
      qualitaetsmetadaten: {
        regeneration: geprueft.data.variante,
        hinweis: 'Nach Regenerierung erneut pruefen; Score ist keine fachliche Freigabe.',
      },
    })
    .eq('id', content.id);
  if (updateFehler) return { ok: false, fehler: deuteFehler(updateFehler.code, updateFehler.message) };

  await protokolliere(sitzung.supabase, {
    akteurId: sitzung.profil.id,
    aktion: 'content_regeneriert_mit_historie',
    zielTyp: 'content_elemente',
    zielId: content.id,
    details: { variante: geprueft.data.variante, versionNr },
  });
  revalidatePath('/admin/content');
  return { ok: true, daten: { versionNr } };
}

/**
 * Laedt Content, Lernziele und Vergleichsinhalte fuer die Pruefung.
 */
async function ladePruefKontext(
  supabase: SupabaseClient,
  contentId: string,
): Promise<AktionsErgebnis<{
    content: {
    id: string;
    traeger_id: string;
    titel: string;
    beschreibung: string | null;
    content_typ: ContentSnapshot['contentTyp'];
    schwierigkeitsgrad: ContentSnapshot['schwierigkeitsgrad'];
    inhalt: unknown;
    frage_id: string | null;
  };
  lernziele: string[];
  bestehendeInhalte: Array<{ id: string; titel: string; beschreibung: string | null; inhalt: unknown }>;
}>> {
  const { data, error } = await supabase
    .from('content_elemente')
    .select('id, traeger_id, titel, beschreibung, content_typ, schwierigkeitsgrad, inhalt, frage_id')
    .eq('id', contentId)
    .maybeSingle();
  if (error) return { ok: false, fehler: deuteFehler(error.code, error.message) };
  if (!data) return { ok: false, fehler: 'content_nicht_gefunden' };
  const content = data as {
    id: string;
    traeger_id: string;
    titel: string;
    beschreibung: string | null;
    content_typ: ContentSnapshot['contentTyp'];
    schwierigkeitsgrad: ContentSnapshot['schwierigkeitsgrad'];
    inhalt: unknown;
    frage_id: string | null;
  };
  const [{ data: zielRows }, { data: bestehendeRows }, frageInhalt] = await Promise.all([
    supabase.from('content_element_lernziele').select('lernziele(titel)').eq('content_element_id', content.id),
    supabase
      .from('content_elemente')
      .select('id, titel, beschreibung, inhalt')
      .eq('traeger_id', content.traeger_id)
      .eq('content_typ', content.content_typ)
      .limit(300),
    ladeFrageInhalt(supabase, content.frage_id),
  ]);
  const lernziele = ((zielRows ?? []) as { lernziele: { titel: string } | { titel: string }[] | null }[])
    .flatMap((row) => Array.isArray(row.lernziele) ? row.lernziele : row.lernziele ? [row.lernziele] : [])
    .map((ziel) => ziel.titel);
  return {
    ok: true,
    daten: {
      content: { ...content, inhalt: frageInhalt ? { ...objektInhalt(content.inhalt), ...frageInhalt } : content.inhalt },
      lernziele,
      bestehendeInhalte: (bestehendeRows ?? []) as Array<{ id: string; titel: string; beschreibung: string | null; inhalt: unknown }>,
    },
  };
}

/**
 * Laedt vorhandene Fragen- und Antwortdaten fuer die Qualitaetspruefung.
 */
async function ladeFrageInhalt(supabase: SupabaseClient, frageId: string | null): Promise<Record<string, unknown> | null> {
  if (!frageId) return null;
  const [{ data: frage }, { data: optionen }] = await Promise.all([
    supabase.from('fragen').select('aufgabenstellung').eq('id', frageId).maybeSingle(),
    supabase.from('antwortoptionen').select('text, ist_korrekt, erklaerung').eq('frage_id', frageId).order('reihenfolge'),
  ]);
  return {
    aufgabenstellung: (frage as { aufgabenstellung?: string } | null)?.aufgabenstellung ?? '',
    antwortoptionen: optionen ?? [],
  };
}

/**
 * Normalisiert unbekannte Inhalte fuer Objekt-Merges.
 */
function objektInhalt(inhalt: unknown): Record<string, unknown> {
  return typeof inhalt === 'object' && inhalt !== null ? inhalt as Record<string, unknown> : {};
}

/**
 * Ermittelt die naechste Versionsnummer fuer ein Content-Element.
 */
async function naechsteVersionNr(supabase: SupabaseClient, contentId: string): Promise<number> {
  const { data } = await supabase
    .from('content_versionen')
    .select('version_nr')
    .eq('content_element_id', contentId)
    .order('version_nr', { ascending: false })
    .limit(1)
    .maybeSingle();
  return Number((data as { version_nr?: number } | null)?.version_nr ?? 0) + 1;
}

/**
 * Deutet Datenbankfehler fuer die Admin-Oberflaeche.
 */
function deuteFehler(code: string | undefined, meldung: string): string {
  if (code === '42501') return 'kein_zugriff';
  return meldung || 'fehler';
}
