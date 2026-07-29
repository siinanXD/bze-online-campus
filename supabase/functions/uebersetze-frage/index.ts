// @ts-nocheck — Deno-Laufzeit (Supabase Edge Function), kein Teil des Next.js-TS-Projekts.
//
// AP-14 — Edge Function `uebersetze-frage` (Spec §5 `uebersetze_frage`).
//
// Erzeugt Zusatz-Uebersetzungen zu Pruefungsfragen in die Zielsprachen und legt
// sie in `fragen_uebersetzungen` ab.
//
// NICHT VERHANDELBAR (Spec §5 / Grundregel 4):
// - **Nur der Kernpool wird uebersetzt** (fragen.kern = true). Nicht-Kernfragen
//   werden uebersprungen.
// - Uebersetzungen sind **unfreigegeben bis Ausbilderbestaetigung**
//   (freigegeben = false) und dauerhaft gecacht (bestehende Zeilen werden nicht
//   neu erzeugt).
// - Pruefungsinhalte bleiben Deutsch; die Uebersetzung ist eine ZUSATZ-Hilfe.
//   Zahlenwerte, Formeln, Einheiten und Normbezuege werden 1:1 uebernommen.
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

// Zielsprachen = alle i18n-Locales ausser der Quellsprache Deutsch (i18n.ts:
// de,en,fr,ar,uk,tr). Deutsch ist die maßgebliche Quelle und wird nicht uebersetzt.
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

type Option = { id: string; text: string };
type Uebersetzung = { aufgabenstellung: string; optionen: Option[] };

function jsonAntwort(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

/** Grobe EUR-Schaetzung analog bewerte-freitext (Budgetanzeige, keine Abrechnung). */
function schaetzeKosten(inputTokens: number, outputTokens: number): number {
  return Number(((inputTokens * 0.00000015) + (outputTokens * 0.0000006)).toFixed(6));
}

/** Deterministische Mock-Uebersetzung ohne LLM (Offline-/Testbetrieb). */
function mockUebersetzung(sprache: string, aufgabenstellung: string, optionen: Option[]): Uebersetzung {
  const marke = `[${sprache}] `;
  return {
    aufgabenstellung: marke + aufgabenstellung,
    optionen: optionen.map((o) => ({ id: o.id, text: marke + o.text })),
  };
}

async function llmUebersetzung(
  sprache: string,
  aufgabenstellung: string,
  optionen: Option[],
): Promise<{ uebersetzung: Uebersetzung; inputTokens: number; outputTokens: number; requestId: string }> {
  const system = `Du bist Fachuebersetzer fuer die deutsche Berufsausbildung (IHK).
Uebersetze den Pruefungstext ins ${SPRACHNAMEN[sprache] ?? sprache} (Sprachcode ${sprache}).
STRIKTE REGELN:
- Die Uebersetzung ist eine ZUSATZ-Lernhilfe zum deutschen Original, kein Ersatz.
- Uebernimm Zahlenwerte, Einheiten, Formeln, Toleranzen und Normbezuege (z. B. DIN EN ISO 2768-1) UNVERAENDERT und exakt.
- Aendere keine Bedeutung, ergaenze und entferne nichts.
- Fachbegriffe natuerlich und verstaendlich uebersetzen; deutsche Fachkuerzel (IHK, DIN) bleiben stehen.
- Fuer Arabisch: korrekte RTL-taugliche Uebersetzung, Zahlen in westarabischen Ziffern (0-9).
Antworte NUR mit JSON exakt in dieser Form:
{"aufgabenstellung":"…","optionen":[{"id":"…","text":"…"}]}
Die Reihenfolge und die ids der Optionen bleiben identisch zur Eingabe.`;

  const user = JSON.stringify({ zielsprache: sprache, aufgabenstellung, optionen });

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
  if (typeof parsed.aufgabenstellung !== 'string' || !Array.isArray(parsed.optionen)) {
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

  // Uebersetzungen erzeugen/freigeben ist Ausbilder-/Verwaltungs-/Admin-Sache.
  const darf = profil.rolle === 'admin' || profil.rolle === 'verwaltung' || profil.rolle === 'ausbilder';
  if (!darf) return jsonAntwort({ fehler: 'nicht_berechtigt' }, 403);

  let body: { frage_id?: string; frage_ids?: string[]; sprachen?: string[] };
  try {
    body = await anfrage.json();
  } catch {
    return jsonAntwort({ fehler: 'ungueltige_anfrage' }, 400);
  }

  const frageIds = Array.isArray(body.frage_ids)
    ? body.frage_ids.map((s) => String(s))
    : body.frage_id
      ? [String(body.frage_id)]
      : [];
  if (frageIds.length === 0) return jsonAntwort({ fehler: 'keine_frage_id' }, 400);

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
      funktion: 'uebersetze_frage',
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
    for (const frageId of frageIds) {
      const { data: frage } = await service
        .from('fragen')
        .select('id, kern, status, aufgabenstellung')
        .eq('id', frageId)
        .maybeSingle();
      if (!frage) {
        ergebnis.push({ frage_id: frageId, status: 'nicht_gefunden' });
        continue;
      }
      // Nur der Kernpool wird uebersetzt (Spec §5).
      if (frage.kern !== true) {
        uebersprungen += 1;
        ergebnis.push({ frage_id: frageId, status: 'kein_kernpool' });
        continue;
      }

      const { data: optionenRoh } = await service
        .from('antwortoptionen')
        .select('id, text, reihenfolge')
        .eq('frage_id', frageId)
        .order('reihenfolge', { ascending: true });
      const optionen: Option[] = (optionenRoh ?? []).map((o) => ({ id: o.id, text: o.text }));

      // Bereits vorhandene Sprachen = dauerhafter Cache, nicht neu erzeugen.
      const { data: vorhanden } = await service
        .from('fragen_uebersetzungen')
        .select('sprache')
        .eq('frage_id', frageId);
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
          ueb = mockUebersetzung(sprache, frage.aufgabenstellung, optionen);
        } else {
          const llm = await llmUebersetzung(sprache, frage.aufgabenstellung, optionen);
          ueb = llm.uebersetzung;
          inputTokens += llm.inputTokens;
          outputTokens += llm.outputTokens;
          requestId = llm.requestId;
        }
        // Optionen hart auf den Bestand begrenzen (keine erfundenen Optionen).
        const gueltigeIds = new Set(optionen.map((o) => o.id));
        const optionenSicher = (ueb.optionen ?? [])
          .filter((o) => o && gueltigeIds.has(o.id) && typeof o.text === 'string');

        await service.from('fragen_uebersetzungen').insert({
          frage_id: frageId,
          sprache,
          aufgabenstellung: ueb.aufgabenstellung,
          optionen: optionenSicher,
          freigegeben: false, // Spec §5: unfreigegeben bis Ausbilderbestaetigung
        });
        neuErzeugt += 1;
        sprachStatus[sprache] = 'erzeugt';
      }
      ergebnis.push({ frage_id: frageId, status: 'ok', sprachen: sprachStatus });
    }
  } catch (e) {
    const fehlertext = e instanceof Error ? e.message : 'unbekannter_fehler';
    await service.from('ki_aufrufe').insert({
      traeger_id: profil.traeger_id,
      user_id: aufrufer.id,
      funktion: 'uebersetze_frage',
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
    funktion: 'uebersetze_frage',
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
      uebersprungen_kein_kernpool: uebersprungen,
      ergebnis,
      budget_warnung_80: bisher + kosten >= budget * 0.8,
    },
    200,
  );
});
