# TASKS.md — bze-online-campus

Offene Punkte dieses Projekts. Der Stand ist vom **2026-08-03** und stammt aus
der Migration nach `C:\Dev\Repositories`.

## Offen

- [ ] Entscheiden, was vom Branch `wip/2026-08-03-migration` nach `main` soll
- [ ] Sicherungszweig `wip/2026-08-03-migration` auf GitHub pushen
- [ ] `pnpm install` im neuen Pfad, danach `pnpm build` als Funktionstest
- [ ] Worktree `C:\c\dev\wt-10-fortschritt` (`feat/10-fortschritt`, `6b3b3ae`)
      abhaengen, bevor die alten Quellordner geloescht werden
- [ ] Klaeren, ob `package-lock.json` geloescht werden kann — das Projekt
      benutzt pnpm
- [ ] Alte Kopie auf dem Desktop (19 Commits) nach `Archive` verschieben

## Erledigt

- [x] 2026-08-03 — nach `C:\Dev\Repositories` migriert
- [x] 2026-08-03 — `.verwaist`-Dateien in `.git/` entfernt, `git fsck` sauber
- [x] 2026-08-03 — `git worktree prune` gelaufen (entfernte nichts, der
      zweite Worktree existiert noch)

---

## Wie hier gearbeitet wird

Erledigtes wird abgehakt und mit Datum versehen, nicht geloescht — sonst
verschwindet die Spur, warum etwas so ist, wie es ist.

Aufgaben, die ein Agent uebernehmen soll, gehoeren ins Agent-System:

```bash
python C:\Dev\AI-Workspace\AGENT-SYSTEM\orchestration\run.py new \
  --id TASK-XXX --project bze-online-campus --title "..."
```
