import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Card } from '@bze/ui';
import { ladeAusbilderNachweise, type AusbilderNachweisZeile } from './_lib/queries';
import { NachweisStatusBadge } from '../../campus/berichtsheft/_components/nachweis-status-badge';

function datumDe(iso: string | null, locale: string): string {
  if (!iso) return '—';
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

const OFFEN: AusbilderNachweisZeile['status'][] = ['eingereicht', 'signiert_teilnehmer'];

export default async function AusbilderBerichtsheftPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('berichtsheft');
  const alle = await ladeAusbilderNachweise();
  const zuPruefen = alle.filter((n) => OFFEN.includes(n.status));
  const uebrige = alle.filter((n) => !OFFEN.includes(n.status));

  function zeile(n: AusbilderNachweisZeile) {
    return (
      <li key={n.id}>
        <Link href={`/${locale}/ausbilder/berichtsheft/${n.id}`} className="block">
          <Card className="flex items-start justify-between gap-3 transition hover:border-accent">
            <div>
              <p className="font-semibold">{n.teilnehmerName}</p>
              <p className="text-sm text-muted">
                {t(`art.${n.art}`)} · {datumDe(n.zeitraumVon, locale)} – {datumDe(n.zeitraumBis, locale)}
                {n.ausbildungsjahr ? ` · ${t('ausbildungsjahrKurz', { jahr: n.ausbildungsjahr })}` : ''}
              </p>
              {n.kiFormuliert && <p className="text-xs text-muted">{t('kiFormuliertHinweis')}</p>}
            </div>
            <NachweisStatusBadge status={n.status} label={t(`status.${n.status}`)} />
          </Card>
        </Link>
      </li>
    );
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-4">
      <div className="pt-2">
        <h1 className="text-2xl font-extrabold">{t('pruefung.seiteTitel')}</h1>
        <p className="text-sm text-muted">{t('pruefung.seiteHinweis')}</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">{t('pruefung.zuPruefen')}</h2>
        {zuPruefen.length === 0 ? (
          <Card>
            <p className="text-sm text-muted">{t('pruefung.keineOffenen')}</p>
          </Card>
        ) : (
          <ul className="space-y-3">{zuPruefen.map(zeile)}</ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">{t('pruefung.uebrige')}</h2>
        {uebrige.length === 0 ? (
          <Card>
            <p className="text-sm text-muted">{t('pruefung.keineUebrigen')}</p>
          </Card>
        ) : (
          <ul className="space-y-3">{uebrige.map(zeile)}</ul>
        )}
      </section>
    </main>
  );
}
