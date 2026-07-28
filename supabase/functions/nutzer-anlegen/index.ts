// @ts-nocheck — Deno-Laufzeit (Supabase Edge Function), kein Teil des Next.js-TS-Projekts.
// Der Wurzel-`tsconfig.json` (AP-00-Hoheit, hier nicht änderbar) inkludiert `**/*.ts` ohne
// Deno-Ausnahme; `deno check` bzw. `supabase functions serve` prüft diese Datei korrekt mit
// Deno-Typen (`Deno.*`, `https://esm.sh/...`-Imports). `pnpm typecheck` (tsc, Node-Kontext)
// würde hier sonst grundlos rot laufen.
//
// AP-03 — Edge Function `nutzer_anlegen` (Spec §5, §6.4 Screen 25).
//
// Legt einen neuen Nutzer an: Supabase-Auth-User + zugehörige `profiles`-Zeile,
// `muss_passwort_aendern = true`, Protokolleintrag in `audit_log`. Läuft AUSSCHLIESSLICH
// mit dem Service-Role-Key (Deno-Umgebungsvariable, niemals im Client). Aufrufbar nur für
// Rolle admin oder verwaltung — geprüft über das JWT des Aufrufers, nicht über den Client.
//
// Benutzername → interne E-Mail: siehe app/[locale]/(auth)/lib/benutzername.ts für die
// ausführliche Begründung der Abbildung `<benutzername>@campus.bze`. Deno (Edge Function)
// und die Next.js-App (Node) teilen sich keinen Code-Ort innerhalb der AP-03-Dateihoheit,
// daher ist die Normalisierung hier bewusst dupliziert — beide Stellen müssen synchron
// bleiben, sonst schlägt der Login fehl.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function benutzernameZuEmail(benutzername: string): string {
  const normalisiert = benutzername
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '');
  return `${normalisiert}@campus.bze`;
}

/**
 * Initialpasswort für den ersten Login. Wird nur einmal angezeigt/übergeben und muss
 * beim ersten Login sofort geändert werden (`muss_passwort_aendern = true`). Alphabet
 * ohne 0/O/1/l/I, damit es sich beim Vorlesen/Abtippen (druckbare Kohortenliste, Spec
 * §6.4 Screen 25) nicht verwechseln lässt.
 */
function erzeugeInitialpasswort(): string {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  const zufallsbytes = new Uint8Array(12);
  crypto.getRandomValues(zufallsbytes);
  return Array.from(zufallsbytes, (b) => alphabet[b % alphabet.length]).join('');
}

type AnfrageKoerper = {
  benutzername: string;
  vorname?: string;
  nachname?: string;
  rolle: 'teilnehmer' | 'ausbilder' | 'verwaltung' | 'admin';
  traeger_id: string;
  sprache?: string;
};

function jsonAntwort(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (anfrage: Request) => {
  if (anfrage.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }
  if (anfrage.method !== 'POST') {
    return jsonAntwort({ fehler: 'methode_nicht_erlaubt' }, 405);
  }

  const autorisierung = anfrage.headers.get('Authorization');
  if (!autorisierung) {
    return jsonAntwort({ fehler: 'nicht_angemeldet' }, 401);
  }

  // Aufrufer über sein EIGENES JWT identifizieren (anon key + Authorization-Header),
  // damit RLS für die Rollenprüfung greift. Der Service-Role-Key kommt erst danach zum
  // Einsatz, ausschließlich für die eigentliche Anlage.
  const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: autorisierung } },
  });

  const {
    data: { user: aufrufer },
    error: authFehler,
  } = await anonClient.auth.getUser();

  if (authFehler || !aufrufer) {
    return jsonAntwort({ fehler: 'nicht_angemeldet' }, 401);
  }

  const { data: aufruferProfil } = await anonClient
    .from('profiles')
    .select('rolle, traeger_id')
    .eq('id', aufrufer.id)
    .maybeSingle();

  if (!aufruferProfil || !['admin', 'verwaltung'].includes(aufruferProfil.rolle)) {
    return jsonAntwort({ fehler: 'keine_berechtigung' }, 403);
  }

  let koerper: AnfrageKoerper;
  try {
    koerper = await anfrage.json();
  } catch {
    return jsonAntwort({ fehler: 'ungueltige_anfrage' }, 400);
  }

  if (!koerper?.benutzername || !koerper.rolle || !koerper.traeger_id) {
    return jsonAntwort({ fehler: 'ungueltige_anfrage' }, 400);
  }

  // Verwaltung darf nur im eigenen Träger anlegen, Admin trägerübergreifend.
  if (aufruferProfil.rolle === 'verwaltung' && koerper.traeger_id !== aufruferProfil.traeger_id) {
    return jsonAntwort({ fehler: 'keine_berechtigung' }, 403);
  }

  const serviceClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const email = benutzernameZuEmail(koerper.benutzername);
  const initialpasswort = erzeugeInitialpasswort();

  const { data: neuerAuthUser, error: erstellFehler } = await serviceClient.auth.admin.createUser({
    email,
    password: initialpasswort,
    email_confirm: true, // interne Pseudo-Domain — keine echte Zustellung möglich/nötig
  });

  if (erstellFehler || !neuerAuthUser?.user) {
    return jsonAntwort({ fehler: 'benutzername_vergeben' }, 409);
  }

  const { error: profilFehler } = await serviceClient.from('profiles').insert({
    id: neuerAuthUser.user.id,
    traeger_id: koerper.traeger_id,
    benutzername: koerper.benutzername,
    rolle: koerper.rolle,
    vorname: koerper.vorname ?? null,
    nachname: koerper.nachname ?? null,
    sprache: koerper.sprache ?? 'de',
    muss_passwort_aendern: true,
  });

  if (profilFehler) {
    // Kein Auth-User ohne profiles-Zeile stehen lassen.
    await serviceClient.auth.admin.deleteUser(neuerAuthUser.user.id);
    return jsonAntwort({ fehler: 'benutzername_vergeben' }, 409);
  }

  await serviceClient.from('audit_log').insert({
    akteur_id: aufrufer.id,
    aktion: 'nutzer_angelegt',
    ziel_typ: 'profiles',
    ziel_id: neuerAuthUser.user.id,
    details: { benutzername: koerper.benutzername, rolle: koerper.rolle, traeger_id: koerper.traeger_id },
  });

  return jsonAntwort(
    {
      user_id: neuerAuthUser.user.id,
      benutzername: koerper.benutzername,
      initialpasswort,
    },
    201,
  );
});
