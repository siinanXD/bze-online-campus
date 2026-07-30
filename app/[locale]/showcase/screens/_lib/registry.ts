import type { ComponentType } from 'react';
import {
  CampusBerichtsheft,
  CampusFortschritt,
  CampusLernen,
  CampusMehr,
  CampusTopic,
  PruefungErgebnis,
  PruefungLauf,
  PruefungStart,
} from './campus-screens';
import {
  AdminAudit,
  AdminNutzer,
  AusbilderKohorte,
  AusbilderReview,
  AusbilderReviewLeer,
  AusbilderTeilnehmer,
} from './betreuung-screens';

export interface ScreenEintrag {
  slug: string;
  titel: string;
  /** Route in der echten App, die dieser Entwurf abbildet. */
  route: string;
  bereich: 'Teilnehmende' | 'Ausbilder' | 'Admin';
  komponente: ComponentType;
}

/**
 * Entwuerfe der auth-geschuetzten Screens. Sie benutzen dieselben
 * Komponenten und dieselbe Shell wie die echte App, aber feste
 * Beispieldaten statt Supabase — damit das Design ohne Datenbank
 * begutachtet werden kann.
 */
export const SCREENS: ScreenEintrag[] = [
  {
    slug: 'campus-lernen',
    titel: 'Startseite Teilnehmende',
    route: '/[locale]/campus/lernen',
    bereich: 'Teilnehmende',
    komponente: CampusLernen,
  },
  {
    slug: 'campus-topic',
    titel: 'Fachkunde lesen',
    route: '/[locale]/campus/topic/[themaId]',
    bereich: 'Teilnehmende',
    komponente: CampusTopic,
  },
  {
    slug: 'pruefung-start',
    titel: 'Prüfung — Start',
    route: '/[locale]/campus/pruefung',
    bereich: 'Teilnehmende',
    komponente: PruefungStart,
  },
  {
    slug: 'pruefung-lauf',
    titel: 'Prüfung — laufend',
    route: '/[locale]/campus/pruefung/[pruefungId]',
    bereich: 'Teilnehmende',
    komponente: PruefungLauf,
  },
  {
    slug: 'pruefung-ergebnis',
    titel: 'Prüfung — Ergebnis',
    route: '/[locale]/campus/pruefung/ergebnis/[ergebnisId]',
    bereich: 'Teilnehmende',
    komponente: PruefungErgebnis,
  },
  {
    slug: 'campus-fortschritt',
    titel: 'Fortschritt',
    route: '/[locale]/campus/fortschritt',
    bereich: 'Teilnehmende',
    komponente: CampusFortschritt,
  },
  {
    slug: 'campus-berichtsheft',
    titel: 'Berichtsheft',
    route: '/[locale]/campus/berichtsheft',
    bereich: 'Teilnehmende',
    komponente: CampusBerichtsheft,
  },
  {
    slug: 'campus-mehr',
    titel: 'Mehr und Einstellungen',
    route: '/[locale]/campus/mehr',
    bereich: 'Teilnehmende',
    komponente: CampusMehr,
  },
  {
    slug: 'ausbilder-teilnehmer',
    titel: 'Teilnehmendenliste',
    route: '/[locale]/ausbilder/teilnehmer',
    bereich: 'Ausbilder',
    komponente: AusbilderTeilnehmer,
  },
  {
    slug: 'ausbilder-review',
    titel: 'Review-Warteschlange',
    route: '/[locale]/ausbilder/review',
    bereich: 'Ausbilder',
    komponente: AusbilderReview,
  },
  {
    slug: 'ausbilder-review-leer',
    titel: 'Review — Leerzustand',
    route: '/[locale]/ausbilder/review',
    bereich: 'Ausbilder',
    komponente: AusbilderReviewLeer,
  },
  {
    slug: 'ausbilder-kohorte',
    titel: 'Kohortenübersicht',
    route: '/[locale]/ausbilder/kohorte/[id]',
    bereich: 'Ausbilder',
    komponente: AusbilderKohorte,
  },
  {
    slug: 'admin-nutzer',
    titel: 'Nutzerverwaltung',
    route: '/[locale]/admin/nutzer',
    bereich: 'Admin',
    komponente: AdminNutzer,
  },
  {
    slug: 'admin-audit',
    titel: 'Audit-Log',
    route: '/[locale]/admin/audit',
    bereich: 'Admin',
    komponente: AdminAudit,
  },
];
