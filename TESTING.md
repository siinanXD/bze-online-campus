# TESTING.md — bze-online-campus

## Tests ausfuehren

```bash
pnpm test          # Unit + Integration
pnpm test:unit
pnpm test:integration
pnpm test:e2e
pnpm typecheck
pnpm lint
pnpm lint:py       # ruff fuer scripts/
```

## Wo die Tests liegen

`tests/unit/`, `tests/integration/`, `tests/e2e/`. Ausgefuehrt wird mit dem
Testlaeufer von Node (`node --import tsx --test`), nicht mit Jest oder Vitest.
Neue Tests folgen diesem Muster — ein zweites Testframework wird nicht
eingefuehrt.

Fuer die Inhalte gibt es zusaetzlich zwei Pruefungen:

```bash
pnpm fachkunde:inventar   # Freigabestand der Inhalte
pnpm fachkunde:audit      # Strukturpruefung
```

## Was ein guter Test hier leistet

Ein Test taugt nur, wenn er rot wird, sobald die Implementierung falsch ist.
Die Probe aufs Exempel: Waere dieser Test auch dann gruen, wenn die Funktion
Unsinn zurueckgibt? Dann sichert er nichts.

Abgedeckt gehoeren neben dem Normalfall:

- die Randfaelle — leer, null, eins, sehr gross, negativ
- der Fehlerfall — falscher Typ, fehlende Datei, ungueltige Eingabe
- bei wiederholbaren Ablaeufen: derselbe Aufruf zweimal

## Verbindlich

- **Testdaten sind erfunden.** Keine echten Kundennamen, Mailadressen,
  Buchungen oder Zugangsdaten — auch nicht "nur zum Ausprobieren".
- **Kein Test wird abgeschaltet, um eine Pruefung gruen zu bekommen.** Nicht
  mit `skip`, nicht mit `xit`, nicht mit `# noqa`, nicht mit `@ts-ignore`.
  Ein roter Test ist ein Befund, kein Hindernis.
- Ein Fehler bekommt erst einen Test, der ihn reproduziert, dann die Behebung.

## Besonderheit dieses Projekts

Inhalte unter `content/fachkunde/` sind pruefungsrelevant. Ein struktureller
Test kann feststellen, dass eine Seite wohlgeformt ist — ob die fachliche
Aussage stimmt, kann er nicht. Das bleibt Aufgabe der Freigabe durch einen
Menschen.
