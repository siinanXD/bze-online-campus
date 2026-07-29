// @ts-nocheck — Deno-Laufzeit (Supabase Edge Function), kein Teil des Next.js-TS-Projekts.
//
// AP-13 — Edge Function `erzeuge-wochenbericht` (Spec §5).
//
// Aggregiert die Lernwoche eines Teilnehmers, ermittelt die drei schwächsten
// Themen, vergleicht mit der Vorwoche und lässt das LLM in der Nutzersprache
// eine Zusammenfassung, Verbesserungen, eine konkrete Empfehlung sowie
// 3–5 kurze Merksätze zu TATSÄCHLICH falsch beantworteten Fragen erzeugen.
// Ergebnis landet in `wochenberichte` (upsert je user_id/jahr/kalenderwoche).
//
// Zwei Betriebsarten:
//   1. Cron (sonntags 20:00): Header `x-cron-secret` == CRON_SECRET → alle
//      aktiven Teilnehmer. Kein Nutzer-JWT nötig.
//   2. POST mit Auth: einzelner Teilnehmer (self, oder Ausbilder für
//      zugewiesene Teilnehmer, oder Admin/Verwaltung). Für Test/Admin-Trigger.
//
// Der Wochenbericht ist automatisches Lernfeedback, keine Prüfungsleistung.
// Jede Antwort enthält `hinweis_lernfeedback: true`; Merksätze werden mit dem
// Bericht gespeichert und im Startbildschirm angezeigt (nicht bei App-Start
// erzeugt).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const LLM_API_KEY = Deno.env.get('LLM_API_KEY') ?? '';
const LLM_MODELL = Deno.env.get('LLM_MODELL') ?? 'gpt-4o-mini';
const LLM_BASE_URL = (Deno.env.get('LLM_BASE_URL') ?? 'https://api.openai.com/v1').replace(/\/$/, '');
const LLM_MOCK = (Deno.env.get('LLM_MOCK') ?? '') === '1';
const CRON_SECRET = Deno.env.get('CRON_SECRET') ?? '';

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cron-secret',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const MERKSAETZE_MIN = 3;
const MERKSAETZE_MAX = 5;

type Merksatz = { text: string; thema?: string };

type BerichtInhalt = {
  zusammenfassung: string;
  verbesserungen: string;
  empfehlung: string;
  statistik: {
    bearbeitet: number;
    richtig: number;
    falsch: number;
    richtig_quote: number;
    vorwoche_bearbeitet: number;
    vorwoche_richtig_quote: number;
    trend: 'besser' | 'schlechter' | 'gleich' | 'neu';
    schwaechste_themen: string[];
  };
};

type LlmErgebnis = { inhalt: Omit<BerichtInhalt, 'statistik'>; merksaetze: Merksatz[] };

function jsonAntwort(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

// ---------------------------------------------------------------------
// ISO-Kalenderwoche (UTC)
// ---------------------------------------------------------------------
function isoWoche(d: Date): { jahr: number; woche: number } {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const tag = t.getUTCDay() === 0 ? 7 : t.getUTCDay();
  t.setUTCDate(t.getUTCDate() + 4 - tag);
  const jahresanfang = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const woche = Math.ceil(((t.getTime() - jahresanfang.getTime()) / 86400000 + 1) / 7);
  return { jahr: t.getUTCFullYear(), woche };
}

/** Montag 00:00 UTC bis Sonntag 23:59:59.999 UTC der ISO-Woche. */
function wochenBereich(jahr: number, woche: number): { start: Date; ende: Date } {
  const jan4 = new Date(Date.UTC(jahr, 0, 4));
  const jan4Tag = jan4.getUTCDay() === 0 ? 7 : jan4.getUTCDay();
  const montagKW1 = new Date(jan4);
  montagKW1.setUTCDate(jan4.getUTCDate() - (jan4Tag - 1));
  const start = new Date(montagKW1);
  start.setUTCDate(montagKW1.getUTCDate() + (woche - 1) * 7);
  start.setUTCHours(0, 0, 0, 0);
  const ende = new Date(start);
  ende.setUTCDate(start.getUTCDate() + 7);
  ende.setUTCMilliseconds(-1);
  return { start, ende };
}

/** Grobe EUR-Schätzung (OpenAI-ähnlich); für Budgetanzeige, nicht Abrechnung. */
function schaetzeKosten(inputTokens: number, outputTokens: number): number {
  return Number(((inputTokens * 0.00000015) + (outputTokens * 0.0000006)).toFixed(6));
}

// ---------------------------------------------------------------------
// Aggregation einer Woche
// ---------------------------------------------------------------------
type WochenVersuch = {
  ist_korrekt: boolean | null;
  thema_id: string | null;
  thema: string | null;
  aufgabenstellung: string | null;
};

async function ladeWoche(
  service: ReturnType<typeof createClient>,
  userId: string,
  start: Date,
  ende: Date,
): Promise<WochenVersuch[]> {
  const { data, error } = await service
    .from('versuche')
    .select('ist_korrekt, fragen:frage_id ( thema_id, aufgabenstellung, themen:thema_id ( bezeichnung ) )')
    .eq('user_id', userId)
    .gte('created_at', start.toISOString())
    .lte('created_at', ende.toISOString());
  if (error) throw new Error(`versuche_laden_fehlgeschlagen:${error.message}`);
  return (data ?? []).map((v: any) => ({
    ist_korrekt: v.ist_korrekt,
    thema_id: v.fragen?.thema_id ?? null,
    thema: v.fragen?.themen?.bezeichnung ?? null,
    aufgabenstellung: v.fragen?.aufgabenstellung ?? null,
  }));
}

function auswerten(versuche: WochenVersuch[]) {
  const bearbeitet = versuche.length;
  const richtig = versuche.filter((v) => v.ist_korrekt === true).length;
  const falsch = versuche.filter((v) => v.ist_korrekt === false).length;
  const quote = bearbeitet > 0 ? Math.round((richtig / bearbeitet) * 100) : 0;

  // Schwächste Themen: höchste Fehlerzahl, dann niedrigste Richtig-Quote
  const proThema = new Map<string, { thema: string; gesamt: number; falsch: number }>();
  for (const v of versuche) {
    if (!v.thema_id || !v.thema) continue;
    const e = proThema.get(v.thema_id) ?? { thema: v.thema, gesamt: 0, falsch: 0 };
    e.gesamt += 1;
    if (v.ist_korrekt === false) e.falsch += 1;
    proThema.set(v.thema_id, e);
  }
  const schwaechste = [...proThema.values()]
    .filter((e) => e.falsch > 0)
    .sort((a, b) => b.falsch - a.falsch || a.gesamt - b.gesamt)
    .slice(0, 3)
    .map((e) => e.thema);

  // Tatsächlich falsch beantwortete Fragen (für Merksätze)
  const falscheFragen = versuche
    .filter((v) => v.ist_korrekt === false && v.aufgabenstellung)
    .map((v) => ({ aufgabenstellung: v.aufgabenstellung as string, thema: v.thema ?? undefined }));

  return { bearbeitet, richtig, falsch, quote, schwaechste, falscheFragen };
}

// ---------------------------------------------------------------------
// Mock-Erzeugung (ohne LLM) — für lokale Entwicklung / LLM_MOCK=1
// ---------------------------------------------------------------------
function mockBericht(
  aktuell: ReturnType<typeof auswerten>,
  trend: BerichtInhalt['statistik']['trend'],
): LlmErgebnis {
  const themenText = aktuell.schwaechste.length
    ? aktuell.schwaechste.join(', ')
    : 'keine auffälligen Themen';
  const trendText =
    trend === 'besser' ? 'besser als in der Vorwoche'
      : trend === 'schlechter' ? 'schwächer als in der Vorwoche'
        : trend === 'gleich' ? 'stabil im Vergleich zur Vorwoche'
          : 'deine erste ausgewertete Woche';

  const seen = new Set<string>();
  const merksaetze: Merksatz[] = [];
  for (const f of aktuell.falscheFragen) {
    const schluessel = f.thema ?? f.aufgabenstellung.slice(0, 40);
    if (seen.has(schluessel)) continue;
    seen.add(schluessel);
    merksaetze.push({
      text: `Wiederhole gezielt: „${f.aufgabenstellung.slice(0, 90)}${f.aufgabenstellung.length > 90 ? '…' : ''}“`,
      thema: f.thema,
    });
    if (merksaetze.length >= MERKSAETZE_MAX) break;
  }
  while (merksaetze.length < MERKSAETZE_MIN && aktuell.schwaechste.length > 0) {
    const t = aktuell.schwaechste[merksaetze.length % aktuell.schwaechste.length];
    merksaetze.push({ text: `Vertiefe das Thema „${t}“ mit ein paar Übungsfragen.`, thema: t });
  }

  return {
    inhalt: {
      zusammenfassung: `Diese Woche hast du ${aktuell.bearbeitet} Fragen bearbeitet und ${aktuell.richtig} richtig beantwortet (${aktuell.quote} %). Das ist ${trendText}.`,
      verbesserungen: aktuell.schwaechste.length
        ? `Deine schwächsten Themen: ${themenText}. Hier lohnt sich Wiederholung.`
        : 'Weiter so — es gab diese Woche keine auffälligen Schwächen.',
      empfehlung: aktuell.schwaechste.length
        ? `Nimm dir nächste Woche gezielt „${aktuell.schwaechste[0]}“ vor und übe die falsch beantworteten Fragen erneut.`
        : 'Halte dein Tempo und starte eine neue Wochenprüfung.',
    },
    merksaetze: merksaetze.slice(0, MERKSAETZE_MAX),
  };
}

// ---------------------------------------------------------------------
// LLM-Erzeugung
// ---------------------------------------------------------------------
async function llmBericht(eingabe: {
  nutzersprache: string;
  aktuell: ReturnType<typeof auswerten>;
  vorwoche: { bearbeitet: number; quote: number };
  trend: BerichtInhalt['statistik']['trend'];
}): Promise<{ ergebnis: LlmErgebnis; inputTokens: number; outputTokens: number; requestId: string }> {
  const system = `Du bist ein ermutigender Lerncoach für die schriftliche IHK-Prüfung.
Du schreibst einen kurzen Wochenbericht als automatisches Lernfeedback (keine Prüfungsleistung).
Regeln:
- Schreibe in einfacher, ermutigender Sprache in der Nutzersprache (${eingabe.nutzersprache}).
- Beziehe dich nur auf die gelieferten Zahlen und Themen, erfinde keine Werte.
- Die Merksätze beziehen sich AUSSCHLIESSLICH auf die tatsächlich falsch beantworteten Fragen.
- Liefere ${MERKSAETZE_MIN} bis ${MERKSAETZE_MAX} kurze, einprägsame Merksätze (je ein Satz).
Antworte NUR mit JSON genau in dieser Form:
{"zusammenfassung":"…","verbesserungen":"…","empfehlung":"…","merksaetze":[{"text":"…","thema":"…"}]}`;

  const user = JSON.stringify({
    statistik: {
      bearbeitet: eingabe.aktuell.bearbeitet,
      richtig: eingabe.aktuell.richtig,
      falsch: eingabe.aktuell.falsch,
      richtig_quote_prozent: eingabe.aktuell.quote,
      schwaechste_themen: eingabe.aktuell.schwaechste,
      vorwoche_bearbeitet: eingabe.vorwoche.bearbeitet,
      vorwoche_richtig_quote_prozent: eingabe.vorwoche.quote,
      trend: eingabe.trend,
    },
    falsch_beantwortete_fragen: eingabe.aktuell.falscheFragen.slice(0, 8),
  });

  const res = await fetch(`${LLM_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${LLM_API_KEY}` },
    body: JSON.stringify({
      model: LLM_MODELL,
      temperature: 0.4,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  });

  const requestId = res.headers.get('x-request-id') ?? crypto.randomUUID();
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`llm_fehler_${res.status}:${text.slice(0, 200)}`);
  }
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('llm_leere_antwort');
  const parsed = JSON.parse(content);
  const merksaetze: Merksatz[] = Array.isArray(parsed.merksaetze)
    ? parsed.merksaetze
        .map((m: any) => (typeof m === 'string' ? { text: m } : { text: String(m?.text ?? ''), thema: m?.thema }))
        .filter((m: Merksatz) => m.text.trim().length > 0)
        .slice(0, MERKSAETZE_MAX)
    : [];
  if (!parsed.zusammenfassung || merksaetze.length < 1) throw new Error('llm_ungueltiges_json');
  return {
    ergebnis: {
      inhalt: {
        zusammenfassung: String(parsed.zusammenfassung),
        verbesserungen: String(parsed.verbesserungen ?? ''),
        empfehlung: String(parsed.empfehlung ?? ''),
      },
      merksaetze,
    },
    inputTokens: data.usage?.prompt_tokens ?? 0,
    outputTokens: data.usage?.completion_tokens ?? 0,
    requestId,
  };
}

// ---------------------------------------------------------------------
// Budgetprüfung je Träger (Monat)
// ---------------------------------------------------------------------
async function budgetVerbraucht(service: ReturnType<typeof createClient>, traegerId: string): Promise<number> {
  const monatsanfang = new Date();
  monatsanfang.setUTCDate(1);
  monatsanfang.setUTCHours(0, 0, 0, 0);
  const { data } = await service
    .from('ki_aufrufe')
    .select('kosten_eur')
    .eq('traeger_id', traegerId)
    .gte('created_at', monatsanfang.toISOString())
    .eq('erfolg', true);
  return (data ?? []).reduce((s: number, z: any) => s + Number(z.kosten_eur ?? 0), 0);
}

// ---------------------------------------------------------------------
// Bericht für einen Teilnehmer erzeugen und speichern
// ---------------------------------------------------------------------
async function erzeugeFuerNutzer(
  service: ReturnType<typeof createClient>,
  profil: { id: string; traeger_id: string | null; sprache: string | null },
  jahr: number,
  woche: number,
): Promise<{ user_id: string; jahr: number; kalenderwoche: number; merksaetze_anzahl: number; modell: string }> {
  const { start, ende } = wochenBereich(jahr, woche);
  const vorher = new Date(start);
  vorher.setUTCDate(start.getUTCDate() - 7);
  const vor = isoWoche(vorher);
  const vorBereich = wochenBereich(vor.jahr, vor.woche);

  const [versucheAktuell, versucheVor] = await Promise.all([
    ladeWoche(service, profil.id, start, ende),
    ladeWoche(service, profil.id, vorBereich.start, vorBereich.ende),
  ]);

  const aktuell = auswerten(versucheAktuell);
  const vorAus = auswerten(versucheVor);

  let trend: BerichtInhalt['statistik']['trend'];
  if (vorAus.bearbeitet === 0) trend = 'neu';
  else if (aktuell.quote > vorAus.quote + 2) trend = 'besser';
  else if (aktuell.quote < vorAus.quote - 2) trend = 'schlechter';
  else trend = 'gleich';

  const budget = Number(
    (await service.from('traeger').select('einstellungen').eq('id', profil.traeger_id).maybeSingle())
      .data?.einstellungen?.monatsbudget_eur ?? 200,
  );

  const start_ts = Date.now();
  let ergebnis: LlmErgebnis;
  let modell = 'mock-heuristik';
  let inputTokens = 0;
  let outputTokens = 0;
  let requestId = crypto.randomUUID();
  const echterLlm = !LLM_MOCK && !!LLM_API_KEY && aktuell.bearbeitet > 0;

  if (echterLlm) {
    const bisher = profil.traeger_id ? await budgetVerbraucht(service, profil.traeger_id) : 0;
    if (bisher >= budget) {
      await service.from('ki_aufrufe').insert({
        traeger_id: profil.traeger_id,
        user_id: profil.id,
        funktion: 'erzeuge_wochenbericht',
        modell: LLM_MODELL,
        erfolg: false,
        fehlertext: 'budget_ueberschritten',
        kosten_eur: 0,
      });
      // Fallback auf Heuristik, damit der Teilnehmer trotzdem einen Bericht erhält.
      ergebnis = mockBericht(aktuell, trend);
    } else {
      try {
        const llm = await llmBericht({
          nutzersprache: profil.sprache ?? 'de',
          aktuell,
          vorwoche: { bearbeitet: vorAus.bearbeitet, quote: vorAus.quote },
          trend,
        });
        ergebnis = llm.ergebnis;
        modell = LLM_MODELL;
        inputTokens = llm.inputTokens;
        outputTokens = llm.outputTokens;
        requestId = llm.requestId;
      } catch (e) {
        await service.from('ki_aufrufe').insert({
          traeger_id: profil.traeger_id,
          user_id: profil.id,
          funktion: 'erzeuge_wochenbericht',
          modell: LLM_MODELL,
          latenz_ms: Date.now() - start_ts,
          erfolg: false,
          fehlertext: e instanceof Error ? e.message : 'unbekannter_fehler',
          request_id: requestId,
        });
        ergebnis = mockBericht(aktuell, trend);
      }
    }
  } else {
    ergebnis = mockBericht(aktuell, trend);
  }

  const kosten = modell === LLM_MODELL ? schaetzeKosten(inputTokens, outputTokens) : 0;
  await service.from('ki_aufrufe').insert({
    traeger_id: profil.traeger_id,
    user_id: profil.id,
    funktion: 'erzeuge_wochenbericht',
    modell,
    input_tokens: inputTokens,
    output_tokens: outputTokens,
    kosten_eur: kosten,
    latenz_ms: Date.now() - start_ts,
    erfolg: true,
    request_id: requestId,
  });

  const inhalt: BerichtInhalt = {
    ...ergebnis.inhalt,
    statistik: {
      bearbeitet: aktuell.bearbeitet,
      richtig: aktuell.richtig,
      falsch: aktuell.falsch,
      richtig_quote: aktuell.quote,
      vorwoche_bearbeitet: vorAus.bearbeitet,
      vorwoche_richtig_quote: vorAus.quote,
      trend,
      schwaechste_themen: aktuell.schwaechste,
    },
  };

  await service.from('wochenberichte').upsert(
    {
      user_id: profil.id,
      jahr,
      kalenderwoche: woche,
      inhalt,
      merksaetze: ergebnis.merksaetze,
      gelesen: false,
    },
    { onConflict: 'user_id,jahr,kalenderwoche' },
  );

  return {
    user_id: profil.id,
    jahr,
    kalenderwoche: woche,
    merksaetze_anzahl: ergebnis.merksaetze.length,
    modell,
  };
}

// ---------------------------------------------------------------------
// HTTP-Einstieg
// ---------------------------------------------------------------------
Deno.serve(async (anfrage: Request) => {
  if (anfrage.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });
  if (anfrage.method !== 'POST') return jsonAntwort({ fehler: 'methode_nicht_erlaubt' }, 405);

  const service = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  let body: { user_id?: string; jahr?: number; kalenderwoche?: number; alle?: boolean };
  try {
    body = await anfrage.json();
  } catch {
    body = {};
  }

  // Zielwoche: Standard = aktuelle ISO-Woche (Cron läuft am So-Abend)
  const jetzt = isoWoche(new Date());
  const jahr = Number(body.jahr ?? jetzt.jahr);
  const woche = Number(body.kalenderwoche ?? jetzt.woche);

  const cronSecret = anfrage.headers.get('x-cron-secret');
  const istCron = !!CRON_SECRET && cronSecret === CRON_SECRET;

  // -------------------- Cron / Massenlauf --------------------
  if (istCron || (body.alle === true && cronSecret && CRON_SECRET && cronSecret === CRON_SECRET)) {
    const { data: teilnehmer, error } = await service
      .from('profiles')
      .select('id, traeger_id, sprache')
      .eq('rolle', 'teilnehmer')
      .eq('aktiv', true);
    if (error) return jsonAntwort({ fehler: 'teilnehmer_laden_fehlgeschlagen', detail: error.message }, 500);

    const berichte = [];
    const fehler = [];
    for (const p of teilnehmer ?? []) {
      try {
        berichte.push(await erzeugeFuerNutzer(service, p as any, jahr, woche));
      } catch (e) {
        fehler.push({ user_id: (p as any).id, fehler: e instanceof Error ? e.message : 'unbekannt' });
      }
    }
    return jsonAntwort(
      { hinweis_lernfeedback: true, modus: 'cron', jahr, kalenderwoche: woche, anzahl: berichte.length, berichte, fehler },
      200,
    );
  }

  // -------------------- Einzelner Teilnehmer (Auth) --------------------
  const autorisierung = anfrage.headers.get('Authorization');
  if (!autorisierung) return jsonAntwort({ fehler: 'nicht_angemeldet' }, 401);

  const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: autorisierung } },
  });
  const {
    data: { user: aufrufer },
    error: authFehler,
  } = await anonClient.auth.getUser();
  if (authFehler || !aufrufer) return jsonAntwort({ fehler: 'nicht_angemeldet' }, 401);

  const { data: profil } = await anonClient
    .from('profiles')
    .select('id, rolle, traeger_id, sprache')
    .eq('id', aufrufer.id)
    .maybeSingle();
  if (!profil) return jsonAntwort({ fehler: 'profil_fehlt' }, 403);

  const zielId = body.user_id ?? aufrufer.id;
  const istSelbst = zielId === aufrufer.id;
  const istBetreuer = profil.rolle === 'admin' || profil.rolle === 'verwaltung' || profil.rolle === 'ausbilder';

  if (!istSelbst && !istBetreuer) return jsonAntwort({ fehler: 'keine_berechtigung' }, 403);

  if (!istSelbst && profil.rolle === 'ausbilder') {
    const { data: zuw } = await service
      .from('ausbilder_zuweisungen')
      .select('teilnehmer_id')
      .eq('ausbilder_id', aufrufer.id)
      .eq('teilnehmer_id', zielId)
      .maybeSingle();
    if (!zuw) return jsonAntwort({ fehler: 'keine_berechtigung' }, 403);
  }

  const { data: zielProfil } = await service
    .from('profiles')
    .select('id, traeger_id, sprache')
    .eq('id', zielId)
    .maybeSingle();
  if (!zielProfil) return jsonAntwort({ fehler: 'teilnehmer_unbekannt' }, 404);

  try {
    const bericht = await erzeugeFuerNutzer(service, zielProfil as any, jahr, woche);
    return jsonAntwort({ hinweis_lernfeedback: true, modus: 'einzel', bericht }, 200);
  } catch (e) {
    return jsonAntwort(
      { fehler: 'erzeugung_fehlgeschlagen', detail: e instanceof Error ? e.message : 'unbekannt' },
      502,
    );
  }
});
