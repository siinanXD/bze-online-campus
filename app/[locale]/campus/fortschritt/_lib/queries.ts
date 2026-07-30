import { createServerSupabase } from '@bze/db/server';
import {
  baueGates,
  berufFortschrittProzent,
  fortsetzenEmpfehlung,
  type FortsetzenEmpfehlung,
  type Gate,
  type KernStand,
  type LerneinheitStand,
  type BereichMeta,
  type PhaseMeta,
  type PruefungStand,
  type PruefungsreifeStand,
  type ThemaMeta,
} from '@bze/core/fortschritt';

export interface AchievementAnzeige {
  code: string;
  titelKey: string;
  beschreibungKey: string | null;
  punkte: number;
  freigeschaltetAm: string | null;
  /** Aktueller Fortschritt Richtung Freischaltung (z. B. Kernfragen / Punkte). */
  stand?: number;
  ziel?: number;
}

export interface FortschrittSeite {
  gates: Gate[];
  fortschrittBeruf: number;
  empfehlung: FortsetzenEmpfehlung | null;
  lernpunkte: number;
  achievements: AchievementAnzeige[];
  pruefungsreifen: PruefungsreifeStand[];
  phasen: PhaseMeta[];
  pruefungenBestanden: number;
}

async function ladeStruktur(supabase: Awaited<ReturnType<typeof createServerSupabase>>) {
  const [{ data: themenRows }, { data: bereichRows }, { data: phaseRows }] = await Promise.all([
    supabase.from('themen').select('id,bezeichnung,pruefungsbereich_id,reihenfolge').order('reihenfolge'),
    supabase.from('pruefungsbereiche').select('id,bezeichnung,phase_id,reihenfolge').order('reihenfolge'),
    supabase.from('ausbildungsphasen').select('id,bezeichnung,beruf_id,reihenfolge,mindest_wochenpruefungen').order('reihenfolge'),
  ]);

  const themen: ThemaMeta[] = (themenRows ?? []).map((t) => ({
    id: t.id,
    bezeichnung: t.bezeichnung,
    bereichId: t.pruefungsbereich_id,
    reihenfolge: t.reihenfolge ?? 0,
  }));
  const bereiche: BereichMeta[] = (bereichRows ?? []).map((b) => ({
    id: b.id,
    bezeichnung: b.bezeichnung,
    phaseId: b.phase_id,
    reihenfolge: b.reihenfolge ?? 0,
  }));
  const phasen: PhaseMeta[] = (phaseRows ?? []).map((p) => ({
    id: p.id,
    bezeichnung: p.bezeichnung,
    berufId: p.beruf_id,
    reihenfolge: p.reihenfolge ?? 0,
    mindestWochenpruefungen: p.mindest_wochenpruefungen ?? 0,
  }));
  return { themen, bereiche, phasen };
}

async function ladeKern(
  supabase: Awaited<ReturnType<typeof createServerSupabase>>,
  userId: string,
): Promise<Map<string, KernStand>> {
  const { data: fragen } = await supabase
    .from('fragen')
    .select('id,thema_id,kern')
    .eq('status', 'freigegeben')
    .eq('kern', true);
  const ids = (fragen ?? []).map((f) => f.id);
  const mastery = new Map<string, string>();
  if (ids.length > 0) {
    const { data: m } = await supabase
      .from('fragen_mastery')
      .select('frage_id,status')
      .eq('user_id', userId)
      .in('frage_id', ids);
    for (const row of m ?? []) mastery.set(row.frage_id, row.status);
  }
  const map = new Map<string, KernStand>();
  for (const f of fragen ?? []) {
    const cur = map.get(f.thema_id) ?? { themaId: f.thema_id, kernGesamt: 0, kernFertig: 0 };
    cur.kernGesamt += 1;
    if (mastery.get(f.id) === 'abgeschlossen') cur.kernFertig += 1;
    map.set(f.thema_id, cur);
  }
  return map;
}

async function ladeLesefortschritt(
  supabase: Awaited<ReturnType<typeof createServerSupabase>>,
  userId: string,
): Promise<Map<string, LerneinheitStand[]>> {
  const { data: les } = await supabase
    .from('lerneinheiten')
    .select('id,thema_id,abschnitte,lesedauer_minuten,status')
    .eq('status', 'freigegeben');
  const map = new Map<string, LerneinheitStand[]>();
  if (!les || les.length === 0) return map;

  const leIds = les.map((l) => l.id);
  const { data: prog } = await supabase
    .from('lerneinheit_fortschritt')
    .select('lerneinheit_id,abschnitt_index,gelesen_am,lesezeit_sekunden')
    .eq('user_id', userId)
    .in('lerneinheit_id', leIds);

  for (const le of les) {
    const abschnitte = Array.isArray(le.abschnitte) ? le.abschnitte : [];
    const gesamt = abschnitte.length > 0
      ? abschnitte.length
      : (le.lesedauer_minuten && le.lesedauer_minuten > 0 ? 1 : 0);
    const rows = (prog ?? []).filter((p) => p.lerneinheit_id === le.id);
    const gelesen = rows.filter((r) => r.gelesen_am != null).length;
    const sollSek = (le.lesedauer_minuten ?? 0) * 60 * 0.5; // 50 % der Sollzeit
    const istSek = rows.reduce((s, r) => s + (r.lesezeit_sekunden ?? 0), 0);
    const stand: LerneinheitStand = {
      themaId: le.thema_id,
      lerneinheitId: le.id,
      abschnitteGesamt: gesamt || (gelesen > 0 ? gelesen : 0),
      abschnitteGelesen: gelesen,
      lesezeitUnterschritten: sollSek > 0 && gelesen > 0 && istSek < sollSek,
    };
    // Ohne Abschnitte: eine „virtuelle“ Einheit — gelesen wenn mind. eine Zeile
    if (gesamt === 0) {
      stand.abschnitteGesamt = 0;
      stand.abschnitteGelesen = 0;
    }
    const list = map.get(le.thema_id) ?? [];
    list.push(stand);
    map.set(le.thema_id, list);
  }
  return map;
}

export async function ladeFortschrittSeite(userId: string): Promise<FortschrittSeite> {
  const supabase = await createServerSupabase();

  // Freischaltungen nachziehen (wird sonst nur nach Versuchen getriggert).
  await supabase.rpc('pruefe_achievements', { p_user_id: userId });

  const { themen, bereiche, phasen } = await ladeStruktur(supabase);
  const [kernJeThema, lesJeThema, { data: pruefRows }, { data: reifeRows }, { data: punkteRows }, { data: achRows }, { data: nutzerAch }] =
    await Promise.all([
      ladeKern(supabase, userId),
      ladeLesefortschritt(supabase, userId),
      supabase.from('pruefung_ergebnisse').select('gesamtpunkte,bestanden').eq('user_id', userId),
      supabase.from('pruefungsreife').select('phase_id,kriterien_erfuellt_am,ausbilder_bestaetigt_am').eq('user_id', userId),
      supabase.from('lernpunkte').select('punkte').eq('user_id', userId),
      supabase.from('achievements').select('id,code,titel_key,beschreibung_key,punkte,bedingung'),
      supabase.from('nutzer_achievements').select('achievement_id,freigeschaltet_am').eq('user_id', userId),
    ]);

  const pruefungen: PruefungStand[] = (pruefRows ?? []).map((p) => ({
    gesamtpunkte: p.gesamtpunkte,
    bestanden: p.bestanden,
  }));
  const pruefungsreifen: PruefungsreifeStand[] = (reifeRows ?? []).map((r) => ({
    phaseId: r.phase_id,
    kriterienErfuelltAm: r.kriterien_erfuellt_am,
    ausbilderBestaetigtAm: r.ausbilder_bestaetigt_am,
  }));
  const empfehlung = fortsetzenEmpfehlung(themen, kernJeThema, lesJeThema);
  const gates = baueGates({
    themen,
    bereiche,
    phasen,
    kernJeThema,
    lesJeThema,
    pruefungen,
    pruefungsreifen,
    empfehlungThemaId: empfehlung?.themaId ?? null,
  });
  const lernpunkte = (punkteRows ?? []).reduce((s, r) => s + (r.punkte ?? 0), 0);
  const kernFertig = [...kernJeThema.values()].reduce((s, k) => s + k.kernFertig, 0);
  const freiAm = new Map((nutzerAch ?? []).map((n) => [n.achievement_id, n.freigeschaltet_am]));
  const achievements: AchievementAnzeige[] = (achRows ?? []).map((a) => {
    const bedingung = (a.bedingung ?? {}) as { typ?: string; anzahl?: number; min?: number };
    let stand = 0;
    let ziel = 0;
    if (bedingung.typ === 'kern_abgeschlossen') {
      stand = kernFertig;
      ziel = Number(bedingung.anzahl ?? 1);
    } else if (bedingung.typ === 'lernpunkte_summe') {
      stand = lernpunkte;
      ziel = Number(bedingung.min ?? 100);
    }
    return {
      code: a.code,
      titelKey: a.titel_key,
      beschreibungKey: a.beschreibung_key,
      punkte: a.punkte ?? 0,
      freigeschaltetAm: freiAm.get(a.id) ?? null,
      stand,
      ziel,
    };
  });

  return {
    gates,
    fortschrittBeruf: berufFortschrittProzent(kernJeThema),
    empfehlung,
    lernpunkte,
    achievements,
    pruefungsreifen,
    phasen,
    pruefungenBestanden: pruefungen.filter((p) => (p.gesamtpunkte ?? 0) >= 50).length,
  };
}

export async function ladeBerufFortschrittProzent(userId: string): Promise<number> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from('v_fortschritt_beruf')
    .select('fortschritt_prozent')
    .eq('user_id', userId)
    .maybeSingle();
  if (data?.fortschritt_prozent != null) return Number(data.fortschritt_prozent);
  const kern = await ladeKern(supabase, userId);
  return berufFortschrittProzent(kern);
}

export async function ladeFortsetzenEmpfehlung(userId: string): Promise<FortsetzenEmpfehlung | null> {
  const supabase = await createServerSupabase();
  const { themen } = await ladeStruktur(supabase);
  const [kernJeThema, lesJeThema] = await Promise.all([
    ladeKern(supabase, userId),
    ladeLesefortschritt(supabase, userId),
  ]);
  return fortsetzenEmpfehlung(themen, kernJeThema, lesJeThema);
}
