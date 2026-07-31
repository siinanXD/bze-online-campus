'use server';

import { randomUUID } from 'crypto';
import { revalidatePath } from 'next/cache';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  WISSENS_BUCKET,
  bereinigeDateiname,
  bereinigeWissenstext,
  einfacherHash,
  erstelleWissensChunks,
  istDirektParsebarerWissensTyp,
  validiereWissensdatei,
  wissensStoragePfad,
  type WissensquelleTyp,
} from '@bze/core/content';
import { ladeAdminSitzung } from '../../_lib/auth';
import { protokolliere } from '../../_lib/audit';
import { wissensTextQuelleSchema, wissensdokumentIdSchema } from './_lib/schemas';

type AktionsErgebnis<T = Record<string, never>> = { ok: true; daten: T } | { ok: false; fehler: string };

/**
 * Speichert manuellen Fachtext und verarbeitet ihn direkt zu Chunks.
 */
export async function wissensTextHinzufuegenAction(formData: FormData): Promise<AktionsErgebnis<{ dokumentId: string }>> {
  const sitzung = await ladeAdminSitzung();
  if (!sitzung) return { ok: false, fehler: 'kein_zugriff' };
  const geprueft = wissensTextQuelleSchema.safeParse({
    titel: formData.get('titel'),
    beschreibung: formData.get('beschreibung') ?? '',
    quelleTyp: 'manueller_fachtext',
    text: formData.get('text'),
  });
  if (!geprueft.success) return { ok: false, fehler: 'ungueltige_eingabe' };

  const dokumentId = randomUUID();
  const quelle = await erstelleWissensquelle(sitzung.supabase, {
    traegerId: sitzung.profil.traeger_id,
    userId: sitzung.profil.id,
    titel: geprueft.data.titel,
    beschreibung: geprueft.data.beschreibung || null,
    quelleTyp: 'manueller_fachtext',
  });
  if (!quelle.ok) return quelle;

  const insert = await sitzung.supabase.from('quelldokumente').insert({
    id: dokumentId,
    traeger_id: sitzung.profil.traeger_id,
    wissensquelle_id: quelle.daten.quelleId,
    titel: geprueft.data.titel,
    beschreibung: geprueft.data.beschreibung || null,
    dateiname: `${bereinigeDateiname(geprueft.data.titel)}.txt`,
    typ: 'manueller_fachtext',
    quelle_typ: 'manueller_fachtext',
    dokument_status: 'parsing',
    index_status: 'ausstehend',
    aktiv: true,
    rohtext: geprueft.data.text,
    text_hash: einfacherHash(geprueft.data.text),
    hochgeladen_von: sitzung.profil.id,
    rechte_bestaetigt: true,
    rechte_hinweis: 'Manuell eingegebener Fachtext; Rechte durch Admin bestaetigt.',
  });
  if (insert.error) return { ok: false, fehler: deuteFehler(insert.error.code, insert.error.message) };

  const verarbeitung = await verarbeiteWissensdokument(sitzung.supabase, dokumentId, sitzung.profil.traeger_id, geprueft.data.text, 'manueller_fachtext');
  if (!verarbeitung.ok) return verarbeitung;

  await protokolliere(sitzung.supabase, {
    akteurId: sitzung.profil.id,
    aktion: 'wissensdokument_text_hinzugefuegt',
    zielTyp: 'quelldokumente',
    zielId: dokumentId,
  });
  revalidatePath('/admin/content/wissensdatenbank');
  return { ok: true, daten: { dokumentId } };
}

/**
 * Speichert eine hochgeladene Markdown- oder Textdatei und verarbeitet sie.
 */
export async function wissensDateiHochladenAction(formData: FormData): Promise<AktionsErgebnis<{ dokumentId: string }>> {
  const sitzung = await ladeAdminSitzung();
  if (!sitzung) return { ok: false, fehler: 'kein_zugriff' };
  const datei = formData.get('datei');
  const titel = String(formData.get('titel') ?? '').trim();
  const beschreibung = String(formData.get('beschreibung') ?? '').trim();
  if (!istFormDatei(datei)) return { ok: false, fehler: 'datei_fehlt' };

  const validierung = validiereWissensdatei({ name: datei.name, size: datei.size, type: datei.type });
  if (!validierung.ok) return { ok: false, fehler: validierung.fehler };
  if (!istDirektParsebarerWissensTyp(validierung.quelleTyp)) {
    return { ok: false, fehler: 'parser_noch_nicht_aktiv' };
  }

  const dokumentId = randomUUID();
  const sichererName = bereinigeDateiname(datei.name);
  const storagePfad = wissensStoragePfad({ traegerId: sitzung.profil.traeger_id, dokumentId, dateiname: sichererName });
  const anzeigeTitel = titel || sichererName;
  const quelle = await erstelleWissensquelle(sitzung.supabase, {
    traegerId: sitzung.profil.traeger_id,
    userId: sitzung.profil.id,
    titel: anzeigeTitel,
    beschreibung: beschreibung || null,
    quelleTyp: validierung.quelleTyp,
  });
  if (!quelle.ok) return quelle;

  const upload = await sitzung.supabase.storage.from(WISSENS_BUCKET).upload(storagePfad, datei, {
    contentType: validierung.mimeType,
    upsert: false,
  });
  if (upload.error) return { ok: false, fehler: deuteFehler(undefined, upload.error.message) };

  const text = await datei.text();
  const insert = await sitzung.supabase.from('quelldokumente').insert({
    id: dokumentId,
    traeger_id: sitzung.profil.traeger_id,
    wissensquelle_id: quelle.daten.quelleId,
    titel: anzeigeTitel,
    beschreibung: beschreibung || null,
    dateiname: sichererName,
    original_dateiname: datei.name,
    storage_pfad: storagePfad,
    typ: validierung.quelleTyp,
    quelle_typ: validierung.quelleTyp,
    dokument_status: 'parsing',
    index_status: 'ausstehend',
    aktiv: true,
    mime_type: validierung.mimeType,
    dateigroesse_bytes: datei.size,
    rohtext: text,
    text_hash: einfacherHash(text),
    hochgeladen_von: sitzung.profil.id,
    rechte_bestaetigt: true,
    rechte_hinweis: 'Upload durch berechtigte Admin-/Verwaltungsrolle.',
  });
  if (insert.error) {
    await sitzung.supabase.storage.from(WISSENS_BUCKET).remove([storagePfad]);
    return { ok: false, fehler: deuteFehler(insert.error.code, insert.error.message) };
  }

  const verarbeitung = await verarbeiteWissensdokument(sitzung.supabase, dokumentId, sitzung.profil.traeger_id, text, validierung.quelleTyp);
  if (!verarbeitung.ok) return verarbeitung;

  await protokolliere(sitzung.supabase, {
    akteurId: sitzung.profil.id,
    aktion: 'wissensdokument_datei_hochgeladen',
    zielTyp: 'quelldokumente',
    zielId: dokumentId,
    details: { storagePfad, quelleTyp: validierung.quelleTyp },
  });
  revalidatePath('/admin/content/wissensdatenbank');
  return { ok: true, daten: { dokumentId } };
}

/**
 * Deaktiviert ein Dokument und seine Chunks ohne Datenverlust.
 */
export async function wissensdokumentDeaktivierenAction(input: unknown): Promise<AktionsErgebnis> {
  const sitzung = await ladeAdminSitzung();
  if (!sitzung) return { ok: false, fehler: 'kein_zugriff' };
  const geprueft = wissensdokumentIdSchema.safeParse(input);
  if (!geprueft.success) return { ok: false, fehler: 'ungueltige_id' };

  const { error } = await sitzung.supabase
    .from('quelldokumente')
    .update({ aktiv: false, dokument_status: 'deaktiviert' })
    .eq('id', geprueft.data);
  if (error) return { ok: false, fehler: deuteFehler(error.code, error.message) };
  await sitzung.supabase.from('wissens_chunks').update({ aktiv: false }).eq('quelldokument_id', geprueft.data);
  await protokolliere(sitzung.supabase, {
    akteurId: sitzung.profil.id,
    aktion: 'wissensdokument_deaktiviert',
    zielTyp: 'quelldokumente',
    zielId: geprueft.data,
  });
  revalidatePath('/admin/content/wissensdatenbank');
  return { ok: true, daten: {} };
}

/**
 * Loescht ein Dokument nachvollziehbar aus der Wissensdatenbank.
 */
export async function wissensdokumentLoeschenAction(input: unknown): Promise<AktionsErgebnis> {
  const sitzung = await ladeAdminSitzung();
  if (!sitzung) return { ok: false, fehler: 'kein_zugriff' };
  const geprueft = wissensdokumentIdSchema.safeParse(input);
  if (!geprueft.success) return { ok: false, fehler: 'ungueltige_id' };

  const { data } = await sitzung.supabase.from('quelldokumente').select('storage_pfad').eq('id', geprueft.data).maybeSingle();
  const pfad = (data as { storage_pfad: string | null } | null)?.storage_pfad;
  if (pfad) await sitzung.supabase.storage.from(WISSENS_BUCKET).remove([pfad]);
  const { error } = await sitzung.supabase
    .from('quelldokumente')
    .update({ aktiv: false, dokument_status: 'geloescht' })
    .eq('id', geprueft.data);
  if (error) return { ok: false, fehler: deuteFehler(error.code, error.message) };
  await sitzung.supabase.from('wissens_chunks').update({ aktiv: false }).eq('quelldokument_id', geprueft.data);
  await protokolliere(sitzung.supabase, {
    akteurId: sitzung.profil.id,
    aktion: 'wissensdokument_geloescht',
    zielTyp: 'quelldokumente',
    zielId: geprueft.data,
  });
  revalidatePath('/admin/content/wissensdatenbank');
  return { ok: true, daten: {} };
}

/**
 * Erstellt eine Wissensquelle als fachliche Herkunft des Dokuments.
 */
async function erstelleWissensquelle(
  supabase: SupabaseClient,
  input: {
    traegerId: string;
    userId: string;
    titel: string;
    beschreibung: string | null;
    quelleTyp: WissensquelleTyp;
  },
): Promise<AktionsErgebnis<{ quelleId: string }>> {
  const { data, error } = await supabase
    .from('wissensquellen')
    .insert({
      traeger_id: input.traegerId,
      titel: input.titel,
      beschreibung: input.beschreibung,
      quelle_typ: input.quelleTyp,
      aktiv: true,
      erstellt_von: input.userId,
    })
    .select('id')
    .single();
  if (error) return { ok: false, fehler: deuteFehler(error.code, error.message) };
  return { ok: true, daten: { quelleId: (data as { id: string }).id } };
}

/**
 * Fuehrt Parsing, Bereinigung, Chunking und Mock-Indexierung aus.
 */
async function verarbeiteWissensdokument(
  supabase: SupabaseClient,
  dokumentId: string,
  traegerId: string,
  text: string,
  quelleTyp: WissensquelleTyp,
): Promise<AktionsErgebnis> {
  try {
    const bereinigt = bereinigeWissenstext(text);
    if (bereinigt.length < 20) throw new Error('text_zu_kurz');
    await supabase.from('quelldokumente').update({ dokument_status: 'geparst', bereinigter_text: bereinigt }).eq('id', dokumentId);
    await supabase.from('quelldokumente').update({ dokument_status: 'chunking' }).eq('id', dokumentId);
    const chunks = erstelleWissensChunks(bereinigt);
    if (chunks.length === 0) throw new Error('keine_chunks_erzeugt');
    await supabase.from('wissens_chunks').delete().eq('quelldokument_id', dokumentId);
    const { error: chunkFehler } = await supabase.from('wissens_chunks').insert(
      chunks.map((chunk) => ({
        quelldokument_id: dokumentId,
        traeger_id: traegerId,
        chunk_index: chunk.chunkIndex,
        inhalt: chunk.inhalt,
        token_schaetzung: chunk.tokenSchaetzung,
        text_hash: chunk.textHash,
        embedding_metadaten: chunk.embeddingMetadaten,
        quellenreferenz: {
          ...chunk.quellenreferenz,
          quelle_typ: quelleTyp,
          quelldokument_id: dokumentId,
        },
        aktiv: true,
      })),
    );
    if (chunkFehler) throw new Error(chunkFehler.message);
    const { error: updateFehler } = await supabase
      .from('quelldokumente')
      .update({
        dokument_status: 'indexiert',
        index_status: 'mock_indexiert',
        chunk_anzahl: chunks.length,
        embedding_anbieter: 'mock',
        embedding_modell: 'mock-embedding-v1',
        embedding_dimension: 1536,
        embedding_mock: true,
        verarbeitungsmetadaten: {
          pipeline: ['parsing', 'bereinigung', 'chunking', 'mock_embedding_metadaten', 'speicherung'],
          rag_enabled: process.env.RAG_ENABLED === 'true',
          hinweis: 'Mock-Index: keine externen Embeddings erzeugt.',
        },
        verarbeitet_am: new Date().toISOString(),
      })
      .eq('id', dokumentId);
    if (updateFehler) throw new Error(updateFehler.message);
    return { ok: true, daten: {} };
  } catch (error) {
    const meldung = error instanceof Error ? error.message : 'verarbeitung_fehlgeschlagen';
    await protokolliereVerarbeitungsfehler(supabase, {
      dokumentId,
      traegerId,
      phase: 'verarbeitung',
      fehlercode: meldung,
      meldung,
    });
    await supabase.from('quelldokumente').update({ dokument_status: 'fehler', index_status: 'fehler' }).eq('id', dokumentId);
    return { ok: false, fehler: meldung };
  }
}

/**
 * Speichert einen Verarbeitungsfehler fuer Admin-Transparenz.
 */
async function protokolliereVerarbeitungsfehler(
  supabase: SupabaseClient,
  input: {
    dokumentId: string;
    traegerId: string;
    phase: string;
    fehlercode: string;
    meldung: string;
  },
): Promise<void> {
  await supabase.from('wissens_verarbeitungsfehler').insert({
    quelldokument_id: input.dokumentId,
    traeger_id: input.traegerId,
    phase: input.phase,
    fehlercode: input.fehlercode.slice(0, 120),
    meldung: input.meldung,
  });
}

/**
 * Prueft FormData-Dateien ohne auf browser-spezifische instanceof-Details zu vertrauen.
 */
function istFormDatei(value: FormDataEntryValue | null): value is File {
  return Boolean(
    value
      && typeof value === 'object'
      && 'name' in value
      && 'size' in value
      && 'type' in value
      && 'text' in value,
  );
}

/**
 * Deutet Datenbank- und Storagefehler fuer die Admin-Oberflaeche.
 */
function deuteFehler(code: string | undefined, meldung: string): string {
  if (code === '42501') return 'kein_zugriff';
  if (meldung.includes('violates row-level security')) return 'kein_zugriff';
  return meldung || 'fehler';
}
