import { z } from 'zod';
import {
  CONTENT_TYPEN,
  contentSourceModeSchema,
  quellenartSchema,
  ragKontextSchema,
  SCHWIERIGKEITSGRADE,
  contentTypSchema,
  schwierigkeitsgradSchema,
} from '@bze/core/content';

export const GENERATOR_MAX_INHALTE = 30;
export const GENERATOR_MAX_PRO_TYP = 5;

export const generatorProviderSchema = z.enum(['mock_ai', 'llm']);
export type GeneratorProvider = z.infer<typeof generatorProviderSchema>;

export const generatorFehlerSimulationSchema = z.enum(['keine', 'provider_fehler', 'validierung_fehler']);
export type GeneratorFehlerSimulation = z.infer<typeof generatorFehlerSimulationSchema>;

const anzahlProTypSchema = z.object(
  Object.fromEntries(CONTENT_TYPEN.map((typ) => [typ, z.coerce.number().int().min(0).max(GENERATOR_MAX_PRO_TYP).default(0)])) as Record<
    (typeof CONTENT_TYPEN)[number],
    z.ZodDefault<z.ZodNumber>
  >,
);

export const generatorRequestSchema = z.object({
  fachbereichId: z.string().uuid(),
  fachbereichName: z.string().trim().min(1).max(160),
  themaId: z.string().uuid(),
  themaName: z.string().trim().min(1).max(160),
  unterthemaId: z.string().uuid(),
  unterthemaName: z.string().trim().min(1).max(160),
  lernzielIds: z.array(z.string().uuid()).max(20).default([]),
  lernziele: z.array(z.string().trim().min(1).max(240)).max(20).default([]),
  contentTypen: z.array(contentTypSchema).min(1).max(CONTENT_TYPEN.length),
  schwierigkeitsgrade: z.array(schwierigkeitsgradSchema).min(1).max(SCHWIERIGKEITSGRADE.length),
  anzahlProTyp: anzahlProTypSchema,
  fehlerSimulation: generatorFehlerSimulationSchema.default('keine'),
});
export type GeneratorRequest = z.infer<typeof generatorRequestSchema>;

export const lernzielVorschlagSchema = z.object({
  clientId: z.string().min(1),
  titel: z.string().trim().min(1).max(240),
  beschreibung: z.string().trim().min(1).max(1000),
  schwierigkeitsgrad: schwierigkeitsgradSchema,
});
export type LernzielVorschlag = z.infer<typeof lernzielVorschlagSchema>;

export const generatorAntwortoptionSchema = z.object({
  text: z.string().trim().min(1).max(1000),
  ist_korrekt: z.boolean(),
  erklaerung: z.string().trim().min(1).max(1500),
});
export type GeneratorAntwortoption = z.infer<typeof generatorAntwortoptionSchema>;

export const generatorContentItemSchema = z.object({
  clientId: z.string().min(1),
  titel: z.string().trim().min(1).max(240),
  beschreibung: z.string().trim().min(1).max(1000),
  content_typ: contentTypSchema,
  schwierigkeitsgrad: schwierigkeitsgradSchema,
  lernzielIds: z.array(z.string().uuid()).default([]),
  inhalt: z.record(z.unknown()),
  antwortoptionen: z.array(generatorAntwortoptionSchema).default([]),
  musterloesung: z.string().trim().max(4000).nullable().default(null),
  bewertungsraster: z.array(z.string().trim().min(1).max(1000)).default([]),
  qualitaetswert: z.number().min(0).max(1),
  hinweise: z.array(z.string().trim().min(1).max(500)).default([]),
});
export type GeneratorContentItem = z.infer<typeof generatorContentItemSchema>;

export const generatorUsageSchema = z.object({
  inputTokens: z.number().int().min(0).nullable().optional(),
  outputTokens: z.number().int().min(0).nullable().optional(),
  latenzMs: z.number().int().min(0).nullable().optional(),
  requestId: z.string().trim().min(1).max(200).nullable().optional(),
});
export type GeneratorUsage = z.infer<typeof generatorUsageSchema>;

export const generatorPreviewSchema = z.object({
  jobId: z.string().uuid().optional(),
  provider: generatorProviderSchema,
  modell: z.string().trim().min(1).max(160),
  quelle: quellenartSchema.refine((quelle) => quelle === 'mock_ai' || quelle === 'ki', 'ungueltige_generator_quelle'),
  sourceMode: contentSourceModeSchema.default('generated'),
  ragEnabled: z.boolean().default(false),
  ragContext: ragKontextSchema.optional(),
  demoLabel: z.literal('KI-generierter Beispielinhalt - nicht fachlich verifiziert'),
  items: z.array(generatorContentItemSchema).max(GENERATOR_MAX_INHALTE),
  erstelltAm: z.string(),
  usage: generatorUsageSchema.optional(),
});
export type GeneratorPreview = z.infer<typeof generatorPreviewSchema>;

export const generatorSpeichernSchema = z.object({
  jobId: z.string().uuid(),
  clientIds: z.array(z.string().min(1)).min(1).max(GENERATOR_MAX_INHALTE),
  items: z.array(generatorContentItemSchema).max(GENERATOR_MAX_INHALTE).optional(),
});

export const generatorRegenerierenSchema = z.object({
  jobId: z.string().uuid(),
  clientId: z.string().min(1),
  variante: z.enum(['neu', 'einfacher', 'schwieriger', 'praxisnaeher', 'kuerzer', 'ausfuehrlicher']),
});

export const lernzieleGenerierenSchema = z.object({
  fachbereichId: z.string().uuid(),
  fachbereichName: z.string().trim().min(1).max(160),
  themaId: z.string().uuid(),
  themaName: z.string().trim().min(1).max(160),
  unterthemaId: z.string().uuid(),
  unterthemaName: z.string().trim().min(1).max(160),
  schwierigkeit: schwierigkeitsgradSchema.default('mittel'),
});

/**
 * Zaehlt die angeforderten Inhalte ueber alle Typen.
 */
export function zaehleAngeforderteInhalte(request: Pick<GeneratorRequest, 'contentTypen' | 'anzahlProTyp'>): number {
  return request.contentTypen.reduce((summe, typ) => summe + (request.anzahlProTyp[typ] ?? 0), 0);
}
