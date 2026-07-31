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
