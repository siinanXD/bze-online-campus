# DECISIONS.md — bze-online-campus

Entscheidungen, die spaeter niemand mehr rekonstruieren kann, wenn sie nicht
aufgeschrieben sind. Format: was entschieden wurde, warum, und was die
Alternative gewesen waere.

Neue Eintraege kommen oben dazu.

## 2026-08-03 — Laufende Arbeit auf einen wip-Branch statt nach main

**Entscheidung:** Die 340 unversionierten Dateien aus dem Arbeitsbaum wurden
auf `wip/2026-08-03-migration` committet, nicht auf `main`.

**Warum:** Bei der Migration war nicht pruefbar, was davon fertig ist. Ein
Commit auf `main` haette unfertige Arbeit zum offiziellen Stand gemacht.

**Alternative:** Verwerfen — haette moeglicherweise Wochen Arbeit gekostet.

**Folgen:** `main` und `wip` laufen auseinander. Es muss noch entschieden
werden, was uebernommen wird.

---

## Aeltere Entscheidungen

Stehen als ADR unter `docs/adr/`:

- `0001-stack.md` — Wahl des Technologie-Stacks
- `0002-design-tokens.md` — Design-Tokens statt fester Werte
- `0003-pwa-serwist.md` — Serwist als Service Worker

Neue Architekturentscheidungen kommen weiter als ADR nach `docs/adr/`. Diese
Datei sammelt alles, was kein voller ADR ist.

---

## Vorlage

```markdown
## JJJJ-MM-TT — <Titel>

**Entscheidung:** <was gilt>

**Warum:** <der Grund, nicht die Wiederholung der Entscheidung>

**Alternative:** <was verworfen wurde und weshalb>

**Folgen:** <was dadurch schwieriger wird — jede Entscheidung kostet etwas>
```
