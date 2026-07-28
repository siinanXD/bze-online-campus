'use server';

import { z } from 'zod';
import { createServerSupabase } from '@bze/db/server';

/**
 * Persistenz des Lesefortschritts (SPEC §3 `lerneinheit_fortschritt`, §4.2). RLS erzwingt
 * `user_id = auth.uid()` (siehe `supabase/migrations/0001_datenmodell.sql`), diese Server
 * Actions verlassen sich darauf und schreiben nie im Namen eines anderen Nutzers.
 *
 * Lesezeit-Unterschreitung erzeugt laut SPEC §4.2 nur einen Hinweis, KEINE Sperre — die
 * Server Actions selbst lehnen also nie ab, wenn die Lesezeit kurz war; der Hinweis entsteht
 * rein in der Oberfläche (`_components/fussleiste.tsx`).
 */

export type AktionsErgebnis = { ok: true } | { ok: false; fehler: string };

const abschnittSchema = z.object({
  lerneinheitId: z.string().uuid(),
  abschnittIndex: z.number().int().min(0),
  lesezeitSekunden: z.number().int().min(0).max(24 * 60 * 60),
});

export async function speichereAbschnittFortschritt(
  input: z.infer<typeof abschnittSchema>,
): Promise<AktionsErgebnis> {
  const daten = abschnittSchema.parse(input);
  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { ok: false, fehler: 'nicht_angemeldet' };

  const { error } = await supabase.from('lerneinheit_fortschritt').upsert(
    {
      user_id: auth.user.id,
      lerneinheit_id: daten.lerneinheitId,
      abschnitt_index: daten.abschnittIndex,
      gelesen_am: new Date().toISOString(),
      lesezeit_sekunden: daten.lesezeitSekunden,
    },
    { onConflict: 'user_id,lerneinheit_id,abschnitt_index' },
  );
  return error ? { ok: false, fehler: error.message } : { ok: true };
}

const bewertungSchema = z.object({
  lerneinheitId: z.string().uuid(),
  abschnittIndex: z.number().int().min(0),
  bewertung: z.union([z.literal(1), z.literal(-1)]),
});

/**
 * Daumen hoch/runter (SPEC §6.2.6). Das Datenmodell führt `bewertung` je Abschnitt; die feste
 * Fußleiste bewertet praktisch die ganze Lerneinheit auf einmal — hier bewusst vereinfacht auf
 * den gerade sichtbaren Abschnitt geschrieben (siehe `_components/lesesitzung.tsx`). Offene
 * Frage an AP-01/Produkt: ggf. eigenes Lerneinheit-weites Bewertungsfeld ergänzen.
 */
export async function speichereBewertung(input: z.infer<typeof bewertungSchema>): Promise<AktionsErgebnis> {
  const daten = bewertungSchema.parse(input);
  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { ok: false, fehler: 'nicht_angemeldet' };

  const { error } = await supabase.from('lerneinheit_fortschritt').upsert(
    {
      user_id: auth.user.id,
      lerneinheit_id: daten.lerneinheitId,
      abschnitt_index: daten.abschnittIndex,
      bewertung: daten.bewertung,
    },
    { onConflict: 'user_id,lerneinheit_id,abschnitt_index' },
  );
  return error ? { ok: false, fehler: error.message } : { ok: true };
}
