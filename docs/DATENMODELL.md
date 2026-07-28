# Datenmodell (AP-01)

Postgres, UUID-Primärschlüssel, `created_at`/`updated_at` überall, **RLS auf jeder Tabelle explizit**. Mandantenfähig über `traeger_id`. Migration: [`supabase/migrations/0001_datenmodell.sql`](../supabase/migrations/0001_datenmodell.sql).

## Gruppen & Tabellen

**Mandant und Nutzer** — `traeger`, `profiles`, `kohorten`, `kohorten_mitglieder`, `ausbilder_zuweisungen`

**Kammer und Beruf** — `kammern`, `bewertungsschluessel`, `pruefungstermine`, `berufe`, `ausbildungsphasen`, `pruefungsbereiche`, `themen` (selbstreferenzierend über `parent_id`)

**Lerninhalte** — `lerneinheiten` (mit `abschnitte` jsonb), `lerneinheiten_versionen`, `lerneinheit_fortschritt` (auf Abschnittsebene), `glossar_begriffe`

**Fragen** — `fragen` (mit `kern`, `quellenstufe`, `tabellenbuch_fundstelle`, `enthaelt_zahlenwert`, `embedding vector(1536)`), `antwortoptionen`, `freitext_loesungen`, `fragen_uebersetzungen`, `fragen_meldungen`

**Lernfortschritt** — `versuche`, `fragen_mastery`, `lernpunkte`, `achievements`, `nutzer_achievements`, `wochenberichte`

**Prüfungen** — `pruefungen`, `pruefung_fragen`, `pruefung_ergebnisse`, `pruefungsreife`

**Ausbildungsnachweis** — `nachweise`, `nachweis_signaturen`, `nachweis_korrekturen`

**Qualität, Betrieb, Video** — `review_queue`, `quelldokumente`, `normen`, `frage_normen`, `ki_aufrufe`, `audit_log`, `videos`, `video_skripte`, `video_untertitel`, `freitext_bewertung_cache` (AP-09)

## RLS-Hilfsfunktionen

`SECURITY DEFINER`, um Rekursion auf `profiles` zu vermeiden:

- `app_rolle()` → Rolle des angemeldeten Nutzers
- `app_traeger()` → dessen `traeger_id`
- `app_is_admin()` → boolean
- `app_betreut(teilnehmer uuid)` → ist der aufrufende Ausbilder diesem Teilnehmer zugewiesen?

## RLS-Grundmuster (Spec §3)

- **Teilnehmer** lesen/schreiben ausschließlich **eigene** `versuche`, `fragen_mastery`, `pruefung_ergebnisse`, `lerneinheit_fortschritt`, `nachweise`, `lernpunkte`, `wochenberichte`, `nutzer_achievements`, `pruefungsreife`. Fragen und Lerneinheiten nur mit Status `freigegeben`.
- **Ausbilder** sehen zusätzlich lesend die Daten der **zugewiesenen** Teilnehmer (`app_betreut`).
- **Verwaltung** sieht/verwaltet den eigenen Träger. **Admin** alles.
- `quelldokumente` sind **nie** für Teilnehmer lesbar.
- `freitext_loesungen` (Musterlösungen) sind nicht für Teilnehmer lesbar.
- Signierte `nachweise` sind schreibgeschützt; Änderungen nur über `nachweis_korrekturen` mit Begründung.
- `ki_aufrufe`/`audit_log` nur Admin (Verwaltung liest eigene `ki_aufrufe`).

## Nachweis der Prüfung

Gegen PostgreSQL 16 + pgvector:

| Prüfung | Ergebnis |
|---|---|
| Migration `ON_ERROR_STOP=1` | fehlerfrei |
| RLS aktiv auf allen `public`-Tabellen | ja (0 ohne RLS) |
| Teilnehmer sieht Fragen | nur `freigegeben` |
| Teilnehmer sieht `freitext_loesungen` | 0 (verborgen) |
| Teilnehmer eigene `versuche` | nur eigene |
| Ausbilder ohne Zuweisung → fremde `versuche` | 0 |
| Ausbilder mit Zuweisung → `versuche` | sichtbar |
| Admin | alles |

## Seed

`supabase/seed/0001_maf_seed.sql`, erzeugt aus `MAF_Fragenpool_Charge1.json` durch `scripts/generate_seed.py` (deterministische uuid5-IDs, idempotent). Inhalt: Träger BZE, Kammer IHK Aachen, IHK-100-Schlüssel, Beruf MAF, 2 Phasen, 3 Prüfungsbereiche, 15 Themen, 70 Fragen (57 MC + 13 Freitext) im Status `entwurf`, Normbezüge als `normen`/`frage_normen`.

## AP-06 / AP-10 — Fortschritt

Migration [`0002_mastery.sql`](../supabase/migrations/0002_mastery.sql): `verarbeite_versuch()`, `kohorte_beitreten()`, erste Views `v_fortschritt_thema` / `v_fortschritt_bereich`.

Migration [`0006_fortschritt.sql`](../supabase/migrations/0006_fortschritt.sql) (AP-10):

- Views (security_invoker): `v_fortschritt_thema` (korrigierter Kern-Denominator), `v_fortschritt_bereich`, `v_fortschritt_phase`, `v_fortschritt_beruf`, `v_wochenaktivitaet_nutzer`, `v_kohorten_uebersicht`
- `pruefe_achievements(user_id)`, `pruefe_pruefungsreife(user_id)` — von `verarbeite_versuch` aufgerufen
- Unique `(user_id, phase_id)` auf `pruefungsreife`
- Achievement-Katalog (3 Einträge: erste/zehn Kernfragen, 100 Lernpunkte)

Kaskadenlogik und Fortsetzen-Empfehlung liegen in `@bze/core/fortschritt` (keine Inhaltssperre; Gates sind sichtbare Ziele). Prüfungsreife erzeugt eine **Ausbilderempfehlung**, keine Kammerzulassung.

## AP-11 — Ausbilder-Bestätigung

Migration [`0007_ausbilder_pruefungsreife.sql`](../supabase/migrations/0007_ausbilder_pruefungsreife.sql): Policy `pruefungsreife_betreuer_update` — Ausbilder/Verwaltung dürfen `pruefungsreife` der betreuten Teilnehmer aktualisieren (Bestätigung + Kommentar). Cockpit liest `v_wochenaktivitaet_nutzer` / `v_fortschritt_beruf` / `v_kohorten_uebersicht`.

## Offen / Folgepakete

- `themen`-Hierarchie wird ab AP-05/06 mit Lerneinheiten bespielt.
- AP-09: `freitext_bewertung_cache`, RPC `pruefung_freitext_abschliessen` (Migration `0005_freitext_bewertung.sql`), Edge Function `bewerte-freitext`.
