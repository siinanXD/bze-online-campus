// @ts-nocheck — Deno-Laufzeit (Supabase Edge Function), kein Teil des Next.js-TS-Projekts.
//
// AP-09 — Edge Function `bewerte-freitext` (Spec §5).
//
// Bewertet eine Freitext-Antwort anhand Musterlösung und Bewertungsraster.
// Schreibt `ki_aufrufe`, aktualisiert `versuche`, optional `review_queue`,
// Cache und schließt die Prüfung ab, wenn alle Freitext-Punkte gesetzt sind.
//
// KI-Bewertung ist Lernfeedback, keine Prüfungsleistung (Spec Grundregel /
// CONTRIBUTING.md). Die Antwort enthält immer `hinweis_lernfeedback: true`.

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

const CONFIDENCE_REVIEW = 0.7;
const STICHPROBE_RATE = 0.05;

type Kriterium = { id: string; beschreibung?: string; punkte: number };
type Raster = { max_punkte?: number; kriterien?: Kriterium[]; akzeptierte_synonyme?: string[] };

type BewertungJson = {
  kriterien_bewertung: Array<{
    id: string;
    erfuellt: boolean;
    punkte: number;
    begruendung: string;
  }>;
  erzielte_punkte: number;
  max_punkte: number;
  staerken: string;
  luecken: string;
  verbesserungshinweis: string;
  deutsche_musterformulierung: string;
  confidence: number;
};

function jsonAntwort(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

function normalisiereAntwort(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\p{L}\p{N}\s.-]/gu, '');
}

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function mockBewertung(antwort: string, raster: Raster, musterloesung: string): BewertungJson {
  const kriterien = raster.kriterien ?? [];
  const max = Number((raster.max_punkte ?? kriterien.reduce((s, k) => s + k.punkte, 0)) || 4);
  const norm = normalisiereAntwort(antwort);
  const synonyme = (raster.akzeptierte_synonyme ?? []).map((s) => s.toLowerCase());
  const bewertete = kriterien.map((k) => {
    const tokens = `${k.beschreibung ?? ''} ${musterloesung}`
      .toLowerCase()
      .split(/\s+/)
      .filter((t) => t.length > 4)
      .slice(0, 8);
    const treffer =
      tokens.some((t) => norm.includes(t)) ||
      synonyme.some((s) => norm.includes(s));
    return {
      id: k.id,
      erfuellt: treffer,
      punkte: treffer ? k.punkte : 0,
      begruendung: treffer
        ? 'Inhaltlich nachvollziehbar (Mock-Bewertung).'
        : 'Kriterium in der Antwort nicht klar erkennbar (Mock-Bewertung).',
    };
  });
  const erzielte = bewertete.reduce((s, k) => s + k.punkte, 0);
  return {
    kriterien_bewertung: bewertete,
    erzielte_punkte: erzielte,
    max_punkte: max,
    staerken: erzielte > 0 ? 'Teile der Antwort treffen den erwarteten Inhalt.' : 'Noch keine klaren Stärken erkennbar.',
    luecken: erzielte < max ? 'Einige Kriterien fehlen oder sind unklar formuliert.' : 'Keine wesentlichen Lücken.',
    verbesserungshinweis: 'Vergleiche deine Antwort mit der Musterformulierung und ergänze fehlende Fachbegriffe.',
    deutsche_musterformulierung: musterloesung.slice(0, 500),
    confidence: 0.55,
  };
}

async function llmBewertung(eingabe: {
  aufgabenstellung: string;
  musterloesung: string;
  raster: Raster;
  antwort: string;
  antwortsprache: string;
  nutzersprache: string;
}): Promise<{ bewertung: BewertungJson; inputTokens: number; outputTokens: number; requestId: string }> {
  const system = `Du bist ein Bewertungsassistent für die schriftliche IHK-Prüfung (Lernfeedback, keine Prüfungsleistung).
Regeln:
- Bewerte ausschließlich nach dem Bewertungsraster.
- Akzeptiere sinngleiche Formulierungen und hinterlegte Synonyme.
- Bestrafe Rechtschreibung nicht, außer ein Fachbegriff ist erkennbar falsch verstanden.
- Nicht auf Deutsch verfasste Antworten inhaltlich bewerten und zusätzlich eine deutsche Musterformulierung liefern.
- Feedback in einfacher, ermutigender Sprache in der Nutzersprache (${eingabe.nutzersprache}).
- Bei Unsicherheit Confidence senken statt raten.
Antworte NUR mit JSON genau in dieser Form:
{"kriterien_bewertung":[{"id":"k1","erfuellt":true,"punkte":1,"begruendung":"…"}],"erzielte_punkte":0,"max_punkte":4,"staerken":"…","luecken":"…","verbesserungshinweis":"…","deutsche_musterformulierung":"…","confidence":0.85}`;

  const user = JSON.stringify({
    aufgabenstellung: eingabe.aufgabenstellung,
    musterloesung: eingabe.musterloesung,
    bewertungsraster: eingabe.raster,
    antwort: eingabe.antwort,
    antwortsprache: eingabe.antwortsprache,
    nutzersprache: eingabe.nutzersprache,
  });

  const res = await fetch(`${LLM_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${LLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: LLM_MODELL,
      temperature: 0.2,
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
  const bewertung = JSON.parse(content) as BewertungJson;
  if (typeof bewertung.confidence !== 'number' || typeof bewertung.erzielte_punkte !== 'number') {
    throw new Error('llm_ungueltiges_json');
  }
  return {
    bewertung,
    inputTokens: data.usage?.prompt_tokens ?? 0,
    outputTokens: data.usage?.completion_tokens ?? 0,
    requestId,
  };
}

/** Grobe EUR-Schätzung (OpenAI-ähnlich); für Budgetanzeige, nicht Abrechnung. */
function schaetzeKosten(inputTokens: number, outputTokens: number): number {
  return Number(((inputTokens * 0.00000015) + (outputTokens * 0.0000006)).toFixed(6));
}

Deno.serve(async (anfrage: Request) => {
  if (anfrage.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }
  if (anfrage.method !== 'POST') {
    return jsonAntwort({ fehler: 'methode_nicht_erlaubt' }, 405);
  }

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
    .select('id, rolle, traeger_id, sprache')
    .eq('id', aufrufer.id)
    .maybeSingle();
  if (!profil) return jsonAntwort({ fehler: 'profil_fehlt' }, 403);

  let body: { versuch_id?: string };
  try {
    body = await anfrage.json();
  } catch {
    return jsonAntwort({ fehler: 'ungueltige_anfrage' }, 400);
  }
  const versuchId = body.versuch_id;
  if (!versuchId) return jsonAntwort({ fehler: 'ungueltige_anfrage' }, 400);

  // Versuch + Frage laden (Service: Musterlösung ist für Teilnehmer RLS-gesperrt)
  const { data: versuch, error: vErr } = await service
    .from('versuche')
    .select('id, user_id, frage_id, antwort, antwort_sprache, erzielte_punkte, pruefung_ergebnis_id, ki_bewertung')
    .eq('id', versuchId)
    .maybeSingle();
  if (vErr || !versuch) return jsonAntwort({ fehler: 'versuch_unbekannt' }, 404);

  const istSelbst = versuch.user_id === aufrufer.id;
  const istBetreuer =
    profil.rolle === 'admin' ||
    profil.rolle === 'verwaltung' ||
    profil.rolle === 'ausbilder';

  if (!istSelbst && !istBetreuer) {
    return jsonAntwort({ fehler: 'keine_berechtigung' }, 403);
  }

  if (profil.rolle === 'ausbilder') {
    const { data: zuw } = await service
      .from('ausbilder_zuweisungen')
      .select('teilnehmer_id')
      .eq('ausbilder_id', aufrufer.id)
      .eq('teilnehmer_id', versuch.user_id)
      .maybeSingle();
    if (!zuw && profil.rolle === 'ausbilder') {
      return jsonAntwort({ fehler: 'keine_berechtigung' }, 403);
    }
  }

  if (versuch.erzielte_punkte != null && versuch.ki_bewertung) {
    return jsonAntwort({
      hinweis_lernfeedback: true,
      aus_cache: false,
      bereits_bewertet: true,
      bewertung: versuch.ki_bewertung,
      erzielte_punkte: versuch.erzielte_punkte,
    }, 200);
  }

  const { data: frage } = await service
    .from('fragen')
    .select('id, typ, aufgabenstellung')
    .eq('id', versuch.frage_id)
    .maybeSingle();
  if (!frage || frage.typ !== 'freitext') {
    return jsonAntwort({ fehler: 'keine_freitext_frage' }, 400);
  }

  const { data: loesung } = await service
    .from('freitext_loesungen')
    .select('musterloesung, bewertungsraster, max_punkte')
    .eq('frage_id', frage.id)
    .maybeSingle();
  if (!loesung) return jsonAntwort({ fehler: 'musterloesung_fehlt' }, 404);

  const antwortText =
    typeof versuch.antwort === 'object' && versuch.antwort && 'text' in versuch.antwort
      ? String((versuch.antwort as { text?: string }).text ?? '')
      : '';
  if (!antwortText.trim()) return jsonAntwort({ fehler: 'leere_antwort' }, 400);

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
      funktion: 'bewerte_freitext',
      modell: LLM_MODELL,
      erfolg: false,
      fehlertext: 'budget_ueberschritten',
      kosten_eur: 0,
    });
    return jsonAntwort({ fehler: 'budget_ueberschritten', bisher, budget }, 429);
  }

  const antwortHash = await sha256Hex(normalisiereAntwort(antwortText));
  const { data: cacheHit } = await service
    .from('freitext_bewertung_cache')
    .select('bewertung, confidence, modell')
    .eq('frage_id', frage.id)
    .eq('antwort_hash', antwortHash)
    .maybeSingle();

  const start = Date.now();
  let bewertung: BewertungJson;
  let inputTokens = 0;
  let outputTokens = 0;
  let requestId = crypto.randomUUID();
  let ausCache = false;
  let modell = LLM_MODELL;
  let erfolg = true;
  let fehlertext: string | null = null;

  try {
    if (cacheHit?.bewertung) {
      bewertung = cacheHit.bewertung as BewertungJson;
      ausCache = true;
      modell = cacheHit.modell ?? 'cache';
    } else if (LLM_MOCK || !LLM_API_KEY) {
      bewertung = mockBewertung(
        antwortText,
        loesung.bewertungsraster as Raster,
        loesung.musterloesung,
      );
      modell = LLM_MOCK || !LLM_API_KEY ? 'mock-raster' : LLM_MODELL;
    } else {
      const llm = await llmBewertung({
        aufgabenstellung: frage.aufgabenstellung,
        musterloesung: loesung.musterloesung,
        raster: loesung.bewertungsraster as Raster,
        antwort: antwortText,
        antwortsprache: versuch.antwort_sprache ?? 'de',
        nutzersprache: profil.sprache ?? 'de',
      });
      bewertung = llm.bewertung;
      inputTokens = llm.inputTokens;
      outputTokens = llm.outputTokens;
      requestId = llm.requestId;
    }

    // Punkte an Raster-Max klemmen
    const maxPunkte = Number(loesung.max_punkte ?? bewertung.max_punkte ?? 4);
    bewertung.max_punkte = maxPunkte;
    bewertung.erzielte_punkte = Math.max(
      0,
      Math.min(maxPunkte, Number(bewertung.erzielte_punkte) || 0),
    );
    bewertung.confidence = Math.max(0, Math.min(1, Number(bewertung.confidence) || 0));
  } catch (e) {
    erfolg = false;
    fehlertext = e instanceof Error ? e.message : 'unbekannter_fehler';
    await service.from('ki_aufrufe').insert({
      traeger_id: profil.traeger_id,
      user_id: aufrufer.id,
      funktion: 'bewerte_freitext',
      modell: LLM_MODELL,
      latenz_ms: Date.now() - start,
      erfolg: false,
      fehlertext,
      request_id: requestId,
    });
    return jsonAntwort({ fehler: 'bewertung_fehlgeschlagen', detail: fehlertext }, 502);
  }

  const kosten = ausCache ? 0 : schaetzeKosten(inputTokens, outputTokens);
  const latenz = Date.now() - start;

  await service.from('ki_aufrufe').insert({
    traeger_id: profil.traeger_id,
    user_id: aufrufer.id,
    funktion: 'bewerte_freitext',
    modell,
    input_tokens: inputTokens,
    output_tokens: outputTokens,
    kosten_eur: kosten,
    latenz_ms: latenz,
    erfolg: true,
    request_id: requestId,
  });

  if (!ausCache) {
    await service.from('freitext_bewertung_cache').upsert(
      {
        frage_id: frage.id,
        antwort_hash: antwortHash,
        bewertung,
        confidence: bewertung.confidence,
        modell,
      },
      { onConflict: 'frage_id,antwort_hash' },
    );
  }

  const schwellwert = Number(
    (traeger?.einstellungen as { freitext_schwellwert?: number } | null)?.freitext_schwellwert ??
      0.75,
  );
  const istKorrekt =
    bewertung.max_punkte > 0
      ? bewertung.erzielte_punkte / bewertung.max_punkte >= schwellwert
      : false;

  await service
    .from('versuche')
    .update({
      erzielte_punkte: bewertung.erzielte_punkte,
      ki_bewertung: bewertung,
      ki_confidence: bewertung.confidence,
      ist_korrekt: istKorrekt,
    })
    .eq('id', versuch.id);

  // Review-Queue: niedrige Confidence, Bestehensgrenze, Stichprobe
  const anGrenze =
    bewertung.max_punkte > 0 &&
    Math.abs(bewertung.erzielte_punkte / bewertung.max_punkte - schwellwert) < 0.05;
  const stichprobe = Math.random() < STICHPROBE_RATE;
  let reviewGrund: string | null = null;
  if (bewertung.confidence < CONFIDENCE_REVIEW) reviewGrund = 'niedrige_confidence';
  else if (anGrenze) reviewGrund = 'niedrige_confidence';
  else if (stichprobe) reviewGrund = 'stichprobe';

  if (reviewGrund) {
    await service.from('review_queue').insert({
      versuch_id: versuch.id,
      frage_id: frage.id,
      grund: reviewGrund,
      status: 'offen',
    });
  }

  let pruefungAbschluss = null;
  if (versuch.pruefung_ergebnis_id) {
    const { data } = await service.rpc('pruefung_freitext_abschliessen', {
      p_ergebnis_id: versuch.pruefung_ergebnis_id,
    });
    pruefungAbschluss = data;
  }

  const warnung80 = bisher + kosten >= budget * 0.8;

  return jsonAntwort(
    {
      hinweis_lernfeedback: true,
      aus_cache: ausCache,
      bewertung,
      erzielte_punkte: bewertung.erzielte_punkte,
      ist_korrekt: istKorrekt,
      review_grund: reviewGrund,
      pruefung_abschluss: pruefungAbschluss,
      budget_warnung_80: warnung80,
    },
    200,
  );
});
