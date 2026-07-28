import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { LogoutButton } from '../campus/_components/logout-button';

export default async function AusbilderLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('ausbilder');
  const nav: [string, string][] = [
    [t('nav.cockpit'), `/${locale}/ausbilder`],
    [t('nav.kohorte'), `/${locale}/ausbilder/kohorte`],
    [t('nav.review'), `/${locale}/ausbilder/review`],
  ];

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <p className="text-sm font-extrabold text-fg">{t('cockpit')}</p>
          <nav className="flex flex-wrap items-center gap-1" aria-label={t('nav.label')}>
            {nav.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="touchable inline-flex min-h-12 items-center rounded-lg px-3 text-sm font-semibold text-fg hover:bg-accent/10 hover:text-accent"
              >
                {label}
              </Link>
            ))}
            <LogoutButton />
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
