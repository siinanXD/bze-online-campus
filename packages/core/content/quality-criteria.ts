import type { ContentTyp } from './types';
import type {
  DuplikatTreffer,
  QualitaetsKriterium,
  QualitaetsKriteriumErgebnis,
  QualitaetsPruefungEingabe,
  QualitaetsStatus,
} from './quality-types';
import { wortSet } from './quality-text';

/**
 * Prueft ein einzelnes Kriterium.
 */
export function pruefeKriterium(
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
 * Prueft Aufgabenstellung, Antworten und Erklaerungen fuer Fragetypen.
 */
function pruefeFragestellung(kriterium: QualitaetsKriterium, eingabe: QualitaetsPruefungEingabe, inhalt: Record<string, unknown>): QualitaetsKriteriumErgebnis {
  if (!istFragetyp(eingabe.contentTyp)) return ergebnis(kriterium, 'bestanden', 90);
  const frage = String(inhalt.aufgabenstellung ?? inhalt.frage ?? eingabe.titel);
  if (frage.length < 24) return ergebnis(kriterium, 'problem', 40, 'Fragestellung ist zu kurz.', 'Aufgabenstellung mit konkreter Situation formulieren.');
  if (!/[?]$/.test(frage.trim()) && !/welche|nenne|erklaere|berechne|beschreibe/i.test(frage)) return ergebnis(kriterium, 'hinweis', 65, 'Fragestellung koennte uneindeutig sein.', 'Eindeutigen Arbeitsauftrag verwenden.');
  return ergebnis(kriterium, 'bestanden', 90);
}

function pruefeAntwort(kriterium: QualitaetsKriterium, eingabe: QualitaetsPruefungEingabe, inhalt: Record<string, unknown>): QualitaetsKriteriumErgebnis {
  if (!istFragetyp(eingabe.contentTyp)) return ergebnis(kriterium, 'bestanden', 90);
  const optionen = Array.isArray((inhalt as { antwortoptionen?: unknown }).antwortoptionen)
    ? (inhalt as { antwortoptionen: Array<{ ist_korrekt?: boolean }> }).antwortoptionen
    : [];
  const korrekt = optionen.filter((option) => option.ist_korrekt).length;
  if (eingabe.contentTyp === 'single_choice' && korrekt !== 1) return ergebnis(kriterium, 'problem', 35, 'Single-Choice braucht genau eine richtige Antwort.', 'Antwortoptionen pruefen.');
  if ((eingabe.contentTyp === 'multiple_choice' || eingabe.contentTyp === 'pruefungsnahe_uebungsfrage') && korrekt < 1) return ergebnis(kriterium, 'problem', 35, 'Es ist keine richtige Antwort markiert.', 'Mindestens eine richtige Antwort markieren.');
  if (eingabe.contentTyp === 'freitext' && !String(inhalt.musterloesung ?? '').trim()) return ergebnis(kriterium, 'hinweis', 60, 'Freitextfrage hat keine Musterloesung.', 'Musterloesung hinterlegen.');
  return ergebnis(kriterium, 'bestanden', 90);
}

function pruefeAntwortErklaerung(kriterium: QualitaetsKriterium, eingabe: QualitaetsPruefungEingabe, inhalt: Record<string, unknown>): QualitaetsKriteriumErgebnis {
  if (!istFragetyp(eingabe.contentTyp)) return ergebnis(kriterium, 'bestanden', 90);
  const optionen = Array.isArray((inhalt as { antwortoptionen?: unknown }).antwortoptionen)
    ? (inhalt as { antwortoptionen: Array<{ ist_korrekt?: boolean; erklaerung?: string }> }).antwortoptionen
    : [];
  const korrekteOhneErklaerung = optionen.filter((option) => option.ist_korrekt && !option.erklaerung?.trim()).length;
  if (korrekteOhneErklaerung > 0) return ergebnis(kriterium, 'problem', 45, 'Korrekte Antwort hat keine Erklaerung.', 'Erklaerung ergaenzen.');
  return ergebnis(kriterium, 'bestanden', 88);
}

/**
 * Prueft Umfang, Lernziel, Sprache, Praxisbezug und problematische Aussagen.
 */
function pruefeSchwierigkeit(kriterium: QualitaetsKriterium, eingabe: QualitaetsPruefungEingabe, text: string): QualitaetsKriteriumErgebnis {
  const woerter = text.split(/\s+/).filter(Boolean).length;
  if (eingabe.schwierigkeitsgrad === 'einfach' && woerter > 420) return ergebnis(kriterium, 'hinweis', 65, 'Einfacher Inhalt ist sehr umfangreich.', 'Kuerzer formulieren.');
  if (eingabe.schwierigkeitsgrad === 'schwer' && woerter < 45) return ergebnis(kriterium, 'hinweis', 60, 'Schwerer Inhalt ist sehr knapp.', 'Mehr Begruendung ergaenzen.');
  return ergebnis(kriterium, 'bestanden', 86);
}

function pruefeLernziel(kriterium: QualitaetsKriterium, eingabe: QualitaetsPruefungEingabe, text: string): QualitaetsKriteriumErgebnis {
  const lernziele = eingabe.lernziele ?? [];
  if (lernziele.length === 0) return ergebnis(kriterium, 'hinweis', 65, 'Kein Lernziel zugeordnet.', 'Mit mindestens einem Lernziel verknuepfen.');
  const treffer = lernziele.some((ziel) => [...wortSet(ziel)].some((wort) => text.includes(wort)));
  return treffer ? ergebnis(kriterium, 'bestanden', 85) : ergebnis(kriterium, 'hinweis', 62, 'Lernzielbezug ist nicht klar erkennbar.', 'Lernzielbegriffe sichtbar aufgreifen.');
}

function pruefeSprache(kriterium: QualitaetsKriterium, text: string): QualitaetsKriteriumErgebnis {
  const saetze = text.split(/[.!?]+/).filter((satz) => satz.trim().length > 0);
  const woerter = text.split(/\s+/).filter(Boolean).length;
  const durchschnitt = saetze.length === 0 ? woerter : woerter / saetze.length;
  if (durchschnitt > 28) return ergebnis(kriterium, 'hinweis', 65, 'Saetze wirken lang.', 'Kuerzere Saetze verwenden.');
  if (woerter < 12) return ergebnis(kriterium, 'hinweis', 62, 'Inhalt ist sehr knapp.', 'Eine kurze Erklaerung ergaenzen.');
  return ergebnis(kriterium, 'bestanden', 88);
}

function pruefePraxis(kriterium: QualitaetsKriterium, text: string): QualitaetsKriteriumErgebnis {
  const praxis = /(maschine|anlage|werkstueck|auftrag|betrieb|werkzeug|pruef|sicherheit|material|zeichnung|arbeitsplan)/i.test(text);
  return praxis ? ergebnis(kriterium, 'bestanden', 88) : ergebnis(kriterium, 'hinweis', 62, 'Praxisbezug ist schwach.', 'Praxisbeispiel ergaenzen.');
}

function pruefeMehrdeutigkeit(kriterium: QualitaetsKriterium, text: string): QualitaetsKriteriumErgebnis {
  const kritisch = /(immer|nie|alle|grundsaetzlich|normalerweise|irgendwie|passend|optimal)/i.test(text);
  return kritisch ? ergebnis(kriterium, 'hinweis', 65, 'Moegliche pauschale Formulierung.', 'Kontext genauer benennen.') : ergebnis(kriterium, 'bestanden', 88);
}

function pruefeOffiziellePruefungsfrage(kriterium: QualitaetsKriterium, text: string): QualitaetsKriteriumErgebnis {
  const behauptung = /(original(e|er)?|echte|offizielle).{0,40}(ihk|pruefungsfrage|abschlusspruefung)/i.test(text) || /(ihk).{0,40}(original|offiziell)/i.test(text);
  return behauptung ? ergebnis(kriterium, 'problem', 20, 'Inhalt behauptet moeglicherweise eine offizielle Pruefungsfrage.', 'Behauptung entfernen.') : ergebnis(kriterium, 'bestanden', 95);
}

function pruefeNormwerte(kriterium: QualitaetsKriterium, text: string): QualitaetsKriteriumErgebnis {
  const norm = /(din|iso|en)\s*\d{2,}|normwert|grenzwert|musswert|toleranz\s*(von|=)?\s*\d/i.test(text);
  const beispiel = /(beispielwert|beispiel|fachlich pruefen|tabellenbuch|herstellerangabe)/i.test(text);
  if (norm && !beispiel) return ergebnis(kriterium, 'problem', 35, 'Moegliche Norm- oder Grenzwertbehauptung ohne Quelle.', 'Quelle oder Beispielhinweis ergaenzen.');
  if (norm) return ergebnis(kriterium, 'hinweis', 70, 'Norm-/Zahlenwert sollte fachlich geprueft werden.', 'Quelle dokumentieren.');
  return ergebnis(kriterium, 'bestanden', 92);
}

function istFragetyp(contentTyp: ContentTyp): boolean {
  return ['single_choice', 'multiple_choice', 'freitext', 'pruefungsnahe_uebungsfrage'].includes(contentTyp);
}

function objektInhalt(inhalt: unknown): Record<string, unknown> {
  return typeof inhalt === 'object' && inhalt !== null ? (inhalt as Record<string, unknown>) : { text: inhalt };
}
