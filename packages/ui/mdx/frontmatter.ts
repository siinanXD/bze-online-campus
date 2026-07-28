import { z } from 'zod';

/**
 * Zod-Schema für die YAML-Frontmatter der Fachkunde-Lerneinheiten (SPEC §11 AP-05).
 * Faktenbelegpflicht (AGENTS.md §2, SPEC §2 Regel 8): jede Lerneinheit trägt mindestens
 * eine Quellenangabe. Seitenzahlen dürfen ein Platzhalter sein ("S. [vom Ausbilder]"),
 * aber das Feld selbst ist Pflicht — leer ist richtig, raten ist falsch.
 */
export const fachkundeQuelleSchema = z.object({
  titel: z.string().min(1),
  verlag: z.string().min(1).optional(),
  auflage: z.string().min(1).optional(),
  seite: z.string().min(1),
  tabelle: z.string().min(1).optional(),
});
export type FachkundeQuelle = z.infer<typeof fachkundeQuelleSchema>;

export const fachkundeFrontmatterSchema = z.object({
  titel: z.string().min(1),
  /** Fachthema-Code, muss zu `themen.code` aus dem Datenmodell passen (SPEC §3), z. B. "PT-WS". */
  thema_code: z.string().min(1),
  lesedauer_minuten: z.number().int().positive(),
  quellen: z.array(fachkundeQuelleSchema).min(1),
});
export type FachkundeFrontmatter = z.infer<typeof fachkundeFrontmatterSchema>;
