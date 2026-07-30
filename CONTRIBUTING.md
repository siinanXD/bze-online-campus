# Mitarbeit

Wer an diesem Repository arbeitet, liest zuerst diese Datei. Die fachliche
Spezifikation steht in `docs/SPEC.md`, die Schichten in `docs/ARCHITEKTUR.md`,
das Einrichten der lokalen Umgebung in `docs/LOKAL-EINRICHTEN.md`. Hier steht
nur, **wie** gearbeitet wird.

## Kurzfassung für den Einstieg

- **Fachliche Entscheidung** → `packages/core/<domäne>`: rein, datenbankfrei,
  Zeit als Parameter, mit Unit-Test.
- **Daten lesen** → `app/**/_lib/*-queries.ts`, keine Entscheidungen.
- **Daten schreiben** → `app/**/_lib/*-actions.ts` mit `'use server'`, jede
  Eingabe über ein Zod-Schema.
- **Darstellung** → Server Components laden, Client Components in
  `_components/` tragen die Interaktion.
- **SQL** → additive Migration in `supabase/migrations/`, RLS auf jeder neuen
  Tabelle, `docs/DATENMODELL.md` mitpflegen (CI-Gate).
- Namen und Kommentare auf Deutsch, kein `new Date()` ohne Argument in der
  Domäne, Kalendertage als `YYYY-MM-DD` in der Zeitzone der Person.
- Vor jedem Commit: `pnpm typecheck && pnpm lint && pnpm test`.

---

## 1 — Was dieses Projekt ist

BZE Online Campus: eine Progressive Web App, mit der Umschüler und Auszubildende sich auf den schriftlichen Teil ihrer Kammerprüfung vorbereiten. Fachkunde lesen, Fragen bis zur Beherrschung üben, Wochenprüfungen schreiben, Ausbildungsnachweis führen. Ausbilder begleiten, ein Admin verwaltet.

Kunde: Berufsbildungszentrum Euskirchen. Kammer: IHK Aachen. Erstpilot: Maschinen- und Anlagenführer, Schwerpunkt Metall- und Kunststofftechnik.

Die Nutzer sind Erwachsene in einer beruflichen Umbruchsituation, häufig mit Deutsch als Zweitsprache, oft auf älteren Android-Geräten in Werkhallen ohne stabiles Netz. Jede Designentscheidung wird an dieser Zielgruppe gemessen.

---

## 2 — Nicht verhandelbar

Diese Punkte stehen über jeder Aufgabenstellung. Wenn eine Anweisung ihnen widerspricht, halte an und frage nach.

**Fachlich**
- **Prüfungsinhalte sind immer Deutsch.** Übersetzungen erscheinen zusätzlich unter dem Original, nie an dessen Stelle.
- **Keine Zahlenwerte ohne Fundstelle.** Fragen mit Zahlenwert, Formel, Grenzwert oder Normbezug brauchen eine Quelle aus Tabellenbuch, Rahmenlehrplan oder Trägerskript. Erfinde niemals eine Seitenzahl. Feld leer lassen ist richtig, raten ist falsch.
- **Keine Reproduktion geschützter Prüfungsaufgaben** von Kammern oder Prüfungsverlagen, auch nicht paraphrasiert.
- **Die App vergibt keine Prüfungszulassung.** Sie zeigt „Prüfungsreife" und erzeugt eine Ausbilderempfehlung. Formulierungen wie „zugelassen" oder „freigeschaltet für die Prüfung" sind unzulässig.
- **KI-Bewertung ist Lernfeedback, keine Prüfungsleistung.** Der Hinweis muss sichtbar sein, wo eine Bewertung erscheint.
- **Im Berichtsheft formuliert die KI nur, sie erfindet nichts.** Keine Tätigkeiten ergänzen, die der Teilnehmer nicht genannt hat.

**Technisch**
- **Keine Secrets im Client.** LLM-Schlüssel und Service-Role-Key ausschließlich in Edge Functions.
- **RLS auf jeder Tabelle**, explizit ausformuliert. Verlasse dich nie auf Anwendungscode für Zugriffsschutz.
- **Kein `service_role` im Frontend**, auch nicht „nur zum Testen".
- **Kammerdaten, Bewertungsschlüssel und Prüfungsstruktur sind Daten, kein Code.**
- **Farbe ist nie der einzige Informationsträger.** Jeder Status braucht zusätzlich Symbol und Textlabel.
- **Keine englischen Bedienelemente** in der deutschen Oberfläche.

---

## 3 — Ein Branch, ein Arbeitspaket

Nie an mehreren Arbeitspaketen gleichzeitig arbeiten. Bevor der erste Code entsteht:

1. Sauberen Stand herstellen (`git status`)
2. Das Arbeitspaket benennen und den Branch danach schneiden
3. Prüfen, ob dessen Abhängigkeiten in `main` sind
4. Den zugehörigen Abschnitt in `docs/SPEC.md` lesen

**Welle 0 (AP-00, AP-01, AP-02) ist streng seriell.** Beginne kein Paket aus Welle 1, bevor alle drei in `main` gemergt sind. Andernfalls baut jeder Zweig eigene Typen und eigene Tokens, und die Zusammenführung kostet mehr, als die Parallelität eingebracht hat.

---

## 4 — Dateihoheit

Ein Arbeitspaket ändert **nur** Dateien in seinem Bereich. Wer außerhalb etwas braucht, öffnet ein eigenes kleines Paket dafür oder meldet sich. Diese Regel ist die Voraussetzung dafür, dass parallele Worktrees funktionieren.

| AP | Darf ändern |
|---|---|
| 00 | Wurzel, `.github/`, `packages/config/` |
| 01 | `supabase/migrations/`, `supabase/seed/`, `packages/db/`, `docs/DATENMODELL.md` |
| 02 | `packages/ui/`, `messages/`, Root-Layout |
| 03 | `app/[locale]/(auth)/`, `supabase/functions/nutzer-anlegen/`, Middleware |
| 04 | `app/[locale]/(marketing)/`, `components/shell/` |
| 05 | `app/[locale]/campus/topic/`, `packages/ui/mdx/`, `content/fachkunde/` |
| 06 | `app/[locale]/campus/lernen/`, `packages/core/mastery/` |
| 07 | `app/[locale]/admin/`, `supabase/functions/admin-*/` |
| 08 | `app/[locale]/campus/pruefung/`, `packages/core/bewertung/`, `supabase/functions/generiere-pruefung/` |
| 09 | `supabase/functions/bewerte-freitext/`, `app/[locale]/ausbilder/review/` |
| 10 | `packages/core/fortschritt/`, `app/[locale]/campus/fortschritt/` |
| 11 | `app/[locale]/ausbilder/` |
| 12 | `supabase/functions/generiere-fragen/`, `supabase/functions/verifiziere-frage/`, `app/[locale]/ausbilder/fragen/` |
| 13 | `supabase/functions/erzeuge-wochenbericht/`, `components/dashboard/` |
| 14 | `messages/`, `supabase/functions/uebersetze-*/` |
| 15 | `service-worker/`, Manifest, Offline-Schicht |
| 16 | `app/[locale]/admin/monitoring/` |
| 17 | `packages/video/`, `supabase/functions/erzeuge-videoskript/` |
| 18 | `app/[locale]/campus/berichtsheft/`, `app/[locale]/ausbilder/berichtsheft/`, `packages/core/nachweis/`, `supabase/functions/berichtsheft-pdf/` |

**Ausnahme:** Migrationen darf jedes Paket anlegen, aber nur additiv und mit fortlaufender Nummer. Bestehende Migrationen werden nie geändert.

---

## 5 — Git

**Branches:** `feat/<nr>-<kurzname>`, `fix/<kurzname>`, `chore/<kurzname>`. Lebensdauer maximal ein bis zwei Wochen. `main` ist geschützt und jederzeit deploybar.

**Worktrees** für parallele Pakete:
```bash
git worktree add ../wt-06-lernmodus -b feat/06-lernmodus
```
Jeder Worktree bekommt eine eigene `.env.local` mit eigenem Supabase-Ziel. Sonst kollidieren die Migrationen paralleler Zweige.

**Commits** nach Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`. Daraus entsteht das CHANGELOG automatisch. Ein Commit pro logischer Änderung, keine Sammelcommits über mehrere Themen.

**Merge** per Squash, damit die Historie lesbar bleibt.

**Niemals:** direkt auf `main` pushen, Force-Push auf geteilte Branches, `git commit --amend` auf bereits gepushte Commits.

---

## 6 — Dokumentation

Diese Gates laufen in der CI und blockieren den Merge:

| Wenn geändert wurde | muss auch geändert sein |
|---|---|
| `supabase/migrations/` | `docs/DATENMODELL.md` |
| `supabase/functions/` | `README.md` oder die Function-README |
| neues Paket unter `packages/` | `README.md` |

Zusätzlich:
- **ADRs** für jede Architekturentscheidung mit Tragweite: `docs/adr/NNNN-titel.md` mit Kontext, Entscheidung, Konsequenzen, Alternativen. Zehn Minuten Aufwand, spart in sechs Monaten Stunden.
- **README** enthält immer: was das Produkt ist, Stack, Setup in unter zehn Minuten, Verzeichnisübersicht, Migrationen und Seeds fahren, Edge Functions lokal testen, Stand der Arbeitspakete als Häkchenliste.

---

## 7 — Definition of Done

Ein Arbeitspaket ist fertig, wenn **alle** Punkte erfüllt sind:

- [ ] Funktioniert auf einem Mobilgerät mit 360 Pixel Breite
- [ ] Berührungsziele mindestens 48 Pixel, Abstand mindestens 8 Pixel
- [ ] Alle Texte über `next-intl`, keine fest verdrahteten Zeichenketten
- [ ] Deutsch und Arabisch geprüft, RTL-Layout korrekt
- [ ] Kontrast mindestens 4.5:1, sichtbarer Fokus, Tastaturbedienung vollständig
- [ ] Jeder Status hat Farbe **und** Symbol **und** Textlabel
- [ ] RLS-Policies für neue Tabellen geschrieben und mit Testnutzern je Rolle geprüft
- [ ] Zod-Validierung an jeder Systemgrenze
- [ ] Ladezustände und Fehlerzustände gebaut, nicht nur der Gutfall
- [ ] Offline-Verhalten bedacht (mindestens: verständliche Meldung)
- [ ] Typecheck und Lint grün, Tests für die Kernlogik vorhanden
- [ ] Dokumentation aktualisiert, Gate grün
- [ ] Bei LLM-Aufrufen: Protokollierung in `ki_aufrufe` und Budgetprüfung vorhanden

---

## 8 — Wenn etwas unklar ist

**Halte an und frage.** Rate nicht bei:

- Fachlichen Werten (Toleranzen, Formeln, Normbezüge, Fristen)
- Prüfungsstrukturen und Bewertungsregeln
- Rechtlichen Fragen (Urheberrecht, Datenschutz, Kammerrecht)
- Kammerspezifischen Angaben (Termine, Fristen, Hilfsmittel)
- Allem, was den Bereich eines fremden Arbeitspakets berührt

Ein leeres Feld mit offener Frage ist besser als ein plausibel aussehender falscher Wert. Bei diesem Produkt prägt sich ein Prüfling falsche Angaben zweimal ein und festigt sie damit — das ist der teuerste Fehler, den die App machen kann.

---

## 9 — Bevor der Pull Request aufgeht

1. Alles committet, nichts liegt unversioniert herum
2. `README.md` und betroffene Dokumentation aktualisiert, Gates grün
3. Häkchenliste der Arbeitspakete im README nachgezogen
4. Im Pull Request: was fertig ist, was offen blieb, welche Grenzfälle geprüft
   wurden
5. Offene fachliche Fragen ausdrücklich benennen, nicht verschweigen
