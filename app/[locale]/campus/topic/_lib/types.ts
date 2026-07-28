import { z } from 'zod';

/**
 * Zod-Schemas für die Systemgrenze Supabase → Topic-/Lerneinheit-Seiten (AGENTS.md §7
 * "Zod-Validierung an jeder Systemgrenze"). Es existiert noch kein generierter `Database`-Typ
 * (AP-01 liefert ihn perspektivisch), deshalb werden die Supabase-Antworten hier explizit
 * geprüft statt blind gecastet.
 */

export const themaSchema = z.object({
  id: z.string().uuid(),
  bezeichnung: z.string(),
  code: z.string().nullable(),
});
export type Thema = z.infer<typeof themaSchema>;

export const lerneinheitListeSchema = z.object({
  id: z.string().uuid(),
  titel: z.string(),
  lesedauer_minuten: z.number().int().nullable(),
  reihenfolge: z.number().int(),
  inhalt_mdx: z.string().nullable(),
});
export type LerneinheitListe = z.infer<typeof lerneinheitListeSchema>;

export const lerneinheitDetailSchema = z.object({
  id: z.string().uuid(),
  thema_id: z.string().uuid(),
  titel: z.string(),
  inhalt_mdx: z.string().nullable(),
  lesedauer_minuten: z.number().int().nullable(),
  quellenangaben: z.unknown().nullable(),
  reihenfolge: z.number().int(),
});
export type LerneinheitDetail = z.infer<typeof lerneinheitDetailSchema>;

export const fortschrittZeileSchema = z.object({
  abschnitt_index: z.number().int(),
  gelesen_am: z.string().nullable(),
  lesezeit_sekunden: z.number().int().nullable(),
  bewertung: z.number().int().nullable(),
});
export type FortschrittZeile = z.infer<typeof fortschrittZeileSchema>;

/** Baustein für `lerneinheiten.quellenangaben` (jsonb) — deckt sich mit der MDX-Frontmatter. */
export const quelleSchema = z.object({
  titel: z.string(),
  verlag: z.string().optional(),
  auflage: z.string().optional(),
  seite: z.string(),
  tabelle: z.string().optional(),
});
export type Quelle = z.infer<typeof quelleSchema>;
