import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { createServerSupabase } from '@bze/db/server';
import { renderFachkundeMdx } from '../../../../../../../packages/ui/mdx';
import { holeLerneinheit, holeLerneinheitenFuerThema, holeFortschritt, holeAktuellenNutzerId } from '../../../_lib/queries';
import { leseDemoQuelltext, listeDemoLerneinheiten } from '../../../_lib/content-fallback';
import { teileMinuten } from '../../../_lib/format';
import { Lesesitzung } from '../../../_components/lesesitzung';
import { Fussleiste } from '../../../_components/fussleiste';
import { Quellenliste } from '../../../_components/quellenliste';
import { LerneinheitKopfzeile } from '../../../_components/lerneinheit-kopfzeile';
import { FreigabeHinweis } from '../../../_components/freigabe-hinweis';
import { PruefungsrelevanzBadge } from '../../../_components/pruefungsrelevanz-badge';

const UUID_MUSTER = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Lerneinheit-Lesen (Figma Mobile / Lerneinheit): Zurueck, Dauer, Pruefungsrelevanz, MDX.
 */
export default async function LerneinheitSeite({
  params,
}: {
  params: Promise<{ locale: string; themaId: string; lerneinheitId: string }>;
}) {
  const { locale, themaId, lerneinheitId } = await params;
  const t = await getTranslations('topic');
  const supabase = await createServerSupabase();
  const userId = await holeAktuellenNutzerId(supabase);

  const istDbId = UUID_MUSTER.test(lerneinheitId);

  let quelltext: string | null = null;
  let demoModus = true;
  let naechsteHref = `/${locale}/campus/topic/${themaId}`;
  let initialGelesenIndizes: number[] = [];
  let initialBewertung: 1 | -1 | null = null;

  if (istDbId) {
    const lerneinheit = await holeLerneinheit(supabase, lerneinheitId);
    if (!lerneinheit || !lerneinheit.inhalt_mdx) notFound();
    quelltext = lerneinheit.inhalt_mdx;
    demoModus = false;

    const [fortschritt, geschwister] = await Promise.all([
      userId ? holeFortschritt(supabase, userId, lerneinheitId) : Promise.resolve([]),
      holeLerneinheitenFuerThema(supabase, lerneinheit.thema_id),
    ]);
    initialGelesenIndizes = fortschritt.filter((z) => z.gelesen_am !== null).map((z) => z.abschnitt_index);
    const eigeneBewertung = fortschritt.find((z) => z.bewertung !== null)?.bewertung;
    initialBewertung = eigeneBewertung === 1 || eigeneBewertung === -1 ? eigeneBewertung : null;

    const eigenerIndex = geschwister.findIndex((g) => g.id === lerneinheitId);
    const naechste = eigenerIndex >= 0 ? geschwister[eigenerIndex + 1] : undefined;
    naechsteHref = naechste ? `/${locale}/campus/topic/${themaId}/lerneinheit/${naechste.id}` : naechsteHref;
  } else {
    quelltext = await leseDemoQuelltext(lerneinheitId);
    if (!quelltext) notFound();
  }

  const { inhalt, frontmatter, kapitel } = await renderFachkundeMdx(quelltext);

  if (!istDbId) {
    const geschwister = await listeDemoLerneinheiten(frontmatter.thema_code);
    const eigenerIndex = geschwister.findIndex((g) => g.slug === lerneinheitId);
    const naechste = eigenerIndex >= 0 ? geschwister[eigenerIndex + 1] : undefined;
    naechsteHref = naechste
      ? `/${locale}/campus/topic/${themaId}/lerneinheit/${naechste.slug}`
      : `/${locale}/campus/topic/${themaId}`;
  }

  const { stunden, minuten } = teileMinuten(frontmatter.lesedauer_minuten);
  const lesedauerLabel =
    stunden > 0 ? t('zeit.stundenMinuten', { stunden, minuten }) : t('zeit.minuten', { minuten });
  const pruefungsLabel = t('lerneinheit.pruefungsrelevanz', {
    stufe: t(`lerneinheit.pruefungsrelevanzStufen.${frontmatter.pruefungsrelevanz}`),
  });

  return (
    <Lesesitzung
      lerneinheitId={lerneinheitId}
      kapitel={kapitel}
      initialGelesenIndizes={initialGelesenIndizes}
      initialBewertung={initialBewertung}
      lesedauerMinuten={frontmatter.lesedauer_minuten}
      demoModus={demoModus}
      naechsteHref={naechsteHref}
    >
      <main className="mx-auto max-w-md bg-bg px-4 pb-32">
        <LerneinheitKopfzeile
          zurueckHref={`/${locale}/campus/topic/${themaId}`}
          zurueckLabel={t('lerneinheit.zurueckLernpfad')}
          lesedauerLabel={lesedauerLabel}
        />

        <header className="mb-3 flex flex-col gap-2">
          <PruefungsrelevanzBadge label={pruefungsLabel} />
          <h1 className="text-[20px] font-semibold leading-7 text-fg">{frontmatter.titel}</h1>
        </header>

        <FreigabeHinweis frontmatter={frontmatter} />

        <article className="flex flex-col gap-3">{inhalt}</article>

        <Quellenliste quellen={frontmatter.quellen} />
      </main>
      <Fussleiste />
    </Lesesitzung>
  );
}
