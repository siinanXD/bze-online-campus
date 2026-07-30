'use server';
import { z } from 'zod';
import { createServerSupabase } from '@bze/db/server';
import type { VersuchErgebnis } from '@bze/core/mastery';
import { alsKalendertag } from '@bze/core/engagement';

/**
 * Hält fest, dass heute gelernt wurde — Grundlage für Lernserie und Tagesziel.
 *
 * Bewusst serverseitig und nach dem eigentlichen Versuch: das Festhalten darf
 * das Beantworten weder blockieren noch mit einem Fehler überschreiben. Der
 * Kalendertag wird in der Zeitzone der Person gebildet (aus den
 * Push-Einstellungen, sonst Europe/Berlin für den Erstpiloten Euskirchen),
 * damit jemand, der um 23:30 lernt, den richtigen Tag gutgeschrieben bekommt.
 */
async function haltLernaktivitaetFest(
  supabase: Awaited<ReturnType<typeof createServerSupabase>>,
  userId: string,
): Promise<void> {
  try {
    const { data } = await supabase
      .from('push_einstellungen')
      .select('zeitzone')
      .eq('user_id', userId)
      .maybeSingle();
    const tag = alsKalendertag(new Date(), data?.zeitzone ?? 'Europe/Berlin');
    await supabase.rpc('notiere_lernaktivitaet', { p_tag: tag, p_antworten: 1 });
  } catch {
    // Die Lernaktivität ist Beiwerk — ein Fehler hier darf den Versuch nicht
    // beeinträchtigen, der bereits gespeichert ist.
  }
}

const Eingabe = z.object({
  frageId: z.string().uuid(),
  optionId: z.string().uuid(),
  dauerSekunden: z.number().int().nonnegative().max(86400).optional(),
});

export interface AntwortFeedback {
  ergebnis: VersuchErgebnis;
  richtigeOptionId: string | null;
  richtigErklaerung: string | null;
  gewaehltErklaerung: string | null;
}

export async function beantworteMc(input: unknown): Promise<AntwortFeedback> {
  const { frageId, optionId, dauerSekunden } = Eingabe.parse(input);
  const supabase = await createServerSupabase();

  // Korrektheit serverseitig aus der DB (Client kennt ist_korrekt nicht)
  const { data: optionen, error: optErr } = await supabase
    .from('antwortoptionen')
    .select('id,ist_korrekt,erklaerung')
    .eq('frage_id', frageId);
  if (optErr) throw new Error('Optionen konnten nicht geladen werden.');

  const gewaehlt = optionen?.find((o) => o.id === optionId) ?? null;
  const richtig = optionen?.find((o) => o.ist_korrekt) ?? null;
  const istKorrekt = Boolean(gewaehlt?.ist_korrekt);

  const { data, error } = await supabase.rpc('verarbeite_versuch', {
    p_frage_id: frageId,
    p_ist_korrekt: istKorrekt,
    p_antwort: { option_id: optionId },
    p_dauer_sekunden: dauerSekunden ?? null,
    p_antwort_sprache: 'de',
  });
  if (error) throw new Error('Versuch konnte nicht gespeichert werden.');

  const { data: { user } } = await supabase.auth.getUser();
  if (user) await haltLernaktivitaetFest(supabase, user.id);

  return {
    ergebnis: data as VersuchErgebnis,
    richtigeOptionId: richtig?.id ?? null,
    richtigErklaerung: richtig?.erklaerung ?? null,
    gewaehltErklaerung: gewaehlt?.erklaerung ?? null,
  };
}
