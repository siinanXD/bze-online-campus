import { getTranslations } from 'next-intl/server';
import { Card } from '@bze/ui';
import { ladeAdminSitzung } from '../../_lib/auth';
import { ContentNav } from '../_components/content-nav';
import { ladeContentListe, ladeContentOptionen, parseContentFilter } from '../_lib/queries';
import { ContentFilter } from './filter';
import { ContentListe } from './content-liste';

export const dynamic = 'force-dynamic';

/**
 * Paginierte Content-Liste mit Suche, Filter und Bulk-Aktionen.
 */
export default async function ContentListePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const rawFilter = await searchParams;
  const t = await getTranslations('admin.content');
  const sitzung = await ladeAdminSitzung();
  if (!sitzung) return null;

  const filter = parseContentFilter(rawFilter);
  const [optionen, liste] = await Promise.all([
    ladeContentOptionen(sitzung.supabase),
    ladeContentListe(sitzung.supabase, filter),
  ]);

  return (
    <div className="space-y-4">
      <ContentNav locale={locale} />
      <div>
        <h2 className="text-lg font-bold">{t('liste.titel')}</h2>
        <p className="text-sm text-fg-muted">{t('liste.hinweis')}</p>
      </div>
      <Card>
        <ContentFilter fachbereiche={optionen.fachbereiche} themen={optionen.themen} />
      </Card>
      <ContentListe liste={liste} />
    </div>
  );
}
