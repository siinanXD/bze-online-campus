'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { SupabaseClient } from '@supabase/supabase-js';
import { ladeAdminSitzung } from '../_lib/auth';
import { protokolliere } from '../_lib/audit';
import {
  contentBearbeitenSchema,
  contentBulkArchivierenSchema,
  contentIdSchema,
  contentLoeschenSchema,
  contentStatusAendernSchema,
} from './_lib/schemas';

type AktionsErgebnis = { ok: true } | { ok: false; fehler: string };

/**
 * Bearbeitet die Metadaten und den JSON-Inhalt eines Content-Elements.
 */
export async function contentBearbeitenAction(input: unknown): Promise<AktionsErgebnis> {
  const sitzung = await ladeAdminSitzung();
  if (!sitzung) return { ok: false, fehler: 'kein_zugriff' };
  const geprueft = contentBearbeitenSchema.safeParse(input);
  if (!geprueft.success) return { ok: false, fehler: 'ungueltige_eingabe' };

  let inhalt: unknown;
  try {
    inhalt = JSON.parse(geprueft.data.inhalt);
  } catch {
    return { ok: false, fehler: 'ungueltiges_json' };
  }

  const { id, ...daten } = geprueft.data;
  const { error } = await sitzung.supabase
    .from('content_elemente')
    .update({
      titel: daten.titel,
      beschreibung: daten.beschreibung || null,
      schwierigkeitsgrad: daten.schwierigkeitsgrad,
      status: daten.status,
      ist_demo: daten.ist_demo,
      demo_sichtbar: daten.demo_sichtbar,
      demo_label: daten.demo_label || null,
      fachlich_verifiziert: daten.fachlich_verifiziert,
      quellenart: daten.quellenart,
      ki_anbieter: daten.ki_anbieter || null,
      ki_modell: daten.ki_modell || null,
      qualitaetswert: daten.qualitaetswert ?? null,
      inhalt,
    })
    .eq('id', id);
  if (error) return { ok: false, fehler: deuteFehler(error.code, error.message) };

  await synchronisiereVerknuepfteMetadaten(sitzung.supabase, id, {
    status: daten.status,
    schwierigkeitsgrad: daten.schwierigkeitsgrad,
    ist_demo: daten.ist_demo,
    demo_sichtbar: daten.demo_sichtbar,
    demo_label: daten.demo_label || null,
    fachlich_verifiziert: daten.fachlich_verifiziert,
    quellenart: daten.quellenart,
    ki_anbieter: daten.ki_anbieter || null,
    ki_modell: daten.ki_modell || null,
    qualitaetswert: daten.qualitaetswert ?? null,
  });

  await protokolliere(sitzung.supabase, {
    akteurId: sitzung.profil.id,
    aktion: 'content_bearbeitet',
    zielTyp: 'content_elemente',
    zielId: id,
  });
  revalidatePath('/admin/content');
  return { ok: true };
}

/**
 * Setzt den Status fuer ein oder mehrere Content-Elemente.
 */
export async function contentStatusAendernAction(input: unknown): Promise<AktionsErgebnis> {
  const sitzung = await ladeAdminSitzung();
  if (!sitzung) return { ok: false, fehler: 'kein_zugriff' };
  const geprueft = contentStatusAendernSchema.safeParse(input);
  if (!geprueft.success) return { ok: false, fehler: 'ungueltige_eingabe' };
  const { ids, status } = geprueft.data;

  const { error } = await sitzung.supabase.from('content_elemente').update({ status }).in('id', ids);
  if (error) return { ok: false, fehler: deuteFehler(error.code, error.message) };

  for (const id of ids) {
    await synchronisiereVerknuepfteMetadaten(sitzung.supabase, id, { status });
  }

  await protokolliere(sitzung.supabase, {
    akteurId: sitzung.profil.id,
    aktion: 'content_status_geaendert',
    zielTyp: 'content_elemente',
    details: { ids, status },
  });
  revalidatePath('/admin/content');
  return { ok: true };
}

/**
 * Archiviert mehrere Content-Elemente.
 */
export async function contentBulkArchivierenAction(input: unknown): Promise<AktionsErgebnis> {
  const geprueft = contentBulkArchivierenSchema.safeParse(input);
  if (!geprueft.success) return { ok: false, fehler: 'ungueltige_eingabe' };
  return contentStatusAendernAction({ ids: geprueft.data.ids, status: 'archiviert' });
}

/**
 * Archiviert ein einzelnes Content-Element.
 */
export async function contentArchivierenAction(id: unknown): Promise<AktionsErgebnis> {
  const geprueft = contentIdSchema.safeParse(id);
  if (!geprueft.success) return { ok: false, fehler: 'ungueltige_id' };
  return contentStatusAendernAction({ ids: [geprueft.data], status: 'archiviert' });
}

/**
 * Loescht ein Content-Element. Verknuepfte Fragen oder Lerneinheiten bleiben erhalten.
 */
export async function contentLoeschenAction(input: unknown): Promise<AktionsErgebnis> {
  const sitzung = await ladeAdminSitzung();
  if (!sitzung) return { ok: false, fehler: 'kein_zugriff' };
  const geprueft = contentLoeschenSchema.safeParse(input);
  if (!geprueft.success) return { ok: false, fehler: 'ungueltige_id' };

  const { error } = await sitzung.supabase.from('content_elemente').delete().eq('id', geprueft.data.id);
  if (error) return { ok: false, fehler: deuteFehler(error.code, error.message) };

  await protokolliere(sitzung.supabase, {
    akteurId: sitzung.profil.id,
    aktion: 'content_geloescht',
    zielTyp: 'content_elemente',
    zielId: geprueft.data.id,
  });
  revalidatePath('/admin/content');
  return { ok: true };
}

const syncSchema = z.object({
  status: z.string().optional(),
  schwierigkeitsgrad: z.string().optional(),
  ist_demo: z.boolean().optional(),
  demo_sichtbar: z.boolean().optional(),
  demo_label: z.string().nullable().optional(),
  fachlich_verifiziert: z.boolean().optional(),
  quellenart: z.string().optional(),
  ki_anbieter: z.string().nullable().optional(),
  ki_modell: z.string().nullable().optional(),
  qualitaetswert: z.number().nullable().optional(),
});

/**
 * Haelt die erweiterten Metadaten an bestehenden Lerneinheiten und Fragen konsistent,
 * ohne deren eigene Status- oder Quizlogik zu ersetzen.
 */
async function synchronisiereVerknuepfteMetadaten(
  supabase: SupabaseClient,
  contentId: string,
  input: z.infer<typeof syncSchema>,
): Promise<void> {
  const daten = syncSchema.parse(input);
  const { data } = await supabase
    .from('content_elemente')
    .select('lerneinheit_id, frage_id')
    .eq('id', contentId)
    .maybeSingle();
  const ziel = data as { lerneinheit_id: string | null; frage_id: string | null } | null;
  if (!ziel) return;

  const updates: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(daten)) {
    if (value !== undefined) updates[key] = value;
  }
  if (updates.status) {
    updates.content_status = updates.status;
    delete updates.status;
  }
  if (Object.keys(updates).length === 0) return;

  if (ziel.lerneinheit_id) {
    const { error } = await supabase.from('lerneinheiten').update(updates).eq('id', ziel.lerneinheit_id);
    if (error) throw new Error(error.message || 'lerneinheit_sync_fehlgeschlagen');
  }
  if (ziel.frage_id) {
    const { error } = await supabase.from('fragen').update(updates).eq('id', ziel.frage_id);
    if (error) throw new Error(error.message || 'frage_sync_fehlgeschlagen');
  }
}

/**
 * Deutet Datenbankfehler fuer die Admin-Oberflaeche.
 */
function deuteFehler(code: string | undefined, meldung: string): string {
  if (code === '42501') return 'kein_zugriff';
  return meldung || 'fehler';
}
