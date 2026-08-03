import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { createServerSupabase } from '@bze/db/server';
import { Badge, Button, Card, ProgressRing } from '@bze/ui';
// Relativer Import statt Alias: packages/ui/mdx ist kein eigenes pnpm-Workspace-Paket.
import { extractKapitel } from '../../../../../packages/ui/mdx';
import {
  holeThema,
  holeLerneinheitenFuerThema,
  holeFortschrittFuerLerneinheiten,
  holeAktuellenNutzerId,
  holeFlagVideo,
} from '../_lib/queries';
import { ladeFachbereich, ladeThemaEinordnung, ladeUnterthemen } from '../_lib/content-queries';
import {
  listeDemoLerneinheiten,
  demoThemaBezeichnung,
  demoThemaBeschreibung,
} from '../_lib/content-fallback';
import { anteilProzent, teileMinuten } from '../_lib/format';
import { LerneinheitKarte, lerneinheitKartenStatus } from '../_components/lerneinheit-karte';

const UUID_MUSTER = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Topic-Seite (SPEC §6.2.5): Lernpfad mit Statuskarten (Figma Mobile / Lernpfad),
 * darunter Modul-, Fragen- und optional Unterricht-Bloecke.
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
  const themaEinordnung = thema ? await ladeThemaEinordnung(supabase, thema.id) : null;
  const unterthemen = thema ? await ladeUnterthemen(supabase, thema.id) : [];

  if (thema && themaEinordnung && unterthemen.length > 0) {
    const fachbereich = await ladeFachbereich(supabase, themaEinordnung.pruefungsbereich_id);
    return (
      <main className="mx-auto max-w-md space-y-4 px-5 pb-8 pt-3">
        <header className="space-y-1">
          {fachbereich && (
            <Link
              href={`/${locale}/campus/topic/fachbereich/${fachbereich.id}`}
              className="text-[12px] font-semibold uppercase tracking-wide text-primary"
            >
              {fachbereich.bezeichnung}
            </Link>
          )}
          <h1 className="text-2xl font-extrabold text-fg">{thema.bezeichnung}</h1>
          {themaEinordnung.beschreibung && <p className="text-sm text-fg-muted">{themaEinordnung.beschreibung}</p>}
        </header>

        <Card>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-primary">
            {t('content.abschnitte.unterthemen')}
          </h2>
          <ul className="space-y-2">
            {unterthemen.map((unterthema) => (
              <li key={unterthema.id}>
                <Link
                  href={`/${locale}/campus/topic/${unterthema.id}`}
                  className="touchable flex items-center justify-between gap-3 rounded-xl border border-border bg-bg px-4 py-3 transition hover:border-primary"
                >
                  <span className="min-w-0">
                    <span className="block text-[15px] font-semibold text-fg">{unterthema.bezeichnung}</span>
                    {unterthema.beschreibung && (
                      <span className="mt-0.5 block text-xs text-fg-muted">{unterthema.beschreibung}</span>
                    )}
                  </span>
                  <Badge variante="neutral" symbol=">">
                    {t('content.navigation.unterthema')}
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </main>
    );
  }

  let lerneinheitenListe = thema ? await holeLerneinheitenFuerThema(supabase, thema.id) : [];

  // Solange AP-01/AP-07 noch keine `lerneinheiten`-Zeilen für dieses Thema angelegt haben,
  // zeigt die Seite ersatzweise die Beispiel-Lerneinheiten aus content/fachkunde/ (Demo-Modus).
  const demoModus = lerneinheitenListe.length === 0;
  const themaCode = thema?.code ?? themaId;
  const themaBezeichnung = thema?.bezeichnung ?? demoThemaBezeichnung(themaCode);
  const themaBeschreibung =
    themaEinordnung?.beschreibung ?? demoThemaBeschreibung(themaCode);
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

  const fertigAnzahl = demoModus
    ? Math.min(1, zeilen.length)
    : zeilen.filter((z) => z.kapitelGesamt > 0 && z.kapitelGelesen >= z.kapitelGesamt).length;
  const kapitelMeta = demoModus
    ? `Kapitel 1 · ${fertigAnzahl + (zeilen.length > 1 ? 1 : 0)}/${zeilen.length || 12}`
    : gesamtKapitel > 0
      ? `Kapitel 1 · ${gelesenKapitel}/${gesamtKapitel}`
      : `Kapitel 1 · ${fertigAnzahl}/${zeilen.length}`;

  return (
    <main className="mx-auto min-h-full max-w-md bg-bg pb-8">
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 pb-3 pt-4">
        <p className="text-[14px] font-medium leading-5 text-fg">BZE Campus</p>
        <p className="text-[12px] leading-[18px] text-fg-muted">{kapitelMeta}</p>
      </div>

      <header className="flex flex-col gap-2 px-4 pb-2 pt-5">
        <p className="text-[12px] font-semibold uppercase leading-4 tracking-[0.72px] text-primary">
          {t('uebersicht.lernpfad')}
        </p>
        <h1 className="text-[20px] font-semibold leading-7 text-fg">{themaBezeichnung}</h1>
        {themaBeschreibung ? (
          <p className="text-[14px] leading-[22px] text-fg-muted">{themaBeschreibung}</p>
        ) : null}
      </header>

      {zeilen.length === 0 ? (
        <p className="px-4 text-sm text-fg-muted">{t('fachkundeLesen.leer')}</p>
      ) : (
        <ul className="flex flex-col gap-3 px-4 pb-4 pt-2">
          {zeilen.map((zeile, index) => {
            const status = lerneinheitKartenStatus(zeilen, index, demoModus);
            const { stunden, minuten } = teileMinuten(zeile.lesedauerMinuten);
            const zeitText =
              stunden > 0
                ? t('zeit.stundenMinuten', { stunden, minuten })
                : t('zeit.minuten', { minuten });
            const meta =
              demoModus
                ? undefined
                : zeile.kapitelGesamt > 0
                  ? `${zeitText} · ${t('fachkundeLesen.kapitelFortschritt', {
                      gelesen: zeile.kapitelGelesen,
                      gesamt: zeile.kapitelGesamt,
                    })}`
                  : zeitText;

            return (
              <li key={zeile.href}>
                <LerneinheitKarte
                  href={zeile.href}
                  nummer={index + 1}
                  titel={zeile.titel}
                  status={status}
                  meta={meta}
                />
              </li>
            );
          })}
        </ul>
      )}

      {demoModus && zeilen.length > 0 ? (
        <p className="px-4 text-xs text-fg-muted">{t('fachkundeLesen.demoHinweis')}</p>
      ) : null}

      <div className="mt-4 space-y-3 px-4">
        {thema && (
          <Card className="flex flex-col gap-3 rounded-[14px] border-border bg-surface sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-overline uppercase text-primary">{t('content.modul.titel')}</h2>
              <p className="mt-1 text-sm text-fg-muted">{t('content.modul.beschreibung')}</p>
            </div>
            <Link href={`/${locale}/campus/topic/${thema.id}/modul`}>
              <Button variante="sekundaer">{t('content.modul.cta')}</Button>
            </Link>
          </Card>
        )}

        <Card className="rounded-[14px] border-border bg-surface">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h2 className="text-overline uppercase text-primary">{t('abschnitte.fragenUeben')}</h2>
            {!demoModus && zeilen.length > 0 ? <ProgressRing value={fachkundeProzent} size={40} /> : null}
          </div>
          <p className="mb-3 text-sm text-fg-muted">{t('fragenUeben.hinweis')}</p>
          <Link
            href={`/${locale}/campus/lernen/thema/${themaId}`}
            className="touchable inline-flex items-center justify-center gap-2 rounded-[10px] bg-primary px-4 py-3 text-[15px] font-semibold text-fg-onPrimary transition hover:brightness-110"
          >
            {t('fragenUeben.cta')}
          </Link>
        </Card>

        {flagVideo && (
          <Card className="rounded-[14px] border-border bg-surface">
            <h2 className="mb-2 text-overline uppercase text-primary">{t('abschnitte.unterricht')}</h2>
            <p className="text-sm text-fg-muted">{t('unterricht.hinweis')}</p>
          </Card>
        )}
      </div>
    </main>
  );
}
