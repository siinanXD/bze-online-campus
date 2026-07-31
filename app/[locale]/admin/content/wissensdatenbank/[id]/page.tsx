import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Badge, Card, FehlerZustand, Seitenkopf } from '@bze/ui';
import { ContentNav } from '../../_components/content-nav';
import { ladeAdminSitzung } from '../../../_lib/auth';
import { ladeWissensdokumentDetail } from '../_lib/queries';
import { WissensdokumentDetailAktionen } from './wissensdokument-detail-aktionen';

/**
 * Detailansicht eines Wissensdokuments.
 */
export default async function WissensdokumentDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations('admin.content.wissensdatenbank');
  const sitzung = await ladeAdminSitzung();
  if (!sitzung) {
    return (
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        <FehlerZustand titel={t('keinZugriffTitel')} text={t('keinZugriffText')} />
      </main>
    );
  }

  const dokument = await ladeWissensdokumentDetail(sitzung.supabase, id);
  if (!dokument) notFound();

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
      <Seitenkopf titel={dokument.titel} beschreibung={dokument.beschreibung ?? t('detail.beschreibungFallback')} />
      <ContentNav locale={locale} />
      <Link href={`/${locale}/admin/content/wissensdatenbank`} className="text-sm font-semibold text-primary underline-offset-2 hover:underline">
        {t('detail.zurueck')}
      </Link>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge variante={dokument.aktiv ? 'success' : 'danger'} symbol={dokument.aktiv ? 'ok' : '!'}>
                {dokument.aktiv ? t('badges.aktiv') : t('badges.inaktiv')}
              </Badge>
              <Badge variante={dokument.dokument_status === 'fehler' ? 'danger' : 'info'}>
                {t(`status.${dokument.dokument_status}`)}
              </Badge>
              <Badge variante={dokument.embedding_mock ? 'warning' : 'neutral'}>
                {dokument.embedding_mock ? t('badges.mockEmbedding') : t(`index.${dokument.index_status}`)}
              </Badge>
            </div>
            <dl className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <Info label={t('spalten.quelle')} wert={t(`quellen.${dokument.quelle_typ}`)} />
              <Info label={t('spalten.dateityp')} wert={dokument.mime_type ?? dokument.quelle_typ} />
              <Info label={t('spalten.chunks')} wert={String(dokument.chunk_anzahl)} />
              <Info label={t('spalten.erstellt')} wert={new Date(dokument.created_at).toLocaleString(locale)} />
            </dl>
          </div>
          <WissensdokumentDetailAktionen dokumentId={dokument.id} aktiv={dokument.aktiv} />
        </div>
        <p className="text-sm text-fg-muted">{t('detail.ragHinweis')}</p>
      </Card>

      {dokument.fehler.length > 0 && (
        <Card className="space-y-3 border-status-falsch/40">
          <h2 className="text-h3">{t('detail.fehlerTitel')}</h2>
          <ul className="space-y-2">
            {dokument.fehler.map((fehler) => (
              <li key={fehler.id} className="rounded-lg border border-border bg-bg p-3 text-sm">
                <p className="font-semibold">{fehler.phase}: {fehler.fehlercode}</p>
                <p className="text-fg-muted">{fehler.meldung}</p>
                <p className="mt-1 text-xs text-fg-muted">{new Date(fehler.created_at).toLocaleString(locale)}</p>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card className="space-y-3">
        <h2 className="text-h3">{t('detail.chunksTitel')}</h2>
        {dokument.chunks.length === 0 ? (
          <p className="text-sm text-fg-muted">{t('detail.keineChunks')}</p>
        ) : (
          <ol className="space-y-3">
            {dokument.chunks.map((chunk) => (
              <li key={chunk.id} className="rounded-lg border border-border bg-bg p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{t('detail.chunkNummer', { nummer: chunk.chunk_index + 1 })}</p>
                  <p className="text-xs text-fg-muted">{chunk.token_schaetzung} {t('detail.tokens')}</p>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{chunk.inhalt}</p>
                <p className="mt-2 break-all text-xs text-fg-muted">{chunk.text_hash}</p>
              </li>
            ))}
          </ol>
        )}
      </Card>
    </main>
  );
}

/**
 * Rendert ein kompaktes Detailfeld.
 */
function Info({ label, wert }: { label: string; wert: string }) {
  return (
    <div>
      <dt className="text-fg-muted">{label}</dt>
      <dd className="font-semibold">{wert}</dd>
    </div>
  );
}
