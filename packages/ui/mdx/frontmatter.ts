import { z } from 'zod';

/**
 * Zod-Schema für die YAML-Frontmatter der Fachkunde-Lerneinheiten (SPEC §11 AP-05).
 * Faktenbelegpflicht (CONTRIBUTING.md §2, SPEC §2 Regel 8): jede Lerneinheit trägt mindestens
 * eine Quellenangabe. Seitenzahlen dürfen ein Platzhalter sein ("S. [vom Ausbilder]"),
 * aber das Feld selbst ist Pflicht — leer ist richtig, raten ist falsch.
 */
export const fachkundeQuelleSchema = z.object({
  titel: z.string().min(1),
  verlag: z.string().min(1).optional(),
  auflage: z.string().min(1).optional(),
  seite: z.string().min(1),
  tabelle: z.string().min(1).optional(),
  status: z.enum(['offen', 'freigegeben']).default('offen'),
  hinweis: z.string().min(1).optional(),
});
export type FachkundeQuelle = z.infer<typeof fachkundeQuelleSchema>;

export const fachkundeFreigabeSchema = z.object({
  erforderlich: z.boolean().default(true),
  freigegeben_von: z.string().min(1).nullable().optional(),
  freigegeben_am: z.string().min(1).nullable().optional(),
  hinweis: z.string().min(1).optional(),
});
export type FachkundeFreigabe = z.infer<typeof fachkundeFreigabeSchema>;

export const fachkundeFrontmatterSchema = z.object({
  titel: z.string().min(1),
  /** Fachthema-Code, muss zu `themen.code` aus dem Datenmodell passen (SPEC §3), z. B. "PT-WS". */
  thema_code: z.string().min(1),
  lesedauer_minuten: z.number().int().positive(),
  quellen: z.array(fachkundeQuelleSchema).min(1),
  review_status: z.enum(['entwurf', 'fachlich_geprueft', 'freigegeben']).default('entwurf'),
  /** Freigabe nur fuer Mini-Wissenscheck-Fragen; unabhaengig vom Gesamt-Review der Einheit. */
  fragen_status: z.enum(['entwurf', 'freigegeben']).default('entwurf'),
  pruefungsrelevanz: z.enum(['niedrig', 'mittel', 'hoch', 'sehr_hoch']).default('mittel'),
  zahlenwerte_status: z
    .enum(['uebungswerte', 'beispielwerte', 'quellenwert', 'quellenpflichtig', 'keine_zahlenwerte'])
    .default('uebungswerte'),
  fachliche_freigabe: fachkundeFreigabeSchema.default({
    erforderlich: true,
    hinweis: 'Fachliche Freigabe durch Ausbilder erforderlich.',
  }),
});
export type FachkundeFrontmatter = z.infer<typeof fachkundeFrontmatterSchema>;
