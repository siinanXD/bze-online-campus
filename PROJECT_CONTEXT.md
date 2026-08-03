# PROJECT_CONTEXT.md — bze-online-campus

Der Kontext, der nicht aus dem Code hervorgeht.

## Wofuer das gebaut wird

Eine Lernplattform fuer die Fachkunde-Ausbildung. Nutzer sind Auszubildende,
die lernen und Uebungspruefungen absolvieren, und Ausbilder, die Inhalte
freigeben und den Fortschritt sehen.

Daraus folgen zwei Dinge, die man dem Code nicht ansieht:

- **Inhalte sind pruefungsrelevant.** Ein Fehler in `content/fachkunde/` ist
  kein Anzeigefehler, sondern falsch gelerntes Wissen. Deshalb der
  Freigabe-Workflow, deshalb `fachkunde:audit`.
- **Die Oberflaeche ist deutschsprachig** und mehrsprachig angelegt. Englische
  Platzhalter sind Fehler, keine Provisorien.

## Warum Supabase

Siehe `docs/adr/0001-stack.md`.

## Wo die Daten herkommen

Supabase. Migrationen unter `supabase/migrations/`, Seed ueber
`pnpm seed:generate` (ruft `scripts/generate_seed.py`).

TODO: Gibt es eine Produktions- und eine Entwicklungsinstanz, und woran
erkennt man beim Blick in `.env`, welche gerade konfiguriert ist?

## Stand und Herkunft

Migriert am 2026-08-03 aus `C:\c\dev`. Es existierte eine zweite, veraltete
Kopie auf dem Desktop mit 19 statt 84 Commits — die gueltige ist diese.

Weitere Notizen: `C:\Dev\Knowledge\01 Projects\bze-online-campus.md`
