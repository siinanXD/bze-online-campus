import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { createServerSupabase } from '@bze/db/server';
import { LeerZustand } from '@bze/ui';
import { ladeFachbereiche } from './_lib/content-queries';
import { ZurueckIcon } from '@/components/shell/icons';

/**
 * Fachkunde-Index im Figma-Mobile-Look.
 */
export default async function FachkundeIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('topic.content');
  const supabase = await createServerSupabase();
  const fachbereiche = await ladeFachbereiche(supabase);

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col gap-4 px-5 pb-6 pt-3">
      <header>
        <Link
          href={`/${locale}/campus/lernen`}
          className="touchable inline-flex min-h-10 items-center gap-1 text-[16px] font-semibold text-primary"
        >
          <ZurueckIcon className="h-5 w-5" />
          <span>Lernen</span>
        </Link>
        <h1 className="mt-2 text-[22px] font-extrabold text-fg">{t('index.titel')}</h1>
        <p className="mt-1 text-[14px] text-fg-muted">{t('index.beschreibung')}</p>
      </header>

      <Link
        href={`/${locale}/campus/topic/PT-MES`}
        className="touchable rounded-[16px] border border-primary-border bg-primary-subtle p-4"
      >
        <p className="text-[15px] font-bold text-fg">01 · Messen und Prüfen</p>
        <p className="mt-1 text-[13px] text-primary">aktuell · Demo-Lernpfad</p>
      </Link>

      {fachbereiche.length === 0 ? (
        <LeerZustand titel={t('leer.fachbereicheTitel')} text={t('leer.fachbereicheText')} />
      ) : (
        <ul className="flex flex-col gap-3">
          {fachbereiche.map((fachbereich) => (
            <li key={fachbereich.id}>
              <Link
                href={`/${locale}/campus/topic/fachbereich/${fachbereich.id}`}
                className="touchable flex items-center gap-3 rounded-[16px] border border-border bg-surface p-4"
              >
                <div className="min-w-0 flex-1">
                  <h2 className="text-[15px] font-bold text-fg">{fachbereich.bezeichnung}</h2>
                  {fachbereich.beschreibung ? (
                    <p className="mt-1 text-[13px] text-fg-muted">{fachbereich.beschreibung}</p>
                  ) : null}
                  <p className="mt-1 text-[12px] font-semibold text-info">
                    {t('index.themenAnzahl', { anzahl: fachbereich.themenAnzahl })}
                  </p>
                </div>
                <span className="text-fg-subtle" aria-hidden>
                  ›
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
