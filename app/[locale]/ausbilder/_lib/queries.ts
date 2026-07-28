import { createServerSupabase } from '@bze/db/server';

export interface CockpitZeile {
  userId: string;
  vorname: string | null;
  nachname: string | null;
  benutzername: string;
  fortschrittProzent: number;
  lernpunkte: number;
  fragenProWoche: number;
  richtigFalschQuote: number | null;
  pruefungenAnzahl: number;
  letzteNote: number | null;
  aktiveLerntage: number;
  letzteAktivitaet: string | null;
  risikoAktivitaet: boolean;
  risikoPruefungen: boolean;
}

export interface KohorteUebersicht {
  kohorteId: string;
  bezeichnung: string;
  teilnehmerAnzahl: number;
  fortschrittAvg: number;
  lernpunkteAvg: number;
  quoteAvg: number;
}

export interface ThemaFehler {
  themaId: string;
  bezeichnung: string;
  fehlerquote: number;
  versuche: number;
}

export interface TeilnehmerDetail {
  profil: CockpitZeile;
  bereiche: { id: string; bezeichnung: string; kernFertig: number; kernGesamt: number; fertig: boolean }[];
  themen: { id: string; bezeichnung: string; bereichId: string; kernFertig: number; kernGesamt: number; offenFalsch: number; fertig: boolean }[];
  pruefungen: { id: string; titel: string | null; gesamtpunkte: number | null; note: number | null; bestanden: boolean | null; abgegebenAm: string | null }[];
  heatmap: { tag: string; anzahl: number }[];
  pruefungsreifen: {
    id: string;
    phaseId: string;
    phaseBezeichnung: string;
    kriterienErfuelltAm: string | null;
    ausbilderBestaetigtAm: string | null;
    kommentar: string | null;
  }[];
}

type ProfilKurz = { id: string; benutzername: string; vorname: string | null; nachname: string | null };

async function ladeZuweisungen(supabase: Awaited<ReturnType<typeof createServerSupabase>>) {
  const { data } = await supabase
    .from('ausbilder_zuweisungen')
    .select('teilnehmer_id, profiles!ausbilder_zuweisungen_teilnehmer_id_fkey(id,benutzername,vorname,nachname)');
  return (data ?? []).map((z: any) => {
    const p = z.profiles;
    const profil: ProfilKurz | null = Array.isArray(p) ? (p[0] ?? null) : (p ?? null);
    return { teilnehmer_id: z.teilnehmer_id as string, profiles: profil };
  });
}

export async function ladeCockpit(): Promise<CockpitZeile[]> {
  const supabase = await createServerSupabase();
  const zuw = await ladeZuweisungen(supabase);
  if (zuw.length === 0) return [];

  const ids = zuw.map((z) => z.teilnehmer_id);
  const [{ data: akt }, { data: beruf }] = await Promise.all([
    supabase.from('v_wochenaktivitaet_nutzer').select('*').in('user_id', ids),
    supabase.from('v_fortschritt_beruf').select('user_id,fortschritt_prozent').in('user_id', ids),
  ]);

  const aktMap = new Map((akt ?? []).map((a: any) => [a.user_id, a]));
  const berufMap = new Map((beruf ?? []).map((b: any) => [b.user_id, Number(b.fortschritt_prozent ?? 0)]));

  return zuw.map((z) => {
    const p = z.profiles;
    const a = aktMap.get(z.teilnehmer_id) as any;
    return {
      userId: z.teilnehmer_id,
      vorname: p?.vorname ?? null,
      nachname: p?.nachname ?? null,
      benutzername: p?.benutzername ?? '—',
      fortschrittProzent: berufMap.get(z.teilnehmer_id) ?? 0,
      lernpunkte: Number(a?.lernpunkte_summe ?? 0),
      fragenProWoche: Number(a?.fragen_pro_woche ?? 0),
      richtigFalschQuote: a?.richtig_falsch_quote != null ? Number(a.richtig_falsch_quote) : null,
      pruefungenAnzahl: Number(a?.pruefungen_anzahl ?? 0),
      letzteNote: a?.letzte_note != null ? Number(a.letzte_note) : null,
      aktiveLerntage: Number(a?.aktive_lerntage_woche ?? 0),
      letzteAktivitaet: a?.letzte_aktivitaet ?? null,
      risikoAktivitaet: Boolean(a?.risiko_aktivitaet),
      risikoPruefungen: Boolean(a?.risiko_pruefungen),
    };
  });
}

export async function ladeKohorten(): Promise<{ uebersichten: KohorteUebersicht[]; schwachStellen: ThemaFehler[] }> {
  const supabase = await createServerSupabase();
  const { data: kohorten } = await supabase.from('v_kohorten_uebersicht').select('*');
  const uebersichten: KohorteUebersicht[] = (kohorten ?? []).map((k: any) => ({
    kohorteId: k.kohorte_id,
    bezeichnung: k.bezeichnung,
    teilnehmerAnzahl: Number(k.teilnehmer_anzahl ?? 0),
    fortschrittAvg: Number(k.fortschritt_avg ?? 0),
    lernpunkteAvg: Number(k.lernpunkte_avg ?? 0),
    quoteAvg: Number(k.quote_avg ?? 0),
  }));

  // Themen mit höchster gruppenweiter Fehlerquote (zugewiesene Teilnehmer)
  const zuw = await ladeZuweisungen(supabase);
  const ids = zuw.map((z) => z.teilnehmer_id);
  let schwachStellen: ThemaFehler[] = [];
  if (ids.length > 0) {
    const { data: versuche } = await supabase
      .from('versuche')
      .select('ist_korrekt, frage_id, fragen!inner(thema_id, themen!inner(id,bezeichnung))')
      .in('user_id', ids);
    const agg = new Map<string, { bezeichnung: string; falsch: number; gesamt: number }>();
    for (const v of (versuche ?? []) as any[]) {
      const th = v.fragen?.themen;
      if (!th) continue;
      const cur = agg.get(th.id) ?? { bezeichnung: th.bezeichnung, falsch: 0, gesamt: 0 };
      cur.gesamt += 1;
      if (v.ist_korrekt === false) cur.falsch += 1;
      agg.set(th.id, cur);
    }
    schwachStellen = [...agg.entries()]
      .map(([themaId, a]) => ({
        themaId,
        bezeichnung: a.bezeichnung,
        versuche: a.gesamt,
        fehlerquote: a.gesamt ? Math.round((1000 * a.falsch) / a.gesamt) / 10 : 0,
      }))
      .filter((t) => t.versuche >= 3)
      .sort((a, b) => b.fehlerquote - a.fehlerquote)
      .slice(0, 8);
  }

  return { uebersichten, schwachStellen };
}

export async function ladeTeilnehmerDetail(teilnehmerId: string): Promise<TeilnehmerDetail | null> {
  const supabase = await createServerSupabase();
  const cockpit = await ladeCockpit();
  const profil = cockpit.find((c) => c.userId === teilnehmerId);
  if (!profil) return null;

  const [{ data: themenFt }, { data: bereichFt }, { data: themenMeta }, { data: bereichMeta }, { data: pruef }, { data: versuche }, { data: reifen }, { data: phasen }] =
    await Promise.all([
      supabase.from('v_fortschritt_thema').select('*').eq('user_id', teilnehmerId),
      supabase.from('v_fortschritt_bereich').select('*').eq('user_id', teilnehmerId),
      supabase.from('themen').select('id,bezeichnung,pruefungsbereich_id'),
      supabase.from('pruefungsbereiche').select('id,bezeichnung'),
      supabase
        .from('pruefung_ergebnisse')
        .select('id,gesamtpunkte,note,bestanden,abgegeben_am,pruefungen(titel)')
        .eq('user_id', teilnehmerId)
        .order('abgegeben_am', { ascending: false }),
      supabase
        .from('versuche')
        .select('created_at')
        .eq('user_id', teilnehmerId)
        .gte('created_at', new Date(Date.now() - 28 * 86400000).toISOString()),
      supabase
        .from('pruefungsreife')
        .select('id,phase_id,kriterien_erfuellt_am,ausbilder_bestaetigt_am,kommentar')
        .eq('user_id', teilnehmerId),
      supabase.from('ausbildungsphasen').select('id,bezeichnung'),
    ]);

  const thName = new Map((themenMeta ?? []).map((t) => [t.id, t]));
  const bName = new Map((bereichMeta ?? []).map((b) => [b.id, b.bezeichnung]));
  const phName = new Map((phasen ?? []).map((p) => [p.id, p.bezeichnung]));

  const themen = (themenFt ?? []).map((t: any) => {
    const meta = thName.get(t.thema_id);
    return {
      id: t.thema_id,
      bezeichnung: meta?.bezeichnung ?? t.thema_id,
      bereichId: meta?.pruefungsbereich_id ?? '',
      kernFertig: Number(t.kern_fertig ?? 0),
      kernGesamt: Number(t.kern_gesamt ?? 0),
      offenFalsch: Number(t.offen_falsch ?? 0),
      fertig: Boolean(t.thema_fertig),
    };
  }).sort((a, b) => b.offenFalsch - a.offenFalsch);

  const bereiche = (bereichFt ?? []).map((b: any) => ({
    id: b.pruefungsbereich_id,
    bezeichnung: bName.get(b.pruefungsbereich_id) ?? b.pruefungsbereich_id,
    kernFertig: Number(b.kern_fertig ?? 0),
    kernGesamt: Number(b.kern_gesamt ?? 0),
    fertig: Boolean(b.bereich_fertig),
  }));

  const pruefungen = (pruef ?? []).map((p: any) => ({
    id: p.id,
    titel: p.pruefungen?.titel ?? null,
    gesamtpunkte: p.gesamtpunkte != null ? Number(p.gesamtpunkte) : null,
    note: p.note != null ? Number(p.note) : null,
    bestanden: p.bestanden,
    abgegebenAm: p.abgegeben_am,
  }));

  const days = new Map<string, number>();
  for (let i = 27; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const key = d.toISOString().slice(0, 10);
    days.set(key, 0);
  }
  for (const v of versuche ?? []) {
    const key = String(v.created_at).slice(0, 10);
    if (days.has(key)) days.set(key, (days.get(key) ?? 0) + 1);
  }
  const heatmap = [...days.entries()].map(([tag, anzahl]) => ({ tag, anzahl }));

  const pruefungsreifen = (reifen ?? []).map((r) => ({
    id: r.id,
    phaseId: r.phase_id,
    phaseBezeichnung: phName.get(r.phase_id) ?? r.phase_id,
    kriterienErfuelltAm: r.kriterien_erfuellt_am,
    ausbilderBestaetigtAm: r.ausbilder_bestaetigt_am,
    kommentar: r.kommentar,
  }));

  return { profil, bereiche, themen, pruefungen, heatmap, pruefungsreifen };
}
