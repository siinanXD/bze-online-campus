import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Card } from '@bze/ui';
import {
  ladeAusbilderNachweis,
  ladeKorrekturen,
} from '../_lib/queries';
import { NachweisStatusBadge } from '../../../campus/berichtsheft/_components/nachweis-status-badge';
import { PruefAktionen } from '../_components/pruef-aktionen';

function datumDe(iso: string | null, locale: string): string {
  if (!iso) return '—';
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default async function AusbilderNachweisDetail({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations('berichtsheft');
  const nachweis = await ladeAusbilderNachweis(id);

  if (!nachweis) {
    return (
      <main className="mx-auto max-w-3xl space-y-3 p-4">
        <Link href={`/${locale}/ausbilder/berichtsheft`} className="text-sm text-accent hover:underline">
          ← {t('pruefung.zurueck')}
        </Link>
        <p className="text-muted">{t('nichtGefunden')}</p>
      </main>
    );
  }

  const korrekturen = await ladeKorrekturen(id);

  return (
    <main className="mx-auto max-w-3xl space-y-4 p-4">
      <div className="pt-2">
        <Link
          href={`/${locale}/ausbilder/berichtsheft`}
          className="touchable inline-flex min-h-12 items-center text-sm text-accent hover:underline"
        >
          ← {t('pruefung.zurueck')}
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-extrabold">{nachweis.teilnehmerName}</h1>
          <NachweisStatusBadge status={nachweis.status} label={t(`status.${nachweis.status}`)} />
        </div>
        <p className="text-sm text-muted">
          {t(`art.${nachweis.art}`)} · {datumDe(nachweis.zeitraumVon, locale)} – {datumDe(nachweis.zeitraumBis, locale)}
          {nachweis.ausbildungsjahr ? ` · ${t('ausbildungsjahrKurz', { jahr: nachweis.ausbildungsjahr })}` : ''}
        </p>
      </div>

      <Card className="space-y-4">
        <Feld titel={t('form.taetigkeiten')} text={nachweis.inhalt.taetigkeiten} leer={t('keinInhalt')} />
        <Feld titel={t('form.unterweisungen')} text={nachweis.inhalt.unterweisungen} leer={t('keinInhalt')} />
        <Feld titel={t('form.berufsschulthemen')} text={nachweis.inhalt.berufsschulthemen} leer={t('keinInhalt')} />
        {nachweis.rahmenplanPositionen.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">{t('form.rahmenplan')}</h3>
            <ul className="mt-1 flex flex-wrap gap-2">
              {nachweis.rahmenplanPositionen.map((p) => (
                <li key={p} className="rounded-full border border-border px-3 py-1 text-sm">
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}
        {nachweis.kiFormuliert && <p className="text-xs text-muted">{t('ki.hinweis')}</p>}
      </Card>

      <PruefAktionen
        nachweisId={nachweis.id}
        status={nachweis.status}
        inhalt={nachweis.inhalt}
        locale={locale}
      />

      {korrekturen.length > 0 && (
        <Card className="space-y-2">
          <h2 className="text-lg font-bold">{t('pruefung.verlauf')}</h2>
          <ul className="space-y-2">
            {korrekturen.map((k) => (
              <li key={k.id} className="rounded-lg border border-border p-3 text-sm">
                <p className="text-xs text-muted">
                  {new Date(k.createdAt).toLocaleString(locale)}
                </p>
                <p>{k.begruendung}</p>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </main>
  );
}

function Feld({ titel, text, leer }: { titel: string; text?: string; leer: string }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">{titel}</h3>
      {text && text.trim() ? (
        <p className="mt-1 whitespace-pre-line text-sm leading-relaxed">{text}</p>
      ) : (
        <p className="mt-1 text-sm text-muted">{leer}</p>
      )}
    </div>
  );
}
