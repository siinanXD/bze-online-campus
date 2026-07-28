/**
 * Abbildung Benutzername → interne E-Mail für Supabase Auth (AP-03).
 *
 * Supabase Auth arbeitet intern mit E-Mail + Passwort. Für die Zielgruppe dieser App
 * (Fahrschul-App-Charakter, „Benutzername + Passwort") ist eine echte E-Mail-Adresse
 * kein sinnvoller Login-Faktor. Gewählte Abbildung: `<normalisierter-benutzername>@campus.bze`
 * — eine interne, niemals angeschriebene Pseudo-Domain. `profiles.benutzername` bleibt die
 * sichtbare, eindeutige Kennung (unique-Constraint aus der AP-01-Migration).
 *
 * Alternative wäre ein serverseitiger Lookup benutzername → E-Mail über eine Edge Function
 * vor jedem Login gewesen. Die feste Pseudo-Domain ist einfacher: kein zusätzlicher
 * Netzwerk-Roundtrip beim Login, kein Sonderfall für „Benutzername existiert nicht".
 *
 * WICHTIG: exakt dieselbe Normalisierung läuft in
 * `supabase/functions/nutzer-anlegen/index.ts`, wenn der Account angelegt wird
 * (Deno kann dieses Modul nicht importieren — beide Stellen müssen synchron bleiben).
 */
export function benutzernameZuEmail(benutzername: string): string {
  const normalisiert = benutzername
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '');
  return `${normalisiert}@campus.bze`;
}
