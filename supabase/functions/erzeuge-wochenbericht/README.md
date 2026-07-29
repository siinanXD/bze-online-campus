# Edge Function `erzeuge-wochenbericht` (AP-13)

Erzeugt den wöchentlichen Lernbericht eines Teilnehmers (Spec §5). Aggregiert
die Lernwoche, ermittelt die **drei schwächsten Themen**, vergleicht mit der
Vorwoche und lässt das LLM in der **Nutzersprache** erzeugen:

- eine **Zusammenfassung**,
- **Verbesserungen**,
- eine **konkrete Empfehlung**,
- **3–5 kurze Merksätze** zu den **tatsächlich falsch beantworteten** Fragen.

Das Ergebnis wird in `wochenberichte` gespeichert (Upsert je
`user_id / jahr / kalenderwoche`). Merksätze entstehen hier — nicht bei App-Start.

**Wichtig:** Der Wochenbericht ist automatisches Lernfeedback, keine
Prüfungsleistung. Jede Antwort enthält `hinweis_lernfeedback: true`; die
Oberfläche (`components/dashboard`) zeigt den Hinweis sichtbar an.

## Betriebsarten

### 1. Cron (sonntags 20:00) — alle aktiven Teilnehmer

```
POST /functions/v1/erzeuge-wochenbericht
x-cron-secret: <CRON_SECRET>
Content-Type: application/json

{ "alle": true }            # optional; Header genügt
```

Läuft ohne Nutzer-JWT über den Service-Role-Key und erzeugt für jeden
`profiles`-Datensatz mit `rolle = 'teilnehmer'` und `aktiv = true` einen Bericht
für die aktuelle ISO-Woche.

### 2. Einzelner Teilnehmer (Auth) — Test / Admin-Trigger

```
POST /functions/v1/erzeuge-wochenbericht
Authorization: Bearer <JWT>
Content-Type: application/json

{ "user_id": "<uuid, optional>", "jahr": 2026, "kalenderwoche": 31 }
```

- **Teilnehmer** dürfen nur sich selbst auslösen (`user_id` weglassen).
- **Ausbilder** dürfen zugewiesene Teilnehmer (`ausbilder_zuweisungen`) auslösen.
- **Admin / Verwaltung** dürfen beliebige Teilnehmer auslösen.

`jahr` / `kalenderwoche` sind optional (Standard: aktuelle ISO-Woche).

## Antwort (200)

```json
{
  "hinweis_lernfeedback": true,
  "modus": "einzel",
  "bericht": {
    "user_id": "…",
    "jahr": 2026,
    "kalenderwoche": 31,
    "merksaetze_anzahl": 4,
    "modell": "mock-heuristik"
  }
}
```

Im Cron-Modus: `{ "modus": "cron", "anzahl": N, "berichte": [...], "fehler": [...] }`.

## Gespeicherte Struktur (`wochenberichte`)

```jsonc
{
  "inhalt": {
    "zusammenfassung": "…",
    "verbesserungen": "…",
    "empfehlung": "…",
    "statistik": {
      "bearbeitet": 42, "richtig": 30, "falsch": 12, "richtig_quote": 71,
      "vorwoche_bearbeitet": 20, "vorwoche_richtig_quote": 60,
      "trend": "besser", "schwaechste_themen": ["…", "…", "…"]
    }
  },
  "merksaetze": [{ "text": "…", "thema": "…" }],
  "gelesen": false
}
```

## Umgebung

| Variable | Bedeutung |
|---|---|
| `LLM_API_KEY` | Schlüssel des LLM-Anbieters (OpenAI-kompatibel) |
| `LLM_MODELL` | Modellname (Default `gpt-4o-mini`) |
| `LLM_BASE_URL` | Optional, Default `https://api.openai.com/v1` |
| `LLM_MOCK=1` | Heuristik ohne LLM (lokal/Demo) |
| `CRON_SECRET` | Geheimnis für den Cron-Massenlauf (Header `x-cron-secret`) |

Ohne `LLM_API_KEY` bzw. mit `LLM_MOCK=1` läuft die Function auf einer
Heuristik (`modell: "mock-heuristik"` in `ki_aufrufe`). Vor jedem echten
LLM-Aufruf wird das Monatsbudget aus `traeger.einstellungen.monatsbudget_eur`
geprüft; bei Überschreitung wird der Aufruf protokolliert und auf die Heuristik
zurückgefallen, damit trotzdem ein Bericht entsteht.

## Budget & Protokollierung

Jeder Lauf schreibt einen Datensatz nach `ki_aufrufe` (Funktion
`erzeuge_wochenbericht`, Tokens, Kosten, Latenz, Request-ID, Erfolg).

## Zeitplan (pg_cron)

Der Sonntag-20:00-Zeitplan ist in `supabase/migrations/0010_wochenbericht.sql`
als kommentiertes `cron.schedule` dokumentiert. In lokalen Supabase-Instanzen
sind `pg_cron`/`pg_net` oft nicht aktiv — dann die Function manuell mit dem
`x-cron-secret`-Header aufrufen. In der Zielumgebung (Supabase eu-central-1)
den Block aktivieren.

## Lokal testen

```bash
supabase functions serve erzeuge-wochenbericht --env-file .env.local
# Einzeln (self):
curl -i -X POST 'http://localhost:54321/functions/v1/erzeuge-wochenbericht' \
  --header "Authorization: Bearer $JWT" \
  --header 'Content-Type: application/json' \
  --data '{}'
# Cron-Massenlauf:
curl -i -X POST 'http://localhost:54321/functions/v1/erzeuge-wochenbericht' \
  --header "x-cron-secret: $CRON_SECRET" \
  --header 'Content-Type: application/json' \
  --data '{"alle":true}'
```

Migration: `supabase/migrations/0010_wochenbericht.sql`
(`wochenbericht_gelesen`-RPC + View `v_wochenbericht_neueste` + Cron-Hinweis).
