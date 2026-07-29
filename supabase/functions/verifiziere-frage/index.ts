// @ts-nocheck — Deno-Laufzeit (Supabase Edge Function), kein Teil des Next.js-TS-Projekts.
//
// AP-12 — Edge Function `verifiziere-frage` (Spec §5 `verifiziere_frage`).
//
// Separater, unabhängiger Modellaufruf OHNE Kenntnis der Generierungsbegründung.
// Prüft je Frage:
//  * Ist die als korrekt markierte Antwort tatsächlich korrekt?
//  * Ist ein Distraktor ebenfalls vertretbar?
//  * Deckt sich ein Zahlenwert mit der Fundstelle?
//  * Ist die Aufgabe eindeutig?
// Ausgabe je Frage: {bestaetigt: bool, einwaende: string[], confidence: number}.
//
// Freigabelogik (Spec §5):
//  * bestätigt & hohe Confidence  → Status `verifiziert`.
//    - Kernfragen bleiben `verifiziert` (immer manuelle Ausbilderfreigabe).
//    - Erweiterungspool: `verifiziert` → automatisch `freigegeben`, mit 10 %
//      Zufallsstichprobe zusätzlich in die review_queue (Grund `stichprobe`).
//  * sonst → Status bleibt `entwurf`, review_queue Grund
//    `verifikation_fehlgeschlagen`.
//
// Schreibt `ki_aufrufe`, Budgetprüfung wie `bewerte-freitext`. LLM_MOCK=1
// liefert eine deterministische, regelbasierte Verifikation ohne API-Aufruf.

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

const CONFIDENCE_MIN = 0.7;
const STICHPROBE_RATE = 0.1; // 10 % (Spec §5)
const MAX_BATCH = 50;

type Verifikation = { bestaetigt: boolean; einwaende: string[]; confidence: number };

function jsonAntwort(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

function schaetzeKosten(inputTokens: number, outputTokens: number): number {
  return Number(((inputTokens * 0.00000015) + (outputTokens * 0.0000006)).toFixed(6));
}

type FrageDaten = {
  id: string;
  typ: string;
  aufgabenstellung: string;
  kern: boolean;
  enthaelt_zahlenwert: boolean;
  quellenstufe: number | null;
  tabellenbuch_fundstelle: { seite?: number | string } | null;
  optionen: Array<{ text: string; ist_korrekt: boolean; erklaerung: string | null }>;
  musterloesung: string | null;
};

// Deterministische, regelbasierte Verifikation (Mock/Offline). Prüft die harten,
// strukturellen Kriterien, die auch ohne Sprachmodell entscheidbar sind.
function mockVerifikation(f: FrageDaten): Verifikation {
  const einwaende: string[] = [];
  let confidence = 0.85;

  if (f.typ === 'mc') {
    const korrekt = f.optionen.filter((o) => o.ist_korrekt).length;
    if (f.optionen.length !== 4) {
      einwaende.push('MC-Frage hat nicht genau vier Optionen.');
      confidence = 0.3;
    }
    if (korrekt !== 1) {
      einwaende.push('Es ist nicht genau eine Option als korrekt markiert.');
      confidence = 0.3;
    }
    if (f.optionen.some((o) => !o.text?.trim())) {
      einwaende.push('Mindestens eine Option ist leer.');
      confidence = Math.min(confidence, 0.4);
    }
  } else if (f.typ === 'freitext') {
    if (!f.musterloesung?.trim()) {
      einwaende.push('Freitextfrage ohne Musterlösung.');
      confidence = 0.3;
    }
  }

  const hatFundstelle =
    !!f.tabellenbuch_fundstelle &&
    f.tabellenbuch_fundstelle.seite != null &&
    String(f.tabellenbuch_fundstelle.seite).trim() !== '';
  if (f.enthaelt_zahlenwert && (!hatFundstelle || (f.quellenstufe ?? 4) >= 4)) {
    einwaende.push('Zahlenwert ohne belastbare Fundstelle (Stufe 1–3).');
    confidence = Math.min(confidence, 0.25);
  }
  if (f.aufgabenstellung.trim().length < 12) {
    einwaende.push('Aufgabenstellung wirkt zu knapp/uneindeutig.');
    confidence = Math.min(confidence, 0.5);
  }

  return { bestaetigt: einwaende.length === 0, einwaende, confidence };
}

async function llmVerifikation(f: FrageDaten): Promise<{ v: Verifikation; inputTokens: number; outputTokens: number; requestId: string }> {
  const system = `Du bist ein unabhängiger Prüfer für Prüfungsaufgaben (IHK, Metall-/Kunststofftechnik).
Du kennst die Begründung der Erstellung NICHT. Prüfe kritisch:
- Ist die als korrekt markierte Antwort tatsächlich fachlich korrekt?
- Ist ein Distraktor ebenfalls vertretbar/mehrdeutig?
- Deckt sich ein Zahlenwert mit der angegebenen Fundstelle (Plausibilität)?
- Ist die Aufgabe eindeutig und verständlich?
Antworte NUR mit JSON: {"bestaetigt": true, "einwaende": ["…"], "confidence": 0.9}
Bei Unsicherheit Confidence senken statt raten.`;

  const user = JSON.stringify({
    typ: f.typ,
    aufgabenstellung: f.aufgabenstellung,
    optionen: f.optionen,
    musterloesung: f.musterloesung,
    enthaelt_zahlenwert: f.enthaelt_zahlenwert,
    quellenstufe: f.quellenstufe,
    tabellenbuch_fundstelle: f.tabellenbuch_fundstelle,
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
    const t = await res.text();
    throw new Error(`llm_fehler_${res.status}:${t.slice(0, 200)}`);
  }
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('llm_leere_antwort');
  const parsed = JSON.parse(content) as Verifikation;
  return {
    v: {
      bestaetigt: !!parsed.bestaetigt,
      einwaende: Array.isArray(parsed.einwaende) ? parsed.einwaende.map(String) : [],
      confidence: Math.max(0, Math.min(1, Number(parsed.confidence) || 0)),
    },
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
  if (!['ausbilder', 'verwaltung', 'admin'].includes(profil.rolle)) {
    return jsonAntwort({ fehler: 'keine_berechtigung' }, 403);
  }

  let body: { frage_id?: string; frage_ids?: string[] };
  try {
    body = await anfrage.json();
  } catch {
    return jsonAntwort({ fehler: 'ungueltige_anfrage' }, 400);
  }
  const ids = Array.isArray(body.frage_ids)
    ? body.frage_ids.map(String)
    : body.frage_id
      ? [String(body.frage_id)]
      : [];
  if (ids.length === 0) return jsonAntwort({ fehler: 'ungueltige_anfrage' }, 400);
  const zuPruefen = ids.slice(0, MAX_BATCH);

  // Budgetprüfung (Spec §5).
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
      funktion: 'verifiziere_frage',
      modell: LLM_MODELL,
      erfolg: false,
      fehlertext: 'budget_ueberschritten',
      kosten_eur: 0,
    });
    return jsonAntwort({ fehler: 'budget_ueberschritten', bisher, budget }, 429);
  }

  // Fragen + Optionen + Musterlösungen laden (Service: RLS-unabhängig, da Rolle
  // oben bereits geprüft wurde).
  const { data: fragen } = await service
    .from('fragen')
    .select('id, typ, aufgabenstellung, kern, enthaelt_zahlenwert, quellenstufe, tabellenbuch_fundstelle, status')
    .in('id', zuPruefen);
  if (!fragen || fragen.length === 0) return jsonAntwort({ fehler: 'frage_unbekannt' }, 404);

  const { data: optionen } = await service
    .from('antwortoptionen')
    .select('frage_id, text, ist_korrekt, erklaerung')
    .in('frage_id', zuPruefen);
  const { data: loesungen } = await service
    .from('freitext_loesungen')
    .select('frage_id, musterloesung')
    .in('frage_id', zuPruefen);

  const optMap = new Map<string, Array<{ text: string; ist_korrekt: boolean; erklaerung: string | null }>>();
  for (const o of optionen ?? []) {
    const arr = optMap.get(o.frage_id) ?? [];
    arr.push({ text: o.text, ist_korrekt: o.ist_korrekt, erklaerung: o.erklaerung });
    optMap.set(o.frage_id, arr);
  }
  const loesMap = new Map((loesungen ?? []).map((l) => [l.frage_id, l.musterloesung]));

  const start = Date.now();
  let inputTokens = 0;
  let outputTokens = 0;
  let requestId = crypto.randomUUID();
  let modell = LLM_MOCK || !LLM_API_KEY ? 'mock-verifier' : LLM_MODELL;
  let fehlgeschlagen = false;

  const ergebnisse: Array<{ frage_id: string; status: string; verifikation: Verifikation }> = [];

  for (const fr of fragen) {
    const f: FrageDaten = {
      id: fr.id,
      typ: fr.typ,
      aufgabenstellung: fr.aufgabenstellung,
      kern: fr.kern,
      enthaelt_zahlenwert: fr.enthaelt_zahlenwert,
      quellenstufe: fr.quellenstufe,
      tabellenbuch_fundstelle: fr.tabellenbuch_fundstelle,
      optionen: optMap.get(fr.id) ?? [],
      musterloesung: loesMap.get(fr.id) ?? null,
    };

    let v: Verifikation;
    try {
      if (LLM_MOCK || !LLM_API_KEY) {
        v = mockVerifikation(f);
      } else {
        const r = await llmVerifikation(f);
        v = r.v;
        inputTokens += r.inputTokens;
        outputTokens += r.outputTokens;
        requestId = r.requestId;
      }
    } catch (e) {
      fehlgeschlagen = true;
      v = { bestaetigt: false, einwaende: [e instanceof Error ? e.message : 'verifikation_fehler'], confidence: 0 };
    }

    let neuerStatus: string;
    if (v.bestaetigt && v.confidence >= CONFIDENCE_MIN) {
      if (f.kern) {
        // Kernfragen immer manuelle Ausbilderfreigabe → bleibt verifiziert.
        neuerStatus = 'verifiziert';
      } else {
        // Erweiterungspool: automatisch freigeben, 10 % Stichprobe in Review.
        neuerStatus = 'freigegeben';
        if (Math.random() < STICHPROBE_RATE) {
          await service.from('review_queue').insert({
            frage_id: f.id,
            grund: 'stichprobe',
            status: 'offen',
          });
        }
      }
    } else {
      neuerStatus = 'entwurf';
      await service.from('review_queue').insert({
        frage_id: f.id,
        grund: 'verifikation_fehlgeschlagen',
        status: 'offen',
      });
    }

    await service
      .from('fragen')
      .update({
        status: neuerStatus,
        verifikation: { ...v, modell, geprueft_am: new Date().toISOString() },
        ...(neuerStatus === 'freigegeben' ? { geprueft_am: new Date().toISOString() } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq('id', f.id);

    ergebnisse.push({ frage_id: f.id, status: neuerStatus, verifikation: v });
  }

  const kosten = schaetzeKosten(inputTokens, outputTokens);
  await service.from('ki_aufrufe').insert({
    traeger_id: profil.traeger_id,
    user_id: aufrufer.id,
    funktion: 'verifiziere_frage',
    modell,
    input_tokens: inputTokens,
    output_tokens: outputTokens,
    kosten_eur: kosten,
    latenz_ms: Date.now() - start,
    erfolg: !fehlgeschlagen,
    request_id: requestId,
  });

  return jsonAntwort(
    {
      geprueft: ergebnisse.length,
      ergebnisse,
      budget_warnung_80: bisher + kosten >= budget * 0.8,
    },
    200,
  );
});
