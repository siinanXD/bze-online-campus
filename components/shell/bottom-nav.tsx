'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@bze/ui';
import {
  BerichtIcon,
  LernenIcon,
  MehrIcon,
  PruefungIcon,
  StartIcon,
  type ShellIconProps,
} from './icons';

export interface BottomNavProps {
  /**
   * Steuert, ob der Tab „Bericht" (Ausbildungsnachweis) angezeigt wird.
   * Entspricht `flag_berichtsheft` aus SPEC §6.1. Default: aktiv.
   */
  berichtsheftAktiv?: boolean;
  className?: string;
}

interface NavItem {
  key: 'start' | 'lernen' | 'pruefung' | 'bericht' | 'mehr';
  pfad: string;
  exakt?: boolean;
  Icon: (props: ShellIconProps) => React.ReactElement;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'start', pfad: '/campus', exakt: true, Icon: StartIcon },
  { key: 'lernen', pfad: '/campus/lernen', Icon: LernenIcon },
  { key: 'pruefung', pfad: '/campus/pruefung', Icon: PruefungIcon },
  { key: 'bericht', pfad: '/campus/berichtsheft', Icon: BerichtIcon },
  { key: 'mehr', pfad: '/campus/mehr', Icon: MehrIcon },
];

/**
 * Untere Tableiste mit fünf Zielen (SPEC §6.1): Start, Lernen, Prüfung, Bericht, Mehr.
 * Client-Component, fixiert unten, aktiver Tab über usePathname + aria-current.
 * Farbe ist nie alleiniger Träger: aktiver Tab erhält zusätzlich Fettschrift,
 * ein kräftigeres Icon und `aria-current="page"`.
 */
export function BottomNav({ berichtsheftAktiv = true, className }: BottomNavProps) {
  const pathname = usePathname() ?? '';
  const locale = useLocale();
  const t = useTranslations('shell.nav');

  const items = NAV_ITEMS.filter((item) => item.key !== 'bericht' || berichtsheftAktiv);

  return (
    <nav
      aria-label={t('ariaLabel')}
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 backdrop-blur',
        'pb-[max(env(safe-area-inset-bottom),0px)]',
        className,
      )}
    >
      <ul
        className="mx-auto grid max-w-2xl"
        style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
      >
        {items.map(({ key, pfad, exakt, Icon }) => {
          const href = `/${locale}${pfad}`;
          const aktiv = exakt ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={key}>
              <Link
                href={href}
                aria-current={aktiv ? 'page' : undefined}
                className={cn(
                  'touchable flex min-h-[48px] flex-col items-center justify-center gap-0.5 px-1 py-2 text-[11px] leading-tight transition',
                  aktiv ? 'font-bold text-primary' : 'font-medium text-fg-muted hover:text-fg',
                )}
              >
                <Icon active={aktiv} />
                <span>{t(key)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
