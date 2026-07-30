# Designsystem

Verbindliche Grundlage für jede Oberfläche in diesem Projekt. Die Tokens leben in
`app/globals.css` und werden in `tailwind.config.ts` als Tailwind-Namen
verfügbar gemacht; Komponenten liegen in `packages/ui`. Wer eine neue Ansicht
baut, verwendet ausschließlich diese Bausteine — keine Einzelfarben, keine
Einzelabstände.

## Ausgangsentscheidungen

| Frage | Entscheidung | Begründung |
|---|---|---|
| Wichtigster Ablauf | Lernpfad der Teilnehmenden auf dem Handy | Dort passiert die Nutzung, oft in Werkhallen auf älteren Android-Geräten. |
| Primärfarbe | Bernstein `#B45309` | Warm und ermutigend, klar unterscheidbar von Warn- und Fehlerrot. |
| Informationsdichte | Campus luftig, Ausbilder und Admin kompakt | Lernende brauchen Ruhe, Ausbilder brauchen Überblick über viele Zeilen. |
| Schrift | Inter, selbst gehostet, Noto Sans Arabic für RTL | Keine Fremdanfrage an Google Fonts, keine Layoutverschiebung beim Laden. |
| Dunkelmodus | Systemeinstellung plus manueller Umschalter (`darkMode: 'class'`) | Abendliches Lernen ist der Regelfall, nicht die Ausnahme. |
| Grundhaltung | klar, vertrauenswürdig, ermutigend; Du-Form, einfache Sprache | Zielgruppe sind Erwachsene in einer Umbruchsituation, häufig mit Deutsch als Zweitsprache. |

## Farbtokens

Farben liegen als RGB-Kanäle vor, damit Tailwind-Transparenzen (`bg-primary/10`)
funktionieren. Jede Rolle hat einen Namen, keine Nummer.

- **Flächen:** `bg`, `bg-subtle`, `surface`, `surface-raised`
- **Linien:** `border`, `border-strong`
- **Text:** `fg`, `fg-muted`, `fg-subtle`, `fg-onPrimary`
- **Primär:** `primary`, `-hover`, `-active`, `-subtle`, `-border` — nur als
  gefüllte Handlungsfläche, nie als Warnhinweis
- **Rückmeldung:** `success`, `warning`, `danger`, `info`, jeweils mit `-bg` und
  `-border`
- **Lernstatus:** `status-neu ○`, `status-teil ◐`, `status-falsch ✕`,
  `status-fertig ✓`

Die Kontrastwerte stehen als Kommentar an jedem Token in `app/globals.css` und
werden von `pnpm design:kontrast` nachgerechnet. Textfarben erreichen
mindestens 4.5:1 in beiden Modi.

## Typografie, Radien, Maße

Schriftgrade sind benannt statt gemessen: `caption`, `overline`, `body-sm`,
`label`, `body`, `body-lg`, `h4`, `h3`, `h2`, `h1`, `display` — jeweils mit
festgelegter Zeilenhöhe und Laufweite. Radien gehen von `sm` (6 px, Badges) bis
`xl` (18 px, Modale). Zwei Maße sind Regeln, nicht Vorschläge: `spacing.touch`
(48 px Mindestberührungsziel) und die Lesebreite `max-w-lese` (42 rem, rund 68
Zeichen). Für Bereiche gilt `max-w-formular`, `max-w-campus`, `max-w-daten`.

## Komponenten

```
packages/ui/src/primitive/   button, card, eingabe, anzeige, spinner, status-badge
packages/ui/src/muster/      seitenkopf, formularfeld, suchfeld, modal,
                             daten-tabelle, zustaende
packages/ui/src/             chip, progress-ring, cn
packages/ui/mdx/             Renderer und Komponenten für die Fachkunde-Inhalte
```

`zustaende` liefert die drei Zustände, die jede datenladende Ansicht braucht:
Skelett in der Zielgeometrie, Leerzustand mit nächstem Schritt, Fehlerzustand mit
Wiederholung. `packages/ui` importiert nie aus `app/` und nie aus Supabase.

## Harte Regeln

**Zugänglichkeit**
- Farbe ist nie der einzige Informationsträger: jeder Status trägt zusätzlich
  Symbol **und** Textlabel.
- Kontrast mindestens 4.5:1, sichtbarer Fokusring (`ring` 3 px), vollständige
  Tastaturbedienung.
- Berührungsziele mindestens 48 px, Abstand mindestens 8 px.
- Jedes Formularfeld hat ein sichtbares Label; ein Platzhalter ersetzt es nie.
- Dynamische Änderungen werden angesagt (`aria-live="polite"`).
- `prefers-reduced-motion` wird respektiert; keine Animation über 200 ms.

**Sprache und Inhalt**
- Kein sichtbarer Text im Code — alles über `next-intl`.
- RTL vollständig: nur logische Eigenschaften (`ms-`, `me-`, `ps-`, `pe-`,
  `start`, `end`).
- Layouts vertragen 40 % längeren Text (Deutsch → Französisch).
- Prüfungsinhalte bleiben immer Deutsch; Übersetzungen erscheinen zusätzlich
  unter dem Original.
- Keine englischen Bedienelemente in der deutschen Oberfläche.
- Nie „zugelassen" oder „freigeschaltet für die Prüfung" — die Anwendung zeigt
  Prüfungsreife und erzeugt eine Empfehlung.
- Wo eine KI bewertet oder formuliert, steht der Hinweis auf Lernfeedback
  sichtbar.
- Fehlermeldungen benennen, was passiert ist **und** was zu tun ist.

**Technik**
- Server Components sind der Standard; `'use client'` so tief im Baum wie
  möglich.
- Keine neuen Abhängigkeiten außer `clsx` und `tailwind-merge`.
- Bilder nur über `next/image` mit `width`/`height` oder `fill` plus `sizes`.
- Keine Layoutverschiebung nach dem Laden: Skelette haben die Zielgeometrie.
- Zahlen in Tabellen rechtsbündig mit `tabular-nums`.
- Offline ist ein erwarteter Zustand, kein Fehler: Eingaben gehen in die
  Outbox, der Indikator ist sichtbar.

## Werkzeuge

```bash
pnpm design:kontrast    # rechnet die Kontraste aller Tokens nach (light + dark)
pnpm design:shots       # Screenshots aller Bildschirme nach ./shots
pnpm design:galerie     # baut daraus eine HTML-Übersicht zum Durchsehen
```

`/de/showcase` zeigt alle Komponenten in ihren Zuständen — die schnellste Probe,
ob eine Änderung am Designsystem etwas anderswo zerlegt.
