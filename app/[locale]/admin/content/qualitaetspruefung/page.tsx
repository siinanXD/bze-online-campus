import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Card } from '@bze/ui';
import { ladeAdminSitzung } from '../../_lib/auth';
import { ContentNav } from '../_components/content-nav';
import { ladeQualitaetsUebersicht, parseQualitaetsFilter } from '../_lib/queries';
import { QualitaetsUebersichtClient } from './qualitaets-uebersicht-client';

export const dynamic = 'force-dynamic';

/**
 * Admin-Seite fuer die informative Qualitaetspruefung generierter Inhalte.
 */
export default async function QualitaetspruefungPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const rawFilter = await searchParams;
  const t = await getTranslations('admin.content.qualitaet');
  const sitzung = await ladeAdminSitzung();
  if (!sitzung) return null;
  const filter = parseQualitaetsFilter(rawFilter);
  const liste = await ladeQualitaetsUebersicht(sitzung.supabase, filter);

  return (
    <div className="space-y-4">
      <ContentNav locale={locale} />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">{t('titel')}</h2>
          <p className="text-sm text-fg-muted">{t('hinweis')}</p>
        </div>
        <Link className="text-sm font-semibold text-primary underline" href={`/${locale}/admin/content/inhalte`}>
          {t('zurListe')}
        </Link>
      </div>
      <Card>
        <nav className="flex flex-wrap gap-2" aria-label={t('filter.label')}>
          {(['', 'problematisch', 'pruefen', 'gut', 'ohne'] as const).map((score) => (
            <Link
              key={score || 'alle'}
              href={`/${locale}/admin/content/qualitaetspruefung${score ? `?score=${score}` : ''}`}
              className="touchable rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:bg-bg"
            >
              {score ? t(`filter.${score}`) : t('filter.alle')}
            </Link>
          ))}
        </nav>
      </Card>
      <QualitaetsUebersichtClient liste={liste} />
    </div>
  );
}
