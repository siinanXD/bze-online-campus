import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { createServerSupabase } from '@bze/db/server';
import { ladeFortschrittSeite } from '../_lib/queries';
import { ZurueckIcon } from '@/components/shell/icons';

/**
 * Prüfungsreife im Figma-Mobile-Look.
 */
export default async function PruefungsreifePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('fortschritt.pruefungsreife');
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="mx-auto max-w-md px-5 py-6">
        <p className="text-[14px] text-fg-muted">{t('nichtAngemeldet')}</p>
      </main>
    );
  }

  const data = await ladeFortschrittSeite(user.id);

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col gap-4 px-5 pb-6 pt-3">
      <Link
        href={`/${locale}/campus/fortschritt`}
        className="touchable inline-flex min-h-10 items-center gap-1 text-[16px] font-semibold text-primary"
      >
        <ZurueckIcon className="h-5 w-5" />
        <span>{t('zurueck')}</span>
      </Link>
      <header>
        <h1 className="text-[22px] font-extrabold text-fg">{t('titel')}</h1>
        <p className="mt-1 text-[14px] text-fg-muted">{t('untertitel')}</p>
      </header>

      <div className="rounded-[16px] border border-primary-border bg-primary-subtle p-4" role="note">
        <p className="text-[13px] font-medium text-fg">{t('kammerhinweis')}</p>
      </div>

      {data.phasen.map((ph) => {
        const reife = data.pruefungsreifen.find((r) => r.phaseId === ph.id);
        const phaseGate = data.gates.find((g) => g.id === ph.id);
        const kernOk = (phaseGate?.anteil ?? 0) >= 1;
        const pruefOk = data.pruefungenBestanden >= ph.mindestWochenpruefungen;
        const kriterien = Boolean(reife?.kriterienErfuelltAm) || (kernOk && pruefOk);
        const bestaetigt = Boolean(reife?.ausbilderBestaetigtAm);

        return (
          <section key={ph.id} className="space-y-3 rounded-[16px] border border-border bg-surface p-4">
            <h2 className="text-[16px] font-bold text-fg">{ph.bezeichnung}</h2>
            <ul className="space-y-2 text-[13px]">
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
            <p className="flex items-center gap-1.5 text-[13px]" role="status">
              <span aria-hidden="true">{bestaetigt ? '✓' : kriterien ? '★' : '○'}</span>
              <span>
                {bestaetigt
                  ? t('statusBestaetigt')
                  : kriterien
                    ? t('statusEmpfohlen')
                    : t('statusOffen')}
              </span>
            </p>
          </section>
        );
      })}
    </main>
  );
}

function Kriterium({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className="flex items-start gap-2" role="status">
      <span aria-hidden="true" className={ok ? 'text-status-fertig' : 'text-fg-muted'}>
        {ok ? '✓' : '○'}
      </span>
      <span>{label}</span>
    </li>
  );
}
