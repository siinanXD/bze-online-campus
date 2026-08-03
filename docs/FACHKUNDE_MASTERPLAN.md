# Fachkunde-Masterplan

Stand: 2026-08-01. Dieser Masterplan deckt Welle 0 bis Welle 3 fuer den Ausbau der Fachkunde "Maschinen- und Anlagenfuehrer/-in - Schwerpunkt Metall- und Kunststofftechnik" ab und fuehrt Welle 4 als naechstes Arbeitspaket. Alle Inhalte bleiben Entwurf, bis eine fachliche Freigabe erfolgt.

## 1. Welle 0: Bestandsaufnahme

### Analysierte Dateien und wiederverwendbare Loesungen

| Bereich | Gepruefte Artefakte | Befund fuer die Fachkunde |
|---|---|---|
| Produkt und Regeln | `README.md`, `CONTRIBUTING.md`, `docs/SPEC.md` | Mobile-first, Deutsch als Pruefungsquelle, keine Zahlenwerte ohne Fundstelle, keine IHK/PAL-Originalaufgaben, Gates blockieren nicht. |
| Architektur | `docs/ARCHITEKTUR.md`, ADRs `0001` bis `0003` | Fachlogik bleibt in `packages/core`; Next.js App Router mit Server Components; Supabase RLS ist primaere Sicherheitsschicht; PWA ist handgeschrieben. |
| Datenmodell | `docs/DATENMODELL.md`, `supabase/migrations/*.sql` | `lerneinheiten`, Versionen, Abschnittsfortschritt, `glossar_begriffe`, Fragen, Mastery, Review-Queue und Content-Metadaten existieren. Content-Grundmodell fuehrt `content_elemente`, `lernziele`, `content_quellen`, `content_quizze` additiv ein. |
| Fachkunde | `content/fachkunde/*.mdx`, `packages/ui/mdx/*`, `app/[locale]/campus/topic/**` | Bestehende MDX-Inhalte sind gut als Demo-/Fallback geeignet, aber noch nicht reich genug fuer Story, Begriffe, Formeln, Visuals und Interaktionen je Einheit. |
| Admin-Content | `app/[locale]/admin/content/**`, `packages/core/content/**` | Generator, Qualitaetspruefung, Wissensdatenbank und Reviewstatus sind vorhanden und sollen fuer spaetere Autoren-Workflows genutzt werden. |
| Designsystem | `docs/DESIGN.md`, `app/globals.css`, `tailwind.config.ts`, `packages/ui/src/**` | Tokens, Cards, Buttons, StatusBadge, Chip, ProgressRing, Tabellen, Zustaende und MDX-Komponenten sind wiederverwendbar. Neue Lernkomponenten gehoeren nach `packages/ui`, interaktive Fachlogik nach `packages/core`. |
| Tests | `tests/unit`, `tests/integration`, `tests/e2e` | `node:test` ist Standard. Neue Domain-Regeln brauchen Unit-Tests; DB-/Route-Flows spaeter Integration/E2E. |

### Lueckenanalyse

| Luecke | Bedeutung | Geplanter Umgang |
|---|---|---|
| Vier-Kapitel-Fachkundestruktur fehlt als explizite Planung | Bestehende IHK-Pruefungsbereiche sind nicht identisch mit der didaktischen Ausbildungsreise. | Kapitel als didaktische Ebene in Planungsdaten und spaeter additive Zuordnung zu `themen`/`content_elemente`. |
| Lerneinheiten sind aktuell MDX-fokussiert | Story, einfache Erklaerung, Fachsprache, Praxisbeispiel, Begriffe, Formeln, Visuals und Quiz sind nicht strukturiert validiert. | Strukturierte Fachkunde-Schemas in `@bze/core/fachkunde`; spaeter Import in vorhandene Tabellen statt Parallelmodell. |
| Formelsammlung fehlt als eigener Fachcontent | Rechenaufgaben existieren, aber kein zentrales Formelobjekt mit Umstellungen, Einheiten und Fehlerhinweisen. | Additive Formel-Registry planen; im Vertical Slice zunaechst als `content_elemente` + Domain-Schema vorbereiten. |
| Glossar ist minimal | `glossar_begriffe` enthaelt noch nicht alle geforderten Metadaten und Verknuepfungen. | Glossar additiv erweitern oder durch `content_elemente`/Join-Tabellen ergaenzen; keine bestehende Tabelle ersetzen. |
| Visual- und Figma-Referenzen fehlen | Illustrationen sind noch keine systematischen Lernobjekte. | Visual-Registry planen; Text nicht in Bilddateien einbrennen, Labels im Frontend rendern. |
| Interaktive Fachkunde fehlt | Messschieber, Toleranzfeld, Formeltrainer und Fehlerdiagnose existieren noch nicht. | Vertical Slice "Messschieber und Toleranzen" zuerst, danach Muster wiederverwenden. |
| Fachliche Quellen sind lueckenhaft | Tabellenbuchseiten, Ausbilderfreigaben und betriebliche Vorgaben sind offen. | In Matrix alle Zahlen-/Normthemen mit `Quelle offen` oder konkreter Quellenart markieren; keine Zahlenwerte erfinden. |

### Risikoanalyse

| Risiko | Auswirkung | Gegenmassnahme |
|---|---|---|
| Fachlich falsche Zahlenwerte | Lernende praegen falsche Pruefungswerte ein. | Zahlenwerte nur aus Tabellenbuch, Zeichnung, Datenblatt, Betriebsanweisung oder freigegebener Quelle. |
| Zu grosse Einheiten | Mobile Nutzung leidet, Fortschritt wird unklar. | 7 bis 10 Minuten je Einheit, grosse Themen strikt splitten. |
| Parallelmodell neben vorhandener Plattform | Doppelpflege, RLS-Umgehungen, Offline-Luecken. | Bestehende `lerneinheiten`, `content_elemente`, `fragen`, `fragen_mastery` und `lerneinheit_fortschritt` nutzen. |
| Figma-Bilder mit eingebranntem Text | Schlechte i18n und Accessibility. | Technische SVG/Illustrationen textarm; Beschriftungen als Frontend-Overlays. |
| Gamification wirkt kindlich | Zielgruppe verliert Vertrauen. | Fortschrittspfad als Ausbildungsreise, keine Dark Patterns, keine Ranglisten. |

## 2. Welle 1: Zielarchitektur

### Content-Schnitt

Die Fachkunde wird als Kombination aus bestehenden Tabellen und neuen Domain-Schemas geplant:

| Fachkunde-Objekt | Zielablage | Begruendung |
|---|---|---|
| Lerneinheit | `lerneinheiten` + `lerneinheiten_versionen`; Planungsvalidierung in `@bze/core/fachkunde` | Bestehender Lesefortschritt und MDX-Renderer bleiben nutzbar. |
| Strukturierte Bausteine | `content_elemente.inhalt` fuer Story, einfache Erklaerung, Praxisfall, Quiz, Rechenaufgabe | Additive Content-Registry existiert und hat RLS/Reviewstatus. |
| Fachbegriffe | bestehendes `glossar_begriffe`, spaeter additive Metadaten/Join-Tabellen | Zentrale Wiederverwendung statt Duplikate in MDX. |
| Formeln | neue Formel-Registry spaeter additiv; im Slice zunaechst Domain-Schema + Content-Element | Formeln brauchen Einheiten, Umstellungen und typische Fehler. |
| Visuals | neue Visual-Registry spaeter additiv; Referenz auf Figma/Asset/Alt-Text | Offline, Accessibility und Freigabe muessen planbar sein. |
| Wissenscheck | bestehende `fragen`, `antwortoptionen`, `freitext_loesungen`, `content_quizze` | Mastery bleibt zentrale Lernlogik. |
| Quellen | `content_quellen`, `content_element_quellen`, `quellenangaben` in `lerneinheiten` | Fundstellen und Reviewstatus bleiben nachvollziehbar. |

### Geplante Fachkunde-Schemas

Die in `@bze/core/fachkunde` vorbereiteten Planungsobjekte decken diese Pflichtfelder ab:

- ID, Kapitel, Themenbereich, Titel, Kurzbeschreibung
- Voraussetzungen, Lernziele, Fachbegriffe, Formeln
- Visuals und Interaktionen mit didaktischer Beschreibung
- Lesedauer, Schwierigkeit, Pruefungsrelevanz, Wissensstufen
- Quellenart, Fundstelle und Flag `belastbarFuerZahlenwerte`
- Reviewstatus und fachliche Freigabe

Diese Schemas sind bewusst nicht als Migration umgesetzt. Die naechste Migration sollte erst entstehen, wenn der Vertical Slice zeigt, welche Felder wirklich relational sein muessen.

## 3. Vier-Kapitel-Themenbaum

1. Die Welt der Maschinen kennenlernen
   - Berufsrolle, Produktionsbetrieb, Sicherheit, Umwelt und Gefahrstoffe
   - technische Sprache, Zeichnung, Arbeitsplan und Stueckliste
   - SI-Einheiten, Messen, Pruefen, Kalibrieren
   - Werkstoffgrundlagen Metall und Kunststoff
   - grundlegende Maschinenelemente und Antriebe

2. Aus Material wird ein Produkt
   - Fertigungsgrundlagen und Prozessgroessen
   - Metallbearbeitung: Trennen, Spanen, Umformen, Fuegen, Giessen
   - Kunststoffverarbeitung: Spritzgiessen, Extrusion, Blasformen, Thermoformen
   - Produktionsvorbereitung, Ruesten, Freigabe, Wechsel, Schichtuebergabe

3. Qualitaet sichern und Maschinen beherrschen
   - Qualitaetssicherung, Pruefplanung, Statistik und Prozessfaehigkeit
   - Fehlerbilder Metall und Kunststoff
   - Steuerung, Sensorik, Aktorik, SPS-Grundlagen
   - Pneumatik, Hydraulik, Instandhaltung und Fehlersuche

4. Vom Maschinenfuehrer zum Pruefungsprofi
   - Produktionsplanung, Bestandslogik, Lean-Grundlagen, OEE
   - technische Mathematik und Formeln
   - Wirtschafts- und Sozialkunde
   - Pruefungsstrategie, Mini-Pruefungen, Wiederholung und Simulation

## 4. Content-Matrix

Kurznotation: `V` = Voraussetzung, `Z` = Lernziel, `BF` = Fachbegriffe, `F` = Formeln, `VI` = Visual/Interaktion, `Q` = Quellenart, `S/Fg` = Status/Freigabe. Alle Einheiten sind 7 bis 10 Minuten geplant, Status `Entwurf`, Freigabe `offen`.

| ID | Kapitel | Bereich | Titel | V | Z | BF | F | VI | Min | Schw. | Rel. | Wissen | Q | S/Fg |
|---|---|---|---|---|---|---|---|---|---:|---|---|---|---|---|
| FK-1-BER-001 | 1 | Berufsrolle | Erster Tag in der Produktion | keine | Betrieb sicher einordnen | Betrieb, Linie, Auftrag | - | Produktionskarte/Hotspots | 8 | G | hoch | verstehen | Rahmenlehrplan | Entwurf/offen |
| FK-1-BER-002 | 1 | Berufsrolle | Aufgaben des Maschinenfuehrers | 001 | Verantwortung beschreiben | Ruesten, Bedienen, Pruefen | - | Rollenrad/Quiz | 8 | G | hoch | verstehen | Rahmenlehrplan | Entwurf/offen |
| FK-1-BER-003 | 1 | Berufsrolle | Verantwortung bei Stoerungen | 002 | Meldewege kennen | Stoerung, Sperrung, Freigabe | - | Ablaufkarte/Entscheidung | 8 | G | hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-1-BER-004 | 1 | Berufsrolle | Produktionsauftrag lesen | 002 | Auftragsdaten finden | Auftrag, Los, Termin | - | Auftragsblatt/Chips | 8 | G | hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-1-BER-005 | 1 | Berufsrolle | Produktionsablauf verstehen | 004 | Ablauf erklaeren | Materialfluss, Arbeitsplatz | - | Prozesspfeile/Sortieren | 8 | G | hoch | verstehen | Rahmenlehrplan | Entwurf/offen |
| FK-1-BER-006 | 1 | Berufsrolle | Schichtbeginn vorbereiten | 005 | Check vor Start nutzen | Schicht, Uebergabe, Checkliste | - | Checkliste/Abhaken | 8 | G | mittel | anwenden | Traegerskript | Entwurf/offen |
| FK-1-BER-007 | 1 | Berufsrolle | Ordnung am Arbeitsplatz | 006 | Ordnung als Sicherheit verstehen | 5S, Werkzeugplatz | - | Vorher-Nachher/Hotspots | 8 | G | mittel | anwenden | Traegerskript | Entwurf/offen |
| FK-1-BER-008 | 1 | Berufsrolle | Produktionsdaten sauber notieren | 004 | Daten vollstaendig erfassen | Protokoll, Charge, Menge | Ausschussquote | Protokollkarte/Eingabe | 9 | G | hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-1-SIC-001 | 1 | Sicherheit | Gefahren in der Werkhalle erkennen | keine | Gefahrenstellen benennen | Quetschen, Schneiden, Einzug | - | Hallenbild/Hotspots | 8 | G | sehr_hoch | auswendig | Betriebsanweisung | Entwurf/offen |
| FK-1-SIC-002 | 1 | Sicherheit | Persoenliche Schutzausruestung | SIC-001 | PSA passend waehlen | Schutzbrille, Schuhe, Handschuh | - | PSA-Set/Zuordnen | 8 | G | sehr_hoch | anwenden | Betriebsanweisung | Entwurf/offen |
| FK-1-SIC-003 | 1 | Sicherheit | Sicherheitszeichen lesen | SIC-001 | Zeichen unterscheiden | Gebot, Verbot, Warnung | - | Icon-Set/Quiz | 8 | G | sehr_hoch | auswendig | Betriebsanweisung | Entwurf/offen |
| FK-1-SIC-004 | 1 | Sicherheit | Not-Halt richtig nutzen | SIC-001 | Not-Halt erklaeren | Not-Halt, Reset | - | Tasterdiagramm/Szenario | 8 | G | sehr_hoch | anwenden | Betriebsanweisung | Entwurf/offen |
| FK-1-SIC-005 | 1 | Sicherheit | Schutzeinrichtungen verstehen | SIC-004 | Schutzprinzip erklaeren | Schutzgitter, Lichtschranke | - | Maschine/Hotspots | 8 | G | sehr_hoch | verstehen | Betriebsanweisung | Entwurf/offen |
| FK-1-SIC-006 | 1 | Sicherheit | Einzugsstellen und Quetschstellen | SIC-005 | Gefaehrdung erkennen | Einzug, Quetschstelle | - | Gefahrstellen/Markieren | 8 | G | sehr_hoch | anwenden | Betriebsanweisung | Entwurf/offen |
| FK-1-SIC-007 | 1 | Sicherheit | Sicher gegen Wiedereinschalten | SIC-004 | LOTO-Grundidee kennen | Freischalten, Sichern | - | Ablauf/Check | 9 | M | sehr_hoch | anwenden | Betriebsanweisung | Entwurf/offen |
| FK-1-SIC-008 | 1 | Sicherheit | Fuenf Sicherheitsregeln | SIC-007 | Reihenfolge anwenden | Spannungsfreiheit, Erden | - | Regelkarten/Reihenfolge | 8 | M | hoch | auswendig | Betriebsanweisung | Entwurf/offen |
| FK-1-SIC-009 | 1 | Sicherheit | Sicherer Werkzeugwechsel | SIC-007 | Wechsel absichern | Werkzeug, Restenergie | - | Ablauf/Entscheidung | 9 | M | sehr_hoch | anwenden | Betriebsanweisung | Entwurf/offen |
| FK-1-SIC-010 | 1 | Sicherheit | Verhalten bei Unfall und Beinaheunfall | SIC-001 | Meldung ausloesen | Erste Hilfe, Verbandbuch | - | Meldekette/Quiz | 8 | G | hoch | auswendig | Betriebsanweisung | Entwurf/offen |
| FK-1-UMW-001 | 1 | Umwelt | Umweltschutz im Betrieb | BER-005 | Abfallwege erklaeren | Abfall, Recycling | - | Stoffstrom/Zuordnen | 8 | G | mittel | verstehen | Traegerskript | Entwurf/offen |
| FK-1-UMW-002 | 1 | Umwelt | Betriebsstoffe unterscheiden | UMW-001 | Stoffe sicher zuordnen | Oel, Fett, KSS | - | Stoffkarten/Chips | 8 | G | hoch | anwenden | Betriebsanweisung | Entwurf/offen |
| FK-1-UMW-003 | 1 | Umwelt | Gefahrstoffe erkennen | UMW-002 | Gefahrstoffinfos finden | H-Satz, P-Satz, GHS | - | Etikett/Hotspots | 9 | M | hoch | anwenden | Betriebsanweisung | Entwurf/offen |
| FK-1-UMW-004 | 1 | Umwelt | Sicherheitsdatenblatt nutzen | UMW-003 | relevante Abschnitte finden | SDB, Schutzmassnahme | - | Datenblatt/Navigation | 9 | M | hoch | tabellenbuch | Betriebsanweisung | Entwurf/offen |
| FK-1-UMW-005 | 1 | Umwelt | Kuehlschmierstoff sicher handhaben | UMW-002 | KSS-Risiken kennen | Konzentration, Hautschutz | - | KSS-Kreislauf/Quiz | 9 | M | hoch | anwenden | Betriebsanweisung | Entwurf/offen |
| FK-1-UMW-006 | 1 | Umwelt | Kunststoffabfaelle trennen | UMW-001 | Rezyklatweg verstehen | Rezyklat, Sortenreinheit | - | Materialbox/Sortieren | 8 | G | mittel | anwenden | Traegerskript | Entwurf/offen |
| FK-1-ZEI-001 | 1 | Zeichnung | Warum technische Zeichnungen wichtig sind | BER-004 | Zeichnung als Vertrag verstehen | Zeichnung, Bauteil | - | Zeichnungsblatt/Hotspots | 8 | G | sehr_hoch | verstehen | Tabellenbuch | Entwurf/offen |
| FK-1-ZEI-002 | 1 | Zeichnung | Schriftfeld lesen | ZEI-001 | Stammdaten finden | Zeichnungsnummer, Werkstoff | - | Schriftfeld/Chips | 8 | G | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-1-ZEI-003 | 1 | Zeichnung | Ansichten verstehen | ZEI-001 | Ansichten zuordnen | Vorderansicht, Draufsicht | - | Wuerfel/Zuordnen | 9 | G | sehr_hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-1-ZEI-004 | 1 | Zeichnung | Linienarten erkennen | ZEI-003 | Linienbedeutung erklaeren | Volllinie, Strichlinie | - | Linienkarte/Quiz | 8 | G | sehr_hoch | auswendig | Tabellenbuch | Entwurf/offen |
| FK-1-ZEI-005 | 1 | Zeichnung | Massstab nutzen | ZEI-003 | Zeichnungsgroesse deuten | Massstab, Verkleinerung | Massstab | Skalendiagramm/Rechnen | 9 | M | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-1-ZEI-006 | 1 | Zeichnung | BemaÃŸung lesen | ZEI-004 | MaÃŸe korrekt finden | NennmaÃŸ, MaÃŸlinie | - | MaÃŸbild/Hotspots | 9 | G | sehr_hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-1-ZEI-007 | 1 | Zeichnung | Toleranzangaben verstehen | ZEI-006 | GrenzmaÃŸe bestimmen | Toleranz, AbmaÃŸ | OG/UG | Toleranzfeld/Schieber | 10 | M | sehr_hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-1-ZEI-008 | 1 | Zeichnung | Passungen einordnen | ZEI-007 | Spiel/UebermaÃŸ erkennen | Passung, Spiel | - | Welle-Bohrung/Quiz | 9 | M | hoch | verstehen | Tabellenbuch | Entwurf/offen |
| FK-1-ZEI-009 | 1 | Zeichnung | Schnittdarstellungen verstehen | ZEI-003 | Innenkonturen erkennen | Schnitt, Schraffur | - | Schnittmodell/Hotspots | 9 | M | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-1-ZEI-010 | 1 | Zeichnung | Oberflaechenangaben erkennen | ZEI-006 | Rauheitsangaben lesen | Rauheit, Symbol | - | Symboltafel/Quiz | 8 | M | mittel | tabellenbuch | Tabellenbuch | Entwurf/offen |
| FK-1-ZEI-011 | 1 | Zeichnung | Stuecklisten verwenden | ZEI-002 | Teile und Mengen finden | Position, Menge | Materialbedarf | Stueckliste/Eingabe | 8 | G | hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-1-ZEI-012 | 1 | Zeichnung | Arbeitsplan lesen | ZEI-011 | Arbeitsfolge verstehen | Arbeitsgang, Betriebsmittel | Zeitbedarf | Arbeitsplan/Sortieren | 9 | G | sehr_hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-1-EIN-001 | 1 | Einheiten | SI-Basiseinheiten im Betrieb | keine | Einheiten sicher nennen | Meter, Sekunde, Kilogramm | - | Einheitentafel/Quiz | 8 | G | sehr_hoch | auswendig | Tabellenbuch | Entwurf/offen |
| FK-1-EIN-002 | 1 | Einheiten | Laengen umrechnen | EIN-001 | mm, cm, m wechseln | Laenge, Faktor | Umrechnung | Stufenleiter/Eingabe | 9 | G | sehr_hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-1-EIN-003 | 1 | Einheiten | Flaechen berechnen | EIN-002 | einfache Flaechen bestimmen | Flaeche, Quadrat | A Rechteck | Formeldiagramm/Rechnen | 9 | G | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-1-EIN-004 | 1 | Einheiten | Volumen berechnen | EIN-003 | Volumen einordnen | Volumen, Kubik | V Quader | Koerperdiagramm/Rechnen | 9 | G | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-1-EIN-005 | 1 | Einheiten | Masse und Dichte | EIN-004 | Dichtebezug verstehen | Masse, Dichte | rho=m/V | Materialwuerfel/Rechnen | 9 | M | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-1-EIN-006 | 1 | Einheiten | Zeit und Geschwindigkeit | EIN-002 | Prozesszeiten berechnen | Zeit, Geschwindigkeit | v=s/t | Foerderband/Rechnen | 9 | G | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-1-EIN-007 | 1 | Einheiten | Temperatur im Prozess | EIN-001 | Temperaturangaben deuten | Grad Celsius, Delta T | Delta T | Thermometer/Quiz | 8 | G | mittel | verstehen | Tabellenbuch | Entwurf/offen |
| FK-1-MES-001 | 1 | Messen | Pruefen, Messen und Lehren unterscheiden | EIN-002 | Begriffe trennen | Pruefen, Messen, Lehren | - | Vergleichskarten/Quiz | 8 | G | sehr_hoch | auswendig | Tabellenbuch | Entwurf/offen |
| FK-1-MES-002 | 1 | Messen | Messschieber aufbauen | MES-001 | Teile benennen | Messschenkel, Nonius | - | Messschieber/Hotspots | 8 | G | sehr_hoch | auswendig | Tabellenbuch | Entwurf/offen |
| FK-1-MES-003 | 1 | Messen | Aussenmessung mit Messschieber | MES-002 | AussenmaÃŸ messen | Aussenmessung | - | Messsituation/Simulation | 9 | G | sehr_hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-1-MES-004 | 1 | Messen | Innen- und Tiefenmessung | MES-003 | Messart wechseln | Innenmessung, TiefenmaÃŸ | - | Messarten/Tabs | 9 | G | sehr_hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-1-MES-005 | 1 | Messen | Messwert richtig ablesen | MES-003 | Ablesefehler vermeiden | Skala, Nonius | - | Skalenzoom/Eingabe | 10 | M | sehr_hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-1-MES-006 | 1 | Messen | Buegelmessschraube verwenden | MES-005 | fein messen | Spindel, Ratsche | - | Mikrometer/Simulation | 10 | M | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-1-MES-007 | 1 | Messen | Messuhr einsetzen | MES-005 | Abweichungen erkennen | Messuhr, Rundlauf | - | Rundlaufbild/Slider | 9 | M | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-1-MES-008 | 1 | Messen | Lehren benutzen | MES-001 | Gut/Ausschuss pruefen | Grenzlehrdorn, Rachenlehre | - | Gut-Ausschuss/Entscheidung | 9 | M | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-1-MES-009 | 1 | Messen | Pruefmittel schonend behandeln | MES-001 | Pruefmittel schuetzen | Pruefmittel, Pflege | - | Pflegekarte/Quiz | 8 | G | mittel | anwenden | Traegerskript | Entwurf/offen |
| FK-1-MES-010 | 1 | Messen | Kalibrieren, Justieren, Eichen | MES-009 | Begriffe unterscheiden | Kalibrieren, Eichen | - | Dreikarten/Zuordnen | 8 | M | hoch | verstehen | Tabellenbuch | Entwurf/offen |
| FK-1-MES-011 | 1 | Messen | Messunsicherheit einfach verstehen | MES-005 | Ergebnis kritisch sehen | Messfehler, Unsicherheit | - | Streubild/Quiz | 9 | M | mittel | verstehen | Tabellenbuch | Entwurf/offen |
| FK-1-MES-012 | 1 | Messen | Temperatur beim Messen beachten | MES-011 | Waermeeinfluss erklaeren | Ausdehnung, Referenztemp. | Delta L | Warm-kalt/Vergleich | 9 | M | mittel | verstehen | Tabellenbuch | Entwurf/offen |
| FK-1-WST-001 | 1 | Werkstoffe | Werkstoffgruppen ueberblicken | keine | Gruppen unterscheiden | Metall, Kunststoff | - | Materialbaum/Chips | 8 | G | sehr_hoch | auswendig | Tabellenbuch | Entwurf/offen |
| FK-1-WST-002 | 1 | Werkstoffe | Eisenwerkstoffe und Stahl | WST-001 | Stahl einordnen | Eisen, Stahl, Legierung | - | Legierungsbild/Quiz | 8 | G | hoch | verstehen | Tabellenbuch | Entwurf/offen |
| FK-1-WST-003 | 1 | Werkstoffe | Gusseisen verstehen | WST-002 | Gusswerkstoff erkennen | Gusseisen, Graphit | - | Bruchbild/Chips | 8 | M | mittel | verstehen | Tabellenbuch | Entwurf/offen |
| FK-1-WST-004 | 1 | Werkstoffe | Nichteisenmetalle | WST-001 | NE-Metalle nennen | Aluminium, Kupfer | - | Materialkarten/Sortieren | 8 | G | hoch | auswendig | Tabellenbuch | Entwurf/offen |
| FK-1-WST-005 | 1 | Werkstoffe | Aluminium in der Produktion | WST-004 | Eigenschaften ableiten | Aluminium, Oxidschicht | - | Bauteilbeispiel/Quiz | 8 | G | mittel | verstehen | Tabellenbuch | Entwurf/offen |
| FK-1-WST-006 | 1 | Werkstoffe | Kupfer und Leitfaehigkeit | WST-004 | Einsatz begruenden | Kupfer, Leitfaehigkeit | - | Leitung/Hotspots | 8 | G | mittel | verstehen | Tabellenbuch | Entwurf/offen |
| FK-1-WST-007 | 1 | Werkstoffe | Thermoplaste | WST-001 | Verhalten bei Waerme erklaeren | Thermoplast, Schmelze | - | Temperaturkurve/Quiz | 8 | G | sehr_hoch | verstehen | Tabellenbuch | Entwurf/offen |
| FK-1-WST-008 | 1 | Werkstoffe | Duroplaste | WST-007 | Abgrenzung erklaeren | Duroplast, Vernetzung | - | Strukturmodell/Chips | 8 | G | mittel | verstehen | Tabellenbuch | Entwurf/offen |
| FK-1-WST-009 | 1 | Werkstoffe | Elastomere | WST-007 | Elastizitaet erklaeren | Elastomer, Rueckstellung | - | Gummimodell/Slider | 8 | G | mittel | verstehen | Tabellenbuch | Entwurf/offen |
| FK-1-WST-010 | 1 | Werkstoffe | Additive und Masterbatch | WST-007 | Zusatzstoffe einordnen | Additiv, Masterbatch | - | Granulatmix/Hotspots | 8 | M | mittel | verstehen | Datenblatt | Entwurf/offen |
| FK-1-WST-011 | 1 | Werkstoffe | Granulat, Charge und Rezyklat | WST-010 | Material eindeutig verfolgen | Granulat, Charge, Rezyklat | - | Sacketikett/Quiz | 8 | G | hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-1-WSE-001 | 1 | Eigenschaften | Haerte verstehen | WST-001 | Haerte als Widerstand erklaeren | Haerte, Eindringen | - | Eindrueckbild/Quiz | 8 | G | hoch | verstehen | Tabellenbuch | Entwurf/offen |
| FK-1-WSE-002 | 1 | Eigenschaften | Festigkeit verstehen | WSE-001 | Belastbarkeit erklaeren | Zugfestigkeit, Bruch | - | Zugprobe/Slider | 8 | M | hoch | verstehen | Tabellenbuch | Entwurf/offen |
| FK-1-WSE-003 | 1 | Eigenschaften | Zaehigkeit und Sproedigkeit | WSE-002 | Bruchverhalten unterscheiden | Zaeh, sproede | - | Bruchvergleich/Quiz | 8 | M | hoch | verstehen | Tabellenbuch | Entwurf/offen |
| FK-1-WSE-004 | 1 | Eigenschaften | Elastizitaet und plastische Verformung | WSE-002 | Rueckfederung erklaeren | elastisch, plastisch | - | Federkurve/Slider | 9 | M | hoch | verstehen | Tabellenbuch | Entwurf/offen |
| FK-1-WSE-005 | 1 | Eigenschaften | Dichte im Werkstoffvergleich | EIN-005 | Masse abschaetzen | Dichte, Volumen | rho=m/V | Wuerfelvergleich/Rechnen | 9 | M | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-1-WSE-006 | 1 | Eigenschaften | Waermeausdehnung einfach | EIN-007 | Laengenaenderung deuten | Ausdehnung, Temperatur | Delta L | Schiene/Simulation | 9 | M | mittel | anwenden | Tabellenbuch | Entwurf/offen |
| FK-1-WSE-007 | 1 | Eigenschaften | Korrosion erkennen | WST-004 | Korrosionsschutz verstehen | Rost, Oxidation | - | Korrosionsvergleich/Quiz | 8 | G | mittel | verstehen | Tabellenbuch | Entwurf/offen |
| FK-1-WSE-008 | 1 | Eigenschaften | Werkstoffauswahl nach Aufgabe | WSE-001 | Anforderungen abgleichen | Beanspruchung, Auswahl | - | Entscheidungsbaum/Chips | 9 | M | hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-1-MEL-001 | 1 | Maschinenelemente | Wellen und Achsen unterscheiden | keine | Funktion unterscheiden | Welle, Achse | - | Bauteilpaar/Quiz | 8 | G | hoch | auswendig | Tabellenbuch | Entwurf/offen |
| FK-1-MEL-002 | 1 | Maschinenelemente | Lagerarten ueberblicken | MEL-001 | Lagerfunktion erklaeren | Lager, Reibung | - | Lagerexplosion/Hotspots | 8 | G | hoch | verstehen | Tabellenbuch | Entwurf/offen |
| FK-1-MEL-003 | 1 | Maschinenelemente | Gleitlager verstehen | MEL-002 | Gleitprinzip erklaeren | Gleitlager, Schmierung | - | Lagerfilm/Slider | 8 | M | mittel | verstehen | Tabellenbuch | Entwurf/offen |
| FK-1-MEL-004 | 1 | Maschinenelemente | Waelzlager verstehen | MEL-002 | Waelzkoerper erkennen | Kugellager, Rolle | - | Lagerquerschnitt/Hotspots | 8 | M | hoch | verstehen | Tabellenbuch | Entwurf/offen |
| FK-1-MEL-005 | 1 | Maschinenelemente | Kupplungen | MEL-001 | Drehmoment uebertragen | Kupplung, Ausgleich | - | Kupplung/Hotspots | 8 | G | mittel | verstehen | Tabellenbuch | Entwurf/offen |
| FK-1-MEL-006 | 1 | Maschinenelemente | Zahnradgetriebe | MEL-001 | Uebersetzung erklaeren | Zahnrad, Getriebe | i=n1/n2 | Zahnradpaar/Rechnen | 9 | M | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-1-MEL-007 | 1 | Maschinenelemente | Riemenantrieb | MEL-006 | Kraftschluss verstehen | Riemen, Riemenscheibe | i | Riemenmodell/Slider | 8 | M | mittel | verstehen | Tabellenbuch | Entwurf/offen |
| FK-1-MEL-008 | 1 | Maschinenelemente | Kettenantrieb | MEL-006 | Formschluss verstehen | Kette, Kettenrad | i | Kettenmodell/Quiz | 8 | M | mittel | verstehen | Tabellenbuch | Entwurf/offen |
| FK-1-MEL-009 | 1 | Maschinenelemente | Schrauben und Muttern | ZEI-006 | Verbindung erkennen | Gewinde, Mutter | - | Schraubverbindung/Hotspots | 8 | G | hoch | verstehen | Tabellenbuch | Entwurf/offen |
| FK-1-MEL-010 | 1 | Maschinenelemente | Federn und Daempfer | MEL-001 | Funktion einordnen | Feder, Daempfer | - | Federweg/Slider | 8 | G | mittel | verstehen | Tabellenbuch | Entwurf/offen |
| FK-2-FER-001 | 2 | Fertigung | Sechs Hauptgruppen der Fertigung | WST-001 | Fertigung einteilen | Urformen, Umformen, Trennen | - | Fertigungsrad/Quiz | 8 | G | sehr_hoch | auswendig | Tabellenbuch | Entwurf/offen |
| FK-2-FER-002 | 2 | Fertigung | Spanend und spanlos unterscheiden | FER-001 | Verfahren zuordnen | Span, spanlos | - | Vergleich/Sortieren | 8 | G | sehr_hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-2-FER-003 | 2 | Fertigung | Schnittbewegung und Vorschub | FER-002 | Bewegungen erkennen | Schnitt, Vorschub, Zustellung | - | Werkzeugbewegung/Hotspots | 9 | M | sehr_hoch | verstehen | Tabellenbuch | Entwurf/offen |
| FK-2-FER-004 | 2 | Fertigung | Schnittgeschwindigkeit | FER-003 | Formel anwenden | vc, d, n | vc=pi*d*n | Drehteil/Rechnen | 10 | M | sehr_hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-2-FER-005 | 2 | Fertigung | Drehzahl berechnen | FER-004 | Formel umstellen | Drehzahl, Durchmesser | n=vc/(pi*d) | Formeltrainer/Eingabe | 10 | M | sehr_hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-2-FER-006 | 2 | Fertigung | Vorschub und Zustellung | FER-003 | Einfluss erklaeren | Vorschub, Zustellung | vf=f*n | Spanbild/Slider | 9 | M | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-2-FER-007 | 2 | Fertigung | Standzeit und Werkzeugverschleiss | FER-006 | Verschleiss erkennen | Standzeit, Verschleiss | - | Werkzeugkante/Vergleich | 8 | M | hoch | verstehen | Tabellenbuch | Entwurf/offen |
| FK-2-FER-008 | 2 | Fertigung | Kuehlschmierstoffe | UMW-005 | Aufgaben von KSS erklaeren | KSS, Kuehlung, Schmierung | - | KSS-Zone/Quiz | 8 | G | hoch | verstehen | Betriebsanweisung | Entwurf/offen |
| FK-2-FER-009 | 2 | Fertigung | Werkzeugdaten sicher uebernehmen | FER-004 | Daten nicht raten | Werkzeugdaten, Tabelle | vc,n | Tabellenbuchpfad/Check | 9 | M | sehr_hoch | tabellenbuch | Tabellenbuch | Entwurf/offen |
| FK-2-FER-010 | 2 | Fertigung | Bearbeitungszeit grob planen | FER-006 | Zeit abschaetzen | Bearbeitungszeit, Weg | t=s/v | Zeitstrahl/Rechnen | 9 | M | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-2-MET-001 | 2 | Metall | Saegen | FER-002 | Saegeprozess erklaeren | Saegeblatt, Schnittspalt | - | Saege/Hotspots | 8 | G | hoch | verstehen | Tabellenbuch | Entwurf/offen |
| FK-2-MET-002 | 2 | Metall | Bohren | FER-003 | Bohrvorgang erklaeren | Bohrer, Spanwinkel | vc,n | Bohrbild/Rechnen | 9 | G | sehr_hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-2-MET-003 | 2 | Metall | Senken und Reiben | MET-002 | Nacharbeit unterscheiden | Senker, Reibahle | - | Lochvergleich/Quiz | 8 | M | hoch | verstehen | Tabellenbuch | Entwurf/offen |
| FK-2-MET-004 | 2 | Metall | Gewindeschneiden | MET-002 | Gewinde herstellen | Gewinde, Kernloch | Kernloch | Gewindeschnitt/Quiz | 9 | M | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-2-MET-005 | 2 | Metall | Drehen Grundlagen | FER-003 | Drehteile verstehen | Drehmaschine, Drehmeissel | vc,n | Drehmaschine/Hotspots | 9 | G | sehr_hoch | verstehen | Tabellenbuch | Entwurf/offen |
| FK-2-MET-006 | 2 | Metall | Laengs- und Plandrehen | MET-005 | Arbeitsgaenge unterscheiden | Laengsdrehen, Plandrehen | - | Drehwege/Tabs | 8 | M | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-2-MET-007 | 2 | Metall | Fraesen Grundlagen | FER-003 | Fraesprinzip erklaeren | Fraeser, Tischvorschub | vc,n | Fraesmaschine/Hotspots | 9 | G | sehr_hoch | verstehen | Tabellenbuch | Entwurf/offen |
| FK-2-MET-008 | 2 | Metall | Umfangs- und Stirnfraesen | MET-007 | Verfahren unterscheiden | Umfangsfraesen, Stirnfraesen | - | Fraesvergleich/Quiz | 8 | M | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-2-MET-009 | 2 | Metall | Schleifen | FER-002 | Schleifen einordnen | Schleifscheibe, Korn | - | Schleifzone/Hotspots | 8 | M | mittel | verstehen | Tabellenbuch | Entwurf/offen |
| FK-2-MET-010 | 2 | Metall | Stanzen und Schneiden | FER-002 | Schnittprinzip erklaeren | Stempel, Matrize, Grat | - | Stanzwerkzeug/Simulation | 9 | M | hoch | verstehen | Tabellenbuch | Entwurf/offen |
| FK-2-MET-011 | 2 | Metall | Biegen | FER-001 | Rueckfederung beachten | Biegen, Biegeradius | - | Biegewinkel/Slider | 9 | M | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-2-MET-012 | 2 | Metall | Walzen | FER-001 | Umformprinzip erklaeren | Walze, Spalt | - | Walzspalt/Hotspots | 8 | M | mittel | verstehen | Tabellenbuch | Entwurf/offen |
| FK-2-MET-013 | 2 | Metall | Tiefziehen | FER-001 | Prozessschritte erkennen | Niederhalter, Ziehring | - | Tiefziehfolge/Tabs | 9 | M | mittel | verstehen | Tabellenbuch | Entwurf/offen |
| FK-2-MET-014 | 2 | Metall | Pressen | FER-001 | Presskraftkonzept verstehen | Presse, Presskraft | p=F/A | Presse/Rechnen | 9 | M | mittel | anwenden | Tabellenbuch | Entwurf/offen |
| FK-2-MET-015 | 2 | Metall | Schmieden | FER-001 | Gefuegeaenderung grob verstehen | Schmieden, Rohling | - | Schmiedeschritte/Quiz | 8 | M | niedrig | verstehen | Tabellenbuch | Entwurf/offen |
| FK-2-MET-016 | 2 | Metall | Giessen | FER-001 | Urformen erklaeren | Form, Schmelze, Speiser | - | Gussform/Hotspots | 8 | G | mittel | verstehen | Tabellenbuch | Entwurf/offen |
| FK-2-MET-017 | 2 | Metall | Schweissen | FER-001 | Verbindung einordnen | Schweissnaht, Waerme | - | Nahtbild/Quiz | 9 | G | hoch | verstehen | Tabellenbuch | Entwurf/offen |
| FK-2-MET-018 | 2 | Metall | Loeten | MET-017 | Loeten abgrenzen | Lot, Benetzung | - | Fuegespalt/Hotspots | 8 | G | mittel | verstehen | Tabellenbuch | Entwurf/offen |
| FK-2-MET-019 | 2 | Metall | Kleben | MET-017 | Klebeprozess absichern | Klebstoff, Oberflaeche | - | Klebschicht/Check | 8 | G | mittel | anwenden | Datenblatt | Entwurf/offen |
| FK-2-MET-020 | 2 | Metall | Schrauben und Nieten | MEL-009 | loesbare Verbindung erkennen | Schraube, Niet | Drehmoment | Verbindung/Quiz | 9 | G | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-2-KST-001 | 2 | Kunststoff | Spritzgiessmaschine ueberblicken | WST-007 | Baugruppen benennen | Spritzeinheit, SchlieÃŸeinheit | - | Maschine/Hotspots | 9 | G | sehr_hoch | auswendig | Fachbuch | Entwurf/offen |
| FK-2-KST-002 | 2 | Kunststoff | Materialtrichter und Trocknung | KST-001 | Material vorbereiten | Trichter, Trockner | - | Trockner/Check | 9 | M | hoch | anwenden | Datenblatt | Entwurf/offen |
| FK-2-KST-003 | 2 | Kunststoff | Schnecke und Zylinder | KST-001 | Plastifizierung verstehen | Schnecke, Zylinder | - | Schneckenzonen/Hotspots | 9 | M | sehr_hoch | verstehen | Fachbuch | Entwurf/offen |
| FK-2-KST-004 | 2 | Kunststoff | Einzugszone | KST-003 | Granulattransport erklaeren | Einzugszone | - | Zone/Animation | 8 | M | hoch | verstehen | Fachbuch | Entwurf/offen |
| FK-2-KST-005 | 2 | Kunststoff | Kompressionszone | KST-004 | Verdichtung erklaeren | Kompression, Schmelze | - | Zone/Animation | 8 | M | hoch | verstehen | Fachbuch | Entwurf/offen |
| FK-2-KST-006 | 2 | Kunststoff | Meteringzone | KST-005 | Homogenisieren verstehen | Meteringzone, Dosieren | - | Zone/Animation | 8 | M | hoch | verstehen | Fachbuch | Entwurf/offen |
| FK-2-KST-007 | 2 | Kunststoff | Rueckstromsperre und Duese | KST-003 | Rueckfluss vermeiden | Rueckstromsperre, Duese | - | Detail/Hotspots | 8 | M | hoch | verstehen | Fachbuch | Entwurf/offen |
| FK-2-KST-008 | 2 | Kunststoff | Werkzeug und Kavitaet | KST-001 | Formraum erklaeren | Werkzeug, Kavitaet | - | Werkzeugquerschnitt/Hotspots | 9 | M | sehr_hoch | verstehen | Fachbuch | Entwurf/offen |
| FK-2-KST-009 | 2 | Kunststoff | Anguss und Entlueftung | KST-008 | Flusswege verstehen | Anguss, Entlueftung | - | Flussdiagramm/Hotspots | 8 | M | hoch | verstehen | Fachbuch | Entwurf/offen |
| FK-2-KST-010 | 2 | Kunststoff | Auswerfer und Entformen | KST-008 | Bauteil entformen | Auswerfer, Entformen | - | Auswerfer/Animation | 8 | M | hoch | verstehen | Fachbuch | Entwurf/offen |
| FK-2-KST-011 | 2 | Kunststoff | Werkzeugtemperierung | KST-008 | Temperierung erklaeren | Kuehlkanal, Werkzeugtemp. | - | Kuehlkanaele/Slider | 9 | M | hoch | verstehen | Datenblatt | Entwurf/offen |
| FK-2-KST-012 | 2 | Kunststoff | Plastifizieren und Dosieren | KST-003 | Dosiervorgang erklaeren | Plastifizieren, Dosieren | - | Zyklusstep/Tabs | 9 | M | sehr_hoch | anwenden | Fachbuch | Entwurf/offen |
| FK-2-KST-013 | 2 | Kunststoff | Einspritzen und Umschaltpunkt | KST-012 | Umschalten begruenden | Einspritzen, Umschaltpunkt | - | Zyklusstep/Slider | 9 | M | sehr_hoch | anwenden | Fachbuch | Entwurf/offen |
| FK-2-KST-014 | 2 | Kunststoff | Nachdruck | KST-013 | Schwindung ausgleichen | Nachdruck, Schwindung | - | Druckkurve/Slider | 9 | M | sehr_hoch | anwenden | Fachbuch | Entwurf/offen |
| FK-2-KST-015 | 2 | Kunststoff | Kuehlzeit und Restkuehlzeit | KST-014 | Zykluszeit einordnen | Kuehlzeit, Restkuehlzeit | Zykluszeit | Zeitbalken/Rechnen | 9 | M | hoch | anwenden | Fachbuch | Entwurf/offen |
| FK-2-KST-016 | 2 | Kunststoff | Schliesskraft | KST-013 | Gratrisiko verstehen | Schliesskraft, Druck | F=p*A | Werkzeug/Rechnen | 10 | M | hoch | anwenden | Fachbuch | Entwurf/offen |
| FK-2-KST-017 | 2 | Kunststoff | Einspritzdruck, Staudruck, Temperaturen | KST-013 | Parameter unterscheiden | Druck, Staudruck, Masse | - | Parameterpanel/Quiz | 9 | M | sehr_hoch | verstehen | Datenblatt | Entwurf/offen |
| FK-2-KST-018 | 2 | Kunststoff | Kompletter Spritzgiesszyklus | KST-012 | Schritte verbinden | Zyklus, Freigabe | Zykluszeit | Zyklusanimation/Klick | 10 | M | sehr_hoch | anwenden | Fachbuch | Entwurf/offen |
| FK-2-KST-019 | 2 | Kunststoff | Extruder aufbauen | WST-007 | Extrusion abgrenzen | Extruder, Profil | - | Extruder/Hotspots | 9 | M | hoch | verstehen | Fachbuch | Entwurf/offen |
| FK-2-KST-020 | 2 | Kunststoff | Profile, Rohre und Folien extrudieren | KST-019 | Produkte zuordnen | Duese, Kalibrierung | - | Extrusionslinie/Tabs | 9 | M | hoch | verstehen | Fachbuch | Entwurf/offen |
| FK-2-KST-021 | 2 | Kunststoff | Blasformen | KST-019 | Hohlkoerper verstehen | Vorformling, Blasen | - | Blasform/Animation | 8 | M | mittel | verstehen | Fachbuch | Entwurf/offen |
| FK-2-KST-022 | 2 | Kunststoff | Thermoformen | WST-007 | Folienumformung erklaeren | Folie, Vakuum | - | Thermoformfolge/Quiz | 8 | M | mittel | verstehen | Fachbuch | Entwurf/offen |
| FK-2-KST-023 | 2 | Kunststoff | Schwindung und Verzug | KST-014 | MaÃŸaenderung erklaeren | Schwindung, Verzug | - | Bauteilvergleich/Slider | 9 | M | sehr_hoch | verstehen | Fachbuch | Entwurf/offen |
| FK-2-KST-024 | 2 | Kunststoff | Molekuelorientierung einfach | KST-019 | Richtungseffekte verstehen | Orientierung, FlieÃŸrichtung | - | Molekuelmodell/Animation | 8 | S | mittel | verstehen | Fachbuch | Entwurf/offen |
| FK-2-KST-025 | 2 | Kunststoff | Farbwechsel und Materialwechsel | KST-011 | Wechsel kontrollieren | Farbwechsel, Spuelen | - | Wechselablauf/Check | 9 | M | hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-2-PRO-001 | 2 | Vorbereitung | Auftrag und Zeichnung abgleichen | ZEI-012 | Widerspruch erkennen | Auftrag, Zeichnung | - | Abgleich/Check | 8 | G | sehr_hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-2-PRO-002 | 2 | Vorbereitung | Material und Charge pruefen | PRO-001 | Charge absichern | Charge, Etikett | - | Sacketikett/Scan | 8 | G | sehr_hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-2-PRO-003 | 2 | Vorbereitung | Werkzeug vorbereiten | PRO-001 | Werkzeugzustand pruefen | Werkzeug, Ruestplatz | - | Werkzeugkarte/Hotspots | 8 | M | hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-2-PRO-004 | 2 | Vorbereitung | Maschine ruesten | PRO-003 | Ruestschritte ordnen | Ruesten, Nullpunkt | - | Ruestablauf/Sortieren | 9 | M | sehr_hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-2-PRO-005 | 2 | Vorbereitung | Parameter uebernehmen | PRO-004 | Parameter nicht raten | Parameter, Rezept | - | Rezeptkarte/Check | 8 | M | sehr_hoch | anwenden | Betriebsanweisung | Entwurf/offen |
| FK-2-PRO-006 | 2 | Vorbereitung | Erstteil herstellen | PRO-005 | Erstteilprozess kennen | Erstteil, Anfahren | - | Ablauf/Quiz | 8 | M | sehr_hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-2-PRO-007 | 2 | Vorbereitung | Erstteil pruefen | PRO-006 | Freigabe vorbereiten | Erstteilpruefung, Soll | - | Pruefplan/Eingabe | 9 | M | sehr_hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-2-PRO-008 | 2 | Vorbereitung | Produktionsfreigabe | PRO-007 | Freigabegrenzen kennen | Freigabe, Sperrung | - | Freigabeampel/Entscheidung | 8 | M | sehr_hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-2-PRO-009 | 2 | Vorbereitung | Werkzeugwechsel | PRO-004 | Wechsel sicher planen | Werkzeugwechsel, Ruestzeit | Ruestzeit | Ablauf/Rechnen | 9 | M | hoch | anwenden | Betriebsanweisung | Entwurf/offen |
| FK-2-PRO-010 | 2 | Vorbereitung | Anfahren und Abfahren | PRO-006 | Prozess stabil starten/stoppen | Anfahrteil, Ausschuss | Ausschussquote | Zeitstrahl/Quiz | 9 | M | hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-2-PRO-011 | 2 | Vorbereitung | Schichtuebergabe | PRO-010 | relevante Infos uebergeben | Uebergabe, Stoerung | - | Uebergabeformular/Check | 8 | G | hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-2-PRO-012 | 2 | Vorbereitung | Produktionsdaten fuer Qualitaet sichern | PRO-011 | Daten rueckverfolgbar notieren | Rueckverfolgung, Charge | - | Datenfluss/Quiz | 8 | M | hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-3-QS-001 | 3 | Qualitaet | Qualitaet im Betrieb | PRO-008 | Qualitaet definieren | Qualitaet, Kunde | - | Qualitaetskette/Quiz | 8 | G | sehr_hoch | verstehen | Rahmenlehrplan | Entwurf/offen |
| FK-3-QS-002 | 3 | Qualitaet | Sollwert, Istwert und NennmaÃŸ | QS-001 | Werte unterscheiden | Soll, Ist, NennmaÃŸ | Abweichung | Messkarte/Eingabe | 9 | G | sehr_hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-3-QS-003 | 3 | Qualitaet | GrenzmaÃŸe und Toleranz | QS-002 | Gutteil entscheiden | GrenzmaÃŸ, Toleranz | OG/UG | Toleranzfeld/Slider | 10 | M | sehr_hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-3-QS-004 | 3 | Qualitaet | Pruefplan lesen | QS-002 | Pruefmerkmale finden | Pruefplan, Merkmal | - | Pruefplan/Hotspots | 8 | G | sehr_hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-3-QS-005 | 3 | Qualitaet | Pruefhaeufigkeit | QS-004 | Stichprobe planen | Intervall, Stichprobe | - | Zeitraster/Quiz | 8 | M | hoch | verstehen | Traegerskript | Entwurf/offen |
| FK-3-QS-006 | 3 | Qualitaet | Erst-, Zwischen- und Endpruefung | QS-004 | Pruefarten zuordnen | Erstpruefung, Endpruefung | - | Prozessleiste/Sortieren | 8 | G | sehr_hoch | auswendig | Traegerskript | Entwurf/offen |
| FK-3-QS-007 | 3 | Qualitaet | Sicht-, MaÃŸ- und Funktionspruefung | QS-004 | Pruefung passend waehlen | Sichtpruefung, Funktion | - | Pruefkarten/Quiz | 8 | G | sehr_hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-3-QS-008 | 3 | Qualitaet | Stichprobe und Vollpruefung | QS-005 | Aufwand und Risiko erklaeren | Stichprobe, Vollpruefung | - | Mengenbild/Entscheidung | 8 | M | hoch | verstehen | Tabellenbuch | Entwurf/offen |
| FK-3-QS-009 | 3 | Qualitaet | Gutteil, Nacharbeit, Ausschuss | QS-003 | Teile klassifizieren | Gutteil, Nacharbeit, Ausschuss | Ausschussquote | Teilebox/Sortieren | 9 | G | sehr_hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-3-QS-010 | 3 | Qualitaet | Fehlerquote berechnen | QS-009 | Quote berechnen | Fehlerquote, Menge | Fehlerquote | Formeltrainer/Rechnen | 9 | G | sehr_hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-3-QS-011 | 3 | Qualitaet | Mittelwert und Spannweite | QS-002 | Messreihe auswerten | Mittelwert, Spannweite | x quer, R | Messreihe/Rechnen | 10 | M | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-3-QS-012 | 3 | Qualitaet | Trend und Prozessstreuung | QS-011 | Drift erkennen | Trend, Streuung | - | Punktdiagramm/Slider | 9 | M | hoch | verstehen | Tabellenbuch | Entwurf/offen |
| FK-3-QS-013 | 3 | Qualitaet | Normalverteilung einfach | QS-011 | Verteilung deuten | Normalverteilung | - | Glockenkurve/Quiz | 8 | S | mittel | verstehen | Tabellenbuch | Entwurf/offen |
| FK-3-QS-014 | 3 | Qualitaet | Regelkarte einfach lesen | QS-012 | Warnsignale erkennen | Regelkarte, Eingriffsgrenze | - | Regelkarte/Hotspots | 10 | S | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-3-QS-015 | 3 | Qualitaet | Prozessfaehigkeit Cp und Cpk | QS-013 | Kennwerte grob einordnen | Cp, Cpk | Cp,Cpk | Toleranzglocke/Quiz | 10 | S | mittel | verstehen | Tabellenbuch | Entwurf/offen |
| FK-3-QS-016 | 3 | Qualitaet | Messunsicherheit in der QS | MES-011 | Ergebnis absichern | Unsicherheit, Kalibrierung | - | Fehlerbalken/Quiz | 8 | M | mittel | verstehen | Tabellenbuch | Entwurf/offen |
| FK-3-QS-017 | 3 | Qualitaet | Rueckverfolgbarkeit und Charge | PRO-012 | Ursprung finden | Charge, Rueckverfolgung | - | Trace-Kette/Hotspots | 8 | G | hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-3-QS-018 | 3 | Qualitaet | Pruefprotokoll schreiben | QS-004 | Abweichung dokumentieren | Protokoll, Abweichung | - | Formular/Eingabe | 9 | G | hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-3-QS-019 | 3 | Qualitaet | Sperrung und Freigabe | QS-018 | Eskalation korrekt ausloesen | Sperrung, Freigabe | - | Entscheidungsbaum/Quiz | 8 | M | sehr_hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-3-FEM-001 | 3 | Metallfehler | Grat an Metallteilen | MET-010 | Gratursachen erkennen | Grat, Schnittspalt | - | Gut/Grat/Vergleich | 8 | M | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-3-FEM-002 | 3 | Metallfehler | MaÃŸabweichung Metall | QS-003 | Ursachenfelder pruefen | MaÃŸabweichung, Werkzeug | - | Messvergleich/Diagnose | 9 | M | sehr_hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-3-FEM-003 | 3 | Metallfehler | Rattermarken | MET-005 | Schwingung deuten | Rattern, Schwingung | - | Oberflaeche/Vergleich | 8 | M | hoch | verstehen | Tabellenbuch | Entwurf/offen |
| FK-3-FEM-004 | 3 | Metallfehler | Schlechter Rundlauf | MES-007 | Rundlauf pruefen | Rundlauf, Unwucht | - | Messuhr/Simulation | 9 | M | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-3-FEM-005 | 3 | Metallfehler | Werkzeugbruch | FER-007 | Sofortmassnahmen kennen | Werkzeugbruch, Bruch | - | Werkzeugbild/Entscheidung | 8 | M | hoch | anwenden | Betriebsanweisung | Entwurf/offen |
| FK-3-FEM-006 | 3 | Metallfehler | Werkzeugverschleiss | FER-007 | Verschleissbild erkennen | Freiflaeche, Schneide | - | Kantenvergleich/Quiz | 8 | M | hoch | verstehen | Tabellenbuch | Entwurf/offen |
| FK-3-FEM-007 | 3 | Metallfehler | Verformung und Riss | WSE-003 | Materialfehler unterscheiden | Riss, Verformung | - | Fehlerbild/Diagnose | 8 | M | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-3-FEM-008 | 3 | Metallfehler | Schlechte Oberflaeche | ZEI-010 | Oberflaechenfehler pruefen | Rauheit, Kratzer | - | Oberflaechenbild/Quiz | 8 | M | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-3-FEM-009 | 3 | Metallfehler | Haertefehler | WSE-001 | Pruefbedarf erkennen | Haertefehler, Waerme | - | Haertepunkte/Quiz | 8 | S | mittel | verstehen | Tabellenbuch | Entwurf/offen |
| FK-3-FEM-010 | 3 | Metallfehler | Korrosion am Bauteil | WSE-007 | Korrosionsursache pruefen | Korrosion, Medium | - | Rostvergleich/Diagnose | 8 | G | mittel | anwenden | Tabellenbuch | Entwurf/offen |
| FK-3-FEK-001 | 3 | Kunststofffehler | Einfallstellen | KST-014 | Fehlerbild deuten | Einfallstelle, Nachdruck | - | Gut/Fehler/Diagnose | 9 | M | sehr_hoch | anwenden | Fachbuch | Entwurf/offen |
| FK-3-FEK-002 | 3 | Kunststofffehler | Lunker | KST-014 | Hohlraeume erklaeren | Lunker, Schwindung | - | Schnittbild/Diagnose | 9 | M | hoch | verstehen | Fachbuch | Entwurf/offen |
| FK-3-FEK-003 | 3 | Kunststofffehler | Grat und Ueberspritzung | KST-016 | Parametergrenzen kennen | Grat, Ueberspritzung | - | Fehlervergleich/Quiz | 9 | M | sehr_hoch | anwenden | Fachbuch | Entwurf/offen |
| FK-3-FEK-004 | 3 | Kunststofffehler | Unterfuellung | KST-013 | Fliessende erkennen | Unterfuellung, FlieÃŸweg | - | Kurzes Teil/Diagnose | 9 | M | sehr_hoch | anwenden | Fachbuch | Entwurf/offen |
| FK-3-FEK-005 | 3 | Kunststofffehler | FlieÃŸnaehte und Bindenaehte | KST-009 | Nahtentstehung erklaeren | FlieÃŸnaht, Bindenaht | - | Fliessfront/Animation | 9 | M | hoch | verstehen | Fachbuch | Entwurf/offen |
| FK-3-FEK-006 | 3 | Kunststofffehler | Schlieren und Feuchtigkeitsschlieren | KST-002 | Materialursache pruefen | Schlieren, Feuchte | - | Oberflaeche/Diagnose | 9 | M | hoch | anwenden | Datenblatt | Entwurf/offen |
| FK-3-FEK-007 | 3 | Kunststofffehler | Verbrennungen und Dieseleffekt | KST-009 | Entlueftung beachten | Verbrennung, Dieseleffekt | - | Brandstelle/Hotspots | 9 | M | hoch | verstehen | Fachbuch | Entwurf/offen |
| FK-3-FEK-008 | 3 | Kunststofffehler | Verzug | KST-023 | Ursache eingrenzen | Verzug, Orientierung | - | Bauteilwarp/Slider | 9 | M | sehr_hoch | anwenden | Fachbuch | Entwurf/offen |
| FK-3-FEK-009 | 3 | Kunststofffehler | Delamination | WST-010 | Schichtfehler erkennen | Delamination, Inkompatibilitaet | - | Schichtbild/Quiz | 8 | S | mittel | verstehen | Fachbuch | Entwurf/offen |
| FK-3-FEK-010 | 3 | Kunststofffehler | Schwarze Punkte | KST-025 | Verschmutzung pruefen | schwarze Punkte, Abbau | - | Teilebild/Diagnose | 8 | M | hoch | anwenden | Fachbuch | Entwurf/offen |
| FK-3-FEK-011 | 3 | Kunststofffehler | Farbabweichungen | KST-025 | Farbeinfluss pruefen | Farbabweichung, Masterbatch | - | Farbvergleich/Quiz | 8 | M | hoch | anwenden | Datenblatt | Entwurf/offen |
| FK-3-FEK-012 | 3 | Kunststofffehler | Sichtbarer Anguss und Auswerfermarken | KST-010 | Werkzeugspuren erkennen | Anguss, Auswerfermarke | - | Detailvergleich/Hotspots | 8 | M | mittel | anwenden | Fachbuch | Entwurf/offen |
| FK-3-FEK-013 | 3 | Kunststofffehler | MaÃŸabweichungen Kunststoff | QS-003 | Schwindung und Prozess pruefen | MaÃŸabweichung, Schwindung | - | Toleranz/Diagnose | 9 | M | sehr_hoch | anwenden | Fachbuch | Entwurf/offen |
| FK-3-FEK-014 | 3 | Kunststofffehler | Fehlerdiagnose mit 5M | FEK-001 | Ursachen strukturiert pruefen | Material, Maschine, Methode | - | 5M-Diagramm/Diagnose | 10 | M | sehr_hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-3-STR-001 | 3 | Steuerung | Sensor, Aktor, Steuerung | MEL-001 | Grundprinzip erklaeren | Sensor, Aktor, Steuerung | - | Signalweg/Hotspots | 8 | G | hoch | verstehen | Tabellenbuch | Entwurf/offen |
| FK-3-STR-002 | 3 | Steuerung | Steuerung und Regelung | STR-001 | Unterschied erklaeren | Steuerung, Regelung | - | Regelkreis/Tabs | 9 | M | hoch | verstehen | Tabellenbuch | Entwurf/offen |
| FK-3-STR-003 | 3 | Steuerung | Sollwert, Istwert, Stellgroesse | STR-002 | Regelkreisbegriffe nutzen | Soll, Ist, Stellgroesse | - | Regelkreis/Chips | 8 | M | hoch | auswendig | Tabellenbuch | Entwurf/offen |
| FK-3-STR-004 | 3 | Steuerung | SPS-Grundlagen | STR-001 | SPS-Aufgabe verstehen | SPS, Programm | - | SPS-Box/Hotspots | 8 | M | mittel | verstehen | Fachbuch | Entwurf/offen |
| FK-3-STR-005 | 3 | Steuerung | Eingang und Ausgang | STR-004 | Signale zuordnen | Eingang, Ausgang | - | I/O-Karte/Quiz | 8 | M | hoch | anwenden | Fachbuch | Entwurf/offen |
| FK-3-STR-006 | 3 | Steuerung | UND, ODER und Verriegelung | STR-005 | Logik lesen | UND, ODER, Verriegelung | - | Logiktor/Simulation | 9 | M | hoch | anwenden | Fachbuch | Entwurf/offen |
| FK-3-STR-007 | 3 | Steuerung | Endschalter und Lichtschranke | STR-005 | Sensoren erkennen | Endschalter, Lichtschranke | - | Sensorvergleich/Hotspots | 8 | G | hoch | verstehen | Fachbuch | Entwurf/offen |
| FK-3-STR-008 | 3 | Steuerung | Induktive und kapazitive Sensoren | STR-007 | Materialerkennung erklaeren | induktiv, kapazitiv | - | Sensorfeld/Quiz | 8 | M | mittel | verstehen | Fachbuch | Entwurf/offen |
| FK-3-STR-009 | 3 | Steuerung | Temperatur- und Drucksensoren | STR-007 | Prozesswerte einordnen | Temperatur, Druck | p=F/A | Sensorpanel/Quiz | 8 | M | hoch | verstehen | Tabellenbuch | Entwurf/offen |
| FK-3-STR-010 | 3 | Steuerung | Elektromotor und Frequenzumrichter | MEL-006 | Drehzahlsteuerung verstehen | Motor, FU | - | Antriebskette/Slider | 9 | M | hoch | verstehen | Fachbuch | Entwurf/offen |
| FK-3-PNH-001 | 3 | Pneumatik | Druckluftanlage ueberblicken | STR-001 | Druckluftweg kennen | Kompressor, Druckluft | - | Anlage/Hotspots | 8 | G | hoch | verstehen | Tabellenbuch | Entwurf/offen |
| FK-3-PNH-002 | 3 | Pneumatik | Wartungseinheit | PNH-001 | Luft vorbereiten | Filter, Regler, Oeler | - | Wartungseinheit/Hotspots | 8 | M | mittel | verstehen | Tabellenbuch | Entwurf/offen |
| FK-3-PNH-003 | 3 | Pneumatik | Ventile und Drosseln | PNH-001 | Luftstrom steuern | Ventil, Drossel | - | Pneumatikplan/Quiz | 9 | M | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-3-PNH-004 | 3 | Pneumatik | Einfachwirkender Zylinder | PNH-003 | Bewegung erklaeren | einfachwirkend, Feder | - | Zylinder/Animation | 8 | M | hoch | verstehen | Tabellenbuch | Entwurf/offen |
| FK-3-PNH-005 | 3 | Pneumatik | Doppeltwirkender Zylinder | PNH-004 | Steuerung erklaeren | doppeltwirkend, Hub | - | Zylinder/Simulation | 8 | M | hoch | verstehen | Tabellenbuch | Entwurf/offen |
| FK-3-PNH-006 | 3 | Hydraulik | Hydraulik-Grundlagen | PNH-001 | Druckkraft verstehen | Hydraulik, Oel, Druck | F=p*A | Presse/Rechnen | 9 | M | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-3-IH-001 | 3 | Instandhaltung | Wartung, Inspektion, Instandsetzung | QS-001 | Begriffe unterscheiden | Wartung, Inspektion | - | Begriffskarten/Quiz | 8 | G | sehr_hoch | auswendig | Rahmenlehrplan | Entwurf/offen |
| FK-3-IH-002 | 3 | Instandhaltung | Vorbeugende Instandhaltung | IH-001 | Ausfall vermeiden | vorbeugend, zustandsorientiert | - | Zeitplan/Sortieren | 8 | M | hoch | verstehen | Traegerskript | Entwurf/offen |
| FK-3-IH-003 | 3 | Instandhaltung | Schmierung und Schmierplan | MEL-002 | Schmierstelle erkennen | Schmierung, Schmierplan | - | Schmierplan/Hotspots | 9 | M | hoch | anwenden | Betriebsanweisung | Entwurf/offen |
| FK-3-IH-004 | 3 | Instandhaltung | Verschleiss und Reibung | FER-007 | Verschleissursache deuten | Reibung, Verschleiss | - | Reibmodell/Slider | 8 | M | hoch | verstehen | Tabellenbuch | Entwurf/offen |
| FK-3-IH-005 | 3 | Instandhaltung | Temperatur, Schwingung, Geraeusch | IH-004 | Symptome erkennen | Schwingung, Geraeusch | - | Symptompanel/Quiz | 8 | M | hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-3-IH-006 | 3 | Instandhaltung | Leckage erkennen | IH-005 | Leckage melden | Leckage, Dichtung | - | Leckagebild/Hotspots | 8 | G | hoch | anwenden | Betriebsanweisung | Entwurf/offen |
| FK-3-IH-007 | 3 | Instandhaltung | Lagerfehler | MEL-004 | Lagerfehler einordnen | Lagerluft, Pitting | - | Lagerbild/Diagnose | 8 | M | hoch | verstehen | Tabellenbuch | Entwurf/offen |
| FK-3-IH-008 | 3 | Instandhaltung | Unwucht und Fehlausrichtung | FEM-004 | Laufproblem erkennen | Unwucht, Ausrichtung | - | Wellenmodell/Slider | 9 | M | hoch | verstehen | Fachbuch | Entwurf/offen |
| FK-3-IH-009 | 3 | Instandhaltung | Stoerung, Fehler, Ursache, Wirkung | IH-005 | Begriffe sauber nutzen | Stoerung, Ursache, Wirkung | - | Ursache-Wirkung/Quiz | 8 | G | sehr_hoch | auswendig | Traegerskript | Entwurf/offen |
| FK-3-IH-010 | 3 | Instandhaltung | 5-Why | IH-009 | Ursache tiefer suchen | 5-Why, Grundursache | - | Warum-Kette/Eingabe | 9 | M | hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-3-IH-011 | 3 | Instandhaltung | Ishikawa-Diagramm | IH-010 | Ursachenfelder strukturieren | Ishikawa, 5M | - | Fischgraete/Hotspots | 9 | M | mittel | anwenden | Traegerskript | Entwurf/offen |
| FK-3-IH-012 | 3 | Instandhaltung | Stoerung dokumentieren | IH-009 | Bericht verwertbar schreiben | Dokumentation, MaÃŸnahme | - | Stoerformular/Eingabe | 9 | G | hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-3-IH-013 | 3 | Instandhaltung | Sichere Fehlersuche | SIC-007 | Suche sicher planen | Freischalten, Restenergie | - | Sicherheitsablauf/Check | 9 | M | sehr_hoch | anwenden | Betriebsanweisung | Entwurf/offen |
| FK-3-IH-014 | 3 | Instandhaltung | Verbesserung nach Stoerung | IH-012 | KVP nutzen | Verbesserung, MaÃŸnahme | - | Verbesserungsloop/Quiz | 8 | M | mittel | verstehen | Traegerskript | Entwurf/offen |
| FK-4-PLA-001 | 4 | Planung | Fertigungsauftrag verstehen | PRO-001 | Auftrag planen | Fertigungsauftrag | - | Auftragskarte/Hotspots | 8 | G | sehr_hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-4-PLA-002 | 4 | Planung | Arbeitsfolge planen | PLA-001 | Reihenfolge begruenden | Arbeitsfolge, Arbeitsplan | - | Prozesskarten/Sortieren | 9 | M | sehr_hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-4-PLA-003 | 4 | Planung | Stueckliste und Materialbedarf | ZEI-011 | Bedarf berechnen | Stueckliste, Bedarf | Bedarf=Menge*Stueck | Tabelle/Rechnen | 9 | M | sehr_hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-4-PLA-004 | 4 | Planung | Personal- und Maschinenbedarf | PLA-002 | Ressourcen planen | Personal, Maschine | - | Ressourcenplan/Quiz | 8 | M | mittel | verstehen | Traegerskript | Entwurf/offen |
| FK-4-PLA-005 | 4 | Planung | Maschinenbelegung und Kapazitaet | PLA-004 | Belegung auswerten | Kapazitaet, Belegung | Kapazitaet | Kalender/Rechnen | 9 | M | hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-4-PLA-006 | 4 | Planung | Taktzeit und Zykluszeit | KST-015 | Zeiten unterscheiden | Taktzeit, Zykluszeit | Taktzeit | Zeitbalken/Rechnen | 9 | M | sehr_hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-4-PLA-007 | 4 | Planung | Durchlaufzeit | PLA-006 | Auftragszeit bestimmen | Durchlaufzeit, Wartezeit | Durchlaufzeit | Zeitlinie/Rechnen | 9 | M | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-4-PLA-008 | 4 | Planung | Ruestzeit und Bearbeitungszeit | PRO-009 | Zeitanteile trennen | Ruestzeit, Bearbeitungszeit | Gesamtzeit | Balken/Rechnen | 9 | M | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-4-PLA-009 | 4 | Planung | Stillstandszeit | IH-009 | Stillstand bewerten | Stillstand, Ausfall | Verfuegbarkeit | OEE-Teil/Quiz | 8 | M | hoch | verstehen | Traegerskript | Entwurf/offen |
| FK-4-PLA-010 | 4 | Planung | Liefertermin und Losgroesse | PLA-007 | Terminrisiko erkennen | Losgroesse, Termin | - | Planungstafel/Entscheidung | 9 | M | mittel | anwenden | Traegerskript | Entwurf/offen |
| FK-4-LAG-001 | 4 | Lager | Bestand und Mindestbestand | PLA-003 | Bestand bewerten | Bestand, Mindestbestand | - | Lagerkurve/Quiz | 8 | G | hoch | verstehen | WiSo-Skript | Entwurf/offen |
| FK-4-LAG-002 | 4 | Lager | Meldebestand und Sicherheitsbestand | LAG-001 | Nachbestellung ausloesen | Meldebestand, Sicherheit | Meldebestand | Lagerdiagramm/Rechnen | 9 | M | hoch | anwenden | WiSo-Skript | Entwurf/offen |
| FK-4-LAG-003 | 4 | Lager | FIFO | LAG-001 | Reihenfolge anwenden | FIFO, Charge | - | Regal/Sortieren | 8 | G | mittel | anwenden | Traegerskript | Entwurf/offen |
| FK-4-LAG-004 | 4 | Lager | Kanban-Grundprinzip | LAG-002 | Pull-Prinzip erklaeren | Kanban, Karte | - | Kartenfluss/Simulation | 8 | M | mittel | verstehen | Traegerskript | Entwurf/offen |
| FK-4-LEAN-001 | 4 | Lean | WertschÃ¶pfung und Verschwendung | PLA-002 | Taetigkeiten bewerten | WertschÃ¶pfung, Verschwendung | - | Prozessband/Markieren | 8 | G | mittel | verstehen | Traegerskript | Entwurf/offen |
| FK-4-LEAN-002 | 4 | Lean | 5S wiederholen | BER-007 | Arbeitsplatz verbessern | 5S, Standard | - | Arbeitsplatz/Check | 8 | G | mittel | anwenden | Traegerskript | Entwurf/offen |
| FK-4-LEAN-003 | 4 | Lean | KVP im Team | IH-014 | Verbesserung vorschlagen | KVP, MaÃŸnahme | - | KVP-Kreis/Quiz | 8 | G | mittel | verstehen | Traegerskript | Entwurf/offen |
| FK-4-OEE-001 | 4 | OEE | OEE ueberblicken | PLA-009 | OEE-Faktoren kennen | OEE, Verfuegbarkeit | OEE | OEE-Kreis/Chips | 9 | M | hoch | verstehen | Tabellenbuch | Entwurf/offen |
| FK-4-OEE-002 | 4 | OEE | Verfuegbarkeit berechnen | OEE-001 | Laufzeit bewerten | Verfuegbarkeit | V=Lauf/Plan | Formeltrainer/Rechnen | 9 | M | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-4-OEE-003 | 4 | OEE | Leistungsgrad berechnen | OEE-001 | Leistung bewerten | Leistungsgrad, Sollleistung | L=Ist/Soll | Formeltrainer/Rechnen | 9 | M | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-4-OEE-004 | 4 | OEE | Qualitaetsrate berechnen | OEE-001 | Gutmenge bewerten | Qualitaetsrate, Gutteil | Q=Gut/Gesamt | Formeltrainer/Rechnen | 9 | M | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-4-OEE-005 | 4 | OEE | OEE verbessern | OEE-002 | Verlustursache finden | Verlust, MaÃŸnahme | OEE | Verlustbaum/Diagnose | 9 | M | mittel | anwenden | Traegerskript | Entwurf/offen |
| FK-4-MAT-001 | 4 | Mathematik | Rechenweg in Pruefungen | EIN-001 | strukturiert rechnen | gegeben, gesucht | - | Rechenschema/Check | 8 | G | sehr_hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-4-MAT-002 | 4 | Mathematik | Grundrechenarten sicher | MAT-001 | Fehler vermeiden | Summe, Produkt | - | Zahlenfeld/Quiz | 8 | G | sehr_hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-4-MAT-003 | 4 | Mathematik | Dreisatz | MAT-002 | proportional rechnen | Dreisatz | - | Dreisatztafel/Rechnen | 9 | G | sehr_hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-4-MAT-004 | 4 | Mathematik | Prozentrechnung | MAT-003 | Anteile berechnen | Prozent, Grundwert | p=W/G | Prozentbalken/Rechnen | 9 | G | sehr_hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-4-MAT-005 | 4 | Mathematik | Einheiten in Aufgaben umrechnen | EIN-002 | Einheit vor Formel pruefen | Einheit, Faktor | Umrechnung | Einheitentrainer | 9 | G | sehr_hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-4-MAT-006 | 4 | Mathematik | Umfang und Flaeche Rechteck | EIN-003 | Rechteck berechnen | Umfang, Flaeche | A=a*b | Formeldiagramm/Rechnen | 8 | G | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-4-MAT-007 | 4 | Mathematik | Kreisumfang und Kreisflaeche | MAT-006 | Kreiswerte berechnen | Radius, Durchmesser | U=pi*d; A=pi*r2 | Kreis/Slider | 9 | M | sehr_hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-4-MAT-008 | 4 | Mathematik | Volumen Quader und Zylinder | EIN-004 | Volumen berechnen | Quader, Zylinder | V | Koerper/Rechnen | 9 | M | sehr_hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-4-MAT-009 | 4 | Mathematik | Masse aus Dichte | EIN-005 | Masse berechnen | Masse, Dichte | m=rho*V | Material/Rechnen | 9 | M | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-4-MAT-010 | 4 | Mathematik | Geschwindigkeit und Zeit | EIN-006 | Bewegungsaufgaben loesen | Weg, Zeit, Geschwindigkeit | v=s/t | Foerderband/Rechnen | 9 | G | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-4-MAT-011 | 4 | Mathematik | Drehzahl und Schnittgeschwindigkeit | FER-005 | Formeln umstellen | Drehzahl, vc | vc,n | Formeltrainer | 10 | M | sehr_hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-4-MAT-012 | 4 | Mathematik | Vorschub berechnen | FER-006 | Vorschubaufgaben loesen | Vorschub, Zahn | vf=f*n | Spanen/Rechnen | 9 | M | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-4-MAT-013 | 4 | Mathematik | Kraft und Druck | PNH-006 | Druckaufgaben loesen | Kraft, Druck, Flaeche | p=F/A | Presse/Rechnen | 9 | M | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-4-MAT-014 | 4 | Mathematik | Hydraulischer Druck | MAT-013 | Kraftuebersetzung verstehen | Hydraulik, Kolben | F=p*A | Kolben/Slider | 9 | M | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-4-MAT-015 | 4 | Mathematik | Leistung, Arbeit, Wirkungsgrad | MAT-002 | Energiebegriffe anwenden | Leistung, Arbeit, eta | P=W/t; eta | Motor/Rechnen | 10 | M | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-4-MAT-016 | 4 | Mathematik | Uebersetzungsverhaeltnis | MEL-006 | Getriebe rechnen | Uebersetzung, Drehzahl | i | Zahnrad/Rechnen | 9 | M | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-4-MAT-017 | 4 | Mathematik | Drehmoment | MEL-005 | Hebelarm nutzen | Drehmoment, Hebelarm | M=F*l | Hebel/Slider | 9 | M | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-4-MAT-018 | 4 | Mathematik | Gutmenge und Ausschussquote | QS-010 | Produktionsmenge bewerten | Gutmenge, Ausschuss | AQ | Mengenbox/Rechnen | 9 | G | sehr_hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-4-MAT-019 | 4 | Mathematik | Produktionsleistung | PLA-006 | Leistung je Zeit berechnen | Leistung, Stueckzahl | Leistung=Menge/Zeit | Takt/Rechnen | 9 | M | hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-4-MAT-020 | 4 | Mathematik | Prozentuale Abweichung | QS-002 | Abweichung bewerten | Abweichung, Prozent | Abw.% | Messwert/Rechnen | 9 | M | sehr_hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-4-MAT-021 | 4 | Mathematik | Waermeausdehnung pruefungsnah | WSE-006 | Delta-L berechnen | Ausdehnungskoeffizient | Delta L | Laengenstab/Rechnen | 10 | S | mittel | anwenden | Tabellenbuch | Entwurf/offen |
| FK-4-MAT-022 | 4 | Mathematik | Toleranzberechnung | QS-003 | GrenzmaÃŸe berechnen | oberes/unteres GrenzmaÃŸ | OG/UG | Toleranzfeld/Rechnen | 10 | M | sehr_hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-4-MAT-023 | 4 | Mathematik | Formel umstellen | MAT-011 | Zielgroesse isolieren | Formelzeichen, Umstellen | variabel | Formeltrainer | 10 | M | sehr_hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-4-MAT-024 | 4 | Mathematik | Plausibilitaet von Ergebnissen | MAT-001 | Ergebnis pruefen | Plausibilitaet, Einheit | - | Fehlerdetektor/Quiz | 8 | G | sehr_hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-4-WISO-001 | 4 | WiSo | Ausbildungsvertrag | keine | Vertragsinhalte kennen | Ausbildungsvertrag | - | Vertragsblatt/Hotspots | 8 | G | hoch | auswendig | WiSo-Skript | Entwurf/offen |
| FK-4-WISO-002 | 4 | WiSo | Rechte und Pflichten | WISO-001 | Pflichten zuordnen | Sorgfalt, Weisung | - | Karten/Quiz | 8 | G | sehr_hoch | auswendig | WiSo-Skript | Entwurf/offen |
| FK-4-WISO-003 | 4 | WiSo | Probezeit und Kuendigung | WISO-001 | Fristen nicht raten | Probezeit, Kuendigung | - | Zeitlinie/Quiz | 8 | G | hoch | verstehen | WiSo-Skript | Entwurf/offen |
| FK-4-WISO-004 | 4 | WiSo | Arbeitsvertrag und Tarifvertrag | WISO-001 | Vertragstypen trennen | Arbeitsvertrag, Tarif | - | Vergleich/Chips | 8 | G | hoch | verstehen | WiSo-Skript | Entwurf/offen |
| FK-4-WISO-005 | 4 | WiSo | Tarifautonomie und Betriebsrat | WISO-004 | Mitbestimmung einordnen | Tarifautonomie, Betriebsrat | - | Organigramm/Quiz | 8 | G | mittel | verstehen | WiSo-Skript | Entwurf/offen |
| FK-4-WISO-006 | 4 | WiSo | Jugend- und Auszubildendenvertretung | WISO-005 | Vertretung kennen | JAV, Wahl | - | Gremienkarte/Quiz | 8 | G | mittel | auswendig | WiSo-Skript | Entwurf/offen |
| FK-4-WISO-007 | 4 | WiSo | Sozialversicherung | WISO-001 | Zweige nennen | KV, PV, RV, AV, UV | - | Fuenf-Saeulen/Quiz | 9 | G | sehr_hoch | auswendig | WiSo-Skript | Entwurf/offen |
| FK-4-WISO-008 | 4 | WiSo | Arbeitszeit und Urlaub | WISO-001 | Regelungen finden | Arbeitszeit, Urlaub | - | Kalender/Quiz | 8 | G | hoch | tabellenbuch | WiSo-Skript | Entwurf/offen |
| FK-4-WISO-009 | 4 | WiSo | Entgeltabrechnung | WISO-007 | Brutto/Netto verstehen | Brutto, Netto, Abzug | Prozent | Abrechnung/Hotspots | 9 | M | hoch | anwenden | WiSo-Skript | Entwurf/offen |
| FK-4-WISO-010 | 4 | WiSo | Nachhaltigkeit und Umweltschutz | UMW-001 | Nachhaltigkeit betrieblich sehen | Nachhaltigkeit, Ressourcen | - | Dreieck/Quiz | 8 | G | mittel | verstehen | WiSo-Skript | Entwurf/offen |
| FK-4-WISO-011 | 4 | WiSo | Wirtschaftlichkeit und Produktivitaet | PLA-001 | Kennzahlen deuten | Wirtschaftlichkeit, Produktivitaet | Produktivitaet | Kennzahl/Rechnen | 9 | M | hoch | anwenden | WiSo-Skript | Entwurf/offen |
| FK-4-WISO-012 | 4 | WiSo | Oekonomisches Prinzip | WISO-011 | Minimal/Maximalprinzip erkennen | Minimal, Maximal | - | Prinzipkarten/Quiz | 8 | G | hoch | verstehen | WiSo-Skript | Entwurf/offen |
| FK-4-PRF-001 | 4 | Pruefung | Aufgabenstellung richtig lesen | MAT-001 | Operatoren markieren | Operator, Aufgabe | - | Aufgabenblatt/Markieren | 8 | G | sehr_hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-4-PRF-002 | 4 | Pruefung | Gegeben und gesucht finden | PRF-001 | Werte strukturieren | gegeben, gesucht | - | Rechenschema/Eingabe | 8 | G | sehr_hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-4-PRF-003 | 4 | Pruefung | Passende Formel finden | PRF-002 | Formel auswaehlen | Formel, Formelzeichen | variabel | Formelbaum/Quiz | 9 | M | sehr_hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-4-PRF-004 | 4 | Pruefung | Einheiten kontrollieren | MAT-005 | Einheitenfehler finden | Einheit, Umrechnung | - | Fehlercheck/Quiz | 8 | G | sehr_hoch | anwenden | Tabellenbuch | Entwurf/offen |
| FK-4-PRF-005 | 4 | Pruefung | Tabellenbuch nutzen | PRF-003 | Fundstellen finden | Tabellenbuch, Register | - | Tabellenbuchpfad/Hotspots | 9 | M | sehr_hoch | tabellenbuch | Tabellenbuch | Entwurf/offen |
| FK-4-PRF-006 | 4 | Pruefung | Multiple-Choice-Ausschlussverfahren | PRF-001 | Distraktoren pruefen | Distraktor, Ausschluss | - | Antwortkarten/Quiz | 8 | G | hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-4-PRF-007 | 4 | Pruefung | Unbekannte Begriffe bearbeiten | PRF-005 | Kontext nutzen | Fachbegriff, Kontext | - | Begriffskarte/Chips | 8 | G | hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-4-PRF-008 | 4 | Pruefung | Zeitmanagement | PRF-001 | Zeit einteilen | Zeitbudget, Markierung | - | Pruefungsuhr/Slider | 8 | G | hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-4-PRF-009 | 4 | Pruefung | Pruefungsangst reduzieren | PRF-008 | Routine nutzen | Stress, Atemtechnik | - | Ablaufkarte/Check | 8 | G | mittel | zusatzwissen | Traegerskript | Entwurf/offen |
| FK-4-PRF-010 | 4 | Pruefung | Typische Pruefungsfallen | PRF-004 | Fallen erkennen | Falle, Plausibilitaet | - | Fehlerbeispiele/Quiz | 9 | M | sehr_hoch | anwenden | Traegerskript | Entwurf/offen |
| FK-4-PRF-011 | 4 | Pruefung | Mini-Pruefung Produktionstechnik | PRF-010 | gemischt ueben | Produktionstechnik | gemischt | Pruefungsset/Mastery | 10 | M | sehr_hoch | anwenden | eigene Fragen | Entwurf/offen |
| FK-4-PRF-012 | 4 | Pruefung | Mini-Pruefung Produktionsplanung | PRF-010 | Planung ueben | Produktionsplanung | gemischt | Pruefungsset/Mastery | 10 | M | sehr_hoch | anwenden | eigene Fragen | Entwurf/offen |
| FK-4-PRF-013 | 4 | Pruefung | Mini-Pruefung WiSo | WISO-012 | WiSo ueben | WiSo, Vertrag, Sozialversicherung | - | Pruefungsset/Mastery | 10 | G | hoch | anwenden | eigene Fragen | Entwurf/offen |
| FK-4-PRF-014 | 4 | Pruefung | Wiederholungsmodus nach Fehlern | PRF-011 | Schwachstellen nutzen | Wiederholung, Mastery | - | Fehlerliste/Start | 8 | G | hoch | anwenden | App-Logik | Entwurf/offen |
| FK-4-PRF-015 | 4 | Pruefung | Persoenliche Schwachstellen erkennen | PRF-014 | Lernplan ableiten | Schwachstelle, Trend | - | Fortschritt/Hotspots | 8 | M | hoch | anwenden | App-Logik | Entwurf/offen |
| FK-4-PRF-016 | 4 | Pruefung | Pruefungssimulation Abschluss | PRF-015 | realistisch trainieren | Simulation, Ergebnis | gemischt | Runner/E2E | 10 | S | sehr_hoch | anwenden | eigene Fragen | Entwurf/offen |

## 5. Vertical Slice: Messschieber und Toleranzen

### Zielumfang

Pilotpfad:

1. `FK-1-MES-002` Messschieber aufbauen
2. `FK-1-MES-003` Aussenmessung mit Messschieber
3. `FK-1-MES-004` Innen- und Tiefenmessung
4. `FK-1-MES-005` Messwert richtig ablesen
5. `FK-1-ZEI-007` Toleranzangaben verstehen
6. `FK-3-QS-003` GrenzmaÃŸe und Toleranz
7. `FK-4-MAT-022` Toleranzberechnung

### BenÃ¶tigte technische Bausteine

| Baustein | Zielort | Hinweis |
|---|---|---|
| Story-/Erklaer-/Praxis-/Merksatz-Komponenten | `packages/ui` | Server-renderbare Lernbausteine mit Statusfarbe + Icon + Textlabel. |
| Begriffschip | `packages/ui/src/fachkunde-interaktiv.tsx` | MDX-`BegriffListe` oeffnet einen Glossar-Drawer mit Fachdefinition, einfacher Erklaerung und Bezug zur Lerneinheit. |
| Formelkarte | neues UI-Muster | KaTeX/MathML-Entscheidung spaeter pruefen; keine grosse Dependency ohne ADR. |
| Interaktiver Messschieber | `packages/ui/src/fachkunde-interaktiv.tsx` | Client Component mit Range, Zahleneingabe, Schritt-Buttons, Live-Bewertung und MDX-Einbindung. |
| Toleranzfeld | `packages/ui/src/fachkunde-interaktiv.tsx` | Istmass-Slider, Grenzmass-Anzeige und Gut/Ausschuss-Entscheidung mit Text, Symbol und Farbe. |
| Mini-Quiz | `packages/core/fachkunde` + `packages/ui/src/fachkunde-interaktiv.tsx`, spaeter bestehende `fragen` + `content_quizze` | Demo-Slice nutzt strukturierte MC-Daten mit stabilen `masterySchluessel`n; echte Speicherung folgt erst nach Import in DB-Fragen/Mastery. |
| Offline-Vorladen | `app/[locale]/campus/topic/_components/inhalte-vorladen.tsx` + `public/sw.js` | Lerneinheit stoesst gezielt `PRECACHE_URLS` fuer Topic- und Lerneinheit-URL an; Interaktionschunks laufen ueber bestehende Static-Asset-Strategie. |

### Akzeptanzkriterien fuer den Slice

- Jede Einheit hat Story, einfache Erklaerung, Fachsprache, Praxisbeispiel, Visual, Begriffschips, Merksatz und Wissenscheck.
- Messschieber-Interaktion funktioniert mit Touch, Tastatur und 200 Prozent Zoom.
- Keine Toleranz-, Norm- oder Tabellenbuchwerte werden ohne Fundstelle eingetragen.
- Fortschritt wird ueber bestehende `lerneinheit_fortschritt` und Mastery-Logik gespeichert.
- Typecheck, Unit-Tests, Integrationstest fuer Laden/Oeffnen und ein mobiler E2E-Pfad sind gruen.

### Umsetzungsstand Welle 3

- Server-renderbare Fachkunde-MDX-Bausteine, Glossar-Drawer, interaktiver Messschieber, interaktives Toleranzfeld und Mini-Wissenscheck sind im UI-Paket eingebunden.
- Die Demo-Lerneinheit `pt-mes-01-messschieber-sicher-verwenden.mdx` ist als Entwurf mit offenen Fundstellen, Uebungswerte-Status und fachlicher Freigabeanforderung markiert.
- Offline-Vorladen nutzt den bestehenden Service Worker ueber gezielte `PRECACHE_URLS` fuer Topic- und Lerneinheit-URL.
- Accessibility-Nachschaerfungen fuer Live-Regionen, Touch-Ziele und Reduced-Motion-sichere Uebergaenge sind umgesetzt.

### Umsetzungsstand Welle 4

- `PT-BER` ist als Demo-Thema `Berufsrolle und Sicherheit` im Fallback sichtbar.
- Der erste Berufsrollen-Block ist als drei MDX-Lerneinheiten umgesetzt: `pt-ber-01-erster-tag-in-der-produktion`, `pt-ber-02-aufgaben-des-maschinenfuehrers`, `pt-ber-03-verantwortung-bei-stoerungen`.
- Neue wiederverwendbare Visuals im UI-Paket: `Produktionskarte`, `Rollenrad`, `MeldewegAblauf`.
- Neue wiederverwendbare Berufsrollen-Interaktionen im UI-Paket: `ProduktionsStartcheck`, `RollenEntscheider`, `MeldewegTrainer`.
- Alle drei Einheiten tragen Entwurfsstatus, offene Quellen-/Fundstellenhinweise, fachliche Freigabeanforderung und Mini-Wissenschecks mit stabilen `FK-1-BER-*`-Mastery-Schluesseln.
- `PT-SIC` ist als Demo-Thema `Sicherheit in der Werkhalle` im Fallback sichtbar.
- Der erste Sicherheitsblock ist als drei MDX-Lerneinheiten umgesetzt: `pt-sic-01-gefahren-in-der-werkhalle-erkennen`, `pt-sic-02-persoenliche-schutzausruestung`, `pt-sic-03-sicherheitszeichen-lesen`.
- Neue wiederverwendbare Sicherheits-Visuals: `GefahrenstellenBild`, `PsaSet`, `SicherheitszeichenSet`.
- Neue wiederverwendbare Sicherheits-Interaktionen: `GefahrstellenTrainer`, `PsaZuordnung`, `SicherheitszeichenTrainer`.
- Der vertiefende Sicherheitsblock ist als drei MDX-Lerneinheiten umgesetzt: `pt-sic-04-not-halt-richtig-nutzen`, `pt-sic-05-schutzeinrichtungen-verstehen`, `pt-sic-06-einzugsstellen-und-quetschstellen`.
- Neue wiederverwendbare Sicherheitsvertiefungs-Visuals: `NotHaltSchema`, `SchutzeinrichtungSchema`, `EinzugQuetschstellenSchema`.
- Neue wiederverwendbare Sicherheitsvertiefungs-Interaktionen: `NotHaltSzenarioTrainer`, `SchutzeinrichtungTrainer`, `GefahrbereichTrainer`.
- Der abschliessende Sicherheitsblock ist als vier MDX-Lerneinheiten umgesetzt: `pt-sic-07-sicher-gegen-wiedereinschalten`, `pt-sic-08-fuenf-sicherheitsregeln`, `pt-sic-09-sicherer-werkzeugwechsel`, `pt-sic-10-verhalten-bei-unfall-und-beinaheunfall`.
- Neue wiederverwendbare Sicherheitsabschluss-Visuals: `WiedereinschaltenSchema`, `SicherheitsregelnSchema`, `WerkzeugwechselSchema`, `UnfallMeldeketteSchema`.
- Neue wiederverwendbare Sicherheitsabschluss-Interaktionen: `WiedereinschaltenTrainer`, `SicherheitsregelnTrainer`, `WerkzeugwechselTrainer`, `UnfallMeldeTrainer`.
- `PT-UMW` ist als Demo-Thema `Umwelt und Betriebsstoffe` im Fallback sichtbar.
- Der Umweltblock ist als sechs MDX-Lerneinheiten umgesetzt: `pt-umw-01-umweltschutz-im-betrieb`, `pt-umw-02-betriebsstoffe-unterscheiden`, `pt-umw-03-gefahrstoffe-erkennen`, `pt-umw-04-sicherheitsdatenblatt-nutzen`, `pt-umw-05-kuehlschmierstoff-sicher-handhaben`, `pt-umw-06-kunststoffabfaelle-trennen`.
- Neue wiederverwendbare Umwelt-Visuals: `UmweltStoffstromSchema`, `BetriebsstoffeSchema`, `GefahrstoffEtikettSchema`, `SicherheitsdatenblattSchema`, `KuehlschmierstoffSchema`, `KunststoffAbfallSchema`.
- Neue wiederverwendbare Umwelt-Interaktionen: `AbfallwegTrainer`, `BetriebsstoffZuordnungTrainer`, `GefahrstoffEtikettTrainer`, `SicherheitsdatenblattTrainer`, `KuehlschmierstoffTrainer`, `KunststoffAbfallTrainer`.
- `PT-ZEI` ist als Demo-Thema `Technische Zeichnung` im Fallback sichtbar.
- Der erste Zeichnungsblock ist als sechs MDX-Lerneinheiten umgesetzt: `pt-zei-01-warum-technische-zeichnungen-wichtig-sind`, `pt-zei-02-schriftfeld-lesen`, `pt-zei-03-ansichten-verstehen`, `pt-zei-04-linienarten-erkennen`, `pt-zei-05-massstab-nutzen`, `pt-zei-06-bemassung-lesen`.
- Neue wiederverwendbare Zeichnungs-Visuals: `ZeichnungGrundlagenSchema`, `SchriftfeldSchema`, `AnsichtenSchema`, `LinienartenSchema`, `MassstabSchema`, `BemassungSchema`.
- Neue wiederverwendbare Zeichnungs-Interaktionen: `ZeichnungZweckTrainer`, `SchriftfeldTrainer`, `AnsichtenTrainer`, `LinienartenTrainer`, `MassstabTrainer`, `BemassungTrainer`.
- Der vertiefende Zeichnungsblock ist als sechs MDX-Lerneinheiten umgesetzt: `pt-zei-07-toleranzangaben-verstehen`, `pt-zei-08-passungen-einordnen`, `pt-zei-09-schnittdarstellungen-verstehen`, `pt-zei-10-oberflaechenangaben-erkennen`, `pt-zei-11-stuecklisten-verwenden`, `pt-zei-12-arbeitsplan-lesen`.
- Neue wiederverwendbare Zeichnungsvertiefungs-Visuals: `ToleranzangabenSchema`, `PassungSchema`, `SchnittdarstellungSchema`, `OberflaechenangabenSchema`, `StuecklisteSchema`, `ArbeitsplanSchema`.
- Neue wiederverwendbare Zeichnungsvertiefungs-Interaktionen: `ToleranzangabenTrainer`, `PassungTrainer`, `SchnittdarstellungTrainer`, `OberflaechenangabenTrainer`, `StuecklisteTrainer`, `ArbeitsplanTrainer`.
- `PT-EIN` ist als Demo-Thema `Einheiten und Groessen` im Fallback sichtbar.
- Der Einheitenblock ist als sieben MDX-Lerneinheiten umgesetzt: `pt-ein-01-si-basiseinheiten-im-betrieb`, `pt-ein-02-laengen-umrechnen`, `pt-ein-03-flaechen-berechnen`, `pt-ein-04-volumen-berechnen`, `pt-ein-05-masse-und-dichte`, `pt-ein-06-zeit-und-geschwindigkeit`, `pt-ein-07-temperatur-im-prozess`.
- Neue wiederverwendbare Einheiten-Visuals: `SiEinheitenSchema`, `LaengenUmrechnungSchema`, `FlaechenSchema`, `VolumenSchema`, `DichteSchema`, `GeschwindigkeitSchema`, `TemperaturSchema`.
- Neue wiederverwendbare Einheiten-Interaktionen: `SiEinheitenTrainer`, `LaengenUmrechnungTrainer`, `FlaechenTrainer`, `VolumenTrainer`, `DichteTrainer`, `GeschwindigkeitTrainer`, `TemperaturTrainer`.
- `PT-MES` ist als Demo-Thema `Messen und Pruefen` im Fallback sichtbar.
- Der Messblock Grundlagen ist als sechs MDX-Lerneinheiten umgesetzt: `pt-mes-01-pruefen-messen-und-lehren-unterscheiden`, `pt-mes-02-messschieber-aufbauen`, `pt-mes-03-aussenmessung-mit-messschieber`, `pt-mes-04-innen-und-tiefenmessung`, `pt-mes-05-messwert-richtig-ablesen`, `pt-mes-06-buegelmessschraube-verwenden`.
- Die vorhandene Vertical-Slice-Einheit `pt-mes-01-messschieber-sicher-verwenden` bleibt als angereicherte Demo fuer Messschieber, Toleranzfeld, Glossar und Offline-Vorladen erhalten.
- Neue wiederverwendbare Messblock-Visuals: `PruefenMessenLehrenSchema`, `AussenmessungSchema`, `InnenTiefenmessungSchema`, `MesswertAblesenSchema`, `BuegelmessschraubeSchema`; `MessschieberSchema` wird wiederverwendet.
- Neue wiederverwendbare Messblock-Interaktionen: `PruefenMessenLehrenTrainer`, `MessschieberTeileTrainer`, `AussenmessungTrainer`, `InnenTiefenmessungTrainer`, `MesswertAblesenTrainer`, `BuegelmessschraubeTrainer`.
- Alle sechs Einheiten tragen Entwurfsstatus, offene Quellen-/Fundstellenhinweise, fachliche Freigabeanforderung und Mini-Wissenschecks mit stabilen `FK-1-MES-*`-Mastery-Schluesseln.
- Der Messblock Vertiefung ist als sechs MDX-Lerneinheiten umgesetzt: `pt-mes-07-messuhr-einsetzen`, `pt-mes-08-lehren-benutzen`, `pt-mes-09-pruefmittel-schonend-behandeln`, `pt-mes-10-kalibrieren-justieren-eichen`, `pt-mes-11-messunsicherheit-einfach-verstehen`, `pt-mes-12-temperatur-beim-messen-beachten`.
- Neue wiederverwendbare Messvertiefungs-Visuals: `MessuhrSchema`, `LehrenSchema`, `PruefmittelpflegeSchema`, `KalibrierenJustierenEichenSchema`, `MessunsicherheitSchema`, `TemperaturMessenSchema`.
- Neue wiederverwendbare Messvertiefungs-Interaktionen: `MessuhrTrainer`, `LehrenTrainer`, `PruefmittelpflegeTrainer`, `KalibrierenJustierenEichenTrainer`, `MessunsicherheitTrainer`, `TemperaturBeimMessenTrainer`.
- Alle sechs Vertiefungseinheiten tragen Entwurfsstatus, offene Quellen-/Fundstellenhinweise, fachliche Freigabeanforderung und Mini-Wissenschecks mit stabilen `FK-1-MES-*`-Mastery-Schluesseln.
- `PT-WST` ist als Demo-Thema `Werkstoffe` im Fallback sichtbar.
- Der Werkstoffblock Grundlagen ist als sechs MDX-Lerneinheiten umgesetzt: `pt-wst-01-werkstoffgruppen-ueberblicken`, `pt-wst-02-eisenwerkstoffe-und-stahl`, `pt-wst-03-gusseisen-verstehen`, `pt-wst-04-nichteisenmetalle`, `pt-wst-05-aluminium-in-der-produktion`, `pt-wst-06-kupfer-und-leitfaehigkeit`.
- Neue wiederverwendbare Werkstoff-Visuals: `WerkstoffgruppenSchema`, `EisenStahlSchema`, `GusseisenSchema`, `NichteisenmetalleSchema`, `AluminiumSchema`, `KupferSchema`.
- Neue wiederverwendbare Werkstoff-Interaktionen: `WerkstoffgruppenTrainer`, `EisenStahlTrainer`, `GusseisenTrainer`, `NichteisenmetalleTrainer`, `AluminiumTrainer`, `KupferTrainer`.
- Alle sechs Werkstoffgrundlagen-Einheiten tragen Entwurfsstatus, offene Quellen-/Fundstellenhinweise, fachliche Freigabeanforderung und Mini-Wissenschecks mit stabilen `FK-1-WST-*`-Mastery-Schluesseln.
- Der Werkstoffblock Kunststoffe/Materialverfolgung ist als fuenf MDX-Lerneinheiten umgesetzt: `pt-wst-07-thermoplaste`, `pt-wst-08-duroplaste`, `pt-wst-09-elastomere`, `pt-wst-10-additive-und-masterbatch`, `pt-wst-11-granulat-charge-und-rezyklat`.
- Neue wiederverwendbare Kunststoff-/Materialverfolgungs-Visuals: `ThermoplastSchema`, `DuroplastSchema`, `ElastomerSchema`, `AdditiveMasterbatchSchema`, `GranulatChargeRezyklatSchema`.
- Neue wiederverwendbare Kunststoff-/Materialverfolgungs-Interaktionen: `ThermoplastTrainer`, `DuroplastTrainer`, `ElastomerTrainer`, `AdditiveMasterbatchTrainer`, `GranulatChargeRezyklatTrainer`.
- Alle fuenf Kunststoff-/Materialverfolgungs-Einheiten tragen Entwurfsstatus, offene Quellen-/Fundstellenhinweise, fachliche Freigabeanforderung und Mini-Wissenschecks mit stabilen `FK-1-WST-*`-Mastery-Schluesseln.
- `PT-WSE` ist als Demo-Thema `Werkstoffeigenschaften` im Fallback sichtbar.
- Der Eigenschaftsblock Werkstoffe ist als acht MDX-Lerneinheiten umgesetzt: `pt-wse-01-haerte-verstehen`, `pt-wse-02-festigkeit-verstehen`, `pt-wse-03-zaehigkeit-und-sproedigkeit`, `pt-wse-04-elastizitaet-und-plastische-verformung`, `pt-wse-05-dichte-im-werkstoffvergleich`, `pt-wse-06-waermeausdehnung-einfach`, `pt-wse-07-korrosion-erkennen`, `pt-wse-08-werkstoffauswahl-nach-aufgabe`.
- Neue wiederverwendbare Werkstoffeigenschafts-Visuals: `HaerteSchema`, `FestigkeitSchema`, `ZaehigkeitSproedigkeitSchema`, `ElastischPlastischSchema`, `DichteVergleichSchema`, `WaermeausdehnungSchema`, `KorrosionSchema`, `WerkstoffauswahlSchema`.
- Neue wiederverwendbare Werkstoffeigenschafts-Interaktionen: `HaerteTrainer`, `FestigkeitTrainer`, `ZaehigkeitSproedigkeitTrainer`, `ElastischPlastischTrainer`, `DichteVergleichTrainer`, `WaermeausdehnungTrainer`, `KorrosionTrainer`, `WerkstoffauswahlTrainer`.
- Alle acht Eigenschafts-Einheiten tragen Entwurfsstatus, offene Quellen-/Fundstellenhinweise, fachliche Freigabeanforderung und Mini-Wissenschecks mit stabilen `FK-1-WSE-*`-Mastery-Schluesseln.
- `PT-MEL` ist als Demo-Thema `Maschinenelemente` im Fallback sichtbar.
- Der Maschinenelemente-Block ist als zehn MDX-Lerneinheiten umgesetzt: `pt-mel-01-wellen-und-achsen-unterscheiden`, `pt-mel-02-lagerarten-ueberblicken`, `pt-mel-03-gleitlager-verstehen`, `pt-mel-04-waelzlager-verstehen`, `pt-mel-05-kupplungen`, `pt-mel-06-zahnradgetriebe`, `pt-mel-07-riemenantrieb`, `pt-mel-08-kettenantrieb`, `pt-mel-09-schrauben-und-muttern`, `pt-mel-10-federn-und-daempfer`.
- Neue wiederverwendbare Maschinenelemente-Visuals: `WelleAchseSchema`, `LagerartenSchema`, `GleitlagerSchema`, `WaelzlagerSchema`, `KupplungSchema`, `ZahnradgetriebeSchema`, `RiemenantriebSchema`, `KettenantriebSchema`, `SchraubenMutternSchema`, `FedernDaempferSchema`.
- Neue wiederverwendbare Maschinenelemente-Interaktionen: `WelleAchseTrainer`, `LagerartenTrainer`, `GleitlagerTrainer`, `WaelzlagerTrainer`, `KupplungTrainer`, `ZahnradgetriebeTrainer`, `RiemenantriebTrainer`, `KettenantriebTrainer`, `SchraubenMutternTrainer`, `FedernDaempferTrainer`.
- Alle zehn Maschinenelemente-Einheiten tragen Entwurfsstatus, offene Quellen-/Fundstellenhinweise, fachliche Freigabeanforderung und Mini-Wissenschecks mit stabilen `FK-1-MEL-*`-Mastery-Schluesseln. Kapitel 1 ist damit in Welle 4 vollstaendig umgesetzt.
- `PT-FER` ist als Demo-Thema `Fertigungsgrundlagen` im Fallback sichtbar.
- Der Fertigungsgrundlagen-Block ist als zehn MDX-Lerneinheiten umgesetzt: `pt-fer-01-sechs-hauptgruppen-der-fertigung`, `pt-fer-02-spanend-und-spanlos-unterscheiden`, `pt-fer-03-schnittbewegung-und-vorschub`, `pt-fer-04-schnittgeschwindigkeit`, `pt-fer-05-drehzahl-berechnen`, `pt-fer-06-vorschub-und-zustellung`, `pt-fer-07-standzeit-und-werkzeugverschleiss`, `pt-fer-08-kuehlschmierstoffe`, `pt-fer-09-werkzeugdaten-sicher-uebernehmen`, `pt-fer-10-bearbeitungszeit-grob-planen`.
- Neue wiederverwendbare Fertigungsgrundlagen-Visuals: `FertigungHauptgruppenSchema`, `SpanendSpanlosSchema`, `SchnittVorschubSchema`, `SchnittgeschwindigkeitSchema`, `DrehzahlBerechnenSchema`, `VorschubZustellungSchema`, `WerkzeugverschleissSchema`, `KuehlschmierstoffFertigungSchema`, `WerkzeugdatenSchema`, `BearbeitungszeitSchema`.
- Neue wiederverwendbare Fertigungsgrundlagen-Interaktionen: `FertigungHauptgruppenTrainer`, `SpanendSpanlosTrainer`, `SchnittVorschubTrainer`, `SchnittgeschwindigkeitTrainer`, `DrehzahlBerechnenTrainer`, `VorschubZustellungTrainer`, `WerkzeugverschleissTrainer`, `KuehlschmierstoffFertigungTrainer`, `WerkzeugdatenTrainer`, `BearbeitungszeitTrainer`.
- Alle zehn Fertigungsgrundlagen-Einheiten tragen Entwurfsstatus, offene Quellen-/Fundstellenhinweise, fachliche Freigabeanforderung und Mini-Wissenschecks mit stabilen `FK-2-FER-*`-Mastery-Schluesseln. Formel- und Werkzeugdaten-Themen bleiben bewusst `quellenpflichtig`.
- `PT-MET` ist als Demo-Thema `Metallbearbeitung` im Fallback sichtbar.
- Der Metallbearbeitungs-Block ist als zwanzig MDX-Lerneinheiten umgesetzt: `pt-met-01-saegen`, `pt-met-02-bohren`, `pt-met-03-senken-und-reiben`, `pt-met-04-gewindeschneiden`, `pt-met-05-drehen-grundlagen`, `pt-met-06-laengs-und-plandrehen`, `pt-met-07-fraesen-grundlagen`, `pt-met-08-umfangs-und-stirnfraesen`, `pt-met-09-schleifen`, `pt-met-10-stanzen-und-schneiden`, `pt-met-11-biegen`, `pt-met-12-walzen`, `pt-met-13-tiefziehen`, `pt-met-14-pressen`, `pt-met-15-schmieden`, `pt-met-16-giessen`, `pt-met-17-schweissen`, `pt-met-18-loeten`, `pt-met-19-kleben`, `pt-met-20-schrauben-und-nieten`.
- Neue wiederverwendbare Metallbearbeitungs-Visuals: `SaegeSchema`, `BohrenSchema`, `SenkenReibenSchema`, `GewindeschneidenSchema`, `DrehenGrundlagenSchema`, `LaengsPlanDrehenSchema`, `FraesenGrundlagenSchema`, `UmfangStirnFraesenSchema`, `SchleifenSchema`, `StanzenSchneidenSchema`, `BiegenSchema`, `WalzenSchema`, `TiefziehenSchema`, `PressenSchema`, `SchmiedenSchema`, `GiessenSchema`, `SchweissenSchema`, `LoetenSchema`, `KlebenSchema`, `SchraubenNietenSchema`.
- Neue wiederverwendbare Metallbearbeitungs-Interaktionen: `SaegeTrainer`, `BohrenTrainer`, `SenkenReibenTrainer`, `GewindeschneidenTrainer`, `DrehenGrundlagenTrainer`, `LaengsPlanDrehenTrainer`, `FraesenGrundlagenTrainer`, `UmfangStirnFraesenTrainer`, `SchleifenTrainer`, `StanzenSchneidenTrainer`, `BiegenTrainer`, `WalzenTrainer`, `TiefziehenTrainer`, `PressenTrainer`, `SchmiedenTrainer`, `GiessenTrainer`, `SchweissenTrainer`, `LoetenTrainer`, `KlebenTrainer`, `SchraubenNietenTrainer`.
- Alle zwanzig Metallbearbeitungs-Einheiten tragen Entwurfsstatus, offene Quellen-/Fundstellenhinweise, fachliche Freigabeanforderung und Mini-Wissenschecks mit stabilen `FK-2-MET-*`-Mastery-Schluesseln. Schnittwerte, Drehmomente, Presskraefte, Temperaturen und Datenblattangaben bleiben quellenpflichtig.
- `PT-KST` ist als Demo-Thema `Kunststoffverfahren` im Fallback sichtbar.
- Der Kunststoffverfahren-Block ist als fuenfundzwanzig MDX-Lerneinheiten umgesetzt: `pt-kst-01-spritzgiessmaschine-ueberblicken`, `pt-kst-02-materialtrichter-und-trocknung`, `pt-kst-03-schnecke-und-zylinder`, `pt-kst-04-einzugszone`, `pt-kst-05-kompressionszone`, `pt-kst-06-meteringzone`, `pt-kst-07-rueckstromsperre-und-duese`, `pt-kst-08-werkzeug-und-kavitaet`, `pt-kst-09-anguss-und-entlueftung`, `pt-kst-10-auswerfer-und-entformen`, `pt-kst-11-werkzeugtemperierung`, `pt-kst-12-plastifizieren-und-dosieren`, `pt-kst-13-einspritzen-und-umschaltpunkt`, `pt-kst-14-nachdruck`, `pt-kst-15-kuehlzeit-und-restkuehlzeit`, `pt-kst-16-schliesskraft`, `pt-kst-17-einspritzdruck-staudruck-temperaturen`, `pt-kst-18-kompletter-spritzgiesszyklus`, `pt-kst-19-extruder-aufbauen`, `pt-kst-20-profile-rohre-und-folien-extrudieren`, `pt-kst-21-blasformen`, `pt-kst-22-thermoformen`, `pt-kst-23-schwindung-und-verzug`, `pt-kst-24-molekuelorientierung-einfach`, `pt-kst-25-farbwechsel-und-materialwechsel`.
- Neue wiederverwendbare Kunststoffverfahren-Visuals: `SpritzgiessmaschineSchema`, `MaterialtrichterTrocknungSchema`, `SchneckeZylinderSchema`, `EinzugszoneSchema`, `KompressionszoneSchema`, `MeteringzoneSchema`, `RueckstromsperreDueseSchema`, `WerkzeugKavitaetSchema`, `AngussEntlueftungSchema`, `AuswerferEntformenSchema`, `WerkzeugtemperierungSchema`, `PlastifizierenDosierenSchema`, `EinspritzenUmschaltpunktSchema`, `NachdruckSchema`, `KuehlzeitRestkuehlzeitSchema`, `SchliesskraftSchema`, `SpritzgiessParameterSchema`, `SpritzgiesszyklusSchema`, `ExtruderAufbauSchema`, `ExtrusionsprodukteSchema`, `BlasformenSchema`, `ThermoformenSchema`, `SchwindungVerzugSchema`, `MolekuelorientierungSchema`, `FarbMaterialwechselSchema`.
- Neue wiederverwendbare Kunststoffverfahren-Interaktionen: `SpritzgiessmaschineTrainer`, `MaterialtrichterTrocknungTrainer`, `SchneckeZylinderTrainer`, `EinzugszoneTrainer`, `KompressionszoneTrainer`, `MeteringzoneTrainer`, `RueckstromsperreDueseTrainer`, `WerkzeugKavitaetTrainer`, `AngussEntlueftungTrainer`, `AuswerferEntformenTrainer`, `WerkzeugtemperierungTrainer`, `PlastifizierenDosierenTrainer`, `EinspritzenUmschaltpunktTrainer`, `NachdruckTrainer`, `KuehlzeitRestkuehlzeitTrainer`, `SchliesskraftTrainer`, `SpritzgiessParameterTrainer`, `SpritzgiesszyklusTrainer`, `ExtruderAufbauTrainer`, `ExtrusionsprodukteTrainer`, `BlasformenTrainer`, `ThermoformenTrainer`, `SchwindungVerzugTrainer`, `MolekuelorientierungTrainer`, `FarbMaterialwechselTrainer`.
- Alle fuenfundzwanzig Kunststoffverfahren-Einheiten tragen Entwurfsstatus, offene Quellen-/Fundstellenhinweise, fachliche Freigabeanforderung und Mini-Wissenschecks mit stabilen `FK-2-KST-*`-Mastery-Schluesseln. Druck-, Temperatur-, Zeit- und Einstellwerte bleiben bewusst quellenpflichtig.
- `PT-PRO` ist als Demo-Thema `Produktionsvorbereitung` im Fallback sichtbar.
- Der Produktionsvorbereitungs-Block ist als zwoelf MDX-Lerneinheiten umgesetzt: `pt-pro-01-auftrag-und-zeichnung-abgleichen`, `pt-pro-02-material-und-charge-pruefen`, `pt-pro-03-werkzeug-vorbereiten`, `pt-pro-04-maschine-ruesten`, `pt-pro-05-parameter-uebernehmen`, `pt-pro-06-erstteil-herstellen`, `pt-pro-07-erstteil-pruefen`, `pt-pro-08-produktionsfreigabe`, `pt-pro-09-werkzeugwechsel`, `pt-pro-10-anfahren-und-abfahren`, `pt-pro-11-schichtuebergabe`, `pt-pro-12-produktionsdaten-fuer-qualitaet-sichern`.
- Neue wiederverwendbare Produktionsvorbereitungs-Visuals: `AuftragZeichnungAbgleichSchema`, `MaterialChargePruefenSchema`, `WerkzeugVorbereitenSchema`, `MaschineRuestenSchema`, `ParameterUebernehmenSchema`, `ErstteilHerstellenSchema`, `ErstteilPruefenSchema`, `ProduktionsfreigabeSchema`, `WerkzeugwechselVorbereitungSchema`, `AnfahrenAbfahrenSchema`, `SchichtuebergabeSchema`, `ProduktionsdatenQualitaetSchema`.
- Neue wiederverwendbare Produktionsvorbereitungs-Interaktionen: `AuftragZeichnungAbgleichTrainer`, `MaterialChargePruefenTrainer`, `WerkzeugVorbereitenTrainer`, `MaschineRuestenTrainer`, `ParameterUebernehmenTrainer`, `ErstteilHerstellenTrainer`, `ErstteilPruefenTrainer`, `ProduktionsfreigabeTrainer`, `WerkzeugwechselVorbereitungTrainer`, `AnfahrenAbfahrenTrainer`, `SchichtuebergabeTrainer`, `ProduktionsdatenQualitaetTrainer`.
- Alle zwoelf Produktionsvorbereitungs-Einheiten tragen Entwurfsstatus, offene Quellen-/Fundstellenhinweise, fachliche Freigabeanforderung und Mini-Wissenschecks mit stabilen `FK-2-PRO-*`-Mastery-Schluesseln. Parameter-, Erstteilpruefungs-, Ruestzeit- und Ausschussquotenwerte sind als Quellenwerte markiert.
- `PT-QS` ist als Demo-Thema `Qualitaet und Pruefung` im Fallback sichtbar.
- Der Qualitaets-Block ist als neunzehn MDX-Lerneinheiten umgesetzt: `pt-qs-01-qualitaet-im-betrieb`, `pt-qs-02-sollwert-istwert-und-nennmass`, `pt-qs-03-grenzmasse-und-toleranz`, `pt-qs-04-pruefplan-lesen`, `pt-qs-05-pruefhaeufigkeit`, `pt-qs-06-erst-zwischen-und-endpruefung`, `pt-qs-07-sicht-mass-und-funktionspruefung`, `pt-qs-08-stichprobe-und-vollpruefung`, `pt-qs-09-gutteil-nacharbeit-ausschuss`, `pt-qs-10-fehlerquote-berechnen`, `pt-qs-11-mittelwert-und-spannweite`, `pt-qs-12-trend-und-prozessstreuung`, `pt-qs-13-normalverteilung-einfach`, `pt-qs-14-regelkarte-einfach-lesen`, `pt-qs-15-prozessfaehigkeit-cp-und-cpk`, `pt-qs-16-messunsicherheit-in-der-qs`, `pt-qs-17-rueckverfolgbarkeit-und-charge`, `pt-qs-18-pruefprotokoll-schreiben`, `pt-qs-19-sperrung-und-freigabe`.
- Neue wiederverwendbare Qualitaets-Visuals: `QualitaetBetriebSchema`, `SollIstNennmassSchema`, `GrenzmasseToleranzSchema`, `PruefplanLesenSchema`, `PruefhaeufigkeitSchema`, `PruefartenSchema`, `SichtMassFunktionspruefungSchema`, `StichprobeVollpruefungSchema`, `GutteilNacharbeitAusschussSchema`, `FehlerquoteBerechnenSchema`, `MittelwertSpannweiteSchema`, `TrendProzessstreuungSchema`, `NormalverteilungSchema`, `RegelkarteLesenSchema`, `ProzessfaehigkeitSchema`, `MessunsicherheitQsSchema`, `RueckverfolgbarkeitChargeSchema`, `PruefprotokollSchreibenSchema`, `SperrungFreigabeSchema`.
- Neue wiederverwendbare Qualitaets-Interaktionen: `QualitaetBetriebTrainer`, `SollIstNennmassTrainer`, `GrenzmasseToleranzTrainer`, `PruefplanLesenTrainer`, `PruefhaeufigkeitTrainer`, `PruefartenTrainer`, `SichtMassFunktionspruefungTrainer`, `StichprobeVollpruefungTrainer`, `GutteilNacharbeitAusschussTrainer`, `FehlerquoteBerechnenTrainer`, `MittelwertSpannweiteTrainer`, `TrendProzessstreuungTrainer`, `NormalverteilungTrainer`, `RegelkarteLesenTrainer`, `ProzessfaehigkeitTrainer`, `MessunsicherheitQsTrainer`, `RueckverfolgbarkeitChargeTrainer`, `PruefprotokollSchreibenTrainer`, `SperrungFreigabeTrainer`.
- Alle neunzehn Qualitaets-Einheiten tragen Entwurfsstatus, offene Quellen-/Fundstellenhinweise, fachliche Freigabeanforderung und Mini-Wissenschecks mit stabilen `FK-3-QS-*`-Mastery-Schluesseln. Toleranz-, Pruefhaeufigkeits-, Stichproben-, Fehlerquoten-, Statistik-, Regelkarten-, Cp/Cpk- und Messunsicherheitswerte sind als Quellenwerte markiert.
- `PT-FEM` ist als Demo-Thema `Metallfehler` im Fallback sichtbar.
- Der Metallfehler-Block ist als zehn MDX-Lerneinheiten umgesetzt: `pt-fem-01-grat-an-metallteilen`, `pt-fem-02-massabweichung-metall`, `pt-fem-03-rattermarken`, `pt-fem-04-schlechter-rundlauf`, `pt-fem-05-werkzeugbruch`, `pt-fem-06-werkzeugverschleiss`, `pt-fem-07-verformung-und-riss`, `pt-fem-08-schlechte-oberflaeche`, `pt-fem-09-haertefehler`, `pt-fem-10-korrosion-am-bauteil`.
- Neue wiederverwendbare Metallfehler-Visuals: `GratMetallSchema`, `MassabweichungMetallSchema`, `RattermarkenSchema`, `SchlechterRundlaufSchema`, `WerkzeugbruchSchema`, `WerkzeugverschleissMetallSchema`, `VerformungRissSchema`, `SchlechteOberflaecheSchema`, `HaertefehlerSchema`, `KorrosionBauteilSchema`.
- Neue wiederverwendbare Metallfehler-Interaktionen: `GratMetallTrainer`, `MassabweichungMetallTrainer`, `RattermarkenTrainer`, `SchlechterRundlaufTrainer`, `WerkzeugbruchTrainer`, `WerkzeugverschleissMetallTrainer`, `VerformungRissTrainer`, `SchlechteOberflaecheTrainer`, `HaertefehlerTrainer`, `KorrosionBauteilTrainer`.
- Alle zehn Metallfehler-Einheiten tragen Entwurfsstatus, offene Quellen-/Fundstellenhinweise, fachliche Freigabeanforderung und Mini-Wissenschecks mit stabilen `FK-3-FEM-*`-Mastery-Schluesseln. Grat-, Mass-, Schnittwert-, Rundlauf-, Verschleiss-, Oberflaechen- und Haerteangaben sind als Quellenwerte markiert.
- `PT-FEK` ist als Demo-Thema `Kunststofffehler` im Fallback sichtbar.
- Der Kunststofffehler-Block ist als vierzehn MDX-Lerneinheiten umgesetzt: `pt-fek-01-einfallstellen`, `pt-fek-02-lunker`, `pt-fek-03-grat-und-ueberspritzung`, `pt-fek-04-unterfuellung`, `pt-fek-05-fliessnaehte-und-bindenaehte`, `pt-fek-06-schlieren-und-feuchtigkeitsschlieren`, `pt-fek-07-verbrennungen-und-dieseleffekt`, `pt-fek-08-verzug`, `pt-fek-09-delamination`, `pt-fek-10-schwarze-punkte`, `pt-fek-11-farbabweichungen`, `pt-fek-12-anguss-und-auswerfermarken`, `pt-fek-13-massabweichungen-kunststoff`, `pt-fek-14-fehlerdiagnose-mit-5m`.
- Neue wiederverwendbare Kunststofffehler-Visuals: `EinfallstellenSchema`, `LunkerSchema`, `GratUeberspritzungSchema`, `UnterfuellungSchema`, `FliessnaehteBindenaehteSchema`, `SchlierenFeuchtigkeitSchema`, `VerbrennungDieseleffektSchema`, `VerzugKunststoffSchema`, `DelaminationSchema`, `SchwarzePunkteSchema`, `FarbabweichungSchema`, `AngussAuswerfermarkenSchema`, `MassabweichungKunststoffSchema`, `Fehlerdiagnose5MSchema`.
- Neue wiederverwendbare Kunststofffehler-Interaktionen: `EinfallstellenTrainer`, `LunkerTrainer`, `GratUeberspritzungTrainer`, `UnterfuellungTrainer`, `FliessnaehteBindenaehteTrainer`, `SchlierenFeuchtigkeitTrainer`, `VerbrennungDieseleffektTrainer`, `VerzugKunststoffTrainer`, `DelaminationTrainer`, `SchwarzePunkteTrainer`, `FarbabweichungTrainer`, `AngussAuswerfermarkenTrainer`, `MassabweichungKunststoffTrainer`, `Fehlerdiagnose5MTrainer`.
- Alle vierzehn Kunststofffehler-Einheiten tragen Entwurfsstatus, offene Quellen-/Fundstellenhinweise, fachliche Freigabeanforderung und Mini-Wissenschecks mit stabilen `FK-3-FEK-*`-Mastery-Schluesseln. Nachdruck-, Fuell-, Trocknungs-, Entlueftungs-, Verzugs-, Farb- und Massangaben sind als Quellenwerte markiert.
- `PT-STR` ist als Demo-Thema `Steuerung` im Fallback sichtbar.
- Der Steuerungs-Block ist als zehn MDX-Lerneinheiten umgesetzt: `pt-str-01-sensor-aktor-steuerung`, `pt-str-02-steuerung-und-regelung`, `pt-str-03-sollwert-istwert-stellgroesse`, `pt-str-04-sps-grundlagen`, `pt-str-05-eingang-und-ausgang`, `pt-str-06-und-oder-und-verriegelung`, `pt-str-07-endschalter-und-lichtschranke`, `pt-str-08-induktive-und-kapazitive-sensoren`, `pt-str-09-temperatur-und-drucksensoren`, `pt-str-10-elektromotor-und-frequenzumrichter`.
- Neue wiederverwendbare Steuerungs-Visuals: `SensorAktorSteuerungSchema`, `SteuerungRegelungSchema`, `SollIstStellgroesseSchema`, `SpsGrundlagenSchema`, `EingangAusgangSchema`, `UndOderVerriegelungSchema`, `EndschalterLichtschrankeSchema`, `InduktivKapazitivSensorSchema`, `TemperaturDrucksensorenSchema`, `ElektromotorFrequenzumrichterSchema`.
- Neue wiederverwendbare Steuerungs-Interaktionen: `SensorAktorSteuerungTrainer`, `SteuerungRegelungTrainer`, `SollIstStellgroesseTrainer`, `SpsGrundlagenTrainer`, `EingangAusgangTrainer`, `UndOderVerriegelungTrainer`, `EndschalterLichtschrankeTrainer`, `InduktivKapazitivSensorTrainer`, `TemperaturDrucksensorenTrainer`, `ElektromotorFrequenzumrichterTrainer`.
- Alle zehn Steuerungs-Einheiten tragen Entwurfsstatus, offene Quellen-/Fundstellenhinweise, fachliche Freigabeanforderung und Mini-Wissenschecks mit stabilen `FK-3-STR-*`-Mastery-Schluesseln. Soll-/Istwerte, Sensorabstaende, Druck-/Temperaturwerte, p=F/A-Bezug und FU-Parameter sind als Quellenwerte markiert.
- `PT-PNH` ist als Demo-Thema `Pneumatik und Hydraulik` im Fallback sichtbar.
- Der Pneumatik-/Hydraulik-Block ist als sechs MDX-Lerneinheiten umgesetzt: `pt-pnh-01-druckluftanlage-ueberblicken`, `pt-pnh-02-wartungseinheit`, `pt-pnh-03-ventile-und-drosseln`, `pt-pnh-04-einfachwirkender-zylinder`, `pt-pnh-05-doppeltwirkender-zylinder`, `pt-pnh-06-hydraulik-grundlagen`.
- Neue wiederverwendbare Pneumatik-/Hydraulik-Visuals: `DruckluftanlageSchema`, `WartungseinheitSchema`, `VentileDrosselnSchema`, `EinfachwirkenderZylinderSchema`, `DoppeltwirkenderZylinderSchema`, `HydraulikGrundlagenSchema`.
- Neue wiederverwendbare Pneumatik-/Hydraulik-Interaktionen: `DruckluftanlageTrainer`, `WartungseinheitTrainer`, `VentileDrosselnTrainer`, `EinfachwirkenderZylinderTrainer`, `DoppeltwirkenderZylinderTrainer`, `HydraulikGrundlagenTrainer`.
- Alle sechs Pneumatik-/Hydraulik-Einheiten tragen Entwurfsstatus, offene Quellen-/Fundstellenhinweise, fachliche Freigabeanforderung und Mini-Wissenschecks mit stabilen `FK-3-PNH-*`-Mastery-Schluesseln. Druck-, Drossel-, Bewegungszeit-, p=F/A-, Betriebsdruck-, Oel- und Leckagevorgaben sind als Quellenwerte markiert.
- `PT-IH` ist als Demo-Thema `Instandhaltung` im Fallback sichtbar.
- Der Instandhaltungs-Block ist als vierzehn MDX-Lerneinheiten umgesetzt: `pt-ih-01-wartung-inspektion-instandsetzung`, `pt-ih-02-vorbeugende-instandhaltung`, `pt-ih-03-schmierung-und-schmierplan`, `pt-ih-04-verschleiss-und-reibung`, `pt-ih-05-temperatur-schwingung-geraeusch`, `pt-ih-06-leckage-erkennen`, `pt-ih-07-lagerfehler`, `pt-ih-08-unwucht-und-fehlausrichtung`, `pt-ih-09-stoerung-fehler-ursache-wirkung`, `pt-ih-10-5-why`, `pt-ih-11-ishikawa-diagramm`, `pt-ih-12-stoerung-dokumentieren`, `pt-ih-13-sichere-fehlersuche`, `pt-ih-14-verbesserung-nach-stoerung`.
- Neue wiederverwendbare Instandhaltungs-Visuals: `WartungInspektionInstandsetzungSchema`, `VorbeugendeInstandhaltungSchema`, `SchmierungSchmierplanSchema`, `VerschleissReibungSchema`, `TemperaturSchwingungGeraeuschSchema`, `LeckageErkennenSchema`, `LagerfehlerSchema`, `UnwuchtFehlausrichtungSchema`, `StoerungFehlerUrsacheWirkungSchema`, `FiveWhySchema`, `IshikawaDiagrammSchema`, `StoerungDokumentierenSchema`, `SichereFehlersucheSchema`, `VerbesserungNachStoerungSchema`.
- Neue wiederverwendbare Instandhaltungs-Interaktionen: `WartungInspektionInstandsetzungTrainer`, `VorbeugendeInstandhaltungTrainer`, `SchmierungSchmierplanTrainer`, `VerschleissReibungTrainer`, `TemperaturSchwingungGeraeuschTrainer`, `LeckageErkennenTrainer`, `LagerfehlerTrainer`, `UnwuchtFehlausrichtungTrainer`, `StoerungFehlerUrsacheWirkungTrainer`, `FiveWhyTrainer`, `IshikawaDiagrammTrainer`, `StoerungDokumentierenTrainer`, `SichereFehlersucheTrainer`, `VerbesserungNachStoerungTrainer`.
- Alle vierzehn Instandhaltungs-Einheiten tragen Entwurfsstatus, offene Quellen-/Fundstellenhinweise, fachliche Freigabeanforderung und Mini-Wissenschecks mit stabilen `FK-3-IH-*`-Mastery-Schluesseln. Wartungsintervalle, Schmiermengen, Zustandsgrenzen, Messwerte, Ausrichttoleranzen, Sicherheitsfreigaben und KVP-Standards sind als Quellenwerte oder offene Vorgaben markiert. Kapitel 3 ist damit in Welle 6 vollstaendig umgesetzt.
- `PT-PLA` ist als Demo-Thema `Planung` im Fallback sichtbar.
- Der Planungs-Block ist als zehn MDX-Lerneinheiten umgesetzt: `pt-pla-01-fertigungsauftrag-verstehen`, `pt-pla-02-arbeitsfolge-planen`, `pt-pla-03-stueckliste-und-materialbedarf`, `pt-pla-04-personal-und-maschinenbedarf`, `pt-pla-05-maschinenbelegung-und-kapazitaet`, `pt-pla-06-taktzeit-und-zykluszeit`, `pt-pla-07-durchlaufzeit`, `pt-pla-08-ruestzeit-und-bearbeitungszeit`, `pt-pla-09-stillstandszeit`, `pt-pla-10-liefertermin-und-losgroesse`.
- Neue wiederverwendbare Planungs-Visuals: `FertigungsauftragSchema`, `ArbeitsfolgePlanenSchema`, `StuecklisteMaterialbedarfSchema`, `PersonalMaschinenbedarfSchema`, `MaschinenbelegungKapazitaetSchema`, `TaktzeitZykluszeitSchema`, `DurchlaufzeitSchema`, `RuestzeitBearbeitungszeitSchema`, `StillstandszeitSchema`, `LieferterminLosgroesseSchema`.
- Neue wiederverwendbare Planungs-Interaktionen: `FertigungsauftragTrainer`, `ArbeitsfolgePlanenTrainer`, `StuecklisteMaterialbedarfTrainer`, `PersonalMaschinenbedarfTrainer`, `MaschinenbelegungKapazitaetTrainer`, `TaktzeitZykluszeitTrainer`, `DurchlaufzeitTrainer`, `RuestzeitBearbeitungszeitTrainer`, `StillstandszeitTrainer`, `LieferterminLosgroesseTrainer`.
- Alle zehn Planungs-Einheiten tragen Entwurfsstatus, offene Quellen-/Fundstellenhinweise, fachliche Freigabeanforderung und Mini-Wissenschecks mit stabilen `FK-4-PLA-*`-Mastery-Schluesseln. Auftragsdaten, Materialbedarf, Kapazitaetswerte, Zeitarten, Takt-/Zykluszeit, Stillstandsgruende, Termine und Losgroessen bleiben als Quellenwerte oder offene Vorgaben markiert.
- `PT-LAG` ist als Demo-Thema `Lager` im Fallback sichtbar.
- Der Lager-Block ist als vier MDX-Lerneinheiten umgesetzt: `pt-lag-01-bestand-und-mindestbestand`, `pt-lag-02-meldebestand-und-sicherheitsbestand`, `pt-lag-03-fifo`, `pt-lag-04-kanban-grundprinzip`.
- Neue wiederverwendbare Lager-Visuals: `BestandMindestbestandSchema`, `MeldebestandSicherheitsbestandSchema`, `FifoSchema`, `KanbanGrundprinzipSchema`.
- Neue wiederverwendbare Lager-Interaktionen: `BestandMindestbestandTrainer`, `MeldebestandSicherheitsbestandTrainer`, `FifoTrainer`, `KanbanGrundprinzipTrainer`.
- Alle vier Lager-Einheiten tragen Entwurfsstatus, offene Quellen-/Fundstellenhinweise, fachliche Freigabeanforderung und Mini-Wissenschecks mit stabilen `FK-4-LAG-*`-Mastery-Schluesseln. Bestandsgrenzen, Meldebestand, Sicherheitsbestand, Kanban-Mengen und Nachfuellregeln bleiben als Quellenwerte oder offene Vorgaben markiert.
- `PT-LEAN` ist als Demo-Thema `Lean` im Fallback sichtbar.
- Der Lean-Block ist als drei MDX-Lerneinheiten umgesetzt: `pt-lean-01-wertschoepfung-und-verschwendung`, `pt-lean-02-5s-wiederholen`, `pt-lean-03-kvp-im-team`.
- Neue wiederverwendbare Lean-Visuals: `WertschoepfungVerschwendungSchema`, `FuenfSWiederholenSchema`, `KvpImTeamSchema`.
- Neue wiederverwendbare Lean-Interaktionen: `WertschoepfungVerschwendungTrainer`, `FuenfSWiederholenTrainer`, `KvpImTeamTrainer`.
- Alle drei Lean-Einheiten tragen Entwurfsstatus, offene Quellen-/Fundstellenhinweise, fachliche Freigabeanforderung und Mini-Wissenschecks mit stabilen `FK-4-LEAN-*`-Mastery-Schluesseln. Betriebliche Verschwendungsarten, 5S-Standards und KVP-Freigabewege bleiben als offene Vorgaben markiert.
- `PT-OEE` ist als Demo-Thema `OEE` im Fallback sichtbar; fuenf MDX-Einheiten `pt-oee-01` bis `pt-oee-05` mit Visual, Interaktion und Mini-Wissenscheck.
- `PT-MAT` ist als Demo-Thema `Technische Mathematik` im Fallback sichtbar; 24 MDX-Einheiten `pt-mat-01` bis `pt-mat-24`.
- `PT-WISO` ist als Demo-Thema `Wirtschafts- und Sozialkunde` im Fallback sichtbar; 12 MDX-Einheiten `pt-wiso-01` bis `pt-wiso-12`.
- `PT-PRF` ist als Demo-Thema `Pruefungsvorbereitung` im Fallback sichtbar; 16 MDX-Einheiten `pt-prf-01` bis `pt-prf-16`.
- BER-Luecke geschlossen: `pt-ber-04` bis `pt-ber-08` ergaenzen die Matrix-IDs `FK-1-BER-004` bis `FK-1-BER-008`.
- Kapitel 4 und die Content-Matrix sind damit als Entwurf vollstaendig abgedeckt. Fachliche Freigabe, belastbare Quellenwerte, Figma-Screens und zentrale Glossar-/Formel-Produkte bleiben Welle-8-Themen.

## 6. Figma-Artefakte

Figma-Datei: https://www.figma.com/design/wr0cGrNxC6kpOV1TalCgx9  
Account: Professional + Full Seat (Stand Welle 8).

| Bereich | Artefakte |
|---|---|
| Foundations | `00 Foundations`: Farbvariablen mit Light/Dark-Modi in `BZE Color Light`, Spacing, Radius, Typografie, Schatten. |
| Learning Components | `01 Learning Components` + 11 Components: Story, Einfach, Fachlich, Praxisbeispiel, Merksatz, Tabellenbuch, Formelkarte, Wissensstufen, Messschieber-Schema, Mini-Wissenscheck, Pruefungsrelevanz-Badge. |
| Technical Illustrations | `04 Technical Illustrations`: 8 Illustration-Components (Toleranzfeld, Welle/Bohrung, Spritzgiessmaschine, Einfallstelle, Schnecke/Zylinder, Aussenmessung, Innen/Tiefenmessung, Spritzgiesszyklus) plus Messschieber-Schema. |
| Screens | `02 Screens`: 8 Screens inkl. Toleranzfeld und Spritzgiesszyklus. |
| Prototypes | `03 Prototypes`: 3 Click-Flows — Messschieber-Slice, Toleranzfeld→Diagnose, Spritzgiesszyklus↔Fehlerdiagnose. |
| Gamification | `05 Gamification`: Ausbildungsreise mit vier Bereichen + Sammelkarten-Werkzeugkoffer (ohne Score-Druck). |

Designregel: Beschriftungen werden als editierbare Figma-Texte oder spaeter als Frontend-Overlays gefuehrt, nicht fest in Exportbilder eingebrannt.

Figma-Hinweis: Light/Dark sind nach dem Pro-Upgrade als Modi in `BZE Color Light` gefuehrt. `BZE Color Dark Reference` bleibt als Referenzquelle bestehen.

## 7. Offene Entscheidungen

- Ob Formeln als eigene Tabelle, als `content_elemente`-Spezialisierung oder kombiniert gespeichert werden.
- Ob `glossar_begriffe` additiv erweitert wird oder eine neue `fachbegriffe`-Registry mit Synonymen, Beziehungen und Reviewstatus erhaelt.
- Welche Tabellenbuchauflage und welche BZE-Skripte als verbindliche Quellen fuer den Pilot gelten.
- Ob interaktive Visuals im UI-Paket oder fachnah in der Topic-Route starten und spaeter extrahiert werden.
- Ob die Figma-Datei nach einem Upgrade oder Handoff in eine echte Multi-Mode-Token-Library ueberfuehrt wird.

## 8. Naechstes Arbeitspaket

Wellen 0–8 sind technisch abgeschlossen. Inhalt bleibt `entwurf`, bis Ausbilder Fundstellen setzen und freigeben.

Erledigt in Welle 8:
- Freigabeinventar + Admin-Review
- Glossar-/Formel- und Lernereignis-Schemas
- Struktur-/A11y-Audit
- Figma Screens, Prototyp, Dark-Mode, fehlende Components

Naechstes fachliches Paket: Ausbilderfreigabe. Optional Produkt: DB-Import Glossar/Formel/Quiz und Analytics-Persistenz.
