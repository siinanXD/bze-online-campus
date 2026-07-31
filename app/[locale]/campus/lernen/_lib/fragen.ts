import { createServerSupabase } from '@bze/db/server';
import type { FrageMitStand, LernFrage, MasteryState, MasteryStatus } from '@bze/core/mastery';

export type FragenGruppe = 'alle' | 'falsch' | 'fast_fertig' | 'neu' | 'abgeschlossen';

export interface FragenKategorie {
  id: FragenGruppe;
  label: string;
  beschreibung: string;
  anzahl: number;
}

export interface FrageMitThemaStand extends FrageMitStand {
  themaId: string;
}

export interface ThemaKategorie {
  id: string;
  bezeichnung: string;
  ausbildungsjahr: number;
  phaseId: string | null;
  phaseBezeichnung: string | null;
  pruefungsbereichId: string | null;
  pruefungsbereichBezeichnung: string | null;
  gesamt: number;
  fertig: number;
  falsch: number;
  fastFertig: number;
  neu: number;
}

export interface CuatalBlock {
  cuatal: number;
  themen: ThemaKategorie[];
  gesamt: number;
  fertig: number;
  falsch: number;
  fastFertig: number;
  neu: number;
  prozent: number;
}

export interface UeberthemaBlock {
  id: string;
  bezeichnung: string;
  themenIds: string[];
  gesamt: number;
  fertig: number;
  falsch: number;
  fastFertig: number;
  neu: number;
  prozent: number;
}

export interface FragenUebersicht {
  items: FrageMitThemaStand[];
  gruppen: FragenKategorie[];
  themen: ThemaKategorie[];
}

interface FrageRow {
  id: string;
  typ: LernFrage['typ'];
  aufgabenstellung: string;
  bild_url: string | null;
  schwierigkeit: number | null;
  kern: boolean;
  thema_id: string;
  tabellenbuch_fundstelle: LernFrage['tabellenbuch_fundstelle'];
  themen: ThemaRow | ThemaRow[] | null;
  antwortoptionen: { id: string; text: string; reihenfolge: number }[] | null;
}

interface ThemaRow {
  id: string;
  bezeichnung: string;
  pruefungsbereiche?: PruefungsbereichRow | PruefungsbereichRow[] | null;
}

interface PruefungsbereichRow {
  id: string;
  bezeichnung: string;
  ausbildungsphasen?: PhaseRow | PhaseRow[] | null;
}

interface PhaseRow {
  id: string;
  bezeichnung: string;
  reihenfolge: number | null;
}

const GRUPPEN_TEXTE: Record<FragenGruppe, Omit<FragenKategorie, 'id' | 'anzahl'>> = {
  alle: {
    label: 'Alle offenen Fragen',
    beschreibung: 'Falsche zuerst, dann neue und fast fertige Fragen.',
  },
  falsch: {
    label: 'Fehler wiederholen',
    beschreibung: 'Alles, was zuletzt falsch war.',
  },
  fast_fertig: {
    label: 'Kurz vorm Abschluss',
    beschreibung: 'Schon einmal richtig, jetzt festigen.',
  },
  neu: {
    label: 'Noch nicht beantwortet',
    beschreibung: 'Frische Fragen aus dem Pool.',
  },
  abgeschlossen: {
    label: 'Abgeschlossen',
    beschreibung: 'Sitzt aktuell sicher.',
  },
};

/**
 * Wandelt einen Query-String in eine bekannte Fragegruppe um.
 */
export function normalisiereFragenGruppe(value: string | string[] | undefined): FragenGruppe {
  const rawValue = Array.isArray(value) ? value[0] : value;
  if (
    rawValue === 'falsch' ||
    rawValue === 'fast_fertig' ||
    rawValue === 'neu' ||
    rawValue === 'abgeschlossen'
  ) {
    return rawValue;
  }
  return 'alle';
}

/**
 * Ermittelt den sichtbaren Lernstatus einer Frage.
 */
export function frageStatus(mastery: MasteryState | null): FragenGruppe {
  if (!mastery || mastery.status === 'neu') return 'neu';
  if (mastery.status === 'falsch') return 'falsch';
  if (mastery.status === 'einmal_richtig') return 'fast_fertig';
  return 'abgeschlossen';
}

/**
 * Sortiert Fragen so, dass der naechste sinnvolle Lernschritt oben steht.
 */
export function sortiereFragenQueue(items: FrageMitStand[]): LernFrage[] {
  const prioritaet: Record<FragenGruppe, number> = {
    falsch: 1,
    neu: 2,
    fast_fertig: 3,
    alle: 4,
    abgeschlossen: 5,
  };

  return [...items]
    .sort((a, b) => {
      const statusDiff = prioritaet[frageStatus(a.mastery)] - prioritaet[frageStatus(b.mastery)];
      if (statusDiff !== 0) return statusDiff;
      const streakDiff = (b.mastery?.streak ?? 0) - (a.mastery?.streak ?? 0);
      if (streakDiff !== 0) return streakDiff;
      return a.frage.aufgabenstellung.localeCompare(b.frage.aufgabenstellung, 'de');
    })
    .map((item) => item.frage);
}

/**
 * Filtert Fragen nach dem vom Nutzer gewaelten Lernmodus.
 */
export function filtereFragenGruppe(items: FrageMitStand[], gruppe: FragenGruppe): FrageMitStand[] {
  if (gruppe === 'alle') {
    return items.filter((item) => frageStatus(item.mastery) !== 'abgeschlossen');
  }
  return items.filter((item) => frageStatus(item.mastery) === gruppe);
}

/**
 * Wandelt den Query-String fuer einen Cuatal in einen gueltigen Block um.
 */
export function normalisiereCuatal(value: string | string[] | undefined): number | null {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const parsed = rawValue ? Number.parseInt(rawValue, 10) : Number.NaN;
  if (!Number.isFinite(parsed) || parsed < 1 || parsed > 4) return null;
  return parsed;
}

/**
 * Teilt die sortierten Themen in vier kompakte Cuatal-Bloecke.
 */
export function baueCuatalBloecke(themen: ThemaKategorie[]): CuatalBlock[] {
  const themenProCuatal = Math.max(1, Math.ceil(themen.length / 4));
  return [1, 2, 3, 4].map((cuatal) => {
    const start = (cuatal - 1) * themenProCuatal;
    const cuatalThemen = themen.slice(start, start + themenProCuatal);
    return { cuatal, themen: cuatalThemen, ...summiereThemen(cuatalThemen) };
  });
}

/**
 * Gruppiert die Themen eines Cuatals zu wenigen Oberthemen fuer die Handy-Ansicht.
 */
export function baueUeberthemen(cuatal: CuatalBlock): UeberthemaBlock[] {
  const map = new Map<string, { bezeichnung: string; themen: ThemaKategorie[] }>();

  for (const thema of cuatal.themen) {
    const id = thema.pruefungsbereichId ?? thema.id;
    const bezeichnung = thema.pruefungsbereichBezeichnung ?? thema.bezeichnung;
    const gruppe = map.get(id) ?? { bezeichnung, themen: [] };
    gruppe.themen.push(thema);
    map.set(id, gruppe);
  }

  const gruppen = [...map.entries()]
    .map(([id, gruppe]) => ({
      id,
      bezeichnung: gruppe.bezeichnung,
      themenIds: gruppe.themen.map((thema) => thema.id),
      ...summiereThemen(gruppe.themen),
    }))
    .sort((a, b) => a.bezeichnung.localeCompare(b.bezeichnung, 'de'));

  if (gruppen.length <= 4) return gruppen;

  const gruppenProBlock = Math.ceil(gruppen.length / 4);
  return [1, 2, 3, 4].map((block) => {
    const start = (block - 1) * gruppenProBlock;
    const teilGruppen = gruppen.slice(start, start + gruppenProBlock);
    const gesamt = teilGruppen.reduce((summe, gruppe) => summe + gruppe.gesamt, 0);
    const fertig = teilGruppen.reduce((summe, gruppe) => summe + gruppe.fertig, 0);
    return {
      id: `block-${block}`,
      bezeichnung: teilGruppen.length === 1 ? teilGruppen[0]?.bezeichnung ?? `Oberthema ${block}` : `Oberthema ${block}`,
      themenIds: teilGruppen.flatMap((gruppe) => gruppe.themenIds),
      gesamt,
      fertig,
      falsch: teilGruppen.reduce((summe, gruppe) => summe + gruppe.falsch, 0),
      fastFertig: teilGruppen.reduce((summe, gruppe) => summe + gruppe.fastFertig, 0),
      neu: teilGruppen.reduce((summe, gruppe) => summe + gruppe.neu, 0),
      prozent: berechneProzent(fertig, gesamt),
    };
  });
}

/**
 * Filtert Fragen auf die Themen eines Oberthemas.
 */
export function filtereFragenNachThemen(items: FrageMitThemaStand[], themenIds: string[]): FrageMitThemaStand[] {
  const erlaubteThemen = new Set(themenIds);
  return items.filter((item) => erlaubteThemen.has(item.themaId));
}

/**
 * Berechnet den Gesamtfortschritt aus derselben Basis wie die Cuatal-Karten.
 */
export function berechneFragenFortschrittProzent(themen: ThemaKategorie[]): number {
  const gesamt = themen.reduce((summe, thema) => summe + thema.gesamt, 0);
  const fertig = themen.reduce((summe, thema) => summe + thema.fertig, 0);
  return berechneProzent(fertig, gesamt);
}

/**
 * Laedt alle freigegebenen Multiple-Choice-Fragen samt Mastery-Stand.
 */
export async function ladeFragenUebersicht(userId: string | null, themaId?: string): Promise<FragenUebersicht> {
  const supabase = await createServerSupabase();
  let query = supabase
    .from('fragen')
    .select(
      'id,typ,aufgabenstellung,bild_url,schwierigkeit,kern,thema_id,tabellenbuch_fundstelle,themen!inner(id,bezeichnung,pruefungsbereiche(id,bezeichnung,ausbildungsphasen(id,bezeichnung,reihenfolge))),antwortoptionen(id,text,reihenfolge)',
    )
    .eq('status', 'freigegeben')
    .eq('typ', 'mc');

  if (themaId) query = query.eq('thema_id', themaId);

  const { data: fragenRoh, error: fragenError } = await query;
  if (fragenError) {
    throw new Error(`Fragen konnten nicht geladen werden: ${fragenError.message}`);
  }

  const fragen = (fragenRoh ?? []) as FrageRow[];
  const frageIds = fragen.map((frage) => frage.id);
  const masteryMap = new Map<string, MasteryState>();

  if (userId && frageIds.length > 0) {
    const { data: masteryRoh, error: masteryError } = await supabase
      .from('fragen_mastery')
      .select('frage_id,status,streak,fehler_gesamt,naechste_faelligkeit')
      .eq('user_id', userId)
      .in('frage_id', frageIds);
    if (masteryError) {
      throw new Error(`Fragenfortschritt konnte nicht geladen werden: ${masteryError.message}`);
    }

    for (const mastery of masteryRoh ?? []) {
      masteryMap.set(mastery.frage_id, mastery as MasteryState);
    }
  }

  const items = fragen.map((frage) => {
    const optionen = [...(frage.antwortoptionen ?? [])]
      .sort((a, b) => a.reihenfolge - b.reihenfolge)
      .map((option) => ({
        id: option.id,
        text: option.text,
        reihenfolge: option.reihenfolge,
      }));
    const lernFrage: LernFrage = {
      id: frage.id,
      typ: frage.typ,
      aufgabenstellung: frage.aufgabenstellung,
      bild_url: frage.bild_url,
      schwierigkeit: frage.schwierigkeit,
      kern: frage.kern,
      tabellenbuch_fundstelle: frage.tabellenbuch_fundstelle ?? null,
      optionen,
    };
    return { frage: lernFrage, mastery: masteryMap.get(frage.id) ?? null, themaId: frage.thema_id };
  });

  return {
    items,
    gruppen: baueFragenGruppen(items),
    themen: baueThemen(fragen, masteryMap),
  };
}

/**
 * Laedt nur den Gesamtfortschritt fuer den Header, ohne Frageninhalte oder Optionen.
 */
export async function ladeFragenFortschrittProzent(userId: string | null): Promise<number> {
  if (!userId) return 0;

  const supabase = await createServerSupabase();
  const { data: fragen, error: fragenError } = await supabase
    .from('fragen')
    .select('id')
    .eq('status', 'freigegeben')
    .eq('typ', 'mc');

  if (fragenError) {
    throw new Error(`Fragenfortschritt konnte nicht geladen werden: ${fragenError.message}`);
  }

  const frageIds = (fragen ?? []).map((frage) => frage.id);
  if (frageIds.length === 0) return 0;

  const { count, error: masteryError } = await supabase
    .from('fragen_mastery')
    .select('frage_id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'abgeschlossen')
    .in('frage_id', frageIds);

  if (masteryError) {
    throw new Error(`Abgeschlossene Fragen konnten nicht geladen werden: ${masteryError.message}`);
  }

  return berechneProzent(count ?? 0, frageIds.length);
}

/**
 * Baut die Statusgruppen fuer den Fragen-Einstieg.
 */
export function baueFragenGruppen(items: FrageMitStand[]): FragenKategorie[] {
  return (Object.keys(GRUPPEN_TEXTE) as FragenGruppe[]).map((id) => {
    const anzahl =
      id === 'alle'
        ? items.filter((item) => frageStatus(item.mastery) !== 'abgeschlossen').length
        : items.filter((item) => frageStatus(item.mastery) === id).length;
    return { id, anzahl, ...GRUPPEN_TEXTE[id] };
  });
}

/**
 * Gruppiert Fragen nach Themen und zaehlt die wichtigsten Lernzustaende.
 */
function baueThemen(fragen: FrageRow[], masteryMap: Map<string, MasteryState>): ThemaKategorie[] {
  const map = new Map<string, ThemaKategorie>();
  for (const frage of fragen) {
    const thema = Array.isArray(frage.themen) ? frage.themen[0] : frage.themen;
    if (!thema) continue;
    const pruefungsbereich = Array.isArray(thema.pruefungsbereiche)
      ? thema.pruefungsbereiche[0]
      : thema.pruefungsbereiche;
    const phase = Array.isArray(pruefungsbereich?.ausbildungsphasen)
      ? pruefungsbereich?.ausbildungsphasen[0]
      : pruefungsbereich?.ausbildungsphasen;

    const zeile = map.get(thema.id) ?? {
      id: thema.id,
      bezeichnung: thema.bezeichnung,
      ausbildungsjahr: normalisiereAusbildungsjahr(phase?.reihenfolge),
      phaseId: phase?.id ?? null,
      phaseBezeichnung: phase?.bezeichnung ?? null,
      pruefungsbereichId: pruefungsbereich?.id ?? null,
      pruefungsbereichBezeichnung: pruefungsbereich?.bezeichnung ?? null,
      gesamt: 0,
      fertig: 0,
      falsch: 0,
      fastFertig: 0,
      neu: 0,
    };
    zeile.gesamt += 1;

    const status = frageStatus(masteryMap.get(frage.id) ?? null);
    if (status === 'abgeschlossen') zeile.fertig += 1;
    if (status === 'falsch') zeile.falsch += 1;
    if (status === 'fast_fertig') zeile.fastFertig += 1;
    if (status === 'neu') zeile.neu += 1;
    map.set(thema.id, zeile);
  }

  return [...map.values()].sort((a, b) => {
    const jahrDiff = a.ausbildungsjahr - b.ausbildungsjahr;
    if (jahrDiff !== 0) return jahrDiff;
    return a.bezeichnung.localeCompare(b.bezeichnung, 'de');
  });
}

/**
 * Summiert die wichtigsten Kennzahlen fuer Themenbloecke.
 */
function summiereThemen(themen: ThemaKategorie[]): Omit<CuatalBlock, 'cuatal' | 'themen'> {
  const gesamt = themen.reduce((summe, thema) => summe + thema.gesamt, 0);
  const fertig = themen.reduce((summe, thema) => summe + thema.fertig, 0);
  const falsch = themen.reduce((summe, thema) => summe + thema.falsch, 0);
  const fastFertig = themen.reduce((summe, thema) => summe + thema.fastFertig, 0);
  const neu = themen.reduce((summe, thema) => summe + thema.neu, 0);
  const prozent = berechneProzent(fertig, gesamt);
  return { gesamt, fertig, falsch, fastFertig, neu, prozent };
}

/**
 * Berechnet einen Prozentwert ohne Division durch null.
 */
function berechneProzent(fertig: number, gesamt: number): number {
  return gesamt === 0 ? 0 : Math.round((fertig / gesamt) * 100);
}

/**
 * Ordnet freie Phasenreihenfolgen in vier Ausbildungsjahr-Bloecke ein.
 */
function normalisiereAusbildungsjahr(reihenfolge: number | null | undefined): number {
  const wert = Number.isFinite(reihenfolge) ? Number(reihenfolge) : 1;
  if (wert < 1) return 1;
  if (wert > 4) return 4;
  return Math.round(wert);
}

/**
 * Liefert den rohen Mastery-Status fuer Badge-Komponenten.
 */
export function masteryStatusOderNeu(mastery: MasteryState | null): MasteryStatus {
  return mastery?.status ?? 'neu';
}
