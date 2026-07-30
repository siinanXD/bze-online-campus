import { getTranslations } from 'next-intl/server';
import { Card } from '@bze/ui';
import { ladeKohorten } from '../_lib/queries';

export default async function KohortenSeite() {
  const t = await getTranslations('ausbilder.kohorte');
  const { uebersichten, schwachStellen } = await ladeKohorten();

  return (
    <main className="mx-auto max-w-6xl space-y-4 p-4">
      <div className="pt-2">
        <h1 className="text-2xl font-extrabold">{t('titel')}</h1>
        <p className="text-sm text-fg-muted">{t('untertitel')}</p>
      </div>

      {uebersichten.length === 0 ? (
        <Card><p className="text-sm text-fg-muted">{t('keine')}</p></Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {uebersichten.map((k) => (
            <Card key={k.kohorteId} className="space-y-2">
              <h2 className="font-bold">{k.bezeichnung}</h2>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <div><dt className="text-fg-muted">{t('teilnehmer')}</dt><dd className="font-semibold">{k.teilnehmerAnzahl}</dd></div>
                <div><dt className="text-fg-muted">{t('fortschrittAvg')}</dt><dd className="font-semibold">{k.fortschrittAvg} %</dd></div>
                <div><dt className="text-fg-muted">{t('lernpunkteAvg')}</dt><dd className="font-semibold">{k.lernpunkteAvg}</dd></div>
                <div><dt className="text-fg-muted">{t('quoteAvg')}</dt><dd className="font-semibold">{k.quoteAvg} %</dd></div>
              </dl>
            </Card>
          ))}
        </div>
      )}

      <section className="space-y-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-primary">{t('schwachTitel')}</h2>
        {schwachStellen.length === 0 ? (
          <Card><p className="text-sm text-fg-muted">{t('schwachKeine')}</p></Card>
        ) : (
          <Card className="divide-y divide-border">
            {schwachStellen.map((s) => (
              <div key={s.themaId} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="font-semibold">{s.bezeichnung}</p>
                  <p className="text-xs text-fg-muted">{t('versuche', { n: s.versuche })}</p>
                </div>
                <p className="flex items-center gap-1.5 text-sm font-semibold text-status-falsch" role="status">
                  <span aria-hidden="true">✕</span>
                  <span>{t('fehlerquote', { wert: s.fehlerquote })}</span>
                </p>
              </div>
            ))}
          </Card>
        )}
      </section>
    </main>
  );
}
