import { z } from 'zod';
import { wissensquelleTypSchema } from '@bze/core/content';

export const WISSENS_DOKUMENTE_PRO_SEITE = 20;

export const wissensdokumentFilterSchema = z.object({
  q: z.string().trim().max(120).optional().catch(undefined),
  status: z.enum(['alle', 'aktiv', 'fehler', 'deaktiviert']).default('alle').catch('alle'),
  seite: z.coerce.number().int().min(1).default(1).catch(1),
});
export type WissensdokumentFilter = z.infer<typeof wissensdokumentFilterSchema>;

export const wissensdokumentIdSchema = z.string().uuid();

export const wissensTextQuelleSchema = z.object({
  titel: z.string().trim().min(1).max(240),
  beschreibung: z.string().trim().max(2000).optional().or(z.literal('')),
  quelleTyp: z.literal('manueller_fachtext'),
  text: z.string().trim().min(20).max(200000),
});

export const wissensDateiQuelleSchema = z.object({
  titel: z.string().trim().min(1).max(240),
  beschreibung: z.string().trim().max(2000).optional().or(z.literal('')),
  quelleTyp: wissensquelleTypSchema,
});
