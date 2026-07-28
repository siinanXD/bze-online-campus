import * as React from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ProgressRing } from '@bze/ui';
import { ProfilIcon } from './icons';

export interface HeaderProps {
  /** Gesamtfortschritt in Prozent (0–100). Default 0. */
  value?: number;
  /** Ziel des Profilzugangs. Default: `/${locale}/campus/profil`. */
  profilHref?: string;
}

/**
 * Kopfzeile des App-Shells (SPEC §6.1): Trägername, Gesamtfortschrittsring
 * mit Prozentzahl (@bze/ui ProgressRing) und Profilzugang.
 */
export function Header({ value = 0, profilHref }: HeaderProps) {
  const t = useTranslations();
  const locale = useLocale();
  const href = profilHref ?? `/${locale}/campus/profil`;
  const wert = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-border bg-surface/95 px-4 py-2.5 backdrop-blur">
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-muted">{t('app.traeger')}</p>
        <p className="truncate text-sm font-bold text-fg">{t('app.name')}</p>
      </div>
      <div className="flex items-center gap-3">
        <ProgressRing value={wert} size={44} label={t('shell.header.fortschrittLabel', { wert })} />
        <Link
          href={href}
          aria-label={t('shell.header.profil')}
          className="touchable inline-flex items-center justify-center rounded-full border border-border bg-surface text-fg transition hover:border-accent hover:text-accent"
        >
          <ProfilIcon />
        </Link>
      </div>
    </header>
  );
}
