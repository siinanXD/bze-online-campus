import { getTranslations } from 'next-intl/server';
import { Card } from '@bze/ui';
import { SprachwahlForm } from './sprachwahl-form';

export default async function SprachwahlSeite({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('auth.sprachwahl');

  return (
    <>
      <header className="text-center">
        <h1 className="text-2xl font-extrabold">{t('titel')}</h1>
        <p className="mt-1 text-fg-muted">{t('hinweis')}</p>
      </header>
      <Card>
        <SprachwahlForm locale={locale} />
      </Card>
    </>
  );
}
