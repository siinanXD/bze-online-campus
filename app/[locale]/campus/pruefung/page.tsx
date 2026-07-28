import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { createServerSupabase } from '@bze/db/server';
import { Card, Button } from '@bze/ui';

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
    <main className="mx-auto max-w-2xl space-y-4 p-4">
      <h1 className="pt-2 text-2xl font-extrabold">{t('titel')}</h1>
      {!pruefungen || pruefungen.length === 0 ? (
        <Card><p className="text-muted">{t('keine')}</p></Card>
      ) : (
        pruefungen.map((p) => (
          <Card key={p.id} className="flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold">{p.titel ?? `KW ${p.kalenderwoche}/${p.jahr}`}</p>
              <p className="text-sm text-muted">{t('dauer', { min: p.dauer_minuten })}</p>
            </div>
            <Link href={`/${locale}/campus/pruefung/${p.id}`}>
              <Button>{t('starten')}</Button>
            </Link>
          </Card>
        ))
      )}
      <p className="text-xs text-muted">{t('hinweisFreitext')}</p>
    </main>
  );
}
