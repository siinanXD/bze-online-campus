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
      <main className="mx-auto max-w-md px-5 py-6">
        <p className="text-[14px] text-fg-muted">{t('nichtAngemeldet')}</p>
      </main>
    );
  }

  const katalog = await ladeRahmenplanKatalog();

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col gap-4 px-5 pb-6 pt-3">
      <div>
        <Link
          href={`/${locale}/campus/berichtsheft`}
          className="touchable inline-flex min-h-10 items-center text-[14px] font-semibold text-primary"
        >
          ← {t('zurueck')}
        </Link>
        <h1 className="mt-1 text-[22px] font-extrabold text-fg">{t('neuTitel')}</h1>
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
