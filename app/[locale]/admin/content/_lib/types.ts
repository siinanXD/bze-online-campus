import type { ContentStatus, ContentTyp, Quellenart, Schwierigkeitsgrad } from '@bze/core/content';

export type TaxonomieOption = {
  id: string;
  bezeichnung: string;
  parent_id: string | null;
  pruefungsbereich_id: string;
};

export type FachbereichOption = {
  id: string;
  bezeichnung: string;
};

export type ContentZeile = {
  id: string;
  titel: string;
  beschreibung: string | null;
  content_typ: ContentTyp;
  pruefungsbereich_id: string | null;
  thema_id: string | null;
  unterthema_id: string | null;
  lerneinheit_id: string | null;
  frage_id: string | null;
  schwierigkeitsgrad: Schwierigkeitsgrad;
  status: ContentStatus;
  ist_demo: boolean;
  demo_sichtbar: boolean;
  demo_label: string | null;
  fachlich_verifiziert: boolean;
  quellenart: Quellenart;
  ki_anbieter: string | null;
  ki_modell: string | null;
  qualitaetswert: number | null;
  source_mode?: 'generated' | 'knowledge_base' | 'hybrid';
  rag_chunk_ids?: string[];
  rag_context_metadaten?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  fachbereich?: string;
  thema?: string;
  unterthema?: string;
  lernzielAnzahl?: number;
};

export type LernzielAnsicht = {
  id: string;
  titel: string;
  beschreibung: string | null;
};

export type LernzielOption = LernzielAnsicht & {
  pruefungsbereich_id: string | null;
  thema_id: string | null;
  unterthema_id: string | null;
  schwierigkeitsgrad: string;
};

export type ContentDetail = ContentZeile & {
  inhalt: unknown;
  lernziele: LernzielAnsicht[];
  lernkarte: {
    id: string;
    vorderseite: string;
    rueckseite: string;
    merksatz: string | null;
  } | null;
  frage: {
    id: string;
    typ: string;
    aufgabenstellung: string;
    status: string;
  } | null;
  qualitaetspruefungen: QualitaetsPruefungAnsicht[];
  versionen: ContentVersionAnsicht[];
  quellen: ContentQuelleAnsicht[];
};

export type QualitaetsKriteriumAnsicht = {
  kriterium: string;
  status: 'bestanden' | 'hinweis' | 'problem';
  score: number;
  hinweise: string[];
  verbesserungsvorschlaege: string[];
};

export type QualitaetsPruefungAnsicht = {
  id: string;
  content_element_id: string;
  gesamt_score: number;
  bewertung: 'problematisch' | 'pruefen' | 'gute_qualitaet';
  kriterien: QualitaetsKriteriumAnsicht[];
  hinweise: string[];
  verbesserungsvorschlaege: string[];
  duplikate: Array<{ contentId: string; titel: string; score: number; methode: string }>;
  text_hash: string;
  pruefmethode: 'mock_regelpruefung' | 'ki_validator';
  modell: string | null;
  ist_fachliche_freigabe: boolean;
  geprueft_am: string;
};

export type ContentVersionAnsicht = {
  id: string;
  content_element_id: string;
  version_nr: number;
  titel: string;
  beschreibung: string | null;
  inhalt: unknown;
  schwierigkeitsgrad: Schwierigkeitsgrad;
  status: ContentStatus;
  qualitaetswert: number | null;
  aenderungsart: string;
  begruendung: string | null;
  created_at: string;
};

export type ContentQuelleAnsicht = {
  quelle_id: string;
  titel: string;
  quellenart: string;
  quelldokument_id: string | null;
  fundstelle: Record<string, unknown>;
  chunks: Array<{
    id: string;
    chunk_index: number;
    inhalt: string;
    similarity: number | null;
    dokument_titel: string | null;
  }>;
};

export type DashboardKennzahlen = {
  fachbereiche: number;
  themen: number;
  unterthemen: number;
  lernziele: number;
  erklaerungen: number;
  fragen: number;
  lernkarten: number;
  praxisfaelle: number;
  rechenaufgaben: number;
  quizze: number;
  demoInhalte: number;
  entwuerfe: number;
  freigegeben: number;
  kiGeneriert: number;
  manuell: number;
};

export type PaginierteContentListe = {
  eintraege: ContentZeile[];
  gesamt: number;
  seite: number;
  proSeite: number;
  seiten: number;
};

export type QualitaetsZeile = ContentZeile & {
  letztePruefung: QualitaetsPruefungAnsicht | null;
};

export type PaginierteQualitaetsListe = {
  eintraege: QualitaetsZeile[];
  gesamt: number;
  seite: number;
  proSeite: number;
  seiten: number;
};
