// @ts-nocheck — Deno-Laufzeit (Supabase Edge Function), kein Teil des
// Next.js/Node-TS-Projekts am Repo-Root: `Deno`-Globals und https-Imports
// sind für den Root-`tsc` (siehe tsconfig.json, dessen `include` alle
// `**/*.ts` erfasst) nicht auflösbar. `supabase functions serve/deploy`
// verwendet Denos eigenen, hiervon unabhängigen Type-Checker.
//
// Deno Edge Function — supabase/functions/admin-passwort-ruecksetzen
//
// Setzt EIN NEUES Temporärpasswort für einen bestehenden Nutzer und erzwingt
// den Passwortwechsel beim nächsten Login. Läuft ausschließlich mit dem
// Service-Role-Key (siehe CONTRIBUTING.md §2 „Keine Secrets im Client“) und kann
// ein bestehendes Passwort weder einsehen noch direkt setzen — es wird immer
// neu erzeugt (Spec §5 „nutzer_anlegen / admin_passwort_ruecksetzen“).
//
// Aufruf: POST { user_id: string (uuid) }
// Header: Authorization: Bearer <Access-Token des aufrufenden Admin/Verwaltung>
//         apikey: <NEXT_PUBLIC_SUPABASE_ANON_KEY>
// Antwort 200: { benutzername: string, initialPasswort: string }
//
// Das Initialpasswort wird NIE gespeichert — es steht nur in dieser einen
// Antwort und muss vom Admin sofort und einmalig weitergegeben werden.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { z } from 'https://esm.sh/zod@3.23.8';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const eingabeSchema = z.object({
  user_id: z.string().uuid(),
});

// Kein 0/O/1/I/l — vermeidet Verwechslungen beim handschriftlichen Übertragen
// auf der druckbaren Kohortenliste (Spec §6.4 Nr. 25).
const SICHERE_ZEICHEN = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';

function erzeugeTemporaerpasswort(laenge = 12): string {
  const werte = new Uint32Array(laenge);
  crypto.getRandomValues(werte);
  let passwort = '';
  for (let i = 0; i < laenge; i++) {
    passwort += SICHERE_ZEICHEN[werte[i] % SICHERE_ZEICHEN.length];
  }
  // Ein Trennzeichen in der Mitte erleichtert das Vorlesen/Abtippen, ohne die Entropie zu senken.
  return `${passwort.slice(0, 6)}-${passwort.slice(6)}`;
}

function jsonAntwort(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'content-type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }
  if (req.method !== 'POST') {
    return jsonAntwort(405, { fehler: 'methode_nicht_erlaubt' });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return jsonAntwort(500, { fehler: 'konfiguration_fehlt' });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return jsonAntwort(401, { fehler: 'nicht_angemeldet' });
  }

  let eingabe: z.infer<typeof eingabeSchema>;
  try {
    const rohkoerper = await req.json();
    eingabe = eingabeSchema.parse(rohkoerper);
  } catch {
    return jsonAntwort(400, { fehler: 'ungueltige_eingabe' });
  }

  // Client im Kontext des aufrufenden Nutzers — nur um Identität und Rolle
  // über die normale RLS-geschützte `profiles`-Zeile zu bestätigen.
  const alsAnrufer = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false },
  });

  const {
    data: { user: anrufer },
    error: anrufFehler,
  } = await alsAnrufer.auth.getUser();
  if (anrufFehler || !anrufer) {
    return jsonAntwort(401, { fehler: 'nicht_angemeldet' });
  }

  const { data: anruferProfil, error: anruferProfilFehler } = await alsAnrufer
    .from('profiles')
    .select('id, rolle, traeger_id, benutzername')
    .eq('id', anrufer.id)
    .maybeSingle();
  if (anruferProfilFehler || !anruferProfil) {
    return jsonAntwort(403, { fehler: 'kein_profil' });
  }
  if (anruferProfil.rolle !== 'admin' && anruferProfil.rolle !== 'verwaltung') {
    return jsonAntwort(403, { fehler: 'rolle_nicht_erlaubt' });
  }

  // Ab hier Service-Role: erzeugt das neue Passwort, kann ein bestehendes
  // aber weder lesen noch direkt setzen — es existiert kein Lese-Pfad dafür.
  const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

  const { data: zielProfil, error: zielFehler } = await admin
    .from('profiles')
    .select('id, benutzername, traeger_id, aktiv')
    .eq('id', eingabe.user_id)
    .maybeSingle();
  if (zielFehler || !zielProfil) {
    return jsonAntwort(404, { fehler: 'nutzer_nicht_gefunden' });
  }

  // Verwaltung darf nur innerhalb des eigenen Trägers zurücksetzen (Spec §3 RLS-Grundmuster).
  if (anruferProfil.rolle === 'verwaltung' && zielProfil.traeger_id !== anruferProfil.traeger_id) {
    return jsonAntwort(403, { fehler: 'anderer_traeger' });
  }

  const initialPasswort = erzeugeTemporaerpasswort();

  const { error: authFehler } = await admin.auth.admin.updateUserById(zielProfil.id, {
    password: initialPasswort,
  });
  if (authFehler) {
    return jsonAntwort(500, { fehler: 'passwort_setzen_fehlgeschlagen' });
  }

  const { error: updateFehler } = await admin
    .from('profiles')
    .update({ muss_passwort_aendern: true })
    .eq('id', zielProfil.id);
  if (updateFehler) {
    return jsonAntwort(500, { fehler: 'profil_aktualisierung_fehlgeschlagen' });
  }

  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('cf-connecting-ip') ?? null;
  const { error: auditFehler } = await admin.from('audit_log').insert({
    akteur_id: anruferProfil.id,
    aktion: 'passwort_zurueckgesetzt',
    ziel_typ: 'profile',
    ziel_id: zielProfil.id,
    details: { benutzername: zielProfil.benutzername },
    ip,
  });
  if (auditFehler) {
    // Das Passwort ist bereits gesetzt — ein fehlgeschlagenes Audit-Log darf das
    // nicht rückgängig machen, wird aber für das Betriebsteam sichtbar geloggt.
    console.error('audit_log-Eintrag fehlgeschlagen', auditFehler.message);
  }

  return jsonAntwort(200, {
    benutzername: zielProfil.benutzername,
    initialPasswort,
  });
});
