# Übungs-Zwischenprüfungen – Aufbau und Lösungsspiegel

Quelle der Aufgaben: `supabase/seed/MAF_Fragenpool_Charge2_ZP.json`.
Alle Aufgaben sind Eigenentwicklungen des BZE. Übernommen wurde nur die Prüfungs**struktur**
(35 geschlossene Aufgaben, fünf Auswahlantworten, Rechenteil am Schluss), keine fremden Aufgabentexte.

Status aller Fragen ist `entwurf`. Vor dem Einsatz ist die Freigabe durch einen Ausbilder zwingend.
Bei Rechenaufgaben (`enthaelt_zahlenwert = true`) muss zusätzlich die Tabellenbuch-Fundstelle
nachgetragen werden; deshalb stehen sie auf `kern = false`.

Prüfen: `python3 scripts/pruefe_fragenpool.py` — Seed neu erzeugen: `python3 scripts/generate_seed.py`

Die Spalte „Richtige Antwort“ bezieht sich auf die Reihenfolge im JSON. Zeigt die App die
Optionen gemischt an, gilt der Lösungsspiegel nur für den gedruckten Satz aus dieser Datei.

## Übungs-Zwischenprüfung 01 – Metall- und Kunststofftechnik (`ZP-UE-01`)

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

## Übungs-Zwischenprüfung 02 – Metall- und Kunststofftechnik (`ZP-UE-02`)

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

## Freitextaufgaben zur Vertiefung

| Frage-ID | Thema | Punkte |
|---|---|---:|
| PT-TU-F02 | PT-TU | 4 |
| PT-WS-F02 | PT-WS | 4 |
| PT-PR-F02 | PT-PR | 6 |
| PT-FT-F02 | PT-FT | 4 |
| PP-QS-F02 | PP-QS | 5 |
| WISO-SU-F02 | WISO-SU | 4 |
