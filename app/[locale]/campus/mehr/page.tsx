import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Card } from '@bze/ui';
import { LogoutButton } from '../_components/logout-button';

export default async function Mehr({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('campus');
  const links: [string, string][] = [
    [t('profil'), `/${locale}/campus/profil`],
    [t('datenschutz'), `/${locale}/datenschutz`],
    [t('impressum'), `/${locale}/impressum`],
  ];
  return (
    <main className="mx-auto max-w-2xl space-y-4 p-4">
      <h1 className="pt-2 text-2xl font-extrabold">{t('mehr')}</h1>
      <Card className="divide-y divide-border">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className="block py-3 first:pt-0 last:pb-0">{label}</Link>
        ))}
      </Card>
      <LogoutButton />
    </main>
  );
}
