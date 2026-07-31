import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { createServerSupabase } from '@bze/db/server';
import { Card } from '@bze/ui';
import { ladeFortsetzenEmpfehlung } from '../fortschritt/_lib/queries';
import { baueCuatalBloecke, berechneFragenFortschrittProzent, ladeFragenUebersicht } from './_lib/fragen';

export default async function LernenIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('lernen');
  const tCampus = await getTranslations('campus');
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const uebersicht = await ladeFragenUebersicht(user?.id ?? null);
  const themen = uebersicht.themen;
  const gruppen = uebersicht.gruppen;
  const empfehlung = user ? await ladeFortsetzenEmpfehlung(user.id) : null;
  const gesamtProzent = berechneFragenFortschrittProzent(themen);
  const fehler = gruppen.find((gruppe) => gruppe.id === 'falsch')?.anzahl ?? 0;
  const fastFertig = gruppen.find((gruppe) => gruppe.id === 'fast_fertig')?.anzahl ?? 0;
  const alleOffen = gruppen.find((gruppe) => gruppe.id === 'alle')?.anzahl ?? 0;
  const cuatals = baueCuatalBloecke(themen);

  return (
    <main className="mx-auto flex min-h-full max-w-2xl flex-col gap-2 p-3">
      <header className="shrink-0">
        <h1 className="text-xl font-extrabold">{t('titel')}</h1>
        <p className="text-sm text-fg-muted">Fragen üben oder Prüfung starten.</p>
      </header>

      <section className="grid shrink-0 grid-cols-2 gap-2">
        <Link
          href={`/${locale}/campus/lernen/fragen`}
          className="touchable rounded-lg border border-primary bg-primary px-3 py-3 text-center text-sm font-bold text-fg-onPrimary shadow-sm"
        >
          <span className="block text-lg leading-none">?</span>
          Fragen
        </Link>
        <Link
          href={`/${locale}/campus/pruefung`}
          className="touchable rounded-lg border border-border bg-surface px-3 py-3 text-center text-sm font-bold shadow-sm"
        >
          <span className="block text-lg leading-none">P</span>
          Prüfung
        </Link>
      </section>

      <section className="grid shrink-0 grid-cols-4 gap-1.5">
        <Link href={`/${locale}/campus/lernen/fragen`} className="rounded-lg border border-border bg-surface p-2 text-center">
          <p className="text-base font-extrabold">{alleOffen}</p>
          <p className="text-[11px] font-semibold text-fg-muted">Offen</p>
        </Link>
        <Link
          href={`/${locale}/campus/lernen/fragen?status=falsch&limit=5`}
          className="rounded-lg border border-danger-border bg-danger-bg p-2 text-center"
        >
          <p className="text-base font-extrabold text-danger">{fehler}</p>
          <p className="text-[11px] font-semibold text-fg-muted">Fehler</p>
        </Link>
        <Link
          href={`/${locale}/campus/lernen/fragen?status=fast_fertig`}
          className="rounded-lg border border-success-border bg-success-bg p-2 text-center"
        >
          <p className="text-base font-extrabold text-success">{fastFertig}</p>
          <p className="text-[11px] font-semibold text-fg-muted">Fast</p>
        </Link>
        <div className="rounded-lg border border-border bg-surface p-2 text-center">
          <p className="text-base font-extrabold">{gesamtProzent}%</p>
          <p className="text-[11px] font-semibold text-fg-muted">Sicher</p>
        </div>
      </section>

      {empfehlung && (
        <Link
          href={`/${locale}/campus/lernen/thema/${empfehlung.themaId}`}
          className="shrink-0 rounded-lg border border-primary-border bg-primary-subtle px-3 py-2"
        >
          <p className="text-xs font-bold uppercase text-primary">{tCampus('fortsetzenTitel')}</p>
          <p className="truncate text-sm font-bold">{empfehlung.bezeichnung}</p>
        </Link>
      )}

      {themen.length === 0 ? (
        <Card className="shrink-0">
          <p className="text-fg-muted">{tCampus('keineThemen')}</p>
        </Card>
      ) : (
        <section className="min-h-0 flex-1 rounded-lg border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border bg-surface px-3 py-2">
            <h2 className="text-sm font-bold">Cuatals</h2>
            <Link href={`/${locale}/campus/lernen/fragen`} className="text-xs font-bold text-primary">
              Alle Fragen
            </Link>
          </div>
          <div className="grid h-[calc(100%-41px)] grid-cols-2 grid-rows-2 gap-2 p-2">
            {cuatals.map((block) => (
              <Link
                key={block.cuatal}
                href={`/${locale}/campus/lernen/fragen?cuatal=${block.cuatal}`}
                className={`touchable flex min-h-0 flex-col justify-between rounded-lg border p-3 ${
                  block.gesamt > 0
                    ? 'border-primary-border bg-primary-subtle'
                    : 'border-border bg-bg-subtle text-fg-muted'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-extrabold">Cuatal {block.cuatal}</h3>
                    <p className="text-[11px] font-semibold text-fg-muted">
                      {block.themen.length} Kategorien
                    </p>
                  </div>
                  <span className="zahlen text-sm font-extrabold text-primary">{block.prozent}%</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-center">
                  <div className="rounded-md bg-surface/80 p-1.5">
                    <p className="zahlen text-base font-extrabold">{block.gesamt}</p>
                    <p className="text-[10px] font-semibold text-fg-muted">Fragen</p>
                  </div>
                  <div className="rounded-md bg-surface/80 p-1.5">
                    <p className="zahlen text-base font-extrabold text-danger">{block.falsch}</p>
                    <p className="text-[10px] font-semibold text-fg-muted">Fehler</p>
                  </div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface" aria-hidden="true">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${block.prozent}%` }} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
