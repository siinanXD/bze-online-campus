# Edge Function `formuliere-nachweis` (AP-18)

Formuliert aus Stichworten oder einem Diktattranskript des Teilnehmers einen
sauberen Berichtstext für den Ausbildungsnachweis und schlägt passende Positionen
des Ausbildungsrahmenplans vor (Spec §5 `formuliere_nachweis`).

**Nicht verhandelbar (Spec Grundregel 14 / CONTRIBUTING.md):** Das Modell formuliert
**ausschließlich aus den Eingaben des Teilnehmers** und ergänzt oder erfindet
nichts. Leere Felder bleiben leer. Rahmenplan-Vorschläge werden serverseitig hart
auf den übergebenen Katalog begrenzt. Die Oberfläche zeigt den Hinweis
**„KI-Formulierungshilfe — Inhalte stammen von dir."**

Berichtstexte sind immer Deutsch (Prüfungsinhalt, Spec Grundregel 4), unabhängig
von der Nutzersprache.

## Anfrage

```
POST /functions/v1/formuliere-nachweis
Authorization: Bearer <JWT des Teilnehmers>
Content-Type: application/json

{
  "art": "woche",
  "zeitraum_von": "2026-01-05",
  "zeitraum_bis": "2026-01-11",
  "taetigkeiten": "drehen geübt, werkstück vermessen",
  "unterweisungen": "arbeitssicherheit an der maschine",
  "berufsschulthemen": "werkstoffkunde stähle",
  "rahmenplan_katalog": ["Fertigungstechniken", "Prüfverfahren und Prüfmittel"]
}
```

Mindestens eines der drei Textfelder muss gefüllt sein (`leere_eingabe` sonst).

## Antwort (200)

```json
{
  "hinweis_ki_formulierungshilfe": "KI-Formulierungshilfe — Inhalte stammen von dir.",
  "ki_formuliert": true,
  "formulierung": {
    "taetigkeiten": "Ich habe das Drehen geübt und das Werkstück vermessen.",
    "unterweisungen": "Arbeitssicherheit an der Maschine.",
    "berufsschulthemen": "Werkstoffkunde: Stähle.",
    "rahmenplan_positionen": ["Fertigungstechniken"]
  },
  "budget_warnung_80": false
}
```

## Betrieb

- Schreibt nach jedem Aufruf eine Zeile in `ki_aufrufe` (Tokens, Kosten, Latenz,
  `request_id`, `funktion = 'formuliere_nachweis'`).
- Budgetprüfung gegen `traeger.einstellungen.monatsbudget_eur` vor dem LLM-Aufruf;
  Abbruch mit HTTP 429 (`budget_ueberschritten`), 80-%-Warnung im Feld
  `budget_warnung_80`.
- `LLM_MOCK=1` (oder fehlender `LLM_API_KEY`): deterministische Formulierung ohne
  LLM-Aufruf – reine Umformung der Eingabe in ganze Sätze, keine inhaltliche
  Ergänzung. Nützlich für lokale Entwicklung und Tests.

## Umgebungsvariablen

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
`LLM_API_KEY`, `LLM_MODELL`, `LLM_BASE_URL`, `LLM_MOCK`.

## Lokal testen

```
supabase functions serve formuliere-nachweis --env-file supabase/.env.local
```
