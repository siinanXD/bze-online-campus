import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Button, Card } from '@bze/ui';
import { ladeAdminSitzung } from '../_lib/auth';
import { ContentNav } from './_components/content-nav';
import { ladeContentDashboard } from './_lib/queries';

export const dynamic = 'force-dynamic';

const KENNZAHLEN = [
  'fachbereiche',
  'themen',
  'unterthemen',
  'lernziele',
  'erklaerungen',
  'fragen',
  'lernkarten',
  'praxisfaelle',
  'rechenaufgaben',
  'quizze',
  'demoInhalte',
  'entwuerfe',
  'freigegeben',
  'kiGeneriert',
  'manuell',
] as const;

/**
 * Content-Dashboard der Admin-Verwaltung.
 */
export default async function ContentDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('admin.content');
  const sitzung = await ladeAdminSitzung();
  if (!sitzung) return null;
  const kennzahlen = await ladeContentDashboard(sitzung.supabase);

  return (
    <div className="space-y-4">
      <ContentNav locale={locale} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">{t('dashboard.titel')}</h2>
          <p className="text-sm text-fg-muted">{t('dashboard.hinweis')}</p>
        </div>
        <Link href={`/${locale}/admin/content/inhalte`}>
          <Button>{t('dashboard.zurListe')}</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {KENNZAHLEN.map((key) => (
          <Card key={key}>
            <p className="text-xs font-semibold uppercase tracking-wide text-fg-muted">{t(`kennzahlen.${key}`)}</p>
            <p className="zahlen mt-2 text-2xl font-extrabold">{kennzahlen[key]}</p>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="text-sm font-bold uppercase tracking-wide text-primary">{t('dashboard.naechsteSchritteTitel')}</h3>
        <p className="mt-2 text-sm text-fg-muted">{t('dashboard.naechsteSchritteText')}</p>
      </Card>
    </div>
  );
}
