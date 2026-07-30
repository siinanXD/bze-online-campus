# Edge Function `sende-erinnerungen` (AP-17)

Sendet Web-Push-Erinnerungen an aktive Teilnehmer, damit sie den Lernfokus
halten: fällige Wiederholungen, eine reißende Lernserie, ein fast erreichtes
Tagesziel, offene Wochenprüfungen und Ausbildungsnachweise, Entscheidungen des
Ausbilders und neue Wochenberichte.

## Grundsatz: die Function entscheidet nichts

Ob und was gesendet wird, bestimmt allein die getestete Domain
[`packages/core/benachrichtigung`](../../../packages/core/benachrichtigung).
Diese Function ruft `planeBenachrichtigungen` auf und tut nur, was ausschließlich
serverseitig möglich ist:

1. Kandidaten laden und je Person die Planungseingabe bauen (`kandidaten.ts`)
2. die Domain fragen, was ansteht — inklusive stiller Zeiten, Rangfolge,
   Tagesdeckel und Mindestpausen
3. Titel und Text in der **Sprache der Person** auflösen (`texte.ts`)
4. VAPID-signiert an alle Geräte der Person senden
5. Erfolg in `push_protokoll` festhalten, abgelaufene Endpunkte aufräumen

Weil die Function relativ aus `packages/core` importiert, gibt es die
Fachlogik nur an einer Stelle. `supabase functions deploy` bündelt die
importierten Domain-Dateien mit; sie haben keine externen Abhängigkeiten.

Die Push-**Texte** liegen dagegen als eigene Karte in `texte.ts` (dokumentierte
Duplikation der `push.*`-Zweige aus `messages/*.json`), damit die Function ohne
das Next.js-Projekt deploybar bleibt. Es sind reine Texte, keine Logik.

## Betriebsart: Cron

```
POST /functions/v1/sende-erinnerungen
x-cron-secret: <CRON_SECRET>
```

Läuft ohne Nutzer-JWT über den Service-Role-Key. Es gibt **keinen** Aufruf per
Nutzer-JWT: der Versand geht an fremde Push-Endpunkte und darf nie durch einen
einfachen Nutzeraufruf auslösbar sein. Ein Aufruf ohne gültiges `x-cron-secret`
antwortet mit 401.

## Antwort (200)

```json
{
  "modus": "cron",
  "kandidaten": 42,
  "geplant": 17,
  "gesendet": 15,
  "testlauf": false,
  "fehler": []
}
```

`testlauf: true` bedeutet: kein VAPID-Schlüssel gesetzt (oder `PUSH_MOCK=1`).
Dann läuft die gesamte Planung, aber es wird nichts wirklich gesendet — nützlich,
um die Auswahl lokal zu prüfen, ohne echte Geräte zu erreichen.

## Umgebung

| Variable | Bedeutung |
|---|---|
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Öffentlicher VAPID-Schlüssel (auch im Client) |
| `VAPID_PRIVATE_KEY` | Privater VAPID-Schlüssel — nur hier, nie im Client |
| `VAPID_SUBJECT` | Kontaktangabe (`mailto:` oder `https:`) |
| `CRON_SECRET` | Geheimnis für den Cron-Aufruf (Header `x-cron-secret`) |
| `PUSH_MOCK=1` | Testlauf ohne echten Versand |

Schlüsselpaar erzeugen:

```bash
npx web-push generate-vapid-keys
```

## Zeitplan (pg_cron)

Zwei Läufe täglich (11:00 und 17:00 UTC) sind in
[`0014_push.sql`](../../migrations/0014_push.sql) als kommentiertes
`cron.schedule` dokumentiert. Nicht stündlich: die Domain filtert ohnehin über
stille Zeiten und Mindestpausen, und zwei Läufe decken Mittag und Abend über
alle europäischen Zeitzonen ab. In lokalen Supabase-Instanzen sind
`pg_cron`/`pg_net` oft nicht aktiv — dann die Function manuell mit dem
`x-cron-secret`-Header aufrufen.

## Lokal testen

```bash
supabase functions serve sende-erinnerungen --env-file .env.local
curl -i -X POST 'http://localhost:54321/functions/v1/sende-erinnerungen' \
  --header "x-cron-secret: $CRON_SECRET" \
  --header 'Content-Type: application/json'
```

Migration: [`0014_push.sql`](../../migrations/0014_push.sql)
(Tabellen `push_abos`, `push_einstellungen`, `push_protokoll`, `lern_aktivitaet`).
Client: [`service-worker/push-client.ts`](../../../service-worker/push-client.ts),
Service-Worker-Handler in [`public/sw.js`](../../../public/sw.js).
