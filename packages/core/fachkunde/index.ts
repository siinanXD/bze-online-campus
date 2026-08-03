export {
  FACHKUNDE_KAPITEL,
  FACHKUNDE_PRUEFUNGSRELEVANZ,
  FACHKUNDE_QUELLENARTEN,
  FACHKUNDE_REVIEW_STATUS,
  FACHKUNDE_SCHWIERIGKEITEN,
  FACHKUNDE_WISSENSSTUFEN,
  fachkundeFormelSchema,
  fachkundeFreigabeInventarZeileSchema,
  fachkundeGlossarBegriffSchema,
  fachkundeInteractionReferenceSchema,
  fachkundeKapitelSchema,
  fachkundeMatrixEinheitSchema,
  fachkundeMiniWissenscheckFrageSchema,
  fachkundeMiniWissenscheckOptionSchema,
  fachkundeMiniWissenscheckSchema,
  fachkundeLernereignisSchema,
  fachkundePruefungsrelevanzSchema,
  fachkundeQuellenartSchema,
  fachkundeReviewStatusSchema,
  fachkundeSchwierigkeitSchema,
  fachkundeSourceReferenceSchema,
  fachkundeVisualReferenceSchema,
  fachkundeWissensstufeSchema,
  type FachkundeFormel,
  type FachkundeFreigabeInventarZeile,
  type FachkundeGlossarBegriff,
  type FachkundeInteractionReference,
  type FachkundeKapitel,
  type FachkundeMatrixEinheit,
  type FachkundeMiniWissenscheck,
  type FachkundeMiniWissenscheckFrage,
  type FachkundeMiniWissenscheckOption,
  type FachkundeLernereignis,
  type FachkundePruefungsrelevanz,
  type FachkundeQuellenart,
  type FachkundeReviewStatus,
  type FachkundeSchwierigkeit,
  type FachkundeSourceReference,
  type FachkundeVisualReference,
  type FachkundeWissensstufe,
} from './types';
export {
  aggregiereFreigabeInventar,
  baueFreigabeInventarZeile,
  extrahiereMdxFrontmatter,
  istFormelImportfaehig,
  istGlossarbegriffImportfaehig,
} from './inventar';
import type {
  FachkundeMatrixEinheit,
  FachkundeMiniWissenscheck,
  FachkundeReviewStatus,
  FachkundeSourceReference,
} from './types';

const FREIGABE_REIHENFOLGE: Record<FachkundeReviewStatus, number> = {
  entwurf: 0,
  fachlich_geprueft: 1,
  freigegeben: 2,
};

/**
 * Prueft, ob eine geplante Fachkunde-Einheit technisch alle Pflichtbausteine enthaelt.
 */
export function istFachkundeEinheitVollstaendig(einheit: FachkundeMatrixEinheit): boolean {
  return (
    einheit.lernziele.length > 0 &&
    einheit.visuals.length > 0 &&
    einheit.interaktionen.length > 0 &&
    einheit.quellen.length > 0 &&
    einheit.geschaetzteLesedauerMinuten >= 7 &&
    einheit.geschaetzteLesedauerMinuten <= 10
  );
}

/**
 * Bewertet, ob Quellen konkrete technische Zahlenwerte tragen duerfen.
 */
export function hatBelastbareZahlenquelle(quellen: FachkundeSourceReference[]): boolean {
  return quellen.some((quelle) => quelle.belastbarFuerZahlenwerte);
}

/**
 * Liefert die Freigabefaehigkeit einer Einheit ohne Datenbankzugriff.
 */
export function istFachkundeEinheitFreigabefaehig(einheit: FachkundeMatrixEinheit): boolean {
  if (!istFachkundeEinheitVollstaendig(einheit)) return false;
  if (einheit.fachlicheFreigabe.erforderlich && einheit.status !== 'freigegeben') return false;
  return true;
}

/**
 * Prueft, ob ein Fachkunde-Reviewstatus monoton vorwaerts gewechselt wird.
 */
export function istFachkundeStatuswechselErlaubt(von: FachkundeReviewStatus, nach: FachkundeReviewStatus): boolean {
  if (von === nach) return true;
  if (von === 'freigegeben' && nach !== 'freigegeben') return false;
  return FREIGABE_REIHENFOLGE[nach] >= FREIGABE_REIHENFOLGE[von];
}

/**
 * Prueft, ob ein Mini-Wissenscheck ohne Umbau in MC-Fragen/Mastery ueberfuehrbar ist.
 */
export function istMiniWissenscheckMasteryFaehig(check: FachkundeMiniWissenscheck): boolean {
  const schluessel = new Set<string>();
  for (const frage of check.fragen) {
    if (schluessel.has(frage.masterySchluessel)) return false;
    schluessel.add(frage.masterySchluessel);
    if (frage.optionen.filter((option) => option.istKorrekt).length !== 1) return false;
  }
  return true;
}
