import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { createServerSupabase } from '@bze/db/server';
import { ProgressRing } from '@bze/ui';
import { ladeFortschrittSeite } from './_lib/queries';
import { GateZeile } from './_components/gate-zeile';
import { AbzeichenListe } from './_components/abzeichen-liste';

/**
 * Fortschritt im Figma-Mobile-Look.
 */
export default async function FortschrittPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('fortschritt');
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
  const topicGates = data.gates.filter((g) => g.ebene === 'topic');
  const bereichGates = data.gates.filter((g) => g.ebene === 'fachgebiet');
  const phaseGates = data.gates.filter((g) => g.ebene === 'phase' || g.ebene === 'pruefungsreife');

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col gap-4 px-5 pb-6 pt-3">
      <header className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[22px] font-extrabold leading-7 text-fg">{t('titel')}</h1>
          <p className="mt-1 text-[14px] text-fg-muted">{t('untertitel')}</p>
        </div>
        <ProgressRing
          value={data.fortschrittBeruf}
          size={58}
          label={t('gesamtLabel', { wert: data.fortschrittBeruf })}
        />
      </header>

      <section className="flex items-center justify-between gap-3 rounded-[16px] border border-border bg-surface p-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-primary">{t('lernpunkte')}</p>
          <p className="text-[22px] font-extrabold text-fg">{data.lernpunkte}</p>
        </div>
        <Link
          href={`/${locale}/campus/fortschritt/pruefungsreife`}
          className="touchable text-[13px] font-semibold text-primary"
        >
          {t('pruefungsreifeLink')} →
        </Link>
      </section>

      {data.empfehlung ? (
        <section className="rounded-[16px] border border-border bg-surface p-4">
          <p className="text-[11px] font-bold uppercase tracking-wide text-primary">{t('fortsetzen')}</p>
          <p className="mt-1 text-[15px] font-bold text-fg">{data.empfehlung.bezeichnung}</p>
          <p className="mt-1 text-[13px] text-fg-muted">
            {t(`empfehlungGrund.${data.empfehlung.grund}`, { offen: data.empfehlung.kernOffen })}
          </p>
          <Link
            href={`/${locale}/campus/lernen/thema/${data.empfehlung.themaId}`}
            className="touchable mt-3 flex min-h-11 items-center justify-center rounded-full bg-primary px-4 text-[14px] font-bold text-fg-onPrimary"
          >
            {t('fortsetzenCta')}
          </Link>
        </section>
      ) : null}

      <section className="flex flex-col gap-2">
        <h2 className="text-[11px] font-bold uppercase tracking-wide text-primary">{t('gates.phasen')}</h2>
        {phaseGates.length === 0 ? (
          <div className="rounded-[16px] border border-border bg-surface p-4">
            <p className="text-[13px] text-fg-muted">{t('keineDaten')}</p>
          </div>
        ) : (
          phaseGates.map((g) => <GateZeile key={g.id} gate={g} />)
        )}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-[11px] font-bold uppercase tracking-wide text-primary">
          {t('gates.fachgebiete')}
        </h2>
        {bereichGates.length === 0 ? (
          <div className="rounded-[16px] border border-border bg-surface p-4">
            <p className="text-[13px] text-fg-muted">{t('keineFachgebiete')}</p>
          </div>
        ) : (
          bereichGates.map((g) => <GateZeile key={g.id} gate={g} />)
        )}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-[11px] font-bold uppercase tracking-wide text-primary">{t('gates.topics')}</h2>
        {topicGates.length === 0 ? (
          <div className="rounded-[16px] border border-border bg-surface p-4">
            <p className="text-[13px] text-fg-muted">{t('keineThemen')}</p>
          </div>
        ) : (
          topicGates.map((g) => (
            <GateZeile key={g.id} gate={g} href={`/${locale}/campus/lernen/thema/${g.id}`} />
          ))
        )}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-[11px] font-bold uppercase tracking-wide text-primary">{t('abzeichen')}</h2>
        <AbzeichenListe items={data.achievements} />
      </section>
    </main>
  );
}
