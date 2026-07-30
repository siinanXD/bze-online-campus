// @ts-nocheck — Deno-Laufzeit (Supabase Edge Function), kein Teil des Next.js-TS-Projekts.
//
// AP-12 — Edge Function `generiere-fragen` (Spec §5 `generiere_fragen`).
//
// Erzeugt im Batchbetrieb Fragenentwürfe zu einem Thema. Ausgabe immer Status
// `entwurf`. MC mit genau vier Optionen (eine korrekt, plausible Distraktoren,
// je Option eine kurze Erklärung); Freitext mit Musterlösung + Bewertungsraster.
//
// NICHT VERHANDELBAR (Spec Grundregel / CONTRIBUTING.md):
//  * Keine Reproduktion geschützter Prüfungsaufgaben — nur eigenständig
//    formulierte Aufgaben.
//  * Quellenhierarchie hart durchsetzen: Enthält eine Frage einen Zahlenwert
//    (Formel/Grenzwert/Normbezug) und stammt aus Stufe 4 oder hat keine
//    Fundstelle → ablehnen, nie in den Kernpool.
//
// Nachgelagert (Spec §5): 1. Dublettencheck (Embedding-Kosinus > 0,92 verwerfen),
// 2. n-Gramm-Ähnlichkeit → review_queue (`aehnlichkeit_zu_hoch`),
// 3. `verifiziere-frage` aufrufen.
//
// Schreibt `ki_aufrufe`, Budgetprüfung wie `bewerte-freitext`. LLM_MOCK=1
// liefert plausible Entwürfe und ein hash-basiertes Pseudo-Embedding ohne
// externen API-Aufruf (dokumentierte Einschränkung, siehe README).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const LLM_API_KEY = Deno.env.get('LLM_API_KEY') ?? '';
const LLM_MODELL = Deno.env.get('LLM_MODELL') ?? 'gpt-4o-mini';
const LLM_BASE_URL = (Deno.env.get('LLM_BASE_URL') ?? 'https://api.openai.com/v1').replace(/\/$/, '');
const EMBED_MODELL = Deno.env.get('EMBED_MODELL') ?? 'text-embedding-3-small';
const LLM_MOCK = (Deno.env.get('LLM_MOCK') ?? '') === '1';

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const EMBED_DIM = 1536;
const DUBLETTE_SCHWELLE = 0.92;
const NGRAM_SCHWELLE = 0.6;
const MAX_BATCH = 50;

type Fundstelle = { verlag?: string; auflage?: string; seite?: number | string; tabelle?: string } | null;

type MCOption = { text: string; ist_korrekt: boolean; erklaerung: string };

type GenFrage = {
  aufgabenstellung: string;
  typ: 'mc' | 'freitext';
  optionen?: MCOption[];
  musterloesung?: string;
  bewertungsraster?: unknown;
  quellenstufe: number;
  tabellenbuch_fundstelle: Fundstelle;
  normbezuege: string[];
  enthaelt_zahlenwert: boolean;
};

function jsonAntwort(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

function schaetzeKosten(inputTokens: number, outputTokens: number): number {
  return Number(((inputTokens * 0.00000015) + (outputTokens * 0.0000006)).toFixed(6));
}

// ---------------------------------------------------------------------
// Pseudo-Embedding für den Mock-/Offline-Betrieb: Wörter werden per Hash auf
// EMBED_DIM Buckets verteilt und der Vektor L2-normiert. Nahezu gleicher Text
// erhält nahezu gleiche Vektoren → die Kosinus-Dublettensuche funktioniert
// deterministisch ohne externen API-Aufruf. EINSCHRÄNKUNG: rein lexikalisch,
// kein semantisches Verständnis (siehe README).
// ---------------------------------------------------------------------
function hashWort(w: string): number {
  let h = 2166136261;
  for (let i = 0; i < w.length; i++) {
    h ^= w.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % EMBED_DIM;
}

function fakeEmbedding(text: string): number[] {
  const v = new Array(EMBED_DIM).fill(0);
  const worte = text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean);
  for (const w of worte) v[hashWort(w)] += 1;
  let norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
  if (norm === 0) norm = 1;
  return v.map((x) => x / norm);
}

async function echtesEmbedding(text: string): Promise<{ vektor: number[]; inputTokens: number }> {
  const res = await fetch(`${LLM_BASE_URL}/embeddings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${LLM_API_KEY}` },
    body: JSON.stringify({ model: EMBED_MODELL, input: text.slice(0, 8000) }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`embed_fehler_${res.status}:${t.slice(0, 160)}`);
  }
  const data = await res.json();
  return { vektor: data.data?.[0]?.embedding ?? [], inputTokens: data.usage?.total_tokens ?? 0 };
}

function vektorLiteral(v: number[]): string {
  return `[${v.map((x) => (Number.isFinite(x) ? x : 0)).join(',')}]`;
}

// n-Gramm-Ähnlichkeit (Zeichen-Trigramm-Containment) gegen einen Referenztext.
function trigramme(text: string): Set<string> {
  const s = text.toLowerCase().replace(/\s+/g, ' ').trim();
  const set = new Set<string>();
  for (let i = 0; i < s.length - 2; i++) set.add(s.slice(i, i + 3));
  return set;
}

function ngrammAehnlichkeit(a: string, b: string): number {
  const ta = trigramme(a);
  const tb = trigramme(b);
  if (ta.size === 0 || tb.size === 0) return 0;
  let treffer = 0;
  for (const g of ta) if (tb.has(g)) treffer++;
  return treffer / Math.min(ta.size, tb.size);
}

// ---------------------------------------------------------------------
// Mock-Generierung: plausible, eigenständig formulierte Entwürfe. Variiert je
// Index, damit erzeugte Fragen nicht untereinander als Dubletten gelten.
// ---------------------------------------------------------------------
const MC_THEMEN_HINWEISE = [
  'welche Aussage zur Fertigung trifft zu',
  'welches Prüfmittel ist geeignet',
  'welche Maßnahme sichert die Qualität',
  'welcher Werkstoff passt zur Anforderung',
  'welche Reihenfolge ist korrekt',
];

function mockFrage(n: number, params: {
  themaName: string;
  typ: 'mc' | 'freitext';
  schwierigkeit: number;
  zielpool: 'kern' | 'erweiterung';
}): GenFrage {
  const stufe = params.zielpool === 'kern' ? 1 : 3;
  const fundstelle: Fundstelle = stufe === 1
    ? { verlag: 'Europa-Lehrmittel', auflage: 'aktuell', seite: 100 + n, tabelle: `T${n}` }
    : { verlag: 'Trägerskript', auflage: 'intern', seite: 10 + n };
  const enthaeltZahl = n % 3 === 0; // ein Teil mit Zahlenwert (Fundstelle vorhanden -> zulässig)

  if (params.typ === 'freitext') {
    return {
      typ: 'freitext',
      aufgabenstellung: `${params.themaName}: Erläutern Sie in eigenen Worten den Sachverhalt Nr. ${n} `
        + `(Schwierigkeit ${params.schwierigkeit}).`,
      musterloesung: `Musterlösung ${n}: Der Sachverhalt wird fachlich korrekt und vollständig beschrieben.`,
      bewertungsraster: {
        max_punkte: 4,
        kriterien: [
          { id: 'k1', beschreibung: 'Fachbegriff korrekt genannt', punkte: 2 },
          { id: 'k2', beschreibung: 'Zusammenhang erklärt', punkte: 2 },
        ],
      },
      quellenstufe: stufe,
      tabellenbuch_fundstelle: fundstelle,
      normbezuege: enthaeltZahl ? ['DIN EN ISO 2768-1'] : [],
      enthaelt_zahlenwert: enthaeltZahl,
    };
  }

  const hinweis = MC_THEMEN_HINWEISE[n % MC_THEMEN_HINWEISE.length];
  const optionen: MCOption[] = [
    { text: `Antwort A zu ${hinweis} (Variante ${n})`, ist_korrekt: true, erklaerung: 'Richtig, weil sie den Fachinhalt korrekt wiedergibt.' },
    { text: `Antwort B zu ${hinweis} (Variante ${n})`, ist_korrekt: false, erklaerung: 'Häufige Fehlvorstellung: verwechselt Ursache und Wirkung.' },
    { text: `Antwort C zu ${hinweis} (Variante ${n})`, ist_korrekt: false, erklaerung: 'Teilweise richtig, aber unvollständig.' },
    { text: `Antwort D zu ${hinweis} (Variante ${n})`, ist_korrekt: false, erklaerung: 'Falsch, widerspricht der Fundstelle.' },
  ];
  return {
    typ: 'mc',
    aufgabenstellung: `${params.themaName}: ${hinweis.charAt(0).toUpperCase() + hinweis.slice(1)}? `
      + `(Frage ${n}, Schwierigkeit ${params.schwierigkeit})`,
    optionen,
    quellenstufe: stufe,
    tabellenbuch_fundstelle: fundstelle,
    normbezuege: enthaeltZahl ? ['DIN EN ISO 2768-1'] : [],
    enthaelt_zahlenwert: enthaeltZahl,
  };
}

async function llmFragen(params: {
  themaName: string;
  anzahl: number;
  typ: 'mc' | 'freitext';
  schwierigkeit: number;
  zielpool: 'kern' | 'erweiterung';
}): Promise<{ fragen: GenFrage[]; inputTokens: number; outputTokens: number; requestId: string }> {
  const system = `Du erzeugst Prüfungsaufgaben für die schriftliche IHK-Prüfung (Beruf: Maschinen- und Anlagenführer, Metall-/Kunststofftechnik).
STRIKTE REGELN:
- Erzeuge AUSSCHLIESSLICH eigenständig formulierte Aufgaben. Reproduziere KEINE Original-Prüfungsaufgaben von Kammern oder Prüfungsverlagen, auch nicht paraphrasiert.
- Alle Aufgaben und Optionen auf Deutsch.
- MC: genau VIER Optionen, davon GENAU EINE korrekt. Distraktoren müssen plausible Fehlvorstellungen abbilden. Zu jeder Option eine kurze Erklärung.
- Freitext: mit Musterlösung und Bewertungsraster (Kriterien mit Punkten).
- Verpflichtende Felder je Frage: quellenstufe (1-4), tabellenbuch_fundstelle {verlag,auflage,seite,tabelle}, normbezuege (Array), enthaelt_zahlenwert (bool).
- Wenn eine Frage einen Zahlenwert/Formel/Grenzwert/Normbezug enthält, MUSS eine belastbare Fundstelle (Stufe 1-3) angegeben sein. Erfinde niemals eine Seitenzahl; im Zweifel enthaelt_zahlenwert=false und keine Zahl verwenden.
Antworte NUR mit JSON: {"fragen":[{"typ":"mc","aufgabenstellung":"…","optionen":[{"text":"…","ist_korrekt":true,"erklaerung":"…"}],"quellenstufe":1,"tabellenbuch_fundstelle":{"verlag":"…","auflage":"…","seite":123,"tabelle":"…"},"normbezuege":["…"],"enthaelt_zahlenwert":false}]}`;

  const user = JSON.stringify({
    thema: params.themaName,
    anzahl: params.anzahl,
    typ: params.typ,
    schwierigkeit: params.schwierigkeit,
    zielpool: params.zielpool,
  });

  const res = await fetch(`${LLM_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${LLM_API_KEY}` },
    body: JSON.stringify({
      model: LLM_MODELL,
      temperature: 0.7,
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
  const parsed = JSON.parse(content);
  const fragen: GenFrage[] = Array.isArray(parsed?.fragen) ? parsed.fragen : [];
  return {
    fragen,
    inputTokens: data.usage?.prompt_tokens ?? 0,
    outputTokens: data.usage?.completion_tokens ?? 0,
    requestId,
  };
}

// Prüft die Quellenhierarchie hart. Rückgabe: null = zulässig, sonst Ablehngrund.
function quellenhierarchieVerstoss(f: GenFrage): string | null {
  const hatFundstelle =
    !!f.tabellenbuch_fundstelle &&
    f.tabellenbuch_fundstelle.seite != null &&
    String(f.tabellenbuch_fundstelle.seite).trim() !== '';
  if (f.enthaelt_zahlenwert && (f.quellenstufe >= 4 || !hatFundstelle)) {
    return 'zahlenwert_ohne_fundstelle';
  }
  return null;
}

function mcGueltig(f: GenFrage): boolean {
  if (f.typ !== 'mc') return true;
  const opts = f.optionen ?? [];
  return opts.length === 4 && opts.filter((o) => o.ist_korrekt).length === 1;
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

  let body: {
    thema_id?: string;
    anzahl?: number;
    typ?: string;
    schwierigkeit?: number;
    zielpool?: string;
    quelldokument_id?: string;
  };
  try {
    body = await anfrage.json();
  } catch {
    return jsonAntwort({ fehler: 'ungueltige_anfrage' }, 400);
  }

  const themaId = String(body.thema_id ?? '');
  const anzahl = Math.min(MAX_BATCH, Math.max(1, Math.floor(Number(body.anzahl ?? 0))));
  const typ = body.typ === 'freitext' ? 'freitext' : 'mc';
  const schwierigkeit = [1, 2, 3].includes(Number(body.schwierigkeit)) ? Number(body.schwierigkeit) : 2;
  const zielpool = body.zielpool === 'kern' ? 'kern' : 'erweiterung';
  const quelldokumentId = body.quelldokument_id ? String(body.quelldokument_id) : null;

  if (!themaId || !anzahl) return jsonAntwort({ fehler: 'ungueltige_anfrage' }, 400);

  // Thema laden und Trägerzugehörigkeit über RLS des Aufrufers absichern.
  const { data: thema } = await anonClient
    .from('themen')
    .select('id, bezeichnung')
    .eq('id', themaId)
    .maybeSingle();
  if (!thema) return jsonAntwort({ fehler: 'thema_unbekannt' }, 404);

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
      funktion: 'generiere_fragen',
      modell: LLM_MODELL,
      erfolg: false,
      fehlertext: 'budget_ueberschritten',
      kosten_eur: 0,
    });
    return jsonAntwort({ fehler: 'budget_ueberschritten', bisher, budget }, 429);
  }

  // Bestehende Fragen desselben Themas für die n-Gramm-Ähnlichkeit (Proxy für
  // Quelltext, da Trägerskripte hier nicht als Volltext vorliegen — siehe README).
  const { data: bestand } = await service
    .from('fragen')
    .select('aufgabenstellung')
    .eq('thema_id', themaId)
    .limit(500);
  const referenzTexte: string[] = (bestand ?? []).map((b) => b.aufgabenstellung);

  const start = Date.now();
  let kandidaten: GenFrage[] = [];
  let inputTokens = 0;
  let outputTokens = 0;
  let requestId = crypto.randomUUID();
  let modell = LLM_MODELL;

  try {
    if (LLM_MOCK || !LLM_API_KEY) {
      kandidaten = Array.from({ length: anzahl }, (_, i) =>
        mockFrage(i + 1, { themaName: thema.bezeichnung, typ, schwierigkeit, zielpool }),
      );
      modell = 'mock-generator';
    } else {
      const llm = await llmFragen({ themaName: thema.bezeichnung, anzahl, typ, schwierigkeit, zielpool });
      kandidaten = llm.fragen;
      inputTokens = llm.inputTokens;
      outputTokens = llm.outputTokens;
      requestId = llm.requestId;
    }
  } catch (e) {
    const fehlertext = e instanceof Error ? e.message : 'unbekannter_fehler';
    await service.from('ki_aufrufe').insert({
      traeger_id: profil.traeger_id,
      user_id: aufrufer.id,
      funktion: 'generiere_fragen',
      modell: LLM_MODELL,
      latenz_ms: Date.now() - start,
      erfolg: false,
      fehlertext,
      request_id: requestId,
    });
    return jsonAntwort({ fehler: 'generierung_fehlgeschlagen', detail: fehlertext }, 502);
  }

  const abgelehnt: Array<{ aufgabenstellung: string; grund: string }> = [];
  const dubletten: Array<{ aufgabenstellung: string; aehnlichkeit: number }> = [];
  const erstellteIds: string[] = [];
  const reviewGeflaggt: string[] = [];

  for (const f of kandidaten) {
    if (!f?.aufgabenstellung || !f?.typ) continue;
    f.typ = f.typ === 'freitext' ? 'freitext' : 'mc';
    f.normbezuege = Array.isArray(f.normbezuege) ? f.normbezuege.map(String) : [];

    // Quellenhierarchie hart durchsetzen (Spec §5) — vor jeder Speicherung.
    const verstoss = quellenhierarchieVerstoss(f);
    if (verstoss) {
      abgelehnt.push({ aufgabenstellung: f.aufgabenstellung, grund: verstoss });
      continue;
    }
    if (!mcGueltig(f)) {
      abgelehnt.push({ aufgabenstellung: f.aufgabenstellung, grund: 'mc_struktur_ungueltig' });
      continue;
    }

    // Embedding erzeugen (Mock: hash-basiert, sonst API).
    let vektor: number[];
    try {
      if (LLM_MOCK || !LLM_API_KEY) {
        vektor = fakeEmbedding(f.aufgabenstellung);
      } else {
        const emb = await echtesEmbedding(f.aufgabenstellung);
        vektor = emb.vektor.length === EMBED_DIM ? emb.vektor : fakeEmbedding(f.aufgabenstellung);
        inputTokens += emb.inputTokens;
      }
    } catch {
      vektor = fakeEmbedding(f.aufgabenstellung);
    }

    // 1. Dublettencheck (Embedding-Kosinus > 0,92 → verwerfen; Spec §5).
    const { data: aehnliche } = await service.rpc('frage_dubletten', {
      p_thema_id: themaId,
      p_embedding: vektorLiteral(vektor),
      p_schwelle: DUBLETTE_SCHWELLE,
      p_limit: 3,
    });
    if (Array.isArray(aehnliche) && aehnliche.length > 0) {
      dubletten.push({
        aufgabenstellung: f.aufgabenstellung,
        aehnlichkeit: Number(aehnliche[0].aehnlichkeit ?? 0),
      });
      referenzTexte.push(f.aufgabenstellung);
      continue;
    }

    // Frage speichern (Status entwurf, ki_generiert). kern nur für Zielpool kern.
    const { data: neu, error: insErr } = await service
      .from('fragen')
      .insert({
        thema_id: themaId,
        typ: f.typ,
        aufgabenstellung: f.aufgabenstellung,
        schwierigkeit,
        status: 'entwurf',
        kern: zielpool === 'kern',
        ki_generiert: true,
        quellenstufe: f.quellenstufe ?? null,
        tabellenbuch_fundstelle: f.tabellenbuch_fundstelle ?? null,
        enthaelt_zahlenwert: !!f.enthaelt_zahlenwert,
        normbezuege: f.normbezuege,
        quelldokument_id: quelldokumentId,
        embedding: vektorLiteral(vektor),
        erstellt_von: aufrufer.id,
      })
      .select('id')
      .single();
    if (insErr || !neu) {
      abgelehnt.push({ aufgabenstellung: f.aufgabenstellung, grund: 'speichern_fehlgeschlagen' });
      continue;
    }

    if (f.typ === 'mc' && Array.isArray(f.optionen)) {
      await service.from('antwortoptionen').insert(
        f.optionen.slice(0, 4).map((o, idx) => ({
          frage_id: neu.id,
          text: String(o.text ?? ''),
          ist_korrekt: !!o.ist_korrekt,
          erklaerung: String(o.erklaerung ?? ''),
          reihenfolge: idx,
        })),
      );
    } else if (f.typ === 'freitext') {
      await service.from('freitext_loesungen').insert({
        frage_id: neu.id,
        musterloesung: String(f.musterloesung ?? ''),
        bewertungsraster: f.bewertungsraster ?? { max_punkte: 4, kriterien: [] },
        max_punkte: 4,
      });
    }

    // 2. n-Gramm-Ähnlichkeit gegen den Bestand → review_queue (aehnlichkeit_zu_hoch).
    const maxNgram = referenzTexte.reduce((m, t) => Math.max(m, ngrammAehnlichkeit(f.aufgabenstellung, t)), 0);
    if (maxNgram >= NGRAM_SCHWELLE) {
      await service.from('review_queue').insert({
        frage_id: neu.id,
        grund: 'aehnlichkeit_zu_hoch',
        status: 'offen',
      });
      reviewGeflaggt.push(neu.id);
    }

    erstellteIds.push(neu.id);
    referenzTexte.push(f.aufgabenstellung);
  }

  const kosten = schaetzeKosten(inputTokens, outputTokens);
  await service.from('ki_aufrufe').insert({
    traeger_id: profil.traeger_id,
    user_id: aufrufer.id,
    funktion: 'generiere_fragen',
    modell,
    input_tokens: inputTokens,
    output_tokens: outputTokens,
    kosten_eur: kosten,
    latenz_ms: Date.now() - start,
    erfolg: true,
    request_id: requestId,
  });

  // 3. verifiziere-frage aufrufen (unabhängiger Modellaufruf). Best-effort:
  // ein Fehler hier soll die Generierung nicht rückgängig machen.
  let verifikation: unknown = null;
  if (erstellteIds.length > 0) {
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/verifiziere-frage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_ANON_KEY,
          Authorization: autorisierung,
        },
        body: JSON.stringify({ frage_ids: erstellteIds }),
      });
      verifikation = await res.json().catch(() => null);
    } catch (e) {
      verifikation = { fehler: e instanceof Error ? e.message : 'verifikation_nicht_erreichbar' };
    }
  }

  return jsonAntwort(
    {
      thema: thema.bezeichnung,
      zielpool,
      angefragt: anzahl,
      erstellt: erstellteIds.length,
      erstellte_ids: erstellteIds,
      review_geflaggt: reviewGeflaggt,
      abgelehnt,
      verworfen_dublette: dubletten,
      verifikation,
      budget_warnung_80: bisher + kosten >= budget * 0.8,
    },
    200,
  );
});
