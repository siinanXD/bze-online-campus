import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { createServerSupabase } from '@bze/db/server';
import { Card, ProgressRing } from '@bze/ui';
// Relativer Import statt Alias: packages/ui/mdx ist kein eigenes pnpm-Workspace-Paket.
import { extractKapitel } from '../../../../../packages/ui/mdx';
import {
  holeThema,
  holeLerneinheitenFuerThema,
  holeFortschrittFuerLerneinheiten,
  holeAktuellenNutzerId,
  holeFlagVideo,
} from '../_lib/queries';
import { listeDemoLerneinheiten, demoThemaBezeichnung } from '../_lib/content-fallback';
import { anteilProzent, teileMinuten } from '../_lib/format';

const UUID_MUSTER = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Topic-Seite (SPEC §6.2.5): drei Abschnitte untereinander mit eigenem Fortschritt —
 * "Fachkunde lesen" (Lerneinheiten mit Minutenangabe), "Fragen üben", "Unterricht"
 * (ausgeblendet, solange `flag_video` aus ist).
 */
export default async function TopicSeite({
  params,
}: {
  params: Promise<{ locale: string; themaId: string }>;
}) {
  const { locale, themaId } = await params;
  const t = await getTranslations('topic');
  const supabase = await createServerSupabase();
  const userId = await holeAktuellenNutzerId(supabase);

  const thema = UUID_MUSTER.test(themaId) ? await holeThema(supabase, themaId) : null;
  let lerneinheitenListe = thema ? await holeLerneinheitenFuerThema(supabase, thema.id) : [];

  // Solange AP-01/AP-07 noch keine `lerneinheiten`-Zeilen für dieses Thema angelegt haben,
  // zeigt die Seite ersatzweise die Beispiel-Lerneinheiten aus content/fachkunde/ (Demo-Modus).
  const demoModus = lerneinheitenListe.length === 0;
  const themaCode = thema?.code ?? themaId;
  const themaBezeichnung = thema?.bezeichnung ?? demoThemaBezeichnung(themaCode);
  const demoListe = demoModus ? await listeDemoLerneinheiten(themaCode) : [];

  const fortschrittJeLerneinheit = thema
    ? await holeFortschrittFuerLerneinheiten(
        supabase,
        userId,
        lerneinheitenListe.map((l) => l.id),
      )
    : new Map<string, Set<number>>();

  const flagVideo = await holeFlagVideo(supabase, userId);

  type ZeileAnsicht = {
    href: string;
    titel: string;
    lesedauerMinuten: number;
    kapitelGesamt: number;
    kapitelGelesen: number;
  };

  const zeilen: ZeileAnsicht[] = demoModus
    ? demoListe.map((d) => ({
        href: `/${locale}/campus/topic/${themaCode}/lerneinheit/${d.slug}`,
        titel: d.frontmatter.titel,
        lesedauerMinuten: d.frontmatter.lesedauer_minuten,
        kapitelGesamt: 0,
        kapitelGelesen: 0,
      }))
    : lerneinheitenListe.map((l) => {
        const kapitel = extractKapitel(l.inhalt_mdx ?? '');
        const gelesen = fortschrittJeLerneinheit.get(l.id)?.size ?? 0;
        return {
          href: `/${locale}/campus/topic/${themaId}/lerneinheit/${l.id}`,
          titel: l.titel,
          lesedauerMinuten: l.lesedauer_minuten ?? 0,
          kapitelGesamt: kapitel.length,
          kapitelGelesen: Math.min(gelesen, kapitel.length),
        };
      });

  const gesamtKapitel = zeilen.reduce((summe, z) => summe + z.kapitelGesamt, 0);
  const gelesenKapitel = zeilen.reduce((summe, z) => summe + z.kapitelGelesen, 0);
  const fachkundeProzent = anteilProzent(gelesenKapitel, gesamtKapitel);

  return (
    <main className="mx-auto max-w-2xl space-y-4 p-4 pb-8">
      <header className="pt-2">
        <p className="text-xs text-fg-muted">{t('uebersicht.kicker')}</p>
        <h1 className="text-2xl font-extrabold text-fg">{themaBezeichnung}</h1>
      </header>

      {/* Abschnitt 1: Fachkunde lesen */}
      <Card>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-primary">
            {t('abschnitte.fachkundeLesen')}
          </h2>
          {!demoModus && zeilen.length > 0 && <ProgressRing value={fachkundeProzent} size={48} />}
        </div>

        {zeilen.length === 0 ? (
          <p className="text-sm text-fg-muted">{t('fachkundeLesen.leer')}</p>
        ) : (
          <ul className="space-y-2">
            {zeilen.map((zeile) => {
              const { stunden, minuten } = teileMinuten(zeile.lesedauerMinuten);
              return (
                <li key={zeile.href}>
                  <Link
                    href={zeile.href}
                    className="touchable flex items-center justify-between gap-3 rounded-xl border border-border bg-bg px-4 py-3 transition hover:border-primary"
                  >
                    <span className="text-[15px] font-semibold text-fg">{zeile.titel}</span>
                    <span className="whitespace-nowrap text-xs text-fg-muted">
                      {stunden > 0
                        ? t('zeit.stundenMinuten', { stunden, minuten })
                        : t('zeit.minuten', { minuten })}
                      {!demoModus && zeile.kapitelGesamt > 0
                        ? ` · ${t('fachkundeLesen.kapitelFortschritt', {
                            gelesen: zeile.kapitelGelesen,
                            gesamt: zeile.kapitelGesamt,
                          })}`
                        : ''}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
        {demoModus && <p className="mt-3 text-xs text-fg-muted">{t('fachkundeLesen.demoHinweis')}</p>}
      </Card>

      {/* Abschnitt 2: Fragen üben (Bildschirm/Route gehört AP-06, hier nur Einstieg) */}
      <Card>
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-primary">
          {t('abschnitte.fragenUeben')}
        </h2>
        <p className="mb-3 text-sm text-fg-muted">{t('fragenUeben.hinweis')}</p>
        <Link
          href={`/${locale}/campus/lernen/thema/${themaId}`}
          className="touchable inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-[15px] font-semibold text-fg-onPrimary transition hover:brightness-110"
        >
          {t('fragenUeben.cta')}
        </Link>
      </Card>

      {/* Abschnitt 3: Unterricht — nur sichtbar, solange flag_video aktiv ist (SPEC §2 Regel 12) */}
      {flagVideo && (
        <Card>
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-primary">
            {t('abschnitte.unterricht')}
          </h2>
          <p className="text-sm text-fg-muted">{t('unterricht.hinweis')}</p>
        </Card>
      )}
    </main>
  );
}
