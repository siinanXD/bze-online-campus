// @ts-nocheck — Deno-Laufzeit (Supabase Edge Function), kein Teil des Next.js-TS-Projekts.
//
// AP-18 — Edge Function `formuliere-nachweis` (Spec §5 `formuliere_nachweis`).
//
// Formuliert aus Stichworten oder einem Diktattranskript des Teilnehmers einen
// sauberen Berichtstext für den Ausbildungsnachweis und schlägt passende
// Positionen des Ausbildungsrahmenplans vor.
//
// NICHT VERHANDELBAR (Spec Grundregel 14 / AGENTS.md): Das Modell formuliert
// AUSSCHLIESSLICH aus den Eingaben des Teilnehmers. Es ergänzt oder erfindet
// keine Tätigkeiten. Die Oberfläche zeigt den Hinweis
// „KI-Formulierungshilfe — Inhalte stammen von dir."
//
// Schreibt `ki_aufrufe`, Budgetprüfung wie `bewerte-freitext`, LLM_MOCK=1
// liefert eine deterministische Formulierung ohne LLM-Aufruf.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const LLM_API_KEY = Deno.env.get('LLM_API_KEY') ?? '';
const LLM_MODELL = Deno.env.get('LLM_MODELL') ?? 'gpt-4o-mini';
const LLM_BASE_URL = (Deno.env.get('LLM_BASE_URL') ?? 'https://api.openai.com/v1').replace(/\/$/, '');
const LLM_MOCK = (Deno.env.get('LLM_MOCK') ?? '') === '1';

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const ARTEN = ['tag', 'woche', 'monat', 'fach'];

type FormulierungJson = {
  taetigkeiten: string;
  unterweisungen: string;
  berufsschulthemen: string;
  rahmenplan_positionen: string[];
};

function jsonAntwort(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

/** Grobe EUR-Schätzung analog bewerte-freitext (Budgetanzeige, keine Abrechnung). */
function schaetzeKosten(inputTokens: number, outputTokens: number): number {
  return Number(((inputTokens * 0.00000015) + (outputTokens * 0.0000006)).toFixed(6));
}

/**
 * Deterministische Formulierung ohne LLM. Reine Umformung der Eingabe in
 * ganze Sätze — es wird NICHTS inhaltlich ergänzt. Rahmenplan-Vorschläge nur
 * über Stichwortabgleich mit dem eingegebenen Text.
 */
function mockFormulierung(eingabe: {
  taetigkeiten: string;
  unterweisungen: string;
  berufsschulthemen: string;
  rahmenplanKatalog: string[];
}): FormulierungJson {
  const zuSatz = (roh: string): string => {
    const teile = roh
      .split(/[\n;,]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .map((s) => (/[.!?]$/.test(s) ? s : `${s}.`));
    return teile.join(' ');
  };

  const alleWorte = `${eingabe.taetigkeiten} ${eingabe.unterweisungen} ${eingabe.berufsschulthemen}`
    .toLowerCase();
  const positionen = eingabe.rahmenplanKatalog
    .filter((pos) => {
      const stichworte = pos.toLowerCase().split(/[\s/–-]+/).filter((w) => w.length > 4);
      return stichworte.some((w) => alleWorte.includes(w));
    })
    .slice(0, 5);

  return {
    taetigkeiten: zuSatz(eingabe.taetigkeiten),
    unterweisungen: zuSatz(eingabe.unterweisungen),
    berufsschulthemen: zuSatz(eingabe.berufsschulthemen),
    rahmenplan_positionen: positionen,
  };
}

async function llmFormulierung(eingabe: {
  taetigkeiten: string;
  unterweisungen: string;
  berufsschulthemen: string;
  art: string;
  zeitraum_von: string | null;
  zeitraum_bis: string | null;
  nutzersprache: string;
  rahmenplanKatalog: string[];
}): Promise<{ formulierung: FormulierungJson; inputTokens: number; outputTokens: number; requestId: string }> {
  const system = `Du bist eine Formulierungshilfe für den deutschen Ausbildungsnachweis (Berichtsheft).
STRIKTE REGELN:
- Formuliere AUSSCHLIESSLICH aus den Eingaben des Teilnehmers.
- Ergänze oder erfinde KEINE Tätigkeiten, Unterweisungen oder Themen.
- Wenn ein Feld leer ist, bleibt es leer ("").
- Schreibe sachlich in ganzen deutschen Sätzen, Vergangenheitsform, Ich-Perspektive.
- Der Bericht ist immer auf Deutsch (Prüfungsinhalt), unabhängig von der Nutzersprache.
- Schlage aus dem übergebenen Rahmenplan-Katalog NUR Positionen vor, die durch die Eingabe belegt sind.
Antworte NUR mit JSON genau in dieser Form:
{"taetigkeiten":"…","unterweisungen":"…","berufsschulthemen":"…","rahmenplan_positionen":["…"]}`;

  const user = JSON.stringify({
    berichtsart: eingabe.art,
    zeitraum_von: eingabe.zeitraum_von,
    zeitraum_bis: eingabe.zeitraum_bis,
    nutzersprache: eingabe.nutzersprache,
    eingabe_taetigkeiten: eingabe.taetigkeiten,
    eingabe_unterweisungen: eingabe.unterweisungen,
    eingabe_berufsschulthemen: eingabe.berufsschulthemen,
    rahmenplan_katalog: eingabe.rahmenplanKatalog,
  });

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
  const formulierung = JSON.parse(content) as FormulierungJson;
  if (typeof formulierung.taetigkeiten !== 'string') throw new Error('llm_ungueltiges_json');
  return {
    formulierung,
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
    .select('id, traeger_id, sprache')
    .eq('id', aufrufer.id)
    .maybeSingle();
  if (!profil) return jsonAntwort({ fehler: 'profil_fehlt' }, 403);

  let body: {
    taetigkeiten?: string;
    unterweisungen?: string;
    berufsschulthemen?: string;
    art?: string;
    zeitraum_von?: string;
    zeitraum_bis?: string;
    rahmenplan_katalog?: string[];
  };
  try {
    body = await anfrage.json();
  } catch {
    return jsonAntwort({ fehler: 'ungueltige_anfrage' }, 400);
  }

  const taetigkeiten = String(body.taetigkeiten ?? '').slice(0, 4000);
  const unterweisungen = String(body.unterweisungen ?? '').slice(0, 4000);
  const berufsschulthemen = String(body.berufsschulthemen ?? '').slice(0, 4000);
  const art = ARTEN.includes(String(body.art)) ? String(body.art) : 'woche';
  const rahmenplanKatalog = Array.isArray(body.rahmenplan_katalog)
    ? body.rahmenplan_katalog.map((s) => String(s)).slice(0, 60)
    : [];

  if (!taetigkeiten.trim() && !unterweisungen.trim() && !berufsschulthemen.trim()) {
    return jsonAntwort({ fehler: 'leere_eingabe' }, 400);
  }

  // Budgetprüfung gegen traeger.einstellungen.monatsbudget_eur (Spec §5).
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
      funktion: 'formuliere_nachweis',
      modell: LLM_MODELL,
      erfolg: false,
      fehlertext: 'budget_ueberschritten',
      kosten_eur: 0,
    });
    return jsonAntwort({ fehler: 'budget_ueberschritten', bisher, budget }, 429);
  }

  const start = Date.now();
  let formulierung: FormulierungJson;
  let inputTokens = 0;
  let outputTokens = 0;
  let requestId = crypto.randomUUID();
  let modell = LLM_MODELL;

  try {
    if (LLM_MOCK || !LLM_API_KEY) {
      formulierung = mockFormulierung({ taetigkeiten, unterweisungen, berufsschulthemen, rahmenplanKatalog });
      modell = 'mock-formulierung';
    } else {
      const llm = await llmFormulierung({
        taetigkeiten,
        unterweisungen,
        berufsschulthemen,
        art,
        zeitraum_von: body.zeitraum_von ?? null,
        zeitraum_bis: body.zeitraum_bis ?? null,
        nutzersprache: profil.sprache ?? 'de',
        rahmenplanKatalog,
      });
      formulierung = llm.formulierung;
      inputTokens = llm.inputTokens;
      outputTokens = llm.outputTokens;
      requestId = llm.requestId;
    }
  } catch (e) {
    const fehlertext = e instanceof Error ? e.message : 'unbekannter_fehler';
    await service.from('ki_aufrufe').insert({
      traeger_id: profil.traeger_id,
      user_id: aufrufer.id,
      funktion: 'formuliere_nachweis',
      modell: LLM_MODELL,
      latenz_ms: Date.now() - start,
      erfolg: false,
      fehlertext,
      request_id: requestId,
    });
    return jsonAntwort({ fehler: 'formulierung_fehlgeschlagen', detail: fehlertext }, 502);
  }

  // Rahmenplan-Vorschläge hart auf den übergebenen Katalog begrenzen — das Modell
  // darf keine Positionen erfinden.
  const katalogSet = new Set(rahmenplanKatalog);
  formulierung.rahmenplan_positionen = (formulierung.rahmenplan_positionen ?? [])
    .filter((p) => typeof p === 'string' && (katalogSet.size === 0 || katalogSet.has(p)))
    .slice(0, 8);

  const kosten = schaetzeKosten(inputTokens, outputTokens);
  await service.from('ki_aufrufe').insert({
    traeger_id: profil.traeger_id,
    user_id: aufrufer.id,
    funktion: 'formuliere_nachweis',
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
      hinweis_ki_formulierungshilfe: 'KI-Formulierungshilfe — Inhalte stammen von dir.',
      ki_formuliert: true,
      formulierung,
      budget_warnung_80: bisher + kosten >= budget * 0.8,
    },
    200,
  );
});
