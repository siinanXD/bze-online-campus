import * as React from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Card } from '@bze/ui';

const NUTZEN_KEYS = ['fachkunde', 'fragenUeben', 'wochenpruefung', 'berichtsheft'] as const;

/**
 * Landingpage (SPEC §6.5 / §11 AP-04): Trägerauftritt, Nutzenerklärung,
 * Anmeldeeinstieg. Mobile-first, eine Spalte, ab Tablet zweispaltig.
 */
export default function Landingpage() {
  const t = useTranslations('shell.marketing.landing');
  const locale = useLocale();

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-8">
      <section aria-labelledby="hero-titel" className="space-y-4 text-start">
        <h1 id="hero-titel" className="text-2xl font-extrabold text-fg sm:text-3xl">
          {t('heroTitel')}
        </h1>
        <p className="text-base text-muted">{t('heroUntertitel')}</p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href={`/${locale}/login`}
            className="touchable inline-flex items-center justify-center rounded-xl bg-accent px-5 py-3 text-[15px] font-semibold text-accent-fg transition hover:brightness-110"
          >
            {t('ctaEinloggen')}
          </Link>
          <a
            href="#nutzen"
            className="touchable inline-flex items-center justify-center rounded-xl border border-border bg-surface px-5 py-3 text-[15px] font-semibold text-fg transition hover:bg-bg"
          >
            {t('ctaMehrErfahren')}
          </a>
        </div>
      </section>

      <section aria-labelledby="traeger-titel" className="space-y-2 text-start">
        <h2 id="traeger-titel" className="text-lg font-bold text-fg">
          {t('traegerTitel')}
        </h2>
        <p className="text-sm leading-relaxed text-muted">{t('traegerText')}</p>
      </section>

      <section id="nutzen" aria-labelledby="nutzen-titel" className="space-y-4 text-start">
        <h2 id="nutzen-titel" className="text-lg font-bold text-fg">
          {t('nutzenTitel')}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {NUTZEN_KEYS.map((key) => (
            <Card key={key}>
              <h3 className="mb-1.5 text-sm font-bold text-accent">{t(`nutzen.${key}.titel`)}</h3>
              <p className="text-sm text-muted">{t(`nutzen.${key}.text`)}</p>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="einstieg-titel" className="rounded-2xl border border-border bg-surface p-6 text-start">
        <h2 id="einstieg-titel" className="mb-1.5 text-lg font-bold text-fg">
          {t('einstiegTitel')}
        </h2>
        <p className="mb-4 text-sm text-muted">{t('einstiegText')}</p>
        <Link
          href={`/${locale}/login`}
          className="touchable inline-flex items-center justify-center rounded-xl bg-accent px-5 py-3 text-[15px] font-semibold text-accent-fg transition hover:brightness-110"
        >
          {t('ctaEinloggen')}
        </Link>
      </section>
    </div>
  );
}
