import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { createServerSupabase } from '@bze/db/server';

/**
 * Prüfungsliste im Figma-Mobile-Look.
 */
export default async function PruefungIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('pruefung');
  const supabase = await createServerSupabase();
  const { data: pruefungen } = await supabase
    .from('pruefungen')
    .select('id,titel,kalenderwoche,jahr,dauer_minuten,status,freigabe_ab,freigabe_bis')
    .order('jahr', { ascending: false })
    .order('kalenderwoche', { ascending: false });

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col gap-4 px-5 pb-6 pt-3">
      <header>
        <h1 className="text-[22px] font-extrabold leading-7 text-fg">{t('titel')}</h1>
      </header>

      {!pruefungen || pruefungen.length === 0 ? (
        <div className="rounded-[16px] border border-border bg-surface p-4">
          <p className="text-[14px] text-fg-muted">{t('keine')}</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {pruefungen.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between gap-3 rounded-[16px] border border-border bg-surface p-4"
            >
              <div className="min-w-0">
                <p className="truncate text-[15px] font-bold text-fg">
                  {p.titel ?? `KW ${p.kalenderwoche}/${p.jahr}`}
                </p>
                <p className="text-[13px] text-fg-muted">{t('dauer', { min: p.dauer_minuten })}</p>
              </div>
              <Link
                href={`/${locale}/campus/pruefung/${p.id}`}
                className="touchable shrink-0 rounded-full bg-primary px-4 py-2.5 text-[13px] font-bold text-fg-onPrimary"
              >
                {t('starten')}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <p className="text-[12px] text-fg-muted">{t('hinweisFreitext')}</p>
    </main>
  );
}
