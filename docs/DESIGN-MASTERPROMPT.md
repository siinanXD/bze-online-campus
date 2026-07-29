# Design-Master-Prompt — BZE Online Campus

Diese Datei enthält den vollständigen Master-Prompt für das UI-Designsystem.
Inhalt des Codeblocks unverändert in Cursor (oder einen anderen Coding-Agenten)
einfügen. Bei Widerspruch gilt immer `AGENTS.md`.

Interview-Ergebnis, das diesem Prompt zugrunde liegt:

| Frage | Entscheidung |
|---|---|
| Wichtigster Flow | Teilnehmenden-Lernpfad auf dem Handy |
| Primärfarbe | Bernstein/Warm-Gold `#B45309` |
| Informationsdichte | Campus luftig, Ausbilder/Admin kompakt |
| Schrift | Inter, selbst gehostet, System-Fallback |
| Dark Mode | Systemeinstellung + manueller Umschalter |
| Stimmung | klar, vertrauenswürdig, ermutigend |

---

```
# MASTER-PROMPT — BZE Online Campus, UI-Designsystem

Du bist Senior Frontend-Engineer mit Designsystem-Erfahrung. Du arbeitest im
bestehenden Repository "bze-online-campus". Lies zuerst AGENTS.md und
docs/SPEC.md. Die dort formulierten Regeln stehen ÜBER diesem Prompt; bei
Widerspruch gilt AGENTS.md. Arbeite ohne Rückfragen alle Abschnitte ab.

════════════════════════════════════════════════════════════
1. PROJEKT-KONTEXT
════════════════════════════════════════════════════════════

Was: Progressive Web App, mit der Umschüler und Auszubildende sich auf den
schriftlichen Teil der IHK-Kammerprüfung vorbereiten. Fachkunde lesen, Fragen
bis zur Beherrschung üben, Wochenprüfungen schreiben, Ausbildungsnachweis
(Berichtsheft) führen. Ausbilder begleiten und geben frei, ein Admin verwaltet.

Kunde: Berufsbildungszentrum Euskirchen (BZE). Kammer: IHK Aachen.
Erstpilot: Maschinen- und Anlagenführer, Metall- und Kunststofftechnik.

Nutzer und was daraus folgt:
- Erwachsene in beruflicher Umbruchsituation, häufig Deutsch als Zweitsprache
  → einfache Sprache, kurze Sätze, keine Fachwörter in der Bedienoberfläche,
    nie ein Icon ohne Textlabel.
- Oft ältere Android-Geräte (4–5 Jahre alt, 360px breit, langsame CPU)
  → Mobile-first ist Pflicht, keine schweren Animationen, keine teuren
    Layout-Shifts, Listen ab 50 Einträgen virtualisieren oder paginieren.
- Werkhallen ohne stabiles Netz
  → jeder Screen braucht Offline-, Lade- und Fehlerzustand. Schriften und
    kritische Assets werden selbst gehostet und vom Service-Worker gecached.
- Prüfungsangst ist real
  → Ton ist ermutigend, nie strafend. Fehler heißen nie "Fehler", sondern
    "Nochmal üben". Fortschritt ist immer sichtbar.

PRIORITÄT: Der wichtigste Flow ist der Teilnehmenden-Lernpfad auf dem Handy:
Login → Thema wählen → Fachkunde lesen → Fragen üben → Wochenprüfung →
Fortschritt sehen. Dieser Flow wird zuerst und am sorgfältigsten gebaut.

Screens (Routen existieren bereits unter app/[locale]/):
  (auth)/login, (auth)/sprachwahl, (auth)/passwort-aendern
  campus/lernen          Themenübersicht des Teilnehmers (Startseite nach Login)
  campus/topic/[id]      Fachkundetext lesen + zugehörige Fragen
  campus/pruefung        Wochenprüfung: Ablauf, Timer, Abgabe, Ergebnis
  campus/fortschritt     Beherrschungsgrad je Lernfeld, Prüfungsreife
  campus/berichtsheft    Ausbildungsnachweis erfassen und einreichen
  campus/profil          Konto, Sprache, Darstellung
  campus/mehr            Sekundärnavigation, Hilfe, Rechtliches
  ausbilder/teilnehmer   Liste der betreuten Teilnehmer
  ausbilder/kohorte/[id] Kohortenübersicht mit Kennzahlen
  ausbilder/review       Warteschlange offener Bewertungen
  ausbilder/fragen       Fragenpflege
  ausbilder/berichtsheft Berichtshefte prüfen und abzeichnen
  admin/nutzer, admin/monitoring, admin/audit
  (marketing)/impressum, (marketing)/datenschutz

Informationsdichte, bewusst zweigeteilt:
- campus/*  → LUFTIG. Wenige Elemente pro Screen, große Flächen, Basisschrift
  1rem, Lesetexte 1.125rem, Zeilenlänge max. 68 Zeichen, großzügige Abstände.
- ausbilder/* und admin/* → KOMPAKT. Tabellen und Listen, Basisschrift 0.875rem
  in Tabellen, dichte Zeilenhöhen, viele Datenpunkte gleichzeitig sichtbar.
Diese Zweiteilung wird über die Layout-Shell gesteuert, nicht pro Komponente
neu erfunden.

Marke und Stimmung: klar, vertrauenswürdig, ermutigend.
Visuelle Referenzen (Haltung, nicht Kopie): GOV.UK Design System für Klarheit
und Barrierefreiheit, Duolingo für den Lernfluss und die Fortschrittslogik,
Linear für die dichten Ausbilder-Tabellen.

════════════════════════════════════════════════════════════
2. TECH-STACK & KONVENTIONEN
════════════════════════════════════════════════════════════

Vorhanden und NICHT auszutauschen:
- Next.js 15 App Router, React 19, TypeScript strict
- Tailwind CSS 3, darkMode: 'class'
- Supabase (Auth, Postgres, RLS, Edge Functions)
- next-intl, Locales: de, en, fr, tr, ar, uk  (ar = RTL)
- pnpm-Workspace mit packages/config, packages/core, packages/db, packages/ui
- Service-Worker / PWA

NICHT einführen: shadcn/ui als CLI-Installation, Radix als Vollabhängigkeit,
CSS-in-JS, Styled-Components, MUI, Chakra, Framer Motion. Wir bauen ein
schlankes eigenes Set. Erlaubt sind, falls für Zugänglichkeit nötig, einzelne
@radix-ui/react-* Primitives für Dialog, Popover, Tabs und Select — jeweils
einzeln installiert und in packages/ui gekapselt, nie direkt im Screen benutzt.

Ordnerstruktur:
  packages/ui/src/tokens/         Token-Definitionen, CSS-Variablen-Export
  packages/ui/src/primitive/      Button, Input, Select, Checkbox, Radio,
                                  Textarea, Badge, Card, Alert, Skeleton,
                                  Spinner, Avatar, Progress, Tooltip
  packages/ui/src/muster/         Zusammengesetztes: DatenTabelle, LeerZustand,
                                  FehlerZustand, LadeZustand, Seitenkopf,
                                  Formularfeld, Modal, Blaettern, Suchfeld
  packages/ui/src/index.ts        Barrel-Export, einzige öffentliche Oberfläche
  components/shell/               App-Shell: Kopfzeile, Seitennavigation,
                                  Unterleiste (mobil), Sprachumschalter
  app/[locale]/<bereich>/_components/   nur bereichsspezifische Bausteine
  app/globals.css                 CSS-Variablen, Basis-Reset, Fokus-Ring

Naming:
- Dateien und Ordner: kebab-case (daten-tabelle.tsx)
- React-Komponenten: PascalCase, deutschsprachige Namen für fachliche
  Komponenten (FortschrittsRing, PruefungsKarte, BerichtsheftEintrag),
  englische Namen nur für generische Primitives (Button, Input, Card).
- Props: deutsch für fachliche Bedeutung (variante, groesse, zustand),
  englisch für React-Standards (children, className, onClick, disabled).
- Keine Default-Exports außer bei Next.js page.tsx / layout.tsx.
- Jede Komponente in packages/ui exportiert zusätzlich ihren Props-Typ.

Styling-Regeln:
- Ausschließlich Tailwind-Utilities mit Token-Klassen. Kein style={{}} außer
  für dynamisch berechnete Werte (z. B. Fortschrittsbreite in Prozent).
- Klassen-Zusammenführung über eine Hilfsfunktion cn() in
  packages/ui/src/cn.ts (clsx + tailwind-merge).
- Varianten über eine kleine eigene variante()-Hilfsfunktion mit
  Record<Variante, string> Maps. Kein cva, keine externe Abhängigkeit nötig.

Serverkomponenten sind Standard. 'use client' nur dort, wo Interaktion,
State oder Browser-APIs gebraucht werden — dann so tief wie möglich im Baum.

Internationalisierung:
- Kein sichtbarer Text im JSX. Alles über useTranslations / getTranslations
  und die JSON-Dateien in messages/.
- Neue Schlüssel werden in ALLEN sechs Sprachdateien angelegt. Fehlt eine
  Übersetzung, steht dort der deutsche Text als Platzhalter, nie ein leerer
  String.
- Schlüsselstruktur: <bereich>.<screen>.<element>, z. B.
  campus.pruefung.abgabeBestaetigen

════════════════════════════════════════════════════════════
3. DESIGN-TOKENS
════════════════════════════════════════════════════════════

Primärfarbe ist ein warmes Bernstein-Orange. Wichtig: Orange grenzt farblich
an Warnung und Fehler. Deshalb gilt — Primär erscheint AUSSCHLIESSLICH als
gefüllte Fläche (Buttons, aktive Navigation, Fokusring). Warnungen erscheinen
AUSSCHLIESSLICH als helle Fläche mit Rand, Symbol und Textlabel. Die
Unterscheidung läuft über die Form, nicht über den Farbton.

--- 3.1 Farbpalette (HEX) ---

Primär (Bernstein):
  primary-50   #FDF8ED
  primary-100  #F9EDD2
  primary-200  #F2D8A2
  primary-300  #E8BC68
  primary-400  #D89B36
  primary-500  #C27A12
  primary-600  #B45309   ← PRIMARY. Kontrast auf Weiß 5.14:1 (AA für Fließtext)
  primary-700  #92400E
  primary-800  #78350F
  primary-900  #5A2A0B
  primary-950  #3B1B07

Neutral (warmes Grau, harmoniert mit Bernstein):
  neutral-50   #FAFAF9
  neutral-100  #F5F5F4
  neutral-200  #E7E5E4
  neutral-300  #D6D3D1
  neutral-400  #A8A29E
  neutral-500  #78716C
  neutral-600  #57534E
  neutral-700  #44403C
  neutral-800  #292524
  neutral-900  #1C1917
  neutral-950  #0C0A09

Semantisch:
  success      #15803D   hell #F0FDF4   Rand #BBF7D0   dunkel-Variante #4ADE80
  warning      #A16207   hell #FEFCE8   Rand #FEF08A   dunkel-Variante #FACC15
  danger       #B91C1C   hell #FEF2F2   Rand #FECACA   dunkel-Variante #F87171
  info         #1D4ED8   hell #EFF6FF   Rand #BFDBFE   dunkel-Variante #60A5FA

Lernstatus (bestehende Semantik beibehalten, Farbe NIE allein):
  status-neu      #78716C   Symbol ○   Label "Noch nicht geübt"
  status-teil     #3B9B5E   Symbol ◐   Label "Teilweise sicher"
  status-falsch   #CC2929   Symbol ✕   Label "Nochmal üben"
  status-fertig   #1D8745   Symbol ✓   Label "Sicher"

--- 3.2 CSS-Variablen (app/globals.css, ersetzt den bestehenden :root-Block) ---

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Flächen und Text */
    --bg:              #FAFAF9;
    --bg-subtle:       #F5F5F4;
    --surface:         #FFFFFF;
    --surface-raised:  #FFFFFF;
    --border:          #E7E5E4;
    --border-strong:   #D6D3D1;
    --fg:              #1C1917;
    --fg-muted:        #57534E;
    --fg-subtle:       #78716C;
    --fg-on-primary:   #FFFFFF;

    /* Primär */
    --primary:         #B45309;
    --primary-hover:   #92400E;
    --primary-active:  #78350F;
    --primary-subtle:  #FDF8ED;
    --primary-border:  #F2D8A2;
    --ring:            #B45309;

    /* Semantisch */
    --success: #15803D;  --success-bg: #F0FDF4;  --success-border: #BBF7D0;
    --warning: #A16207;  --warning-bg: #FEFCE8;  --warning-border: #FEF08A;
    --danger:  #B91C1C;  --danger-bg:  #FEF2F2;  --danger-border:  #FECACA;
    --info:    #1D4ED8;  --info-bg:    #EFF6FF;  --info-border:    #BFDBFE;

    /* Lernstatus */
    --status-neu:     #78716C;
    --status-teil:    #3B9B5E;
    --status-falsch:  #CC2929;
    --status-fertig:  #1D8745;

    /* Radien */
    --radius-sm:   0.375rem;   /*  6px  Badges, kleine Marker           */
    --radius-md:   0.625rem;   /* 10px  Buttons, Inputs                 */
    --radius-lg:   0.875rem;   /* 14px  Karten                          */
    --radius-xl:   1.125rem;   /* 18px  Modale, große Panels            */
    --radius-full: 9999px;

    /* Schatten */
    --shadow-sm: 0 1px 2px 0 rgb(28 25 23 / 0.06),
                 0 1px 3px 0 rgb(28 25 23 / 0.08);
    --shadow-md: 0 2px 4px -1px rgb(28 25 23 / 0.06),
                 0 6px 12px -2px rgb(28 25 23 / 0.10);
    --shadow-lg: 0 8px 16px -4px rgb(28 25 23 / 0.08),
                 0 20px 32px -8px rgb(28 25 23 / 0.14);
  }

  .dark {
    --bg:              #0C0A09;
    --bg-subtle:       #1C1917;
    --surface:         #1C1917;
    --surface-raised:  #292524;
    --border:          #292524;
    --border-strong:   #44403C;
    --fg:              #F5F5F4;
    --fg-muted:        #A8A29E;
    --fg-subtle:       #78716C;
    --fg-on-primary:   #2B1405;

    --primary:         #E8BC68;   /* aufgehellt, Kontrast auf #0C0A09 9.4:1 */
    --primary-hover:   #F2D8A2;
    --primary-active:  #F9EDD2;
    --primary-subtle:  #2B1B08;
    --primary-border:  #5A2A0B;
    --ring:            #E8BC68;

    --success: #4ADE80;  --success-bg: #0B2417;  --success-border: #14532D;
    --warning: #FACC15;  --warning-bg: #241D05;  --warning-border: #713F12;
    --danger:  #F87171;  --danger-bg:  #2A1010;  --danger-border:  #7F1D1D;
    --info:    #60A5FA;  --info-bg:    #0D1A33;  --info-border:    #1E3A8A;

    --status-neu:     #A8A29E;
    --status-teil:    #4ADE80;
    --status-falsch:  #F87171;
    --status-fertig:  #22C55E;

    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.40);
    --shadow-md: 0 4px 10px -2px rgb(0 0 0 / 0.50);
    --shadow-lg: 0 16px 32px -8px rgb(0 0 0 / 0.60);
  }

  * { box-sizing: border-box; }
  html { -webkit-text-size-adjust: 100%; }
  body {
    margin: 0;
    background: var(--bg);
    color: var(--fg);
    font-family: var(--font-sans), system-ui, 'Segoe UI', Roboto, sans-serif;
    font-size: 1rem;
    line-height: 1.5;
    text-rendering: optimizeLegibility;
  }

  /* Fokus: einheitlich, immer sichtbar, nie entfernt */
  :where(a, button, input, select, textarea, summary, [tabindex]):focus-visible {
    outline: 3px solid var(--ring);
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }

  /* Mindest-Berührungsziel 48x48 für alle Bedienelemente im Campus-Bereich */
  .touchable { min-height: 48px; min-width: 48px; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}

--- 3.3 Schrift ---

Inter (variabel, Gewichte 400–700) und Noto Sans Arabic (variabel), beide
SELBST GEHOSTET. Die Dateien liegen BEREITS im Repository unter public/fonts/
und sind nach Unicode-Bereichen aufgeteilt, damit ein deutscher Nutzer nur
48 KB lädt statt der vollen Schrift:

  public/fonts/inter-latin.woff2         48 KB  de, en, fr (Grundbestand)
  public/fonts/inter-latin-ext.woff2     85 KB  tr und Sonderzeichen
  public/fonts/inter-cyrillic.woff2      19 KB  uk
  public/fonts/noto-sans-arabic.woff2   166 KB  ar
  public/fonts/Inter-LICENSE.txt                SIL Open Font License 1.1
  public/fonts/NotoSansArabic-LICENSE.txt       SIL Open Font License 1.1

Einbindung als @font-face in app/globals.css, direkt nach den @tailwind-
Direktiven. Der Browser lädt über unicode-range nur, was der angezeigte Text
tatsächlich braucht. next/font/local wird hier NICHT verwendet, weil es keine
unicode-range-Aufteilung unterstützt.

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-display: swap;
  font-weight: 400 700;
  src: url('/fonts/inter-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,
    U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,
    U+2212,U+2215,U+FEFF,U+FFFD;
}
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-display: swap;
  font-weight: 400 700;
  src: url('/fonts/inter-latin-ext.woff2') format('woff2');
  unicode-range: U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,
    U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,
    U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF;
}
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-display: swap;
  font-weight: 400 700;
  src: url('/fonts/inter-cyrillic.woff2') format('woff2');
  unicode-range: U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116;
}
@font-face {
  font-family: 'Noto Sans Arabic';
  font-style: normal;
  font-display: swap;
  font-weight: 400 700;
  src: url('/fonts/noto-sans-arabic.woff2') format('woff2');
  unicode-range: U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0897-08E1,
    U+08E3-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,
    U+FE70-FE74,U+FE76-FEFC;
}

Die Variable --font-sans wird in app/globals.css gesetzt, nicht per JS:

  :root { --font-sans: 'Inter', 'Noto Sans Arabic'; }

Reihenfolge ist wichtig: Inter zuerst, Noto Sans Arabic als zweite Familie.
Durch die unicode-range greift automatisch die passende Schrift je Zeichen.

Der Service-Worker cached /fonts/*.woff2 mit Strategie cache-first und
unbegrenzter Haltbarkeit (die Dateien sind versioniert unveränderlich),
damit offline kein Fallback-Sprung entsteht.

Die beiden LICENSE-Dateien bleiben im Repository und werden mit ausgeliefert;
die SIL Open Font License verlangt das. Nicht löschen, nicht umbenennen.

Typo-Skala (Name — Größe / Zeilenhöhe / Gewicht / Laufweite — Verwendung):
  display   2.25rem / 2.5rem  / 700 / -0.02em   Nur Marketing und Login-Titel
  h1        1.875rem / 2.25rem / 700 / -0.02em  Screen-Titel Desktop
  h2        1.5rem  / 2rem    / 600 / -0.01em   Abschnittsüberschrift
  h3        1.25rem / 1.75rem / 600 / -0.01em   Kartentitel
  h4        1.125rem / 1.625rem / 600 / 0       Untertitel, Formulargruppen
  body-lg   1.125rem / 1.75rem / 400 / 0        Fachkundetext, Prüfungsfragen
  body      1rem    / 1.5rem  / 400 / 0         Standardtext Campus
  body-sm   0.875rem / 1.375rem / 400 / 0       Tabellen Ausbilder/Admin
  label     0.875rem / 1.25rem / 500 / 0        Formularlabels, Buttons
  caption   0.75rem / 1.125rem / 400 / 0.01em   Metainfo, Zeitstempel
  overline  0.75rem / 1rem    / 600 / 0.06em    Kleine Großbuchstaben-Labels

Mobil: h1 fällt auf 1.5rem/2rem, display auf 1.875rem/2.25rem.
Es gibt KEINE weiteren Schriftgrößen. Wer eine braucht, nimmt die nächste.

--- 3.4 Spacing (4er-Raster) ---

  0   0        1  0.25rem  4px     2  0.5rem  8px     3  0.75rem 12px
  4   1rem 16  5  1.25rem 20px     6  1.5rem  24px    8  2rem    32px
  10  2.5rem   12 3rem    48px     16 4rem    64px    20 5rem    80px
  24  6rem

Verwendungsregeln:
  Abstand innerhalb einer Komponente:      2 oder 3
  Abstand zwischen verwandten Elementen:   4
  Abstand zwischen Formularfeldern:        5
  Abstand zwischen Abschnitten (Campus):   8 mobil, 12 Desktop
  Abstand zwischen Abschnitten (Ausbilder):6 mobil, 8 Desktop
  Seitenrand mobil:                        4
  Seitenrand Desktop:                      8
  Karten-Innenabstand Campus:              5
  Karten-Innenabstand Ausbilder/Admin:     4
  Tabellenzelle:                           py-3 px-4 (kompakt: py-2 px-3)

--- 3.5 Breakpoints ---

  (Basis)   0–639px    Mobil, eine Spalte, Unterleisten-Navigation
  sm        640px      Große Handys, Tablet hochkant
  md        768px      Tablet quer, Seitennavigation erscheint
  lg        1024px     Laptop, mehrspaltige Layouts
  xl        1280px     Desktop, max. Inhaltsbreite greift
  2xl       1536px     Große Monitore, kein neues Layout, nur mehr Rand

Maximale Inhaltsbreiten:
  Lesetext (Fachkunde, Prüfungsfrage):  42rem (ca. 68 Zeichen)
  Formulare:                            32rem
  Campus-Screens allgemein:             64rem
  Ausbilder-/Admin-Tabellen:            90rem

--- 3.6 tailwind.config.ts (vollständig ersetzen) ---

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './packages/ui/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg:      { DEFAULT: 'var(--bg)', subtle: 'var(--bg-subtle)' },
        surface: { DEFAULT: 'var(--surface)', raised: 'var(--surface-raised)' },
        border:  { DEFAULT: 'var(--border)', strong: 'var(--border-strong)' },
        fg:      { DEFAULT: 'var(--fg)',
                   muted: 'var(--fg-muted)',
                   subtle: 'var(--fg-subtle)',
                   onPrimary: 'var(--fg-on-primary)' },
        primary: { DEFAULT: 'var(--primary)',
                   hover:  'var(--primary-hover)',
                   active: 'var(--primary-active)',
                   subtle: 'var(--primary-subtle)',
                   border: 'var(--primary-border)' },
        success: { DEFAULT: 'var(--success)', bg: 'var(--success-bg)', border: 'var(--success-border)' },
        warning: { DEFAULT: 'var(--warning)', bg: 'var(--warning-bg)', border: 'var(--warning-border)' },
        danger:  { DEFAULT: 'var(--danger)',  bg: 'var(--danger-bg)',  border: 'var(--danger-border)'  },
        info:    { DEFAULT: 'var(--info)',    bg: 'var(--info-bg)',    border: 'var(--info-border)'    },
        status:  { neu:    'var(--status-neu)',
                   teil:   'var(--status-teil)',
                   falsch: 'var(--status-falsch)',
                   fertig: 'var(--status-fertig)' },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        caption:  ['0.75rem',  { lineHeight: '1.125rem', letterSpacing: '0.01em' }],
        overline: ['0.75rem',  { lineHeight: '1rem', letterSpacing: '0.06em', fontWeight: '600' }],
        'body-sm':['0.875rem', { lineHeight: '1.375rem' }],
        label:    ['0.875rem', { lineHeight: '1.25rem', fontWeight: '500' }],
        body:     ['1rem',     { lineHeight: '1.5rem' }],
        'body-lg':['1.125rem', { lineHeight: '1.75rem' }],
        h4:       ['1.125rem', { lineHeight: '1.625rem', fontWeight: '600' }],
        h3:       ['1.25rem',  { lineHeight: '1.75rem', fontWeight: '600', letterSpacing: '-0.01em' }],
        h2:       ['1.5rem',   { lineHeight: '2rem', fontWeight: '600', letterSpacing: '-0.01em' }],
        h1:       ['1.875rem', { lineHeight: '2.25rem', fontWeight: '700', letterSpacing: '-0.02em' }],
        display:  ['2.25rem',  { lineHeight: '2.5rem', fontWeight: '700', letterSpacing: '-0.02em' }],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      spacing: { touch: '48px' },
      maxWidth: {
        lese:     '42rem',
        formular: '32rem',
        campus:   '64rem',
        daten:    '90rem',
      },
      ringColor:  { DEFAULT: 'var(--ring)' },
      ringWidth:  { DEFAULT: '3px' },
      transitionDuration: { DEFAULT: '150ms' },
    },
  },
  plugins: [],
};

export default config;

════════════════════════════════════════════════════════════
4. KOMPONENTEN-INVENTAR
════════════════════════════════════════════════════════════

Für JEDE Komponente gilt: alle unten genannten Zustände müssen implementiert
und in app/[locale]/showcase sichtbar sein. Ein fehlender Zustand ist ein Bug.

Standardzustände, die überall gelten:
  default · hover · active · focus-visible (3px Ring, offset 2) · disabled
  (opacity 50, cursor-not-allowed, aria-disabled) · loading (falls sinnvoll)
  · error (falls Eingabe) · empty (falls Sammlung)

--- 4.1 Primitives (packages/ui/src/primitive/) ---

Button
  Varianten: primary (gefüllt Bernstein, Text --fg-on-primary)
             sekundaer (Rand border-strong, transparent, Text fg)
             leise (kein Rand, Hover bg-subtle)
             gefahr (gefüllt danger, nur für Löschen/Endgültiges)
             link (unterstrichen, inline, keine Höhe)
  Größen:    sm (h-9, px-3, label)  md (h-11, px-4, label)
             lg (h-12, px-6, body)  — Campus benutzt lg oder md, nie sm
  Props:     variante, groesse, laedt, deaktiviert, iconLinks, iconRechts,
             volleBreite, type
  Zustände:  hover → primary-hover; active → primary-active + kein Transform;
             focus-visible → Ring; disabled → 50% Deckkraft, kein Hover;
             loading → Spinner links, Label bleibt sichtbar, aria-busy="true",
             Button ist deaktiviert, Breite bleibt konstant (kein Springen).
  Regeln:    Pro Screen genau EIN primary-Button. Icon-only-Buttons brauchen
             aria-label. Mindesthöhe im Campus 48px.

IconButton
  Wie Button, quadratisch, Größen 40/48px, aria-label Pflicht, Tooltip optional.

Input / Textarea
  Höhe md 44px, lg 48px. Rand border, Radius md, bg surface.
  Zustände: hover → border-strong; focus-visible → Ring + border-primary;
            disabled → bg-subtle, fg-subtle; error → border-danger +
            Hinweistext danger darunter + aria-invalid + aria-describedby;
            readonly → bg-subtle, kein Ring beim Klick;
            mit Präfix/Suffix-Slot; Zeichenzähler optional bei Textarea.
  Bei Zahlen inputMode="numeric", bei E-Mail inputMode="email".

Select
  Nativ <select> als Basis (funktioniert auf alten Androids am zuverlässigsten).
  Erst wenn Mehrfachauswahl oder Suche nötig ist, Radix-Select kapseln.

Checkbox / Radio
  Berührungsziel 48px inkl. Label. Klickbares Label per <label htmlFor>.
  Zustände: unchecked, checked, indeterminate (nur Checkbox), disabled,
            focus-visible, error. Markierung immer Symbol + Farbe.

Switch
  Nur für sofort wirksame Einstellungen (Dark Mode, Benachrichtigungen).
  Niemals in Formularen mit Speichern-Button — dort Checkbox.

Badge
  Varianten: neutral, primary, success, warning, danger, info
  Größen: sm, md. Immer Text, optional führendes Symbol. Nie nur Farbe.

StatusBadge (fachlich, für Lernstatus)
  Vier feste Zustände: neu ○, teil ◐, falsch ✕, fertig ✓
  Rendert IMMER Symbol + Farbe + Textlabel. Textlabel darf per Prop
  visuell versteckt werden (sr-only), aber nie aus dem DOM verschwinden.

Card
  Varianten: flach (Rand, kein Schatten) · erhoben (shadow-sm) ·
             interaktiv (als Link/Button, Hover → shadow-md + border-strong)
  Slots: kopf, inhalt, fuss. Radius lg. Innenabstand siehe 3.4.

Alert
  Varianten: info, success, warning, danger
  Aufbau: Symbol + fette Kurzüberschrift + erklärender Satz + optional Aktion.
  role="status" bei info/success, role="alert" bei warning/danger.
  Farbe nie allein: Symbol und Überschrift tragen die Bedeutung.

Progress
  Linear (Balken) und Ring (Fortschritt in Prozent).
  role="progressbar", aria-valuenow/min/max, sichtbare Prozentzahl daneben.
  Unbestimmter Zustand: gestreifte Animation, respektiert reduced-motion.

Skeleton
  Graue Platzhalterflächen in exakt der Größe des späteren Inhalts.
  Kein Puls-Effekt bei reduced-motion. aria-hidden, umgebender Container
  trägt aria-busy="true".

Spinner
  Größen sm/md/lg. Immer mit sr-only-Text "Wird geladen".

Avatar
  Initialen-Fallback aus dem Namen, deterministische Hintergrundfarbe aus der
  Neutral-Skala (nie aus Statusfarben). Größen 24/32/40/48.

Tooltip
  Nur ergänzend, nie einzige Informationsquelle. Auf Touch-Geräten wird der
  Inhalt stattdessen als Hinweistext unter dem Element gerendert.

--- 4.2 Muster (packages/ui/src/muster/) ---

Seitenkopf
  Titel (h1/h2), optionaler Beschreibungssatz, optionale Aktionen rechts,
  optionaler Zurück-Pfeil, optionale Brotkrumen ab md.
  Mobil: Aktionen wandern unter den Titel oder in ein Überlaufmenü.

Formularfeld
  Wrapper aus Label + Pflichtkennzeichnung + Eingabe + Hilfetext + Fehlertext.
  Verdrahtet id, aria-describedby und aria-invalid automatisch.
  Pflichtfelder werden mit dem Wort "Pflicht" gekennzeichnet, nicht nur "*".

DatenTabelle
  Für ausbilder/* und admin/*. Spaltenkonfiguration als Array.
  Zustände: laden (5 Skeleton-Zeilen) · leer (LeerZustand innerhalb) ·
            fehler (FehlerZustand mit Erneut-Button) · gefüllt
  Funktionen: Sortierung (aria-sort), Zeilenauswahl, Sticky-Kopfzeile,
              horizontales Scrollen mit sichtbarem Schattenhinweis am Rand.
  Mobil unter md: Tabelle wird zu einer Liste aus Karten, ein Datensatz pro
  Karte, die zwei wichtigsten Spalten oben, Rest als Label-Wert-Paare.

LeerZustand
  Symbol + Überschrift + ein erklärender Satz + genau eine Handlungsaufforderung.
  Beispiel Review-Warteschlange: "Nichts zu prüfen. Alle Abgaben sind
  bearbeitet." + Button "Zur Teilnehmerliste".

FehlerZustand
  Symbol + "Das hat nicht geklappt" + verständlicher Grund in einfacher
  Sprache + Button "Erneut versuchen" + optional technische Details in
  einem zugeklappten <details>.

OfflineHinweis
  Persistente Leiste am oberen Rand, wenn navigator.onLine false ist:
  "Keine Verbindung. Deine Eingaben werden gespeichert und später gesendet."
  role="status", aria-live="polite".

LadeZustand
  Vollflächige Skeleton-Variante je Screen-Typ (Liste, Detail, Formular).

Modal
  Fokusfalle, Escape schließt, Klick auf Overlay schließt (außer bei
  ungespeicherten Daten), Fokus kehrt zum Auslöser zurück, aria-modal,
  aria-labelledby. Mobil unter sm: als Bottom-Sheet über die volle Breite.

Blaettern (Pagination)
  Zurück/Weiter + Seitenzahlen ab md, nur Zurück/Weiter + "Seite 3 von 12"
  darunter. Bei langen Listen im Campus stattdessen "Mehr laden".

Suchfeld
  Mit Löschen-Button, Entprellung 300ms, Ergebniszahl als aria-live-Region.

Bestaetigungsdialog
  Für alles Unwiderrufliche (Prüfung abgeben, Berichtsheft einreichen,
  Nutzer löschen). Titel als Frage, Konsequenz als Satz, primäre Aktion
  benennt die Handlung ("Prüfung abgeben"), nie "OK".

--- 4.3 Fachliche Komponenten (in den jeweiligen _components/) ---

FortschrittsRing        Prozentring + Zahl + Lernfeldname, Größen sm/lg
LernfeldKarte           Titel, StatusBadge, Fortschrittsbalken, Fragenzahl,
                        als interaktive Card, ganze Fläche klickbar
FrageKarte              Fragetext (body-lg), Antwortoptionen als große
                        Radio-Flächen (min. 56px hoch), Zustände:
                        unbeantwortet · ausgewählt · aufgelöst-richtig ·
                        aufgelöst-falsch · aufgelöst-nicht-gewählt-aber-richtig
                        Auflösung immer mit Symbol + Text, nie nur Farbe.
                        Darunter Begründung und Quellenangabe, falls vorhanden.
UebersetzungsBlock      Deutscher Originaltext oben, Übersetzung darunter in
                        fg-muted mit Sprachkennzeichnung und lang-Attribut.
                        Nie ersetzend. Ein-/ausklappbar.
PruefungsTimer          Verbleibende Zeit, ab 5 Minuten warning, ab 1 Minute
                        danger, aria-live="polite" im Minutentakt (nicht
                        sekündlich — sonst Screenreader-Dauerfeuer).
PruefungsNavigator      Raster aller Fragen mit Zustand beantwortet/offen/
                        markiert, Sprung zur Frage. Mobil als horizontale
                        Scrollleiste am unteren Rand.
KiHinweis               Fest formulierter Hinweisblock, wo immer eine
                        KI-Bewertung erscheint: "Automatisches Lernfeedback.
                        Keine Prüfungsleistung und keine Bewertung der Kammer."
                        Variante info, nicht wegklickbar.
PruefungsreifeAnzeige   Zeigt Reifegrad, nie die Worte "zugelassen" oder
                        "freigeschaltet". Erlaubt: "Prüfungsreife erreicht",
                        "Empfehlung an Ausbilder gesendet".
BerichtsheftEintrag     Datum, Tätigkeiten, Stunden, Status, Ausbilder-Notiz.
                        Zustände: entwurf · eingereicht · abgezeichnet ·
                        zurückgewiesen — jeweils Symbol + Label + Farbe.

════════════════════════════════════════════════════════════
5. LAYOUT-PATTERNS
════════════════════════════════════════════════════════════

--- 5.1 App-Shell (components/shell/) ---

MOBIL (< md):
  Oben: schlanke Kopfzeile 56px, sticky, bg surface, unterer Rand border.
        Links Screen-Titel oder Zurück-Pfeil, rechts maximal zwei
        Icon-Buttons (Suche, Profil).
  Mitte: Inhalt, Seitenrand 4, unten 96px Freiraum für die Unterleiste.
  Unten: Tab-Leiste, sticky, 64px + safe-area-inset-bottom, bg surface,
         oberer Rand border. Genau vier Ziele für Teilnehmende:
         Lernen · Prüfung · Fortschritt · Mehr
         Jeder Tab: Symbol + Textlabel untereinander, aktiver Tab in primary
         mit zusätzlicher 2px-Linie oben und aria-current="page".
         Ausbilder mobil: Teilnehmer · Review · Berichtsheft · Mehr

DESKTOP (>= md):
  Links: Seitennavigation, Breite 240px (lg: 264px), sticky, volle Höhe,
         bg bg-subtle, rechter Rand border. Oben BZE-Logo/Wortmarke,
         darunter gruppierte Navigationsabschnitte mit Überschriften
         (overline, fg-subtle), unten Nutzerbereich mit Avatar, Name,
         Rolle und Menü (Sprache, Darstellung, Abmelden).
         Aktiver Eintrag: bg primary-subtle, Text primary, linke 3px-Leiste
         in primary, aria-current="page".
  Oben:  Kopfzeile 64px, sticky, enthält Brotkrumen links und Aktionen rechts.
  Mitte: Inhalt, zentriert, max-w je Screen-Typ, Seitenrand 8.
  Keine Unterleiste auf Desktop.

Sprachumschalter: in profil und im Nutzermenü, Liste der sechs Sprachen mit
Eigenbezeichnung (Deutsch, English, Français, Türkçe, العربية, Українська).
Wahl setzt das Locale-Cookie und das dir-Attribut.

Darstellungsumschalter: drei Optionen — System, Hell, Dunkel. Standard System.
Wert in localStorage, Klasse .dark am <html>. Inline-Skript im <head>
verhindert das Aufblitzen der falschen Variante beim Laden.

--- 5.2 Screens im Einzelnen ---

campus/lernen (Startseite Teilnehmer)
  Mobil:   Begrüßung mit Vorname (h2) · Fortschrittskarte "Prüfungsreife"
           mit Ring und einem Satz Einordnung · Karte "Weitermachen" mit dem
           zuletzt bearbeiteten Thema und großem primary-Button · Überschrift
           "Deine Lernfelder" · einspaltige Liste aus LernfeldKarte,
           Abstand 4 · ganz unten Hinweis auf die nächste Wochenprüfung.
  Desktop: zweispaltig im Verhältnis 2:1. Links Weitermachen-Karte und
           Lernfeld-Raster (md 2 Spalten, xl 3 Spalten). Rechts als Spalte
           die Fortschrittskarte, der Prüfungshinweis und offene Aufgaben.
  Leer:    Noch kein Lernfeld zugewiesen → LeerZustand "Dein Ausbilder hat
           dir noch keine Lernfelder freigegeben."

campus/topic/[id]
  Mobil:   Kopfzeile mit Zurück-Pfeil und Themenname · Fortschrittsbalken
           direkt darunter, sticky · Fachkundetext, max-w-lese, body-lg,
           Bilder volle Breite mit Bildunterschrift caption ·
           UebersetzungsBlock je Absatz einklappbar · am Ende ein
           angehefteter primary-Button "Fragen üben" über der Unterleiste.
  Desktop: dreispaltig — links die App-Navigation, Mitte der Lesetext in
           max-w-lese, rechts ab lg ein sticky Inhaltsverzeichnis der
           Abschnitte mit aktiver Markierung beim Scrollen. Aktion "Fragen
           üben" oben rechts in der Kopfzeile und zusätzlich am Textende.

campus/pruefung
  Ablauf in drei Phasen, jeweils eigener Layout-Zustand:
  1 Start:  zentrierte Karte, max-w-formular. Regeln als kurze Liste
            (Dauer, Fragenzahl, Wiederholbarkeit), primary-Button
            "Prüfung starten", darunter Hinweis "Du kannst pausieren."
  2 Lauf:   Mobil — oben sticky Leiste mit Timer, "Frage 7 von 30" und
            Fortschrittsbalken; Mitte eine FrageKarte, max-w-lese; unten
            über der Unterleiste zwei Buttons (sekundaer "Zurück",
            primary "Weiter") plus PruefungsNavigator als aufklappbare
            Leiste. Nur EINE Frage pro Bildschirm.
            Desktop — links Frageninhalt zentriert, rechts sticky Spalte
            mit Timer, Navigator-Raster und Button "Prüfung abgeben".
            Abgabe immer über Bestaetigungsdialog.
  3 Ergebnis: Große Ergebniskarte mit Punktzahl, Prozent und einem
            ermutigenden Satz. Danach Aufschlüsselung nach Lernfeld mit
            Balken. Darunter Liste aller Fragen mit Auflösung, aufklappbar.
            Sichtbarer KiHinweis, wo Freitext bewertet wurde.
            Primäraktion: "Schwache Themen üben".

campus/fortschritt
  Mobil:   Prüfungsreife-Ring groß oben, darunter ein erklärender Satz,
           danach je Lernfeld eine Zeile mit Name, StatusBadge, Balken und
           Prozent. Tippen öffnet die Themenliste des Lernfelds.
  Desktop: Ring und Kennzahlen als Kartenreihe oben (3–4 Kacheln),
           darunter eine kompakte Tabelle der Lernfelder mit Spalten
           Lernfeld, Status, Geübte Fragen, Beherrschung, Letzte Aktivität.

campus/berichtsheft
  Mobil:   Wochenauswahl als horizontale Chip-Leiste, aktive Woche in
           primary · Formular mit Tätigkeiten (Textarea), Stunden
           (numerisches Input), optional Lernfeldbezug · Status oben als
           Badge · Buttons "Entwurf speichern" (sekundaer) und "Einreichen"
           (primary, mit Bestaetigungsdialog).
  Desktop: links Wochenliste als Navigation mit Status je Woche, rechts
           das Formular in max-w-formular plus Verlauf der Ausbilder-Notizen.
  Regel:   Automatisch gespeicherte Entwürfe zeigen "Zuletzt gespeichert
           um HH:MM" als caption. Offline erfasste Einträge zeigen Badge
           "Wird gesendet, sobald du online bist."

campus/profil und campus/mehr
  Einfache Einstellungsliste, gruppiert mit Überschriften, jede Zeile 56px
  hoch mit Label links und Wert plus Pfeil rechts. Untergruppen: Konto,
  Sprache, Darstellung, Benachrichtigungen, Hilfe, Rechtliches, Abmelden
  (Text in danger, mit Bestätigung).

(auth)/login
  Zentrierte Karte max-w-formular, vertikal mittig, bg bg-subtle.
  Oben BZE-Wortmarke, h2 "Anmelden", Formular mit zwei Feldern, primary
  Button volle Breite, darunter "Passwort vergessen" als Link-Button und
  ganz unten der Sprachumschalter als schlichte Auswahl. Fehler erscheinen
  als Alert über dem Formular, nicht als Browser-Popup.

(auth)/sprachwahl
  Ganzseitige Liste großer Auswahlflächen (je 64px), Sprache in
  Eigenbezeichnung, ausgewählte mit ✓. Erscheint einmalig vor dem Login.

ausbilder/teilnehmer
  Mobil:   Suchfeld oben, darunter Kartenliste mit Avatar, Name, Kohorte,
           Prüfungsreife-Balken und Badge für offene Aufgaben.
  Desktop: Seitenkopf mit Suchfeld und Filtern (Kohorte, Status) in einer
           Leiste, darunter DatenTabelle mit Spalten Name, Kohorte,
           Prüfungsreife, Offene Reviews, Berichtsheft, Letzte Aktivität.
           Zeilenklick öffnet die Detailseite. Sticky Kopfzeile.

ausbilder/review
  Zweispaltig ab lg: links die Warteschlange als schmale Liste (Teilnehmer,
  Frage, Wartezeit), rechts der ausgewählte Fall mit Frage, Musterlösung,
  Teilnehmerantwort, KI-Vorschlag samt KiHinweis, Bewertungsfeld und den
  Aktionen "Übernehmen" (primary) und "Anpassen". Tastaturkürzel J/K für
  vor und zurück, in der Fußzeile eingeblendet.
  Mobil: nur die Liste, Auswahl öffnet eine Vollbildansicht mit Zurück.
  Leer:  LeerZustand "Nichts zu prüfen."

ausbilder/kohorte/[id]
  Kennzahlenreihe oben (4 Kacheln: Teilnehmer, Ø Prüfungsreife, Offene
  Reviews, Berichtshefte fällig), darunter Tabelle der Teilnehmer und ein
  Balkendiagramm der Beherrschung je Lernfeld. Keine Tortendiagramme.

ausbilder/fragen und ausbilder/berichtsheft
  Standard-Muster: Seitenkopf mit Primäraktion rechts, Filterleiste,
  DatenTabelle, Detail als Modal auf Desktop und als eigene Seite mobil.

admin/nutzer, admin/monitoring, admin/audit
  Dichtestes Layout, DatenTabelle mit kompakten Zellen, Filterleiste,
  Export-Button sekundaer. Audit-Log ist ausschließlich lesbar und zeigt
  Zeitstempel monospace-ausgerichtet (tabular-nums).

(marketing)/impressum, /datenschutz
  Einspaltiger Lesetext max-w-lese, Seitenkopf, keine App-Navigation,
  schlichte Fußzeile mit Links.

════════════════════════════════════════════════════════════
6. HARTE REGELN
════════════════════════════════════════════════════════════

Farbe und Werte
 1. Keine Farbwerte im Code. Kein #hex, kein rgb(), kein hsl() außerhalb von
    app/globals.css. Ausschließlich Tailwind-Klassen aus der Token-Config.
 2. Keine neuen Farben, Schriftgrößen, Radien, Schatten oder Abstände
    erfinden. Fehlt etwas, nimm den nächstgelegenen Token.
 3. Keine Tailwind-Standardfarben (bg-blue-500, text-gray-700 und ähnliche).
    Nur die Projekt-Token: bg, surface, border, fg, primary, success,
    warning, danger, info, status.
 4. Keine willkürlichen Werte in eckigen Klammern (w-[347px], mt-[13px]).
    Ausnahme: berechnete Fortschrittsbreiten und einmalige Layout-Konstanten,
    dann mit Kommentar begründet.

Barrierefreiheit — Ziel ist WCAG 2.1 Stufe AA, vollständig
 5. Kontrast mindestens 4.5:1 für Text unter 24px, 3:1 für großen Text und
    für die Umrisse von Bedienelementen. Gilt in Hell UND Dunkel.
 6. Farbe ist nie der einzige Informationsträger. Jeder Status trägt
    zusätzlich Symbol und Textlabel. (Steht so schon in AGENTS.md.)
 7. Jedes interaktive Element ist per Tastatur erreichbar und hat einen
    sichtbaren Fokus. outline: none ohne Ersatz ist verboten.
 8. Semantisches HTML zuerst: button für Aktionen, a für Navigation,
    Überschriften in lückenloser Reihenfolge, genau ein h1 pro Seite,
    main/nav/header/footer als Landmarken, "Zum Inhalt springen" als
    erster fokussierbarer Link.
 9. Berührungsziele mindestens 48x48px im Campus-Bereich, 40x40px in
    Ausbilder- und Admin-Tabellen.
10. Formulare: jedes Feld hat ein sichtbares Label. Placeholder ersetzt nie
    ein Label. Fehler stehen als Text neben dem Feld, sind mit
    aria-describedby verknüpft, und beim Absenden springt der Fokus auf
    das erste fehlerhafte Feld.
11. Dynamische Änderungen werden angesagt: aria-live="polite" für
    Statusmeldungen, role="alert" für Fehler. Timer sekündlich zu aktualisieren
    ist verboten — nur im Minutentakt ansagen.
12. prefers-reduced-motion wird respektiert. Keine Animation über 200ms,
    kein Parallax, kein automatisches Karussell.

Mehrsprachigkeit
13. Kein hartcodierter sichtbarer Text. Alles über next-intl.
14. RTL vollständig: nur logische Eigenschaften verwenden — ms-/me-,
    ps-/pe-, start-/end-, text-start/text-end. ml-, mr-, pl-, pr-, left-,
    right- sind verboten. Richtungsabhängige Symbole (Pfeile) werden per
    rtl:-rotate-180 oder eigenem Symbol gespiegelt.
15. Layouts müssen 40% längeren Text vertragen (Deutsch → Französisch).
    Keine festen Breiten für Buttons oder Labels, kein Text-Abschneiden ohne
    title-Attribut.
16. Prüfungsinhalte bleiben immer Deutsch. Übersetzung erscheint zusätzlich
    darunter, mit lang-Attribut und Sprachkennzeichnung.

Zustände
17. Jeder Screen, der Daten lädt, hat drei Zustände: laden (Skeleton in der
    Form des Inhalts, kein zentrierter Spinner für ganze Seiten), leer
    (LeerZustand mit einer Handlungsaufforderung), fehler (FehlerZustand mit
    Erneut-Button). Ein Screen ohne diese drei wird nicht abgenommen.
18. Jede Aktion, die auf das Netz wartet, hat einen loading-Zustand am
    auslösenden Element und blockiert Doppelklicks.
19. Offline ist ein erwarteter Zustand, kein Fehler. Formulare speichern
    lokal und zeigen "Wird gesendet, sobald du online bist."

Ton und Inhalt
20. Einfache Sprache, Sie-Form vermeiden, konsequent Du. Kurze Sätze.
    Keine englischen Bedienelemente in der deutschen Oberfläche
    (kein "Submit", "Cancel", "Dashboard").
21. Nie "zugelassen" oder "freigeschaltet für die Prüfung". Erlaubt ist
    "Prüfungsreife erreicht" und "Empfehlung an Ausbilder".
22. Wo eine KI bewertet oder formuliert, steht sichtbar der KiHinweis.
23. Fehlermeldungen benennen, was passiert ist und was der Nutzer tun kann.
    Keine Codes, keine Stacktraces im sichtbaren Text.

Technik
24. Serverkomponenten als Standard, 'use client' so tief wie möglich.
25. Keine neuen npm-Abhängigkeiten außer clsx, tailwind-merge und einzelnen
    @radix-ui/react-* Primitives.
26. Keine Bilder ohne width/height oder fill plus sizes. next/image überall.
27. Keine Layout-Verschiebungen nach dem Laden: Skeletons haben die exakten
    Maße des späteren Inhalts, Schriften werden mit display: swap und
    passender Fallback-Metrik geladen.
28. Zahlen in Tabellen rechtsbündig mit tabular-nums.
29. Nichts in packages/ui importiert aus app/ oder aus Supabase.
    packages/ui bleibt frei von Fachlogik und Datenzugriff.

════════════════════════════════════════════════════════════
7. UMSETZUNGSREIHENFOLGE
════════════════════════════════════════════════════════════

Arbeite streng in dieser Reihenfolge. Nach jedem Schritt müssen
`pnpm typecheck` und `pnpm lint` fehlerfrei durchlaufen. Committe je Schritt
einzeln mit aussagekräftiger deutscher Commit-Nachricht.

 1. TOKENS
    app/globals.css und tailwind.config.ts exakt wie in Abschnitt 3 ersetzen,
    inklusive der vier @font-face-Blöcke. Die Schriftdateien liegen bereits
    in public/fonts/ — nichts herunterladen, nichts über next/font einbinden.
    Service-Worker-Cache für /fonts/*.woff2 ergänzen.
    Inline-Skript gegen das Theme-Aufblitzen in
    app/[locale]/layout.tsx. dir-Attribut aus dem Locale ableiten.
    Vorhandene Verwendungen der alten Klassennamen (accent, bg, surface)
    projektweit auf die neuen Token migrieren — nichts darf danach noch
    auf --accent verweisen.

 2. HILFSFUNKTIONEN
    packages/ui/src/cn.ts und die variante()-Hilfe. clsx und tailwind-merge
    installieren.

 3. PRIMITIVES
    Alle Komponenten aus 4.1 in packages/ui/src/primitive/, jeweils mit
    vollständigen Zuständen und exportiertem Props-Typ. Barrel-Export pflegen.

 4. MUSTER
    Alle Komponenten aus 4.2 in packages/ui/src/muster/.

 5. SHOWCASE
    app/[locale]/showcase zu einer vollständigen Designsystem-Seite ausbauen:
    jede Komponente, jede Variante, JEDER Zustand nebeneinander, dazu die
    Farbpalette, die Typo-Skala und die Spacing-Skala als visuelle Referenz.
    Umschalter für Hell/Dunkel und für LTR/RTL direkt auf der Seite.
    Diese Seite ist das Abnahmewerkzeug — sie muss vor den Screens fertig sein.

 6. APP-SHELL
    components/shell/: Kopfzeile, Seitennavigation, mobile Unterleiste,
    Nutzermenü, Sprachumschalter, Darstellungsumschalter, OfflineHinweis,
    "Zum Inhalt springen". Zwei Dichte-Modi (campus luftig, ausbilder kompakt)
    über eine Prop der Shell, nicht über Kopien.

 7. AUTH-SCREENS
    sprachwahl, login, passwort-aendern.

 8. TEILNEHMER-KERNFLOW (höchste Sorgfalt)
    campus/lernen → campus/topic/[id] → campus/pruefung (alle drei Phasen)
    → campus/fortschritt. Jeweils mit Lade-, Leer- und Fehlerzustand.

 9. TEILNEHMER-REST
    campus/berichtsheft, campus/profil, campus/mehr.

10. AUSBILDER
    teilnehmer, review, kohorte, berichtsheft, fragen.

11. ADMIN
    nutzer, monitoring, audit.

12. MARKETING
    impressum, datenschutz.

13. DURCHGANG
    Alle Screens bei 360px Breite prüfen, dann bei 1440px. Dann in Dunkel.
    Dann auf Arabisch. Dann nur mit Tastatur. Dann mit gedrosseltem Netz
    und offline. Gefundene Abweichungen beheben.

════════════════════════════════════════════════════════════
8. ABNAHMEKRITERIEN
════════════════════════════════════════════════════════════

Tokens und Konsistenz
[ ] Projektweite Suche nach "#" in .tsx-Dateien findet keinen Farbwert.
[ ] Suche nach "bg-blue-", "text-gray-", "border-slate-" und ähnlichen
    Tailwind-Standardfarben findet nichts.
[ ] Suche nach " ml-", " mr-", " pl-", " pr-", "left-", "right-" in .tsx
    findet nichts (logische Eigenschaften stattdessen).
[ ] Es existieren genau die in Abschnitt 3.3 definierten Schriftgrößen.
[ ] Alle Abstände sind Vielfache von 4px.

Komponenten
[ ] /showcase zeigt jede Komponente mit jeder Variante und jedem Zustand.
[ ] Jede Komponente hat default, hover, active, focus-visible und disabled.
[ ] Jede Eingabekomponente hat zusätzlich error.
[ ] Jede Sammlung hat loading, empty und error.
[ ] Kein Icon-only-Button ohne aria-label.

Barrierefreiheit
[ ] Jede Seite ist vollständig nur mit Tabulator, Pfeiltasten, Enter und
    Escape bedienbar; der Fokus ist an jeder Stelle sichtbar.
[ ] Fokus-Reihenfolge entspricht der visuellen Reihenfolge.
[ ] axe DevTools meldet auf jedem Screen null kritische und null ernste
    Verstöße, in Hell und in Dunkel.
[ ] Lighthouse Accessibility mindestens 95 auf jedem Screen.
[ ] Jeder Statuswert ist auch bei Graustufen-Darstellung eindeutig erkennbar.
[ ] Jede Seite hat genau ein h1 und lückenlose Überschriftenebenen.
[ ] Modal fängt den Fokus, Escape schließt, Fokus kehrt zurück.

Mobil und Geräte
[ ] Kein horizontales Scrollen bei 320px Breite auf irgendeinem Screen.
[ ] Alle Bedienelemente im Campus mindestens 48x48px.
[ ] Bei 200% Browser-Zoom bleibt jeder Screen bedienbar, nichts überlappt.
[ ] Lighthouse Performance mobil mindestens 85 auf lernen und topic.
[ ] Cumulative Layout Shift unter 0.1.

Mehrsprachigkeit
[ ] Alle sechs Sprachdateien haben identische Schlüsselmengen.
[ ] Arabisch rendert vollständig gespiegelt, inklusive Pfeile, Navigation
    und Fortschrittsbalken.
[ ] Kein sichtbarer Text ohne Übersetzungsschlüssel.
[ ] Der längste französische Text bricht kein Layout.

Zustände und Netz
[ ] Jeder datenladende Screen zeigt Skeletons in der Form des Inhalts.
[ ] Jeder Screen hat einen getesteten Leerzustand mit Handlungsaufforderung.
[ ] Netzwerk aus: die App bleibt bedienbar, der OfflineHinweis erscheint,
    Formulareingaben gehen nicht verloren.
[ ] Doppelklick auf Absenden erzeugt keine zwei Anfragen.

Fachliche Regeln
[ ] Nirgends stehen die Worte "zugelassen" oder "freigeschaltet" im Bezug
    auf die Prüfung.
[ ] Der KiHinweis erscheint überall dort, wo eine KI bewertet oder formuliert.
[ ] Prüfungsinhalte sind immer Deutsch, Übersetzung immer zusätzlich darunter.
[ ] Kein englisches Bedienelement in der deutschen Oberfläche.
[ ] AGENTS.md Abschnitt 2 wurde Punkt für Punkt gegengeprüft.

Wenn ein Kriterium nicht erfüllt ist, ist die Arbeit nicht fertig.
Melde am Ende jeden Punkt einzeln als erfüllt oder mit Begründung als offen.
```
