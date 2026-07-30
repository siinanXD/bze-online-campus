'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Avatar, cn } from '@bze/ui';

export interface NavGruppe {
  /** Ueberschrift der Gruppe, bereits uebersetzt. */
  titel?: string;
  eintraege: {
    label: string;
    pfad: string;
    exakt?: boolean;
    symbol?: React.ReactNode;
  }[];
}

export interface SeitenNavigationProps {
  gruppen: NavGruppe[];
  nutzerName: string;
  nutzerRolle: string;
  /** Ueberschreibt den aktiven Pfad. Nur fuer die Designvorschau. */
  aktivPfad?: string;
  className?: string;
}

/**
 * Seitennavigation ab md. Auf Mobil uebernimmt die BottomNav.
 * Der aktive Eintrag traegt Farbe, eine Leiste am Anfang und aria-current —
 * Farbe ist nie alleiniger Traeger.
 */
export function SeitenNavigation({
  gruppen,
  nutzerName,
  nutzerRolle,
  aktivPfad,
  className,
}: SeitenNavigationProps) {
  const echterPfad = usePathname() ?? '';
  const pathname = aktivPfad ?? echterPfad;
  const locale = useLocale();
  const t = useTranslations('shell');
  const tApp = useTranslations('app');

  return (
    <nav
      aria-label={t('nav.ariaLabel')}
      className={cn(
        'hidden shrink-0 flex-col border-e border-border bg-bg-subtle md:sticky md:top-0 md:flex md:h-screen md:w-60 lg:w-[264px]',
        className,
      )}
    >
      <div className="border-b border-border px-5 py-4">
        <p className="text-caption text-fg-muted">{tApp('traeger')}</p>
        <p className="text-h4">{tApp('name')}</p>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {gruppen.map((gruppe, i) => (
          <div key={gruppe.titel ?? i} className="space-y-1">
            {gruppe.titel && (
              <p className="px-3 pb-1 text-overline uppercase text-fg-subtle">
                {gruppe.titel}
              </p>
            )}
            <ul className="space-y-0.5">
              {gruppe.eintraege.map((e) => {
                const href = `/${locale}${e.pfad}`;
                const aktiv = e.exakt
                  ? pathname === href
                  : pathname === href || pathname.startsWith(`${href}/`);

                return (
                  <li key={e.pfad}>
                    <Link
                      href={href}
                      aria-current={aktiv ? 'page' : undefined}
                      className={cn(
                        'relative flex min-h-[40px] items-center gap-2.5 rounded-md px-3 text-body-sm transition-colors',
                        aktiv
                          ? 'bg-primary-subtle font-semibold text-primary'
                          : 'text-fg-muted hover:bg-surface hover:text-fg',
                      )}
                    >
                      {aktiv && (
                        <span
                          aria-hidden="true"
                          className="absolute inset-y-1 start-0 w-[3px] rounded-full bg-primary"
                        />
                      )}
                      {e.symbol && (
                        <span aria-hidden="true" className="w-4 text-center">
                          {e.symbol}
                        </span>
                      )}
                      <span className="truncate">{e.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 border-t border-border px-4 py-3">
        <Avatar name={nutzerName} groesse={32} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-body-sm font-medium">{nutzerName}</p>
          <p className="truncate text-caption text-fg-muted">{nutzerRolle}</p>
        </div>
      </div>
    </nav>
  );
}
