import * as React from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

/**
 * Öffentliche Hülle für Landingpage, Impressum und Datenschutz (SPEC §6.5).
 * Bewusst schlank: keine Tableiste, kein Fortschrittsring — das ist erst
 * nach der Anmeldung relevant (siehe components/shell/).
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations();
  const locale = useLocale();
  const jahr = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-surface px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <Link href={`/${locale}`} className="min-w-0 text-start">
            <p className="truncate text-sm font-extrabold text-fg">{t('app.name')}</p>
            <p className="truncate text-xs text-muted">{t('app.traeger')}</p>
          </Link>
          <Link
            href={`/${locale}/login`}
            className="touchable inline-flex items-center justify-center rounded-xl bg-accent px-4 py-3 text-[15px] font-semibold text-accent-fg transition hover:brightness-110"
          >
            {t('common.einloggen')}
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-surface px-4 py-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {jahr} {t('app.traeger')}</p>
          <nav aria-label={t('shell.marketing.footer.ariaLabel')} className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href={`/${locale}/impressum`} className="touchable inline-flex items-center underline-offset-4 hover:text-fg hover:underline">
              {t('shell.marketing.footer.impressum')}
            </Link>
            <Link href={`/${locale}/datenschutz`} className="touchable inline-flex items-center underline-offset-4 hover:text-fg hover:underline">
              {t('shell.marketing.footer.datenschutz')}
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
