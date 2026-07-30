import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { createServerSupabase } from '@bze/db/server';
import { Card, ProgressRing } from '@bze/ui';
import { ladeFortschrittSeite } from './_lib/queries';
import { GateZeile } from './_components/gate-zeile';
import { AbzeichenListe } from './_components/abzeichen-liste';

export default async function FortschrittPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('fortschritt');
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="mx-auto max-w-2xl p-4">
        <p className="text-fg-muted">{t('nichtAngemeldet')}</p>
      </main>
    );
  }

  const data = await ladeFortschrittSeite(user.id);
  const topicGates = data.gates.filter((g) => g.ebene === 'topic');
  const bereichGates = data.gates.filter((g) => g.ebene === 'fachgebiet');
  const phaseGates = data.gates.filter((g) => g.ebene === 'phase' || g.ebene === 'pruefungsreife');

  return (
    <main className="mx-auto max-w-2xl space-y-4 p-4">
      <header className="flex items-center justify-between gap-3 pt-2">
        <div>
          <h1 className="text-2xl font-extrabold">{t('titel')}</h1>
          <p className="text-sm text-fg-muted">{t('untertitel')}</p>
        </div>
        <ProgressRing
          value={data.fortschrittBeruf}
          size={64}
          label={t('gesamtLabel', { wert: data.fortschrittBeruf })}
        />
      </header>

      <Card className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-primary">{t('lernpunkte')}</p>
          <p className="text-2xl font-extrabold">{data.lernpunkte}</p>
        </div>
        <Link
          href={`/${locale}/campus/fortschritt/pruefungsreife`}
          className="touchable text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          {t('pruefungsreifeLink')}
        </Link>
      </Card>

      {data.empfehlung && (
        <Card>
          <p className="mb-1 text-sm font-bold uppercase tracking-wide text-primary">{t('fortsetzen')}</p>
          <p className="font-semibold">{data.empfehlung.bezeichnung}</p>
          <p className="text-sm text-fg-muted">
            {t(`empfehlungGrund.${data.empfehlung.grund}`, { offen: data.empfehlung.kernOffen })}
          </p>
          <Link
            href={`/${locale}/campus/lernen/thema/${data.empfehlung.themaId}`}
            className="touchable mt-3 inline-flex min-h-12 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-white"
          >
            {t('fortsetzenCta')}
          </Link>
        </Card>
      )}

      <section className="space-y-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-primary">{t('gates.phasen')}</h2>
        {phaseGates.length === 0 ? (
          <Card><p className="text-sm text-fg-muted">{t('keineDaten')}</p></Card>
        ) : (
          phaseGates.map((g) => <GateZeile key={g.id} gate={g} />)
        )}
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-primary">{t('gates.fachgebiete')}</h2>
        {bereichGates.length === 0 ? (
          <Card><p className="text-sm text-fg-muted">{t('keineFachgebiete')}</p></Card>
        ) : (
          bereichGates.map((g) => <GateZeile key={g.id} gate={g} />)
        )}
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-primary">{t('gates.topics')}</h2>
        {topicGates.length === 0 ? (
          <Card><p className="text-sm text-fg-muted">{t('keineThemen')}</p></Card>
        ) : (
          topicGates.map((g) => (
            <GateZeile
              key={g.id}
              gate={g}
              href={`/${locale}/campus/lernen/thema/${g.id}`}
            />
          ))
        )}
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-primary">{t('abzeichen')}</h2>
        <AbzeichenListe items={data.achievements} />
      </section>
    </main>
  );
}
