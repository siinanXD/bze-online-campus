import { getTranslations } from 'next-intl/server';
import { Badge, Card } from '@bze/ui';
import { ladeAdminSitzung } from '../../../_lib/auth';
import { ContentNav } from '../../_components/content-nav';
import { ladeFachkundeFreigabeInventar } from './_lib/queries';

export const dynamic = 'force-dynamic';

/**
 * Admin-Uebersicht: Fachkunde-MDX-Entwuerfe und Freigabebereitschaft.
 * Aendert keine Statuswerte; Ausbilderfreigabe bleibt manueller Fachprozess.
 */
export default async function FachkundeFreigabePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('admin.content.fachkundeFreigabe');
  const sitzung = await ladeAdminSitzung();
  if (!sitzung) return null;

  const { zeilen, statistik } = await ladeFachkundeFreigabeInventar();
  const unvollstaendig = zeilen.filter(
    (z) => !(z.hatStory && z.hatEinfach && z.hatFachlich && z.hatMerksatz && z.hatQuiz && z.hatBegriffe),
  );

  return (
    <div className="space-y-4">
      <ContentNav locale={locale} />
      <div>
        <h2 className="text-lg font-bold">{t('titel')}</h2>
        <p className="text-sm text-fg-muted">{t('hinweis')}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="p-4">
          <p className="text-caption text-fg-muted">{t('kennzahlen.gesamt')}</p>
          <p className="text-h3 font-bold">{statistik.gesamt}</p>
        </Card>
        <Card className="p-4">
          <p className="text-caption text-fg-muted">{t('kennzahlen.entwurf')}</p>
          <p className="text-h3 font-bold">{statistik.entwurf}</p>
        </Card>
        <Card className="p-4">
          <p className="text-caption text-fg-muted">{t('kennzahlen.fragenFreigegeben')}</p>
          <p className="text-h3 font-bold">{statistik.fragenFreigegeben}</p>
        </Card>
        <Card className="p-4">
          <p className="text-caption text-fg-muted">{t('kennzahlen.quellenOffen')}</p>
          <p className="text-h3 font-bold">{statistik.quellenOffen}</p>
        </Card>
        <Card className="p-4">
          <p className="text-caption text-fg-muted">{t('kennzahlen.bereit')}</p>
          <p className="text-h3 font-bold">{statistik.bereitFuerFachpruefung}</p>
        </Card>
      </div>

      {unvollstaendig.length > 0 ? (
        <Card className="space-y-2 p-4">
          <h3 className="font-bold">{t('unvollstaendigTitel')}</h3>
          <ul className="list-disc space-y-1 ps-5 text-sm">
            {unvollstaendig.slice(0, 30).map((zeile) => (
              <li key={zeile.slug}>
                {zeile.slug} — {zeile.titel}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <Card className="overflow-x-auto p-0">
        <table className="min-w-full text-sm">
          <caption className="sr-only">{t('tabelleCaption')}</caption>
          <thead className="border-b border-border bg-bg-subtle text-left">
            <tr>
              <th className="px-3 py-2">{t('spalten.thema')}</th>
              <th className="px-3 py-2">{t('spalten.titel')}</th>
              <th className="px-3 py-2">{t('spalten.status')}</th>
              <th className="px-3 py-2">{t('spalten.fragen')}</th>
              <th className="px-3 py-2">{t('spalten.quellen')}</th>
              <th className="px-3 py-2">{t('spalten.bausteine')}</th>
            </tr>
          </thead>
          <tbody>
            {zeilen.slice(0, 80).map((zeile) => {
              const bausteineOk =
                zeile.hatStory &&
                zeile.hatEinfach &&
                zeile.hatFachlich &&
                zeile.hatMerksatz &&
                zeile.hatQuiz &&
                zeile.hatBegriffe;
              return (
                <tr key={zeile.slug} className="border-b border-border">
                  <td className="px-3 py-2 font-mono text-xs">{zeile.themaCode}</td>
                  <td className="px-3 py-2">
                    <div className="font-semibold">{zeile.titel}</div>
                    <div className="text-caption text-fg-muted">{zeile.slug}</div>
                  </td>
                  <td className="px-3 py-2">
                    <Badge variante={zeile.reviewStatus === 'freigegeben' ? 'success' : 'neutral'}>
                      {zeile.reviewStatus}
                    </Badge>
                  </td>
                  <td className="px-3 py-2">
                    <Badge variante={zeile.fragenStatus === 'freigegeben' ? 'success' : 'warning'}>
                      {zeile.fragenStatus === 'freigegeben' ? t('fragen.ok') : t('fragen.offen')}
                    </Badge>
                  </td>
                  <td className="px-3 py-2">
                    <Badge variante={zeile.quellenOffen ? 'warning' : 'success'}>
                      {zeile.quellenOffen ? t('quellen.offen') : t('quellen.ok')}
                    </Badge>
                  </td>
                  <td className="px-3 py-2">
                    <Badge variante={bausteineOk ? 'success' : 'danger'}>
                      {bausteineOk ? t('bausteine.ok') : t('bausteine.luecke')}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {zeilen.length > 80 ? (
          <p className="border-t border-border px-3 py-2 text-caption text-fg-muted">
            {t('mehr', { rest: zeilen.length - 80 })}
          </p>
        ) : null}
      </Card>
    </div>
  );
}
