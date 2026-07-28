'use server';
import { z } from 'zod';
import { createServerSupabase } from '@bze/db/server';
import type { VersuchErgebnis } from '@bze/core/mastery';

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

  return {
    ergebnis: data as VersuchErgebnis,
    richtigeOptionId: richtig?.id ?? null,
    richtigErklaerung: richtig?.erklaerung ?? null,
    gewaehltErklaerung: gewaehlt?.erklaerung ?? null,
  };
}
