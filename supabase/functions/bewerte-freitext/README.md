# Edge Function `bewerte-freitext` (AP-09)

Bewertet Freitext-Antworten anhand Musterlösung und Bewertungsraster (Spec §5).
Schreibt `ki_aufrufe`, aktualisiert `versuche`, pflegt den Bewertungscache,
legt bei Bedarf Einträge in `review_queue` an und schließt die Wochenprüfung ab,
sobald alle Freitext-Punkte gesetzt sind (`pruefung_freitext_abschliessen`).

**Wichtig:** Die Bewertung ist Lernfeedback, keine Prüfungsleistung. Jede Antwort
enthält `hinweis_lernfeedback: true`.

Musterlösungen (`freitext_loesungen`) sind für Teilnehmer per RLS gesperrt — die
Function liest sie mit dem Service-Role-Key.

## Anfrage

```
POST /functions/v1/bewerte-freitext
Authorization: Bearer <JWT des Teilnehmers oder betreuenden Ausbilders>
Content-Type: application/json

{ "versuch_id": "<uuid>" }
```

## Antwort (200)

```json
{
  "hinweis_lernfeedback": true,
  "aus_cache": false,
  "bewertung": {
    "kriterien_bewertung": [{ "id": "k1", "erfuellt": true, "punkte": 1, "begruendung": "…" }],
    "erzielte_punkte": 3,
    "max_punkte": 4,
    "staerken": "…",
    "luecken": "…",
    "verbesserungshinweis": "…",
    "deutsche_musterformulierung": "…",
    "confidence": 0.85
  },
  "erzielte_punkte": 3,
  "ist_korrekt": true,
  "review_grund": null,
  "pruefung_abschluss": { "fertig": true, "gesamt": 72.5, "note": 3, "bestanden": true },
  "budget_warnung_80": false
}
```

Review-Queue bei Confidence &lt; 0,7, Punktzahl an der Bestehensgrenze (±5 %)
oder 5 %-Stichprobe.

## Umgebung

| Variable | Bedeutung |
|---|---|
| `LLM_API_KEY` | Schlüssel des LLM-Anbieters (OpenAI-kompatibel) |
| `LLM_MODELL` | Modellname |
| `LLM_BASE_URL` | Optional, Default `https://api.openai.com/v1` |
| `LLM_MOCK=1` | Raster-Heuristik ohne LLM (nur lokal/Demo) |

Ohne `LLM_API_KEY` und ohne `LLM_MOCK=1` fällt die Function ebenfalls auf die
Mock-Heuristik zurück (sichtbar über `modell: "mock-raster"` in `ki_aufrufe`).

Vor jedem echten LLM-Aufruf: Monatsbudget aus `traeger.einstellungen.monatsbudget_eur`.
Bei Überschreitung → `429 budget_ueberschritten`.

## Lokal testen

```bash
supabase functions serve bewerte-freitext --env-file .env.local
curl -i -X POST 'http://localhost:54321/functions/v1/bewerte-freitext' \
  --header "Authorization: Bearer $JWT" \
  --header 'Content-Type: application/json' \
  --data '{"versuch_id":"<uuid>"}'
```

Migration: `supabase/migrations/0005_freitext_bewertung.sql` (Cache-Tabelle +
`pruefung_freitext_abschliessen`).
