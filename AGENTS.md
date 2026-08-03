# AGENTS.md — bze-online-campus

**Diese Datei ist die einzige Quelle der Projektbeschreibung.** `CLAUDE.md` und
`.cursor/rules/` verweisen hierher und wiederholen nichts.

Workspaceweite Regeln: `C:\Dev\AI-Workspace\shared-rules\AI_TOOL_RULES.md`

## Was das Projekt ist

Eine Online-Lernplattform (Campus) mit mehrsprachigen Fachkunde-Inhalten:
Lernpfade, Themenseiten, ein Freigabe-Workflow fuer Inhalte und ein
Admin-Bereich. Es ist das aktivste Projekt im Workspace.

## Stack

Next.js mit App Router und Internationalisierung, TypeScript, Tailwind,
Supabase als Backend, ein pnpm-Workspace mit `packages/`, ein Service Worker
(Serwist), Inhalte als MDX.

**Paketmanager ist `pnpm`, nicht npm.** Das Lockfile ist `pnpm-lock.yaml`. Ein
`npm install` erzeugt ein zweites, widerspruechliches Lockfile — es liegt bereits
ein `package-lock.json` im Repository, das aus so einem Versehen stammt.
TODO: Kann `package-lock.json` geloescht werden, oder haengt ein Deployment daran?

## Aufbau

| Verzeichnis | Inhalt |
|---|---|
| `app/` | Next.js App Router, Routen unter `[locale]/` |
| `content/fachkunde/` | die eigentlichen Lerninhalte als MDX (groesster Teil des Repos) |
| `components/` | gemeinsam genutzte Bauteile |
| `packages/` | Pakete des pnpm-Workspace |
| `supabase/` | Schema, Migrationen, Seed |
| `messages/` | Uebersetzungen |
| `service-worker/` | Serwist-Konfiguration |
| `scripts/` | Hilfsskripte (Node und Python) |
| `tests/` | `unit/`, `integration/`, `e2e/` |
| `docs/` | Architektur, Datenmodell, Design, ADRs |

## Befehle

```bash
pnpm install
pnpm dev              # Entwicklungsserver
pnpm build            # Produktionsbau
pnpm test             # Unit- und Integrationstests
pnpm test:e2e         # End-to-End
pnpm lint             # next lint
pnpm typecheck        # tsc --noEmit
pnpm lint:py          # ruff fuer scripts/
```

## Was zuerst zu lesen ist

- `docs/ARCHITEKTUR.md` — der Aufbau im Detail
- `docs/DATENMODELL.md` — Tabellen und Beziehungen
- `docs/adr/` — drei Architekturentscheidungen mit Begruendung
- `docs/LOKAL-EINRICHTEN.md` — Einrichtung
- `docs/DESIGN.md` — Gestaltung und Tokens

## Grenzen fuer Agenten

- `supabase/migrations/` wird nicht angefasst. Eine Migration ist ein Eingriff
  in bestehende Daten und braucht einen Menschen.
- `content/fachkunde/` sind fachliche Lerninhalte. Struktur und Formatierung
  ja, inhaltliche Aussagen nein — die muessen fachlich stimmen.
- Neue Texte gehoeren in `messages/`, nicht fest ins Bauteil. Die Oberflaeche
  ist mehrsprachig.
- `.env*` wird nicht gelesen und nicht ausgegeben.

## Zustand am 2026-08-03

Branch `wip/2026-08-03-migration` (`40377c6`), `main` steht auf `6a0623f`.
Auf dem `wip`-Branch liegen 340 zuvor unversionierte Dateien aus dem
Arbeitsbaum. Was davon nach `main` soll, ist noch nicht entschieden.

Ein zweiter Worktree `C:\c\dev\wt-10-fortschritt` (`feat/10-fortschritt`)
haengt noch am alten Quellpfad.
