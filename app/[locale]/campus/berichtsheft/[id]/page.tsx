import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { createServerSupabase } from '@bze/db/server';
import { Card } from '@bze/ui';
import { teilnehmerKannBearbeiten } from '@bze/core/nachweis';
import {
  ladeLetzteKorrektur,
  ladeNachweis,
  ladeRahmenplanKatalog,
} from '../_lib/queries';
import { NachweisForm } from '../_components/nachweis-form';
import { NachweisAktionen } from '../_components/nachweis-aktionen';
import { NachweisStatusBadge } from '../_components/nachweis-status-badge';
import { PdfExportButton } from '../_components/pdf-export-button';

function datumDe(iso: string | null, locale: string): string {
  if (!iso) return '—';
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default async function NachweisDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations('berichtsheft');
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return (
      <main className="mx-auto max-w-2xl p-4">
        <p className="text-muted">{t('nichtAngemeldet')}</p>
      </main>
    );
  }

  const nachweis = await ladeNachweis(id);
  if (!nachweis) {
    return (
      <main className="mx-auto max-w-2xl space-y-3 p-4">
        <Link href={`/${locale}/campus/berichtsheft`} className="text-sm text-accent hover:underline">
          ← {t('zurueck')}
        </Link>
        <p className="text-muted">{t('nichtGefunden')}</p>
      </main>
    );
  }

  const istEigen = nachweis.userId === user.id;
  const bearbeitbar = istEigen && teilnehmerKannBearbeiten(nachweis.status);
  const korrektur =
    nachweis.status === 'beanstandet' ? await ladeLetzteKorrektur(id) : null;
  const katalog = bearbeitbar ? await ladeRahmenplanKatalog() : [];

  return (
    <main className="mx-auto max-w-2xl space-y-4 p-4">
      <div className="pt-2">
        <Link
          href={`/${locale}/campus/berichtsheft`}
          className="touchable inline-flex min-h-12 items-center text-sm text-accent hover:underline"
        >
          ← {t('zurueck')}
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-extrabold">{t(`art.${nachweis.art}`)}</h1>
          <NachweisStatusBadge status={nachweis.status} label={t(`status.${nachweis.status}`)} />
        </div>
        <p className="text-sm text-muted">
          {datumDe(nachweis.zeitraumVon, locale)} – {datumDe(nachweis.zeitraumBis, locale)}
          {nachweis.ausbildungsjahr ? ` · ${t('ausbildungsjahrKurz', { jahr: nachweis.ausbildungsjahr })}` : ''}
        </p>
      </div>

      {korrektur && (
        <Card className="border-status-falsch/50 bg-status-falsch/5">
          <p className="flex items-center gap-2 font-semibold text-status-falsch">
            <span aria-hidden="true">✕</span> {t('beanstandung.titel')}
          </p>
          <p className="mt-1 text-sm">{korrektur.begruendung}</p>
        </Card>
      )}

      {bearbeitbar ? (
        <NachweisForm
          modus="bearbeiten"
          nachweisId={nachweis.id}
          locale={locale}
          rahmenplanKatalog={katalog}
          initial={{
            art: nachweis.art,
            zeitraumVon: nachweis.zeitraumVon,
            zeitraumBis: nachweis.zeitraumBis,
            ausbildungsjahr: nachweis.ausbildungsjahr,
            inhalt: nachweis.inhalt,
            rahmenplanPositionen: nachweis.rahmenplanPositionen,
            kiFormuliert: nachweis.kiFormuliert,
          }}
        />
      ) : (
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
      )}

      {istEigen && (
        <NachweisAktionen nachweisId={nachweis.id} status={nachweis.status} locale={locale} />
      )}

      <div className="pt-2">
        <PdfExportButton nachweisId={nachweis.id} />
      </div>
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
