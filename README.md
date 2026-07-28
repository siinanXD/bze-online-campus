# BZE Online Campus

Lern- und Prüfungsplattform (installierbare PWA) für Bildungsträger. Teilnehmende bereiten sich auf den schriftlichen Teil ihrer Kammerprüfung vor: Fachkunde lesen, Fragen bis zur Beherrschung üben, Wochenprüfungen im Originalformat schreiben, Ausbildungsnachweis führen. Ausbilder begleiten und geben frei, ein Admin verwaltet.

**Erstpilot:** Maschinen- und Anlagenführer/-in, Schwerpunkt Metall- und Kunststofftechnik · Kammer IHK Aachen · Kunde Berufsbildungszentrum Euskirchen.

Die maßgebliche Spezifikation ist [`docs/SPEC.md`](docs/SPEC.md), die Arbeitsregeln stehen in [`AGENTS.md`](AGENTS.md).

## Stack

Next.js 15 (App Router, RSC) · TypeScript strict · Tailwind + shadcn/ui · next-intl · Supabase (Postgres, pgvector, Auth, Storage, Edge Functions, pg_cron) · Serwist (PWA) · Zod · Deployment Vercel EU + Supabase eu-central-1.

## Setup in unter 10 Minuten

```bash
pnpm install
cp .env.example .env.local          # Supabase-URL und Keys eintragen
supabase start                      # lokale Supabase-Instanz
supabase db reset                   # spielt Migrationen + Seed ein
pnpm dev                            # http://localhost:3000/de
```

Der Seed wird aus dem Fragenpool erzeugt:

```bash
pnpm seed:generate                  # supabase/seed/0001_maf_seed.sql aus JSON
```

## Verzeichnisübersicht

```
app/[locale]/        Next.js App Router (Oberfläche, ab AP-02/03)
packages/            ui, core (mastery, bewertung, fortschritt, nachweis), db, config
supabase/
  migrations/        additive SQL-Migrationen (nie ändern)
  seed/              MAF-Seed + Quell-JSON
  functions/         Edge Functions (ab AP-03)
messages/            Übersetzungen de,en,fr,ar,uk,tr
content/fachkunde/   MDX-Lerninhalte (ab AP-05)
docs/                SPEC.md, DATENMODELL.md, adr/
scripts/             generate_seed.py
```

## Datenbank & Seed lokal fahren

```bash
supabase db reset      # Migration 0001 + Seed 0001
```

Der Seed lädt: Träger BZE, Kammer IHK Aachen, IHK-100-Bewertungsschlüssel, Beruf MAF mit 2 Phasen, 3 Prüfungsbereichen, 15 Themen und **70 Fragen (57 MC + 13 Freitext)** im Status `entwurf`. Aufnahme in den Kernpool erfordert Ausbilderfreigabe (Spec §2, Regel 7).

## Stand der Arbeitspakete

**Welle 0 (seriell)**

- [x] **AP-00** Repo & Werkzeugkette — Monorepo, Next.js-Skelett, CI, Doku-Gate, `.env.example`
- [x] **AP-01** Datenmodell — alle Tabellen aus Spec §3, RLS auf jeder Tabelle (mit Testnutzern je Rolle geprüft), MAF-Seed aus Fragenpool
- [x] **AP-02** Design-System & i18n — Tailwind-Tokens (Spec §7), `@bze/ui`-Basiskomponenten (Button, Card, StatusBadge mit Farbe+Symbol+Label, ProgressRing, Chip), i18n de/ar mit RTL, Showcase-Startseite. Typecheck und `next build` grün.

**Welle 1** — [ ] AP-03 Auth · [ ] AP-04 Shell/Landing · [ ] AP-05 Fachkunde · [ ] AP-06 Lernmodus · [ ] AP-07 Admin
**Welle 2** — [ ] AP-08 Wochenprüfung · [ ] AP-09 KI-Freitextbewertung · [ ] AP-10 Fortschritt/Gates · [ ] AP-11 Ausbilder-Cockpit
**Welle 3** — [ ] AP-12 Fragengenerator · [ ] AP-13 Wochenbericht · [ ] AP-14 i18n-Vollausbau · [ ] AP-15 PWA/Offline · [ ] AP-16 Monitoring · [ ] AP-18 Ausbildungsnachweis
**Später** — [ ] AP-17 Erklärvideos (Remotion)

## Validierung AP-01

Migration und Seed wurden gegen PostgreSQL 16 + pgvector geprüft: Migration läuft fehlerfrei, Seed lädt 70 Fragen / 228 Antwortoptionen / 13 Musterlösungen, RLS ist auf allen Tabellen aktiv. RLS-Verhalten je Rolle getestet: Teilnehmer sieht nur `freigegeben`-Inhalte und eigene Daten, Ausbilder nur zugewiesene Teilnehmer, Admin alles.

## Nicht verhandelbar (Kurzform, Details in AGENTS.md)

Prüfungsinhalte immer Deutsch · keine Zahlenwerte ohne Fundstelle · keine Reproduktion geschützter Prüfungsaufgaben · die App vergibt keine Prüfungszulassung · KI-Bewertung ist Lernfeedback · keine Secrets im Client · RLS auf jeder Tabelle · Farbe nie alleiniger Informationsträger.
