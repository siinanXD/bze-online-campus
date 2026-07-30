'use client';

import * as React from 'react';
import { BottomNav } from '@/components/shell/bottom-nav';
import { SeitenNavigation, type NavGruppe } from '@/components/shell/seiten-navigation';
import { Avatar, cn } from '@bze/ui';

export const CAMPUS_NAV: NavGruppe[] = [
  {
    titel: 'Lernen',
    eintraege: [
      { label: 'Start', pfad: '/campus', exakt: true, symbol: '⌂' },
      { label: 'Lernfelder', pfad: '/campus/lernen', symbol: '▤' },
      { label: 'Prüfung', pfad: '/campus/pruefung', symbol: '✎' },
      { label: 'Fortschritt', pfad: '/campus/fortschritt', symbol: '◕' },
    ],
  },
  {
    titel: 'Ausbildung',
    eintraege: [
      { label: 'Berichtsheft', pfad: '/campus/berichtsheft', symbol: '▦' },
      { label: 'Profil', pfad: '/campus/profil', symbol: '☺' },
      { label: 'Mehr', pfad: '/campus/mehr', symbol: '⋯' },
    ],
  },
];

export const AUSBILDER_NAV: NavGruppe[] = [
  {
    titel: 'Begleitung',
    eintraege: [
      { label: 'Teilnehmende', pfad: '/ausbilder/teilnehmer', symbol: '☺' },
      { label: 'Kohorten', pfad: '/ausbilder/kohorte', symbol: '▤' },
      { label: 'Review', pfad: '/ausbilder/review', symbol: '✓' },
      { label: 'Berichtshefte', pfad: '/ausbilder/berichtsheft', symbol: '▦' },
    ],
  },
  {
    titel: 'Inhalte',
    eintraege: [{ label: 'Fragen', pfad: '/ausbilder/fragen', symbol: '?' }],
  },
];

export const ADMIN_NAV: NavGruppe[] = [
  {
    titel: 'Verwaltung',
    eintraege: [
      { label: 'Nutzer', pfad: '/admin/nutzer', symbol: '☺' },
      { label: 'Monitoring', pfad: '/admin/monitoring', symbol: '◔' },
      { label: 'Audit-Log', pfad: '/admin/audit', symbol: '▤' },
    ],
  },
];

export interface HuelleProps {
  bereich: 'campus' | 'ausbilder' | 'admin';
  /** Pfad, der in der Navigation als aktiv markiert wird. */
  aktivPfad: string;
  /** Titel in der mobilen Kopfzeile. */
  titel: string;
  /** Zeigt einen Zurueck-Pfeil statt des Titels. */
  zurueck?: boolean;
  kopfAktionen?: React.ReactNode;
  children: React.ReactNode;
}

const NAV = { campus: CAMPUS_NAV, ausbilder: AUSBILDER_NAV, admin: ADMIN_NAV };
const NUTZER = {
  campus: { name: 'Amina Yildiz', rolle: 'Teilnehmerin' },
  ausbilder: { name: 'Thomas Berger', rolle: 'Ausbilder' },
  admin: { name: 'Petra Klein', rolle: 'Verwaltung' },
};

/**
 * App-Shell fuer die Designvorschau: dieselbe Navigation wie in der App,
 * nur mit fest gesetztem aktivem Pfad statt echtem Routing.
 */
export function Huelle({
  bereich,
  aktivPfad,
  titel,
  zurueck,
  kopfAktionen,
  children,
}: HuelleProps) {
  const nutzer = NUTZER[bereich];
  const dicht = bereich !== 'campus';

  return (
    <div className="flex min-h-screen bg-bg">
      <SeitenNavigation
        gruppen={NAV[bereich]}
        nutzerName={nutzer.name}
        nutzerRolle={nutzer.rolle}
        aktivPfad={aktivPfad}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Kopfzeile: mobil 56px mit Titel, ab md 64px mit Brotkrumen */}
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-border bg-surface/95 px-4 backdrop-blur md:h-16 md:px-8">
          <div className="flex min-w-0 items-center gap-2">
            {zurueck && (
              <span aria-hidden="true" className="text-h4 text-fg-muted rtl:-scale-x-100">
                ←
              </span>
            )}
            <p className="truncate text-label font-semibold md:text-body-sm md:font-normal md:text-fg-muted">
              {titel}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {kopfAktionen}
            <span className="md:hidden">
              <Avatar name={nutzer.name} groesse={32} />
            </span>
          </div>
        </header>

        <main
          id="inhalt"
          className={cn(
            'flex-1 px-4 pb-24 pt-5 md:px-8 md:pb-10 md:pt-8',
            dicht ? 'mx-auto w-full max-w-daten' : 'mx-auto w-full max-w-campus',
          )}
        >
          {children}
        </main>
      </div>

      {/* Ab md uebernimmt die Seitennavigation — beide gleichzeitig waere doppelt. */}
      {bereich === 'campus' && <BottomNav aktivPfad={aktivPfad} className="md:hidden" />}
    </div>
  );
}
