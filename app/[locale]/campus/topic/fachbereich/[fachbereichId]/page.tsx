import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { createServerSupabase } from '@bze/db/server';
import { LeerZustand } from '@bze/ui';
import { ladeFachbereich, ladeThemenFuerFachbereich } from '../../_lib/content-queries';
import { ZurueckIcon } from '@/components/shell/icons';

/**
 * Themen eines Fachbereichs im Figma-Mobile-Look.
 */
export default async function FachbereichSeite({
  params,
}: {
  params: Promise<{ locale: string; fachbereichId: string }>;
}) {
  const { locale, fachbereichId } = await params;
  const t = await getTranslations('topic.content');
  const supabase = await createServerSupabase();
  const [fachbereich, themen] = await Promise.all([
    ladeFachbereich(supabase, fachbereichId),
    ladeThemenFuerFachbereich(supabase, fachbereichId),
  ]);
  if (!fachbereich) notFound();

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col gap-4 px-5 pb-6 pt-3">
      <header>
        <Link
          href={`/${locale}/campus/topic`}
          className="touchable inline-flex min-h-10 items-center gap-1 text-[16px] font-semibold text-primary"
        >
          <ZurueckIcon className="h-5 w-5" />
          <span>{t('navigation.zurFachkunde')}</span>
        </Link>
        <h1 className="mt-2 text-[22px] font-extrabold text-fg">{fachbereich.bezeichnung}</h1>
        {fachbereich.beschreibung ? (
          <p className="mt-1 text-[14px] text-fg-muted">{fachbereich.beschreibung}</p>
        ) : null}
      </header>

      {themen.length === 0 ? (
        <LeerZustand titel={t('leer.themenTitel')} text={t('leer.themenText')} />
      ) : (
        <ul className="flex flex-col gap-3">
          {themen.map((thema) => (
            <li key={thema.id}>
              <Link
                href={`/${locale}/campus/topic/${thema.id}`}
                className="touchable flex items-center gap-3 rounded-[16px] border border-border bg-surface p-4"
              >
                <div className="min-w-0 flex-1">
                  <h2 className="text-[15px] font-bold text-fg">{thema.bezeichnung}</h2>
                  {thema.beschreibung ? (
                    <p className="mt-1 text-[13px] text-fg-muted">{thema.beschreibung}</p>
                  ) : null}
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
