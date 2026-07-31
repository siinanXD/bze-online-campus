import { getTranslations } from 'next-intl/server';
import { Card } from '@bze/ui';
import { ladeAdminSitzung } from '../../_lib/auth';
import { ContentNav } from '../_components/content-nav';
import { ladeGeneratorOptionen } from '../_lib/queries';
import { ladeGeneratorKonfiguration } from './_lib/config';
import { MockGeneratorClient } from './mock-generator-client';

export const dynamic = 'force-dynamic';

/**
 * Admin-Seite fuer den lokalen Mock-Content-Generator.
 */
export default async function KIContentGeneratorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('admin.content.generator');
  const sitzung = await ladeAdminSitzung();
  if (!sitzung) return null;
  const [optionen] = await Promise.all([ladeGeneratorOptionen(sitzung.supabase)]);
  const config = ladeGeneratorKonfiguration();

  return (
    <div className="space-y-4">
      <ContentNav locale={locale} />
      <div>
        <h2 className="text-lg font-bold">{t('titel')}</h2>
        <p className="text-sm text-fg-muted">{t('hinweis')}</p>
      </div>
      <Card>
        <MockGeneratorClient optionen={optionen} config={config} />
      </Card>
    </div>
  );
}
