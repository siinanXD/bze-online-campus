# `admin-passwort-ruecksetzen` (AP-07 Administration)

Deno Edge Function. Setzt für einen bestehenden Nutzer ein neues, zufällig
erzeugtes Temporärpasswort und erzwingt den Passwortwechsel beim nächsten
Login (`muss_passwort_aendern = true`). Siehe `docs/SPEC.md` §5.

## Warum diese Function und nicht ein direktes DB-Update

Passwörter liegen in `auth.users` und sind nur über die Supabase Auth Admin
API (`auth.admin.updateUserById`) änderbar, die den Service-Role-Key
voraussetzt. Der Service-Role-Key darf laut CONTRIBUTING.md §2 niemals im Client
oder im normalen App-Code stehen — deshalb ausschließlich hier, serverseitig,
mit eigener Rollenprüfung.

## Verhalten

1. Erwartet `POST { user_id: string (uuid) }` mit `Authorization: Bearer <Access-Token>`
   des aufrufenden Admin- oder Verwaltungs-Nutzers.
2. Bestätigt Identität und Rolle des Aufrufers über einen Client **im
   Nutzerkontext** (Anon-Key + Bearer-Token) gegen die normale,
   RLS-geschützte `profiles`-Zeile. Nur `admin` und `verwaltung` dürfen
   fortfahren; `verwaltung` zusätzlich nur innerhalb des eigenen Trägers.
3. Wechselt danach auf einen Service-Role-Client, um:
   - ein neues Zufallspasswort zu erzeugen (12 Zeichen, ohne verwechselbare
     Zeichen wie `0/O`, `1/l/I`),
   - es über `auth.admin.updateUserById` zu setzen,
   - `profiles.muss_passwort_aendern = true` zu setzen,
   - einen Eintrag in `audit_log` zu schreiben (`aktion = 'passwort_zurueckgesetzt'`).
4. Antwortet **einmalig** mit `{ benutzername, initialPasswort }`. Das
   Passwort wird nirgends persistiert — weder in dieser Function noch in der
   aufrufenden App (`app/[locale]/admin/nutzer`); es kann danach nicht mehr
   eingesehen werden. Ein erneuter Reset ist der einzige Weg, ein neues
   Passwort zu vergeben.

## Fehlerantworten

| Status | `fehler` | Bedeutung |
|---|---|---|
| 400 | `ungueltige_eingabe` | Body entspricht nicht dem Zod-Schema |
| 401 | `nicht_angemeldet` | Kein/ungültiger Access-Token |
| 403 | `rolle_nicht_erlaubt` | Aufrufer ist weder `admin` noch `verwaltung` |
| 403 | `anderer_traeger` | `verwaltung` versucht, trägerfremden Nutzer zurückzusetzen |
| 404 | `nutzer_nicht_gefunden` | `user_id` existiert nicht in `profiles` |
| 405 | `methode_nicht_erlaubt` | andere Methode als `POST`/`OPTIONS` |
| 500 | `konfiguration_fehlt` / `passwort_setzen_fehlgeschlagen` / `profil_aktualisierung_fehlgeschlagen` | interner Fehler |

## Lokal testen

```bash
supabase functions serve admin-passwort-ruecksetzen --env-file .env.local
curl -X POST http://localhost:54321/functions/v1/admin-passwort-ruecksetzen \
  -H "Authorization: Bearer <access_token_eines_admin>" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"user_id":"<ziel-uuid>"}'
```

## Verwandte Function (nicht Teil dieses Pakets)

`nutzer-anlegen` (`/functions/v1/nutzer-anlegen`) legt neue Nutzer an und
liegt in der Dateihoheit von AP-03. `app/[locale]/admin/nutzer` ruft sie auf
und **nimmt** folgendes Vertrag als gegeben an (siehe Annahmen im
Abschlussbericht dieses Pakets):

- Eingabe: `POST { benutzername, vorname, nachname, rolle, kohorte_id? }`
- Antwort 200: `{ id, benutzername, initialPasswort }`
- Schreibt selbst einen `audit_log`-Eintrag (`aktion = 'nutzer_angelegt'` o. ä.)

Weicht die tatsächliche AP-03-Implementierung davon ab, muss nur
`app/[locale]/admin/nutzer/actions.ts` (`erstelleNutzerAction`) angepasst
werden — die Dateihoheit dieses Pakets bleibt unberührt.
