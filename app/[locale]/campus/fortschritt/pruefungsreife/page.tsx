import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { createServerSupabase } from '@bze/db/server';
import { Card } from '@bze/ui';
import { ladeFortschrittSeite } from '../_lib/queries';

export default async function PruefungsreifePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('fortschritt.pruefungsreife');
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="mx-auto max-w-2xl p-4">
        <p className="text-muted">{t('nichtAngemeldet')}</p>
      </main>
    );
  }

  const data = await ladeFortschrittSeite(user.id);

  return (
    <main className="mx-auto max-w-2xl space-y-4 p-4">
      <Link
        href={`/${locale}/campus/fortschritt`}
        className="touchable inline-flex min-h-12 items-center text-sm font-semibold text-accent underline-offset-4 hover:underline"
      >
        {t('zurueck')}
      </Link>
      <h1 className="text-2xl font-extrabold">{t('titel')}</h1>
      <p className="text-sm text-muted">{t('untertitel')}</p>

      <Card className="border-accent/40 bg-accent/5" role="note">
        <p className="flex gap-2 text-sm font-medium">
          <span aria-hidden="true">ℹ</span>
          <span>{t('kammerhinweis')}</span>
        </p>
      </Card>

      {data.phasen.map((ph) => {
        const reife = data.pruefungsreifen.find((r) => r.phaseId === ph.id);
        const phaseGate = data.gates.find((g) => g.id === ph.id);
        const kernOk = (phaseGate?.anteil ?? 0) >= 1;
        const pruefOk = data.pruefungenBestanden >= ph.mindestWochenpruefungen;
        const kriterien = Boolean(reife?.kriterienErfuelltAm) || (kernOk && pruefOk);
        const bestaetigt = Boolean(reife?.ausbilderBestaetigtAm);

        return (
          <Card key={ph.id} className="space-y-3">
            <h2 className="font-bold">{ph.bezeichnung}</h2>
            <ul className="space-y-2 text-sm">
              <Kriterium ok={kernOk} label={t('kriteriumKern')} />
              <Kriterium
                ok={pruefOk}
                label={t('kriteriumPruefungen', {
                  ist: data.pruefungenBestanden,
                  soll: ph.mindestWochenpruefungen,
                })}
              />
              <Kriterium ok={kriterien} label={t('kriteriumErfuellt')} />
              <Kriterium ok={bestaetigt} label={t('kriteriumAusbilder')} />
            </ul>
            <p className="flex items-center gap-1.5 text-sm" role="status">
              <span aria-hidden="true">{bestaetigt ? '✓' : kriterien ? '★' : '○'}</span>
              <span>
                {bestaetigt
                  ? t('statusBestaetigt')
                  : kriterien
                    ? t('statusEmpfohlen')
                    : t('statusOffen')}
              </span>
            </p>
          </Card>
        );
      })}
    </main>
  );
}

function Kriterium({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className="flex items-start gap-2" role="status">
      <span aria-hidden="true" className={ok ? 'text-status-fertig' : 'text-muted'}>
        {ok ? '✓' : '○'}
      </span>
      <span>{label}</span>
    </li>
  );
}
