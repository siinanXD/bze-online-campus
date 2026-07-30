# Edge Function `uebersetze-lerneinheit` (AP-14)

Erzeugt Zusatz-Übersetzungen zu Fachkunde-Lerneinheiten in die Zielsprachen und
legt sie in `lerneinheiten_uebersetzungen` ab (Spec §5 `uebersetze_lerneinheit`,
Tabelle aus Migration 0013).

**Nicht verhandelbar (Spec §5 / CONTRIBUTING.md Regel 4):**

- Fachkunde bleibt Deutsch; die Übersetzung ist eine **Zusatz-Lernhilfe** unter dem
  Original, nie ein Ersatz.
- Übersetzungen sind **unfreigegeben bis Ausbilderbestätigung**
  (`freigegeben = false`) und **dauerhaft gecacht**: bereits vorhandene
  Sprach­zeilen werden nicht neu erzeugt.
- Nur **freigegebene** Lerneinheiten werden übersetzt (`nicht_freigegeben` sonst).
- Zahlenwerte, Einheiten, Formeln und Normbezüge bleiben 1:1 erhalten; die
  Lesezeit (`minuten`) je Abschnitt wird aus der Quelle erzwungen.

Zielsprachen sind die i18n-Locales außer Deutsch, aktuell `en, fr, ar, uk, tr`
(`i18n.ts`). Über das Feld `sprachen` einschränkbar.

Die Ausbilderfreigabe erfolgt über die RPC
`lerneinheit_uebersetzung_freigeben(p_lerneinheit_id, p_sprache)` (Migration 0013).

## Anfrage

```
POST /functions/v1/uebersetze-lerneinheit
Authorization: Bearer <JWT eines Ausbilders/Verwaltung/Admin>
Content-Type: application/json

{
  "lerneinheit_ids": ["<uuid>"],
  "sprachen": ["en", "uk"]           // optional, Standard = alle Zielsprachen
}
```

`lerneinheit_id` (Einzeleinheit) wird ebenfalls akzeptiert.

## Antwort (200)

```json
{
  "hinweis": "Uebersetzung ist eine Zusatz-Lernhilfe (Freigabe durch Ausbilder erforderlich).",
  "neu_erzeugt": 2,
  "aus_cache": 0,
  "uebersprungen_nicht_freigegeben": 0,
  "ergebnis": [
    { "lerneinheit_id": "…", "status": "ok", "sprachen": { "en": "erzeugt", "uk": "erzeugt" } }
  ],
  "budget_warnung_80": false
}
```

## Betrieb

- Nur Rollen `ausbilder`, `verwaltung`, `admin` (sonst HTTP 403 `nicht_berechtigt`).
- Schreibt eine Zeile in `ki_aufrufe` (`funktion = 'uebersetze_lerneinheit'`).
- Budgetprüfung gegen `traeger.einstellungen.monatsbudget_eur`; HTTP 429
  (`budget_ueberschritten`), 80-%-Warnung in `budget_warnung_80`.
- `LLM_MOCK=1` (oder fehlender `LLM_API_KEY`): deterministische Pseudo-Übersetzung
  ohne LLM-Aufruf.
- Speicherung: `lerneinheiten_uebersetzungen` (Migration 0013), `abschnitte` als
  JSON-Array `[{ titel, inhalt, minuten }]`.

## Umgebungsvariablen

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
`LLM_API_KEY`, `LLM_MODELL`, `LLM_BASE_URL`, `LLM_MOCK`.

## Lokal testen

```
supabase functions serve uebersetze-lerneinheit --env-file supabase/.env.local
```
