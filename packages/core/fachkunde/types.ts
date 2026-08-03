import { z } from 'zod';

export const FACHKUNDE_KAPITEL = [
  'welt_der_maschinen',
  'material_wird_produkt',
  'qualitaet_maschinen_beherrschen',
  'pruefungsprofi',
] as const;

export const FACHKUNDE_WISSENSSTUFEN = [
  'auswendig_wissen',
  'verstehen',
  'anwenden',
  'tabellenbuch_finden',
  'zusatzwissen',
] as const;

export const FACHKUNDE_SCHWIERIGKEITEN = ['grundlagen', 'mittel', 'schwer', 'sehr_schwer'] as const;

export const FACHKUNDE_PRUEFUNGSRELEVANZ = ['niedrig', 'mittel', 'hoch', 'sehr_hoch'] as const;

export const FACHKUNDE_REVIEW_STATUS = ['entwurf', 'fachlich_geprueft', 'freigegeben'] as const;

export const FACHKUNDE_QUELLENARTEN = [
  'tabellenbuch',
  'rahmenlehrplan',
  'ausbildungsordnung',
  'traegerskript',
  'herstellerdatenblatt',
  'betriebsanweisung',
  'technische_zeichnung',
  'fachbuch',
  'web',
  'offen',
] as const;

export const fachkundeKapitelSchema = z.enum(FACHKUNDE_KAPITEL);
export const fachkundeWissensstufeSchema = z.enum(FACHKUNDE_WISSENSSTUFEN);
export const fachkundeSchwierigkeitSchema = z.enum(FACHKUNDE_SCHWIERIGKEITEN);
export const fachkundePruefungsrelevanzSchema = z.enum(FACHKUNDE_PRUEFUNGSRELEVANZ);
export const fachkundeReviewStatusSchema = z.enum(FACHKUNDE_REVIEW_STATUS);
export const fachkundeQuellenartSchema = z.enum(FACHKUNDE_QUELLENARTEN);

export const fachkundeSourceReferenceSchema = z.object({
  quellenart: fachkundeQuellenartSchema,
  beschreibung: z.string().trim().min(1).max(500),
  fundstelle: z.string().trim().max(500).nullable().optional(),
  belastbarFuerZahlenwerte: z.boolean().default(false),
});

export const fachkundeVisualReferenceSchema = z.object({
  typ: z.enum([
    'technische_illustration',
    'funktionsdiagramm',
    'prozessablauf',
    'fehlervergleich',
    'formeldiagramm',
    'messsituation',
    'interaktive_grafik',
    'icon_set',
  ]),
  beschreibung: z.string().trim().min(1).max(500),
  figmaArtefakt: z.string().trim().max(160).nullable().optional(),
});

export const fachkundeInteractionReferenceSchema = z.object({
  typ: z.enum([
    'begriffschips',
    'mini_quiz',
    'formeltrainer',
    'messsimulation',
    'toleranzfeld',
    'prozessschritte',
    'fehlerdiagnose',
    'hotspots',
  ]),
  beschreibung: z.string().trim().min(1).max(500),
});

export const fachkundeMiniWissenscheckOptionSchema = z.object({
  id: z.string().trim().regex(/^[a-z0-9-]+$/),
  text: z.string().trim().min(1).max(500),
  istKorrekt: z.boolean(),
  erklaerung: z.string().trim().min(1).max(700),
});

export const fachkundeMiniWissenscheckFrageSchema = z.object({
  id: z.string().trim().regex(/^[a-z0-9-]+$/),
  aufgabenstellung: z.string().trim().min(12).max(700),
  masterySchluessel: z.string().trim().regex(/^FK-[1-4]-[A-Z0-9]{2,6}-\d{3}::[a-z0-9-]+$/),
  optionen: z
    .array(fachkundeMiniWissenscheckOptionSchema)
    .min(2)
    .max(5)
    .refine((optionen) => optionen.filter((option) => option.istKorrekt).length === 1, {
      message: 'Mini-Wissenscheck-Fragen brauchen genau eine richtige Option.',
    }),
  tabellenbuchHinweis: z.string().trim().max(700).nullable().optional(),
});

export const fachkundeMiniWissenscheckSchema = z.object({
  id: z.string().trim().regex(/^FK-[1-4]-[A-Z0-9]{2,6}-\d{3}::check$/),
  fragen: z.array(fachkundeMiniWissenscheckFrageSchema).min(1).max(10),
});

export const fachkundeMatrixEinheitSchema = z.object({
  id: z.string().trim().regex(/^FK-[1-4]-[A-Z0-9]{2,6}-\d{3}$/),
  kapitel: fachkundeKapitelSchema,
  themenbereich: z.string().trim().min(1).max(160),
  titel: z.string().trim().min(1).max(240),
  kurzbeschreibung: z.string().trim().min(1).max(700),
  voraussetzungen: z.array(z.string().trim().min(1)).default([]),
  lernziele: z.array(z.string().trim().min(1)).min(1).max(5),
  fachbegriffe: z.array(z.string().trim().min(1)).default([]),
  formeln: z.array(z.string().trim().min(1)).default([]),
  visuals: z.array(fachkundeVisualReferenceSchema).min(1),
  interaktionen: z.array(fachkundeInteractionReferenceSchema).min(1),
  geschaetzteLesedauerMinuten: z.number().int().min(5).max(15),
  schwierigkeitsgrad: fachkundeSchwierigkeitSchema,
  pruefungsrelevanz: fachkundePruefungsrelevanzSchema,
  wissensstufen: z.array(fachkundeWissensstufeSchema).min(1),
  quellen: z.array(fachkundeSourceReferenceSchema).min(1),
  status: fachkundeReviewStatusSchema,
  fachlicheFreigabe: z.object({
    erforderlich: z.boolean(),
    freigegebenVon: z.string().trim().max(160).nullable().optional(),
    freigegebenAm: z.string().datetime({ offset: true }).nullable().optional(),
  }),
});

/** Zentrale Glossar-Registry (Domain-Schema; DB-Migration spaeter additiv). */
export const fachkundeGlossarBegriffSchema = z.object({
  id: z.string().trim().regex(/^[a-z0-9-]{2,80}$/),
  begriff: z.string().trim().min(1).max(160),
  einfacheErklaerung: z.string().trim().min(1).max(700),
  fachdefinition: z.string().trim().min(1).max(900),
  beispiel: z.string().trim().max(700).nullable().optional(),
  synonyme: z.array(z.string().trim().min(1)).default([]),
  abkuerzungen: z.array(z.string().trim().min(1)).default([]),
  verwandteBegriffe: z.array(z.string().trim().min(1)).default([]),
  kapitel: fachkundeKapitelSchema.nullable().optional(),
  themenbereich: z.string().trim().max(160).nullable().optional(),
  lerneinheitIds: z.array(z.string().trim().regex(/^FK-[1-4]-[A-Z0-9]{2,6}-\d{3}$/)).default([]),
  pruefungsrelevanz: fachkundePruefungsrelevanzSchema.default('mittel'),
  wissensstufe: fachkundeWissensstufeSchema.default('verstehen'),
  quellenstatus: z.enum(['offen', 'geprueft', 'freigegeben']).default('offen'),
  reviewStatus: fachkundeReviewStatusSchema.default('entwurf'),
});

/** Interaktive Formelsammlung (Domain-Schema; Speicherung spaeter additiv). */
export const fachkundeFormelSchema = z.object({
  id: z.string().trim().regex(/^[a-z0-9-]{2,80}$/),
  bezeichnung: z.string().trim().min(1).max(240),
  formel: z.string().trim().min(1).max(240),
  formelzeichen: z
    .array(
      z.object({
        zeichen: z.string().trim().min(1).max(40),
        bedeutung: z.string().trim().min(1).max(240),
        einheit: z.string().trim().max(40).nullable().optional(),
      }),
    )
    .min(1)
    .max(12),
  umstellungen: z.array(z.string().trim().min(1).max(240)).default([]),
  einfacheErklaerung: z.string().trim().min(1).max(700),
  fachlicheErklaerung: z.string().trim().min(1).max(900),
  beispielrechnung: z.string().trim().max(900).nullable().optional(),
  typischeFehler: z.array(z.string().trim().min(1).max(240)).default([]),
  vorwissen: z.array(z.string().trim().min(1)).default([]),
  verwandteFormeln: z.array(z.string().trim().min(1)).default([]),
  tabellenbuchHinweis: z.string().trim().max(500).nullable().optional(),
  auswendigLernen: z.boolean().default(false),
  pruefungsrelevanz: fachkundePruefungsrelevanzSchema.default('hoch'),
  lerneinheitIds: z.array(z.string().trim().regex(/^FK-[1-4]-[A-Z0-9]{2,6}-\d{3}$/)).default([]),
  reviewStatus: fachkundeReviewStatusSchema.default('entwurf'),
});

/** Inventarzeile fuer Freigabe-/Qualitaetsuebersicht aus MDX-Frontmatter. */
export const fachkundeFreigabeInventarZeileSchema = z.object({
  slug: z.string().trim().min(1).max(200),
  titel: z.string().trim().min(1).max(240),
  themaCode: z.string().trim().min(1).max(40),
  reviewStatus: fachkundeReviewStatusSchema,
  fragenStatus: z.enum(['entwurf', 'freigegeben']),
  zahlenwerteStatus: z.enum([
    'uebungswerte',
    'beispielwerte',
    'quellenwert',
    'quellenpflichtig',
    'keine_zahlenwerte',
  ]),
  freigabeErforderlich: z.boolean(),
  freigegebenVon: z.string().trim().max(160).nullable(),
  quellenOffen: z.boolean(),
  hatStory: z.boolean(),
  hatEinfach: z.boolean(),
  hatFachlich: z.boolean(),
  hatMerksatz: z.boolean(),
  hatQuiz: z.boolean(),
  hatBegriffe: z.boolean(),
  bereitFuerFachpruefung: z.boolean(),
});

export type FachkundeKapitel = z.infer<typeof fachkundeKapitelSchema>;
export type FachkundeWissensstufe = z.infer<typeof fachkundeWissensstufeSchema>;
export type FachkundeSchwierigkeit = z.infer<typeof fachkundeSchwierigkeitSchema>;
export type FachkundePruefungsrelevanz = z.infer<typeof fachkundePruefungsrelevanzSchema>;
export type FachkundeReviewStatus = z.infer<typeof fachkundeReviewStatusSchema>;
export type FachkundeQuellenart = z.infer<typeof fachkundeQuellenartSchema>;
export type FachkundeSourceReference = z.infer<typeof fachkundeSourceReferenceSchema>;
export type FachkundeVisualReference = z.infer<typeof fachkundeVisualReferenceSchema>;
export type FachkundeInteractionReference = z.infer<typeof fachkundeInteractionReferenceSchema>;
export type FachkundeMiniWissenscheck = z.infer<typeof fachkundeMiniWissenscheckSchema>;
export type FachkundeMiniWissenscheckFrage = z.infer<typeof fachkundeMiniWissenscheckFrageSchema>;
export type FachkundeMiniWissenscheckOption = z.infer<typeof fachkundeMiniWissenscheckOptionSchema>;
export type FachkundeMatrixEinheit = z.infer<typeof fachkundeMatrixEinheitSchema>;
export type FachkundeGlossarBegriff = z.infer<typeof fachkundeGlossarBegriffSchema>;
export type FachkundeFormel = z.infer<typeof fachkundeFormelSchema>;
export type FachkundeFreigabeInventarZeile = z.infer<typeof fachkundeFreigabeInventarZeileSchema>;

/** Lernwirksamkeits-Event (Domain; Speicherung/Export spaeter additiv). */
export const fachkundeLernereignisSchema = z.object({
  id: z.string().uuid(),
  typ: z.enum([
    'lerneinheit_geoeffnet',
    'abschnitt_abgeschlossen',
    'trainer_versuch',
    'mini_check_antwort',
    'glossar_geoeffnet',
    'formel_geoeffnet',
  ]),
  lerneinheitId: z.string().trim().regex(/^FK-[1-4]-[A-Z0-9]{2,6}-\d{3}$/).nullable().optional(),
  masterySchluessel: z.string().trim().min(1).max(160).nullable().optional(),
  erfolgreich: z.boolean().nullable().optional(),
  dauerMs: z.number().int().nonnegative().nullable().optional(),
  locale: z.enum(['de', 'en', 'ar', 'fr']).default('de'),
  entstandenAm: z.string().datetime({ offset: true }),
});
export type FachkundeLernereignis = z.infer<typeof fachkundeLernereignisSchema>;
