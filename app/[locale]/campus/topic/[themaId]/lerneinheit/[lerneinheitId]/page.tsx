import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { createServerSupabase } from '@bze/db/server';
// Relativer Import statt Alias: packages/ui/mdx ist kein eigenes pnpm-Workspace-Paket.
import { renderFachkundeMdx } from '../../../../../../../packages/ui/mdx';
import { holeLerneinheit, holeLerneinheitenFuerThema, holeFortschritt, holeAktuellenNutzerId } from '../../../_lib/queries';
import { leseDemoQuelltext, listeDemoLerneinheiten } from '../../../_lib/content-fallback';
import { teileMinuten } from '../../../_lib/format';
import { Lesesitzung } from '../../../_components/lesesitzung';
import { Kapitelleiste } from '../../../_components/kapitelleiste';
import { Fussleiste } from '../../../_components/fussleiste';
import { Quellenliste } from '../../../_components/quellenliste';

const UUID_MUSTER = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Lerneinheit-Lesen-Bildschirm (SPEC §6.2.6): Kapitel-Fortschrittsleiste unter der Kopfzeile,
 * MDX-Inhalt über die volle Breite, Quellenangaben am Ende, feste Fußleiste mit
 * Daumen hoch/runter und grünem "Weiter". Auf DB-Ebene entspricht ein Kapitel/Abschnitt einer
 * H2-Überschrift im MDX (`extractKapitel`, siehe packages/ui/mdx/headings.ts) und damit einem
 * `abschnitt_index` in `lerneinheit_fortschritt`.
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
    // Demo-/Vorschau-Modus: lerneinheitId ist der Dateiname unter content/fachkunde/ (siehe
    // _lib/content-fallback.ts). Es wird kein Fortschritt gespeichert.
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
      <Kapitelleiste />
      <main className="mx-auto max-w-2xl px-4 pb-32 pt-4">
        <header className="mb-4">
          <h1 className="mb-1 text-2xl font-extrabold text-fg">{frontmatter.titel}</h1>
          <p className="text-xs text-fg-muted">
            {stunden > 0 ? t('zeit.stundenMinuten', { stunden, minuten }) : t('zeit.minuten', { minuten })}
          </p>
        </header>

        {/* MDX-Inhalt über die volle Breite (SPEC §6.2.6) */}
        <article>{inhalt}</article>

        <Quellenliste quellen={frontmatter.quellen} />
      </main>
      <Fussleiste />
    </Lesesitzung>
  );
}
