import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { createServerSupabase } from '@bze/db/server';
import { berechneLuecken, ladeNachweise } from './_lib/queries';
import { NachweisStatusBadge } from './_components/nachweis-status-badge';
import { PdfExportButton } from './_components/pdf-export-button';

function datumDe(iso: string | null, locale: string): string {
  if (!iso) return '—';
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * Berichtsheft-Übersicht im Figma-Mobile-Look.
 */
export default async function BerichtsheftPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('berichtsheft');
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="mx-auto max-w-md px-5 py-6">
        <p className="text-[14px] text-fg-muted">{t('nichtAngemeldet')}</p>
      </main>
    );
  }

  const nachweise = await ladeNachweise();
  const luecken = berechneLuecken(nachweise);

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col gap-4 px-5 pb-6 pt-3">
      <header>
        <h1 className="text-[22px] font-extrabold leading-7 text-fg">{t('titel')}</h1>
        <p className="mt-1 text-[14px] text-fg-muted">{t('untertitel')}</p>
      </header>

      <div className="flex flex-wrap gap-2">
        <Link
          href={`/${locale}/campus/berichtsheft/neu`}
          className="touchable inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-4 text-[14px] font-bold text-fg-onPrimary"
        >
          {t('neuerEintrag')}
        </Link>
        {nachweise.length > 0 ? <PdfExportButton /> : null}
      </div>

      <section className="rounded-[16px] border border-border bg-surface p-4">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="text-[16px] font-bold text-primary">
            {luecken.length === 0 ? '✓' : '!'}
          </span>
          <h2 className="text-[16px] font-bold text-fg">{t('luecken.titel')}</h2>
        </div>
        {luecken.length === 0 ? (
          <p className="mt-2 text-[13px] text-status-fertig">{t('luecken.keine')}</p>
        ) : (
          <>
            <p className="mt-2 text-[13px] text-fg-muted">
              {t('luecken.hinweis', { anzahl: luecken.length })}
            </p>
            <ul className="mt-3 space-y-2">
              {luecken.map((l) => {
                const href = `/${locale}/campus/berichtsheft/neu?art=woche&von=${l.von}&bis=${l.bis}`;
                return (
                  <li key={`${l.jahr}-${l.kalenderwoche}`}>
                    <Link
                      href={href}
                      className="touchable flex min-h-12 items-center justify-between gap-2 rounded-[14px] border border-danger-border bg-danger-bg px-3 py-2.5 text-[13px]"
                    >
                      <span>
                        <span className="font-semibold">
                          {t('luecken.kw', { kw: l.kalenderwoche, jahr: l.jahr })}
                        </span>
                        <span className="ms-2 text-fg-muted">
                          {datumDe(l.von, locale)} – {datumDe(l.bis, locale)}
                        </span>
                      </span>
                      <span aria-hidden="true" className="font-bold text-primary">
                        +
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </section>

      {nachweise.length === 0 ? (
        <div className="rounded-[16px] border border-border bg-surface p-4">
          <p className="text-[14px] text-fg-muted">{t('leer')}</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {nachweise.map((n) => (
            <li key={n.id}>
              <Link
                href={`/${locale}/campus/berichtsheft/${n.id}`}
                className="touchable block rounded-[16px] border border-border bg-surface p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[15px] font-bold text-fg">{t(`art.${n.art}`)}</p>
                    <p className="text-[13px] text-fg-muted">
                      {datumDe(n.zeitraumVon, locale)} – {datumDe(n.zeitraumBis, locale)}
                      {n.ausbildungsjahr
                        ? ` · ${t('ausbildungsjahrKurz', { jahr: n.ausbildungsjahr })}`
                        : ''}
                    </p>
                  </div>
                  <NachweisStatusBadge status={n.status} label={t(`status.${n.status}`)} />
                </div>
                {n.kiFormuliert ? (
                  <p className="mt-2 text-[12px] text-fg-muted">{t('kiFormuliertHinweis')}</p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
