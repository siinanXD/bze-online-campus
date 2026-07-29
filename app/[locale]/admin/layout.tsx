import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Card } from '@bze/ui';
import { ladeAdminSitzung } from './_lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('admin');
  const sitzung = await ladeAdminSitzung();

  if (!sitzung) {
    return (
      <main className="mx-auto max-w-md p-4 pt-10">
        <Card>
          <h1 className="text-lg font-bold">{t('zugriff.titel')}</h1>
          <p className="mt-2 text-sm text-fg-muted">{t('zugriff.hinweis')}</p>
        </Card>
      </main>
    );
  }

  const istAdmin = sitzung.profil.rolle === 'admin';

  return (
    <div className="mx-auto max-w-6xl p-4 pb-24">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-2 pt-2">
        <div>
          <p className="text-xs text-fg-muted">{t('titel')}</p>
          <h1 className="text-2xl font-extrabold">{t('untertitel')}</h1>
        </div>
        <p className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-fg-muted">
          {sitzung.profil.vorname} {sitzung.profil.nachname} ·{' '}
          <span className="font-semibold text-fg">{t(`rollen.${sitzung.profil.rolle}`)}</span>
        </p>
      </header>

      {!istAdmin && (
        <p className="mb-4 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-fg-muted">
          {t('zugriff.eingeschraenktVerwaltung')}
        </p>
      )}

      {/* Eine Spalte mobil, ab Tablet Seitenleiste + Inhalt zweispaltig (Spec §7). */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_minmax(0,1fr)] md:items-start">
        <nav
          aria-label={t('nav.beschriftung')}
          className="flex gap-2 overflow-x-auto border-b border-border pb-2 md:flex-col md:overflow-visible md:border-b-0 md:border-e md:pb-0 md:pe-4"
        >
          <Link
            href={`/${locale}/admin/nutzer`}
            className="touchable inline-flex items-center whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-semibold text-fg hover:bg-surface"
          >
            {t('nav.nutzerverwaltung')}
          </Link>
          <Link
            href={`/${locale}/admin/audit`}
            className="touchable inline-flex items-center whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-semibold text-fg hover:bg-surface"
          >
            {t('nav.auditLog')}
          </Link>
          <Link
            href={`/${locale}/admin/monitoring`}
            className="touchable inline-flex items-center whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-semibold text-fg hover:bg-surface"
          >
            {t('nav.monitoring')}
          </Link>
        </nav>

        <div className="min-w-0 space-y-4">{children}</div>
      </div>
    </div>
  );
}
