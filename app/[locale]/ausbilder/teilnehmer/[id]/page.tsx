import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Card, ProgressRing } from '@bze/ui';
import { ladeTeilnehmerDetail } from '../../_lib/queries';
import { RisikoBadge } from '../../_components/risiko-badge';
import { PruefungsreifeForm } from './pruefungsreife-form';

export default async function TeilnehmerDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations('ausbilder.detail');
  const data = await ladeTeilnehmerDetail(id);

  if (!data) {
    return (
      <main className="mx-auto max-w-4xl space-y-4 p-4">
        <Link href={`/${locale}/ausbilder`} className="touchable text-sm font-semibold text-accent underline-offset-4 hover:underline">
          {t('zurueck')}
        </Link>
        <Card><p className="text-muted">{t('nichtGefunden')}</p></Card>
      </main>
    );
  }

  const { profil } = data;
  const maxHeat = Math.max(1, ...data.heatmap.map((h) => h.anzahl));

  return (
    <main className="mx-auto max-w-4xl space-y-4 p-4">
      <Link href={`/${locale}/ausbilder`} className="touchable inline-flex min-h-12 items-center text-sm font-semibold text-accent underline-offset-4 hover:underline">
        {t('zurueck')}
      </Link>

      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">{profil.vorname} {profil.nachname}</h1>
          <p className="text-sm text-muted">{profil.benutzername}</p>
        </div>
        <div className="flex items-center gap-3">
          <ProgressRing value={profil.fortschrittProzent} size={56} label={`${profil.fortschrittProzent} %`} />
          <RisikoBadge aktivitaet={profil.risikoAktivitaet} pruefungen={profil.risikoPruefungen} />
        </div>
      </header>

      <section className="space-y-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-accent">{t('bereiche')}</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {data.bereiche.map((b) => (
            <Card key={b.id} className="flex items-center gap-3">
              <ProgressRing
                value={b.kernGesamt ? Math.round((100 * b.kernFertig) / b.kernGesamt) : 0}
                size={44}
              />
              <div>
                <p className="font-semibold">{b.bezeichnung}</p>
                <p className="flex items-center gap-1.5 text-sm text-muted" role="status">
                  <span aria-hidden="true">{b.fertig ? '✓' : '○'}</span>
                  <span>{b.fertig ? t('fertig') : t('offen')}</span>
                  <span>· {b.kernFertig}/{b.kernGesamt}</span>
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-accent">{t('fehlerschwerpunkte')}</h2>
        <Card className="divide-y divide-border">
          {data.themen.filter((th) => th.offenFalsch > 0).slice(0, 8).map((th) => (
            <div key={th.id} className="flex justify-between gap-3 py-2 first:pt-0 last:pb-0 text-sm">
              <span className="font-medium">{th.bezeichnung}</span>
              <span className="flex items-center gap-1 text-status-falsch" role="status">
                <span aria-hidden="true">✕</span>
                {t('fehler', { n: th.offenFalsch })}
              </span>
            </div>
          ))}
          {data.themen.every((th) => th.offenFalsch === 0) && (
            <p className="text-sm text-muted">{t('keineFehler')}</p>
          )}
        </Card>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-accent">{t('heatmap')}</h2>
        <Card>
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: 'repeat(14, minmax(0, 1fr))' }}
            role="img"
            aria-label={t('heatmapAria')}
          >
            {data.heatmap.map((h) => {
              const intens = h.anzahl / maxHeat;
              return (
                <div
                  key={h.tag}
                  title={`${h.tag}: ${h.anzahl}`}
                  className="aspect-square rounded-sm border border-border bg-accent"
                  style={{ opacity: h.anzahl === 0 ? 0.08 : 0.15 + intens * 0.85 }}
                />
              );
            })}
          </div>
          <p className="mt-2 text-xs text-muted">{t('heatmapHinweis')}</p>
        </Card>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-accent">{t('pruefungen')}</h2>
        <Card className="divide-y divide-border">
          {data.pruefungen.length === 0 ? (
            <p className="text-sm text-muted">{t('keinePruefungen')}</p>
          ) : (
            data.pruefungen.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-2 first:pt-0 last:pb-0 text-sm">
                <div>
                  <p className="font-semibold">{p.titel ?? t('pruefungOhneTitel')}</p>
                  <p className="text-xs text-muted">
                    {p.abgegebenAm ? new Date(p.abgegebenAm).toLocaleString(locale) : '—'}
                  </p>
                </div>
                <p className="flex items-center gap-1.5" role="status">
                  <span aria-hidden="true">{p.bestanden ? '✓' : p.bestanden === false ? '✕' : '○'}</span>
                  <span>
                    {p.gesamtpunkte != null ? `${p.gesamtpunkte}` : '—'}
                    {p.note != null ? ` · ${t('note', { n: p.note })}` : ''}
                  </span>
                </p>
              </div>
            ))
          )}
        </Card>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-accent">{t('pruefungsreife')}</h2>
        <Card className="space-y-3 border-accent/30 bg-accent/5" role="note">
          <p className="flex gap-2 text-sm">
            <span aria-hidden="true">ℹ</span>
            <span>{t('kammerhinweis')}</span>
          </p>
        </Card>
        {data.pruefungsreifen.length === 0 ? (
          <Card><p className="text-sm text-muted">{t('keineReife')}</p></Card>
        ) : (
          data.pruefungsreifen.map((r) => (
            <Card key={r.id} className="space-y-3">
              <div>
                <p className="font-semibold">{r.phaseBezeichnung}</p>
                <p className="flex items-center gap-1.5 text-sm text-muted" role="status">
                  <span aria-hidden="true">{r.ausbilderBestaetigtAm ? '✓' : r.kriterienErfuelltAm ? '★' : '○'}</span>
                  <span>
                    {r.ausbilderBestaetigtAm
                      ? t('reifeBestaetigt')
                      : r.kriterienErfuelltAm
                        ? t('reifeEmpfohlen')
                        : t('reifeOffen')}
                  </span>
                </p>
              </div>
              {r.kriterienErfuelltAm && !r.ausbilderBestaetigtAm && (
                <PruefungsreifeForm
                  pruefungsreifeId={r.id}
                  teilnehmerId={id}
                  locale={locale}
                />
              )}
              {r.kommentar && (
                <p className="text-sm text-muted">{t('kommentar')}: {r.kommentar}</p>
              )}
            </Card>
          ))
        )}
      </section>
    </main>
  );
}
