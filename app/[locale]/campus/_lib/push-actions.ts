'use server';

/**
 * Schreibzugriffe für Push und Lernaktivität.
 *
 * Schichtregel dieses Projekts: hier stehen ausschließlich Mutationen, jede mit
 * einem Zod-Schema am Eingang. Alle Eingaben kommen aus dem Browser und sind
 * damit grundsätzlich unvertrauenswürdig — auch die, die von unserem eigenen
 * Formular zu kommen scheinen.
 */

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createServerSupabase } from '@bze/db/server';
import {
  MAX_TAGESZIEL,
  MIN_TAGESZIEL,
  normalisiereTagesziel,
} from '@bze/core/engagement';
import { ABSOLUTES_MAX_PRO_TAG } from '@bze/core/benachrichtigung';

export type AktionsErgebnis = { ok: true } | { ok: false; fehler: string };

/** Alle Anlässe — muss mit `push_anlass_t` in Migration 0014 übereinstimmen. */
const ANLAESSE = [
  'faellige_wiederholung',
  'serie_gefaehrdet',
  'tagesziel_offen',
  'wochenpruefung_offen',
  'nachweis_luecke',
  'nachweis_entschieden',
  'wochenbericht_bereit',
] as const;

async function requireNutzer() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('nicht_angemeldet');
  return { supabase, user };
}

/**
 * Endpunkte werden auf HTTPS begrenzt.
 *
 * Ein Endpunkt wird später serverseitig aufgerufen. Ohne diese Prüfung könnte
 * jemand eine interne Adresse eintragen und den Versender als Anfrage-Werkzeug
 * gegen das eigene Netz benutzen.
 */
const endpunkt = z.string().url().max(2000).refine((wert) => wert.startsWith('https://'), {
  message: 'Endpunkt muss HTTPS verwenden',
});

const aboSchema = z.object({
  endpoint: endpunkt,
  p256dh: z.string().min(1).max(500),
  authSecret: z.string().min(1).max(500),
  geraet: z.string().max(120).optional().default(''),
  zeitzone: z.string().max(64).optional().default('Europe/Berlin'),
});

const einstellungenSchema = z.object({
  aktiv: z.boolean(),
  zeitzone: z.string().max(64),
  stillVon: z.number().int().min(0).max(23),
  stillBis: z.number().int().min(0).max(23),
  maxProTag: z.number().int().min(0).max(ABSOLUTES_MAX_PRO_TAG),
  abgewaehlt: z.array(z.enum(ANLAESSE)).max(ANLAESSE.length),
  tagesziel: z.number().int().min(MIN_TAGESZIEL).max(MAX_TAGESZIEL),
});

const tagSchema = z.object({
  tag: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  antworten: z.number().int().min(1).max(500),
});

/**
 * Prüft, ob die Zeitzone dem Server bekannt ist.
 *
 * Ein erfundener Wert würde später jede Berechnung der stillen Zeiten werfen —
 * besser hier auf Berlin zurückfallen als beim Versand scheitern.
 */
function gepruefteZeitzone(wert: string): string {
  try {
    new Intl.DateTimeFormat('en-CA', { timeZone: wert });
    return wert;
  } catch {
    return 'Europe/Berlin';
  }
}

/**
 * Speichert ein Push-Abo dieses Geräts.
 *
 * `upsert` auf `endpoint`: der Browser liefert beim erneuten Abonnieren
 * denselben Endpunkt, und ein zweiter Eintrag würde zu doppelten
 * Benachrichtigungen auf einem Gerät führen. Beim Wiederanmelden werden die
 * Fehlversuche zurückgesetzt — das Gerät hat sich gerade als lebendig erwiesen.
 */
export async function speicherePushAbo(eingabe: unknown): Promise<AktionsErgebnis> {
  const gelesen = aboSchema.safeParse(eingabe);
  if (!gelesen.success) return { ok: false, fehler: 'ungueltige_eingabe' };

  try {
    const { supabase, user } = await requireNutzer();
    const { endpoint, p256dh, authSecret, geraet, zeitzone } = gelesen.data;

    const { error } = await supabase.from('push_abos').upsert(
      {
        user_id: user.id,
        endpoint,
        p256dh,
        auth_secret: authSecret,
        geraet: geraet || null,
        fehlversuche: 0,
      },
      { onConflict: 'endpoint' },
    );
    if (error) return { ok: false, fehler: error.message };

    // Beim ersten Abo die Einstellungen anlegen und aktivieren: wer gerade die
    // Systemabfrage bestätigt hat, will Benachrichtigungen.
    const { error: einstellungsFehler } = await supabase.from('push_einstellungen').upsert(
      { user_id: user.id, aktiv: true, zeitzone: gepruefteZeitzone(zeitzone) },
      { onConflict: 'user_id' },
    );
    if (einstellungsFehler) return { ok: false, fehler: einstellungsFehler.message };

    revalidatePath('/campus/profil');
    return { ok: true };
  } catch {
    return { ok: false, fehler: 'nicht_angemeldet' };
  }
}

/**
 * Entfernt das Abo eines Geräts.
 *
 * Die RLS begrenzt das Löschen auf eigene Zeilen; die zusätzliche Bedingung auf
 * `user_id` ist Absicht, damit die Einschränkung auch ohne RLS gilt.
 */
export async function entfernePushAbo(eingabe: unknown): Promise<AktionsErgebnis> {
  const gelesen = z.object({ endpoint: endpunkt }).safeParse(eingabe);
  if (!gelesen.success) return { ok: false, fehler: 'ungueltige_eingabe' };

  try {
    const { supabase, user } = await requireNutzer();
    const { error } = await supabase
      .from('push_abos')
      .delete()
      .eq('user_id', user.id)
      .eq('endpoint', gelesen.data.endpoint);
    if (error) return { ok: false, fehler: error.message };

    revalidatePath('/campus/profil');
    return { ok: true };
  } catch {
    return { ok: false, fehler: 'nicht_angemeldet' };
  }
}

/** Entfernt ein Gerät anhand seiner Kennung (aus der Geräteliste). */
export async function entfernePushGeraet(eingabe: unknown): Promise<AktionsErgebnis> {
  const gelesen = z.object({ id: z.string().uuid() }).safeParse(eingabe);
  if (!gelesen.success) return { ok: false, fehler: 'ungueltige_eingabe' };

  try {
    const { supabase, user } = await requireNutzer();
    const { error } = await supabase
      .from('push_abos')
      .delete()
      .eq('user_id', user.id)
      .eq('id', gelesen.data.id);
    if (error) return { ok: false, fehler: error.message };

    revalidatePath('/campus/profil');
    return { ok: true };
  } catch {
    return { ok: false, fehler: 'nicht_angemeldet' };
  }
}

/** Speichert Einstellungen und Tagesziel. */
export async function speicherePushEinstellungen(eingabe: unknown): Promise<AktionsErgebnis> {
  const gelesen = einstellungenSchema.safeParse(eingabe);
  if (!gelesen.success) return { ok: false, fehler: 'ungueltige_eingabe' };

  try {
    const { supabase, user } = await requireNutzer();
    const daten = gelesen.data;

    const { error } = await supabase.from('push_einstellungen').upsert(
      {
        user_id: user.id,
        aktiv: daten.aktiv,
        zeitzone: gepruefteZeitzone(daten.zeitzone),
        still_von: daten.stillVon,
        still_bis: daten.stillBis,
        max_pro_tag: daten.maxProTag,
        abgewaehlt: daten.abgewaehlt,
        tagesziel: normalisiereTagesziel(daten.tagesziel),
      },
      { onConflict: 'user_id' },
    );
    if (error) return { ok: false, fehler: error.message };

    revalidatePath('/campus/profil');
    revalidatePath('/campus');
    return { ok: true };
  } catch {
    return { ok: false, fehler: 'nicht_angemeldet' };
  }
}

/**
 * Hält fest, dass heute gelernt wurde.
 *
 * Der Kalendertag kommt vom Client, weil nur er die Zeitzone der Person kennt.
 * Die Datenbankfunktion `notiere_lernaktivitaet` prüft das Format und lehnt
 * Tage in der Zukunft ab — der Wert wird also nicht blind übernommen.
 */
export async function notiereLernaktivitaet(eingabe: unknown): Promise<AktionsErgebnis> {
  const gelesen = tagSchema.safeParse(eingabe);
  if (!gelesen.success) return { ok: false, fehler: 'ungueltige_eingabe' };

  try {
    const { supabase } = await requireNutzer();
    const { error } = await supabase.rpc('notiere_lernaktivitaet', {
      p_tag: gelesen.data.tag,
      p_antworten: gelesen.data.antworten,
    });
    if (error) return { ok: false, fehler: error.message };
    return { ok: true };
  } catch {
    return { ok: false, fehler: 'nicht_angemeldet' };
  }
}
