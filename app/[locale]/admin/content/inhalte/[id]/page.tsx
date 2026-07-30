import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Button } from '@bze/ui';
import { ladeAdminSitzung } from '../../../_lib/auth';
import { ContentNav } from '../../_components/content-nav';
import { ladeContentDetail } from '../../_lib/queries';
import { contentIdSchema } from '../../_lib/schemas';
import { ContentDetailClient } from './content-detail-client';

export const dynamic = 'force-dynamic';

/**
 * Detail- und Bearbeitungsseite fuer ein Content-Element.
 */
export default async function ContentDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations('admin.content');
  const sitzung = await ladeAdminSitzung();
  if (!sitzung) return null;
  const geprueft = contentIdSchema.safeParse(id);
  if (!geprueft.success) notFound();

  const detail = await ladeContentDetail(sitzung.supabase, geprueft.data);
  if (!detail) notFound();

  return (
    <div className="space-y-4">
      <ContentNav locale={locale} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-fg-muted">{t('detail.kicker')}</p>
          <h2 className="text-lg font-bold">{detail.titel}</h2>
        </div>
        <Link href={`/${locale}/admin/content/inhalte`}>
          <Button variante="leise">{t('detail.zurListe')}</Button>
        </Link>
      </div>
      <ContentDetailClient content={detail} />
    </div>
  );
}
