import { z } from 'zod';

/** Login: Benutzername + Passwort (Spec §6.2.1). */
export const loginSchema = z.object({
  benutzername: z.string().trim().min(1, 'pflichtfeld'),
  passwort: z.string().min(1, 'pflichtfeld'),
});
export type LoginInput = z.infer<typeof loginSchema>;

/** Erzwungener Passwortwechsel bei `muss_passwort_aendern`. */
export const passwortSchema = z
  .object({
    neuesPasswort: z.string().min(8, 'minLaenge'),
    passwortWiederholen: z.string().min(8, 'minLaenge'),
  })
  .refine((daten) => daten.neuesPasswort === daten.passwortWiederholen, {
    message: 'stimmtNichtUeberein',
    path: ['passwortWiederholen'],
  });
export type PasswortInput = z.infer<typeof passwortSchema>;

/** Sprachwahl + optionaler Kohortenbeitritt per Code (Spec §6.2.2). */
export const SPRACHEN = ['de', 'en', 'fr', 'ar', 'uk', 'tr'] as const;

export const sprachwahlSchema = z.object({
  sprache: z.enum(SPRACHEN),
  beitrittscode: z
    .string()
    .trim()
    .toUpperCase()
    .max(20, 'zuLang')
    .optional()
    .or(z.literal('')),
});
export type SprachwahlInput = z.infer<typeof sprachwahlSchema>;
