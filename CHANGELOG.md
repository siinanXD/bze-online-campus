# Changelog

Alle nennenswerten Änderungen an diesem Projekt werden hier festgehalten.
Format nach [Keep a Changelog](https://keepachangelog.com/de/1.0.0/).

---

## [Unreleased]

### Hinzugefügt

- **AP-17 Erinnerungen & Lernfokus.** Web Push, um Teilnehmende am Ball zu
  halten, ohne zu nerven.
  - Domäne `packages/core/benachrichtigung` (datenbankfrei, getestet): Planung,
    stille Zeiten, Rangfolge der Anlässe, Tagesdeckel, Mindestpausen, Abo-Pflege.
  - Domäne `packages/core/engagement`: Lernserie über Kalendertage, Tagesziel,
    Fälligkeiten, Abzeichen.
  - Migration `0014_push.sql`: `push_abos`, `push_einstellungen`,
    `push_protokoll`, `lern_aktivitaet` mit RLS. Kalendertage als `text` in der
    Zeitzone der Person, damit die Tagesgrenze nicht in UTC liegt.
  - Edge Function `sende-erinnerungen`: VAPID-signierter Versand, ruft die Domäne
    nur auf. Service-Worker-Handler für `push`/`notificationclick`/
    `pushsubscriptionchange`.
  - Opt-in im Profil (erst nach Zustimmung, kein Default), Fokus-Karte auf der
    Startseite (Serie, Tagesziel, Fehler-Wiedervorlage).
  - Push-Texte in allen sechs Sprachen inkl. rechtsläufigem Arabisch.
- **Teststruktur** `tests/unit | integration | e2e | helpers` mit Glob-Runner.
  253 Unit- und 54 Integrationstests (zuvor 22), Schwerpunkt auf Grenzfällen:
  Sommerzeit, ISO-Kalenderwochen am Jahreswechsel, Notenstufen, kaputte Werte.
  Selbst-überspringendes Playwright-E2E-Gerüst.
- **CI-Gates**: `pnpm test` läuft jetzt in der CI (lief zuvor nie); ruff-Job für
  die Python-Skripte; Dateigrößen-Gate für die Domäne (max. 240 Zeilen).
- **Werkzeuge**: `pyproject.toml` mit ruff-Konfiguration; npm-Skripte `test:unit`,
  `test:integration`, `test:e2e`, `lint:py`, `format:py`.
- Architekturdokument [`docs/ARCHITEKTUR.md`](docs/ARCHITEKTUR.md),
  [`CHANGELOG.md`](CHANGELOG.md), PR-Vorlage.
- Einrichtungsanleitung [`docs/LOKAL-EINRICHTEN.md`](docs/LOKAL-EINRICHTEN.md):
  Voraussetzungen, Herkunft jeder Umgebungsvariable, erster Anmeldezugang,
  Edge Functions lokal, häufige Stolpersteine.
- `supabase/config.toml`, damit `supabase start` und `supabase db reset` ohne
  vorheriges `supabase init` laufen (Ports, lokaler Mail-Catcher, keine
  Selbstregistrierung).
- Designsystem-Dokumentation [`docs/DESIGN.md`](docs/DESIGN.md): Tokens,
  Komponenteninventar und die verbindlichen Zugänglichkeitsregeln.
- Screenshots der Entwurfsbildschirme im README (`docs/bilder/`).

### Entfernt

- `.env.local.example` — enthielt eine konkrete Projekt-URL und stand neben
  `.env.example` in Konkurrenz. Es gibt nur noch eine Vorlage.
- `docs/DESIGN-MASTERPROMPT.md` — die enthaltenen Designentscheidungen stehen
  jetzt als Dokumentation in `docs/DESIGN.md`.

### Geändert

- Schichtentrennung geschärft: Datenzugriff in `_lib/*-queries.ts`, Mutationen in
  `_lib/*-actions.ts` (jede mit Zod-Schema), Fachlogik in `@bze/core`.
- Ausbilder-Fragenbereich: Typen und Anzeige-Zuordnungen nach `_lib/typen.ts`
  ausgelagert, damit die Server-Seite nicht mehr aus einer `'use client'`-Datei
  importiert.
- Python-Skripte auf PEP 8 / ruff gebracht, Docstrings für alle Funktionen.
- Arbeitsregeln von `AGENTS.md` nach [`CONTRIBUTING.md`](CONTRIBUTING.md) mit
  Einstiegs-Kurzfassung; Verweise im Code nachgezogen.
- README: Abschnitt „Lokal starten" korrigiert (Voraussetzungen, Verhalten ohne
  Zugangsdaten) und um „Grenzen und offene Punkte" ergänzt; Arbeitspaketnummern
  aus den Überschriften entfernt.
- `design:shots` nimmt auf schmalen Viewports nur den Ausschnitt auf — die
  `fixed` positionierte untere Navigation landete bei `fullPage` im Inhalt.

### Behoben

- Lernserie rechnete in Millisekunden statt Kalendertagen — jeder
  Sommerzeitwechsel hätte einen Tag der Serie verschluckt.
- `Number(null)` / `Number('')` ergeben `0`: fehlende Einstellungen landeten auf
  dem Minimum statt auf dem Standard (Tagesziel, Stunden, Deckel). Zentral in
  `packages/core/werte` gelöst.
- Abo-Aufräumen: ein 5xx-Fehler beim Push-Dienst hätte Endpunkte gelöscht — ein
  einstündiger Ausfall beim Anbieter hätte die halbe Abo-Tabelle abgeräumt.
- Doppelter Übersetzungsschlüssel `"Entfernen"` in `generate_i18n.py` (von ruff
  gefunden).
- Vier zuvor fehlende `shell`-Übersetzungen (Darstellung, Sprung) nachgetragen.

---

## Frühere Arbeitspakete

Die Wellen 0 bis 3 (AP-00 bis AP-16, AP-18) sind im Abschnitt „Stand der
Arbeitspakete" der [README](README.md) dokumentiert und über die Git-Historie
nachvollziehbar.
