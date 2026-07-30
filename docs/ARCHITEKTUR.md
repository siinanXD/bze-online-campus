# Architektur

Dieses Dokument beschreibt, **wie** der Code geschnitten ist — die fachlichen
Regeln stehen in [`SPEC.md`](SPEC.md), das Datenmodell in
[`DATENMODELL.md`](DATENMODELL.md).

## Leitidee: Fachlogik ohne Infrastruktur

Die eine Regel, aus der alles andere folgt: **Fachliche Entscheidungen leben in
`packages/core` und kennen weder Datenbank noch Framework.** Jede Funktion dort
nimmt einfache Werte herein und gibt einfache Werte zurück — auch die Uhrzeit
kommt als Parameter, nie aus `new Date()` ohne Argument.

Das hat einen konkreten Grund: Die schwierigen Fehler dieses Projekts liegen
nicht in der Datenbank, sondern in der Fachlogik — an welchem Kalendertag eine
Lernserie reißt, ob eine ISO-Woche zum alten oder neuen Jahr gehört, welche
Notenstufe ein Punktwert trifft. Solche Regeln müssen ohne Supabase, ohne
laufende App und reproduzierbar prüfbar sein. Genau das leistet die Trennung.

## Die Schichten

```
Oberfläche (React Server/Client Components)
        │  ruft
        ▼
_lib/*-queries.ts   ── nur lesen ──►  Supabase
_lib/*-actions.ts   ── nur schreiben, jede Mutation mit Zod-Schema ──►  Supabase
        │  übergibt einfache Werte an
        ▼
packages/core/*     ── reine Fachlogik, keine Infrastruktur ──►  Rückgabe: einfache Werte
```

**`packages/core` — die Domänen.** Jede ist ein eigenes Paket-Unterverzeichnis
mit einem `index.ts` als öffentlicher Fläche:

| Domäne | Aufgabe |
|---|---|
| `mastery` | Reihenfolge im Lernmodus (Spec §4.1), Themen-Fortschritt |
| `bewertung` | Notenstufen, Prüfungsuhr |
| `fortschritt` | Kaskade und Gates (Spec §4.2), Fortsetzen-Empfehlung |
| `nachweis` | Statusübergänge und ISO-Wochen-Lücken des Ausbildungsnachweises |
| `engagement` | Lernserie, Tagesziel, Fälligkeiten, Abzeichen |
| `benachrichtigung` | ob und was per Push gesendet wird |
| `werte` | gemeinsame Wertprüfung (Zahlen aus unbekannten Eingaben) |

**`_lib/*-queries.ts` — Lesen.** Holt Daten aus Supabase und reicht sie
unverändert an die Domäne weiter. Trifft selbst keine fachliche Entscheidung.

**`_lib/*-actions.ts` — Schreiben.** `'use server'`. Jede Mutation validiert
ihre Eingabe mit einem Zod-Schema, denn alles aus dem Browser ist
unvertrauenswürdig — auch das, was vom eigenen Formular zu kommen scheint.

**Oberfläche.** Server Components laden über die queries und stellen dar;
Client Components (`_components/`) tragen die Interaktion und rufen die actions.

## Warum die Domäne doppelt genutzt wird

Die Edge Function `sende-erinnerungen` (Deno) importiert dieselbe
`benachrichtigung`-Domäne relativ aus `packages/core`. So gibt es die
Entscheidung „senden ja/nein" nur an einer Stelle — getestet, unabhängig von der
Laufzeit. Die Function erledigt nur, was ausschließlich serverseitig geht: den
VAPID-signierten Versand. Reine Anzeige-Texte (die Push-Nachrichten in sechs
Sprachen) liegen dagegen als eigene Karte in der Function, weil sie isoliert
deployt wird — das ist bewusste Text-, keine Logik-Duplikation.

## Datenzugriffsschutz

RLS ist auf **jeder** Tabelle aktiv (Spec §3). Die Zugriffslogik liegt in der
Datenbank, nicht im Anwendungscode — eine Server Action, die die falsche Zeile
lädt, bekommt sie von Postgres gar nicht erst. Personenbezogene Daten wie
Push-Endpunkte sind strenger geschützt als Lerndaten: nur die Person selbst, kein
Ausbilderzugriff (siehe `DATENMODELL.md`, AP-17).

## Zeit und Kalender

Kalendertage sind `YYYY-MM-DD` in der Zeitzone der lernenden Person, nicht
UTC-Zeitstempel. Wer um 23:30 deutscher Zeit lernt, bekommt den Tag
gutgeschrieben, an dem er sich befindet. Deshalb speichern `push_protokoll.tag`
und `lern_aktivitaet.tag` `text` statt `date`, und `engagement/kalender.ts`
rechnet in Kalendertagen statt Millisekunden — nur so bleibt die Rechnung über
Sommerzeitwechsel hinweg richtig.

## Tests spiegeln die Schichten

- **Unit** (`tests/unit`): die Domänen in `packages/core`, ohne Infrastruktur.
- **Integration** (`tests/integration`): Zusammenspiel über Modulgrenzen, etwa
  Planung → Nutzlast → Übersetzung.
- **E2E** (`tests/e2e`): kritische Pfade im Browser, gegen eine laufende App.

Feste Zeitpunkte und Fabriken liegen in `tests/helpers`; kein Test hängt an der
Systemuhr.
