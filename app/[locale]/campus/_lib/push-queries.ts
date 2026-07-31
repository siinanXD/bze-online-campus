/**
 * Lesezugriffe für Push und Lernaktivität.
 *
 * Schichtregel dieses Projekts: hier stehen ausschließlich Abfragen. Nichts in
 * dieser Datei verändert Daten, und nichts trifft eine fachliche Entscheidung —
 * die Werte gehen unverändert in die Domain (`@bze/core/engagement`,
 * `@bze/core/benachrichtigung`), die daraus die Aussagen ableitet.
 */

import { createServerSupabase } from '@bze/db/server';
import {
  alsKalendertag,
  bewerteSerie,
  faelligkeitsUebersicht,
  normalisiereTagesziel,
  STANDARD_TAGESZIEL,
  tageszielStand,
  type FaelligkeitsEintrag,
  type Serie,
  type TageszielStand,
} from '@bze/core/engagement';
import {
  STANDARD_MAX_PRO_TAG,
  STANDARD_STILL_BIS,
  STANDARD_STILL_VON,
  type Anlass,
  type PushEinstellungen,
} from '@bze/core/benachrichtigung';

/** Ein gespeichertes Gerät, wie es die Einstellungen anzeigen. */
export interface GeraeteAnzeige {
  id: string;
  geraet: string;
  zuletztGesendetAm: string | null;
}

/** Alles, was die Einstellungsseite braucht. */
export interface PushEinstellungenSeite {
  einstellungen: PushEinstellungen;
  tagesziel: number;
  geraete: GeraeteAnzeige[];
}

/** Der Fokus-Block auf der Startseite. */
export interface FokusStand {
  serie: Serie;
  tagesziel: TageszielStand;
  pruefungsziel: TageszielStand;
  faellig: { falsch: number; neu: number; wiederholung: number; gesamt: number };
}

/**
 * Wie viele Kalendertage weit die Serie zurückgelesen wird.
 *
 * 400 Tage decken jede erreichbare Serie ab (die längste Ausbildungsphase des
 * Erstpiloten dauert 16 Monate) und begrenzen die Abfrage auf eine Größe, die
 * auch bei tausend Teilnehmenden nicht ins Gewicht fällt.
 */
const SERIE_FENSTER_TAGE = 400;

/** Einstellungen mit den Standardwerten der Domain, wenn noch keine Zeile besteht. */
function standardEinstellungen(): PushEinstellungen {
  return {
    aktiv: false,
    zeitzone: 'Europe/Berlin',
    stillVon: STANDARD_STILL_VON,
    stillBis: STANDARD_STILL_BIS,
    maxProTag: STANDARD_MAX_PRO_TAG,
    abgewaehlt: [],
  };
}

/**
 * Lädt Push-Einstellungen und Geräte einer Person.
 *
 * Wer noch nie etwas eingestellt hat, hat keine Zeile — das ist der Normalfall
 * und liefert die Standardwerte, keinen Fehler.
 */
export async function ladePushEinstellungen(userId: string): Promise<PushEinstellungenSeite> {
  const supabase = await createServerSupabase();

  const [{ data: zeile }, { data: aboZeilen }] = await Promise.all([
    supabase
      .from('push_einstellungen')
      .select('aktiv,zeitzone,still_von,still_bis,max_pro_tag,abgewaehlt,tagesziel')
      .eq('user_id', userId)
      .maybeSingle(),
    supabase
      .from('push_abos')
      .select('id,geraet,zuletzt_gesendet_am')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
  ]);

  const geraete: GeraeteAnzeige[] = (aboZeilen ?? []).map((abo) => ({
    id: abo.id,
    geraet: abo.geraet ?? 'Unbekanntes Gerät',
    zuletztGesendetAm: abo.zuletzt_gesendet_am,
  }));

  if (!zeile) {
    return { einstellungen: standardEinstellungen(), tagesziel: STANDARD_TAGESZIEL, geraete };
  }

  return {
    einstellungen: {
      aktiv: zeile.aktiv,
      zeitzone: zeile.zeitzone,
      stillVon: zeile.still_von,
      stillBis: zeile.still_bis,
      maxProTag: zeile.max_pro_tag,
      abgewaehlt: (zeile.abgewaehlt ?? []) as Anlass[],
    },
    tagesziel: normalisiereTagesziel(zeile.tagesziel),
    geraete,
  };
}

/**
 * Lädt die Aktivitätstage für die Serie.
 *
 * Liefert nur die Tage, nicht die Zählungen — die Serie interessiert sich nur
 * dafür, *ob* an einem Tag gelernt wurde.
 */
async function ladeAktivitaetstage(userId: string, abTag: string): Promise<string[]> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from('lern_aktivitaet')
    .select('tag')
    .eq('user_id', userId)
    .gte('tag', abTag)
    .order('tag', { ascending: false });
  return (data ?? []).map((zeile) => zeile.tag);
}

/** Wie viele Fragen an einem bestimmten Kalendertag beantwortet wurden. */
async function ladeAntwortenAmTag(userId: string, tag: string): Promise<number> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from('lern_aktivitaet')
    .select('antworten')
    .eq('user_id', userId)
    .eq('tag', tag)
    .maybeSingle();
  return data?.antworten ?? 0;
}

/**
 * Zaehlt abgegebene Pruefungen an einem Kalendertag.
 */
async function ladePruefungenAmTag(userId: string, tag: string): Promise<number> {
  const supabase = await createServerSupabase();
  const start = `${tag}T00:00:00`;
  const endeDatum = new Date(`${tag}T00:00:00Z`);
  endeDatum.setUTCDate(endeDatum.getUTCDate() + 1);
  const ende = endeDatum.toISOString();
  const { count } = await supabase
    .from('pruefung_ergebnisse')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .not('abgegeben_am', 'is', null)
    .gte('abgegeben_am', start)
    .lt('abgegeben_am', ende);
  return count ?? 0;
}

/**
 * Lädt die Mastery-Stände für die Fälligkeitsrechnung.
 *
 * Nur freigegebene Fragen: Entwürfe und zurückgewiesene Fragen dürfen nie in
 * einer Fälligkeitszahl auftauchen, sonst verspricht die Startseite Arbeit, die
 * im Lernmodus nicht erscheint.
 */
async function ladeFaelligkeiten(userId: string): Promise<FaelligkeitsEintrag[]> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from('fragen_mastery')
    .select('frage_id,status,naechste_faelligkeit,fragen!inner(status,typ)')
    .eq('user_id', userId)
    .eq('fragen.status', 'freigegeben')
    .eq('fragen.typ', 'mc');

  return (data ?? []).map((zeile) => ({
    frageId: zeile.frage_id,
    status: zeile.status,
    naechsteFaelligkeit: zeile.naechste_faelligkeit,
  }));
}

/**
 * Lädt den Fokus-Stand für die Startseite: Serie, Tagesziel, Fälligkeiten.
 *
 * `jetzt` ist ein Parameter, damit die Funktion in Tests festgelegt werden kann.
 * Der Kalendertag wird in der Zeitzone der Person gebildet, nicht in der des
 * Servers — sonst verliert jemand, der um 23:30 lernt, seinen Tag.
 */
export async function ladeFokusStand(
  userId: string,
  jetzt: Date = new Date(),
): Promise<FokusStand> {
  const { einstellungen, tagesziel } = await ladePushEinstellungen(userId);
  const heute = alsKalendertag(jetzt, einstellungen.zeitzone);
  const fensterStart = alsKalendertag(
    new Date(jetzt.getTime() - SERIE_FENSTER_TAGE * 86_400_000),
    einstellungen.zeitzone,
  );

  const [tage, antwortenHeute, pruefungenHeute, faelligkeiten] = await Promise.all([
    ladeAktivitaetstage(userId, fensterStart),
    ladeAntwortenAmTag(userId, heute),
    ladePruefungenAmTag(userId, heute),
    ladeFaelligkeiten(userId),
  ]);

  return {
    serie: bewerteSerie(tage, heute),
    tagesziel: tageszielStand(antwortenHeute, tagesziel),
    pruefungsziel: tageszielStand(pruefungenHeute, 1),
    faellig: faelligkeitsUebersicht(faelligkeiten, jetzt),
  };
}
