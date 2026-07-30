/**
 * Typen und Anzeige-Zuordnungen des Ausbilder-Fragenbereichs.
 *
 * Ausgelagert, weil sowohl die Server-Komponente (`page.tsx`, die die Daten aus
 * Supabase in `FrageAnsicht` formt) als auch die Client-Komponente
 * (`fragen-client.tsx`, die sie darstellt) darauf zugreifen. Die Typen an der
 * Client-Datei zu belassen zwang die Server-Seite, aus einer `'use client'`-
 * Datei zu importieren — hier sind sie für beide Seiten neutral.
 */

import type { FrageStatus } from '@bze/ui';

export type ThemaOption = { id: string; bezeichnung: string };

export type FrageAnsicht = {
  id: string;
  thema: string;
  typ: string;
  aufgabenstellung: string;
  status: string;
  kern: boolean;
  kiGeneriert: boolean;
  schwierigkeit: number | null;
  quellenstufe: number | null;
  fundstelle: string | null;
  enthaeltZahlenwert: boolean;
  normbezuege: string[];
  verifikation: { bestaetigt: boolean; einwaende: string[]; confidence: number | null } | null;
  reviewGruende: string[];
  optionen: Array<{ id: string; text: string; ist_korrekt: boolean; erklaerung: string | null }>;
};

export type EditForm = {
  aufgabenstellung: string;
  kern: boolean;
  optionen: Array<{ id: string; text: string; ist_korrekt: boolean; erklaerung: string }>;
};

/** Fragestatus → Statusbadge-Variante und Übersetzungsschlüssel. */
export const STATUS_UI: Record<string, { s: FrageStatus; key: string }> = {
  entwurf: { s: 'neu', key: 'entwurf' },
  verifiziert: { s: 'einmal_richtig', key: 'verifiziert' },
  freigegeben: { s: 'abgeschlossen', key: 'freigegeben' },
  gesperrt: { s: 'falsch', key: 'gesperrt' },
  pruefung_noetig: { s: 'falsch', key: 'pruefungNoetig' },
};

/** Grund einer Review-Kennzeichnung → Übersetzungsschlüssel. */
export const GRUND_KEY: Record<string, string> = {
  aehnlichkeit_zu_hoch: 'aehnlichkeit',
  verifikation_fehlgeschlagen: 'verifikationFehlgeschlagen',
  stichprobe: 'stichprobe',
};
