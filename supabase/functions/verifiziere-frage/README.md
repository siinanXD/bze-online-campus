# Edge Function `verifiziere-frage` (AP-12)

Separater, **unabhängiger** Modellaufruf ohne Kenntnis der
Generierungsbegründung (Spec §5 `verifiziere_frage`). Prüft je Frage:

- Ist die als korrekt markierte Antwort tatsächlich korrekt?
- Ist ein Distraktor ebenfalls vertretbar/mehrdeutig?
- Deckt sich ein Zahlenwert mit der angegebenen Fundstelle?
- Ist die Aufgabe eindeutig?

Ausgabe je Frage: `{ "bestaetigt": bool, "einwaende": string[], "confidence": number }`.

Nur für **Ausbilder / Verwaltung / Admin** (JWT-Rolle).

## Anfrage

```
POST /functions/v1/verifiziere-frage
Authorization: Bearer <JWT eines Ausbilders/Admins>
Content-Type: application/json

{ "frage_ids": ["…uuid…"] }   // oder { "frage_id": "…uuid…" }
```

## Freigabelogik (Spec §5)

- **bestätigt & Confidence ≥ 0,7** → Status `verifiziert`.
  - **Kernfragen** bleiben `verifiziert` (immer manuelle Ausbilderfreigabe).
  - **Erweiterungspool**: `verifiziert` → automatisch `freigegeben`, mit **10 %
    Zufallsstichprobe** zusätzlich in die `review_queue` (Grund `stichprobe`).
- **sonst** → Status bleibt `entwurf`, `review_queue` Grund
  `verifikation_fehlgeschlagen`.

Das Ergebnis wird in `fragen.verifikation` (JSON) protokolliert.

## Antwort (200)

```json
{
  "geprueft": 3,
  "ergebnisse": [
    { "frage_id": "…", "status": "freigegeben",
      "verifikation": { "bestaetigt": true, "einwaende": [], "confidence": 0.85 } }
  ],
  "budget_warnung_80": false
}
```

## Betrieb & Mock

- Schreibt eine Zeile in `ki_aufrufe` (`funktion = 'verifiziere_frage'`),
  Budgetprüfung wie `generiere-fragen`.
- **`LLM_MOCK=1`** (oder fehlender `LLM_API_KEY`): deterministische, regelbasierte
  Verifikation ohne API-Aufruf — prüft die hart entscheidbaren strukturellen
  Kriterien (genau vier MC-Optionen, genau eine korrekt, Musterlösung vorhanden,
  Zahlenwert nur mit belastbarer Fundstelle). Ein Sprachmodell prüft im
  Produktivbetrieb zusätzlich die fachliche Korrektheit.

## Umgebungsvariablen

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
`LLM_API_KEY`, `LLM_MODELL`, `LLM_BASE_URL`, `LLM_MOCK`.

## Lokal testen

```
supabase functions serve verifiziere-frage --env-file supabase/.env.local
```
