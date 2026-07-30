# Tests

Drei Stufen, jede mit einer eigenen Aufgabe und eigener Laufzeit.

| Verzeichnis | Was geprüft wird | Braucht | Befehl |
|---|---|---|---|
| `unit/` | Fachlogik aus `packages/core` — reine Funktionen, keine Infrastruktur | nichts | `pnpm test:unit` |
| `integration/` | Server Actions und Edge Functions gegen einen Supabase-Doppelgänger | nichts (der Doppelgänger liegt in `helpers/`) | `pnpm test:integration` |
| `e2e/` | kritische Nutzerpfade im echten Browser | laufende App + Chromium | `pnpm test:e2e` |

`pnpm test` führt `unit` und `integration` aus — das ist, was in der CI bei jedem
Push läuft. E2E hat einen eigenen Job, weil es einen Build braucht.

## Grundsätze

**Kein `new Date()` ohne Argument.** Jede Domainfunktion nimmt `jetzt` als
Parameter. Tests holen feste Zeitpunkte aus `helpers/zeit.ts`. Ein Test, der von
der Systemuhr abhängt, schlägt irgendwann nachts in der CI fehl und niemand
findet den Grund.

**Fabriken statt Objektliteralen.** `helpers/fabriken.ts` liefert für jeden Typ
einen gültigen Standardfall. Ein Test nennt nur, worum es ihm geht — die
Abweichung vom Standard ist damit die Aussage des Tests.

**Edgecases gehören dazu, nicht in eine eigene Datei.** Die Grenzfälle stehen
direkt beim jeweiligen Verhalten: Zeitumstellung bei der Serie, Stufengrenzen bei
der Note, `Number(null)` bei den Werten. Wer die Funktion ändert, sieht die
Grenzfälle im gleichen Block.

**Jeder Test hat einen Grund.** Wo die Erwartung nicht selbsterklärend ist, steht
ein Kommentar mit dem *warum*, nicht mit dem *was*. Beispiel aus
`unit/benachrichtigung/abo.test.ts`: 5xx darf kein Abo löschen, weil ein
einstündiger Ausfall beim Push-Dienst sonst die halbe Tabelle abräumt.

## Welche Edgecases abgedeckt sind

Die Domain hat drei Bereiche, in denen Fehler in der Praxis wirklich auftreten,
und alle drei sind ausdrücklich abgedeckt:

- **Zeit** — Sommerzeitwechsel (23- und 25-Stunden-Tage), Mitternacht in einer
  anderen Zeitzone als UTC, Schaltjahre samt der 100/400-Regel, Jahreswechsel,
  Zeitzonen mit halbstündigem Versatz, Zeitpunkte in der Zukunft durch falsch
  gestellte Geräteuhren.
- **Kaputte Daten** — `null`, leerer Text, `NaN`, `Infinity`, Objekte an Stellen,
  wo Zahlen erwartet werden; unlesbare Zeitstempel aus der Datenbank; Schwellen
  von 0, die durch Null teilen würden; leere Mengen an jeder Aggregation.
- **Grenzen** — jede Notenstufe des IHK-Schlüssels einzeln, Fälligkeit auf die
  Sekunde, Mindestpausen exakt auf der Stunde, Tagesdeckel bei genau erreichtem
  Limit und darüber.
