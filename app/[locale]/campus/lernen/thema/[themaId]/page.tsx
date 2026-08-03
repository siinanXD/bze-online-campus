import { getTranslations } from 'next-intl/server';
import { createServerSupabase } from '@bze/db/server';
import { filtereFragenGruppe, ladeFragenUebersicht, sortiereFragenQueue } from '../../_lib/fragen';
import { FragenRunner } from './fragen-runner';

/**
 * Themenbezogene Fragenrunde im Figma-Mobile-Look.
 */
export default async function ThemaLernen({
  params,
}: {
  params: Promise<{ locale: string; themaId: string }>;
}) {
  const { locale, themaId } = await params;
  const t = await getTranslations('lernen');
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: thema }, { data: freitextRoh }, uebersicht] = await Promise.all([
    supabase.from('themen').select('bezeichnung').eq('id', themaId).maybeSingle(),
    supabase.from('fragen').select('id').eq('typ', 'freitext').eq('thema_id', themaId),
    ladeFragenUebersicht(user?.id ?? null, themaId),
  ]);

  const queue = sortiereFragenQueue(filtereFragenGruppe(uebersicht.items, 'alle'));
  const freitextAnzahl = freitextRoh?.length ?? 0;

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col gap-3 px-5 pb-6 pt-3">
      <header>
        <p className="text-[11px] font-bold uppercase tracking-wide text-primary">{t('themaLabel')}</p>
        <h1 className="mt-1 text-[20px] font-extrabold text-fg">{thema?.bezeichnung ?? '-'}</h1>
      </header>

      {queue.length === 0 ? (
        <div className="rounded-[16px] border border-border bg-surface p-4">
          <p className="text-[15px] font-bold text-fg">{t('leer.titel')}</p>
          <p className="mt-1 text-[14px] text-fg-muted">
            {uebersicht.items.length === 0 ? t('leer.keineFreigegeben') : t('leer.allesFertig')}
          </p>
          {freitextAnzahl > 0 ? (
            <p className="mt-3 text-[13px] text-fg-muted">{t('freitextHinweis', { n: freitextAnzahl })}</p>
          ) : null}
        </div>
      ) : (
        <section className="min-h-0 flex-1">
          <FragenRunner
            queue={queue}
            backHref={`/${locale}/campus/lernen`}
            sessionLabel={thema?.bezeichnung ?? undefined}
          />
        </section>
      )}
    </main>
  );
}
