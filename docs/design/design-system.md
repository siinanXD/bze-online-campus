# Design-System — bze-online-campus

## Woher die Werte kommen

Die Wahrheit steht im Code, nicht in Figma und nicht in dieser Datei:

- CSS-Custom-Properties: `app/globals.css`
- Tailwind: `tailwind.config.ts`

Stand 2026-08-03: 105 Custom-Properties in `app/globals.css`.

`design-tokens.json` daneben ist eine **Extraktion**, kein Original. Bei
Abweichung gewinnt das CSS. Wer die Datei von Hand pflegt, erzeugt genau die
zweite Wahrheit, die dieses Verzeichnis vermeiden soll.

## Regeln

- **Keine hartkodierten Farbwerte in Bauteilen.** Ein `#3b82f6` neben einem
  vorhandenen Token ist ein Befund, kein Geschmacksthema.
- Abstaende, Radien und Schriftgroessen kommen aus der Skala, nicht aus dem
  Gefuehl.
- Ein neuer Token wird angelegt, wenn ein Wert zum zweiten Mal gebraucht wird
  — nicht beim ersten Mal und nicht beim fuenften.

## Besonderheit

Das Projekt hat bereits einen ADR zu Design-Tokens: `docs/adr/0002-design-tokens.md`. Er ist die Quelle, diese Datei nur die Bruecke zu Figma. Ausserdem gibt es `docs/DESIGN.md` und unter `docs/bilder/` bereits Screenshots.

Es existieren fertige Skripte fuer Screenshots und Kontrastpruefung:

```bash
pnpm design:shots      # Screenshots nach ./shots
pnpm design:galerie    # Galerie daraus bauen
pnpm design:kontrast   # Kontrastpruefung
```

Damit ist der Screenshot-Weg hier bereits gebaut — er muss nur benutzt werden.

## Barrierefreiheit

Kontrast mindestens 4.5:1 fuer Fliesstext, 3:1 fuer grosse Schrift und
Bedienelemente. Das ist keine Empfehlung, sondern die Schwelle, ab der Text
fuer einen Teil der Nutzer lesbar wird.

Fokus muss sichtbar sein. Wer `outline: none` setzt, ersetzt es durch etwas
Gleichwertiges — oder laesst es.
