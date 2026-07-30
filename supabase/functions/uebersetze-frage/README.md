# Edge Function `uebersetze-frage` (AP-14)

Erzeugt Zusatz-Übersetzungen zu Prüfungsfragen in die Zielsprachen und legt sie in
`fragen_uebersetzungen` ab (Spec §5 `uebersetze_frage`).

**Nicht verhandelbar (Spec §5 / CONTRIBUTING.md Regel 4):**

- **Nur der Kernpool wird übersetzt** (`fragen.kern = true`). Nicht-Kernfragen
  werden übersprungen (`kein_kernpool`).
- Übersetzungen sind **unfreigegeben bis Ausbilderbestätigung**
  (`freigegeben = false`) und **dauerhaft gecacht**: bereits vorhandene
  Sprach­zeilen werden nicht neu erzeugt.
- Prüfungsinhalte bleiben Deutsch; die Übersetzung ist eine **Zusatz-Lernhilfe**
  unter dem Original. Zahlenwerte, Einheiten, Formeln und Normbezüge werden
  unverändert übernommen.

Zielsprachen sind die i18n-Locales außer der Quellsprache Deutsch, aktuell
`en, fr, ar, uk, tr` (`i18n.ts`). Über das Feld `sprachen` lässt sich die Auswahl
einschränken.

Die Ausbilderfreigabe erfolgt anschließend über die RPC
`frage_uebersetzung_freigeben(p_frage_id, p_sprache)` (Migration 0013).

## Anfrage

```
POST /functions/v1/uebersetze-frage
Authorization: Bearer <JWT eines Ausbilders/Verwaltung/Admin>
Content-Type: application/json

{
  "frage_ids": ["<uuid>", "<uuid>"],
  "sprachen": ["en", "ar"]          // optional, Standard = alle Zielsprachen
}
```

`frage_id` (Einzelfrage) wird ebenfalls akzeptiert.

## Antwort (200)

```json
{
  "hinweis": "Uebersetzung ist eine Zusatz-Lernhilfe (Freigabe durch Ausbilder erforderlich).",
  "neu_erzeugt": 4,
  "aus_cache": 1,
  "uebersprungen_kein_kernpool": 1,
  "ergebnis": [
    { "frage_id": "…", "status": "ok", "sprachen": { "en": "erzeugt", "ar": "cache" } },
    { "frage_id": "…", "status": "kein_kernpool" }
  ],
  "budget_warnung_80": false
}
```

## Betrieb

- Nur Rollen `ausbilder`, `verwaltung`, `admin` (sonst HTTP 403 `nicht_berechtigt`).
- Schreibt eine Zeile in `ki_aufrufe` (Tokens, Kosten, Latenz, `request_id`,
  `funktion = 'uebersetze_frage'`).
- Budgetprüfung gegen `traeger.einstellungen.monatsbudget_eur` vor der Erzeugung;
  Abbruch mit HTTP 429 (`budget_ueberschritten`), 80-%-Warnung in
  `budget_warnung_80`.
- `LLM_MOCK=1` (oder fehlender `LLM_API_KEY`): deterministische Pseudo-Übersetzung
  (`[<sprache>] …`) ohne LLM-Aufruf – für lokale Entwicklung und Tests.
- Speicherung: `fragen_uebersetzungen` (Migration 0001), `optionen` als JSON-Array
  `[{ id, text }]`, hart auf die Bestands-Optionen der Frage begrenzt.

## Umgebungsvariablen

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
`LLM_API_KEY`, `LLM_MODELL`, `LLM_BASE_URL`, `LLM_MOCK`.

## Lokal testen

```
supabase functions serve uebersetze-frage --env-file supabase/.env.local
```
