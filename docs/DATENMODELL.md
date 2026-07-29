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

## AP-16 — Betriebsüberwachung (Monitoring)

Migration [`0012_monitoring.sql`](../supabase/migrations/0012_monitoring.sql): Aggregationen über `ki_aufrufe` als **SECURITY-INVOKER-Funktionen** (kein `security definer`, kein `service_role`), damit die RLS-Policy `ki_read` gilt — Admin sieht alles, Verwaltung ausschließlich den eigenen Träger.

- `ki_kennzahlen(von, bis, funktion?)` — Aufrufe, Fehler, Cache-Treffer, Kosten, p95-/Ø-Latenz für ein Zeitfenster `[von, bis)`
- `ki_trend(von, bis, granularitaet, funktion?)` — Kosten/Aufrufe je Tag/Woche/Monat (`date_trunc`)
- `ki_nach_funktion(von, bis)`, `ki_nach_traeger(von, bis, funktion?)`, `ki_nach_kohorte(von, bis, funktion?)`
- `ki_top_nutzer(von, bis, funktion?, limit=20)` — Top-Nutzer nach Kosten (Namen via `LEFT JOIN profiles`)
- `ki_budget()` — Budgetstatus des laufenden Kalendermonats je Träger; Budget aus `traeger.einstellungen->>'monatsbudget_eur'` (Default 200)

**Cache-Trefferquote ist eine dokumentierte Schätzung.** `ki_aufrufe` besitzt kein `aus_cache`-Flag; ein Treffer wird erkannt als erfolgreicher Aufruf mit `kosten_eur = 0`, ohne Token und mit einem Modell, das nicht `mock%` ist (Werte, die die Edge Functions bei Cache-Treffern schreiben). Ein exaktes Flag wäre ein späteres additives Feld in `ki_aufrufe` (Zuständigkeit AP-01/AP-09). Mehrfach-Kohortenmitgliedschaften eines Nutzers können Kosten in `ki_nach_kohorte` mehreren Kohorten zurechnen.

## Offen / Folgepakete

- `themen`-Hierarchie wird ab AP-05/06 mit Lerneinheiten bespielt.
- AP-09: `freitext_bewertung_cache`, RPC `pruefung_freitext_abschliessen` (Migration `0005_freitext_bewertung.sql`), Edge Function `bewerte-freitext`.

## AP-18 — Ausbildungsnachweis (Berichtsheft)

Migration [`0008_berichtsheft.sql`](../supabase/migrations/0008_berichtsheft.sql): **additiv**, ändert keine bestehenden Objekte. Die Tabellen `nachweise`, `nachweis_signaturen`, `nachweis_korrekturen` und ihre RLS-Policies stammen unverändert aus `0001_datenmodell.sql` (signierte Nachweise sind für Teilnehmer schreibgeschützt — Spec §3 Regel 15).

Neu in 0008:

- Indizes `nachweise_user_zeitraum_idx`, `nachweis_signaturen_nachweis_idx`, `nachweis_korrekturen_nachweis_idx` für Kalender-/Lückenansicht und Ausbilderlisten.
- Helfer `nachweis_ist_betreuer(teilnehmer)` — Admin/Verwaltung oder zugewiesener Ausbilder (`app_betreut`).
- Statusübergänge als `SECURITY DEFINER`-RPCs (Berechtigung wird intern über `auth.uid()` / `nachweis_ist_betreuer` geprüft, Ausführung nur für `authenticated` + `service_role`):
  - `nachweis_einreichen(id)` — Teilnehmer: `entwurf|beanstandet → eingereicht`
  - `nachweis_signieren_teilnehmer(id, hash)` — Teilnehmer: `eingereicht → signiert_teilnehmer`, legt Signaturzeile an
  - `nachweis_signieren_ausbilder(id, hash)` — Ausbilder: `signiert_teilnehmer → signiert_ausbilder`, legt Signaturzeile an
  - `nachweis_beanstanden(id, begruendung)` — Ausbilder: `eingereicht|signiert_teilnehmer → beanstandet`, dokumentiert die Begründung als `nachweis_korrekturen`-Eintrag
  - `nachweis_korrektur(id, nachher, begruendung)` — Ausbilder: Korrektur eines **signierten** Blatts; Status bleibt, `vorher/nachher` + Begründung werden protokolliert (Spec §3 Regel 15)

Der Signatur-`hash` entsteht in der Server Action aus `signaturKlartext()` (`@bze/core/nachweis`, SHA-256 über Inhalt + Status) und macht nachträgliche, undokumentierte Änderungen erkennbar.

Kern-/Logikschicht: `@bze/core/nachweis` (Statusübergänge, Sperrlogik, ISO-Kalenderwochen-Lückenanzeige) mit `node:test`-Tests. Edge Functions: `formuliere-nachweis` (KI-Formulierungshilfe — formuliert ausschließlich aus Nutzereingaben, Spec Grundregel 14) und `berichtsheft-pdf` (druckfertiger HTML-Export, je Blatt Name/Ausbildungsjahr/Zeitraum).

## AP-13 — Wochenbericht & Merkkarten (Migration `0010_wochenbericht`)

Die Tabelle `wochenberichte` (`user_id`, `jahr`, `kalenderwoche`, `inhalt` jsonb,
`merksaetze` jsonb, `gelesen` bool; RLS `wochenberichte_own` = `user_id = auth.uid()`)
stammt aus `0001_datenmodell`. Migration `0010` ergänzt **additiv**:

- **Indizes** `wochenberichte_user_zeit_idx` (neuester Bericht je Nutzer) und
  `wochenberichte_user_ungelesen_idx` (partieller Index auf ungelesene Berichte).
- **RPC** `wochenbericht_gelesen(p_bericht_id uuid) → boolean` — markiert den
  Bericht des Aufrufers als gelesen. Läuft mit **Aufruferrechten** (`security invoker`);
  die bestehende Policy stellt sicher, dass nur der Eigentümer schreibt. `grant execute` für `authenticated`.
- **View** `v_wochenbericht_neueste` (`security_invoker = true`) — neuester Bericht
  je Nutzer; RLS von `wochenberichte` greift, Teilnehmer sehen nur den eigenen.
- **pg_cron-Hinweis** (kommentiert): Zeitplan `0 20 * * 0` (So 20:00) ruft die Edge
  Function `erzeuge-wochenbericht` mit `x-cron-secret`-Header auf. Lokal oft nicht
  verfügbar (`pg_cron`/`pg_net`), daher auskommentiert — Details in der Function-README.

`inhalt` speichert `{ zusammenfassung, verbesserungen, empfehlung, statistik }`
(Statistik: bearbeitet, richtig/falsch, Richtig-Quote, Vorwochenvergleich, Trend,
drei schwächste Themen). `merksaetze` ist ein Array `[{ text, thema? }]` mit
3–5 kurzen Merksätzen zu **tatsächlich falsch beantworteten** Fragen (Spec §5).
Erzeugung ausschließlich in der Edge Function `erzeuge-wochenbericht`
(LLM in Nutzersprache, `ki_aufrufe`-Protokollierung, Budgetprüfung).

## AP-12 — Fragen- und Inhaltsproduktion

Migration [`0009_fragengenerator.sql`](../supabase/migrations/0009_fragengenerator.sql): **additiv**. Die Tabellen `fragen`, `antwortoptionen`, `freitext_loesungen`, `review_queue`, `frage_normen`, `ki_aufrufe` und ihre RLS-Policies stammen unverändert aus `0001_datenmodell.sql`.

Neu in 0009:

- Additive Spalte `fragen.normbezuege jsonb not null default '[]'` — verpflichtendes Ausgabefeld des Generators (Spec §5), Array normalisierter Normkürzel (z. B. `["DIN EN ISO 2768-1"]`). Die relationale Verknüpfung über `frage_normen` bleibt möglich; die Spalte ist die selbsttragende Generator-/Verifier-Ausgabe.
- Vektorindex `fragen_embedding_cos_idx` (`ivfflat … vector_cosine_ops`, lists=100) für die Kosinus-Dublettensuche; Filterindizes `fragen_status_thema_idx`, `fragen_kern_status_idx`.
- `frage_dubletten(thema_id, embedding, schwelle=0.92, exclude?, limit=5)` — **SECURITY DEFINER**, gibt Bestandsfragen desselben Themas mit Kosinus-Ähnlichkeit ≥ Schwelle zurück (Spec §5 Schritt 1). Aufruf aus der Edge Function `generiere-fragen` (service_role) und für `authenticated`.
- Statusübergänge als **SECURITY DEFINER**-RPCs (Rollenprüfung intern über `app_rolle`/`app_is_admin`, setzen `geprueft_von`/`geprueft_am`):
  - `frage_status_setzen(frage_id, status)` — beliebiger Statuswechsel durch Ausbilder/Verwaltung/Admin.
  - `frage_freigeben(frage_id)` — `verifiziert|pruefung_noetig → freigegeben`, schließt offene `review_queue`-Einträge der Frage. Kernfragen werden **immer** hierüber manuell freigegeben (Spec §5).
  - `fragen_freigeben_viele(ids[])` — Massenfreigabe; nur `verifiziert|pruefung_noetig` werden freigegeben, Rückgabe = Anzahl.

**Embedding-Einschränkung (dokumentiert):** Im Mock-/Offline-Betrieb (`LLM_MOCK=1` oder fehlender `LLM_API_KEY`) erzeugt `generiere-fragen` ein **hash-basiertes Pseudo-Embedding** (Bag-of-Words auf 1536 Buckets, L2-normiert). Es liefert eine deterministische, rein lexikalische Kosinus-Ähnlichkeit ohne semantisches Verständnis — ausreichend, um nahezu identische Entwürfe als Dubletten zu erkennen, aber kein Ersatz für echte Embeddings im Produktivbetrieb. Der n-Gramm-Vergleich läuft mangels Volltext der Trägerskripte gegen die Aufgabenstellungen des Bestands desselben Themas (Proxy für den Quelltext).

Edge Functions: `generiere-fragen` (Batch, Quellenhierarchie hart, Dubletten-/n-Gramm-Check, ruft anschließend `verifiziere-frage`) und `verifiziere-frage` (unabhängiger Modellaufruf; `verifiziert` → Erweiterungspool automatisch `freigegeben` mit 10 % Stichprobe, Kernfragen bleiben zur manuellen Freigabe). Oberfläche: `app/[locale]/ausbilder/fragen` (Batch-Generator, Entwurfs-/Verifikationsliste, Inline-Bearbeitung, Kernpool-Markierung, Massenfreigabe, Anzeige von Quellenstufe/Fundstelle, Dublettenhinweise).

## Welle 3 — Migrationsnummern (reserviert)

Parallele Worktrees dürfen nur die zugewiesene Nummer verwenden. Bestehende Migrationen werden nie geändert.

| Nr | Paket | Dateiname (Präfix) |
|----|-------|---------------------|
| `0008` | AP-18 Ausbildungsnachweis | `0008_berichtsheft` |
| `0009` | AP-12 Fragengenerator | `0009_fragengenerator` |
| `0010` | AP-13 Wochenbericht | `0010_wochenbericht` |
| `0011` | AP-15 PWA/Offline | `0011_pwa` (nur falls DB nötig) |
| `0012` | AP-16 Monitoring | `0012_monitoring` (nur falls DB nötig) |
| `0013` | AP-14 i18n-Vollausbau | `0013_i18n` (nur falls DB nötig) |
