# BZE Online Campus

Lern- und Prüfungsplattform (installierbare PWA) für Bildungsträger. Teilnehmende bereiten sich auf den schriftlichen Teil ihrer Kammerprüfung vor: Fachkunde lesen, Fragen bis zur Beherrschung üben, Wochenprüfungen im Originalformat schreiben, Ausbildungsnachweis führen. Ausbilder begleiten und geben frei, ein Admin verwaltet.

**Erstpilot:** Maschinen- und Anlagenführer/-in, Schwerpunkt Metall- und Kunststofftechnik · Kammer IHK Aachen · Kunde Berufsbildungszentrum Euskirchen.

Die maßgebliche Spezifikation ist [`docs/SPEC.md`](docs/SPEC.md), die Arbeitsregeln stehen in [`AGENTS.md`](AGENTS.md).

## Stack

| Bereich | Technologie |
|---|---|
| Frontend | Next.js 15 (App Router, React Server Components), TypeScript strict |
| Gestaltung | Tailwind mit eigenen Farb-Tokens, `@bze/ui`-Designsystem, next-intl (6 Sprachen inkl. RTL) |
| Fachlogik | `@bze/core` — reine, datenbankfreie Domänen (mastery, bewertung, fortschritt, nachweis, engagement, benachrichtigung) |
| Backend | Supabase — Postgres mit RLS auf jeder Tabelle, pgvector, Auth, Storage, Edge Functions (Deno), pg_cron |
| PWA | handgeschriebener Service Worker, IndexedDB-Outbox mit Background Sync, Web Push (VAPID) |
| Validierung | Zod an jeder Server-Action-Grenze |
| Tests | node:test (Unit + Integration), Playwright (E2E), ruff für die Python-Skripte |
| Betrieb | Vercel EU + Supabase eu-central-1 |

Die maßgebliche Spezifikation ist [`docs/SPEC.md`](docs/SPEC.md), die Architektur der
Schichten steht in [`docs/ARCHITEKTUR.md`](docs/ARCHITEKTUR.md), die Arbeitsregeln in
[`AGENTS.md`](AGENTS.md).

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
app/[locale]/        Next.js App Router; je Bereich _lib/ (queries + actions) und _components/
packages/            ui, core (Domänen), db, config
  core/              mastery, bewertung, fortschritt, nachweis, engagement, benachrichtigung, werte
supabase/
  migrations/        additive SQL-Migrationen (nie ändern)
  seed/              MAF-Seed + Quell-JSON
  functions/         Edge Functions (Deno)
service-worker/      PWA-Client: Offline-Outbox und Push-Client
messages/            Übersetzungen de,en,fr,ar,uk,tr
content/fachkunde/   MDX-Lerninhalte
tests/               unit, integration, e2e, helpers
docs/                SPEC.md, DATENMODELL.md, ARCHITEKTUR.md, adr/
scripts/             generate_seed.py, generate_i18n.py
```

## Datenbank & Seed lokal fahren

```bash
supabase db reset      # Migration 0001 + Seed 0001
```

Der Seed lädt: Träger BZE, Kammer IHK Aachen, IHK-100-Bewertungsschlüssel, Beruf MAF mit 2 Phasen, 3 Prüfungsbereichen, 15 Themen und **70 Fragen (57 MC + 13 Freitext)** im Status `entwurf`. Aufnahme in den Kernpool erfordert Ausbilderfreigabe (Spec §2, Regel 7).

## PWA & Offline (AP-15)

Die App ist als installierbare PWA ausgelegt (Manifest, Standalone-Display, Icons). Ein handgeschriebener Service Worker (`public/sw.js`, siehe [`docs/adr/0003-pwa-serwist.md`](docs/adr/0003-pwa-serwist.md)) precached die App-Shell, cached statische Assets (Stale-While-Revalidate) und Navigationen (Network-First mit Offline-Fallback `public/offline.html`). Offline abgegebene Eingaben landen in einer IndexedDB-Outbox (`service-worker/offline-db.ts`) und werden per Background Sync übertragen, sobald wieder Verbindung besteht. Ein sichtbarer Offline-Indikator und ein Update-Hinweis (`service-worker/`) sind im Root-Layout eingebunden.

**Lokal testen:**

```bash
pnpm build && pnpm start          # Service Worker greift nur im Produktionsbuild sinnvoll
```

- Installierbarkeit/Manifest: DevTools → Application → Manifest.
- Offline-Fallback: DevTools → Network → „Offline", dann Navigation.
- Offline-Indikator und Update-Hinweis: Netz trennen bzw. `VERSION` in `public/sw.js` erhöhen und neu laden.

## Wochenbericht & Merkkarten (AP-13)

Die Edge Function [`erzeuge-wochenbericht`](supabase/functions/erzeuge-wochenbericht/README.md)
erzeugt pro aktivem Teilnehmer einen wöchentlichen Lernbericht (Spec §5):
Aggregation der Woche, drei schwächste Themen, Vergleich mit der Vorwoche und –
per LLM in der Nutzersprache – Zusammenfassung, Verbesserungen, eine konkrete
Empfehlung sowie **3–5 kurze Merksätze zu tatsächlich falsch beantworteten Fragen**.
Ergebnis landet in `wochenberichte`. Zwei Betriebsarten: Cron-Massenlauf
(`x-cron-secret`, sonntags 20:00) und einzelner Teilnehmer per authentifiziertem
POST (Test/Admin-Trigger). `LLM_MOCK=1` liefert eine Heuristik ohne LLM; jeder
Lauf wird in `ki_aufrufe` protokolliert und gegen das Monatsbudget geprüft.

Der Startbildschirm zeigt die Karten `WochenberichtKarte` und `Merkkarte`
(`components/dashboard/`, Datenladung im Server Component `app/[locale]/campus/page.tsx`).
Der Bericht ist automatisches Lernfeedback (sichtbarer Hinweis), lässt sich als
gelesen markieren (RPC `wochenbericht_gelesen`), und die Merkkarte zeigt je einen
Merksatz mit Symbol + Textlabel. Migration `0010_wochenbericht.sql` (RPC, View,
pg_cron-Hinweis).

## Tests

```bash
pnpm test              # Unit + Integration (node:test), läuft in der CI bei jedem Push
pnpm test:unit         # nur packages/core — reine Fachlogik
pnpm test:integration  # Zusammenspiel über Modulgrenzen (z. B. Domain → Push-Text)
pnpm test:e2e          # Playwright-Smoke; braucht eine laufende App (E2E_BASE_URL)
pnpm lint:py           # ruff check + format für die Python-Skripte
```

Die Fachlogik liegt bewusst in `@bze/core` und ist frei von Datenbank und
Framework — dadurch ist jede Regel ohne Supabase testbar. Schwerpunkt der Tests
sind die Ränder, an denen es in der Praxis bricht: Zeitzonen und Sommerzeit
(Lernserie), ISO-Kalenderwochen am Jahreswechsel (Ausbildungsnachweis), die
Stufengrenzen des IHK-Schlüssels (Bewertung) und kaputte Werte aus der Datenbank.
Details in [`tests/README.md`](tests/README.md).

## Erinnerungen & Lernfokus (AP-17)

Web Push hält Teilnehmende am Ball, ohne zu nerven. Die Entscheidung, **ob** und
**was** gesendet wird, liegt vollständig in der getesteten Domäne
`packages/core/benachrichtigung` — stille Zeiten, Rangfolge der Anlässe,
Tagesdeckel und Mindestpausen. Die Edge Function
[`sende-erinnerungen`](supabase/functions/sende-erinnerungen/README.md) ruft diese
Domäne nur auf und erledigt den VAPID-signierten Versand. Auf der Startseite
bündelt die Fokus-Karte Lernserie, Tagesziel und die Wiedervorlage früherer
Fehler; das Opt-in samt stiller Zeiten steht im Profil. Migration
`0014_push.sql`; Opt-in erst nach ausdrücklicher Zustimmung (kein Default).

## Stand der Arbeitspakete

**Welle 0 (seriell)**

- [x] **AP-00** Repo & Werkzeugkette — Monorepo, Next.js-Skelett, CI, Doku-Gate, `.env.example`
- [x] **AP-01** Datenmodell — alle Tabellen aus Spec §3, RLS auf jeder Tabelle (mit Testnutzern je Rolle geprüft), MAF-Seed aus Fragenpool
- [x] **AP-02** Design-System & i18n — Tailwind-Tokens (Spec §7), `@bze/ui`-Basiskomponenten (Button, Card, StatusBadge mit Farbe+Symbol+Label, ProgressRing, Chip), i18n de/ar mit RTL, Showcase-Startseite. Typecheck und `next build` grün.

**Welle 1** — [x] AP-03 Auth · [x] AP-04 Shell/Landing · [x] AP-05 Fachkunde · [x] AP-06 Lernmodus · [x] AP-07 Admin  _(Welle 1 komplett, Integrationsbuild grün)_
**Welle 2** — [x] AP-08 Wochenprüfung · [x] AP-09 KI-Freitextbewertung · [x] AP-10 Fortschritt/Gates · [x] AP-11 Ausbilder-Cockpit
**Welle 3** — [x] AP-12 Fragengenerator · [x] AP-13 Wochenbericht · [x] AP-14 i18n-Vollausbau · [x] AP-15 PWA/Offline · [x] AP-16 Monitoring · [x] AP-18 Ausbildungsnachweis
**Welle 4** — [x] AP-17 Erinnerungen & Lernfokus (Web Push, Lernserie, Tagesziel, Fehler-Wiedervorlage)
**Später** — [ ] Erklärvideos (Remotion)

## Validierung AP-01

Migration und Seed wurden gegen PostgreSQL 16 + pgvector geprüft: Migration läuft fehlerfrei, Seed lädt 70 Fragen / 228 Antwortoptionen / 13 Musterlösungen, RLS ist auf allen Tabellen aktiv. RLS-Verhalten je Rolle getestet: Teilnehmer sieht nur `freigegeben`-Inhalte und eigene Daten, Ausbilder nur zugewiesene Teilnehmer, Admin alles.

## Nicht verhandelbar (Kurzform, Details in AGENTS.md)

Prüfungsinhalte immer Deutsch · keine Zahlenwerte ohne Fundstelle · keine Reproduktion geschützter Prüfungsaufgaben · die App vergibt keine Prüfungszulassung · KI-Bewertung ist Lernfeedback · keine Secrets im Client · RLS auf jeder Tabelle · Farbe nie alleiniger Informationsträger.
