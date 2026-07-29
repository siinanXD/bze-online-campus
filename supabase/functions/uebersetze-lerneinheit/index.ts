// @ts-nocheck — Deno-Laufzeit (Supabase Edge Function), kein Teil des Next.js-TS-Projekts.
//
// AP-14 — Edge Function `uebersetze-lerneinheit` (Spec §5 `uebersetze_lerneinheit`).
//
// Erzeugt Zusatz-Uebersetzungen zu Fachkunde-Lerneinheiten in die Zielsprachen
// und legt sie in `lerneinheiten_uebersetzungen` ab (Migration 0013).
//
// NICHT VERHANDELBAR (Spec §5 / Grundregel 4):
// - Fachkunde bleibt Deutsch (Quelle in `lerneinheiten`); die Uebersetzung ist
//   eine ZUSATZ-Hilfe unter dem Original, nie ein Ersatz.
// - Uebersetzungen sind **unfreigegeben bis Ausbilderbestaetigung**
//   (freigegeben = false) und **dauerhaft gecacht** (bestehende Zeilen werden
//   nicht neu erzeugt).
// - Nur FREIGEGEBENE Lerneinheiten werden uebersetzt.
// - Zahlenwerte, Einheiten, Formeln und Normbezuege bleiben 1:1 erhalten.
//
// Schreibt `ki_aufrufe`, Budgetpruefung wie `bewerte-freitext`/`formuliere-nachweis`.
// `LLM_MOCK=1` liefert eine deterministische Pseudo-Uebersetzung ohne LLM-Aufruf.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const LLM_API_KEY = Deno.env.get('LLM_API_KEY') ?? '';
const LLM_MODELL = Deno.env.get('LLM_MODELL') ?? 'gpt-4o-mini';
const LLM_BASE_URL = (Deno.env.get('LLM_BASE_URL') ?? 'https://api.openai.com/v1').replace(/\/$/, '');
const LLM_MOCK = (Deno.env.get('LLM_MOCK') ?? '') === '1';

// Zielsprachen = alle i18n-Locales ausser der Quellsprache Deutsch (i18n.ts).
const ZIELSPRACHEN = ['en', 'fr', 'ar', 'uk', 'tr'];
const SPRACHNAMEN: Record<string, string> = {
  en: 'Englisch',
  fr: 'Französisch',
  ar: 'Arabisch',
  uk: 'Ukrainisch',
  tr: 'Türkisch',
};

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type Abschnitt = { titel?: string; inhalt?: string; minuten?: number };
type Uebersetzung = { titel: string; abschnitte: Abschnitt[] };

function jsonAntwort(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

function schaetzeKosten(inputTokens: number, outputTokens: number): number {
  return Number(((inputTokens * 0.00000015) + (outputTokens * 0.0000006)).toFixed(6));
}

/** Deterministische Mock-Uebersetzung ohne LLM (Offline-/Testbetrieb). */
function mockUebersetzung(sprache: string, titel: string, abschnitte: Abschnitt[]): Uebersetzung {
  const marke = `[${sprache}] `;
  return {
    titel: marke + (titel ?? ''),
    abschnitte: abschnitte.map((a) => ({
      titel: a.titel ? marke + a.titel : a.titel,
      inhalt: a.inhalt ? marke + a.inhalt : a.inhalt,
      minuten: a.minuten,
    })),
  };
}

async function llmUebersetzung(
  sprache: string,
  titel: string,
  abschnitte: Abschnitt[],
): Promise<{ uebersetzung: Uebersetzung; inputTokens: number; outputTokens: number; requestId: string }> {
  const system = `Du bist Fachuebersetzer fuer die deutsche Berufsausbildung (IHK).
Uebersetze die Fachkunde-Lerneinheit ins ${SPRACHNAMEN[sprache] ?? sprache} (Sprachcode ${sprache}).
STRIKTE REGELN:
- Die Uebersetzung ist eine ZUSATZ-Lernhilfe zum deutschen Original, kein Ersatz.
- Uebernimm Zahlenwerte, Einheiten, Formeln, Toleranzen und Normbezuege (z. B. DIN EN ISO 2768-1) UNVERAENDERT und exakt.
- Aendere keine Bedeutung, ergaenze und entferne nichts. Behalte die Reihenfolge und Anzahl der Abschnitte bei.
- Das Feld minuten je Abschnitt unveraendert uebernehmen.
- Markdown/Formatierung im Feld inhalt beibehalten.
- Fuer Arabisch: korrekte RTL-taugliche Uebersetzung, Zahlen in westarabischen Ziffern (0-9).
Antworte NUR mit JSON exakt in dieser Form:
{"titel":"…","abschnitte":[{"titel":"…","inhalt":"…","minuten":0}]}`;

  const user = JSON.stringify({ zielsprache: sprache, titel, abschnitte });

  const res = await fetch(`${LLM_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${LLM_API_KEY}` },
    body: JSON.stringify({
      model: LLM_MODELL,
      temperature: 0.1,
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
  const parsed = JSON.parse(content) as Uebersetzung;
  if (typeof parsed.titel !== 'string' || !Array.isArray(parsed.abschnitte)) {
    throw new Error('llm_ungueltiges_json');
  }
  return {
    uebersetzung: parsed,
    inputTokens: data.usage?.prompt_tokens ?? 0,
    outputTokens: data.usage?.completion_tokens ?? 0,
    requestId,
  };
}

Deno.serve(async (anfrage: Request) => {
  if (anfrage.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });
  if (anfrage.method !== 'POST') return jsonAntwort({ fehler: 'methode_nicht_erlaubt' }, 405);

  const autorisierung = anfrage.headers.get('Authorization');
  if (!autorisierung) return jsonAntwort({ fehler: 'nicht_angemeldet' }, 401);

  const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: autorisierung } },
  });
  const service = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const {
    data: { user: aufrufer },
    error: authFehler,
  } = await anonClient.auth.getUser();
  if (authFehler || !aufrufer) return jsonAntwort({ fehler: 'nicht_angemeldet' }, 401);

  const { data: profil } = await anonClient
    .from('profiles')
    .select('id, rolle, traeger_id')
    .eq('id', aufrufer.id)
    .maybeSingle();
  if (!profil) return jsonAntwort({ fehler: 'profil_fehlt' }, 403);

  const darf = profil.rolle === 'admin' || profil.rolle === 'verwaltung' || profil.rolle === 'ausbilder';
  if (!darf) return jsonAntwort({ fehler: 'nicht_berechtigt' }, 403);

  let body: { lerneinheit_id?: string; lerneinheit_ids?: string[]; sprachen?: string[] };
  try {
    body = await anfrage.json();
  } catch {
    return jsonAntwort({ fehler: 'ungueltige_anfrage' }, 400);
  }

  const einheitIds = Array.isArray(body.lerneinheit_ids)
    ? body.lerneinheit_ids.map((s) => String(s))
    : body.lerneinheit_id
      ? [String(body.lerneinheit_id)]
      : [];
  if (einheitIds.length === 0) return jsonAntwort({ fehler: 'keine_lerneinheit_id' }, 400);

  const zielsprachen = Array.isArray(body.sprachen) && body.sprachen.length > 0
    ? body.sprachen.map((s) => String(s)).filter((s) => ZIELSPRACHEN.includes(s))
    : ZIELSPRACHEN;

  // Budgetpruefung gegen traeger.einstellungen.monatsbudget_eur (Spec §5).
  const { data: traeger } = await service
    .from('traeger')
    .select('id, einstellungen')
    .eq('id', profil.traeger_id)
    .maybeSingle();
  const budget = Number(
    (traeger?.einstellungen as { monatsbudget_eur?: number } | null)?.monatsbudget_eur ?? 200,
  );
  const monatsanfang = new Date();
  monatsanfang.setUTCDate(1);
  monatsanfang.setUTCHours(0, 0, 0, 0);
  const { data: kostenZeilen } = await service
    .from('ki_aufrufe')
    .select('kosten_eur')
    .eq('traeger_id', profil.traeger_id)
    .gte('created_at', monatsanfang.toISOString())
    .eq('erfolg', true);
  const bisher = (kostenZeilen ?? []).reduce((s, z) => s + Number(z.kosten_eur ?? 0), 0);
  if (bisher >= budget) {
    await service.from('ki_aufrufe').insert({
      traeger_id: profil.traeger_id,
      user_id: aufrufer.id,
      funktion: 'uebersetze_lerneinheit',
      modell: LLM_MODELL,
      erfolg: false,
      fehlertext: 'budget_ueberschritten',
      kosten_eur: 0,
    });
    return jsonAntwort({ fehler: 'budget_ueberschritten', bisher, budget }, 429);
  }

  const start = Date.now();
  let inputTokens = 0;
  let outputTokens = 0;
  let requestId = crypto.randomUUID();
  const modell = LLM_MOCK || !LLM_API_KEY ? 'mock-uebersetzung' : LLM_MODELL;

  const ergebnis: Array<Record<string, unknown>> = [];
  let neuErzeugt = 0;
  let ausCache = 0;
  let uebersprungen = 0;

  try {
    for (const einheitId of einheitIds) {
      const { data: einheit } = await service
        .from('lerneinheiten')
        .select('id, status, titel, abschnitte')
        .eq('id', einheitId)
        .maybeSingle();
      if (!einheit) {
        ergebnis.push({ lerneinheit_id: einheitId, status: 'nicht_gefunden' });
        continue;
      }
      // Nur freigegebene Fachkunde wird uebersetzt.
      if (einheit.status !== 'freigegeben') {
        uebersprungen += 1;
        ergebnis.push({ lerneinheit_id: einheitId, status: 'nicht_freigegeben' });
        continue;
      }

      const abschnitte: Abschnitt[] = Array.isArray(einheit.abschnitte)
        ? (einheit.abschnitte as Abschnitt[])
        : [];

      const { data: vorhanden } = await service
        .from('lerneinheiten_uebersetzungen')
        .select('sprache')
        .eq('lerneinheit_id', einheitId);
      const cache = new Set((vorhanden ?? []).map((r) => r.sprache));

      const sprachStatus: Record<string, string> = {};
      for (const sprache of zielsprachen) {
        if (cache.has(sprache)) {
          ausCache += 1;
          sprachStatus[sprache] = 'cache';
          continue;
        }
        let ueb: Uebersetzung;
        if (LLM_MOCK || !LLM_API_KEY) {
          ueb = mockUebersetzung(sprache, einheit.titel, abschnitte);
        } else {
          const llm = await llmUebersetzung(sprache, einheit.titel, abschnitte);
          ueb = llm.uebersetzung;
          inputTokens += llm.inputTokens;
          outputTokens += llm.outputTokens;
          requestId = llm.requestId;
        }
        // Minuten aus der Quelle erzwingen (Modell darf Lesezeiten nicht aendern).
        const abschnitteSicher = (ueb.abschnitte ?? []).map((a, i) => ({
          titel: a?.titel,
          inhalt: a?.inhalt,
          minuten: abschnitte[i]?.minuten,
        }));

        await service.from('lerneinheiten_uebersetzungen').insert({
          lerneinheit_id: einheitId,
          sprache,
          titel: ueb.titel,
          abschnitte: abschnitteSicher,
          freigegeben: false, // Spec §5: unfreigegeben bis Ausbilderbestaetigung
        });
        neuErzeugt += 1;
        sprachStatus[sprache] = 'erzeugt';
      }
      ergebnis.push({ lerneinheit_id: einheitId, status: 'ok', sprachen: sprachStatus });
    }
  } catch (e) {
    const fehlertext = e instanceof Error ? e.message : 'unbekannter_fehler';
    await service.from('ki_aufrufe').insert({
      traeger_id: profil.traeger_id,
      user_id: aufrufer.id,
      funktion: 'uebersetze_lerneinheit',
      modell: LLM_MODELL,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      latenz_ms: Date.now() - start,
      erfolg: false,
      fehlertext,
      request_id: requestId,
    });
    return jsonAntwort({ fehler: 'uebersetzung_fehlgeschlagen', detail: fehlertext }, 502);
  }

  const kosten = schaetzeKosten(inputTokens, outputTokens);
  await service.from('ki_aufrufe').insert({
    traeger_id: profil.traeger_id,
    user_id: aufrufer.id,
    funktion: 'uebersetze_lerneinheit',
    modell,
    input_tokens: inputTokens,
    output_tokens: outputTokens,
    kosten_eur: kosten,
    latenz_ms: Date.now() - start,
    erfolg: true,
    request_id: requestId,
  });

  return jsonAntwort(
    {
      hinweis: 'Uebersetzung ist eine Zusatz-Lernhilfe (Freigabe durch Ausbilder erforderlich).',
      neu_erzeugt: neuErzeugt,
      aus_cache: ausCache,
      uebersprungen_nicht_freigegeben: uebersprungen,
      ergebnis,
      budget_warnung_80: bisher + kosten >= budget * 0.8,
    },
    200,
  );
});
