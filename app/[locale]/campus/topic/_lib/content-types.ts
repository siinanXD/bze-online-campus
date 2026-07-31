import { z } from 'zod';
import { contentTypSchema } from '@bze/core/content';

export const fachbereichSchema = z.object({
  id: z.string().uuid(),
  bezeichnung: z.string(),
  code: z.string().nullable(),
  beschreibung: z.string().nullable(),
  reihenfolge: z.number().int(),
});
export type Fachbereich = z.infer<typeof fachbereichSchema>;

export const fachbereichZeileSchema = fachbereichSchema.extend({
  themenAnzahl: z.number().int().min(0),
});
export type FachbereichZeile = z.infer<typeof fachbereichZeileSchema>;

export const themaEinordnungSchema = z.object({
  id: z.string().uuid(),
  pruefungsbereich_id: z.string().uuid(),
  parent_id: z.string().uuid().nullable(),
  bezeichnung: z.string(),
  code: z.string().nullable(),
  beschreibung: z.string().nullable(),
  reihenfolge: z.number().int(),
});
export type ThemaEinordnung = z.infer<typeof themaEinordnungSchema>;

export const lernzielZeileSchema = z.object({
  id: z.string().uuid(),
  titel: z.string(),
  beschreibung: z.string().nullable(),
  schwierigkeitsgrad: z.string(),
  ist_demo: z.boolean(),
  demo_label: z.string().nullable(),
  fachlich_verifiziert: z.boolean(),
});
export type LernzielZeile = z.infer<typeof lernzielZeileSchema>;

export const contentElementZeileSchema = z.object({
  id: z.string().uuid(),
  titel: z.string(),
  beschreibung: z.string().nullable(),
  content_typ: contentTypSchema,
  inhalt: z.unknown(),
  schwierigkeitsgrad: z.string(),
  status: z.string(),
  ist_demo: z.boolean(),
  demo_sichtbar: z.boolean(),
  demo_label: z.string().nullable(),
  fachlich_verifiziert: z.boolean(),
  ki_anbieter: z.string().nullable(),
  ki_modell: z.string().nullable(),
  qualitaetswert: z.coerce.number().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  lerneinheit_id: z.string().uuid().nullable(),
  frage_id: z.string().uuid().nullable(),
});
export type ContentElementZeile = z.infer<typeof contentElementZeileSchema>;

export const lernkarteZeileSchema = z.object({
  id: z.string().uuid(),
  content_element_id: z.string().uuid(),
  vorderseite: z.string(),
  rueckseite: z.string(),
  merksatz: z.string().nullable(),
});
export type LernkarteZeile = z.infer<typeof lernkarteZeileSchema>;

export const antwortoptionZeileSchema = z.object({
  id: z.string().uuid(),
  text: z.string(),
  ist_korrekt: z.boolean(),
  erklaerung: z.string().nullable(),
  reihenfolge: z.number().int(),
});
export type AntwortoptionZeile = z.infer<typeof antwortoptionZeileSchema>;

export const frageZeileSchema = z.object({
  id: z.string().uuid(),
  typ: z.string(),
  aufgabenstellung: z.string(),
  schwierigkeit: z.number().int().nullable(),
  kern: z.boolean(),
  antwortoptionen: z.preprocess(
    (wert) => (Array.isArray(wert) ? wert : []),
    z.array(antwortoptionZeileSchema),
  ),
});
export type FrageZeile = z.infer<typeof frageZeileSchema>;
