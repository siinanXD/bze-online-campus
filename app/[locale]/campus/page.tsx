import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { createServerSupabase } from '@bze/db/server';
import { Card, Button, Chip } from '@bze/ui';
import { Greeting } from '@/components/shell';

export default async function CampusStart({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('campus');
  const supabase = await createServerSupabase();

  // Vorname für Begrüßung
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profil } = user
    ? await supabase.from('profiles').select('vorname').eq('id', user.id).maybeSingle()
    : { data: null };

  // Themen mit freigegebenen Fragen (praktisch übbar)
  const { data: fragen } = await supabase
    .from('fragen')
    .select('thema_id, themen!inner(id,bezeichnung)')
    .eq('status', 'freigegeben');
  const themenMap = new Map<string, string>();
  for (const f of (fragen ?? []) as any[]) {
    if (f.themen) themenMap.set(f.themen.id, f.themen.bezeichnung);
  }
  const themen = [...themenMap.entries()];

  return (
    <main className="mx-auto max-w-2xl space-y-4 p-4">
      <Greeting name={profil?.vorname ?? undefined} />

      <div className="grid grid-cols-2 gap-3">
        <Link href={`/${locale}/campus/lernen`} className="block">
          <Card className="h-full"><p className="font-semibold">{t('lernen')}</p><p className="text-sm text-muted">{t('lernenInfo')}</p></Card>
        </Link>
        <Link href={`/${locale}/campus/pruefung`} className="block">
          <Card className="h-full"><p className="font-semibold">{t('pruefung')}</p><p className="text-sm text-muted">{t('pruefungInfo')}</p></Card>
        </Link>
      </div>

      <Card>
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-accent">{t('themen')}</h2>
        {themen.length === 0 ? (
          <p className="text-sm text-muted">{t('keineThemen')}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {themen.map(([id, name]) => (
              <Link key={id} href={`/${locale}/campus/lernen/thema/${id}`}>
                <Chip>{name}</Chip>
              </Link>
            ))}
          </div>
        )}
      </Card>

      <Card className="flex items-center justify-between">
        <div>
          <p className="font-semibold">{t('topics')}</p>
          <p className="text-sm text-muted">{t('topicsInfo')}</p>
        </div>
        {themen[0] && (
          <Link href={`/${locale}/campus/topic/${themen[0][0]}`}><Button variant="soft">{t('oeffnen')}</Button></Link>
        )}
      </Card>
    </main>
  );
}
