export {
  CONTENT_STATUS,
  CONTENT_TYPEN,
  QUELLENARTEN,
  SCHWIERIGKEITSGRADE,
  contentMetadatenSchema,
  contentStatusSchema,
  contentTypSchema,
  lernkarteSchema,
  lernzielSchema,
  quellenartSchema,
  schwierigkeitsgradSchema,
  type ContentMetadaten,
  type ContentRolle,
  type ContentStatus,
  type ContentTyp,
  type Lernkarte,
  type Lernziel,
  type Quellenart,
  type Schwierigkeitsgrad,
  type SichtbarkeitsEingabe,
} from './types';
export {
  QUALITAETS_KRITERIEN,
  einfacherHash,
  findeDuplikate,
  normalisiereContentText,
  pruefeContentQualitaet,
  qualitaetsBewertung,
  textAehnlichkeit,
  type DuplikatTreffer,
  type QualitaetsBewertung,
  type QualitaetsKriterium,
  type QualitaetsKriteriumErgebnis,
  type QualitaetsMethode,
  type QualitaetsPruefungEingabe,
  type QualitaetsPruefungErgebnis,
  type QualitaetsStatus,
} from './quality';
export {
  REGENERIERUNGS_VARIANTEN,
  erstelleVersionsSnapshot,
  regeneriereContentVariante,
  type ContentSnapshot,
  type RegeneriertesContentErgebnis,
  type RegenerierungsVariante,
} from './versioning';
export {
  WISSENS_BUCKET,
  WISSENS_CHUNK_UEBERLAPPUNG_ZEICHEN,
  WISSENS_CHUNK_ZIEL_ZEICHEN,
  WISSENS_EMBEDDING_DIMENSION,
  WISSENS_INDEX_STATUS,
  WISSENS_MAX_DATEIGROESSE_BYTES,
  WISSENSDOKUMENT_STATUS,
  WISSENSQUELLE_TYPEN,
  bereinigeDateiname,
  bereinigeWissenstext,
  erkenneWissensquelleTyp,
  erstelleWissensChunks,
  istDirektParsebarerWissensTyp,
  mockEmbeddingMetadaten,
  validiereWissensdatei,
  wissensIndexStatusSchema,
  wissensStoragePfad,
  wissensdokumentStatusSchema,
  wissensquelleTypSchema,
  type WissensChunk,
  type WissensDateiValidierung,
  type WissensIndexStatus,
  type WissensdokumentStatus,
  type WissensquelleTyp,
} from './knowledge';
export {
  CONTENT_SOURCE_MODES,
  RAG_DEFAULT_MIN_SIMILARITY,
  RAG_DEFAULT_TOP_K,
  RAG_MAX_TOP_K,
  RAG_MIN_KONTEXT_ZEICHEN,
  baueRagKontext,
  contentSourceModeSchema,
  mockRetrieveChunks,
  normalisiereRagMinSimilarity,
  normalisiereRagTopK,
  ragKontextSchema,
  ragQueryHash,
  ragSollRetrievalNutzen,
  type ContentSourceMode,
  type RagChunkReferenz,
  type RagKontext,
} from './rag';
import type { ContentStatus, SichtbarkeitsEingabe } from './types';

const ERLAUBTE_STATUSWECHSEL: Record<ContentStatus, ContentStatus[]> = {
  entwurf: ['generiert', 'in_pruefung', 'archiviert'],
  generiert: ['in_pruefung', 'abgelehnt', 'archiviert'],
  in_pruefung: ['freigegeben', 'abgelehnt', 'generiert', 'archiviert'],
  freigegeben: ['in_pruefung', 'archiviert'],
  abgelehnt: ['generiert', 'archiviert'],
  archiviert: [],
};

/**
 * Prueft, ob ein Content-Statuswechsel dem Plattform-Workflow entspricht.
 */
export function statuswechselErlaubt(von: ContentStatus, nach: ContentStatus): boolean {
  if (von === nach) return true;
  return ERLAUBTE_STATUSWECHSEL[von].includes(nach);
}

/**
 * Liefert die erlaubten Zielstatus fuer einen aktuellen Content-Status.
 */
export function erlaubteNaechsteStatus(von: ContentStatus): ContentStatus[] {
  return [...ERLAUBTE_STATUSWECHSEL[von]];
}

/**
 * Spiegelt die RLS-Sichtbarkeitsregel fuer neue Content-Tabellen in reiner Domainlogik.
 */
export function istContentSichtbar(eingabe: SichtbarkeitsEingabe): boolean {
  if (eingabe.rolle === 'admin') return true;
  if ((eingabe.rolle === 'ausbilder' || eingabe.rolle === 'verwaltung') && eingabe.gleicherTraeger) {
    return true;
  }
  if (!eingabe.gleicherTraeger) return false;
  if (eingabe.status === 'freigegeben') return true;
  return eingabe.istDemo && eingabe.demoSichtbar && eingabe.demoModusAktiv;
}

/**
 * Erkennt Demo-Content, der in der Oberflaeche einen fachlichen Warnhinweis braucht.
 */
export function brauchtDemoHinweis(input: { istDemo: boolean; fachlichVerifiziert: boolean }): boolean {
  return input.istDemo && !input.fachlichVerifiziert;
}

/**
 * Baut die verpflichtenden Hinweise fuer sichtbaren, nicht verifizierten Demo-Content.
 */
export function demoHinweise(input: { istDemo: boolean; fachlichVerifiziert: boolean }): string[] {
  if (!brauchtDemoHinweis(input)) return [];
  return ['KI-generierter Beispielinhalt', 'nicht fachlich verifiziert'];
}
