import { getTranslations } from 'next-intl/server';
import { createServerSupabase } from '@bze/db/server';
import { Card } from '@bze/ui';
import { filtereFragenGruppe, ladeFragenUebersicht, sortiereFragenQueue } from '../../_lib/fragen';
import { FragenRunner } from './fragen-runner';

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
    supabase
      .from('fragen')
      .select('id')
      .eq('status', 'freigegeben')
      .eq('typ', 'freitext')
      .eq('thema_id', themaId),
    ladeFragenUebersicht(user?.id ?? null, themaId),
  ]);

  const queue = sortiereFragenQueue(filtereFragenGruppe(uebersicht.items, 'alle'));
  const freitextAnzahl = freitextRoh?.length ?? 0;

  return (
    <main className="mx-auto flex min-h-full max-w-2xl flex-col gap-3 p-3 sm:p-4">
      <header className="shrink-0 pt-1">
        <p className="text-xs text-fg-muted">{t('themaLabel')}</p>
        <h1 className="text-xl font-extrabold sm:text-2xl">{thema?.bezeichnung ?? '-'}</h1>
      </header>

      {queue.length === 0 ? (
        <Card>
          <p className="font-semibold">{t('leer.titel')}</p>
          <p className="mt-1 text-fg-muted">
            {uebersicht.items.length === 0 ? t('leer.keineFreigegeben') : t('leer.allesFertig')}
          </p>
          {freitextAnzahl > 0 && (
            <p className="mt-3 text-sm text-fg-muted">{t('freitextHinweis', { n: freitextAnzahl })}</p>
          )}
        </Card>
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
