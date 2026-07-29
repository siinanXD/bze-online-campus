import { getTranslations } from 'next-intl/server';
import { Card } from '@bze/ui';
import { LoginForm } from './login-form';

export default async function LoginSeite({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('auth.login');
  const tApp = await getTranslations('app');

  return (
    <>
      <header className="text-center">
        <p className="text-xs text-fg-muted">{tApp('traeger')}</p>
        <h1 className="text-2xl font-extrabold">{t('titel')}</h1>
        <p className="mt-1 text-fg-muted">{t('untertitel')}</p>
      </header>
      <Card>
        <LoginForm locale={locale} />
      </Card>
    </>
  );
}
