import { z } from 'zod';

export const CONTENT_TYPEN = [
  'erklaerung',
  'lernkarte',
  'single_choice',
  'multiple_choice',
  'freitext',
  'rechenaufgabe',
  'praxisfall',
  'pruefungsnahe_uebungsfrage',
  'zusammenfassung',
] as const;

export const CONTENT_STATUS = [
  'entwurf',
  'generiert',
  'in_pruefung',
  'freigegeben',
  'abgelehnt',
  'archiviert',
] as const;

export const SCHWIERIGKEITSGRADE = ['einfach', 'mittel', 'schwer'] as const;

export const QUELLENARTEN = [
  'tabellenbuch',
  'rahmenlehrplan',
  'traegerskript',
  'web',
  'ki',
  'mock_ai',
  'demo',
  'manuell',
  'unbekannt',
] as const;

export const contentTypSchema = z.enum(CONTENT_TYPEN);
export const contentStatusSchema = z.enum(CONTENT_STATUS);
export const schwierigkeitsgradSchema = z.enum(SCHWIERIGKEITSGRADE);
export const quellenartSchema = z.enum(QUELLENARTEN);

export type ContentTyp = z.infer<typeof contentTypSchema>;
export type ContentStatus = z.infer<typeof contentStatusSchema>;
export type Schwierigkeitsgrad = z.infer<typeof schwierigkeitsgradSchema>;
export type Quellenart = z.infer<typeof quellenartSchema>;

export type ContentRolle = 'teilnehmer' | 'ausbilder' | 'verwaltung' | 'admin';

export const contentMetadatenSchema = z.object({
  id: z.string().uuid(),
  titel: z.string().trim().min(1).max(240),
  beschreibung: z.string().trim().max(4000).nullable().optional(),
  contentTyp: contentTypSchema,
  fachbereichId: z.string().uuid().nullable().optional(),
  themaId: z.string().uuid().nullable().optional(),
  unterthemaId: z.string().uuid().nullable().optional(),
  lernzielIds: z.array(z.string().uuid()).default([]),
  schwierigkeitsgrad: schwierigkeitsgradSchema,
  status: contentStatusSchema,
  istDemo: z.boolean().default(false),
  demoSichtbar: z.boolean().default(false),
  demoLabel: z.string().trim().max(500).nullable().optional(),
  fachlichVerifiziert: z.boolean().default(false),
  quellenart: quellenartSchema.default('unbekannt'),
  kiAnbieter: z.string().trim().max(120).nullable().optional(),
  kiModell: z.string().trim().max(160).nullable().optional(),
  qualitaetswert: z.number().min(0).max(1).nullable().optional(),
  erstelltAm: z.string().datetime({ offset: true }),
  geaendertAm: z.string().datetime({ offset: true }),
});

export const lernzielSchema = contentMetadatenSchema.pick({
  id: true,
  titel: true,
  beschreibung: true,
  fachbereichId: true,
  themaId: true,
  unterthemaId: true,
  schwierigkeitsgrad: true,
  status: true,
  istDemo: true,
  demoSichtbar: true,
  demoLabel: true,
  fachlichVerifiziert: true,
  quellenart: true,
  kiAnbieter: true,
  kiModell: true,
  qualitaetswert: true,
  erstelltAm: true,
  geaendertAm: true,
});

export const lernkarteSchema = z.object({
  id: z.string().uuid(),
  contentElementId: z.string().uuid(),
  vorderseite: z.string().trim().min(1).max(2000),
  rueckseite: z.string().trim().min(1).max(4000),
  merksatz: z.string().trim().max(1000).nullable().optional(),
});

export type ContentMetadaten = z.infer<typeof contentMetadatenSchema>;
export type Lernziel = z.infer<typeof lernzielSchema>;
export type Lernkarte = z.infer<typeof lernkarteSchema>;

export interface SichtbarkeitsEingabe {
  rolle: ContentRolle;
  status: ContentStatus;
  istDemo: boolean;
  demoSichtbar: boolean;
  demoModusAktiv: boolean;
  gleicherTraeger: boolean;
}
