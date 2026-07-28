# Edge Function `nutzer-anlegen` (AP-03)

Legt einen neuen Nutzer an: Supabase-Auth-User + `profiles`-Zeile, `muss_passwort_aendern = true`,
Protokolleintrag in `audit_log`. Läuft ausschließlich mit dem Service-Role-Key. Aufrufbar nur für
Rolle `admin` (trägerübergreifend) oder `verwaltung` (nur eigener Träger) — geprüft über das JWT
des Aufrufers, nicht über clientseitige Angaben.

## Benutzername statt E-Mail

Die App zeigt Nutzern „Benutzername + Passwort", Supabase Auth intern arbeitet aber mit E-Mail.
Gewählte Abbildung: `<normalisierter-benutzername>@campus.bze` (interne, nie versendete
Pseudo-Domain). Normalisierung: `trim → lowercase → nur [a-z0-9._-]`. Dieselbe Funktion ist in
`app/[locale]/(auth)/lib/benutzername.ts` (Next.js/Node) und in `index.ts` dieser Function
(Deno) dupliziert, weil beide Laufzeiten keinen gemeinsamen Code-Ort in der AP-03-Dateihoheit
haben — beide Stellen müssen bei Änderungen synchron gehalten werden.

## Anfrage

```
POST /functions/v1/nutzer-anlegen
Authorization: Bearer <JWT des anfragenden admin/verwaltung-Nutzers>
Content-Type: application/json

{
  "benutzername": "m.mueller",
  "vorname": "Max",
  "nachname": "Müller",
  "rolle": "teilnehmer",
  "traeger_id": "<uuid>",
  "sprache": "de"
}
```

## Antwort (201)

```json
{ "user_id": "<uuid>", "benutzername": "m.mueller", "initialpasswort": "…" }
```

Das Initialpasswort wird nur in dieser einen Antwort ausgegeben, nie gespeichert im Klartext
und nie erneut abrufbar (Spec §5: „Admin kann ein neues Temporärpasswort erzeugen, aber kein
bestehendes einsehen oder direkt setzen"). Für das Zurücksetzen eines bestehenden Passworts ist
die separate Function `admin_passwort_ruecksetzen` vorgesehen (noch nicht implementiert, AP-07).

## Fehlerfälle

| Status | `fehler` | Bedeutung |
|---|---|---|
| 401 | `nicht_angemeldet` | Kein/ungültiges JWT im `Authorization`-Header |
| 403 | `keine_berechtigung` | Aufrufer ist nicht admin/verwaltung, oder verwaltung versucht trägerfremd anzulegen |
| 400 | `ungueltige_anfrage` | Pflichtfelder fehlen |
| 409 | `benutzername_vergeben` | E-Mail-Abbildung des Benutzernamens existiert bereits |

## Lokal testen

```bash
supabase functions serve nutzer-anlegen --env-file .env.local
curl -i --location --request POST 'http://localhost:54321/functions/v1/nutzer-anlegen' \
  --header "Authorization: Bearer $ADMIN_JWT" \
  --header 'Content-Type: application/json' \
  --data '{"benutzername":"test.teilnehmer","rolle":"teilnehmer","traeger_id":"<uuid>"}'
```

## Offene Punkte

- `admin_passwort_ruecksetzen` (Spec §5) ist eine eigene Function und noch nicht Teil dieses
  Pakets.
- Das Anlegen mehrerer Nutzer in einem Rutsch (druckbare Kohortenliste, Spec §6.4 Screen 25)
  ruft diese Function derzeit einzeln je Nutzer auf; Batch-Import ist AP-07-Sache.
