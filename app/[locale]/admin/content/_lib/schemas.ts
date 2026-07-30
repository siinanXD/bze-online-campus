import { z } from 'zod';
import {
  CONTENT_STATUS,
  CONTENT_TYPEN,
  QUELLENARTEN,
  SCHWIERIGKEITSGRADE,
  contentStatusSchema,
  contentTypSchema,
  quellenartSchema,
  schwierigkeitsgradSchema,
} from '@bze/core/content';

export const CONTENT_SORT_FELDER = [
  'titel',
  'content_typ',
  'status',
  'schwierigkeitsgrad',
  'quellenart',
  'qualitaetswert',
  'created_at',
  'updated_at',
] as const;

export const contentFilterSchema = z.object({
  q: z.string().trim().max(120).optional().catch(undefined),
  typ: z.enum(CONTENT_TYPEN).optional().catch(undefined),
  fachbereich: z.string().uuid().optional().catch(undefined),
  thema: z.string().uuid().optional().catch(undefined),
  schwierigkeit: z.enum(SCHWIERIGKEITSGRADE).optional().catch(undefined),
  status: z.enum(CONTENT_STATUS).optional().catch(undefined),
  quelle: z.enum(QUELLENARTEN).optional().catch(undefined),
  demo: z.enum(['ja', 'nein']).optional().catch(undefined),
  qualitaet: z.enum(['niedrig', 'mittel', 'hoch', 'ohne']).optional().catch(undefined),
  von: z.string().optional().catch(undefined),
  bis: z.string().optional().catch(undefined),
  sort: z.enum(CONTENT_SORT_FELDER).default('updated_at').catch('updated_at'),
  richtung: z.enum(['asc', 'desc']).default('desc').catch('desc'),
  seite: z.coerce.number().int().min(1).default(1).catch(1),
});
export type ContentFilter = z.infer<typeof contentFilterSchema>;

export const contentIdSchema = z.string().uuid();

export const contentBearbeitenSchema = z.object({
  id: z.string().uuid(),
  titel: z.string().trim().min(1).max(240),
  beschreibung: z.string().trim().max(4000).optional().or(z.literal('')),
  schwierigkeitsgrad: schwierigkeitsgradSchema,
  status: contentStatusSchema,
  ist_demo: z.boolean(),
  demo_sichtbar: z.boolean(),
  demo_label: z.string().trim().max(500).optional().or(z.literal('')),
  fachlich_verifiziert: z.boolean(),
  quellenart: quellenartSchema,
  ki_anbieter: z.string().trim().max(120).optional().or(z.literal('')),
  ki_modell: z.string().trim().max(160).optional().or(z.literal('')),
  qualitaetswert: z.coerce.number().min(0).max(1).nullable().optional(),
  inhalt: z.string().trim().min(2).max(50000),
});
export type ContentBearbeitenEingabe = z.infer<typeof contentBearbeitenSchema>;

export const contentStatusAendernSchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(200),
  status: contentStatusSchema,
});

export const contentBulkArchivierenSchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(200),
});

export const contentLoeschenSchema = z.object({
  id: z.string().uuid(),
});

export const qualitaetsScoreFilterSchema = z.enum(['problematisch', 'pruefen', 'gut', 'ohne']).optional().catch(undefined);

export const qualitaetsFilterSchema = z.object({
  q: z.string().trim().max(120).optional().catch(undefined),
  score: qualitaetsScoreFilterSchema,
  seite: z.coerce.number().int().min(1).default(1).catch(1),
});
export type QualitaetsFilter = z.infer<typeof qualitaetsFilterSchema>;

export const qualitaetsPruefungStartenSchema = z.object({
  contentId: z.string().uuid(),
});

export const contentRegenerierenSchema = z.object({
  contentId: z.string().uuid(),
  variante: z.enum(['einfacher', 'schwieriger', 'praxisnaeher', 'kuerzer', 'ausfuehrlicher', 'praeziser']),
});

export const contentKonstanten = {
  typen: CONTENT_TYPEN,
  status: CONTENT_STATUS,
  schwierigkeitsgrade: SCHWIERIGKEITSGRADE,
  quellenarten: QUELLENARTEN,
  sortFelder: CONTENT_SORT_FELDER,
};
