import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Card } from '@bze/ui';
import { ladeCockpit } from './_lib/queries';
import { RisikoBadge } from './_components/risiko-badge';

export default async function AusbilderCockpit({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('ausbilder');
  const zeilen = await ladeCockpit();

  return (
    <main className="mx-auto max-w-6xl space-y-4 p-4">
      <div className="pt-2">
        <h1 className="text-2xl font-extrabold">{t('cockpit')}</h1>
        <p className="text-sm text-muted">{t('hinweis')}</p>
      </div>

      {zeilen.length === 0 ? (
        <Card>
          <p className="text-sm text-muted">{t('keineTeilnehmer')}</p>
        </Card>
      ) : (
        <>
          {/* Mobile: Karten */}
          <ul className="space-y-3 md:hidden">
            {zeilen.map((z) => (
              <li key={z.userId}>
                <Card className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/${locale}/ausbilder/teilnehmer/${z.userId}`}
                        className="touchable font-semibold text-accent underline-offset-4 hover:underline"
                      >
                        {z.vorname} {z.nachname}
                      </Link>
                      <p className="text-xs text-muted">({z.benutzername})</p>
                    </div>
                    <RisikoBadge aktivitaet={z.risikoAktivitaet} pruefungen={z.risikoPruefungen} />
                  </div>
                  <dl className="grid grid-cols-2 gap-2 text-sm">
                    <div><dt className="text-muted">{t('spalten.fortschritt')}</dt><dd className="font-semibold">{z.fortschrittProzent} %</dd></div>
                    <div><dt className="text-muted">{t('spalten.lernpunkte')}</dt><dd className="font-semibold">{z.lernpunkte}</dd></div>
                    <div><dt className="text-muted">{t('spalten.fragenWoche')}</dt><dd className="font-semibold">{z.fragenProWoche}</dd></div>
                    <div><dt className="text-muted">{t('spalten.quote')}</dt><dd className="font-semibold">{z.richtigFalschQuote != null ? `${z.richtigFalschQuote} %` : '—'}</dd></div>
                    <div><dt className="text-muted">{t('spalten.pruefungen')}</dt><dd className="font-semibold">{z.pruefungenAnzahl}</dd></div>
                    <div><dt className="text-muted">{t('spalten.letzteNote')}</dt><dd className="font-semibold">{z.letzteNote ?? '—'}</dd></div>
                    <div><dt className="text-muted">{t('spalten.aktiveTage')}</dt><dd className="font-semibold">{z.aktiveLerntage}</dd></div>
                    <div><dt className="text-muted">{t('spalten.letzteAktivitaet')}</dt><dd className="font-semibold">{z.letzteAktivitaet ? new Date(z.letzteAktivitaet).toLocaleDateString(locale) : '—'}</dd></div>
                  </dl>
                </Card>
              </li>
            ))}
          </ul>

          {/* Tablet/Desktop: Tabelle */}
          <Card className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                  <th className="py-2 pe-2 font-bold">{t('teilnehmer')}</th>
                  <th className="py-2 pe-2 font-bold">{t('spalten.fortschritt')}</th>
                  <th className="py-2 pe-2 font-bold">{t('spalten.lernpunkte')}</th>
                  <th className="py-2 pe-2 font-bold">{t('spalten.fragenWoche')}</th>
                  <th className="py-2 pe-2 font-bold">{t('spalten.quote')}</th>
                  <th className="py-2 pe-2 font-bold">{t('spalten.pruefungen')}</th>
                  <th className="py-2 pe-2 font-bold">{t('spalten.letzteNote')}</th>
                  <th className="py-2 pe-2 font-bold">{t('spalten.aktiveTage')}</th>
                  <th className="py-2 pe-2 font-bold">{t('spalten.letzteAktivitaet')}</th>
                  <th className="py-2 font-bold">{t('spalten.risiko')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {zeilen.map((z) => (
                  <tr key={z.userId}>
                    <td className="py-3 pe-2">
                      <Link
                        href={`/${locale}/ausbilder/teilnehmer/${z.userId}`}
                        className="touchable font-semibold text-accent underline-offset-4 hover:underline"
                      >
                        {z.vorname} {z.nachname}
                      </Link>
                      <div className="text-xs text-muted">{z.benutzername}</div>
                    </td>
                    <td className="py-3 pe-2 font-semibold">{z.fortschrittProzent} %</td>
                    <td className="py-3 pe-2">{z.lernpunkte}</td>
                    <td className="py-3 pe-2">{z.fragenProWoche}</td>
                    <td className="py-3 pe-2">{z.richtigFalschQuote != null ? `${z.richtigFalschQuote} %` : '—'}</td>
                    <td className="py-3 pe-2">{z.pruefungenAnzahl}</td>
                    <td className="py-3 pe-2">{z.letzteNote ?? '—'}</td>
                    <td className="py-3 pe-2">{z.aktiveLerntage}</td>
                    <td className="py-3 pe-2">{z.letzteAktivitaet ? new Date(z.letzteAktivitaet).toLocaleDateString(locale) : '—'}</td>
                    <td className="py-3">
                      <RisikoBadge aktivitaet={z.risikoAktivitaet} pruefungen={z.risikoPruefungen} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}
    </main>
  );
}
