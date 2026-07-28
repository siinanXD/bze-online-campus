# BZE Online Campus — Gesamtspezifikation

**Einzige maßgebliche Quelle für die Umsetzung.** Alle früheren Teildokumente sind hier eingearbeitet.
Stand: Juli 2026 · Kunde: Berufsbildungszentrum Euskirchen (BZE) · Kammer: IHK Aachen

---

## 0 — Auftrag

Baue eine installierbare Progressive Web App als Lern- und Prüfungsplattform für Bildungsträger. Teilnehmende bereiten sich auf den schriftlichen Teil ihrer Kammerprüfung vor: Fachkunde lesen, Fragen bis zur sicheren Beherrschung üben, wöchentliche Prüfungen im Originalformat schreiben, den Ausbildungsnachweis führen. Ausbilder begleiten und geben Inhalte frei. Ein Admin verwaltet Konten und überwacht Betriebskosten.

**Erstpilot:** Maschinen- und Anlagenführer/-in, Schwerpunkt Metall- und Kunststofftechnik. Die Architektur trägt alle Berufe des Trägers und weitere Träger.

**Zielgruppe:** Erwachsene Umschüler, häufig 30 bis 50 Jahre, teils Deutsch als Zweitsprache, oft ältere Android-Geräte, Werkhallen ohne stabiles Netz. Daraus folgt: Mobile-First, offline nutzbar, einfache Sprache, große Berührungsziele.

---

## 1 — Stack (verbindlich)

Next.js 15 App Router · TypeScript strict · Tailwind CSS · shadcn/ui · next-intl · Supabase (Postgres, pgvector, Auth, Storage, Edge Functions, pg_cron) · Serwist für PWA · Zod für jede Validierung · Remotion für Video (erst AP-17) · Deployment Vercel EU + Supabase eu-central-1.

Server Components als Default. Keine Secrets im Client. LLM-Aufrufe ausschließlich in Edge Functions. Monorepo mit pnpm.

---

## 2 — Grundregeln

Diese Regeln gelten für jede Zeile Code und stehen über allen Detailanforderungen.

1. **Kammer-agnostisch.** Beruf, Prüfungsstruktur, Punkteverteilung, Bewertungsschlüssel, Prüfungstermine und Hilfsmittellisten sind Daten, kein Code. IHK und Handwerkskammer müssen beide abbildbar sein.
2. **Mandantenfähig.** Jede Tabelle mit Nutzerdaten hängt an `traeger_id`.
3. **Offline-First.** Die App bleibt ohne Netz nutzbar.
4. **Prüfungsinhalte sind immer Deutsch.** Übersetzungen existieren nur als Zusatzhilfe unter dem Original, nie als Ersatz.
5. **KI-Bewertung ist Lernfeedback, keine Prüfungsleistung.** Überall sichtbar kennzeichnen.
6. **Farbe ist nie der einzige Informationsträger.** Jeder Status hat zusätzlich Symbol und Textlabel.
7. **Kernpool und Erweiterungspool sind getrennt.** Nur Kernfragen zählen für Fortschritt und Abschluss. Kernfragen erfordern immer manuelle Ausbilderfreigabe.
8. **Faktenbelegpflicht.** Jede Frage mit Zahlenwert, Formel, Grenzwert oder Normbezug braucht eine Fundstelle aus Tabellenbuch, Rahmenlehrplan oder Trägerskript. Web-Recherche ist für solche Werte nicht zugelassen.
9. **Maßstab ist das Tabellenbuch, nicht der Normvolltext.** Normen werden nur als Metadaten geführt. Keine Normtexte in die App.
10. **Zulassung ist keine App-Funktion.** Der Campus zeigt „Prüfungsreife" und erzeugt eine Empfehlung an den Ausbilder. Nirgends darf der Eindruck entstehen, die App entscheide über die Zulassung zur Kammerprüfung.
11. **Gates blockieren keine Inhalte.** Ein nicht erreichtes Gate ist ein sichtbares Ziel, kein Riegel. Jeder darf jederzeit jedes Topic öffnen.
12. **Videounterricht ist ein Feature-Flag**, standardmäßig aus. Datenmodell und Bucket werden vorbereitet, die Oberfläche nicht gebaut.
13. **Kammerdaten sind Konfiguration.** Erstbelegung: IHK Aachen.
14. **Die KI formuliert Berichte, sie erfindet sie nicht.** Im Ausbildungsnachweis darf das Modell ausschließlich aus Eingaben des Teilnehmers formulieren.
15. **Signierte Nachweise sind gesperrt.** Änderungen nur über dokumentierten Korrektureintrag mit Begründung.
16. **Keine Reproduktion geschützter Prüfungsaufgaben.** Weder von Kammern noch von Prüfungsverlagen, auch nicht paraphrasiert.
17. **Vollständig lokalisiert.** Keine englischen Bedienelemente in der deutschen Oberfläche.

---

## 3 — Datenmodell

Postgres, UUID-Primärschlüssel, `created_at` und `updated_at` überall, **RLS auf jeder Tabelle explizit ausformuliert**.

### Mandant und Nutzer
- `traeger` — id, name, slug, logo_url, einstellungen jsonb (mastery_streak, spacing_stunden, freitext_schwellwert, monatsbudget_eur, flag_video, flag_berichtsheft)
- `profiles` — id (= auth.users.id), traeger_id, benutzername unique, rolle enum('teilnehmer','ausbilder','verwaltung','admin'), vorname, nachname, sprache, muss_passwort_aendern bool, aktiv bool, letzter_login
- `kohorten` — id, traeger_id, beruf_id, bezeichnung, start_datum, end_datum, beitrittscode, zwischenpruefung_am date, abschlusspruefung_am date
- `kohorten_mitglieder` — kohorte_id, user_id
- `ausbilder_zuweisungen` — ausbilder_id, teilnehmer_id, zugewiesen_am

### Kammer und Beruf
- `kammern` — id, name, typ enum('IHK','HWK','sonstige'), anschrift, kontakt jsonb, berichtsheft_vorgaben jsonb, hilfsmittel jsonb, pdf_vorlage
- `bewertungsschluessel` — id, name, stufen jsonb [{von,bis,note,bezeichnung}], bestehensgrenze
- `pruefungstermine` — id, kammer_id, beruf_id, art enum('zwischen','abschluss'), termin date, anmeldefrist date, hinweis
- `berufe` — id, traeger_id, kammer_id, bezeichnung, dauer_monate, bewertungsschluessel_id, aktiv
- `ausbildungsphasen` — id, beruf_id, bezeichnung, reihenfolge, zielpruefung enum('zwischenpruefung','abschlusspruefung'), mindest_wochenpruefungen smallint
- `pruefungsbereiche` — id, beruf_id, phase_id, bezeichnung, gewichtung_prozent, pruefungsdauer_minuten, reihenfolge
- `themen` — id, pruefungsbereich_id, **parent_id nullable (selbstreferenzierend)**, bezeichnung, reihenfolge

### Lerninhalte
- `lerneinheiten` — id, thema_id, titel, inhalt_mdx text, **abschnitte jsonb** (Titel, Inhalt, geschätzte Minuten je Abschnitt), lesedauer_minuten smallint, reihenfolge, status enum('entwurf','freigegeben'), quellenangaben jsonb, erstellt_von, geprueft_von
- `lerneinheiten_versionen` — id, lerneinheit_id, version int, inhalt_mdx, geaendert_von, created_at
- `lerneinheit_fortschritt` — user_id + lerneinheit_id, **abschnitt_index smallint**, gelesen_am, lesezeit_sekunden, wiederholt_am, bewertung smallint (Daumen hoch/runter)
- `glossar_begriffe` — id, beruf_id, begriff_de, uebersetzungen jsonb, erklaerung_de

### Fragen
- `fragen` — id, thema_id, typ enum('mc','freitext'), aufgabenstellung, bild_url, schwierigkeit 1–3, status enum('entwurf','verifiziert','freigegeben','gesperrt','pruefung_noetig'), **kern bool default false**, ki_generiert bool, **quellenstufe smallint 1–4**, **tabellenbuch_fundstelle jsonb** {verlag, auflage, seite, tabelle}, **enthaelt_zahlenwert bool**, quelldokument_id nullable, **embedding vector(1536)**, verifikation jsonb, fehlerquote numeric, bearbeitungen int, erstellt_von, geprueft_von, geprueft_am, normenstand_geprueft_am
- `antwortoptionen` — id, frage_id, text, ist_korrekt, erklaerung, reihenfolge
- `freitext_loesungen` — frage_id PK, musterloesung, bewertungsraster jsonb, max_punkte
- `fragen_uebersetzungen` — frage_id, sprache, aufgabenstellung, optionen jsonb, freigegeben bool
- `fragen_meldungen` — id, frage_id, user_id, grund enum('falsch','unverstaendlich','tippfehler','veraltet'), kommentar

### Lernfortschritt
- `versuche` — id, user_id, frage_id, pruefung_ergebnis_id nullable, antwort jsonb, antwort_sprache, ist_korrekt, erzielte_punkte numeric, ki_bewertung jsonb, ki_confidence numeric, dauer_sekunden
- `fragen_mastery` — user_id + frage_id PK, status enum('neu','einmal_richtig','falsch','abgeschlossen'), streak, **fehler_gesamt int**, richtig_gesamt int, letzter_versuch, naechste_faelligkeit
- `lernpunkte` — id, user_id, grund, punkte, referenz_id
- `achievements` — id, code, titel_key, beschreibung_key, bedingung jsonb, punkte
- `nutzer_achievements` — user_id, achievement_id, freigeschaltet_am
- `wochenberichte` — id, user_id, jahr, kalenderwoche, inhalt jsonb, merksaetze jsonb, gelesen bool

### Prüfungen
- `pruefungen` — id, kohorte_id, jahr, kalenderwoche, titel, freigabe_ab, freigabe_bis, dauer_minuten, status
- `pruefung_fragen` — pruefung_id, frage_id, position, punkte
- `pruefung_ergebnisse` — id, pruefung_id, user_id, mc_punkte, freitext_punkte, gesamtpunkte, note, bestanden, gestartet_am, abgegeben_am, versuch_nr
- `pruefungsreife` — id, user_id, phase_id, kriterien_erfuellt_am, ausbilder_bestaetigt_von, ausbilder_bestaetigt_am, kommentar

### Ausbildungsnachweis
- `nachweise` — id, user_id, kohorte_id, art enum('tag','woche','monat','fach'), zeitraum_von date, zeitraum_bis date, ausbildungsjahr smallint, inhalt jsonb (Tätigkeiten, Unterweisungen, Berufsschulthemen), rahmenplan_positionen text[], ki_formuliert bool, status enum('entwurf','eingereicht','signiert_teilnehmer','signiert_ausbilder','beanstandet')
- `nachweis_signaturen` — id, nachweis_id, user_id, rolle enum('teilnehmer','ausbilder'), signiert_am, hash
- `nachweis_korrekturen` — id, nachweis_id, geaendert_von, vorher jsonb, nachher jsonb, begruendung

### Qualität, Betrieb, Video
- `review_queue` — id, versuch_id nullable, frage_id nullable, grund enum('niedrige_confidence','einspruch','stichprobe','norm_veraltet','aehnlichkeit_zu_hoch','verifikation_fehlgeschlagen','fehlerquote_auffaellig','nutzermeldung'), status, ausbilder_id, korrigierte_punkte, kommentar
- `quelldokumente` — id, traeger_id, dateiname, storage_pfad, typ, rechte_bestaetigt bool, rechte_hinweis, hochgeladen_von
- `normen` — id, nummer, titel, ausgabedatum, status enum('gueltig','zurueckgezogen','ersetzt'), nachfolger_nummer, geprueft_am
- `frage_normen` — frage_id, norm_id, fundstelle
- `ki_aufrufe` — id, traeger_id, user_id, funktion, modell, input_tokens, output_tokens, kosten_eur numeric, latenz_ms, erfolg bool, fehlertext, request_id
- `audit_log` — id, akteur_id, aktion, ziel_typ, ziel_id, details jsonb, ip
- `videos` — id, thema_id, lerneinheit_id, titel, storage_pfad, dauer_sekunden, sprache_tonspur default 'de', status enum('skript_entwurf','skript_freigegeben','gerendert','veroeffentlicht'), remotion_composition, render_hash
- `video_skripte` — id, video_id, version int, szenen jsonb, erstellt_von_ki bool, geprueft_von, geprueft_am
- `video_untertitel` — video_id + sprache, vtt_inhalt, freigegeben bool

### RLS-Policies

Teilnehmer lesen und schreiben ausschließlich eigene `versuche`, `fragen_mastery`, `pruefung_ergebnisse`, `lerneinheit_fortschritt`, `nachweise`, `lernpunkte`, `wochenberichte`. Fragen und Lerneinheiten nur mit Status `freigegeben` und nur für Berufe der eigenen Kohorte. Ausbilder sehen ausschließlich Teilnehmer aus `ausbilder_zuweisungen`. Verwaltung sieht den eigenen Träger. Admin alles. `quelldokumente` niemals für Teilnehmer lesbar. Signierte `nachweise` sind für alle schreibgeschützt.

---

## 4 — Kernlogik

### 4.1 Mastery-Engine

Postgres-Funktion `verarbeite_versuch(user_id, frage_id, ist_korrekt)`:

- Erster Versuch: `neu` → `einmal_richtig` oder `falsch`
- Bei korrekter Antwort **Spacing-Sperre prüfen**: `streak` wird nur erhöht, wenn seit `letzter_versuch` mindestens `spacing_stunden` (Default 12) vergangen sind **oder** der Nutzer seither mindestens 20 andere Fragen bearbeitet hat. Andernfalls Versuch protokollieren, `streak` unverändert.
- `streak` erreicht 2 (konfigurierbar) → Status `abgeschlossen`
- Falsche Antwort: `streak = 0`, Status `falsch`, `fehler_gesamt + 1`
- Freitext gilt als korrekt bei `erzielte_punkte / max_punkte >= 0.75` (konfigurierbar)
- Lernpunkte buchen, Achievement-Bedingungen prüfen

Views: `v_fortschritt_thema`, `v_fortschritt_bereich`, `v_fortschritt_phase`, `v_fortschritt_beruf`, `v_wochenaktivitaet_nutzer`, `v_kohorten_uebersicht`.

### 4.2 Kaskadierende Abschlusslogik

| Ebene | Abgeschlossen, wenn |
|---|---|
| Lerneinheit | alle Abschnitte gelesen (Lesezeit plausibel) |
| Topic | Fachkunde gelesen **und** alle **Kernfragen** des Topics `abgeschlossen` |
| Fachgebiet | alle Topics abgeschlossen |
| Phase | alle Fachgebiete **und** `mindest_wochenpruefungen` mit ≥ 50 Punkten |
| Prüfungsreife | Phase abgeschlossen → Ausbilder erhält Empfehlung zur Bestätigung |

Lesezeit-Unterschreitung erzeugt einen Hinweis, **keine Sperre**. Die Fragen sind der eigentliche Nachweis.

`packages/core/fortschritt/` berechnet zusätzlich **genau eine** Fortsetzen-Empfehlung: das nächste sinnvolle Topic. Diese Regel gehört in die Logikschicht, nicht in die Oberfläche.

### 4.3 Wochenprüfung

**30 Multiple Choice + 15 Freitext**, 120 Minuten, pro Kohorte und Kalenderwoche freigeschaltet (Standard Mo 06:00 bis So 23:59).

Auswahl über `gewichtung_prozent` der Prüfungsbereiche: 50 % Fragen mit Status `einmal_richtig` oder `falsch`, 30 % aus den schwächsten Themen der Kohorte, 20 % neu. Nur Status `freigegeben`.

Punkte: MC gesamt 40, Freitext gesamt 60 (15 Aufgaben à 0–4 Rohpunkte), normalisiert auf 100.

Prüfungsmodus: Timer, kein Zwischenfeedback, Fragenübersicht mit Markierfunktion, Autosave alle 10 Sekunden in IndexedDB, Abgabe auch offline. Sprachumschaltung deaktiviert, Freitext nur Deutsch mit Hinweistext.

### 4.4 Bewertungsschlüssel

IHK-100-Punkte-Schlüssel als Datensatz in `bewertungsschluessel`:

| Punkte | Note | Bezeichnung |
|---|---|---|
| 100–92 | 1 | sehr gut |
| unter 92–81 | 2 | gut |
| unter 81–67 | 3 | befriedigend |
| unter 67–50 | 4 | ausreichend |
| unter 50–30 | 5 | mangelhaft |
| unter 30–0 | 6 | ungenügend |

Bestehensgrenze 50.

**Beruf Maschinen- und Anlagenführer, Schwerpunkt Metall- und Kunststofftechnik** (MaschFüAusbV):

| Prüfungsbereich | Gewicht | Dauer | Themen |
|---|---|---|---|
| Produktionstechnik | 50 % | 120 Min | technische Unterlagen, Werkstoffe, Werkzeuge, Funktion von Maschinen und Anlagen, Prüfverfahren und Prüfmittel, Fertigungstechniken |
| Produktionsplanung | 30 % | 60 Min | Arbeitsschritte, Qualitätssicherung, vorbeugende Instandhaltung, Produktionsanlagen, Übergabeprotokoll |
| Wirtschafts- und Sozialkunde | 20 % | 60 Min | allgemeine wirtschaftliche und gesellschaftliche Zusammenhänge |

Bestehensregel: In zwei Prüfungsbereichen mindestens ausreichend, im dritten kein ungenügend. Zwischenprüfung zu Beginn des zweiten Ausbildungsjahres.

Phasen: Phase 1 bis zur Zwischenprüfung (Inhalte des ersten Jahres), Phase 2 bis zur Abschlussprüfung.

---

## 5 — Edge Functions

Jede Function schreibt nach Abschluss einen Datensatz in `ki_aufrufe` mit Tokens, berechneten Kosten, Latenz und Request-ID. Vor jedem LLM-Aufruf Budgetprüfung gegen `traeger.einstellungen.monatsbudget_eur`: Abbruch bei Überschreitung, Warnung an den Admin bei 80 %.

### `bewerte_freitext`
Eingabe: Aufgabenstellung, Musterlösung, Bewertungsraster, Antwort, Antwortsprache, Nutzersprache. Erzwungenes JSON:
```json
{ "kriterien_bewertung": [{"id":"k1","erfuellt":true,"punkte":1,"begruendung":"…"}],
  "erzielte_punkte": 3, "max_punkte": 4,
  "staerken": "…", "luecken": "…", "verbesserungshinweis": "…",
  "deutsche_musterformulierung": "…", "confidence": 0.85 }
```
Systemprompt-Regeln: ausschließlich nach Raster bewerten; sinngleiche Formulierungen und hinterlegte Synonyme akzeptieren; Rechtschreibung nicht bestrafen, außer ein Fachbegriff ist erkennbar falsch verstanden; nicht auf Deutsch verfasste Antworten inhaltlich bewerten und zusätzlich die deutsche Musterformulierung liefern; Feedback in einfacher, ermutigender Sprache in der Nutzersprache; bei Unsicherheit Confidence senken statt raten.

Confidence < 0,7 oder Punktzahl an der Bestehensgrenze → `review_queue`. Zusätzlich 5 % Stichproben. Cache über Hash aus frage_id plus normalisierter Antwort.

### `generiere_fragen`
Eingabe: Thema, Anzahl (Batch bis 50), Typ, Schwierigkeit, Zielpool (`kern` oder `erweiterung`), optional `quelldokument_id`. Ausgabe immer Status `entwurf`.

Systemprompt: erzeuge ausschließlich eigenständig formulierte Aufgaben; reproduziere keine Original-Prüfungsaufgaben von Kammern oder Prüfungsverlagen. MC mit genau vier Optionen, davon eine korrekt, Distraktoren müssen plausible Fehlvorstellungen abbilden, zu jeder Option eine kurze Erklärung. Freitext immer mit Musterlösung und Bewertungsraster. Verpflichtende Felder je Frage: `quellenstufe`, `tabellenbuch_fundstelle`, `normbezuege`, `enthaelt_zahlenwert`.

**Quellenhierarchie, hart durchsetzen:** Stufe 1 Tabellenbuch mit Seitenangabe, Stufe 2 Ausbildungsordnung und Rahmenlehrplan, Stufe 3 hochgeladene Trägerskripte, Stufe 4 Web-Recherche. Enthält eine Frage Zahlenwert, Formel, Grenzwert oder Normbezug und stammt aus Stufe 4 oder hat keine Fundstelle: ablehnen, nie in den Kernpool.

Nachgelagert in dieser Reihenfolge:
1. **Dublettencheck** — Embedding erzeugen, Kosinus-Ähnlichkeit gegen Bestand desselben Themas. Über 0,92 verwerfen oder als Variante vorlegen.
2. **n-Gramm-Ähnlichkeit** gegen den Quelltext. Über Schwellwert → `review_queue`, Grund `aehnlichkeit_zu_hoch`.
3. **`verifiziere_frage`** aufrufen.

### `verifiziere_frage`
Separater, unabhängiger Modellaufruf ohne Kenntnis der Generierungsbegründung. Prüft: Ist die als korrekt markierte Antwort tatsächlich korrekt? Ist ein Distraktor ebenfalls vertretbar? Deckt sich der Zahlenwert mit der Fundstelle? Ist die Aufgabe eindeutig? Ausgabe JSON mit `bestaetigt` bool, `einwaende` array, `confidence`. Bei bestätigt und hoher Confidence → Status `verifiziert`, sonst `review_queue`, Grund `verifikation_fehlgeschlagen`.

**Freigabe:** Kernfragen immer manuell durch Ausbilder. Erweiterungspool geht von `verifiziert` automatisch auf `freigegeben`, mit 10 % Zufallsstichprobe in die Review-Queue.

### `generiere_pruefung`
Siehe 4.3.

### `pruefe_fragenqualitaet`
Nächtlicher Cron über den Erweiterungspool. Aktualisiert `bearbeitungen` und `fehlerquote`. Über 70 % Fehlerquote ab 25 Bearbeitungen: Status `gesperrt`, `review_queue` mit Grund `fehlerquote_auffaellig`. Ebenso ab drei Nutzermeldungen.

### `pruefe_normen`
Nächtlicher Cron. Extrahiert Normbezüge per Muster aus freigegebenen Fragen, gleicht gegen `normen` ab. Bei `zurueckgezogen` oder `ersetzt`: Frage auf `pruefung_noetig`, `review_queue` mit Nachfolgerhinweis. Zusätzlich Review-Flag für Fragen mit `normenstand_geprueft_am` älter als 12 Monate.

### `erzeuge_wochenbericht`
Cron sonntags 20:00, pro aktivem Teilnehmer. Aggregiert die Woche, ermittelt die drei schwächsten Themen, vergleicht mit der Vorwoche. LLM erzeugt in der Nutzersprache: Zusammenfassung, Verbesserungen, konkrete Empfehlung, **3 bis 5 kurze Merksätze zu tatsächlich falsch beantworteten Fragen**. Speichern in `wochenberichte`. Merksätze werden hier erzeugt, nicht bei App-Start.

### `uebersetze_frage` / `uebersetze_lerneinheit`
Erzeugt Übersetzungen in die sechs Zielsprachen, unfreigegeben bis Ausbilderbestätigung, dauerhaft gecacht. **Nur der Kernpool wird übersetzt.**

### `formuliere_nachweis`
Eingabe: Stichworte oder Diktattranskript des Teilnehmers, Berichtsart, Zeitraum. Ausgabe: sauber formulierter Berichtstext plus Vorschlag für die Zuordnung zu Positionen des Ausbildungsrahmenplans. **Regel: ausschließlich aus Eingaben des Teilnehmers formulieren, keine Tätigkeiten ergänzen oder erfinden.** Sichtbarer Hinweis in der Oberfläche.

### `berichtsheft_pdf`
Erzeugt den Gesamtexport als paginiertes, komprimiertes PDF für die Prüfungsanmeldung, Zielgröße unter 35 MB. Jedes Blatt trägt Name, Ausbildungsjahr und Berichtszeitraum.

### `nutzer_anlegen` / `admin_passwort_ruecksetzen`
Ausschließlich über Service-Role-Key in der Edge Function. Admin kann ein neues Temporärpasswort erzeugen, aber **kein bestehendes einsehen oder direkt setzen**. Jede Aktion ins `audit_log`.

### `erzeuge_videoskript` (AP-17)
Aus der Fachkunde-Lerneinheit ein Szenenskript erzeugen: Sprechtext, Bildanweisung, Dauer je Szene. Ausbilderfreigabe, dann Remotion-Render, TTS auf Deutsch, WebVTT-Untertitel in sechs Sprachen direkt aus dem Skript.

---

## 6 — Oberfläche

### 6.1 Mobile-Layout

Die Navigation ist eine **Tableiste am unteren Rand mit fünf Zielen**:

| Tab | Inhalt |
|---|---|
| **Start** | Begrüßung mit Name und Tageszeit, genau eine Fortsetzen-Karte, Wochenprüfungs-Kachel mit Restzeit, Wochenbericht, Merkkarte |
| **Lernen** | Ausbildungsgang → Phasen → Fachgebiete → Topics → Lerneinheiten → Fragen |
| **Prüfung** | Wochenprüfung, Ergebnisverlauf, Prüfungsreife, Termine |
| **Bericht** | Ausbildungsnachweis, nur sichtbar wenn `flag_berichtsheft` aktiv |
| **Mehr** | Kalender, Fortschritt und Abzeichen, Glossar, Profil, Sprache, Hilfe |

Kopfzeile: Trägername, Gesamtfortschrittsring mit Prozentzahl, Profilzugang.

### 6.2 Teilnehmerbildschirme

1. **Login** — Benutzername und Passwort, bei `muss_passwort_aendern` erzwungener Wechsel
2. **Sprachwahl und Kohortenbeitritt** per Code
3. **Start** — siehe Tabelle. Genau **eine** Fortsetzen-Karte mit Ring, Topic-Name, „Als Nächstes: …", Restzeit. Nicht mehr.
4. **Lernen Übersicht** — Kopfbereich mit Ausbildungsgang und Gesamtring, Phasen als aufklappbare Abschnitte mit Datumsspanne, Fachgebiete als volle Karten mit Ring, Fortschritt, offenen Kernfragen und Restzeit
5. **Topic** — drei Abschnitte untereinander mit eigenem Fortschritt: Fachkunde lesen (Lerneinheiten mit Minutenangabe), Fragen üben, Unterricht (ausgeblendet solange Video-Flag aus)
6. **Lerneinheit lesen** — Kapitel-Fortschrittsleiste unter der Kopfzeile mit antippbarer Auswahlliste, MDX-Inhalt über volle Breite, Abbildungen unter dem zugehörigen Schritt, Quellenangaben am Ende. **Feste Fußleiste**: Daumen hoch, Daumen runter, grüner Knopf „Weiter"
7. **Fragenliste** — Statusfilter als waagerecht scrollbare Chips mit Zählern (Alle · Neu · Einmal richtig · Falsch · Abgeschlossen), darunter farbcodierte Karten
8. **Fragenkarte** — große Schrift, MC als Buttons, Freitext mit Textfeld und Mikrofonknopf, Übersetzungshilfe unter dem deutschen Original einblendbar, Glossarbegriffe antippbar, sofortiges Feedback mit Erklärung, Melde-Knopf, bei Erweiterungsfragen dezenter Hinweis „Zusatzübung"
9. **Prüfungsmodus** — Timer, Frage x von 45, Übersicht, Markierfunktion, Abgabedialog
10. **Ergebnisseite** — Punkte, Note, Bestehensstatus, Aufschlüsselung nach Prüfungsbereich, drei schwächste Themen mit Direktabsprung
11. **Prüfungsreife** — Kriterienliste mit Häkchen, **Hinweis auf die Rolle der Kammer**, Status der Ausbilderempfehlung
12. **Statistik** — Notenverlauf, Mastery-Entwicklung, Bereichsvergleich, Aktivitätsheatmap
13. **Achievements und Fortschritt in Prozent**
14. **Berichtsheft** — Kalenderansicht mit Lückenanzeige, Eintragsformular mit Diktat und KI-Formulierungshilfe, Signatur, PDF-Export
15. **Profil** — Sprache, Schriftgröße, Dunkelmodus, Erinnerungen, **Übersicht welche Daten der Ausbilder sieht**, Datenexport, Passwort ändern

### 6.3 Ausbilder (Tablet und Desktop)

16. **Cockpit** — Tabelle der zugewiesenen Teilnehmer: Fortschritt %, Lernpunkte, Fragen pro Woche, Richtig-Falsch-Quote, Prüfungen, letzte Note, aktive Lerntage, letzte Aktivität, **Risikomarkierung** bei unter 3 aktiven Tagen pro Woche oder zwei nicht bestandenen Prüfungen in Folge
17. **Teilnehmer-Detail** — Fortschritt je Bereich und Thema, Fehlerschwerpunkte, alle Prüfungen, Heatmap
18. **Kohortenansicht** — Durchschnitte, Themen mit der höchsten gruppenweiten Fehlerquote
19. **Fragenverwaltung** — Generator im Batchbetrieb, Entwurfs- und Verifikationsliste, Inline-Bearbeitung, Kernpool-Markierung, Massenfreigabe, Anzeige von Quellenstufe und Fundstelle, Dublettenvorschläge
20. **Lerneinheiten-Editor** — MDX mit Vorschau, Versionshistorie, Freigabe
21. **Review-Queue** — KI-Bewertungen, Einsprüche, Normwarnungen, Ähnlichkeits- und Fehlerquotenwarnungen
22. **Materialupload** — Datei, Quellenangabe, **Pflicht-Checkbox Nutzungsrechte bestätigt**
23. **Berichtsheft-Prüfung** — offene Zeiträume, monatliche Prüfpflicht, Signatur, Beanstandung
24. **Prüfungsplanung und Export** (CSV, PDF)

### 6.4 Admin

25. **Nutzerverwaltung** — anlegen mit Benutzername und generiertem Initialpasswort, druckbare Kohortenliste, Passwort zurücksetzen, deaktivieren, löschen mit Anonymisierung, Zuweisungen
26. **LLM-Monitoring** — Kosten pro Tag, Woche, Monat, nach Funktion, Träger, Kohorte, Top-20-Nutzer; Budgetgrenzen; Cache-Trefferquote; Fehlerquote und p95-Latenz
27. **Audit-Log** mit Filter
28. **Systemeinstellungen** — Mastery-Streak, Spacing-Stunden, Schwellwerte, Bewertungsschlüssel, Kammerdaten, Normentabelle, Feature-Flags

### 6.5 Öffentlich

29. **Landingpage** — Trägerauftritt, Nutzenerklärung, Anmeldeeinstieg, Impressum, Datenschutz

---

## 7 — Design

Sachlich und ruhig, hoher Kontrast, kein verspieltes Gamification-Design. Zielgruppe sind Erwachsene in einer beruflichen Umbruchsituation.

- Fortschritt als schlichte Ringe und Balken, Abzeichen als reduzierte Symbole
- **Keine Konfetti-Animationen, keine öffentlichen Ranglisten zwischen Teilnehmenden**
- Neutrale Grundfläche, eine Akzentfarbe für Primäraktionen, Grün und Rot ausschließlich für Lernstatus
- Statusfarben der Fragenkarten: neutral-grau (neu), hellgrün (einmal richtig), hellrot (falsch), kräftiges Grün (abgeschlossen) — **immer zusätzlich mit Symbol (○ ◐ ✕ ✓) und Textlabel**, plus Fehler-Badge mit Zähler wenn `fehler_gesamt > 0`
- Zeitangaben auf jeder Ebene: „Lerneinheit · 32 Min", „Fachgebiet · 4 Std 40 Min"
- **Primäraktionen im unteren Bildschirmdrittel**, Weiter-Knopf klebt unten rechts
- Eine Spalte, Zweispaltigkeit erst ab Tablet
- Berührungsziele mindestens 48 Pixel, Abstand mindestens 8 Pixel
- Kein waagerechtes Scrollen außer bei Filter-Chips
- **WCAG 2.1 AA:** Kontrast mindestens 4.5:1, sichtbarer Fokus, vollständige Tastaturbedienung, korrekte ARIA-Labels, Farbe nie alleiniger Informationsträger

---

## 8 — Internationalisierung

next-intl, Sprachen: de, en, fr, ar, uk, tr. Vollständige RTL-Unterstützung für Arabisch (`dir="rtl"`, logische CSS-Eigenschaften, gespiegeltes Layout).

Übersetzt werden: Oberfläche, KI-Feedback, Wochenbericht, Untertitel. **Prüfungsinhalte und Fachkunde bleiben Deutsch**; Übersetzungen erscheinen ausschließlich zusätzlich unter dem Original. Im Lernmodus dürfen Freitextantworten in der Muttersprache verfasst werden, im Prüfungsmodus nicht. Zahlen, Daten und Noten nach deutscher Konvention.

---

## 9 — PWA und Offline

Manifest, Standalone-Display, Icons. Service Worker: App-Shell precached, aktuelle Prüfungswoche und alle Fragen mit Status `einmal_richtig` oder `falsch` vorgeladen, Fachkunde des aktuellen Topics vorgeladen. Antworten offline in IndexedDB, Background Sync bei Verbindung. Sichtbarer Offline-Indikator, Update-Hinweis bei neuer Version.

---

## 10 — Compliance

- Datenschutzerklärung und Impressum als Seiten, cookiefrei bzw. nur technisch notwendige Speicherung
- Datenexport und Kontolöschung im Profil
- Bei jeder KI-Bewertung: „Automatisches Lernfeedback — keine offizielle Prüfungsbewertung."
- Bei der KI-Formulierungshilfe im Berichtsheft: „KI-Formulierungshilfe — Inhalte stammen von dir."
- Auf der Prüfungsreife-Seite: Hinweis, dass die Zulassung durch die Kammer erfolgt
- Beim Materialupload Rechtebestätigung erzwingen
- Im Teilnehmerprofil eine Seite, die auflistet, welche Daten der Ausbilder einsehen kann
- Hosting ausschließlich EU, LLM-Anbieter mit AVV und ohne Trainingsnutzung

---

## 11 — Arbeitspakete

Jedes Paket nennt Branch, Dateihoheit und Abnahmekriterien. Pakete derselben Welle sind über Git-Worktrees parallelisierbar. **Details und Regeln je Paket stehen in `AGENTS.md` im Repository.**

### Welle 0 — streng seriell, muss vor jeder Parallelarbeit in `main` sein

| AP | Branch | Hoheit | Fertig, wenn |
|---|---|---|---|
| **00** Repo und Werkzeugkette | `chore/00-setup` | Wurzel, `.github/`, `packages/config/` | Ein leerer PR läuft grün durch CI und erzeugt eine Vercel-Preview |
| **01** Datenmodell | `feat/01-datenmodell` | `supabase/migrations/`, `supabase/seed/`, `packages/db/`, `docs/DATENMODELL.md` | Migration läuft auf leerer DB durch, RLS mit Testnutzern je Rolle nachweislich wirksam, TS-Typen generiert, MAF-Seed geladen |
| **02** Design-System und i18n | `feat/02-designsystem` | `packages/ui/`, `messages/`, Root-Layout | Musterseite zeigt alle Basiskomponenten in Deutsch und Arabisch korrekt, Kontraste gegen WCAG 2.1 AA geprüft |

### Welle 1 — parallel

| AP | Branch | Hoheit | Inhalt |
|---|---|---|---|
| **03** Auth und Rollen | `feat/03-auth` | `app/[locale]/(auth)/`, `functions/nutzer-anlegen/`, Middleware | Benutzername-Login, Passwortzwang, Rollenweichen, Kohortencode |
| **04** Landingpage und Shell | `feat/04-shell` | `app/[locale]/(marketing)/`, `components/shell/` | Landingpage, Tableiste mit fünf Zielen, Kopfzeile mit Gesamtring, Begrüßung nach Tageszeit |
| **05** Fachkunde | `feat/05-fachkunde` | `app/[locale]/campus/topic/`, `packages/ui/mdx/`, `content/fachkunde/` | MDX-Renderer, Abschnittsebene, Kapitelnavigation, Lesezeit, Daumen-Rückmeldung, Editor mit Versionshistorie, MDX-Export ins Repo |
| **06** Lernmodus | `feat/06-lernmodus` | `app/[locale]/campus/lernen/`, `packages/core/mastery/` | Baumnavigation, Statusfilter-Chips, farbcodierte Karten mit Fehler-Badge, Fragenkarte, Diktat, Melde-Knopf, Mastery-Engine mit Spacing |
| **07** Administration | `feat/07-admin` | `app/[locale]/admin/`, `functions/admin-*/` | Nutzerverwaltung, Initialpasswörter, Zuweisungen, Audit-Log |

### Welle 2 — parallel

| AP | Branch | Hoheit |
|---|---|---|
| **08** Wochenprüfung | `feat/08-pruefung` | `app/[locale]/campus/pruefung/`, `packages/core/bewertung/`, `functions/generiere-pruefung/` |
| **09** KI-Freitextbewertung | `feat/09-ki-bewertung` | `functions/bewerte-freitext/`, `app/[locale]/ausbilder/review/` |
| **10** Fortschritt, Gates, Score | `feat/10-fortschritt` | `packages/core/fortschritt/`, `app/[locale]/campus/fortschritt/` |
| **11** Ausbilder-Cockpit | `feat/11-cockpit` | `app/[locale]/ausbilder/` |

### Welle 3 — parallel

| AP | Branch | Hoheit |
|---|---|---|
| **12** Fragen- und Inhaltsproduktion | `feat/12-generator` | `functions/generiere-fragen/`, `functions/verifiziere-frage/`, `app/[locale]/ausbilder/fragen/` |
| **13** Wochenbericht und Merkkarten | `feat/13-wochenbericht` | `functions/erzeuge-wochenbericht/`, `components/dashboard/` |
| **14** Mehrsprachigkeit Vollausbau | `feat/14-i18n` | `messages/`, `functions/uebersetze-*/`, Übersetzungshilfe |
| **15** PWA, Offline, Barrierefreiheit | `feat/15-pwa` | `service-worker/`, Manifest, Offline-Schicht |
| **16** Betriebsüberwachung | `feat/16-monitoring` | `app/[locale]/admin/monitoring/` |
| **18** Ausbildungsnachweis | `feat/18-berichtsheft` | `app/[locale]/campus/berichtsheft/`, `app/[locale]/ausbilder/berichtsheft/`, `packages/core/nachweis/`, `functions/berichtsheft-pdf/` |

### Später

| AP | Branch | Vorbedingung |
|---|---|---|
| **17** Erklärvideos (Remotion) | `feat/17-video` | AP-05, AP-14, AP-16 abgeschlossen; Hostingentscheidung getroffen |

---

## 12 — Lieferumfang

Vollständiges Repository mit: Supabase-Migrations inklusive aller RLS-Policies und Cron-Jobs, Seed mit dem Beruf Maschinen- und Anlagenführer (3 Prüfungsbereiche, alle Themen nach MaschFüAusbV, 70 Fragen aus `MAF_Fragenpool_Charge1.json`), allen Edge Functions, allen Bildschirmen, Übersetzungsdateien für sechs Sprachen, PWA-Konfiguration, `.env.example`, `README.md`, `AGENTS.md`, `docs/`.

---

## 13 — Reihenfolge für die Umsetzung

1. Datenbankschema, RLS-Policies, Seed
2. Auth mit Benutzername, Rollen, erzwungener Passwortwechsel, Admin-Nutzerverwaltung
3. Navigation, Campus-Struktur, Fachkunde-Renderer mit Lesefortschritt
4. Fragenliste mit Statusfiltern und Farbcodierung, Mastery-Engine
5. Wochenprüfung, Bewertung, Kammerschlüssel
6. KI-Freitextbewertung, Review-Queue, `ki_aufrufe`-Protokollierung
7. Kaskadierende Abschlusslogik bis Prüfungsreife, Lernpunkte, Achievements
8. Ausbilder-Cockpit und Kohortenansicht
9. Ausbildungsnachweis
10. Fragengenerator mit Quellenhierarchie, Verifier, Dublettencheck, Materialupload, Normen-Metadaten. **Erst 300 Kernfragen als Pilotcharge, Verifikations-Trefferquote messen, dann hochfahren**
11. Wochenbericht und Merkkarten
12. Internationalisierung inklusive RTL und Übersetzungshilfe
13. Admin-Monitoring, Audit-Log, Budgetgrenzen
14. PWA, Offline, Barrierefreiheits-Feinschliff

Nach jedem Schritt anhalten und Rückmeldung einholen.
