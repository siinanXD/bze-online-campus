# SECURITY.md — bze-online-campus

Grundlage: `C:\Dev\AI-Workspace\shared-rules\SECURITY_RULES.md`. Hier steht
nur, was fuer dieses Projekt zusaetzlich gilt.

## Was niemals ins Repository gehoert

`.env` und `.env.*` (ausser `.env.example`), `*.pem`, `*.key`, `*.p12`,
`*.pfx`, `credentials*`, `secrets*`, Token-Caches, Datenbankabzuege.

Das gilt auch fuer Tests, Fixtures, Kommentare und Beispieldateien. Ein
Schluessel in einer Testdatei ist ein veroeffentlichter Schluessel.

## Was besonders zu beachten ist

**Supabase-Schluessel.** Der `anon key` ist fuer den Browser gedacht, der
`service_role key` niemals. Ein `service_role`-Schluessel in Client-Code
umgeht saemtliche Row-Level-Security.

**Row Level Security.** Neue Tabellen brauchen RLS-Policies. Eine Tabelle ohne
Policy ist entweder fuer alle offen oder fuer niemanden — beides faellt oft
erst in Produktion auf.

**Migrationen.** `supabase/migrations/` wird von Agenten nicht geaendert. Eine
Migration greift in bestehende Daten ein.

**Personenbezogene Daten.** Lernfortschritt ist personenbezogen. Er gehoert
nicht in Logs, nicht in Fehlermeldungen und nicht in Testfixtures.

## Fuer KI-Werkzeuge

Claude, Codex und Cursor duerfen die oben genannten Dateien **nicht lesen und
nicht ausgeben**. In Dokumentation wird hoechstens vermerkt, dass es sie gibt
und welche Variablennamen der Code erwartet — die Namen stammen aus dem Code,
nicht aus der Datei.

## Wenn doch etwas durchgerutscht ist

1. Den Schluessel beim Anbieter sofort widerrufen. Das ist der einzige Schritt,
   der wirklich wirkt.
2. Erst danach die Historie bereinigen (`git filter-repo`).
3. Einen bereits gepushten Schluessel als kompromittiert behandeln, auch wenn
   das Repository privat ist.

Reihenfolge nicht vertauschen: Ein aus der Historie entfernter, aber noch
gueltiger Schluessel ist weiterhin ein gueltiger Schluessel.
