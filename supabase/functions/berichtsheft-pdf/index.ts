// @ts-nocheck — Deno-Laufzeit (Supabase Edge Function), kein Teil des Next.js-TS-Projekts.
//
// AP-18 — Edge Function `berichtsheft-pdf` (Spec §5 `berichtsheft_pdf`).
//
// Erzeugt den Gesamtexport des Ausbildungsnachweises als druckbares Dokument.
// Jedes Blatt trägt Name, Ausbildungsjahr und Berichtszeitraum (Spec §5).
//
// Bewusst OHNE schwere PDF-Bibliothek: Es wird sauber paginiertes, druckfertiges
// HTML mit `@media print` und Seitenumbruch je Blatt zurückgegeben. Der Client
// öffnet es und löst „Als PDF speichern/drucken" aus (Zielgruppe: ältere Geräte,
// kleine Bundles — Spec §0). `Content-Disposition` steuert Anzeige/Download.
//
// Zugriff: Teilnehmer nur eigene Nachweise; Ausbilder/Verwaltung/Admin die der
// betreuten Teilnehmer (RLS-konform über den Nutzer-Client geprüft).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const ART_LABEL: Record<string, string> = {
  tag: 'Tagesbericht',
  woche: 'Wochenbericht',
  monat: 'Monatsbericht',
  fach: 'Fachbericht',
};
const STATUS_LABEL: Record<string, string> = {
  entwurf: 'Entwurf',
  eingereicht: 'Eingereicht',
  signiert_teilnehmer: 'Vom Teilnehmer signiert',
  signiert_ausbilder: 'Vom Ausbilder gegengezeichnet',
  beanstandet: 'Beanstandet',
};

function esc(text: unknown): string {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function absatz(text: unknown): string {
  const roh = String(text ?? '').trim();
  if (!roh) return '<span class="leer">—</span>';
  return esc(roh).replace(/\n/g, '<br>');
}

function datumDe(iso: string | null): string {
  if (!iso) return '—';
  const [j, m, t] = iso.slice(0, 10).split('-');
  return `${t}.${m}.${j}`;
}

function jsonAntwort(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

function blatt(n: any, name: string): string {
  const inhalt = (n.inhalt ?? {}) as Record<string, unknown>;
  const positionen: string[] = Array.isArray(n.rahmenplan_positionen) ? n.rahmenplan_positionen : [];
  return `
  <section class="blatt">
    <header class="kopf">
      <h2>Ausbildungsnachweis · ${esc(ART_LABEL[n.art] ?? n.art)}</h2>
      <table class="meta">
        <tr><th>Name</th><td>${esc(name)}</td><th>Ausbildungsjahr</th><td>${esc(n.ausbildungsjahr ?? '—')}</td></tr>
        <tr><th>Berichtszeitraum</th><td colspan="3">${datumDe(n.zeitraum_von)} – ${datumDe(n.zeitraum_bis)}</td></tr>
        <tr><th>Status</th><td colspan="3">${esc(STATUS_LABEL[n.status] ?? n.status)}${n.ki_formuliert ? ' · mit KI-Formulierungshilfe (Inhalte stammen vom Teilnehmer)' : ''}</td></tr>
      </table>
    </header>
    <div class="feld"><h3>Ausgeführte Tätigkeiten</h3><p>${absatz(inhalt.taetigkeiten)}</p></div>
    <div class="feld"><h3>Unterweisungen / betrieblicher Unterricht</h3><p>${absatz(inhalt.unterweisungen)}</p></div>
    <div class="feld"><h3>Berufsschule (Themen)</h3><p>${absatz(inhalt.berufsschulthemen)}</p></div>
    ${positionen.length ? `<div class="feld"><h3>Rahmenplan-Positionen</h3><ul>${positionen.map((p) => `<li>${esc(p)}</li>`).join('')}</ul></div>` : ''}
    <footer class="unterschriften">
      <div class="sig"><span class="linie"></span><span>Unterschrift Teilnehmer/in</span></div>
      <div class="sig"><span class="linie"></span><span>Unterschrift Ausbilder/in</span></div>
    </footer>
  </section>`;
}

function dokument(nachweise: any[], name: string): string {
  const bloecke = nachweise.map((n) => blatt(n, name)).join('\n');
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ausbildungsnachweis · ${esc(name)}</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color:#111; margin:0; background:#f3f4f6; }
  .blatt { background:#fff; max-width: 800px; margin: 16px auto; padding: 24px 28px; border:1px solid #d1d5db; }
  .kopf h2 { font-size: 18px; margin: 0 0 12px; }
  table.meta { width:100%; border-collapse: collapse; font-size: 13px; margin-bottom: 16px; }
  table.meta th, table.meta td { border:1px solid #d1d5db; padding:6px 8px; text-align:left; vertical-align:top; }
  table.meta th { background:#f9fafb; width: 130px; font-weight:600; }
  .feld { margin: 12px 0; }
  .feld h3 { font-size: 13px; text-transform: uppercase; letter-spacing: .03em; color:#374151; margin:0 0 4px; }
  .feld p { margin:0; font-size: 14px; line-height:1.5; white-space: pre-line; }
  .feld ul { margin: 4px 0 0; padding-inline-start: 20px; font-size: 14px; }
  .leer { color:#9ca3af; }
  .unterschriften { display:flex; gap:40px; margin-top: 32px; }
  .sig { flex:1; font-size: 12px; color:#374151; text-align:center; }
  .sig .linie { display:block; border-top:1px solid #111; margin-bottom: 4px; height: 28px; }
  .hinweis { max-width:800px; margin: 16px auto; font-size:12px; color:#6b7280; text-align:center; }
  @media print {
    body { background:#fff; }
    .blatt { margin:0; border:0; max-width:none; page-break-after: always; }
    .blatt:last-of-type { page-break-after: auto; }
    .hinweis { display:none; }
  }
</style>
</head>
<body>
${bloecke || '<p class="hinweis">Keine Nachweise im Export.</p>'}
<p class="hinweis">Erstellt mit BZE Online Campus · zum Speichern als PDF im Browser „Drucken" wählen.</p>
</body>
</html>`;
}

Deno.serve(async (anfrage: Request) => {
  if (anfrage.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });
  if (anfrage.method !== 'POST') return jsonAntwort({ fehler: 'methode_nicht_erlaubt' }, 405);

  const autorisierung = anfrage.headers.get('Authorization');
  if (!autorisierung) return jsonAntwort({ fehler: 'nicht_angemeldet' }, 401);

  // Nutzer-Client: RLS entscheidet, welche Nachweise sichtbar sind.
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: autorisierung } },
  });

  const {
    data: { user: aufrufer },
    error: authFehler,
  } = await client.auth.getUser();
  if (authFehler || !aufrufer) return jsonAntwort({ fehler: 'nicht_angemeldet' }, 401);

  let body: { user_id?: string; nachweis_id?: string };
  try {
    body = await anfrage.json();
  } catch {
    body = {};
  }

  const zielUser = body.user_id ?? aufrufer.id;

  const { data: profil } = await client
    .from('profiles')
    .select('vorname, nachname, benutzername')
    .eq('id', zielUser)
    .maybeSingle();

  let abfrage = client
    .from('nachweise')
    .select('id, art, zeitraum_von, zeitraum_bis, ausbildungsjahr, inhalt, rahmenplan_positionen, ki_formuliert, status')
    .eq('user_id', zielUser)
    .order('zeitraum_von', { ascending: true });
  if (body.nachweis_id) abfrage = abfrage.eq('id', body.nachweis_id);

  const { data: nachweise, error } = await abfrage;
  if (error) return jsonAntwort({ fehler: 'laden_fehlgeschlagen', detail: error.message }, 400);
  // RLS liefert für unberechtigte Zugriffe eine leere Menge — kein 403 nötig.

  const name = profil
    ? [profil.vorname, profil.nachname].filter(Boolean).join(' ') || profil.benutzername
    : '—';

  const html = dokument(nachweise ?? [], name);
  const dateiname = `ausbildungsnachweis_${(profil?.benutzername ?? 'export').replace(/[^a-z0-9_-]/gi, '')}.html`;

  return new Response(html, {
    status: 200,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': `inline; filename="${dateiname}"`,
    },
  });
});
