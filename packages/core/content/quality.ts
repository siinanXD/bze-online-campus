import type { ContentTyp, Schwierigkeitsgrad } from './types';

export const QUALITAETS_KRITERIEN = [
  'fachliche_plausibilitaet',
  'eindeutige_fragestellung',
  'eindeutige_antwort',
  'erklaerung_passt_zur_antwort',
  'schwierigkeit_passt',
  'lernziel_wird_erfuellt',
  'sprachliche_verstaendlichkeit',
  'praxisbezug',
  'mehrdeutigkeit',
  'duplikate',
  'offizielle_pruefungsfrage',
  'normwerte',
] as const;

export type QualitaetsKriterium = (typeof QUALITAETS_KRITERIEN)[number];
export type QualitaetsStatus = 'bestanden' | 'hinweis' | 'problem';
export type QualitaetsBewertung = 'problematisch' | 'pruefen' | 'gute_qualitaet';
export type QualitaetsMethode = 'mock_regelpruefung' | 'ki_validator';

export type QualitaetsKriteriumErgebnis = {
  kriterium: QualitaetsKriterium;
  status: QualitaetsStatus;
  score: number;
  hinweise: string[];
  verbesserungsvorschlaege: string[];
};

export type DuplikatTreffer = {
  contentId: string;
  titel: string;
  score: number;
  methode: 'hash' | 'textaehnlichkeit';
};

export type QualitaetsPruefungEingabe = {
  id?: string;
  titel: string;
  beschreibung?: string | null;
  contentTyp: ContentTyp;
  schwierigkeitsgrad: Schwierigkeitsgrad;
  inhalt: unknown;
  lernziele?: string[];
  bestehendeInhalte?: Array<{
    id: string;
    titel: string;
    beschreibung?: string | null;
    inhalt: unknown;
  }>;
  pruefmethode?: QualitaetsMethode;
  modell?: string | null;
  geprueftAm?: string;
};

export type QualitaetsPruefungErgebnis = {
  gesamtScore: number;
  bewertung: QualitaetsBewertung;
  kriterien: QualitaetsKriteriumErgebnis[];
  hinweise: string[];
  verbesserungsvorschlaege: string[];
  duplikate: DuplikatTreffer[];
  textHash: string;
  geprueftAm: string;
  pruefmethode: QualitaetsMethode;
  modell: string | null;
  istFachlicheFreigabe: false;
};

/**
 * Bewertet einen Score nach den Plattform-Schwellen.
 */
export function qualitaetsBewertung(score: number): QualitaetsBewertung {
  if (score < 60) return 'problematisch';
  if (score < 80) return 'pruefen';
  return 'gute_qualitaet';
}

/**
 * Fuehrt eine deterministische informative Qualitaetspruefung aus.
 */
export function pruefeContentQualitaet(eingabe: QualitaetsPruefungEingabe): QualitaetsPruefungErgebnis {
  const text = normalisiereContentText(eingabe);
  const duplikate = findeDuplikate(eingabe, eingabe.bestehendeInhalte ?? []);
  const kriterien = QUALITAETS_KRITERIEN.map((kriterium) => pruefeKriterium(kriterium, eingabe, text, duplikate));
  const problemAbzug = kriterien.filter((kriterium) => kriterium.status === 'problem').length * 8;
  const rohScore = Math.round(kriterien.reduce((summe, kriterium) => summe + kriterium.score, 0) / kriterien.length) - problemAbzug;
  const gesamtScore = Math.max(0, Math.min(100, rohScore));
  const hinweise = eindeutige(kriterien.flatMap((kriterium) => kriterium.hinweise));
  const verbesserungsvorschlaege = eindeutige(kriterien.flatMap((kriterium) => kriterium.verbesserungsvorschlaege));
  return {
    gesamtScore,
    bewertung: qualitaetsBewertung(gesamtScore),
    kriterien,
    hinweise,
    verbesserungsvorschlaege,
    duplikate,
    textHash: einfacherHash(text),
    geprueftAm: eingabe.geprueftAm ?? new Date().toISOString(),
    pruefmethode: eingabe.pruefmethode ?? 'mock_regelpruefung',
    modell: eingabe.modell ?? null,
    istFachlicheFreigabe: false,
  };
}

/**
 * Findet Duplikate ueber Hash und einfache Textaehnlichkeit.
 */
export function findeDuplikate(
  eingabe: Omit<QualitaetsPruefungEingabe, 'bestehendeInhalte'>,
  bestehendeInhalte: Array<{ id: string; titel: string; beschreibung?: string | null; inhalt: unknown }>,
): DuplikatTreffer[] {
  const text = normalisiereContentText(eingabe);
  const hash = einfacherHash(text);
  return bestehendeInhalte
    .filter((bestand) => bestand.id !== eingabe.id)
    .map((bestand) => {
      const bestandText = normalisiereContentText({
        titel: bestand.titel,
        beschreibung: bestand.beschreibung,
        contentTyp: eingabe.contentTyp,
        schwierigkeitsgrad: eingabe.schwierigkeitsgrad,
        inhalt: bestand.inhalt,
      });
      const bestandHash = einfacherHash(bestandText);
      if (bestandHash === hash) {
        return { contentId: bestand.id, titel: bestand.titel, score: 1, methode: 'hash' as const };
      }
      const score = textAehnlichkeit(text, bestandText);
      if (score >= 0.68) {
        return { contentId: bestand.id, titel: bestand.titel, score, methode: 'textaehnlichkeit' as const };
      }
      return null;
    })
    .filter((treffer): treffer is DuplikatTreffer => treffer !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

/**
 * Normalisiert Content zu einem vergleichbaren Text.
 */
export function normalisiereContentText(eingabe: {
  titel: string;
  beschreibung?: string | null;
  inhalt: unknown;
  contentTyp?: ContentTyp;
  schwierigkeitsgrad?: Schwierigkeitsgrad;
}): string {
  return [eingabe.titel, eingabe.beschreibung ?? '', textAusUnbekannt(eingabe.inhalt)]
    .join(' ')
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9äöüß\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Erstellt einen stabilen nicht-kryptografischen Hash fuer Duplikatpruefung.
 */
export function einfacherHash(text: string): string {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

/**
 * Berechnet eine einfache Jaccard-Aehnlichkeit auf Wortmengen.
 */
export function textAehnlichkeit(a: string, b: string): number {
  const aSet = wortSet(a);
  const bSet = wortSet(b);
  if (aSet.size === 0 || bSet.size === 0) return 0;
  let schnitt = 0;
  for (const wort of aSet) {
    if (bSet.has(wort)) schnitt += 1;
  }
  const vereinigung = new Set([...aSet, ...bSet]).size;
  const jaccard = vereinigung === 0 ? 0 : schnitt / vereinigung;
  const containment = schnitt / Math.min(aSet.size, bSet.size);
  return Math.max(jaccard, containment);
}

/**
 * Prueft ein einzelnes Kriterium.
 */
function pruefeKriterium(
  kriterium: QualitaetsKriterium,
  eingabe: QualitaetsPruefungEingabe,
  text: string,
  duplikate: DuplikatTreffer[],
): QualitaetsKriteriumErgebnis {
  const inhalt = objektInhalt(eingabe.inhalt);
  switch (kriterium) {
    case 'fachliche_plausibilitaet':
      return ergebnis(kriterium, text.length >= 160 ? 'bestanden' : 'hinweis', text.length >= 160 ? 85 : 65, 'Inhalt ist sehr knapp.', 'Fachliche Kernaussage mit Praxisbezug konkretisieren.');
    case 'eindeutige_fragestellung':
      return pruefeFragestellung(kriterium, eingabe, inhalt);
    case 'eindeutige_antwort':
      return pruefeAntwort(kriterium, eingabe, inhalt);
    case 'erklaerung_passt_zur_antwort':
      return pruefeAntwortErklaerung(kriterium, eingabe, inhalt);
    case 'schwierigkeit_passt':
      return pruefeSchwierigkeit(kriterium, eingabe, text);
    case 'lernziel_wird_erfuellt':
      return pruefeLernziel(kriterium, eingabe, text);
    case 'sprachliche_verstaendlichkeit':
      return pruefeSprache(kriterium, text);
    case 'praxisbezug':
      return pruefePraxis(kriterium, text);
    case 'mehrdeutigkeit':
      return pruefeMehrdeutigkeit(kriterium, text);
    case 'duplikate':
      return duplikate.length === 0
        ? ergebnis(kriterium, 'bestanden', 90)
        : ergebnis(kriterium, 'problem', 35, 'Moegliches Duplikat gefunden.', 'Formulierung, Beispiel und Schwerpunkt deutlich abgrenzen.');
    case 'offizielle_pruefungsfrage':
      return pruefeOffiziellePruefungsfrage(kriterium, text);
    case 'normwerte':
      return pruefeNormwerte(kriterium, text);
  }
}

/**
 * Prueft Aufgabenstellung fuer Fragetypen.
 */
function pruefeFragestellung(kriterium: QualitaetsKriterium, eingabe: QualitaetsPruefungEingabe, inhalt: Record<string, unknown>): QualitaetsKriteriumErgebnis {
  if (!istFragetyp(eingabe.contentTyp)) return ergebnis(kriterium, 'bestanden', 90);
  const frage = String(inhalt.aufgabenstellung ?? inhalt.frage ?? eingabe.titel);
  if (frage.length < 24) return ergebnis(kriterium, 'problem', 40, 'Fragestellung ist zu kurz.', 'Aufgabenstellung mit konkreter Situation formulieren.');
  if (!/[?]$/.test(frage.trim()) && !/welche|nenne|erklaere|berechne|beschreibe/i.test(frage)) {
    return ergebnis(kriterium, 'hinweis', 65, 'Fragestellung koennte uneindeutig sein.', 'Eindeutigen Arbeitsauftrag verwenden.');
  }
  return ergebnis(kriterium, 'bestanden', 90);
}

/**
 * Prueft Antwortstruktur fuer Fragetypen.
 */
function pruefeAntwort(kriterium: QualitaetsKriterium, eingabe: QualitaetsPruefungEingabe, inhalt: Record<string, unknown>): QualitaetsKriteriumErgebnis {
  if (!istFragetyp(eingabe.contentTyp)) return ergebnis(kriterium, 'bestanden', 90);
  const optionen = Array.isArray((inhalt as { antwortoptionen?: unknown }).antwortoptionen)
    ? ((inhalt as { antwortoptionen: Array<{ ist_korrekt?: boolean }> }).antwortoptionen)
    : [];
  const korrekt = optionen.filter((option) => option.ist_korrekt).length;
  if (eingabe.contentTyp === 'single_choice' && korrekt !== 1) {
    return ergebnis(kriterium, 'problem', 35, 'Single-Choice braucht genau eine richtige Antwort.', 'Antwortoptionen pruefen und genau eine korrekte Antwort markieren.');
  }
  if ((eingabe.contentTyp === 'multiple_choice' || eingabe.contentTyp === 'pruefungsnahe_uebungsfrage') && korrekt < 1) {
    return ergebnis(kriterium, 'problem', 35, 'Es ist keine richtige Antwort markiert.', 'Mindestens eine richtige Antwort markieren.');
  }
  if (eingabe.contentTyp === 'freitext' && !String(inhalt.musterloesung ?? '').trim()) {
    return ergebnis(kriterium, 'hinweis', 60, 'Freitextfrage hat keine Musterloesung.', 'Musterloesung und Bewertungskriterien hinterlegen.');
  }
  return ergebnis(kriterium, 'bestanden', 90);
}

/**
 * Prueft, ob Antwortoptionen Erklaerungen enthalten.
 */
function pruefeAntwortErklaerung(kriterium: QualitaetsKriterium, eingabe: QualitaetsPruefungEingabe, inhalt: Record<string, unknown>): QualitaetsKriteriumErgebnis {
  if (!istFragetyp(eingabe.contentTyp)) return ergebnis(kriterium, 'bestanden', 90);
  const optionen = Array.isArray((inhalt as { antwortoptionen?: unknown }).antwortoptionen)
    ? ((inhalt as { antwortoptionen: Array<{ ist_korrekt?: boolean; erklaerung?: string }> }).antwortoptionen)
    : [];
  const korrekteOhneErklaerung = optionen.filter((option) => option.ist_korrekt && !option.erklaerung?.trim()).length;
  if (korrekteOhneErklaerung > 0) return ergebnis(kriterium, 'problem', 45, 'Korrekte Antwort hat keine Erklaerung.', 'Erklaerung der richtigen Antwort ergaenzen.');
  return ergebnis(kriterium, 'bestanden', 88);
}

/**
 * Prueft grob, ob Umfang und Schwierigkeit zusammenpassen.
 */
function pruefeSchwierigkeit(kriterium: QualitaetsKriterium, eingabe: QualitaetsPruefungEingabe, text: string): QualitaetsKriteriumErgebnis {
  const woerter = text.split(/\s+/).filter(Boolean).length;
  if (eingabe.schwierigkeitsgrad === 'einfach' && woerter > 420) return ergebnis(kriterium, 'hinweis', 65, 'Einfacher Inhalt ist sehr umfangreich.', 'Kuerzer und mit weniger Fachbegriffen formulieren.');
  if (eingabe.schwierigkeitsgrad === 'schwer' && woerter < 45) return ergebnis(kriterium, 'hinweis', 60, 'Schwerer Inhalt ist sehr knapp.', 'Mehr Begruendung, Varianten oder Fehlerursachen ergaenzen.');
  return ergebnis(kriterium, 'bestanden', 86);
}

/**
 * Prueft einfache Lernzieldeckung.
 */
function pruefeLernziel(kriterium: QualitaetsKriterium, eingabe: QualitaetsPruefungEingabe, text: string): QualitaetsKriteriumErgebnis {
  const lernziele = eingabe.lernziele ?? [];
  if (lernziele.length === 0) return ergebnis(kriterium, 'hinweis', 65, 'Kein Lernziel zugeordnet.', 'Inhalt mit mindestens einem Lernziel verknuepfen.');
  const treffer = lernziele.some((ziel) => wortSet(ziel).size > 0 && [...wortSet(ziel)].some((wort) => text.includes(wort)));
  return treffer
    ? ergebnis(kriterium, 'bestanden', 85)
    : ergebnis(kriterium, 'hinweis', 62, 'Lernzielbezug ist nicht klar erkennbar.', 'Begriffe aus dem Lernziel im Inhalt sichtbar aufgreifen.');
}

/**
 * Prueft sprachliche Verstaendlichkeit ueber einfache Heuristiken.
 */
function pruefeSprache(kriterium: QualitaetsKriterium, text: string): QualitaetsKriteriumErgebnis {
  const saetze = text.split(/[.!?]+/).filter((satz) => satz.trim().length > 0);
  const woerter = text.split(/\s+/).filter(Boolean).length;
  const durchschnitt = saetze.length === 0 ? woerter : woerter / saetze.length;
  if (durchschnitt > 28) return ergebnis(kriterium, 'hinweis', 65, 'Saetze wirken lang.', 'Kuerzere Saetze und klare Arbeitsbegriffe verwenden.');
  if (woerter < 12) return ergebnis(kriterium, 'hinweis', 62, 'Inhalt ist sehr knapp.', 'Eine kurze Erklaerung oder ein Beispiel ergaenzen.');
  return ergebnis(kriterium, 'bestanden', 88);
}

/**
 * Prueft Praxisbezug fuer MAF-Kontext.
 */
function pruefePraxis(kriterium: QualitaetsKriterium, text: string): QualitaetsKriteriumErgebnis {
  const praxis = /(maschine|anlage|werkstueck|werkstück|auftrag|betrieb|werkzeug|pruef|prüf|sicherheit|material|zeichnung|arbeitsplan)/i.test(text);
  return praxis
    ? ergebnis(kriterium, 'bestanden', 88)
    : ergebnis(kriterium, 'hinweis', 62, 'Praxisbezug ist schwach.', 'Beispiel aus Maschine, Anlage, Werkstoff oder Pruefung ergaenzen.');
}

/**
 * Prueft typische Mehrdeutigkeitsmarker.
 */
function pruefeMehrdeutigkeit(kriterium: QualitaetsKriterium, text: string): QualitaetsKriteriumErgebnis {
  const kritisch = /(immer|nie|alle|grundsaetzlich|grundsätzlich|normalerweise|irgendwie|passend|optimal)/i.test(text);
  return kritisch
    ? ergebnis(kriterium, 'hinweis', 65, 'Moegliche pauschale oder mehrdeutige Formulierung.', 'Bedingungen, Beispielwerte oder Kontext genauer benennen.')
    : ergebnis(kriterium, 'bestanden', 88);
}

/**
 * Erkennt unzulaessige offizielle Pruefungsbehauptungen.
 */
function pruefeOffiziellePruefungsfrage(kriterium: QualitaetsKriterium, text: string): QualitaetsKriteriumErgebnis {
  const behauptung = /(original(e|er)?|echte|offizielle).{0,40}(ihk|pruefungsfrage|prüfungsfrage|abschlusspruefung|abschlussprüfung)/i.test(text)
    || /(ihk).{0,40}(original|offiziell)/i.test(text);
  return behauptung
    ? ergebnis(kriterium, 'problem', 20, 'Inhalt behauptet moeglicherweise eine offizielle Pruefungsfrage.', 'Als frei erzeugte Uebungsfrage kennzeichnen und Behauptung entfernen.')
    : ergebnis(kriterium, 'bestanden', 95);
}

/**
 * Erkennt problematische Norm- oder Grenzwertbehauptungen.
 */
function pruefeNormwerte(kriterium: QualitaetsKriterium, text: string): QualitaetsKriteriumErgebnis {
  const norm = /(din|iso|en)\s*\d{2,}|normwert|grenzwert|musswert|toleranz\s*(von|=)?\s*\d/i.test(text);
  const beispiel = /(beispielwert|beispiel|fachlich pruefen|tabellenbuch|herstellerangabe)/i.test(text);
  if (norm && !beispiel) return ergebnis(kriterium, 'problem', 35, 'Moegliche Norm- oder Grenzwertbehauptung ohne Quelle.', 'Normwerte entfernen oder mit Quelle und Beispielhinweis kennzeichnen.');
  if (norm) return ergebnis(kriterium, 'hinweis', 70, 'Norm-/Zahlenwert sollte fachlich geprueft werden.', 'Quelle und Gueltigkeitsbereich dokumentieren.');
  return ergebnis(kriterium, 'bestanden', 92);
}

/**
 * Baut ein standardisiertes Kriteriumsergebnis.
 */
function ergebnis(
  kriterium: QualitaetsKriterium,
  status: QualitaetsStatus,
  score: number,
  hinweis?: string,
  vorschlag?: string,
): QualitaetsKriteriumErgebnis {
  return {
    kriterium,
    status,
    score,
    hinweise: hinweis ? [hinweis] : [],
    verbesserungsvorschlaege: vorschlag ? [vorschlag] : [],
  };
}

/**
 * Erkennt bestehende Frage-Content-Typen.
 */
function istFragetyp(contentTyp: ContentTyp): boolean {
  return ['single_choice', 'multiple_choice', 'freitext', 'pruefungsnahe_uebungsfrage'].includes(contentTyp);
}

/**
 * Liefert Objekte als Record und kapselt unbekannte Inhalte.
 */
function objektInhalt(inhalt: unknown): Record<string, unknown> {
  return typeof inhalt === 'object' && inhalt !== null ? inhalt as Record<string, unknown> : { text: inhalt };
}

/**
 * Extrahiert Text rekursiv aus unbekannten Strukturen.
 */
function textAusUnbekannt(wert: unknown): string {
  if (wert == null) return '';
  if (typeof wert === 'string' || typeof wert === 'number' || typeof wert === 'boolean') return String(wert);
  if (Array.isArray(wert)) return wert.map(textAusUnbekannt).join(' ');
  if (typeof wert === 'object') return Object.values(wert as Record<string, unknown>).map(textAusUnbekannt).join(' ');
  return '';
}

/**
 * Erstellt eine Wortmenge ohne sehr kurze Fuellwoerter.
 */
function wortSet(text: string): Set<string> {
  return new Set(text.toLowerCase().split(/\s+/).filter((wort) => wort.length >= 4));
}

/**
 * Entfernt doppelte Texte in stabiler Reihenfolge.
 */
function eindeutige(werte: string[]): string[] {
  return [...new Set(werte)];
}
