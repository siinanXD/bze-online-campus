import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { createServerSupabase } from '@bze/db/server';
import { NACHWEIS_ART, type NachweisArt } from '@bze/core/nachweis';
import { ladeRahmenplanKatalog } from '../_lib/queries';
import { NachweisForm } from '../_components/nachweis-form';

function alsArt(wert: string | undefined): NachweisArt {
  return (NACHWEIS_ART as readonly string[]).includes(wert ?? '') ? (wert as NachweisArt) : 'woche';
}

function alsDatum(wert: string | undefined): string | null {
  return wert && /^\d{4}-\d{2}-\d{2}$/.test(wert) ? wert : null;
}

export default async function NeuerNachweisPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ art?: string; von?: string; bis?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
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

  const katalog = await ladeRahmenplanKatalog();

  return (
    <main className="mx-auto max-w-2xl space-y-4 p-4">
      <div className="pt-2">
        <Link
          href={`/${locale}/campus/berichtsheft`}
          className="touchable inline-flex min-h-12 items-center text-sm text-accent hover:underline"
        >
          ← {t('zurueck')}
        </Link>
        <h1 className="text-2xl font-extrabold">{t('neuTitel')}</h1>
      </div>

      <NachweisForm
        modus="neu"
        locale={locale}
        rahmenplanKatalog={katalog}
        initial={{
          art: alsArt(sp.art),
          zeitraumVon: alsDatum(sp.von),
          zeitraumBis: alsDatum(sp.bis),
          ausbildungsjahr: null,
          inhalt: { taetigkeiten: '', unterweisungen: '', berufsschulthemen: '' },
          rahmenplanPositionen: [],
          kiFormuliert: false,
        }}
      />
    </main>
  );
}
