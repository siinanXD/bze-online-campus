# CLAUDE.md

Schneller Einstieg für die Arbeit an diesem Repository. Die verbindlichen Regeln
stehen in [`AGENTS.md`](AGENTS.md), die Schichten in
[`docs/ARCHITEKTUR.md`](docs/ARCHITEKTUR.md), die Fachlichkeit in
[`docs/SPEC.md`](docs/SPEC.md). Diese Datei fasst nur zusammen, was man am
häufigsten braucht — bei Widerspruch gilt AGENTS.md.

## Befehle

```bash
pnpm dev               # Entwicklung (http://localhost:3000/de)
pnpm typecheck         # tsc --noEmit
pnpm lint              # next lint
pnpm test              # Unit + Integration (läuft in der CI)
pnpm test:unit         # nur packages/core
pnpm test:e2e          # Playwright; braucht E2E_BASE_URL (laufende App)
pnpm lint:py           # ruff check + format für scripts/
pnpm seed:generate     # Seed aus dem Fragenpool erzeugen
```

## Wo gehört was hin

- **Fachliche Entscheidung** → `packages/core/<domäne>`. Rein, datenbankfrei,
  Zeit als Parameter. Mit Unit-Test.
- **Daten lesen** → `app/**/_lib/*-queries.ts`. Keine Entscheidung, nur laden.
- **Daten schreiben** → `app/**/_lib/*-actions.ts`, `'use server'`, jede Eingabe
  mit einem Zod-Schema.
- **Darstellung** → Server Components laden, Client Components (`_components/`)
  tragen die Interaktion.
- **SQL** → additive Migration in `supabase/migrations/`; bei jeder Migration
  `docs/DATENMODELL.md` mitpflegen (CI-Gate), RLS auf jeder neuen Tabelle.

## Unverhandelbar (Kurzform, Details in AGENTS.md §2)

Prüfungsinhalte immer Deutsch · keine Zahlenwerte ohne Fundstelle · keine
Reproduktion geschützter Prüfungsaufgaben · KI-Bewertung ist Lernfeedback, keine
Zulassung · keine Secrets im Client · RLS auf jeder Tabelle · Farbe nie
alleiniger Informationsträger (immer Symbol + Textlabel).

## Konventionen

- Namen und Kommentare auf Deutsch, passend zum Bestand.
- Kein `new Date()` ohne Argument in der Domäne — Zeit kommt herein.
- Kalendertage sind `YYYY-MM-DD` in der Zeitzone der Person, nicht UTC.
- Domänendateien bleiben unter 240 Zeilen (CI-Gate); lieber aufteilen.
- Vor dem Commit: `pnpm typecheck && pnpm lint && pnpm test`.
