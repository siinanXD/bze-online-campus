import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { createServerSupabase } from '@bze/db/server';
import { Card } from '@bze/ui';
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
      <main className="mx-auto max-w-2xl p-4">
        <p className="text-fg-muted">{t('nichtAngemeldet')}</p>
      </main>
    );
  }

  const nachweise = await ladeNachweise();
  const luecken = berechneLuecken(nachweise);

  return (
    <main className="mx-auto max-w-2xl space-y-4 p-4">
      <div className="pt-2">
        <h1 className="text-2xl font-extrabold">{t('titel')}</h1>
        <p className="text-sm text-fg-muted">{t('untertitel')}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/${locale}/campus/berichtsheft/neu`}
          className="touchable inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-4 py-3 text-[15px] font-semibold text-fg-onPrimary transition hover:brightness-110"
        >
          {t('neuerEintrag')}
        </Link>
        {nachweise.length > 0 && <PdfExportButton />}
      </div>

      {/* Lückenanzeige (Spec §6.2.14) */}
      <Card className="space-y-3">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="text-lg">
            {luecken.length === 0 ? '✓' : '⚠'}
          </span>
          <h2 className="text-lg font-bold">{t('luecken.titel')}</h2>
        </div>
        {luecken.length === 0 ? (
          <p className="text-sm text-status-fertig">{t('luecken.keine')}</p>
        ) : (
          <>
            <p className="text-sm text-fg-muted">{t('luecken.hinweis', { anzahl: luecken.length })}</p>
            <ul className="space-y-2">
              {luecken.map((l) => {
                const href = `/${locale}/campus/berichtsheft/neu?art=woche&von=${l.von}&bis=${l.bis}`;
                return (
                  <li key={`${l.jahr}-${l.kalenderwoche}`}>
                    <Link
                      href={href}
                      className="touchable flex min-h-12 items-center justify-between gap-2 rounded-lg border border-status-falsch/40 bg-status-falsch/5 px-3 py-2 text-sm hover:bg-status-falsch/10"
                    >
                      <span>
                        <span className="font-semibold">{t('luecken.kw', { kw: l.kalenderwoche, jahr: l.jahr })}</span>
                        <span className="ms-2 text-fg-muted">
                          {datumDe(l.von, locale)} – {datumDe(l.bis, locale)}
                        </span>
                      </span>
                      <span aria-hidden="true" className="text-primary">
                        +
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </Card>

      {/* Liste der Nachweise */}
      {nachweise.length === 0 ? (
        <Card>
          <p className="text-sm text-fg-muted">{t('leer')}</p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {nachweise.map((n) => (
            <li key={n.id}>
              <Link href={`/${locale}/campus/berichtsheft/${n.id}`} className="block">
                <Card className="space-y-2 transition hover:border-primary">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold">{t(`art.${n.art}`)}</p>
                      <p className="text-sm text-fg-muted">
                        {datumDe(n.zeitraumVon, locale)} – {datumDe(n.zeitraumBis, locale)}
                        {n.ausbildungsjahr ? ` · ${t('ausbildungsjahrKurz', { jahr: n.ausbildungsjahr })}` : ''}
                      </p>
                    </div>
                    <NachweisStatusBadge status={n.status} label={t(`status.${n.status}`)} />
                  </div>
                  {n.kiFormuliert && <p className="text-xs text-fg-muted">{t('kiFormuliertHinweis')}</p>}
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
