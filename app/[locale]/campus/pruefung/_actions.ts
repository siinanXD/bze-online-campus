'use server';
import { z } from 'zod';
import { createServerSupabase } from '@bze/db/server';
import type { AbgabeErgebnis } from '@bze/core/bewertung';

const Antwort = z.object({
  frage_id: z.string().uuid(),
  option_id: z.string().uuid().nullable().optional(),
  text: z.string().max(5000).nullable().optional(),
});
const Abgabe = z.object({
  ergebnisId: z.string().uuid(),
  antworten: z.array(Antwort).max(60),
});

export async function pruefungStarten(pruefungId: string): Promise<string> {
  const id = z.string().uuid().parse(pruefungId);
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.rpc('pruefung_starten', { p_pruefung_id: id });
  if (error) throw new Error('Prüfung konnte nicht gestartet werden.');
  return data as string;
}

export async function pruefungAbgeben(input: unknown): Promise<AbgabeErgebnis> {
  const { ergebnisId, antworten } = Abgabe.parse(input);
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.rpc('pruefung_abgeben', {
    p_ergebnis_id: ergebnisId,
    p_antworten: antworten,
  });
  if (error) throw new Error('Abgabe fehlgeschlagen.');
  return data as AbgabeErgebnis;
}
