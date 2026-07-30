import { getTranslations } from 'next-intl/server';
import { Card, FehlerZustand, Seitenkopf } from '@bze/ui';
import { ContentNav } from '../_components/content-nav';
import { ladeAdminSitzung } from '../../_lib/auth';
import { ladeWissensdokumentListe, parseWissensdokumentFilter } from './_lib/queries';
import { WissensdatenbankClient } from './wissensdatenbank-client';

/**
 * Admin-Seite fuer die optionale Wissensdatenbank.
 */
export default async function WissensdatenbankPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ locale }, suche] = await Promise.all([params, searchParams]);
  const t = await getTranslations('admin.content.wissensdatenbank');
  const sitzung = await ladeAdminSitzung();
  if (!sitzung) {
    return (
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        <FehlerZustand titel={t('keinZugriffTitel')} text={t('keinZugriffText')} />
      </main>
    );
  }

  const filter = parseWissensdokumentFilter(suche);
  const liste = await ladeWissensdokumentListe(sitzung.supabase, filter);

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
      <Seitenkopf titel={t('titel')} beschreibung={t('beschreibung')} />
      <ContentNav locale={locale} />
      <Card className="border-status-offen/40">
        <p className="text-sm font-semibold">{t('ragHinweisTitel')}</p>
        <p className="mt-1 text-sm text-fg-muted">{t('ragHinweisText')}</p>
      </Card>
      <WissensdatenbankClient liste={liste} filter={filter} />
    </main>
  );
}
