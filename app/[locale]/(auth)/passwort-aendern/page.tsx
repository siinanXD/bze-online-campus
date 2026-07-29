import { getTranslations } from 'next-intl/server';
import { Card } from '@bze/ui';
import { PasswortForm } from './passwort-form';

export default async function PasswortAendernSeite({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('auth.passwortAendern');

  return (
    <>
      <header className="text-center">
        <h1 className="text-2xl font-extrabold">{t('titel')}</h1>
        <p className="mt-1 text-fg-muted">{t('hinweis')}</p>
      </header>
      <Card>
        <PasswortForm locale={locale} />
      </Card>
    </>
  );
}
