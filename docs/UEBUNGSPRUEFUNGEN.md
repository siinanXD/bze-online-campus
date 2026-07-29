# Übungsprüfungen und Fragenpools – Aufbau und Lösungsspiegel

Fragenpools liegen unter `supabase/seed/<KUERZEL>_Fragenpool_*.json`. Jede Datei gehört über
`meta.beruf_slug` zu genau einem Bildungsangebot; mehrere Chargen desselben Angebots werden
zusammengeführt.

**Alle Aufgaben sind Eigenentwicklungen des BZE.** Übernommen wurde nur die Prüfungs*struktur*
(Aufgabenzahl, Antwortformat, Themenverteilung), keine Aufgabentexte von Kammern oder
Prüfungsverlagen.

## Vor der Freigabe zu erledigen

- Alle Fragen stehen auf `status = entwurf`. Die Freigabe durch einen Ausbilder ist zwingend.
- Fragen mit `enthaelt_zahlenwert = true` brauchen eine Tabellenbuch- oder Normfundstelle und
  stehen deshalb auf `kern = false`. `scripts/pruefe_fragenpool.py` listet sie als Warnung auf.
- Bei allen Angeboten außer dem Piloten MAF sind `gewichtung_prozent` und
  `pruefungsdauer_minuten` der Prüfungsbereiche bewusst leer. Sie sind aus der geltenden
  Ausbildungsordnung und den Vorgaben der zuständigen Kammer einzutragen – nicht zu schätzen.
- Sicherheitskritische Themen (Hochvolt im Kfz, die fünf Sicherheitsregeln in der Elektrotechnik,
  Schweißerlaubnis) dürfen nur von einer fachlich qualifizierten Person freigegeben werden.

## Werkzeuge

```
python3 scripts/pruefe_fragenpool.py     # Struktur, Lösungsanzahl, Punktesummen, Referenzen
python3 scripts/generate_seed.py         # erzeugt supabase/seed/0001_maf_seed.sql
```

Die Spalte „Richtige Antwort“ bezieht sich auf die Reihenfolge im JSON. Zeigt die App die
Optionen gemischt an, gilt der Spiegel nur für den gedruckten Satz aus dieser Datei.

## Übersicht

| Angebot | Kammer | Prüfungsbereiche | MC | Freitext | Übungsprüfungen |
|---|---|---:|---:|---:|---:|
| Elektroniker/-in für Betriebstechnik | IHK | 3 | 20 | 3 | 1 |
| Fachlagerist/-in | IHK | 3 | 18 | 3 | 1 |
| Industriemechaniker/-in | IHK | 3 | 20 | 3 | 1 |
| Kfz-Mechatroniker/-in | HWK | 3 | 18 | 3 | 1 |
| Maschinen- und Anlagenführer/-in | IHK | 3 | 119 | 19 | 2 |
| Schweißtechnik (modulare Lehrgänge) | IHK | 2 | 16 | 2 | 1 |
| Tischler/-in | HWK | 3 | 18 | 3 | 1 |

## Elektroniker/-in für Betriebstechnik

> Gewichtung und Prüfungsdauer der Prüfungsbereiche sind leer gelassen und vom Ausbilder anhand der geltenden Ausbildungsordnung und der Vorgaben der IHK Aachen einzutragen.

> **Sicherheitshinweis:** Fragen zu den fünf Sicherheitsregeln und zum Arbeiten unter Spannung sind sicherheitskritisch. Sie dürfen nur nach fachlicher Prüfung durch eine Elektrofachkraft freigegeben werden.

Prüfungsbereiche und Themen:

- **Elektrotechnische Grundlagen** (`EBT-GR`): Grundgrößen und Gesetze, Schaltpläne und Bauelemente
- **Installations- und Betriebstechnik** (`EBT-IN`): Anlagen, Betriebsmittel und Motoren, Schutzmaßnahmen und Prüfungen, Automatisierung und Steuerungstechnik
- **Wirtschafts- und Sozialkunde** (`EBT-WISO`): Arbeitsrecht und Arbeitssicherheit, Betriebliche Zusammenhänge

### Übungsprüfung Elektroniker für Betriebstechnik – Grundlagen (`EBT-UE-01`)

Bearbeitungszeit: 60 Minuten. 20 Aufgaben mit je fünf Auswahlantworten, genau eine Antwort ist richtig.

| Nr. | Frage-ID | Thema | Richtige Antwort |
|---:|---|---|---:|
| 1 | EBT-GR-GG-101 | EBT-GR-GG | 3 |
| 2 | EBT-GR-GG-102 | EBT-GR-GG | 3 |
| 3 | EBT-GR-GG-103 | EBT-GR-GG | 1 |
| 4 | EBT-GR-GG-104 | EBT-GR-GG | 1 |
| 5 | EBT-GR-GG-105 | EBT-GR-GG | 1 |
| 6 | EBT-GR-SP-101 | EBT-GR-SP | 3 |
| 7 | EBT-GR-SP-102 | EBT-GR-SP | 1 |
| 8 | EBT-GR-SP-103 | EBT-GR-SP | 2 |
| 9 | EBT-IN-AN-101 | EBT-IN-AN | 4 |
| 10 | EBT-IN-AN-102 | EBT-IN-AN | 5 |
| 11 | EBT-IN-AN-103 | EBT-IN-AN | 5 |
| 12 | EBT-IN-SC-101 | EBT-IN-SC | 4 |
| 13 | EBT-IN-SC-102 | EBT-IN-SC | 3 |
| 14 | EBT-IN-SC-103 | EBT-IN-SC | 2 |
| 15 | EBT-IN-SC-104 | EBT-IN-SC | 5 |
| 16 | EBT-IN-AU-101 | EBT-IN-AU | 2 |
| 17 | EBT-IN-AU-102 | EBT-IN-AU | 3 |
| 18 | EBT-WISO-AR-101 | EBT-WISO-AR | 5 |
| 19 | EBT-WISO-AR-102 | EBT-WISO-AR | 4 |
| 20 | EBT-WISO-BW-101 | EBT-WISO-BW | 4 |

Freitextaufgaben:

| Frage-ID | Thema | Punkte |
|---|---|---:|
| EBT-IN-F01 | EBT-IN-SC | 7 |
| EBT-GR-F01 | EBT-GR-GG | 6 |
| EBT-IN-F02 | EBT-IN-AN | 6 |

## Fachlagerist/-in

> Gewichtung und Prüfungsdauer der Prüfungsbereiche sind leer gelassen und vom Ausbilder nach der geltenden Ausbildungsordnung und den Vorgaben der IHK Aachen einzutragen. Die Inhalte sind so gewählt, dass sie auch als Grundlage für die Fachkraft für Lagerlogistik tragen.

Prüfungsbereiche und Themen:

- **Lagerprozesse** (`FLA-LA`): Wareneingang und Warenkontrolle, Lagerung und Bestandsführung, Kommissionierung und Warenausgang
- **Transport und Ladungssicherung** (`FLA-TR`): Flurförderzeuge und Fördermittel, Verpackung und Ladungssicherung
- **Wirtschafts- und Sozialkunde** (`FLA-WISO`): Arbeitssicherheit und Umweltschutz, Betriebliche Zusammenhänge

### Übungsprüfung Fachlagerist – Grundlagen (`FLA-UE-01`)

Bearbeitungszeit: 60 Minuten. 18 Aufgaben mit je fünf Auswahlantworten, genau eine Antwort ist richtig.

| Nr. | Frage-ID | Thema | Richtige Antwort |
|---:|---|---|---:|
| 1 | FLA-LA-WE-101 | FLA-LA-WE | 5 |
| 2 | FLA-LA-WE-102 | FLA-LA-WE | 3 |
| 3 | FLA-LA-WE-103 | FLA-LA-WE | 5 |
| 4 | FLA-LA-LG-101 | FLA-LA-LG | 4 |
| 5 | FLA-LA-LG-102 | FLA-LA-LG | 5 |
| 6 | FLA-LA-LG-103 | FLA-LA-LG | 4 |
| 7 | FLA-LA-LG-104 | FLA-LA-LG | 2 |
| 8 | FLA-LA-KO-101 | FLA-LA-KO | 2 |
| 9 | FLA-LA-KO-102 | FLA-LA-KO | 3 |
| 10 | FLA-LA-KO-103 | FLA-LA-KO | 1 |
| 11 | FLA-TR-FF-101 | FLA-TR-FF | 3 |
| 12 | FLA-TR-FF-102 | FLA-TR-FF | 4 |
| 13 | FLA-TR-FF-103 | FLA-TR-FF | 5 |
| 14 | FLA-TR-LS-101 | FLA-TR-LS | 5 |
| 15 | FLA-TR-LS-102 | FLA-TR-LS | 2 |
| 16 | FLA-WISO-SU-101 | FLA-WISO-SU | 4 |
| 17 | FLA-WISO-SU-102 | FLA-WISO-SU | 3 |
| 18 | FLA-WISO-BW-101 | FLA-WISO-BW | 4 |

Freitextaufgaben:

| Frage-ID | Thema | Punkte |
|---|---|---:|
| FLA-LA-F01 | FLA-LA-WE | 6 |
| FLA-TR-F01 | FLA-TR-LS | 5 |
| FLA-WISO-F01 | FLA-LA-LG | 6 |

## Industriemechaniker/-in

> Die Prüfungsbereiche bilden die schriftlichen Bereiche des Berufs ab. Gewichtung und Prüfungsdauer sind bewusst leer gelassen und vom Ausbilder anhand der geltenden Ausbildungsordnung und der Vorgaben der IHK Aachen einzutragen.

Prüfungsbereiche und Themen:

- **Fertigungstechnik** (`IM-FT`): Technische Zeichnungen und Toleranzen, Spanende Fertigung, Werkstoffe und Wärmebehandlung
- **Betriebstechnik** (`IM-BT`): Montage und Verbindungstechnik, Instandhaltung und Wartung, Steuerungstechnik, Hydraulik und Pneumatik
- **Wirtschafts- und Sozialkunde** (`IM-WISO`): Arbeitsrecht und Arbeitssicherheit, Betriebliche Zusammenhänge

### Übungsprüfung Industriemechaniker – Grundlagen (`IM-UE-01`)

Bearbeitungszeit: 60 Minuten. 20 Aufgaben mit je fünf Auswahlantworten, genau eine Antwort ist richtig.

| Nr. | Frage-ID | Thema | Richtige Antwort |
|---:|---|---|---:|
| 1 | IM-FT-ZE-101 | IM-FT-ZE | 3 |
| 2 | IM-FT-ZE-102 | IM-FT-ZE | 3 |
| 3 | IM-FT-ZE-103 | IM-FT-ZE | 4 |
| 4 | IM-FT-ZE-104 | IM-FT-ZE | 3 |
| 5 | IM-FT-SP-101 | IM-FT-SP | 5 |
| 6 | IM-FT-SP-102 | IM-FT-SP | 1 |
| 7 | IM-FT-SP-103 | IM-FT-SP | 3 |
| 8 | IM-FT-SP-104 | IM-FT-SP | 2 |
| 9 | IM-FT-WS-101 | IM-FT-WS | 2 |
| 10 | IM-FT-WS-102 | IM-FT-WS | 2 |
| 11 | IM-BT-MO-101 | IM-BT-MO | 2 |
| 12 | IM-BT-MO-102 | IM-BT-MO | 2 |
| 13 | IM-BT-IH-101 | IM-BT-IH | 2 |
| 14 | IM-BT-IH-102 | IM-BT-IH | 5 |
| 15 | IM-BT-ST-101 | IM-BT-ST | 2 |
| 16 | IM-BT-ST-102 | IM-BT-ST | 4 |
| 17 | IM-BT-ST-103 | IM-BT-ST | 1 |
| 18 | IM-WISO-AR-101 | IM-WISO-AR | 4 |
| 19 | IM-WISO-AR-102 | IM-WISO-AR | 2 |
| 20 | IM-WISO-BW-101 | IM-WISO-BW | 4 |

Freitextaufgaben:

| Frage-ID | Thema | Punkte |
|---|---|---:|
| IM-FT-F01 | IM-FT-SP | 5 |
| IM-BT-F01 | IM-BT-IH | 6 |
| IM-WISO-F01 | IM-WISO-BW | 5 |

## Kfz-Mechatroniker/-in

> Zuständige Stelle vor Freigabe prüfen: Der Beruf wird sowohl im Handwerk als auch in der Industrie ausgebildet. Voreingestellt ist die Handwerkskammer; Gewichtung und Prüfungsdauer sind vom Ausbilder einzutragen.

> **Sicherheitshinweis:** Fragen zu Hochvoltsystemen sind sicherheitskritisch und dürfen nur nach Prüfung durch eine für HV-Systeme qualifizierte Fachkraft freigegeben werden.

Prüfungsbereiche und Themen:

- **Fahrzeugtechnik** (`KFZ-FZ`): Motor und Antrieb, Fahrwerk, Bremsen und Räder, Fahrzeugelektrik und Hochvolt
- **Service und Diagnose** (`KFZ-SE`): Diagnose und Messtechnik, Wartung und Kundendienst
- **Wirtschafts- und Sozialkunde** (`KFZ-WISO`): Arbeitssicherheit und Umweltschutz, Kundenauftrag und Betrieb

### Übungsprüfung Kfz-Mechatroniker – Grundlagen (`KFZ-UE-01`)

Bearbeitungszeit: 60 Minuten. 18 Aufgaben mit je fünf Auswahlantworten, genau eine Antwort ist richtig.

| Nr. | Frage-ID | Thema | Richtige Antwort |
|---:|---|---|---:|
| 1 | KFZ-FZ-MO-101 | KFZ-FZ-MO | 3 |
| 2 | KFZ-FZ-MO-102 | KFZ-FZ-MO | 4 |
| 3 | KFZ-FZ-MO-103 | KFZ-FZ-MO | 4 |
| 4 | KFZ-FZ-MO-104 | KFZ-FZ-MO | 5 |
| 5 | KFZ-FZ-FW-101 | KFZ-FZ-FW | 5 |
| 6 | KFZ-FZ-FW-102 | KFZ-FZ-FW | 1 |
| 7 | KFZ-FZ-FW-103 | KFZ-FZ-FW | 1 |
| 8 | KFZ-FZ-FW-104 | KFZ-FZ-FW | 3 |
| 9 | KFZ-FZ-EL-101 | KFZ-FZ-EL | 3 |
| 10 | KFZ-FZ-EL-102 | KFZ-FZ-EL | 4 |
| 11 | KFZ-FZ-EL-103 | KFZ-FZ-EL | 1 |
| 12 | KFZ-SE-DI-101 | KFZ-SE-DI | 3 |
| 13 | KFZ-SE-DI-102 | KFZ-SE-DI | 4 |
| 14 | KFZ-SE-WA-101 | KFZ-SE-WA | 3 |
| 15 | KFZ-SE-WA-102 | KFZ-SE-WA | 3 |
| 16 | KFZ-WISO-SU-101 | KFZ-WISO-SU | 2 |
| 17 | KFZ-WISO-SU-102 | KFZ-WISO-SU | 4 |
| 18 | KFZ-WISO-BW-101 | KFZ-WISO-BW | 1 |

Freitextaufgaben:

| Frage-ID | Thema | Punkte |
|---|---|---:|
| KFZ-FZ-F01 | KFZ-FZ-FW | 6 |
| KFZ-SE-F01 | KFZ-SE-DI | 6 |
| KFZ-WISO-F01 | KFZ-WISO-SU | 6 |

## Maschinen- und Anlagenführer/-in

Prüfungsbereiche und Themen:

- **Produktionstechnik** (`PT`): Technische Unterlagen, Werkstoffe, Werkzeuge, Funktion von Maschinen und Anlagen, Prüfverfahren und Prüfmittel, Fertigungstechniken
- **Produktionsplanung** (`PP`): Arbeitsschritte, Qualitätssicherung, Vorbeugende Instandhaltung, Produktionsanlagen, Übergabeprotokoll
- **Wirtschafts- und Sozialkunde** (`WISO`): Berufsbildung, Arbeits- und Tarifrecht, Sozialversicherung und Mitbestimmung, Wirtschaftliche Zusammenhänge, Arbeitssicherheit und Umweltschutz

### Übungs-Zwischenprüfung 01 – Metall- und Kunststofftechnik (`ZP-UE-01`)

Bearbeitungszeit: 120 Minuten. 35 Aufgaben mit je fünf Auswahlantworten. Genau eine Antwort ist richtig. Aufgaben 31 bis 35 sind Rechenaufgaben; Nebenrechnungen sind erlaubt und werden nicht bewertet.

| Nr. | Frage-ID | Thema | Richtige Antwort |
|---:|---|---|---:|
| 1 | PT-TU-101 | PT-TU | 2 |
| 2 | PT-TU-102 | PT-TU | 4 |
| 3 | PT-TU-103 | PT-TU | 2 |
| 4 | PT-TU-104 | PT-TU | 3 |
| 5 | PT-TU-105 | PT-TU | 3 |
| 6 | PT-TU-106 | PT-TU | 5 |
| 7 | PT-TU-107 | PT-TU | 1 |
| 8 | PT-TU-108 | PT-TU | 2 |
| 9 | WISO-SU-101 | WISO-SU | 1 |
| 10 | WISO-SU-102 | WISO-SU | 4 |
| 11 | PT-WS-101 | PT-WS | 4 |
| 12 | PT-WS-102 | PT-WS | 5 |
| 13 | PT-WS-103 | PT-WS | 3 |
| 14 | PT-WS-104 | PT-WS | 1 |
| 15 | PT-WS-105 | PT-WS | 1 |
| 16 | PT-WS-106 | PT-WS | 5 |
| 17 | PT-FT-104 | PT-FT | 2 |
| 18 | PT-FT-105 | PT-FT | 5 |
| 19 | PT-WZ-105 | PT-WZ | 2 |
| 20 | PT-WZ-106 | PT-WZ | 5 |
| 21 | PT-PR-101 | PT-PR | 3 |
| 22 | PT-PR-102 | PT-PR | 2 |
| 23 | PT-PR-103 | PT-PR | 4 |
| 24 | PT-WZ-101 | PT-WZ | 4 |
| 25 | PT-WZ-102 | PT-WZ | 2 |
| 26 | PT-WZ-103 | PT-WZ | 5 |
| 27 | PT-FT-101 | PT-FT | 4 |
| 28 | PT-FT-102 | PT-FT | 3 |
| 29 | PP-QS-101 | PP-QS | 2 |
| 30 | PP-AS-101 | PP-AS | 2 |
| 31 | PT-RE-101 | PT-FT | 4 |
| 32 | PT-RE-102 | PT-WS | 4 |
| 33 | PT-RE-103 | PT-WZ | 5 |
| 34 | PT-RE-104 | PT-WS | 2 |
| 35 | PT-RE-105 | PT-TU | 2 |

### Übungs-Zwischenprüfung 02 – Metall- und Kunststofftechnik (`ZP-UE-02`)

Bearbeitungszeit: 120 Minuten. 35 Aufgaben mit je fünf Auswahlantworten. Genau eine Antwort ist richtig. Aufgaben 31 bis 35 sind Rechenaufgaben.

| Nr. | Frage-ID | Thema | Richtige Antwort |
|---:|---|---|---:|
| 1 | PT-TU-109 | PT-TU | 3 |
| 2 | PT-TU-110 | PT-TU | 3 |
| 3 | PT-TU-104 | PT-TU | 3 |
| 4 | PT-TU-107 | PT-TU | 1 |
| 5 | PT-TU-102 | PT-TU | 4 |
| 6 | PT-MA-101 | PT-MA | 1 |
| 7 | PT-MA-102 | PT-MA | 2 |
| 8 | PT-MA-103 | PT-MA | 2 |
| 9 | WISO-SU-103 | WISO-SU | 4 |
| 10 | WISO-SU-104 | WISO-SU | 3 |
| 11 | PT-WS-107 | PT-WS | 5 |
| 12 | PT-WS-108 | PT-WS | 1 |
| 13 | PT-WS-109 | PT-WS | 4 |
| 14 | PT-WS-103 | PT-WS | 3 |
| 15 | PT-WS-105 | PT-WS | 1 |
| 16 | PT-FT-103 | PT-FT | 5 |
| 17 | PT-FT-106 | PT-FT | 2 |
| 18 | PT-FT-102 | PT-FT | 3 |
| 19 | PT-WZ-104 | PT-WZ | 2 |
| 20 | PT-WZ-107 | PT-WZ | 3 |
| 21 | PT-PR-104 | PT-PR | 1 |
| 22 | PT-PR-105 | PT-PR | 1 |
| 23 | PT-PR-106 | PT-PR | 5 |
| 24 | PT-WZ-102 | PT-WZ | 2 |
| 25 | PT-MA-104 | PT-MA | 5 |
| 26 | PP-QS-102 | PP-QS | 5 |
| 27 | PP-QS-103 | PP-QS | 5 |
| 28 | PP-AS-102 | PP-AS | 2 |
| 29 | PP-IH-101 | PP-IH | 1 |
| 30 | PP-AS-101 | PP-AS | 2 |
| 31 | PT-RE-106 | PT-FT | 4 |
| 32 | PT-RE-107 | PT-PR | 1 |
| 33 | PT-RE-108 | PT-MA | 2 |
| 34 | PT-RE-109 | PT-WS | 4 |
| 35 | PT-RE-110 | PT-WZ | 2 |

Freitextaufgaben:

| Frage-ID | Thema | Punkte |
|---|---|---:|
| PT-WS-F01 | PT-WS | 4 |
| PT-TU-F01 | PT-TU | 4 |
| PT-WZ-F01 | PT-WZ | 4 |
| PT-PR-F01 | PT-PR | 4 |
| PT-FT-F01 | PT-FT | 4 |
| PT-MA-F01 | PT-MA | 4 |
| PP-IH-F01 | PP-IH | 4 |
| PP-QS-F01 | PP-QS | 4 |
| PP-UP-F01 | PP-UP | 4 |
| PP-AS-F01 | PP-AS | 4 |
| WISO-SV-F01 | WISO-SV | 4 |
| WISO-BA-F01 | WISO-BA | 4 |
| WISO-SU-F01 | WISO-SU | 4 |
| PT-TU-F02 | PT-TU | 4 |
| PT-WS-F02 | PT-WS | 4 |
| PT-PR-F02 | PT-PR | 6 |
| PT-FT-F02 | PT-FT | 4 |
| PP-QS-F02 | PP-QS | 5 |
| WISO-SU-F02 | WISO-SU | 4 |

## Schweißtechnik (modulare Lehrgänge)

> Kein Kammerausbildungsberuf, sondern modulare Lehrgänge mit Schweißerprüfung durch eine anerkannte Prüfstelle. Die Kammerzuordnung ist nur ein technischer Platzhalter des Datenmodells und vom Ausbilder zu prüfen. Prüfungsgruppen, Bewertungsschlüssel und Gültigkeitsfristen richten sich nach dem jeweiligen Regelwerk und sind vom Ausbilder einzutragen.

Prüfungsbereiche und Themen:

- **Schweißverfahren und Werkstoffe** (`SCH-VF`): Verfahren und Zusatzwerkstoffe, Nahtformen und Schweißpositionen
- **Qualität und Sicherheit** (`SCH-QS`): Schweißfehler und Prüfung, Arbeitssicherheit beim Schweißen

### Übungstest Schweißtechnik – Grundlagen (`SCH-UE-01`)

Bearbeitungszeit: 45 Minuten. 16 Aufgaben mit je fünf Auswahlantworten, genau eine Antwort ist richtig. Der Test ersetzt keine Schweißerprüfung nach Regelwerk.

| Nr. | Frage-ID | Thema | Richtige Antwort |
|---:|---|---|---:|
| 1 | SCH-VF-VE-101 | SCH-VF-VE | 2 |
| 2 | SCH-VF-VE-102 | SCH-VF-VE | 5 |
| 3 | SCH-VF-VE-103 | SCH-VF-VE | 3 |
| 4 | SCH-VF-VE-104 | SCH-VF-VE | 1 |
| 5 | SCH-VF-VE-105 | SCH-VF-VE | 2 |
| 6 | SCH-VF-NA-101 | SCH-VF-NA | 2 |
| 7 | SCH-VF-NA-102 | SCH-VF-NA | 2 |
| 8 | SCH-VF-NA-103 | SCH-VF-NA | 3 |
| 9 | SCH-QS-FE-101 | SCH-QS-FE | 1 |
| 10 | SCH-QS-FE-102 | SCH-QS-FE | 5 |
| 11 | SCH-QS-FE-103 | SCH-QS-FE | 2 |
| 12 | SCH-QS-FE-104 | SCH-QS-FE | 2 |
| 13 | SCH-QS-AS-101 | SCH-QS-AS | 1 |
| 14 | SCH-QS-AS-102 | SCH-QS-AS | 5 |
| 15 | SCH-QS-AS-103 | SCH-QS-AS | 4 |
| 16 | SCH-QS-AS-104 | SCH-QS-AS | 5 |

Freitextaufgaben:

| Frage-ID | Thema | Punkte |
|---|---|---:|
| SCH-QS-F01 | SCH-QS-FE | 8 |
| SCH-QS-F02 | SCH-QS-AS | 8 |

## Tischler/-in

> Handwerksberuf, zuständig ist die Handwerkskammer. Gewichtung und Prüfungsdauer der Prüfungsbereiche sind leer gelassen und vom Ausbilder nach der geltenden Ausbildungsordnung und den Vorgaben der HWK Aachen einzutragen.

Prüfungsbereiche und Themen:

- **Werkstoffe und Technische Unterlagen** (`TIS-WS`): Holz und Holzwerkstoffe, Zeichnung, Skizze und Aufmaß
- **Fertigung und Montage** (`TIS-FE`): Holzverbindungen und Beschläge, Maschinen und Werkzeuge, Oberflächenbehandlung
- **Wirtschafts- und Sozialkunde** (`TIS-WISO`): Arbeitssicherheit und Umweltschutz, Kalkulation und Kundenauftrag

### Übungsprüfung Tischler – Grundlagen (`TIS-UE-01`)

Bearbeitungszeit: 60 Minuten. 18 Aufgaben mit je fünf Auswahlantworten, genau eine Antwort ist richtig.

| Nr. | Frage-ID | Thema | Richtige Antwort |
|---:|---|---|---:|
| 1 | TIS-WS-HO-101 | TIS-WS-HO | 5 |
| 2 | TIS-WS-HO-102 | TIS-WS-HO | 3 |
| 3 | TIS-WS-HO-103 | TIS-WS-HO | 4 |
| 4 | TIS-WS-HO-104 | TIS-WS-HO | 2 |
| 5 | TIS-WS-ZE-101 | TIS-WS-ZE | 3 |
| 6 | TIS-WS-ZE-102 | TIS-WS-ZE | 5 |
| 7 | TIS-WS-ZE-103 | TIS-WS-ZE | 5 |
| 8 | TIS-FE-VB-101 | TIS-FE-VB | 1 |
| 9 | TIS-FE-VB-102 | TIS-FE-VB | 5 |
| 10 | TIS-FE-VB-103 | TIS-FE-VB | 5 |
| 11 | TIS-FE-MA-101 | TIS-FE-MA | 5 |
| 12 | TIS-FE-MA-102 | TIS-FE-MA | 5 |
| 13 | TIS-FE-MA-103 | TIS-FE-MA | 2 |
| 14 | TIS-FE-OB-101 | TIS-FE-OB | 2 |
| 15 | TIS-FE-OB-102 | TIS-FE-OB | 4 |
| 16 | TIS-WISO-SU-101 | TIS-WISO-SU | 3 |
| 17 | TIS-WISO-SU-102 | TIS-WISO-SU | 2 |
| 18 | TIS-WISO-BW-101 | TIS-WISO-BW | 3 |

Freitextaufgaben:

| Frage-ID | Thema | Punkte |
|---|---|---:|
| TIS-WS-F01 | TIS-WS-HO | 4 |
| TIS-FE-F01 | TIS-FE-MA | 4 |
| TIS-WISO-F01 | TIS-WISO-BW | 5 |
