// @ts-nocheck — Deno-Laufzeit (Supabase Edge Function).
//
// Sammelt für eine Person alles, was die Planungs-Domain braucht, und formt es
// in eine `PlanungsEingabe`. Ausschließlich Datenzugriff — keine Entscheidung
// darüber, ob gesendet wird. Diese trifft `planeBenachrichtigungen`.

import {
  alsKalendertag,
  bewerteSerie,
  faelligkeitsUebersicht,
  tageszielStand,
} from '../../../packages/core/engagement/index.ts';

/**
 * Lädt die freigegebenen Mastery-Stände einer Person für die Fälligkeit.
 *
 * Nur MC und nur freigegebene Fragen — dieselbe Einschränkung wie in der
 * Startseiten-Abfrage, damit Push und Anzeige dieselbe Zahl nennen.
 */
async function ladeFaelligkeiten(service, userId: string) {
  const { data } = await service
    .from('fragen_mastery')
    .select('frage_id,status,naechste_faelligkeit,fragen!inner(status,typ)')
    .eq('user_id', userId)
    .eq('fragen.status', 'freigegeben')
    .eq('fragen.typ', 'mc');
  return (data ?? []).map((z) => ({
    frageId: z.frage_id,
    status: z.status,
    naechsteFaelligkeit: z.naechste_faelligkeit,
  }));
}

/** Aktivitätstage der letzten ~400 Tage für die Serie. */
async function ladeAktivitaetstage(service, userId: string, abTag: string) {
  const { data } = await service
    .from('lern_aktivitaet')
    .select('tag')
    .eq('user_id', userId)
    .gte('tag', abTag);
  return (data ?? []).map((z) => z.tag);
}

/** Beantwortete Fragen am heutigen Kalendertag der Person. */
async function ladeAntwortenHeute(service, userId: string, tag: string) {
  const { data } = await service
    .from('lern_aktivitaet')
    .select('antworten')
    .eq('user_id', userId)
    .eq('tag', tag)
    .maybeSingle();
  return data?.antworten ?? 0;
}

/** Fehlt die Wochenprüfung der laufenden ISO-Woche? (grobe Heuristik) */
async function wochenpruefungOffen(service, userId: string): Promise<boolean> {
  // „offen" heißt: es gibt eine laufende (nicht abgegebene) oder gar keine
  // Prüfung dieser Woche. Für die Erinnerung genügt die Feststellung, dass
  // diese Woche noch keine abgegebene Prüfung vorliegt.
  const seit = new Date(Date.now() - 7 * 86_400_000).toISOString();
  const { count } = await service
    .from('pruefungen')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('abgegeben_am', seit);
  return (count ?? 0) === 0;
}

/** Wie viele Ausbilder-Entscheidungen sind der Person noch nicht gemeldet? */
async function offeneEntscheidungen(service, userId: string): Promise<number> {
  // Nachweise, die beanstandet oder gegengezeichnet wurden, seit dem letzten
  // Push zu diesem Anlass. Für die Demo genügt: kürzlich entschiedene Nachweise.
  const seit = new Date(Date.now() - 2 * 86_400_000).toISOString();
  const { count } = await service
    .from('ausbildungsnachweise')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .in('status', ['beanstandet', 'gegengezeichnet'])
    .gte('entschieden_am', seit);
  return count ?? 0;
}

/** Wie viele Wochen im Ausbildungsnachweis fehlen (grob)? */
async function nachweisLuecken(service, userId: string): Promise<number> {
  // Der genaue Lückenabgleich liegt in packages/core/nachweis; für die
  // Erinnerung genügt die Zahl der als offen markierten Wochen der letzten Zeit.
  const { count } = await service
    .from('ausbildungsnachweise')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'offen');
  return count ?? 0;
}

/** Liegt ein ungelesener Wochenbericht vor? */
async function wochenberichtBereit(service, userId: string): Promise<boolean> {
  const { count } = await service
    .from('wochenberichte')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('gelesen', false);
  return (count ?? 0) > 0;
}

/** Protokoll der letzten drei Tage für Tagesdeckel und Mindestpause. */
async function ladeProtokoll(service, userId: string) {
  const seit = new Date(Date.now() - 3 * 86_400_000).toISOString();
  const { data } = await service
    .from('push_protokoll')
    .select('anlass,gesendet_am,tag')
    .eq('user_id', userId)
    .gte('gesendet_am', seit);
  return (data ?? []).map((z) => ({
    anlass: z.anlass,
    gesendetAm: z.gesendet_am,
    tag: z.tag,
  }));
}

/**
 * Baut die vollständige `PlanungsEingabe` für eine Person.
 *
 * Alle Abfragen laufen parallel — es sind unabhängige Zählungen, und bei
 * hunderten aktiven Teilnehmenden summieren sich sonst die Wartezeiten.
 */
export async function baueEingabe(service, einstellungen, jetzt: Date) {
  const { userId, zeitzone } = einstellungen;
  const heute = alsKalendertag(jetzt, zeitzone);
  const fensterStart = alsKalendertag(new Date(jetzt.getTime() - 400 * 86_400_000), zeitzone);

  const [
    faelligkeiten,
    tage,
    antwortenHeute,
    protokoll,
    pruefungOffen,
    entscheidungen,
    luecken,
    berichtBereit,
  ] = await Promise.all([
    ladeFaelligkeiten(service, userId),
    ladeAktivitaetstage(service, userId, fensterStart),
    ladeAntwortenHeute(service, userId, heute),
    ladeProtokoll(service, userId),
    wochenpruefungOffen(service, userId),
    offeneEntscheidungen(service, userId),
    nachweisLuecken(service, userId),
    wochenberichtBereit(service, userId),
  ]);

  const uebersicht = faelligkeitsUebersicht(faelligkeiten, jetzt);
  const serie = bewerteSerie(tage, heute);
  const ziel = tageszielStand(antwortenHeute, einstellungen.tagesziel);

  return {
    userId,
    einstellungen: {
      aktiv: einstellungen.aktiv,
      zeitzone,
      stillVon: einstellungen.stillVon,
      stillBis: einstellungen.stillBis,
      maxProTag: einstellungen.maxProTag,
      abgewaehlt: einstellungen.abgewaehlt,
    },
    protokoll,
    faelligGesamt: uebersicht.gesamt,
    faelligFalsch: uebersicht.falsch,
    serienStatus: serie.status,
    serienLaenge: serie.laenge,
    tageszielOffen: ziel.offen,
    wochenpruefungOffen: pruefungOffen,
    nachweisLuecken: luecken,
    offeneEntscheidungen: entscheidungen,
    wochenberichtBereit: berichtBereit,
  };
}
