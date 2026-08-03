import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { LogoutButton } from '../_components/logout-button';

/**
 * Mehr-Menü im Figma-Mobile-Look.
 */
export default async function Mehr({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('campus');
  const links: [string, string][] = [
    [t('fortschritt'), `/${locale}/campus/fortschritt`],
    [t('profil'), `/${locale}/campus/profil`],
    [t('datenschutz'), `/${locale}/datenschutz`],
    [t('impressum'), `/${locale}/impressum`],
  ];

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col gap-4 px-5 pb-6 pt-3">
      <h1 className="text-[22px] font-extrabold leading-7 text-fg">{t('mehr')}</h1>

      <nav className="overflow-hidden rounded-[16px] border border-border bg-surface" aria-label={t('mehr')}>
        <ul className="divide-y divide-border">
          {links.map(([label, href]) => (
            <li key={href}>
              <Link
                href={href}
                className="touchable flex min-h-12 items-center justify-between gap-3 px-4 py-3 text-[15px] font-semibold text-fg"
              >
                <span>{label}</span>
                <span className="text-fg-subtle" aria-hidden>
                  ›
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="rounded-[16px] border border-border bg-surface p-4">
        <LogoutButton />
      </div>
    </main>
  );
}
