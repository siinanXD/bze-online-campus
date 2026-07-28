import { z } from 'zod';

/** Zod-Validierung an der Systemgrenze Formular → Server Action (AGENTS.md DoD). */

export const ROLLEN = ['teilnehmer', 'ausbilder', 'verwaltung', 'admin'] as const;

export const nutzerAnlegenSchema = z
  .object({
    benutzername: z
      .string()
      .trim()
      .min(3, 'zu_kurz')
      .max(40, 'zu_lang')
      .regex(/^[a-z0-9._-]+$/, 'ungueltiges_format'),
    vorname: z.string().trim().min(1, 'pflichtfeld').max(80),
    nachname: z.string().trim().min(1, 'pflichtfeld').max(80),
    rolle: z.enum(ROLLEN),
    kohorte_id: z.string().uuid().optional().or(z.literal('')),
  })
  .superRefine((val, ctx) => {
    if (val.rolle === 'teilnehmer' && !val.kohorte_id) {
      ctx.addIssue({ code: 'custom', path: ['kohorte_id'], message: 'pflichtfeld' });
    }
  });

export type NutzerAnlegenEingabe = z.infer<typeof nutzerAnlegenSchema>;

export const nutzerIdSchema = z.string().uuid();

export const zuweisungSchema = z.object({
  ausbilderId: z.string().uuid(),
  teilnehmerId: z.string().uuid(),
});

export const auditFilterSchema = z.object({
  aktion: z.string().trim().max(80).optional(),
  zielTyp: z.string().trim().max(40).optional(),
  von: z.string().optional(),
  bis: z.string().optional(),
  seite: z.coerce.number().int().min(1).default(1),
});
