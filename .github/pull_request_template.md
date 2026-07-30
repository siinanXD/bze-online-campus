## Was wurde geändert?

<!-- Kurze Beschreibung: was und warum. -->

## Bezug

<!-- Arbeitspaket / Spec-Abschnitt, z. B. AP-17, Spec §4.2. -->

## Checkliste vor dem Merge

- [ ] `pnpm typecheck` grün
- [ ] `pnpm lint` grün
- [ ] `pnpm test` grün (Unit + Integration)
- [ ] Neue Fachlogik liegt in `packages/core` (datenbankfrei) und ist getestet
- [ ] Datenzugriff in `_lib/*-queries.ts`, Mutationen in `_lib/*-actions.ts` mit Zod
- [ ] Bei Python-Änderungen: `pnpm lint:py` grün
- [ ] Bei neuer Migration: `docs/DATENMODELL.md` aktualisiert (sonst rotes Gate)
- [ ] Keine Secrets im Client, RLS auf jeder neuen Tabelle
- [ ] Farbe nie alleiniger Informationsträger (Symbol + Textlabel)
- [ ] `CHANGELOG.md` unter „Unreleased" ergänzt

## Edgecases

<!-- Welche Grenzfälle sind getestet? (Zeit/Zeitzonen, leere Mengen,
     kaputte Werte, Grenzwerte.) -->
