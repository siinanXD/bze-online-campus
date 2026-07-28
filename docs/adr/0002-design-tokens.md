# 0002 — Design-Tokens & i18n-Fundament (AP-02)

**Kontext:** Zielgruppe sind Erwachsene in beruflicher Umbruchsituation, oft ältere Android-Geräte, Werkhallen. Spec §7 verlangt ein ruhiges, sachliches, kontrastreiches Design ohne verspielte Gamification, mit Grün/Rot ausschließlich für Lernstatus und Farbe nie als alleinigem Informationsträger.

**Entscheidung:** CSS-Variablen (HSL) als Tokens in `app/globals.css`, gemappt in `tailwind.config.ts`. Eine Akzentfarbe (Indigo) für Primäraktionen; Statusfarben getrennt (`status.neu/teil/falsch/fertig`). `StatusBadge` kombiniert IMMER Farbe + Symbol (○ ◐ ✕ ✓) + Textlabel + optionalen Fehlerzähler. Sichtbarer Fokus, 48px-Berührungsziele als `touchable`. i18n über next-intl; RTL für Arabisch über `dir` im Root-Layout und logische CSS-Eigenschaften (`ms-*`).

**Konsequenzen:** Alle Folgepakete konsumieren `@bze/ui` und Tokens; keine eigenen Farben/Tokens je Zweig (Voraussetzung für parallele Worktrees in Welle 1). Dark Mode über `.dark`-Klasse vorbereitet.

**Alternativen:** shadcn/ui vollständig generieren (später inkrementell ergänzbar); hier bewusst schlanke, abhängigkeitsarme Basis, um Welle 1 nicht zu blockieren.
