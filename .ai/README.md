# .ai — bze-online-campus

Projektspezifische Konfiguration fuer das Agent-System.
Erzeugt am 2026-08-03 von `bootstrap_project.py`.

## Was hier liegt

| Pfad | Inhalt |
|---|---|
| `project.yaml` | erkannter Stack, Branch, Gates — **nicht geraten**, aus dem Bestand |
| `agent-overrides.yaml` | Anpassungen globaler Agenten. Leer ist der Normalfall. |
| `model-routing.yaml` | Abweichungen von der globalen Modellwahl |
| `quality-gates.yaml` | Gates dieses Projekts |
| `development-policy.yaml` | aktivierte Policies und Abweichungen |
| `agents/` | projektspezifische Agenten |
| `context/` | Projektkontext fuer Agenten |
| `prompts/` | erprobte Prompts fuer dieses Projekt |
| `workflows/` | projektspezifische Ablaeufe |
| `memory/` | dauerhafter Zustand zwischen Laeufen |
| `decisions/` | Entscheidungen, die kein voller ADR sind |
| `evaluations/` | Auswertungen |
| `research/` | Rechercheergebnisse, nach Quelle geordnet |

## Verhaeltnis zu den anderen Dokumenten

`AGENTS.md` im Wurzelverzeichnis ist die **Projektbeschreibung** und bleibt
die einzige Quelle dafuer. Dieses Verzeichnis enthaelt die **Konfiguration**
des Agent-Systems — was der Orchestrator liest, nicht was ein Mensch liest.

Wer wissen will, was das Projekt ist: `AGENTS.md`.
Wer wissen will, wie Agenten hier arbeiten: dieses Verzeichnis.

## Erkannter Stand

- Branch: `wip/2026-08-03-migration` · HEAD `40377c6`
- Remote: https://github.com/siinanXD/bze-online-campus.git
- Paketmanager: pnpm
- Testlaeufer: playwright
- Lint: ruff
- Typpruefung: keine

## Neu erzeugen

```powershell
python C:\Dev\Shared\Scripts\bootstrap_project.py --path C:\Dev\Repositories\bze-online-campus
```

Bestehende Dateien werden dabei **nicht** ueberschrieben.
